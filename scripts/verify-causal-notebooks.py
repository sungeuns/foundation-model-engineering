"""Run both published decoder notebooks in fresh CPU Jupyter kernels.

Requires Python 3.12+, torch, nbclient, nbformat and ipykernel in this interpreter.
Use --save-executed DIR to export the verified runs for readers without a kernel.
Each notebook and its generated artifacts live in a separate temporary directory.
"""
import argparse
import ast
import hashlib
from importlib.metadata import version
import json
import math
from pathlib import Path
import platform
import sys
import tempfile
from zipfile import ZipFile

import nbformat
from nbclient import NotebookClient
from jupyter_client import AsyncKernelManager
from jupyter_client.kernelspec import KernelSpecManager


ROOT = Path(__file__).resolve().parents[1]
LABS = ROOT / "public" / "labs"
NOTEBOOKS = ("tiny-decoder-lab.ipynb", "tiny-decoder-lab-ko.ipynb")
PACKET_FILES = {
    "causal_lab.py", "manifest.json", "checkpoint.pt", "checkpoint.sha256",
    "trace.json", "result.json", "notebook-observations.json",
}


def require(condition, message):
    if not condition:
        raise AssertionError(message)


def finite(value):
    return type(value) in (int, float) and math.isfinite(value)


def verify_packet(workdir, source, torch_version):
    archives = list(workdir.glob("fme-tiny-decoder-*/result-packet.zip"))
    require(len(archives) == 1, "Expected exactly one fresh result packet")
    with ZipFile(archives[0]) as packet:
        names = packet.namelist()
        require(set(names) == {f"outputs/{name}" for name in PACKET_FILES}
                and len(names) == len(PACKET_FILES), "ZIP must contain exactly the seven result files")
        require(packet.read("outputs/causal_lab.py") == source, "Archived source drift")
        checksum = hashlib.sha256(packet.read("outputs/checkpoint.pt")).hexdigest()
        require(packet.read("outputs/checkpoint.sha256").decode("ascii").strip() == checksum,
                "Checkpoint completion marker mismatch")
        result = json.loads(packet.read("outputs/result.json"))
        observed = json.loads(packet.read("outputs/notebook-observations.json"))
        trace = json.loads(packet.read("outputs/trace.json"))

    require(result["causal_invariance"] is True and result["exact_resume"] is True,
            "Causal invariance or exact replay did not pass")
    require(result["nonfinite_count"] == 0 and result["mfu"] is None,
            "Invalid nonfinite count or invented MFU")
    config = result["config"]
    require(config["device"] == "cpu" and config["dtype"] == "float32", "Unexpected device/dtype")
    require(config["torch_version"] == torch_version, "Kernel used a different torch environment")
    require(config["code_hash"] == hashlib.sha256(source).hexdigest(), "Result source hash mismatch")
    for key in ("initial_validation_nats", "validation_nats", "test_nats", "self_only_test_nats"):
        require(finite(result[key]) and result[key] >= 0, f"Invalid {key}")
    for key in ("greedy_test_token_accuracy", "greedy_test_sequence_accuracy"):
        require(finite(result[key]) and 0 <= result[key] <= 1, f"Invalid {key}")
    require([row["step"] for row in trace] == list(range(1, config["steps"] + 1)),
            "Incomplete training trace")
    delta = observed["unmasked_earlier_logit_max_change"]
    require(finite(delta) and delta > 1e-6, "Broken-mask diagnostic failed to expose future leakage")
    require(observed["corruption_rejected"] is True, "Corrupted checkpoint was not rejected")
    require(finite(observed["full_experiment_seconds"]) and observed["full_experiment_seconds"] > 0,
            "Invalid experiment duration")
    return result


def execute_notebook(path, source, torch_version):
    name = path.name
    input_bytes = path.read_bytes()
    notebook = nbformat.reads(input_bytes.decode("utf-8"), as_version=4)
    nbformat.validate(notebook)
    cells = [cell for cell in notebook.cells if cell.cell_type == "code"]
    require(notebook.metadata.fme.source_sha256 == hashlib.sha256(source).hexdigest(),
            f"{name}: stale source metadata")

    with tempfile.TemporaryDirectory(prefix="fme-notebook-smoke-") as temporary:
        workdir = Path(temporary)
        kernel_dir = workdir / "kernels" / "fme-causal-smoke"
        kernel_dir.mkdir(parents=True)
        spec = {
            "argv": [sys.executable, "-m", "ipykernel_launcher", "-f", "{connection_file}",
                     "--HistoryManager.hist_file=:memory:"],
            "display_name": "FME temporary CPU verification", "language": "python",
            "env": {"IPYTHONDIR": str(workdir / "ipython"), "PYTHONOPTIMIZE": "0"},
        }
        (kernel_dir / "kernel.json").write_text(json.dumps(spec), encoding="utf-8")
        manager = AsyncKernelManager(
            kernel_name="fme-causal-smoke", connection_file=str(workdir / "kernel.json"),
            kernel_spec_manager=KernelSpecManager(kernel_dirs=[str(kernel_dir.parent)]),
        )
        client = NotebookClient(
            notebook, km=manager, timeout=300, startup_timeout=60,
            allow_errors=False, force_raise_errors=True, record_timing=False,
            resources={"metadata": {"path": str(workdir)}},
        )
        # Explicit cleanup also applies to this supplied (rather than owned) manager.
        client.execute(cleanup_kc=True)
        require([cell.execution_count for cell in cells] == list(range(1, len(cells) + 1)),
                f"{name}: a code cell was skipped")
        environment_cell = next(cell for cell in cells if cell.id == "environment")
        environment = ast.literal_eval("".join(
            item.text for item in environment_cell.outputs
            if item.output_type == "stream" and item.name == "stdout"
        ).strip())
        require(environment == {"python": platform.python_version(), "torch": torch_version, "device": "cpu"},
                f"{name}: unexpected kernel environment")
        result = verify_packet(workdir, source, torch_version)
        print(f"PASS {name}: {len(cells)} cells; causal/replay/leakage/corruption/ZIP checks; "
              f"test={result['test_nats']:.6f}, self-only={result['self_only_test_nats']:.6f} nats", flush=True)
        return notebook, {**environment, "input_notebook_sha256": hashlib.sha256(input_bytes).hexdigest()}


