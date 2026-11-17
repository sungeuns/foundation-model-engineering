# SSD recurrence and matrix figure — 2026-11-18

## Inspected problem and scope

Inspected both complete 20.2 `mamba-and-s6.mdx` pages, their existing `SSMDualityVisualizer`, adjacent 20.1/20.3 introductions, the canonical navigation entries, and the active `ssm_duality_matrix.png` raster. The old raster drew backward-time state arrows, displayed an unqualified constant-decay formula, and reversed its output-time axis relative to the lower-triangular matrix. It appeared only in English. Its active reference has been removed; the old asset remains on disk.

Added an original localized HTML/CSS figure, `SSDRecurrenceExample.astro`, with a forward recurrence and an explicit lower-triangular matrix. Both languages use the same numbers, labels, scope and source caption. This is authored mathematical data, not a model measurement or a generated bitmap. The existing three-mode interaction is unchanged.

The adjacent explanation now distinguishes the restricted SSD connection from ordinary softmax attention, defines continuous-time `A = αI` separately from discrete `a_t`, and states that the mask does not include the full input/readout factors. The example uses one scalar state, unit input/output coefficients, zero initial state, and no direct skip term. It explicitly excludes a complete Mamba-2 block. A fifth reasoning quiz asks why the two unequal transitions multiply to 0.125.

During the complete pair inspection, corrected two preexisting comments around the educational code: it does apply a causal mask within each chunk, while variable-length padding/packing semantics are omitted; explicit quadratic-mask materialization is a property of this teaching implementation, not a universal claim about production Triton kernels. Executable code semantics are unchanged.

## Primary-source checks

- [SSD paper, §2.4 and §3.2.2, equations 6–7](https://arxiv.org/html/2405.21060v1#S3.SS2.SSS2): scalar-identity transitions, causal products and recurrent/matrix equivalence. The teaching example uses one-based indexing and explicitly supplies `h₀ = 0`.
- [Mamba-1 paper](https://arxiv.org/abs/2312.00752): reference resolves; input-dependent selection and hardware-aware recurrent computation remain correctly scoped in the existing section.
- [Mamba-2 paper](https://arxiv.org/abs/2405.21060): reference resolves and its abstract reports the 2–8× **core-layer** result, matching the existing qualification.
- [Mamba-3 paper](https://arxiv.org/html/2603.15569v1): rechecked abstract, §3.2, §4.2/Table 5, and §4.3. The 1.5B gain is +0.6 points for SISO plus +1.2 for MIMO over Gated DeltaNet; the lesson now explicitly names the MIMO variant for the total +1.8 claim. The separate half-state-size comparison and limitations remain. The real-nonnegative-transition and parity/modular-arithmetic discussion matches the cited paper. Its arXiv record identifies ICLR 2026 and the March 16, 2026 version. Updated the scoped source-check date to 2026-11-18. No new weights, availability, or undisclosed architecture claim was introduced.

## Verification

- Evaluated the displayed arithmetic with Python `fractions.Fraction`: `x = [2, 4, 1]`, `a = [3/4, 1/2, 1/4]`; matrix rows `[[1,0,0], [1/2,1,0], [1/8,1/4,1]]`; both paths return `[2,5,9/4]`. Changing only the third input leaves the first two outputs unchanged. A constant `1/2` decay would wrongly give `1/4` in the bottom-left entry.
- Executed the existing English PyTorch block on Python 3.12.14 / PyTorch 2.15.0+cpu with batch 2, length 5, width 4, state size 2, chunk size 3. Shape `[2,5,4]`; exact agreement with an independently written scalar-time recurrence that resets at each chunk; all input/parameter gradients finite. A continuous-state recurrence differs after the first chunk (maximum output difference 0.088185519), confirming the stated omission. The temporary torch-only environment warns that NumPy is absent; this execution succeeds without it.
- Compared executable EN/KO Python ASTs after removing localized docstrings: equivalent.
- Browser checks on an isolated Astro server at port 4326: EN/KO × 390/1440 pixels, all four pass. Verified exact nine matrix values, three forward steps, one-column/three-column responsive layout, localized content, source anchor, removal of the old image, no document overflow, no KaTeX errors, and no page errors. Exercised all three unchanged mode buttons by keyboard in each view (12 selections), preserving `aria-pressed` and expected step counts.
- Inspected all four figure screenshots: `/tmp/fme-ssd-en-390.png`, `/tmp/fme-ssd-en-1440.png`, `/tmp/fme-ssd-ko-390.png`, `/tmp/fme-ssd-ko-1440.png`. Fixed development toolbar/skip-link overlays were suppressed only during element screenshots; production page styles were not changed to hide controls. Raw browser observations: `/tmp/fme-ssd-figure-browser.json`.
- `git diff --check` passed for scoped files. The parent performs the canonical ledger update, repository build/tests, final release review and deployment verification.

## Inspected artifact hashes

| Artifact | SHA-256 |
| --- | --- |
| English 20.2 | `a89134b1f0ca60b397d0fd46c4bcfa0a1ce045cd294ff4895af664f745a59255` |
| Korean 20.2 | `f4805c489887aa69e2c78a4c55b8d10219d9a37aecdcf070a4b5f7d1b10ec988` |
| `SSDRecurrenceExample.astro` | `2b2eb0238edfc38d9e83ef231324256fa85ce68b8277322e039a7da09d1adf75` |
| `ssd-recurrence-example.css` | `5ce48a9df971ff942fe58b0ff8634e1e71b9cc764e784f7c1f3915821528d138` |
