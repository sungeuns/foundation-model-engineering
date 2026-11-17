# Compression and attention teaching pass — 2026-11-18

## Scope and inspection

Inspected and revised the complete English/Korean pairs for 13.2 Quantization Methods, 13.3 Weight Sparsification and 7.4 Flash Attention 1, 2, 3. Read repository instructions and the prior `growth-2026-11-18-content.md` recommendations; checked canonical navigation/chapter-list entries and neighboring page openings (13.1 PTQ vs QAT, 13.4 Knowledge Distillation, 7.3 Model & Pipeline Parallelism, 7.5 Tiny Decoder). English was revised before Korean. No page was added or reordered. Other book pages were not freshly reviewed by this pass.

## Reader-visible changes

| Pair | Teaching and correctness improvement |
|---|---|
| 13.2 | Replaced generic compression claims with the difference between a four-bit payload and runtime memory. Added a two-feature rounding example: weight error 0.04286 becomes output error 4.286 when multiplied by an activation of 100. Defined GPTQ's local Frobenius reconstruction objective, dimensions and row Hessian; distinguished uncentered second moments from the full model loss. Explained the error remaining after AWQ reciprocal scaling, scoped the 1% salience observation, separated format/container/algorithm, and corrected FP8 distribution/standards claims. Added the hypothetical 8B-weight calculation: 4 GB payload + 125 MB scales = 4.125 GB before other costs. |
| 13.3 | Replaced the incorrect sparsity raster with explicit numerical patterns. Added 2:4 metadata accounting (4.5 bytes per original 8 bytes, 43.75% saving) and an Amdahl example (2× kernel over 60% of latency → 1.43× application speedup). Compared magnitude and Wanda on an authored row with outputs 3.5 → 2.3 versus 3.0. Added an executable deterministic 2:4 mask that retains two positions, handles existing zeros honestly, validates inputs and proves dense allocation is unchanged. Removed unsupported reasoning-path and universal runtime claims; explained SliceGPT's lossy dimension removal separately from its consistent full change of basis. |
| 7.4 | Replaced the promotional opening with 64 MiB/head and 1 GiB/batch score accounting. Derived and executed online softmax with uneven tiles and large offsets. Distinguished exact attention mathematics, floating-point rounding and FP8 quantization. Removed guaranteed I/O hiding, task-quality preservation, speed and OOM claims; scoped FA2 results to its A100 experiments. Replaced the misleading hardware/performance table with a mechanism table, corrected FA3 authors, and retained the causal low-precision SDPA example with an explicit untested-CUDA limitation. |

All new numerical workloads are authored examples or dimensional arithmetic, not measured model/hardware benchmark results. Existing quantization and sparsity interactive components were not changed. Their integration text now describes the examples and their limits. Each revised page has five reasoning quizzes, followed by References.

## Visual evidence

Opened `src/assets/images/chapter-13/sparsity_types.png` and inspected it visually. Its central panel says exactly two missing in every group of four, but its horizontal four-item rows have 2, 3, 0 and 3 crosses. The unstructured panel also incorrectly equates unrestricted locations with random selection. Both page imports were removed and replaced with accessible numerical patterns plus a concrete counterexample. The original image asset was preserved; no new generated image was used.

Inspected raster SHA-256: `37f11c85ab8daa09883d41cab787a99d755b2c93993393ae57d59eee36f0f52c`.

## Primary-source and link evidence

Opened all 14 distinct external reference URLs in the final three English pages on 2026-11-18, plus relevant full-paper HTML and the llama.cpp quantizer source. The same external URL sets appear in Korean. Sources support the specific mechanisms; paper-reported performance is not presented as a new measurement.

