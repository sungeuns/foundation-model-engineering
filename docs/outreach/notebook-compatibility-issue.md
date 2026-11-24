# Verify the tiny-decoder notebook on Colab CPU and Windows Jupyter

## Current status — 2026-11-25

This is an unpublished issue draft. The original 2026-11-18 text is preserved below; its unchecked Windows item reflects the evidence available on that date, not the current status. No external issue was posted during this update.

- [x] Local Linux CPU: both current notebooks passed all ten code cells in separate fresh Jupyter kernels with Python 3.12.14 and PyTorch 2.15.0+cpu.
- [x] Native Windows CPU: [GitHub Actions run 45434214223](https://github.com/sungeuns/foundation-model-engineering/actions/runs/45434214223) passed on the `windows-2025` runner with Python 3.12.10 and PyTorch 2.15.0+cpu, at commit `b7c174368b1d755eeb7980f1550cd5b16228e071`. Both notebooks completed all ten code cells in separate fresh Jupyter kernels. Source/checkpoint integrity, causal invariance, exact replay, broken-mask leakage detection, corrupted-checkpoint rejection, and the exact seven-file result ZIP passed. This verifies native kernel execution in CI; it does not record an interactive desktop Jupyter session.
- [ ] Hosted Colab CPU: still unverified. Opening a notebook link or rendering its HTML does not establish execution in a hosted runtime.

For the remaining Colab check, use the current [English notebook](https://colab.research.google.com/github/sungeuns/foundation-model-engineering/blob/main/public/labs/tiny-decoder-lab.ipynb) or [Korean notebook](https://colab.research.google.com/github/sungeuns/foundation-model-engineering/blob/main/public/labs/tiny-decoder-lab-ko.ipynb) and record the tested commit/source hash. The pinned links below preserve the original draft and are not the updated verification target. The original reporting questions remain useful; no claim of matching loss values across platforms is required.

## Original issue draft — 2026-11-18

Status: not published. The attempt to create this issue in the project repository on 2026-11-18 returned GitHub API 403, `Resource not accessible by integration`. This file preserves the attempted request body. No issue number or public thread exists.

The English and Korean notebooks completed all ten code cells in local Linux/Jupyter with Python 3.12.14 and PyTorch 2.15.0+cpu. **Hosted Colab and native Windows execution have not yet been verified.** This issue tracks those two concrete gaps.

- [ ] Colab, CPU runtime
- [ ] Windows, local Jupyter, CPU PyTorch

Use the original settings in the notebook at commit `dee03dca16228c6a0256f54bb69b22f19bb92c35`:

- [English notebook](https://github.com/sungeuns/foundation-model-engineering/blob/dee03dca16228c6a0256f54bb69b22f19bb92c35/public/labs/tiny-decoder-lab.ipynb) · [Open in Colab](https://colab.research.google.com/github/sungeuns/foundation-model-engineering/blob/dee03dca16228c6a0256f54bb69b22f19bb92c35/public/labs/tiny-decoder-lab.ipynb)
- [한국어 노트북](https://github.com/sungeuns/foundation-model-engineering/blob/dee03dca16228c6a0256f54bb69b22f19bb92c35/public/labs/tiny-decoder-lab-ko.ipynb) · [Colab에서 열기](https://colab.research.google.com/github/sungeuns/foundation-model-engineering/blob/dee03dca16228c6a0256f54bb69b22f19bb92c35/public/labs/tiny-decoder-lab-ko.ipynb)

Python 3.12+ and installed CPU PyTorch are required. Colab requires Google sign-in. No model download or API key is needed. The notebook states its dependencies and limitations; [local execution evidence](https://github.com/sungeuns/foundation-model-engineering/blob/dee03dca16228c6a0256f54bb69b22f19bb92c35/docs/growth-2026-11-18-notebook-execution.json) records the verified environment.

Please comment with:

1. Notebook language and commit/source hash.
2. OS, Python/PyTorch versions, and Colab or local Jupyter.
3. Whether all cells completed; otherwise, the first failing cell and a sanitized traceback.
4. Causal-invariance, exact-replay, nonfinite-count and corrupted-checkpoint rejection results.
5. Whether the exported result packet was created and its intact checkpoint restored successfully.

The embedded canonical source hash is `d3488b924a81a2cc50a381583903e8756c7b76846d1221cabd63e490bba1ba0c`. Differences in loss or accuracy across runtimes are observations, not automatic failures. Do not change settings to match recorded seed-7 numbers. This is a synthetic copying exercise, not a language-model benchmark.

Each checkbox needs a reproducible completed run with the validity checks passing. A failed run is useful evidence too; leave its environment unchecked until a fix is verified. English or Korean reports are welcome. Omit credentials, private data and identifying local paths. Text excerpts are enough; uploading checkpoints is unnecessary.

**한국어 안내:** Colab CPU와 Windows Jupyter 실행 여부를 확인하는 이슈입니다. 원본 설정으로 실행하고, 노트북 언어·소스 해시·환경·첫 오류 또는 검사 결과·결과 묶음 생성 여부를 알려주세요. 환경별 수치 차이를 곧바로 실패로 판단하지 않습니다. 각 환경의 검증이 끝난 뒤 체크 표시합니다. 개인정보나 인증 정보는 제외해주세요.

Prepared with AI assistance from the checked-in lab and execution record.
