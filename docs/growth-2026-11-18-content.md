# Reader-facing content pass — 2026-11-18

## Scope and evidence

Screened the complete 107 English / 107 Korean MDX inventory mechanically. No missing language peers were found. The initial English scan found eight lines matching the selected hype terms (`revolutioniz*`, `game.chang*`, `prophecy`, `breakneck`, `unprecedented`, `paradigm shift`), zero matches for the selected generic-opening phrases, and 72 lines containing mutable-claim indicators (`latest`, `state.of.the.art`, `currently`, `as of`). These are triage indicators, not error counts or proof of editorial quality. The existing November 15/17 review ledgers supplied prior evidence; unchanged pages were not freshly read in full.

Read and revised five pairs: 3.1 self-attention, 12.1 KV cache, 12.2 PagedAttention, 14.6 RAG failures, and 17.2 LLM-as-a-judge. Checked adjacent-page openings and the canonical navigation/list for continuity. The interactive reviewer separately owns the 3.1 demo and its integration paragraph/Quiz 3, plus the 12.1 calculator. No page was added or reordered.

## Changes that a reader can use

| Pair | Concrete improvement |
|---|---|
| 3.1 | Replaced the unsupported author-frustration/“prophecy” story with the recurrence/parallelism bottleneck and a grammatical example. Distinguished contextual layer inputs from static embeddings. Stated variance assumptions behind scaling instead of guaranteeing stable gradients. Added the educational code's dtype, memory and fully-masked-row limitations. Clarified that the FLOP/parameter exercise excludes the output projection, and supplied the counts with it included. |
| 12.1 | Derived a 2.5 GiB/request payload and a 24 GiB cache-only budget: nine 8,192-token requests fit, but their allowed 2,048-token continuations reach 28.125 GiB. Added executable full-vs-token-vs-chunk equivalence and causality checks. Verified current PyTorch mask alignment and vLLM calibration documentation with an explicit date. |
| 12.2 | Fixed a real arithmetic error that ignored prompt tokens: 2,048 reserved minus a 512-token prompt and 20 output tokens leaves 1,516 slots. Removed universal/historical allocation claims, qualified vendor benchmark figures, corrected copy-on-write and tail-waste assumptions, and marked the old CUDA simulation's untested/omitted semantics. Removed a garbled raster after the visual reviewer inspected it; the interactive allocator remains. |
| 14.6 | Replaced repeated generic checklists with a clearly fictional refund-policy incident. Traced current source → candidates → ranking → context → answer; introduced controlled diagnostic interventions and a 90→72→60 evidence-delivery example. Separated similarity from calibrated confidence, citation support from source authority, and validated fallback behavior from unconditional continuation. Added a specific release/rollback artifact contract and five reasoning quizzes. |
| 17.2 | Added runnable position-swapped verdict reconciliation. Demonstrated 54 wins/26 losses/10 ties/10 unresolved, the biased conditional denominator, and the 59–69% missing-verdict interval, explicitly distinct from sampling confidence. Added a 90%-agreement/0%-critical-recall counterexample. |

All new incident counts, latency budgets, verdicts and admission budgets are explicitly authored examples. They are not benchmark results. Existing dated frontier research summaries remain bounded by their disclosed configurations; this pass does not claim a new frontier-model survey.

## Verification performed

- Python 3.12 / PyTorch 2.15.0+cpu: executed the English and Korean code blocks for 3.1, 12.1 and 17.2. Attention output matches PyTorch SDPA under a causal mask; disallowed weights are zero. KV token-wise and uneven-chunk output matches full recomputation at `rtol=1e-5, atol=1e-6`; changing future inputs leaves earlier outputs unchanged. Judge remapping covers both candidate orders, true ties, inconsistency and invalid verdicts.
- Recomputed all new worked arithmetic, including 320 KiB per KV token across layers, 2.5/3.125 GiB per request, 22.5/28.125 GiB batch payload, nine/seven capacity bounds, and the judge fixture outputs.
- Checked all five pairs for matching heading counts, quiz counts, citation multisets, external URL sets, and display equations (ignoring terminal punctuation). Inspected substantive EN/KO parity. English pages contain no Korean prose.
- Opened all 20 distinct external URLs across the five English pages through the web tool, including primary papers, vLLM's historical release/current cache docs, pinned PyTorch 2.15 docs, and the original attention illustration source. New claims are linked to the relevant sources; no invented recent model scores or releases were added.
- Ran `npm run test:content`; direct `node scripts/content-contract.test.mjs` exposed 9/10 checks passing, with only the expected current-ledger hash mismatch pending integration. The parent agent owns the shared ledger refresh and final full test/build/browser pass.
- `git diff --check` passed at handoff. No GPU execution, production load test, or exhaustive reread of the other 102 pairs is claimed.

## Next editorial candidates

The mechanical scan still points to broad compression claims in `quantization-methods`, `weight-sparsification`, and the FlashAttention opening. Adjacent-page reading also found promotional phrases in the Chain-of-Thought opening. Review their source scope and worked examples before changing them; search hits alone are insufficient evidence. Preserve dated release research separately from timeless mechanisms so future news updates do not keep disturbing the main teaching arc.

## Inspected source hashes

The table below binds the five bilingual inspections to their current source text at this handoff. Later integration edits require a refreshed inspection/hash in the canonical ledger.

| Route | English SHA-256 | Korean SHA-256 |
|---|---|---|
| `/chapter-3/self-attention-mathematics` | `5b7f732d14809df154a84ffe7c45f4f34e1b8825769f69fc7d83a107888b76b9` | `7b3c74c9eb256f6b5717ca37192f89da2906d4326b1acb931b23dd968612a321` |
| `/chapter-12/kv-cache-management` | `4be195f202603d7c05c414a25c20bb5f69a3b1d7c46512d364edbfdf14d0e047` | `383de00ff5bc97cb8a33ebe6d951bfe3c3fa2217dd78a50501bf9c71ce237913` |
| `/chapter-12/paged-attention-vllm` | `75d76b30c45ca44edbb56072df6f91209343c7d8ad5c69270cd6b6c4e9700dba` | `e824df912502a5ce75dde4c69fc80d44259c9e9229b55374ba32eb06ba5e0b6a` |
| `/chapter-14/rag-failure-modes-and-operational-design` | `1364fc4216d2199a6bd5150aded52a2ee443c13f2ef48c4cb46a2760ef903beb` | `1650265565ca8a03b3f6d3544a12989e7a93b337274db941152d3457171fcd3f` |
| `/chapter-17/llm-as-a-judge` | `b3a6cd38fea260a08812c4a3a8f29bc76f30267c3d95247827eda51cb867c7e3` | `630473d35f271219ecf4ae6dc5fc37e897b051893a8f0ad3b9d6fede80c2d0d2` |
