# Foundation Model Engineering: Repository Instructions

These instructions apply to the entire repository. They consolidate the durable content-writing and review rules in `.agent/skills/`, `docs/content_review_track_bc.md`, `docs/exhaustive_subchapter_audit.md`, `docs/editorial_rewrite_worklog.md`, `docs/chapter_review_checklist.md`, and `docs/terminology_dict.txt`.

## Project Goal and Reader

- Treat this project as a bilingual, technically serious living textbook for AI engineers and research-oriented readers.
- Preserve the theory-to-production bridge. Explain not only what a method is, but which bottleneck it addresses, what it costs, how it fails, and how a practitioner would validate it.
- Prefer a clear teaching arc: motivation -> intuitive model or analogy -> core mechanism -> technical detail -> engineering implications -> limitations/debates -> practical takeaway.
- Add memorable facts, development stories, or counterintuitive examples only when they are documented. Do not turn marketing anecdotes into technical evidence.
- Avoid hype, generic AI filler, and categorical claims about unsettled research. Distinguish established results, emerging patterns, provider claims, and editorial inference.

## Research and Claim Discipline

- Browse for any time-sensitive model, product, benchmark, price, license, API, or ecosystem claim. Use current sources rather than model memory.
- Prefer sources in this order:
  1. official technical report, paper, model card, documentation, repository, or release post;
  2. independent benchmark methodology or primary dataset/paper;
  3. reputable secondary reporting only for context that the primary source does not cover.
- A product announcement is evidence of what a lab claims, not independent proof that the claim generalizes.
- Never invent architecture, parameter counts, active parameters, training tokens, data mixtures, benchmark scores, prices, context limits, release dates, or availability.
- Explicitly label release state:
  - **released/open-weight** only when usable weights are actually public;
  - **preview/API-only** when access is limited to a hosted product or preview;
  - **announced/planned** when weights, reports, or access are promised but not yet available.
- When a report omits architecture, data, or training details, say that the details are undisclosed. Do not fill the gap with assumptions from an earlier family member.
- Separate measured fact from inference with wording such as “the model card reports,” “the release post claims,” or “this suggests.” Keep the inference narrow.
- Give every time-sensitive synthesis an “as of YYYY-MM-DD” date.

## Benchmark Hygiene

- Do not compare scores unless the task set, split, harness, tool access, reasoning/effort level, sampling, context budget, grader, and report date are compatible.
- If a table mixes provider-reported results, say so and keep methodology notes close to the table.
- Treat a model plus scaffold as the evaluated system for agentic benchmarks. Do not attribute the full result to model weights alone.
- Never render a missing value as zero. Use “not reported” or omit the point.
- Avoid a single “best model” conclusion. Discuss the quality/cost/latency/context/openness/safety Pareto surface and recommend private evaluations for production decisions.
- Preserve source precision: index scores, Elo ratings, percentages, and throughput are different units and must not share misleading formatting.

## Bilingual Content

- Create or revise the English page first, then update the matching Korean page in the same change.
- Keep EN/KO pages equivalent in structure, formulas, code, examples, quizzes, limitations, and references. They need not be literal translations.
- English pages and English interactive UI must contain only English prose.
- Write natural Korean. Avoid sentence-by-sentence machine translation and unnecessary English noun chains. Keep an English technical term when it is the clearer professional convention.
- Use `docs/terminology_dict.txt` as the terminology baseline; update it when introducing a durable new translation.
- In Korean Markdown, keep a space after closing emphasis before a Korean particle when needed for stable rendering: `**용어** 는`, not `**용어**는`.

## MDX and Chapter Structure

- Inspect `docs/chapter_list.md`, the previous/next page, and `src/data/chapters.js` before adding or moving content.
- Every MDX file starts at byte 1 with frontmatter:
  - English layout: `../../layouts/BookLayout.astro`
  - Korean layout: `../../../layouts/BookLayout.astro`
  - include `title` and `lang`.
- Use LaTeX for formal equations and define every symbol near its first use.
- Code must be runnable or clearly marked as a deliberately simplified educational implementation. Prefer realistic tensor shapes and concise PyTorch examples; do not present pseudocode as executable code.
- The ending order is body/wrap-up -> `## Quizzes` -> `## References`. Nothing follows References.
- Include 3–6 reasoning-oriented quizzes when a page is created or substantially revised. Use exactly:

  ```mdx
  <details>
  <summary>Quiz 1: Question?</summary>
  *Answer in italics.*
  </details>
  ```

- Cite in prose with `[[N]](#ref-N)` so brackets survive rendering. Define matching references as ordered items with `<a id="ref-N"></a>`.
- Verify that every citation maps to the intended claim and that every external link resolves.
- If adding or removing a page, update `src/data/chapters.js`, `docs/chapter_list.md`, and both language navigation surfaces.

## Interactive Content and Visuals

- Add an interaction only when it teaches a relationship that prose or a small static table cannot explain as well.
- Keep components in `src/components/chapter-N/` and chapter-local Vanilla CSS beside them. Use an appropriate Astro client directive.
- Components shared by EN/KO pages must accept a locale or language prop. Localize visible labels, help text, accessibility text, empty states, units, and source notes.
- Interactions must remain truthful under every control state:
  - filtering also updates selections and rankings;
  - hidden or missing data is not silently substituted;
  - units and axis scales remain correct;
  - dates and source snapshots are visible;
  - long labels do not make points or controls unusable;
  - keyboard focus, button semantics, SVG titles, and readable contrast are preserved.