- [GPTQ](https://arxiv.org/abs/2210.17323), [AWQ](https://arxiv.org/abs/2306.00978), [TurboQuant](https://arxiv.org/abs/2504.19874), [FP8 Formats for Deep Learning](https://arxiv.org/abs/2209.05433), and the [official GGUF specification](https://github.com/ggml-org/ggml/blob/master/docs/gguf.md). Checked GGUF's majority tensor-type metadata and the [quantizer source](https://github.com/ggml-org/llama.cpp/blob/master/tools/quantize/quantize.cpp), including mixed K-quant settings; no fixed per-layer policy is inferred from a filename.
- [SparseGPT](https://arxiv.org/abs/2301.00774), [Wanda](https://arxiv.org/abs/2306.11695), [SliceGPT](https://arxiv.org/abs/2401.15024), and [PyTorch 2.15 semi-structured sparsity](https://docs.pytorch.org/docs/2.15/sparse.html#sparse-semi-structured-tensors). Checked the documented two metadata bits per retained FP16/BF16 value and runtime restrictions.
- [FlashAttention](https://arxiv.org/abs/2205.14135), [FlashAttention-2](https://arxiv.org/abs/2307.08691), [FlashAttention-3](https://arxiv.org/abs/2407.08608), [online softmax](https://arxiv.org/abs/1805.02867), and [PyTorch 2.15 SDPA](https://docs.pytorch.org/docs/2.15/generated/torch.nn.functional.scaled_dot_product_attention.html). FA3's author list is Shah, Bikshandi, Zhang, Thakkar, Ramani and Dao. Its numerical error comparison concerns an FP8 baseline, not universal model-quality retention.

Mutable format/runtime guidance has an explicit 2026-11-18 snapshot. This pass does not claim a survey of all recent compression methods or GPU kernel releases.

## Reproducible checks

- Added `scripts/compression-example-smoke.py`; executed with Python 3.12 / PyTorch 2.15.0+cpu using `/tmp/fme-nov-venv/bin/python scripts/compression-example-smoke.py`. Executes every CPU Python block from both locales, checks the worked storage/output arithmetic, exact two-position masks, ties/existing zeros, malformed shapes, empty calibration/output rows and nonfinite rejection. Existing GPTQ/AWQ blocks remain compatible with the shared educational smoke script.
- Online-softmax tests compare independent `torch.softmax(scores) @ values` with tile sizes 1, 2, 4, 13 and 20, offsets −10,000/0/+10,000, and permuted keys at `rtol=atol=1e-12`. Empty/nonfinite rows are rejected. The on-page five-key fixture prints `[4.5067, 5.5067]`. No GPU kernel, backward implementation or performance test is claimed. The CUDA code was syntax-compiled only.
- All three pairs pass matching heading-level counts, quiz counts, citation multisets, external URL sets, display equations and identical Python blocks. English pages contain no Korean prose. Inspected the substantive explanations and limitations in both languages.
- `npm run test:content` and direct `node scripts/content-contract.test.mjs` passed again after the page freeze (10 direct contract checks). `node scripts/distributed-scaling-content.test.mjs` passed all four checks. `git diff --check` passed. The parent owns shared ledger hashes and any later integration content test, full build, desktop/mobile rendering, commit and push; this report does not claim those integration steps.

The local PyTorch environment emits a NumPy-not-installed warning; these torch-only tests complete successfully without NumPy. No shared component, layout, homepage, ledger or existing smoke script was edited by this subtask.

## Final inspected source hashes

These hashes bind the complete bilingual inspection to the final frozen source files. Integration edits require refreshed inspection evidence.

| Route | English SHA-256 | Korean SHA-256 |
|---|---|---|
| `/chapter-13/quantization-methods` | `9939109a4f7a49939655429be92e41c75f5db0a9ee7fc29ce17765313d2f8778` | `5e79bd98352c5f72d6d4c28cbb11ce46ef369cc6d5a60c108df129bc0803d6cc` |
| `/chapter-13/weight-sparsification` | `cef7eea23f21faf8a4719bc13b2f3e28a8743ba0230c67b01438dbac642a6530` | `bf555f470f962f689ad1442496cf669946e7933df2f1527b8832a0199f5f5f0c` |
| `/chapter-7/flash-attention` | `f305f222c5d296652a665982d6148449b7cebebdd7073ee35ef221b39b750c4c` | `4281c70f6433b16e06b9f82fcb6190a5c1d8276ee87e79285ca7ad9cb4b3fcbd` |
