"""Run the public, self-contained expert dispatch lab exactly as a reader would."""
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile


if __name__ == "__main__":
    source = Path(__file__).resolve().parents[1] / "public/labs/expert_dispatch.py"
    with tempfile.TemporaryDirectory(prefix="fme-ep-smoke-") as directory:
        script = Path(shutil.copy2(source, directory))
        result = subprocess.run(
            [sys.executable, "-m", "torch.distributed.run", "--standalone",
             "--nproc-per-node=2", script.name],
            cwd=directory, check=True, stdout=subprocess.PIPE, text=True, timeout=90,
        )
    print(result.stdout, end="")
    for line in (
        "rank 0: send=[1, 3] receive=[1, 1]",
        "rank 1: send=[1, 1] receive=[3, 1]",
        "source tokens=[1, 2, 3, 4] restored values=[2001, 2, 3003, 2004]",
        "source tokens=[101, 102] restored values=[1101, 3102]",
        "rank 0: send=[0, 0] receive=[0, 1]",
        "rank 1: send=[2, 0] receive=[0, 0]",
    ):
        assert line in result.stdout, f"Missing lab trace: {line}"
