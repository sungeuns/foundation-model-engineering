# MTP training diagram correction — 2026-11-18

Scope: section 20.5, English/Korean, plus one static Astro component and its chapter-local CSS. This is a focused visual/mechanism correction, not a new whole-book inspection. The existing inference cost interaction and Python implementation were not changed.

## Inspected evidence and problem

The active `src/assets/images/chapter-20/mtp_architecture_comparison.png` showed DeepSeek-V3 as successive shared main-decoder layers emitting future tokens, with sampled-output feedback arrows. It omitted shifted ground-truth embeddings and the distinction between shared Emb/OutHead and depth-specific auxiliary projections/blocks. Its Meta panel also mixed a training architecture with an autoregressive feedback loop. Both language pages used this image; only Korean had a generation caption.

Primary sources checked on 2026-11-18:

- Gloeckle et al., [Better & Faster Large Language Models via Multi-token Prediction](https://arxiv.org/html/2404.19737v1), Figure 1 and §2. Inspected the original figure on PDF page 1. The architecture uses a shared trunk, offset-specific Transformer heads and shared unembedding. The memory-efficient training schedule evaluates heads sequentially; independent branches do not imply concurrent execution.
- DeepSeek-AI, [DeepSeek-V3 Technical Report](https://arxiv.org/html/2412.19437v2#S2.SS2), Figure 3 and equations 21–25. Inspected the original figure on PDF page 10. Auxiliary depth k combines the preceding-depth representation with the shifted ground-truth token embedding; Emb and OutHead are shared, while M_k and TRM_k are depth-specific.

Source PDF pages were rendered with Poppler and inspected using the PDF skill. Temporary copies/renders live under `/tmp/fme-mtp-source-figures/`; they are not repository assets or new published figures.

## Changes

- Replaced both active raster references with `MTPTrainingDiagram.astro`, localized through `lang`. The old raster remains on disk; no unrelated asset was deleted.
- The diagram shows an NTP baseline, three illustrative parallel offsets, and DeepSeek's first auxiliary depth. It names the shared and independent parameters and identifies the ground-truth token as an input during training. The three-offset display is a schematic choice, not a claim about a specific released configuration.
- HTML/CSS nodes are readable text, with a figure caption, source-reference links and visible keyboard focus. The figure adds no JavaScript or controls. At narrow widths its two architecture panels stack vertically.
- Clarified that MTP designs differ in conditioning context. The `[A, B, C, D]` example separates prediction of C from the main prefix and auxiliary prediction of D after observing C during training. Inference drafts remain a separate choice with verification requirements.
- Corrected nearby prose and Quiz 2 to identify the paper's Transformer heads/shared vocabulary projection. Quiz 1 now distinguishes the next-token head from the first auxiliary head. Removed an unsupported prevalence claim about decayed head weights: optional lambda weights now explicitly belong to the educational variant, and all-one weights recover the cited unweighted sum.
- Retained existing educational-code limits and training/release contracts. No code execution, measured speedup, hosted service or new model-performance claim was added.

## Verification

An isolated Astro dev server used port 4325 with the GitHub Pages deployment base. The final Playwright pass (`/tmp/fme-mtp-figure-browser.mjs`) exercised both locales at 390 and 1440 pixels:

| Locale | Width | Page/runtime/math | Figure layout | Source focus/anchors | Existing inference keyboard smoke |
| --- | --- | --- | --- | --- | --- |
| EN | 390 | Pass | Pass | Pass | Pass |
| EN | 1440 | Pass | Pass | Pass | Pass |
| KO | 390 | Pass | Pass | Pass | Pass |
| KO | 1440 | Pass | Pass | Pass | Pass |

All four responses were HTTP 200, with no page or figure overflow, no KaTeX errors and no runtime errors. Each figure contained the expected two architecture panels and three parallel heads, and no old-image reference. The English diagram contained no Korean prose. Source links were focusable and resolved to real reference anchors. The unchanged accepted-prefix slider remained keyboard-operable: Home/End produced the expected 0.67×/2.67× outputs under its default authored cost assumptions. This is a control smoke check, not a measured decoding benchmark.

The four figure captures were visually inspected. Clean captures omit the dev toolbar and fixed navigation chrome after focus was tested separately; no product CSS was changed to hide overflow. Final captures are `/tmp/fme-mtp-{en,ko}-{390,1440}.png`; raw browser results are `/tmp/fme-mtp-figure-browser.json`. `git diff --check` passed. Root owns canonical-ledger updates, the full deployment build and repository-wide tests.

## Inspected final-source hashes

| File | SHA-256 |
| --- | --- |
| `src/pages/chapter-20/multi-token-prediction.mdx` | `e6f6d2d7bcefe3b290e7c0d81c7612e000d2bcfe5dc3593a29a285e27416f560` |
| `src/pages/ko/chapter-20/multi-token-prediction.mdx` | `d407bab93f7b3b6e03c5ec9d36bced5d4df7e538fe6083aadd5d636b14fe80a9` |
| `src/components/chapter-20/MTPTrainingDiagram.astro` | `9748042be0edf2b049ace6767f6da9392167ff5d069d095eb2059c4a879f330f` |
| `src/components/chapter-20/mtp-training-diagram.css` | `64fdd8b071b3e05c373fa91bd0a8e3576548b56559ca00a596b7a94675af821f` |
