# Self-contained tiny-decoder notebooks — 2026-11-18

## Scope

Added `public/labs/tiny-decoder-lab.ipynb` and `public/labs/tiny-decoder-lab-ko.ipynb`. They present the existing CPU lab through prediction, execution, validity checks, ablation/free-running comparison, deliberate future leakage, a corrupted checkpoint copy, and a downloadable result packet. The original `causal_lab.py` and recorded seed-7 packet were not modified.

English prose was written first, then equivalent Korean. Both notebooks have 20 cells, including the same 10 executable cells. Python code, settings, sources, numerical checks, limitations, three explanation questions and references match. Source code is fully embedded with a standard source-hidden metadata hint; clients can display or collapse it differently. No API keys, model weights, external dataset, runtime package installation or network fetch is used by notebook execution.

This is a synthetic CPU teaching experiment, not evidence of language-model quality or a hosted-service performance promise. Python 3.12+ and installed PyTorch are required. The actual runtime version is printed and stored; there is no requirement to replace another compatible PyTorch version with 2.15, and cross-version or cross-hardware trajectory equality is not promised.

## Source integrity and recovery

`scripts/causal-notebooks.mjs` generates both artifacts from the canonical lab and bilingual prose. Run `node scripts/causal-notebooks.mjs --check` to reject a stale generated artifact. The exact source SHA-256 is checked before import and bound by the original lab's checkpoint configuration. Each run uses a new local directory and preserves previous results.

A fresh-context reviewer found that text-mode source writes could translate LF to CRLF on Windows, invalidating the original byte hash after training. The loader now writes UTF-8 bytes and checks the on-disk hash **before** import. Both notebooks were reexecuted after this change. Native Windows execution was not tested; the source-byte contract is explicit and platform-independent.

`scripts/causal-notebooks.test.mjs` checks source equivalence and SHA identity, catches a deliberately altered embedded-source fixture, requires identical EN/KO executable cells, rejects saved outputs and unexpected control characters, and checks that code contains no network/package-install calls. An unresolved prose placeholder was detected during review, removed, and covered by the control-character check.

The deliberate mask diagnostic uses a separate untrained model and leaves the original run untouched. Corruption is applied to a separate checkpoint copy, whose load must fail; the original checkpoint is then loaded successfully. The result ZIP includes canonical source, manifest, checkpoint and marker, trace, results and notebook observations. The corrupted copy is excluded. It does not claim remote replication, distributed recovery or authentication of an untrusted checkpoint.

## Actual validation

- `node scripts/causal-notebooks.mjs --check`: both generated artifacts match.
- `node --test scripts/causal-notebooks.test.mjs`: two contract tests passed.
- `nbformat.validate`: both notebooks conform to notebook format 4.5.
- Executed every cell of each final notebook in a separate real Jupyter kernel using Python **3.12.14**, PyTorch **2.15.0+cpu**, nbformat **5.11.1**, nbclient **0.11.0**, and ipykernel **7.4.0**. Both completed without a cell error. Environment-only tooling was installed into the existing temporary venv; no repository dependencies changed.
- Both observed runs yielded test loss **0.0508110747**, self-only test loss **2.7041945457** nats per target, greedy token accuracy **0.9807692170**, and sequence accuracy **0.9375**. Causal invariance and exact replay passed. The intentionally unmasked diagnostic changed earlier logits by a maximum **0.1990128458**; the damaged checkpoint copy was rejected. These reproduce this synthetic task, not model benchmark results.
- Kernel execution was about 4.4 seconds per notebook on this local environment, including kernel/client overhead. This observation is not a promised notebook/Colab runtime. The notebook separately reports full experiment time and preserves the original lab's narrower training/replay timing.
- Exported the executed notebooks to HTML and inspected English/Korean at 390 and 1440 pixels in an offline Chromium. Four renders had no document overflow or unresolved placeholder. Code cells scroll within their own boxes at narrow widths. These are static notebook previews, not a claim that a logged-in Colab session was tested.
- `git diff --check` passed. The parent owns book-page integration, full site tests/build, source-control publication and hosted-link checks.

The torch-only execution succeeds despite a NumPy-not-installed warning in the temporary environment. The warning and measured outputs were not suppressed or stored in the distributed notebooks; distributed notebooks have cleared outputs.

Primary documentation checked: [PyTorch reproducibility](https://docs.pytorch.org/docs/2.15/notes/randomness.html) and [serialization](https://docs.pytorch.org/docs/2.15/notes/serialization.html). Raw scoped measurements, artifact hashes and archive inventories are in `growth-2026-11-18-notebook-execution.json`.

## Inspected hashes

| Artifact | SHA-256 |
|---|---|
| Canonical lab, unchanged | `d3488b924a81a2cc50a381583903e8756c7b76846d1221cabd63e490bba1ba0c` |
| English notebook | `ee233f9b70dfd8bfddd238aacf2bf1a4bb0d9d3b59a865f327b85d91b6da345e` |
| Korean notebook | `ec848e94a019964fd0911f23e4e82e6065c627e2e518099f19d76648c840f230` |
| Generator/check command | `3b11cec446a578f77086992659d85544bc34b1933cc52b35d97c268611b32da3` |
| Source/parity contract tests | `315125bf922f0a6d8dd3ac6bcd4c905dbd1ffee0bd1a7108a9dbce580b5bde9e` |