def save_worked_example(directory, notebook, recorded_run):
    locale = notebook.metadata.fme.locale
    require(locale in ("en", "ko"), "Expected an English or Korean notebook")
    version_note = f"Python {recorded_run['python']} · PyTorch {recorded_run['torch']} · CPU"
    base = "https://sungeuns.github.io/foundation-model-engineering/"
    if locale == "en":
        note = ("Can the decoder still copy a repeating pattern when it can only see the current symbol? "
                "[Compare the saved test losses](#cell-id=compare-results). "
                "Look for `test_nats` (earlier symbols visible) and `self_only_test_nats` (current symbol only).\n\n"
                f"The code cells ran in order in one kernel ({version_note}). The last cell shows the "
                "temporary path used for this run.\n\n"
                f"[Run the experiment yourself]({base}chapter-7/tiny-decoder-lab/) · "
                "[Foundation Model Engineering on GitHub](https://github.com/sungeuns/foundation-model-engineering)")
        source_note = ("## Read the lab source\n\n"
                       "The next cell contains the complete `public/labs/causal_lab.py` used in this run. "
                       "nbviewer displays the source in full. The setup cell after it verifies the SHA-256 before import.")
    else:
        note = ("현재 기호만 보게 해도 디코더가 반복 패턴을 복사할 수 있을까요? "
                "[저장된 테스트 손실을 비교해 보세요](#cell-id=compare-results). "
                "`test_nats`는 앞 기호까지 볼 수 있을 때, `self_only_test_nats`는 현재 기호만 볼 때의 손실입니다.\n\n"
                f"한 커널에서 코드 셀을 차례로 실행했습니다({version_note}). 마지막 셀에 표시된 경로는 "
                "이 실행에 사용한 임시 폴더입니다.\n\n"
                f"[직접 실험하기]({base}ko/chapter-7/tiny-decoder-lab/) · "
                "[Foundation Model Engineering 저장소](https://github.com/sungeuns/foundation-model-engineering)")
        source_note = ("## 실습 소스 읽기\n\n"
                       "다음 셀에는 이번 실행에 사용한 `public/labs/causal_lab.py` 전체가 들어 있습니다. "
                       "nbviewer에서는 소스가 처음부터 끝까지 표시됩니다. 이어지는 준비 셀은 SHA-256으로 소스를 확인한 뒤 불러옵니다.")
    # Keep the title. Run-all instructions belong to the executable starter.
    start = next(cell for cell in notebook.cells if cell.id == "start")
    start.source = start.source.splitlines()[0]
    next(cell for cell in notebook.cells if cell.id == "source-note").source = source_note
    notebook.cells.insert(1, nbformat.v4.new_markdown_cell(note, id="recorded-run"))
    notebook.metadata.fme.recorded_run = recorded_run
    nbformat.validate(notebook)
    destination = directory / f"tiny-decoder-worked-{locale}.ipynb"
    nbformat.write(notebook, destination)
    print(f"Saved {destination}")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--notebook-dir", type=Path, default=LABS,
                        help="Directory containing both starter notebooks and their matching causal_lab.py")
    parser.add_argument("--save-executed", type=Path, metavar="DIR",
                        help="Write separate worked notebooks after both CPU runs pass")
    args = parser.parse_args()
    require(sys.version_info >= (3, 12), "Use Python 3.12 or newer")
    torch_version = version("torch")
    print(f"Python {platform.python_version()} | torch {torch_version} | {platform.system()} | CPU", flush=True)
    source = (args.notebook_dir / "causal_lab.py").read_bytes()
    completed = []
    for name in NOTEBOOKS:
        path = args.notebook_dir / name
        completed.append(execute_notebook(path, source, torch_version))
    if args.save_executed:
        args.save_executed.mkdir(parents=True, exist_ok=True)
        for notebook, recorded_run in completed:
            save_worked_example(args.save_executed, notebook, recorded_run)
    print("Both notebooks passed in separate fresh CPU kernels.")


if __name__ == "__main__":
    main()
