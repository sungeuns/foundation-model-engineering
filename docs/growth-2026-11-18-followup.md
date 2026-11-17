# Teaching and discovery follow-up — 2026-11-18

This continues the work in `growth-2026-11-18.md`, from deployed commit `6af0197309015d5cdd3aab8c9362d7d6575da928`. It does not claim that the 1,000-star objective has been reached or that search/star conversion has improved.

## Reader evidence and the change it motivated

The existing [Hacker News discussion](https://news.ycombinator.com/item?id=49698603) contains criticism of overstated code realism and Korean readability. The [GeekNews introduction](https://news.hada.io/topic?id=33697) already discloses AI assistance. These are reasons to make the examples more concrete and their limitations clearer, rather than repeatedly resubmit the same book. An AI-detector claim in a comment is not a measurement of the book's actual authorship.

Six bilingual lesson pairs received a further teaching pass: expert parallelism, FlashAttention, quantization methods, weight sparsification, GraphRAG, and chain-of-thought prompting. The two companion reports record the compression and graph/reasoning inspections. This scope is not a new full-manuscript editorial sign-off.

## Expert parallelism

- Replaced sweeping claims with a six-token/two-rank example. Its send-count matrix distinguishes rows from receive-count columns, and the state-payload calculation distinguishes cross-rank work from local assignments and metadata.
- Corrected the attribution and scope of shared-expert overlap and grouped GEMM. A shared expert is not necessarily replicated on every GPU; a grouped kernel is not one giant mathematical matrix multiplication or a full-occupancy guarantee.
- Kept the transport example deliberately limited. Added dtype/device, expert-range, matching state-width/dtype, group and backend prerequisites. Forward dispatch is not a GPU trainer, an autograd implementation, or a recovery mechanism.
- Added `scripts/expert-dispatch-smoke.py`, which extracts the current EN/KO examples and checks actual two-rank CPU/Gloo communication. Uneven counts, zero input, zero receive, transmitted expert IDs and inverse source association passed with Python 3.12 / PyTorch 2.15. No model weights or data were downloaded. This is not GPU, training-gradient, or throughput validation.
- Replaced the near-inevitable-OOM claim with a conditional explanation of skew, capacity and stragglers. The authored interaction is explicitly described as a conceptual stepper.

Primary references checked: [PyTorch 2.15 collectives](https://docs.pytorch.org/docs/2.15/distributed.html#torch.distributed.all_to_all_single), [GShard](https://arxiv.org/abs/2006.16668), [DeepSeek-V2](https://arxiv.org/abs/2405.04434), [DeepSeek-V3](https://arxiv.org/abs/2412.19437), and [CUTLASS grouped scheduling](https://docs.nvidia.com/cutlass/latest/media/docs/cpp/grouped_scheduler.html).

## Sharing an explanation

Manuscript H2/H3 headings now have localized, keyboard-accessible fragment links. Readers can share one explanation without navigating through the entire book. The links use existing stable manuscript IDs, exclude component-generated headings, and are hidden in print. This is a usability change, not a measured SEO ranking gain.

## Resource-list submission attempt

The free-programming-books contribution guide permits suggesting a free HTML book through an issue. The EN/KO lists and existing issues/PRs were checked for duplication. The proposed entry identifies the maintainer, discloses AI assistance, and marks the living book as in process.

An authorized issue-creation attempt through the connected GitHub app returned **HTTP 403: Resource not accessible by integration**. No issue was created, and no submission URL exists. The exact proposed body and contribution sources are preserved in `outreach/free-programming-books-suggestion.md`. Other repositories were not contacted with unsuitable issue submissions. No automated HN/Reddit post or LinkedIn post was made.

## Review and validation

A fresh-context, read-only comprehension review was used for the expert-parallelism and permalink changes. It found a missing tensor dtype/device contract; the limitation blocks and docstrings were corrected in both languages. This was a scoped review, not a claim that the entire multi-phase EGM protocol converged.

The same reviewer inspected GraphRAG/CoT and the compression/FlashAttention pairs and found no further material issue. A GraphRAG quiz wording nit was corrected in both languages. The final compression pass also corrected the printed online-softmax fixture, rejected an empty output matrix, and distinguished uncentered second moments from centered covariance; the final examples were executed again.

Final local integration evidence:

- Node 24.19: deployment-base build completed with 216 pages; `node --test scripts/*.test.mjs` passed all 66 tests, including the 10 content contracts and canonical route/fragment/rendered math checks.
- Python 3.12 / PyTorch 2.15 CPU: the existing educational-example smoke suite, new compression smoke suite, and new two-process expert-dispatch test passed. CUDA was syntax-compiled only. A NumPy-not-installed warning does not affect these torch-only checks.
- 24 built-page browser combinations (six pairs × EN/KO × 390/1440 px) passed: HTTP 200, no page errors, no horizontal page overflow, no KaTeX errors, localized fragment links, keyboard activation and fragment reload. Existing EP stages, quantizer slider extremes and sparse masks were exercised. The browser harness initially read the prior React mask before the effect ran; after waiting for the actual state/pattern, the affected cases passed. No site code was changed to conceal that harness timing issue. Raw results retain the earlier failed observations.
- Inspected the new GraphRAG diagram in both languages and widths, plus rendered EP tables and FlashAttention mathematics. An isolated mobile diagram capture hid the fixed contents bar to inspect the entire figure; the ordinary full-page browser checks retained site navigation.
- All 29 distinct primary-reference URLs responded successfully. The GGUF GitHub URL returned one transient 503 and passed on retry; raw evidence is in `growth-2026-11-18-followup-links.json`.
- `git diff --check` passed. The homepages already show the content-pass date 2026-11-18; no artificial date bump was needed.

Deployment verification remains separate from these local results.
