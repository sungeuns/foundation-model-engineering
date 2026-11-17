# Logit-lens figure and teaching follow-up — 2026-11-18

## Scope and observed defect

Inspected active image references in chapters 16, 18 and 19, and viewed six complete local image assets: the function-calling loop, GCG optimization landscape, logit-lens concept, attention-head view, SAE architecture and induction-head circuit. This is not a complete review of those chapters. Selected **19.2 Logit Lens & Attention Visualization**, with the full EN/KO pair inspected. Read the previous/next lesson openings and canonical chapter/navigation entries; no page was added or reordered.

The active `logit_lens_concept.png` labels its network an encoder-decoder stack, repeats Layer 1, calls the readout an attention/projection beam, and mixes concept labels with vocabulary bars. It does not show the actual normalization and output-head path. The active `attention_head_view.png` combines token colors/head labels and input/output wording without identifying a selected head, query/key indexing or a measured source. Both pages captioned these as AI-generated illustrations. Their displayed imports were removed; original assets are preserved.

## Replacement and teaching changes

- Added a localized HTML/CSS schematic: residual location → actual final normalization → fixed linear output head → vocabulary softmax. It identifies next-token alignment and prevents a second normalization of an already normalized state. The text and caption explicitly scope the formula to a linear head; architectures with further logit transforms need their complete output path.
- Replaced the old authored 13-state top-token slider with actual numerical calculation on three declared vectors and a fixed four-token head. All four probabilities are shown. State selection, optional fixed RMS normalization, inspectable logits/matrix, localized labels and keyboard controls remain usable at narrow widths.
- States B and C share the top token Paris, while normalized probabilities are 67.52% and 54.05%. The example discloses that it does not measure a trained model, layer progression or factual calibration. Normalization bypass changes the measurement procedure.
- Replaced the untested model-download/CUDA hook example with an executed, model-free CPU FP64 PyTorch readout using the same authored values. Retained concrete extraction advice: exact residual location, tuple-versus-tensor hooks, removal on exception, complete final-decoder comparison, position selection and memory retention.
- Added dimensional memory accounting (256 MiB residual states versus about 3.05 GiB full-vocabulary readouts; one-position readouts about 6.10 MiB) and a scalar-value counterexample: identical attention weights produce outputs 1.009 and 9.001. Values and output processing matter in addition to weights.
- Rewrote Korean prose and five reasoning quizzes with EN parity. Removed the incorrect implication that passive lens observation automatically gives a causal explanation. Tuned-lens agreement and causal validation remain distinct.

## Source discipline and review

Opened the original [logit-lens post](https://www.alignmentforum.org/posts/AcKRB8wDpdaN6v6ru/interpreting-gpt-the-logit-lens), [Tuned Lens v6](https://arxiv.org/abs/2303.08112v6) and its full HTML, [BertViz paper](https://arxiv.org/abs/1906.05714), [official BertViz repository](https://github.com/jessevig/bertviz), and [Attention is not Explanation](https://arxiv.org/abs/1902.10186). All final references resolved. The revised Tuned Lens version is identified rather than described as a new release.

A separate parent-run fresh reviewer identified that some model decoders transform logits after their linear head. Verified the [official Gemma2 implementation](https://github.com/huggingface/transformers/blob/main/src/transformers/models/gemma2/modeling_gemma2.py) as a counterexample and narrowed the formula, final-comparison instructions and schematic caption. The lesson uses a conditional architectural instruction rather than an unversioned product claim. All illustrative numerical values are authored or derived; no empirical model benchmark was invented.

## Verification

- Executed the full on-page PyTorch code in both languages with Python 3.12 / PyTorch 2.15 CPU. Both produced A London 57.71; B Paris 67.52; C Paris 54.05, with complete probability mass and different B/C distributions. Checked the memory and weighted-value arithmetic independently. A missing-NumPy warning does not affect these torch-only computations.
- Added `scripts/logit-lens-calculations.test.mjs`: two tests pass. All six JavaScript state/normalization combinations match independent PyTorch FP64 probability fixtures to 1e-12; checks include normalization, positive finite probabilities, stable top tokens, different distributions, invalid state rejection and exact EN/KO code parity.
- Four Chromium checks (EN/KO × 390/1440 px) pass all states and both normalization settings, keyboard button activation, selected state, all four displayed probabilities, expandable matrix and keyboard-focusable table. No page errors, KaTeX errors or page overflow remain. Visual inspection covered desktop and mobile calculator/pipeline screenshots in both languages. Isolated figure captures hide the fixed menu/development toolbar; normal page checks retain the site layout.
- The first English-mobile check exposed 30 px of real overflow from the last attention-table header's inline `$o$`: its hidden absolute MathML escaped the horizontally scrollable table. Removed that redundant header formula in both languages; `o` stays defined in the body equation. Reran all four combinations successfully. No global CSS change or overflow-hiding patch was used.
- `node scripts/content-contract.test.mjs`: nine of ten checks passed during concurrent edits. Only the shared inspection ledger was stale (first exposed 7.5, which another agent was editing). Root owns ledger synchronization and final build/test/deployment. Heading levels, five quizzes, citations, reference URL sets, display equations and code were checked for bilingual parity; English contains no Korean prose. `git diff --check` passed.

Browser evidence: `growth-2026-11-18-figure-browser.json`. This subtask used its own port 4324 server and did not run a global build, edit the shared ledger or homepage, commit, or push.

## Frozen inspected source hashes

| File | SHA-256 |
|---|---|
| `src/pages/chapter-19/logit-lens-and-attention-visualization.mdx` | `8f6a64cbb90f5881b4fda6b927ecbdb6a9fe1fcf319cb3bdb5c873bce37a80e5` |
| `src/pages/ko/chapter-19/logit-lens-and-attention-visualization.mdx` | `c0814be5b0d9a6032c38f113c2196e45512fda93d9947d5943b8905809feadf7` |
| `src/components/chapter-19/LogitLensVisualizer.tsx` | `6ea38f7755b33133dc0487a270df33d1a35fd9c6d4fdabaf9921604577764aba` |
| `src/components/chapter-19/LogitLensPipeline.astro` | `6d49e070b3676844aa77a3fada664d09d9434364b349a40d30d59f4c6eb2383b` |
| `src/components/chapter-19/logit-lens-calculations.js` | `14932e8e91f1bd7785769ed84073f3915fdfa056faa98f07e15184ea882bd07d` |
| `src/components/chapter-19/logit-lens.css` | `9f283f9c5bb94fda96f66459ef7815dff55142755ae6f8e00e3e6953386f87ea` |
| `scripts/logit-lens-calculations.test.mjs` | `59083c556b7563668daf945a7fad1ca31bef7d8d52e8a1fe52c8fac7457698c1` |

Removed display references, preserved asset hashes:

- `logit_lens_concept.png`: `a7e3aac3872e5983cc5f4d0972c55aeb3ff8f59f19dd5538d70005aed8bbafee`
- `attention_head_view.png`: `b021d4d249c5a3597251d4836fd773b306ae4a2f44d0b2e04f6036b6ecce635f`
