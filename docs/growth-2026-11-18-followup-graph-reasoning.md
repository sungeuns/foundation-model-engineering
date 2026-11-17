# GraphRAG and reasoning follow-up, 2026-11-18

Scope: direct inspection and revision of the English/Korean 14.5 and 15.1 pairs at baseline `6af0197`; no claim of a whole-book editorial review. English was revised first, followed by its Korean peer. Adjacent chapter entries and the existing navigation were checked for the 14.6 and 15.2 transitions. No page or navigation item was added. This report records this agent's checks; the integrating agent owns final ledger synchronization and the production build.

## Changes and rationale

- **14.5 GraphRAG & Ontology:** replaced the image that placed a global answer directly after graph communities with a chapter-local, localized HTML/CSS diagram. It separates offline extraction/community reports from question-specific map, selection, and reduce work. Added a small authored report/token budget example and a rare-theme omission example. Distinguished local-search source text from global-search report context. Scoped HippoRAG findings to the evaluated paper and corrected its publication year to NeurIPS 2024. Clarified the RWR probability recurrence, proximity/truth distinction, and restart quiz.
- **15.1 Chain of Thought:** rebuilt the explanation around an authored bolt-counting example. Both languages now distinguish autoregressive generation from a single forward pass, written correctness from usefulness and faithfulness, and sample agreement from verified truth. Replaced the untrained-model generation loop and its decorative image with an executable offline vote/parser/verification example. Added malformed-output and shared-error cases, an explicit token budget, dense KV payload accounting, and a paired-evaluation contract. There are five reasoning quizzes.
- **Smoke coverage:** replaced only the old CoT model assertions in `scripts/educational-example-smoke.py` with tests of the new exact-answer contract, wrong majority, invalid records, tie abstention, and empty-pool handling. Other examples' checks remain intact.

## Sources checked

Primary sources were opened on 2026-11-18. Mutable GraphRAG documentation has a matching date in both pages and the diagram caption. No provider/model availability or undisclosed frontier architecture claims were added.

- GraphRAG paper: https://arxiv.org/abs/2404.16130
- Microsoft indexing: https://microsoft.github.io/graphrag/index/overview/
- Microsoft global search: https://microsoft.github.io/graphrag/query/global_search/
- Microsoft local search: https://microsoft.github.io/graphrag/query/local_search/
- Leiden open manuscript: https://arxiv.org/abs/1810.08473 (journal reference is Scientific Reports 9, 5233, 2019; used this resolving primary manuscript link after Nature redirected the browser tool to an inaccessible identity-provider page).
- HippoRAG: https://arxiv.org/abs/2405.14831 and NeurIPS 2024 proceedings.
- Wei et al.: https://arxiv.org/abs/2201.11903
- Kojima et al.: https://arxiv.org/abs/2205.11916
- Wang et al.: https://arxiv.org/abs/2203.11171
- Turpin et al.: https://arxiv.org/abs/2305.04388

## Verification

- English/Korean citation sequence, source URLs, heading counts, display equations, and quiz counts match; no Korean prose occurs on the English pages. Direct reading checked substantive parity, including limitations and code behavior.
- The extracted offline graph-structure, RWR, and CoT code blocks were executed with Python 3.12; both languages' examples passed. The existing `scripts/educational-example-smoke.py` passed under `/tmp/fme-nov-venv/bin/python` (PyTorch CPU; an unused NumPy initialization warning was emitted).
- `npm run test:content` was run. Direct content-contract output passed 9 of 10 checks; the remaining assertion was the shared current-review hash ledger, first exposing `/chapter-5/expert-parallelism` after concurrent revisions. This agent did not update shared ledgers. The integrating agent must synchronize inspected hashes and rerun the complete suite.
- An isolated Playwright/Chromium session rendered both pages in both languages at widths 390 and 1440 on local Astro port 4324: eight route/width checks returned HTTP 200, no JavaScript page errors, no horizontal document overflow, and no KaTeX errors. Existing graph/vector mode controls and the missing-edge toggle were exercised. Results: `docs/growth-2026-11-18-followup-graph-browser.json`.
- Diagram screenshots were inspected at desktop and narrow widths. Korean word wrapping was improved and rerendered. The new diagram is static semantic HTML, with ordered steps and a localized caption; it has no hydration, filter, or selection state to test.
- `git diff --check` passed. The integrating agent will run the final production build and production-route checks once all agents' changes are present.

## Inspected file hashes

These are the inspected final content/component/script bytes for this scoped pass. Later edits invalidate the associated evidence.

| File | SHA-256 |
| --- | --- |
| `src/pages/chapter-14/graphrag-and-ontology.mdx` | `6a6bfb305a399dd26588c20193a52bd7fa3f5a127b5ef766c5f235a265bc2b6f` |
| `src/pages/ko/chapter-14/graphrag-and-ontology.mdx` | `0d8e5a5ead4ce3e1ec71dac8a9daf62373947617248ec254d23bffb65c670e50` |
| `src/pages/chapter-15/chain-of-thought.mdx` | `dfa755568cbd54f3636f06ca66bc5a279f0d5f54f81d0589f4293abdabc5979b` |
| `src/pages/ko/chapter-15/chain-of-thought.mdx` | `217a9074408e2c33d9405b96de888fd38d7b46a996ca24cffb9ce5056c16bf55` |
| `src/components/chapter-14/GraphRAGPipeline.astro` | `c2f03494951b9ebc37d8a7ef0a9911a9f860992a2bae00f6bdf8e3c9b96bb1c8` |
| `src/components/chapter-14/graphrag-pipeline.css` | `31541bad57ab6f325a4d13bc815dbafa62e05cd2e28eff7ad6427d6bc857b966` |
| `scripts/educational-example-smoke.py` | `5351f87057ffa4576d45fc0b3e743f722f9f3a67e86199195d171fd22f46c8ce` |

Integration review: a fresh-context reviewer found no material GraphRAG/CoT issue. Root reworded Quiz 3 in both GraphRAG editions to ask about Leiden’s pipeline role, matching the explanation; hashes above include that inspected wording change.