- For dense comparison plots, prefer a selectable list/legend or collision-safe labels over printing every model name on the chart.
- Store chapter images in `src/assets/images/chapter-N/`. Use descriptive alt text and a source caption. Attribute external figures to their original source and generated figures to the actual generation method.
- Inspect interactive pages at desktop and narrow/mobile widths after changes.

## Editing and Review

- Make evidence-calibrated edits; do not preserve stale or misleading prose merely for minimal diffs.
- Check narrative continuity with adjacent pages and match the chapter’s existing voice.
- Review for duplicated paragraphs, awkward English, literal Korean, broken math, incorrect code, stale product claims, promotional tone, and EN/KO drift.
- For frontier topics, include “what is disclosed” and “what remains undisclosed or debated.”
- When reviewing “the whole book,” use mechanical scans to find risky patterns, then inspect and fix the affected pages. A clean grep is not proof of full editorial quality.
- Preserve unrelated user changes. Use WSL Git for this repository because Windows Git may report false modifications from line-ending differences.


## Canonical Inventory and Audit Evidence

- Treat the actual EN/KO MDX file pairs, `src/data/chapters.js`, `docs/chapter_list.md`, and the current review ledger as one **canonical inventory**. Before a build, compare slug, number, and order rather than checking counts alone.
- Run `npm run test:content` whenever pages, navigation, references, or audit ledgers change.
- A **review ledger** may mark an item complete only when the current file was inspected and the date or commit providing that evidence is recorded. Adding a page must make it visibly unreviewed until that inspection happens.

## Training and Adaptation Examples

- Every new or substantially revised training page must state its input artifacts, objective, decisive hyperparameters, memory/compute assumptions, observable metrics, failure or abort conditions, checkpoint contents, offline evaluations, and release or rollback gate.
- SFT examples must use the model's **tokenizer-native chat template**. Verify train/serve template parity, BOS/EOS behavior, `add_generation_prompt`, truncation, padding, assistant-span loss masks, and whether packed samples can attend across boundaries.
- SFT, DPO, KTO, PPO, and related code must state prompt/completion masks, special-token handling, reference-checkpoint identity, response-length policy, and variable-length batch semantics.
- A runnable or production-grade label is allowed only for **smoke-tested** code with realistic shape, dtype, device, masking, and distributed assumptions. Put a limitation block immediately above deliberately simplified code and list the missing production semantics.
- Resource estimates must separate parameters, gradients, optimizer states, activations, temporary buffers, collectives, checkpoints, and evaluation overhead. State precision, sharding, recomputation, sequence length, and active-expert assumptions.
- Observability guidance must include token-normalized training and validation loss, useful domain slices, nonfinite or overflow counts, gradient/activation norms, throughput, MFU, data wait, collectives or stragglers, and reconstructable batch identifiers.

## Data and Evaluation Isolation

- Record dataset provenance, license or consent constraints, PII/secrets handling, deletion lineage, filter versions, mixture weights, tokenizer version, shard hashes, and sample identifiers in an immutable manifest.
- Perform exact/near deduplication and semantic clustering before train/dev/test assignment. Keep related documents, conversations, entities, and synthetic siblings in one split.
- Put public benchmarks, private release sets, prompts, rubrics, semantic neighbors, and teacher-generated variants in **evaluation quarantine** for every pre-training and post-training corpus.
- For synthetic or feedback data, retain teacher/judge model version, prompt, decoding settings, seed, rejection reason, annotator or verifier provenance, yield by slice, and human-audit results.

## Artifact and Recovery Contracts

- Treat base model, tokenizer, chat template, adapter, generation configuration, tool schema, safety policy, code/config/container versions, and their hashes as one immutable **artifact bundle**.
- A training checkpoint must include sharded model and optimizer state, scheduler, gradient scaler or FP8 state, global step and tokens, RNG state, sampler state, and the exact **data cursor** plus dataset/tokenizer/config hashes.
- Publish distributed checkpoints atomically with checksums and a completion marker. Document retention, remote replication, changed-world-size limits, restore drills, and continuation-equivalence checks.
- Define pause, abort, rollback, and last-known-good switching thresholds before a run or rollout. Include an owner, observation window, hysteresis where needed, and a periodic **rollback rehearsal**.
- A release artifact must pass domain, base-capability-retention, safety, format/tool, latency, cost, and error-rate gates with paired uncertainty or justified sample-size analysis; averages must not hide critical slice failures.

## Time-sensitive Tables and Claims

- Every current/latest/SOTA comparison, price, license, availability statement, or mutable table/component must show `as of YYYY-MM-DD`, use row-level primary sources, and preserve missing values as `not reported`.
- Reverify the snapshot immediately before publication. Do not carry a future-dated snapshot or stale provider status into a new release.
- Never infer undisclosed architecture, parameter counts, active parameters, data mixtures, context limits, or training recipes in prose, quizzes, code, or visuals; write `undisclosed` and separate provider claims from editorial inference.
## Verification Before Handoff

1. Confirm changed EN/KO pairs have substantive parity.
2. Confirm citations, reference anchors, MDX imports, and local assets resolve.
3. Run the repository with Node 22 or newer:

   ```bash
   npm run build
   ```

4. Render and exercise every changed interactive component, including filters, axis/metric changes, keyboard selection, empty/missing-data states, and mobile layout.
5. Review `git diff --check` and the final diff for accidental unrelated edits.
6. Update the “Last update” date in `src/pages/index.astro` and `src/pages/ko/index.astro` only after the content pass is complete.

