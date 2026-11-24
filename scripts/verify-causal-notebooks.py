"""Run both published decoder notebooks in fresh CPU Jupyter kernels.

Requires Python 3.12+, torch, nbclient, nbformat and ipykernel in this interpreter.
No downloads, additional training runs, saved notebook outputs or global kernelspecs.
Each notebook and its generated artifacts live in a separate temporary directory.
"""
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


def execute_notebook(name, source, torch_version):
    notebook = nbformat.read(LABS / name, as_version=4)
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


def main():
    require(sys.version_info >= (3, 12), "Use Python 3.12 or newer")
    torch_version = version("torch")
    print(f"Python {platform.python_version()} | torch {torch_version} | {platform.system()} | CPU", flush=True)
    source = (LABS / "causal_lab.py").read_bytes()
    for name in NOTEBOOKS:
        execute_notebook(name, source, torch_version)
    print("Both published notebooks passed in separate fresh kernels; temporary artifacts removed.")


if __name__ == "__main__":
    main()
