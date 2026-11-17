# Interactive examples and figure audit — 2026-11-18

## Scope and evidence

Inspected the component and asset inventory, all 117 chapter images at contact-sheet scale, and selected full-resolution figures. There are 90 TSX component files and 117 image assets (92 PNG, 23 JPEG files with `.png` names, and 2 SVG). Before the figure removals, a filename scan found 55 image assets referenced by MDX/Astro pages; the other 62 were not evidence of current reader-facing defects. The counts describe this audit baseline, not a promise that unused assets are safe to reuse. Eighteen TSX files are not imported directly in MDX; nested imports must be checked before treating them as dead code. These mechanical counts and thumbnail inspection are **not** a complete semantic or accessibility review of every component, every image label, or every page.

This change thoroughly inspects and updates three bilingual live interactions: attention in 3.1, KV cache capacity in 12.1, and pass@k in 17.1. Screenshots were rendered at 390 and 1440 pixels in Chromium; selected desktop/mobile screenshots were visually inspected. The changed components use native controls with visible keyboard focus and locally scoped styles. No model scores or external measurements are introduced.

## Changes

### Attention: calculate something for every query

The old 3.1 demo offered eleven word buttons but supplied authored weights only for “it.” The other ten choices returned missing-data messages. Its bars did not reveal how Q/K/V produced the result.

The replacement uses four explicitly authored two-dimensional Q, K and V vectors. Every selected query produces an exact stable-softmax calculation, horizontal weight bars, a weighted output vector and an inspectable intermediate table. Causal masking and an attention-score temperature control teach normalization and concentration. The first token with a causal mask gives a useful invariant: output stays V₁ at every allowed temperature. When masking is enabled, the displayed equation includes +M and defines its zero/negative-infinity entries. The text distinguishes the teaching control from decoding temperature and the toy vectors from learned language representations. EN/KO integration paragraphs and Quiz 3 now match this exercise.

`public/social/attention-demo.png` is an actual 924 × 828 Chromium screenshot of the default English component, captured for README use. The development toolbar was hidden for capture; no values or UI content were fabricated. Size: 87,480 bytes.

### KV cache: connect the formula to admission

The calculator previously exposed six inputs and one large byte count. It now connects total payload, per-sequence memory, an explicitly KV-only budget and the integer number of sequences that fit. The default example yields 80 GiB for 32 sequences, 2.5 GiB each, and at most nine full-length sequences in a 24 GiB payload budget. A capacity of zero remains zero. A controlled comparison holds the workload fixed while varying KV heads; it does not present changing attention architecture as a free serving option.

The budget excludes weights and all other runtime costs. Copy names quantization metadata, replication and serving headroom rather than claiming the estimate predicts a whole model's fit on a GPU. Korean labels and explanations now use natural technical prose. Responsive controls, wrapped formulas and zero-capacity states were exercised.

### pass@k: show the relationship and its limits

The earlier control returned one percentage without showing how k changes it. A curve now shows the finite-pool probability against k, alongside pass@1, the selected pass@k and sample count. Explicit zero-pass and guaranteed-inclusion states explain the boundaries. Reducing n clamps c and k. The explanatory text separates answer inclusion from the ability to select an answer and from future-sample guarantees. The chart has a localized accessible title and description, text results, readable ticks and a visible selected point.

## Verification

- `node scripts/interactive-calculations.test.mjs`: 2 tests pass. All 64 attention query × causal-mask × temperature states normalize; future tokens contribute zero; outputs remain in the visible values' convex hull; the first-token causal invariant and temperature concentration hold. pass@k matches exhaustive enumeration of every subset size for pools up to nine samples, including c=0 and c=n.
- Browser: 12 component/language/viewport combinations pass, zero page errors and no document horizontal overflow. Exercised all query buttons, both attention mask states, temperature endpoints, keyboard activation and the vector table; all KV selectors, extrema, default numerical results, zero capacity and slider keyboard input; pass@k defaults, c=0, c=n, n=1, clamping and keyboard changes.
- A further 12 EN/KO desktop/mobile renders cover the 5.3, 8.1 and 13.1 figure replacements, with no JavaScript errors, KaTeX errors, missing pages or document overflow.
- Browser evidence is recorded in `docs/growth-2026-11-18-visuals-browser.json`.
- `npm run test:content` was run during concurrent edits: 9/10 checks passed, with only stale inspected-file hashes in the review ledger failing. The integration owner updates hashes after the final editorial inspection and reruns the full suite/build.
- `git diff --check` passed for the working tree at the time of these checks. Final deployment build and complete regression checks belong to the integration pass.

## Figure follow-up

The following findings were checked against current page references, not only loose files:

| Page | Finding | Editorial action |
|---|---|---|
| 5.3 Expert parallelism | The generated figure asserts “PERFECT OVERLAP,” although the text does not establish that a particular workload hides all communication. | Removed the claim-bearing image; preserved dispatch/compute/combine and added a 4 ms communication / 3 ms independent-work example. |
| 8.1 Power law | A synthetic-looking scatter plot uses numerical loss/compute axes without identifying a measurement source in its caption. | Removed it; added the explicit equation-based 2^−0.05 ≈ 0.966 example and qualified the nearby extrapolation claim. Existing controlled interaction remains. |
| 13.1 PTQ versus QAT | Generated landscapes label a QAT “optimal robust minimum” and PTQ “suboptimal” point, overstating a universal outcome that nearby prose correctly rejects. | Removed the figure and misleading Korean caption; retained the qualified mechanism and STE example with an exported-artifact comparison note. |
| 14.5 GraphRAG | Large generated pipeline labels “GLOBAL ANSWER” immediately after communities and does not visually separate precomputed community reports from query-time synthesis. | Prefer a future code-native localized flow diagram with index/query boundaries; the four-stage prose currently carries the more precise explanation. |

Other thumbnail-level risks include visually dense raster labels on small screens, artificial 3D perspective in flow diagrams, and generated plots that can resemble measured data. Several extreme examples (the fabricated-looking Elo distribution, the KV cube crushing a GPU, and the old Chinchilla bar chart) are already unused by current pages. Do not reintroduce them in promotional material. No claim is made here that all remaining live figures have been validated against primary sources.

## Figure-change inspection hashes

These hashes record the inspected files after the narrow bilingual figure replacement and adjacent explanations; they do not certify every pre-existing technical assertion.

| File | SHA-256 |
|---|---|
| `src/pages/chapter-5/expert-parallelism.mdx` | `84334a58a548dd398dec398808c5602e433a64a57ea28c5465776f6694232c07` |
| `src/pages/ko/chapter-5/expert-parallelism.mdx` | `9ac7132b38980f8d85fc9fb83200b0814b80d6963b019c03b8c2ea4ef7a99ff3` |
| `src/pages/chapter-8/power-law.mdx` | `4a7985e2e292146826fa76fc39706838e6e5246fcb507f4fec94dc263ef2ba8a` |
| `src/pages/ko/chapter-8/power-law.mdx` | `5d01ec1c25346796843c2fe7b635968a64b28f6333b2925a32884fb9364b884e` |
| `src/pages/chapter-13/ptq-vs-qat.mdx` | `6961419a7297e663a0894db1a8fd075b0153ae00ca4a904bbf5137dde68f3eda` |
| `src/pages/ko/chapter-13/ptq-vs-qat.mdx` | `955b46bf42c872bd7857f3540012dfdc10b418008246ad5de0f6d42bc333c1c0` |
