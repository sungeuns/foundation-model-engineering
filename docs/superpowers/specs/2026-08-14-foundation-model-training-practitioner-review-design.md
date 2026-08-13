# Foundation Model Training Practitioner Review Design

**Date:** 2026-08-14

## Purpose

Revise the bilingual textbook so an AI engineer can use it not only to understand foundation-model methods, but also to plan, run, observe, recover, evaluate, and release pre-training, continued pre-training, supervised fine-tuning, parameter-efficient fine-tuning, and preference-optimization work.

The work also repairs verified technical errors, closes substantive English/Korean drift, restores navigation completeness, and strengthens `AGENTS.md` so later contributors preserve these properties.

## Scope and Priorities

### Priority 0: Correct misleading material

Repair examples or claims that could produce an incorrect implementation or decision:

- the non-resumable distributed data-streaming example;
- attention examples without causal or padding semantics;
- the tensor-parallel example with incorrect bias reduction and backward behavior;
- the ZeRO-3 example that materializes the full model before partitioning;
- the ExaFLOP/PFLOP conversion error;
- the English SFT claim that prompt loss masking proportionally reduces activation memory;
- incomplete or misleading KTO, PPO, and DPO training loops;
- categorical causal claims about loss spikes, model calibration, grokking, and over-training.

If a compact example cannot honestly reproduce production semantics, replace it with a tested invariant, framework-native snippet, or configuration contract and label it as deliberately simplified.

### Priority 1: Add the missing operational path

Connect Chapters 6–10 and 17 into an explicit lifecycle:

1. define immutable data and tokenizer contracts;
2. estimate memory, compute, communication, storage, and recovery cost;
3. run small scaling and systems pilots;
4. pre-train with observability, abort criteria, and atomic checkpoints;
5. perform domain-adaptive continued pre-training when justified;
6. run SFT or PEFT with tokenizer-native chat and loss-mask contracts;
7. apply preference optimization only after validating data and reference-policy contracts;
8. evaluate domain gains, base-capability retention, safety, format, latency, and cost;
9. release through shadow, canary, ramp-up, and rehearsed rollback gates.

### Priority 2: Repair book-wide integrity

- Make the real EN/KO page inventory, `src/data/chapters.js`, `docs/chapter_list.md`, and review ledgers agree by slug, number, and order.
- Correct substantive EN/KO drift, beginning with Chapters 6, 9, 17, and 20.
- Recalibrate claims found by the full-book risk scan, especially unsupported uses of “SOTA,” “industry standard,” “proved,” “always,” and “never.”
- Reverify time-sensitive model, product, benchmark, price, license, and availability statements against current primary sources, with an explicit `as of 2026-08-14` date.
- Treat undisclosed commercial architecture or training details as undisclosed rather than inferred.

## New Continued Pre-training Unit

Create matching pages:

- `src/pages/chapter-8/continued-pretraining-and-domain-adaptation.mdx`
- `src/pages/ko/chapter-8/continued-pretraining-and-domain-adaptation.mdx`

Register them as Chapter 8.5 and update both navigation surfaces and the chapter inventory.

The page will distinguish continued pre-training, DAPT, TAPT, and continual learning; explain base-versus-instruct checkpoint selection; cover domain/general replay mixtures, tokenizer and vocabulary decisions, pilot sizing, learning-rate and token-budget selection, distributed checkpointing, forgetting and alignment erosion, evaluation gates, rollback, and the transition into SFT and preference optimization.

The existing short continued-pre-training section in Chapter 9.5 will become a concise decision guide and cross-link rather than duplicate the new unit. The heuristic “CPT teaches what to know; SFT teaches how to act” will be retained only as a useful first approximation, not a strict separation.

## Operational Contracts for Training Pages

A newly created or substantially revised training page must make the following inspectable:

- **Inputs:** base checkpoint, tokenizer, chat template if applicable, dataset manifest, code/config/container versions, and licenses or usage constraints;
- **Decisions:** objective, mixture weights, sequence and packing policy, precision, optimizer, learning-rate schedule, global token batch, parallelism topology, and token budget;
- **Resource model:** parameter, optimizer, gradient, activation, temporary-buffer, collective, checkpoint, and evaluation costs with assumptions;
- **Observability:** token-normalized loss, per-domain validation, gradients and activations, nonfinite/overflow counters, throughput, MFU, data wait, collectives, stragglers, and sampled batch identifiers;
- **Recovery:** atomic checkpoint contents, completion markers and checksums, restore drills, changed-world-size constraints, and continuation-equivalence checks;
- **Failure policy:** explicit pause, abort, rollback, and investigation criteria;
- **Evaluation:** domain gain, base retention, safety, calibration or confidence where relevant, format/tool behavior, latency, cost, and uncertainty;
- **Release:** immutable artifact bundle, candidate/champion identity, staged traffic policy, automated thresholds, owner, and audit record.

## Content Verification Architecture

Add a repository-local validator under `scripts/` and a package script that checks deterministic editorial contracts before the expensive Astro build. It will verify:

- one-to-one EN/KO file pairing;
- byte-one frontmatter and expected layout/lang fields;
- navigation and chapter-list inventory equality;
- final `Quizzes` then `References` ordering;
- three to six quizzes with the required markup;
- citation target/reference-anchor integrity;
- local MDX import existence;
- references are the final section;
- no future-dated `as of` snapshots;
- review ledgers do not claim complete inventory while omitting current pages.

Semantic EN/KO parity cannot be proven by line counts. For every changed pair, a reviewer checklist will compare section roles, formulas, code behavior, tables, limitations, quizzes, and references.

## Research and Evidence Policy

Use primary sources for technical corrections: official framework documentation, original papers, model cards, technical reports, repositories, and release posts. Provider materials support only provider claims. Current ecosystem statements must be dated. Mixed provider-reported benchmarks must retain methodology notes and missing values.

Exact architecture, price, benchmark, training-token, or availability facts will not be added unless the source discloses them. Inference will be labeled and kept narrow.

## Implementation Boundaries

- Preserve the user's untracked transformation scripts and patch file.
- Do not redesign unrelated visual components.
- Do not add a Chapter 21; integrate the practitioner workflow into the chapters where each decision is made.
- Prefer focused operational sections and corrected examples over wholesale stylistic rewrites.
- Update English first, then Korean in the same task.
- Update home-page “Last update” dates only after the full content pass is complete.

## Verification and Completion Criteria

Completion requires evidence for all of the following:

1. All changed EN/KO pairs have substantive parity.
2. The canonical inventory agrees across filesystem, navigation, chapter list, and current audit ledger.
3. Technical claims introduced or retained in time-sensitive sections have current primary-source support and an explicit snapshot date where needed.
4. Runnable code introduced by this work has a smoke test; simplified code is labeled with the missing production semantics.
5. The repository content validator passes.
6. `npm run build` passes with Node 22 or newer, using the WSL-native Node runtime for this checkout.
7. Changed interactive pages, if any, are exercised at desktop and narrow widths.
8. `git diff --check` and the final diff show no accidental unrelated changes.
9. The English and Korean home-page dates are updated only after all content and verification work is complete.

## Risks and Mitigations

- **Scope expansion:** Work in coherent passes—integrity, pre-training, post-training, global claim calibration—each independently reviewable.
- **Current information churn:** Prefer stable mechanisms; date and source unavoidable snapshots.
- **Executable examples becoming framework tutorials:** Teach contracts and failure modes first; keep framework snippets short and version-aware.
- **Translation drift:** Complete each English/Korean pair in one task and validate immediately.
- **False confidence from mechanical checks:** Use validators for deterministic contracts and retain human semantic review for technical meaning.
