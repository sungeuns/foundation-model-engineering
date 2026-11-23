# November 24 architecture update: scoped review evidence

Review date: 2026-11-24. This is a scoped editorial and rendered-page review, not a new whole-book audit.

## Files inspected and frozen

| File | SHA-256 after review |
|---|---|
| `src/pages/chapter-4/various-llm-architectures.mdx` | `028ebccee02c3a1b30297a6c43b9ed91806975ff737f33e8a5ccd5ea26f26a30` |
| `src/pages/ko/chapter-4/various-llm-architectures.mdx` | `5d9fb05bb56198c702831691a20832099bac533ece95857c22101dfb884863a8` |

The English additions were written first, then the Korean page was updated and compared for substantive parity. Both pages have the same new sections, equation and symbol definitions, mechanism table, access boundaries, six quizzes, and references 37–41. Earlier dated release tables remain historical records. No executable example, imported interactive component, navigation entry or image asset changed.

Read for continuity: `docs/chapter_list.md`, `src/data/chapters.js`, the preceding `chapter-4/hybrid-prefix-lm.mdx`, and the following `chapter-5/sparse-vs-dense-models.mdx`. The original GLM blank-infilling example in Section 4.4 remains a historical training-objective example.

## Primary evidence checked

| Source | Evidence used | Boundary retained |
|---|---|---|
| [Z.ai GLM-5.4 announcement](https://z.ai/blog/glm-5.4), dated 2026-11-23; checked 2026-11-24 | Shared-depth mechanism, supporting cache/index/gate mechanisms, ablation scope, access milestones | Launch disclosures are attributed to Z.ai; no exact total/active count, full mixture or future weight license inferred. No numeric flagship benchmark or throughput claim imported. |
| [Z.ai Coding Plan model-switching guide](https://docs.z.ai/devpack/latest-model), checked 2026-11-24 | Hosted context/input/effort contract | Plan endpoints are distinguished from the forthcoming standard pay-as-you-go API and from downloadable weights. |
| [OpenAI GPT-6.2 Astra documentation](https://developers.openai.com/api/docs/models/gpt-6.2-astra), checked 2026-11-24 | Modalities, separate context/input/output limits, reasoning and Responses features | No inference about internal architecture, routing, parameters or training mixture. |
| [OpenAI GPT-6.2 Sol documentation](https://developers.openai.com/api/docs/models/gpt-6.2-sol), checked 2026-11-24 | Same interface categories, independently checked | No transfer of a different model's measured score. |
| [OpenAI API changelog](https://developers.openai.com/api/docs/changelog), November 17 entry; checked 2026-11-24 | Release date and endpoint/tool-call distinction | Provider interfaces and whole-system evaluation remain distinct from architectural disclosure. |

The GLM announcement's full primary-source text was readable through web search; direct `web.open` for that URL returned an access error. The four documentation URLs were readable directly (OpenAI Markdown exports were also read). This report does not claim that the direct-open failure proves a broken public link. Older references were retained; this scoped update does not re-date their verification.

## Editorial and mathematical checks

- Shared-depth execution accounting explicitly defines all symbols and assumptions. It does not assert a full GLM-5.4 layer count, parameter equality including added gates, or a FLOP/latency multiplier.
- The 30B controlled experiment stays separate from the hosted flagship. Its increased training compute is stated; adaptive iteration counts remain future work.
- Hardware storage, shared versus per-iteration state, computation and task-level validation are explained as engineering implications.
- GPT-6.2 Astra/Sol are treated as documented hosted interfaces with undisclosed internals. Tool/scaffold/effort conditions remain part of evaluation identity.
- English additions contain English prose; Korean additions use the repository's emphasis-spacing convention. Both pages end with Quizzes then References.

## Verification

- `git diff --check` passed for the two MDX files.
- `npm run test:content` was run on Node v24.19.0. The direct diagnostic run, `node scripts/content-contract.test.mjs`, passed 9 of 10 tests. The only failure was the expected stale Section 4.5 hash in the root-owned current review inventory. Pair inventory, navigation slug/number/order, headings, frontmatter, quiz count/order, citations, anchors and local imports passed. Root must refresh the ledger after final review and rerun the suite.
- Astro 6.1.3 dev preview on port 4322 rendered both routes with HTTP 200 at 1440×1000 and 390×1000. All four checks had no page errors, no KaTeX error elements, working section anchors, six quiz summaries and a working final quiz disclosure.
- Browser measurements found no page-level horizontal overflow: document width equaled viewport width at both sizes. The new table fit its 924px desktop / 350px mobile container. Desktop and mobile screenshots were visually inspected, including both mobile mechanism tables, the formula and the Korean GPT section.
- Screenshots and the one-off browser-check script are in `/tmp` (`glm54-architecture-*`, `glm54-table-*`, `gpt62-architecture-*`, and `check-glm-architecture.mjs`); they are not repository artifacts.
- No new interactive component or executable code was introduced. The final production build and consolidated review-ledger update are delegated to the root task to avoid concurrent shared build output.

Freeze: the two MDX hashes above identify the inspected content. Any later modification requires renewed inspection and updated evidence.
