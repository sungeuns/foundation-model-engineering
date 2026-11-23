# Commercial-model benchmark review — 2026-11-24

Scope: `src/data/commercial-model-snapshot.json`, the bilingual chapter 17.6 tables, and `CommercialModelBenchmarkExplorer`. The dataset now contains 43 dated profiles from 18 providers, including 32 matched Artificial Analysis (AA) scores and 31 AA task-cost values. Eleven rows have no verified matching score. Missing optional numbers remain omitted; they are never filled with zero or provider-reported results.

## Evidence and comparability

The 27 previously linked AA profiles were reopened, alongside nine newly linked profiles. All 32 accepted score profiles report **AA Intelligence Index v5.0.1**, so the table can use one current retrieval snapshot without mixing index versions. `evaluationVerifiedAt` means the public result was checked on this date; it does not claim that AA reran every evaluation that day. Each measured row retains the exact public profile name, its displayed effort/fallback setting, its evaluation URL, and the methodology version. Profiles with no accepted result have no `evaluationMethodology` or `evaluationVerifiedAt`; `evaluationCheckedAt` can still record inspection of a nonmatching or unscored page.

The [AA methodology](https://artificialanalysis.ai/methodology/intelligence-benchmarking) describes a composite of knowledge, coding, science, and general-agentic evaluations. These are evaluated systems with different effort and output budgets, not equal-compute experiments. Agentic components have their own tools and scaffolds: for example, AA-Briefcase and FrontierCode use Stirrup, while TerminalBench uses mini-swe-agent. Task counts, turn limits, repeated runs, and tool access belong to those evaluation definitions. The component and prose warn readers against attributing these system results to bare model weights or transferring them to arbitrary local checkpoints.

AA task cost is a **weighted calculated USD cost per Intelligence Index task**, using evaluation token consumption, current model pricing, and typical live cache-hit assumptions. It is not a historical invoice or the total cost of the evaluation suite. A release overview can show the best score and cheapest effort separately; this review instead takes each accepted score/cost pair from the same selected model-profile configuration. Default API effort is not automatically the evaluated effort.

The existing matched scores remained unchanged. Two existing costs changed on the current profile pages:

| Profile | Earlier USD/task | Current USD/task | Evidence |
| --- | ---: | ---: | --- |
| Gemini 4 Argon (High) | 4.97 | 9.95 | [AA profile](https://artificialanalysis.ai/models/gemini-4-argon) |
| Nemotron 3.5 Super VL | 0.56 | 0.48 | [AA profile](https://artificialanalysis.ai/models/nemotron-3-5-super-vl) |

The current [Google pricing page](https://aistudio.google.com/docs/pricing) lists Argon and Carbon Standard input/output rates of **$2/$10 per million tokens through November 30**, then **$4/$20 from December 1**. AA currently uses $4/$20 for those profiles. The official current token prices and AA task costs are retained as distinct quantities with an adjacent explanation; no cause for the discrepancy is inferred. `priceValidThrough` prevents the introductory token-price assumption from silently surviving a later snapshot.

## Added profiles

All dates below are public milestones, not dates of benchmark execution. API general availability, earlier previews, and artifact revisions remain distinct.

| Added profile | Milestone | AA profile / index / USD per task | Primary evidence and qualification |
| --- | --- | --- | --- |
| GPT-6.2 Astra | 2026-11-17 | Max / 62 / 4.00 | [API model](https://developers.openai.com/api/docs/models/gpt-6.2-astra); Standard $8/$40 through 272K input tokens, with a separate long-context multiplier. |
| GPT-6.2 Sol | 2026-11-17 | Max / 57 / 1.01 | [API model](https://developers.openai.com/api/docs/models/gpt-6.2-sol); Standard $2/$10 through 272K input tokens, with a separate long-context multiplier. |
| GLM-5.4 | 2026-11-23 | not reported | [Release](https://z.ai/blog/glm-5.4), [plan model contract](https://docs.z.ai/devpack/latest-model); hosted plans are live, pay-as-you-go API and weights are planned. Subscription-credit multipliers are not token prices. |
| Gemini 4 Carbon | 2026-11-10 | High / 60 / 7.76 | [Model](https://aistudio.google.com/docs/models/gemini-4-carbon), [changelog](https://aistudio.google.com/docs/changelog); general API date, distinct from the earlier AA profile milestone. |
| Gemini 4 Neon | 2026-11-18 | Xhigh / 61 / 6.44 | [Model](https://aistudio.google.com/docs/models/gemini-4-neon), [pricing](https://aistudio.google.com/docs/pricing#gemini-4-neon); Standard $3/$15. |
| Gemini 4 Hydrogen | 2026-11-12 | Xhigh / 54 / 3.16 | [Model](https://aistudio.google.com/docs/models/gemini-4-hydrogen), [pricing](https://aistudio.google.com/docs/pricing#gemini-4-hydrogen); Standard $1.50/$7.50. |
| Qwen4-Max | 2026-11-16 | Qwen4 Max / 43 / 3.27 | [Changelog](https://docs.qwencloud.com/changelog/models), [model guide](https://docs.qwencloud.com/developer-guides/getting-started/latest-model); general API follows November 11 Token Plan preview. Profile has no effort suffix; its documented default is xhigh. Regional prices are not collapsed into one rate. |
| LongCat-2.5 | 2026-11-10 | not reported | [Release](https://tech.meituan.com/2026/11/10/Meituan-LongCat-2.5-Open-Source.html), [MIT model card](https://huggingface.co/meituan-longcat/LongCat-2.5); provider charts are not substituted for AA values. Exact context contract was not verified. |
| Agnes 2.5 Pro Theta | 2026-11-15 artifact revision | not reported | [Apache 2.0 model card](https://huggingface.co/Agnes-AI/Agnes-2.5-Pro-Theta), [artifact metadata](https://huggingface.co/api/models/Agnes-AI/Agnes-2.5-Pro-Theta); revision `6c06a374dd7f0b0ce254544aebadcf0a4f992b7c`. The AA hosted profile's different context limit and unverified checkpoint mapping prevent transferring its numbers. |
| Inkling 2 Mini | 2026-11-20 | Inkling 2 Mini / 20 / 0.59 | [Apache 2.0 model card](https://huggingface.co/thinkingmachines/Inkling-2-Mini); current AA v5.0.1 is independently checked, rather than copied from the card's older v5.0 table. |
| Muse Ember | 2026-11-09 | Max / 36 / 0.14 | [Release](https://research.meta.ai/blog/muse-ember); API-only, $0.10/$0.50 through 200K prompt tokens and $0.30/$1.50 above that threshold. |

New matched AA URLs and exact profile names are stored beside the rows. The new GLM and LongCat rows have no verified AA URL. The Agnes link is retained solely with a clear mismatch note and no numerical result.

The September DeepSeek Flash profile, Ling 3.1 Flash, and existing unscored access/artifact rows remain unscored. The October DeepSeek revision has its own source and evaluation identity. The public Ling artifact is not silently equated with the separately named Flash 1019 hosted profile. Muse Wonder Full has a score but no reported task cost, so it appears on compatible axes and disappears from the cost axis.

All existing row-level primary sources were reopened on November 24. Current OpenAI model documentation, the Anthropic model overview, Google pricing, Mistral model documentation, and relevant model cards/API metadata were also checked for mutable prices, context, and access. Historical milestones were preserved. Mistral's current official $0.70/$2.10 rates remain unchanged. Claude Mythos's currently documented 1M context was added; restricted access remains explicit. Ling 3.0 Flash Sante's configured 262,144-token serving limit is represented as 262.144K rather than treating binary 256K as decimal 256,000.

## UI and schema safeguards

- All header, source-note, and timeline-range dates derive from the snapshot. Selected profiles show the primary verification date; matched results additionally show the evaluation verification date.
- An unmeasured selection does not acquire the global AA methodology label. It explicitly states that a matching evaluation was not verified.
- Both axes require finite numbers. Filtering updates plot points, the alphabetical selection list, the selected profile, and the release timeline. Missing measurements never become zero.
- Exact context values are preserved in details: for example, 1.048576M versus 1.05M. Axis tick labels alone are shortened. The dataset uses decimal K = 1,000 tokens.
- English and Korean labels cover missing results, source notes, and effort configuration. Keyboard selection remains available through both plot points and buttons.
- Tests enforce current provenance dates, consistent methodology for measured rows, absent methodology on unmeasured rows, finite optional numbers, paired token-price fields, nonexpired conditional pricing, distinct revision identity, and agreement with both language tables.

## Verification evidence

- `node --test --test-isolation=none scripts/model-snapshot.test.mjs`: **3/3 passed** after the bilingual tables were regenerated. The explicit isolation option avoids this environment's blocked child-process test runner; it does not skip tests.
- Chromium interaction matrix on local Astro preview: **608/608 states passed** = two languages × two viewport widths (1440 and 390) × 19 company options × two metrics × four axes. Each state checked exact eligible point/list membership, timeline filtering, empty-state rendering, finite coordinates, and selection membership.
- Additional browser checks passed: keyboard Enter/Space selection, GLM-5.4's missing score and absent evaluation label, exclusion of missing values from plots, exact Neon context display, and the Meituan empty plot. No page runtime errors occurred. Document width equaled viewport width at both sizes; the narrow plot used its intended internal horizontal scroll.
- Browser evidence: `/tmp/nov24-benchmark-browser-results.json`; desktop/mobile screenshots were captured and visually inspected for both languages. Controls, selected-model details, source notes, and long labels remained readable. These local inspection artifacts are not publication assets.
- `git diff --check`: passed for the working tree at this review checkpoint. The root task performs the integrated content-contract and production-build checks after all parallel chapter edits are complete.

This is a current, source-bounded comparison snapshot, not a claim to cover every model launch. Tencent Hy4 and Ling 3.2 were not added here because the review did not establish the complete milestone/artifact mapping needed for this table. Provider benchmark claims remain separate from the 32 accepted AA profiles.
