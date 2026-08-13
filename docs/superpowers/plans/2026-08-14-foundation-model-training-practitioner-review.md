# Foundation Model Training Practitioner Review Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the bilingual book into a technically reliable, operationally useful guide for pre-training, continued pre-training, fine-tuning, post-training, evaluation, and release while repairing full-book integrity and evidence problems.

**Architecture:** Add deterministic repository-level content contracts first, then revise one English/Korean unit at a time. Stable mechanisms and operational contracts remain in the chapter prose; time-sensitive ecosystem facts carry dated primary sources. Mechanical validation proves inventory and MDX invariants, while pairwise editorial review proves semantic parity.

**Tech Stack:** Astro 6, MDX, React 19, Node.js 22+, Node built-in test runner, WSL Git, primary technical papers and official framework documentation.

## Global Constraints

- English pages are revised first and matching Korean pages are completed in the same task.
- Preserve formulas, code behavior, examples, quizzes, limitations, and references across EN/KO pairs.
- Use primary sources for technical and time-sensitive claims; date current-state syntheses `as of 2026-08-14`.
- Do not invent undisclosed architecture, data, training, benchmark, price, license, or availability details.
- Runnable code must be smoke-tested; otherwise label it as deliberately simplified and enumerate omitted production semantics.
- Keep body/wrap-up -> `## Quizzes` -> `## References`, with nothing after References.
- Preserve all unrelated user files, including the untracked root transformation scripts and patch.
- Use `/home/sungeuns/.vscode-server/bin/1b6a188127eeaf9194f945eb6eb89a657e93c54c/node` for WSL-native Node 24 verification in this checkout.

---

### Task 1: Add deterministic content-contract tests and repair canonical inventory

**Files:**
- Create: `scripts/content-contract.test.mjs`
- Modify: `package.json`
- Modify: `src/data/chapters.js`
- Modify: `docs/chapter_list.md`
- Modify: `docs/chapter_review_checklist.md`
- Modify: `docs/exhaustive_subchapter_audit.md`
- Modify: `docs/editorial_rewrite_worklog.md`

**Interfaces:**
- Consumes: filesystem page inventory and the current navigation/document registries.
- Produces: `npm run test:content`, a deterministic contract used by every later task.

- [ ] **Step 1: Write inventory and MDX contract tests**

Create Node tests that:

```js
test('every English page has one Korean peer', () => { /* compare relative slugs */ });
test('navigation contains every page exactly once in chapter order', () => { /* parse chapters.js paths */ });
test('chapter list contains every numbered navigation item', () => { /* compare numbers and titles */ });
test('MDX frontmatter starts at byte one and uses the expected layout and lang', () => {});
test('every page ends with Quizzes then References and has 3-6 valid quizzes', () => {});
test('citation targets, reference anchors, and local imports resolve', () => {});
test('complete review ledgers include the current inventory', () => {});
```

- [ ] **Step 2: Run the tests and verify RED**

Run:

```bash
/home/sungeuns/.vscode-server/bin/1b6a188127eeaf9194f945eb6eb89a657e93c54c/node --test scripts/content-contract.test.mjs
```

Expected failures include missing navigation/list entries for 13.5 and 16.3, stale review ledgers, and leading bytes before frontmatter in the identified Chapter 6 pages.

- [ ] **Step 3: Repair the inventory at the source**

Add 13.5 `advanced-quantization`, restore 16.3 `self-improving-agents`, renumber Chapter 16 consistently, remove leading bytes before frontmatter, and update ledgers so their complete claims match all current pages.

- [ ] **Step 4: Add the package script and verify GREEN**

Add:

```json
"test:content": "node --test scripts/content-contract.test.mjs"
```

Run the direct Node command and confirm all contract tests pass.

- [ ] **Step 5: Commit**

```bash
git add scripts/content-contract.test.mjs package.json src/data/chapters.js docs/chapter_list.md docs/chapter_review_checklist.md docs/exhaustive_subchapter_audit.md docs/editorial_rewrite_worklog.md src/pages/chapter-6/synthetic-data-for-pre-training.mdx src/pages/ko/chapter-6/infrastructure.mdx
git commit -m "test: enforce bilingual content inventory"
```

### Task 2: Strengthen repository authoring rules

**Files:**
- Modify: `AGENTS.md`

**Interfaces:**
- Consumes: audit findings and Task 1's executable contracts.
- Produces: durable rules for training examples, artifacts, evaluation, current claims, and audit evidence.

- [ ] **Step 1: Add rule-presence tests and verify RED**

Extend `scripts/content-contract.test.mjs` to assert that `AGENTS.md` explicitly covers canonical inventory equality, training operational contracts, tokenizer/chat-template parity, split-after-dedup and eval quarantine, artifact hashes and rollback, runnable-versus-simplified code, current snapshot dating, and evidence-backed ledger completion.

- [ ] **Step 2: Add focused rules without duplicating existing guidance**

Add sections for `Training and Adaptation Examples`, `Data and Evaluation Isolation`, `Artifact and Recovery Contracts`, and `Inventory and Audit Evidence`. Require input artifacts, decision parameters, resource assumptions, observability, abort criteria, complete checkpoints, release gates, and semantic EN/KO parity.

- [ ] **Step 3: Verify GREEN and commit**

```bash
/home/sungeuns/.vscode-server/bin/1b6a188127eeaf9194f945eb6eb89a657e93c54c/node --test scripts/content-contract.test.mjs
git add AGENTS.md scripts/content-contract.test.mjs
git commit -m "docs: strengthen training content rules"
```

### Task 3: Add the continued pre-training and domain-adaptation unit

**Files:**
- Create: `src/pages/chapter-8/continued-pretraining-and-domain-adaptation.mdx`
- Create: `src/pages/ko/chapter-8/continued-pretraining-and-domain-adaptation.mdx`
- Modify: `src/pages/chapter-9/synthetic-instructions-and-self-instruct.mdx`
- Modify: `src/pages/ko/chapter-9/synthetic-instructions-and-self-instruct.mdx`
- Modify: `src/data/chapters.js`
- Modify: `docs/chapter_list.md`
- Modify: `docs/terminology_dict.txt`
- Modify: `scripts/content-contract.test.mjs`

**Interfaces:**
- Consumes: Chapter 8 scaling concepts and Chapter 9 adaptation concepts.
- Produces: Chapter 8.5 and a decision bridge into SFT and preference optimization.

- [ ] **Step 1: Add required-section tests and verify RED**

Assert both pages exist and contain equivalent roles for checkpoint choice, DAPT/TAPT terminology, data mixture and replay, tokenizer decisions, pilot design, checkpoint/resume, retention evaluation, stopping gates, rollback, quizzes, and primary references.

- [ ] **Step 2: Research current primary sources**

Use the original DAPT/TAPT paper, continual-learning/forgetting research, official distributed checkpoint documentation, and official tokenizer/framework documentation. Record current documentation claims as of 2026-08-14.

- [ ] **Step 3: Write the English page**

Include a decision table, a staged runbook, explicit artifact manifest, small-pilot recipe, evaluation matrix, failure modes, and 3–6 reasoning quizzes. Explain that “knowledge versus behavior” is a heuristic and that CPT can change behavior and alignment.

- [ ] **Step 4: Write the Korean peer and replace Chapter 9.5 duplication with a cross-link**

Translate by meaning, update terminology, and keep section roles, formulas, tables, examples, quizzes, and references equivalent.

- [ ] **Step 5: Verify and commit**

Run the content tests and Astro build, then commit the exact files above.

### Task 4: Repair the pre-training data and tokenizer chapters

**Files:**
- Modify: `src/pages/chapter-6/data-engineering-at-scale.mdx`
- Modify: `src/pages/ko/chapter-6/data-engineering-at-scale.mdx`
- Modify: `src/pages/chapter-6/tokenization-science.mdx`
- Modify: `src/pages/ko/chapter-6/tokenization-science.mdx`
- Modify: `src/pages/chapter-6/synthetic-data-for-pre-training.mdx`
- Modify: `src/pages/ko/chapter-6/synthetic-data-for-pre-training.mdx`
- Modify: `scripts/content-contract.test.mjs`

**Interfaces:**
- Produces: dataset manifest, resumable cursor contract, tokenizer acceptance suite, and evidence-calibrated synthetic-data pipeline.

- [ ] **Step 1: Add tests for the required operational sections and known false patterns**

Assert that EN/KO pairs contain dataset lineage, license/PII/deletion policy, split-after-dedup, eval quarantine, mixture version, document boundary/packing, sample identifiers, atomic data cursor, tokenizer round-trip/fertility/special-token/hash checks, and synthetic provenance/judge calibration. Assert removal or qualification of `SOTA 2026`, `630-line`, “virtually infinite,” and “exponentially more.”

- [ ] **Step 2: Verify RED and research primary sources**

Use official tokenizer documentation, original deduplication/data papers where claims are quantitative, and framework data-loading behavior documentation.

- [ ] **Step 3: Replace misleading code with contracts and smoke-tested helpers**

Do not claim exact-once semantics from `IterableDataset`. Define a global manifest cursor, deterministic rank/worker partition, atomic checkpoint coupling, checksums, and explicit at-least-once versus exact-replay guarantees.

- [ ] **Step 4: Synchronize EN/KO, verify, and commit**

Run content tests, any extracted smoke test, and the Astro build.

### Task 5: Repair training stability and distributed-systems examples

**Files:**
- Modify: `src/pages/chapter-6/large-scale-training-stability.mdx`
- Modify: `src/pages/ko/chapter-6/large-scale-training-stability.mdx`
- Modify: `src/pages/chapter-6/infrastructure.mdx`
- Modify: `src/pages/ko/chapter-6/infrastructure.mdx`
- Modify: `src/pages/chapter-7/data-parallelism.mdx`
- Modify: `src/pages/ko/chapter-7/data-parallelism.mdx`
- Modify: `src/pages/chapter-7/model-and-pipeline-parallelism.mdx`
- Modify: `src/pages/ko/chapter-7/model-and-pipeline-parallelism.mdx`
- Modify: `src/pages/chapter-7/zero-redundancy-optimizer.mdx`
- Modify: `src/pages/ko/chapter-7/zero-redundancy-optimizer.mdx`
- Modify: `src/pages/chapter-7/flash-attention.mdx`
- Modify: `src/pages/ko/chapter-7/flash-attention.mdx`
- Modify: `scripts/content-contract.test.mjs`

**Interfaces:**
- Produces: a compute/parallelism worksheet, observability and spike-triage runbook, correct framework-native examples, and complete distributed checkpoint contract.

- [ ] **Step 1: Add RED checks for causal semantics and unsafe claims**

Require causal/padding behavior, dtype/device guards, TP subgroups or framework-native TP APIs, sharded initialization before materialization, DDP accumulation/no-sync semantics, and checkpoint state covering optimizer/scheduler/scaler/RNG/data cursor.

- [ ] **Step 2: Research exact APIs and algorithms from official documentation**

Verify the current PyTorch SDPA backend API, tensor-parallel APIs, FSDP/distributed checkpoint APIs, and DeepSpeed initialization semantics as of 2026-08-14.

- [ ] **Step 3: Correct explanations and examples**

Separate attention-logit controls from final LM-logit soft capping, explain bounded cross-entropy logit gradients, qualify OPT/DeepSeek case-study facts, distinguish Megatron sequence parallelism from long-context context parallelism, and replace non-autograd collectives and unsafe model construction.

- [ ] **Step 4: Add the incident runbook and systems pilot worksheet**

Cover replay of suspect batches, data-versus-numerics-versus-hardware isolation, per-layer metrics, MFU and stragglers, 1/8/64-GPU pilots, checkpoint bandwidth, restore drills, and go/no-go bands.

- [ ] **Step 5: Synchronize, verify, and commit**

### Task 6: Correct scaling-law claims and add pilot methodology

**Files:**
- Modify: `src/pages/chapter-8/power-law.mdx`
- Modify: `src/pages/ko/chapter-8/power-law.mdx`
- Modify: `src/pages/chapter-8/chinchilla-optimality.mdx`
- Modify: `src/pages/ko/chapter-8/chinchilla-optimality.mdx`
- Modify: `src/pages/chapter-8/over-training-vs-optimal-training.mdx`
- Modify: `src/pages/ko/chapter-8/over-training-vs-optimal-training.mdx`
- Modify: `src/pages/chapter-8/transfer-learning-and-generalization.mdx`
- Modify: `src/pages/ko/chapter-8/transfer-learning-and-generalization.mdx`
- Modify: `scripts/content-contract.test.mjs`

**Interfaces:**
- Produces: correct compute units, constrained pilot fitting, uncertainty-aware extrapolation, and safe checkpoint selection guidance.

- [ ] **Step 1: Add a failing unit assertion for ExaFLOP conversion and required pilot sections**

Assert `1 EFLOP = 10^18 FLOPs = 1,000 PFLOPs`, presence of multi-seed/model/data allocation guidance, held-out largest-scale forecast error, uncertainty intervals, achieved-FLOPs budgeting, and downstream checkpoint probes.

- [ ] **Step 2: Correct the numerical example and research primary scaling papers**

Reproduce the conversion and fitting calculation independently. Distinguish empirical fits from laws, and avoid treating the Chinchilla ratio or over-training thresholds as universal constants.

- [ ] **Step 3: Reframe contested claims**

Treat emergence, grokking, weak-to-strong generalization, entropy minimization, and adaptation degradation as regime-dependent evidence. Replace unconditional “continue training” advice with held-out/OOD stopping criteria.

- [ ] **Step 4: Synchronize, verify, and commit**

### Task 7: Make SFT, data curation, and PEFT operationally correct

**Files:**
- Modify: `src/pages/chapter-9/sft-fundamentals.mdx`
- Modify: `src/pages/ko/chapter-9/sft-fundamentals.mdx`
- Modify: `src/pages/chapter-9/dataset-quality-vs-quantity.mdx`
- Modify: `src/pages/ko/chapter-9/dataset-quality-vs-quantity.mdx`
- Modify: `src/pages/chapter-9/parameter-efficient-fine-tuning-peft.mdx`
- Modify: `src/pages/ko/chapter-9/parameter-efficient-fine-tuning-peft.mdx`
- Modify: `scripts/content-contract.test.mjs`

**Interfaces:**
- Produces: tokenizer-native SFT contract, leakage-safe data operations, QLoRA and memory planning, and reversible adapter deployment.

- [ ] **Step 1: Add RED checks for known SFT/PEFT errors and required sections**

Require `apply_chat_template`, assistant-span loss masks, EOS/BOS and truncation policy, packing isolation, train/serve template parity, cluster split after dedup, QLoRA NF4/double-quantization/compute dtype, memory budget, adapter/base/tokenizer/template identity, and idempotent merge/unmerge cautions. Reject the prompt-mask activation-memory claim.

- [ ] **Step 2: Research official Transformers, PEFT, bitsandbytes, and TRL documentation**

- [ ] **Step 3: Correct the English chapters and bring across the stronger Korean operational material**

Remove unsupported universal duplication thresholds and reduce exploratory Quantum-PEFT material to a clearly labeled research note unless broader evidence supports it.

- [ ] **Step 4: Produce natural Korean parity, verify, and commit**

### Task 8: Correct preference-optimization and human-feedback chapters

**Files:**
- Modify: `src/pages/chapter-10/human-feedback-loop.mdx`
- Modify: `src/pages/ko/chapter-10/human-feedback-loop.mdx`
- Modify: `src/pages/chapter-10/ppo-proximal-policy-optimization.mdx`
- Modify: `src/pages/ko/chapter-10/ppo-proximal-policy-optimization.mdx`
- Modify: `src/pages/chapter-10/dpo.mdx`
- Modify: `src/pages/ko/chapter-10/dpo.mdx`
- Modify: `src/pages/chapter-10/kto-and-ipo.mdx`
- Modify: `src/pages/ko/chapter-10/kto-and-ipo.mdx`
- Modify: `src/pages/chapter-10/alignment-tax.mdx`
- Modify: `src/pages/ko/chapter-10/alignment-tax.mdx`
- Modify: `scripts/content-contract.test.mjs`

**Interfaces:**
- Produces: correct PPO/DPO/KTO contracts, feedback-data bias controls, and calibrated alignment-tax claims.

- [ ] **Step 1: Add RED checks for required algorithm and data contracts**

Require PPO value head/value loss, GAE, per-token KL-to-reference, response masks, rollout consistency, and policy lag; DPO same-prompt pairs, completion masks, EOS/truncation, reference identity, beta sweep, length confounds, and margin/KL/retention monitoring; KTO reference-point semantics that match the cited algorithm or official implementation.

- [ ] **Step 2: Compare every equation and code fragment with original papers and official TRL implementations**

- [ ] **Step 3: Replace misleading pseudo-production loops**

Use short framework-native examples or algorithm skeletons labeled with omissions. Add annotator calibration, tie/abstain, position randomization, propensity/exposure logging, privacy/consent, sibling holdouts, and leakage controls.

- [ ] **Step 4: Fix gradient projection parameter alignment and recalibrate calibration claims**

- [ ] **Step 5: Synchronize, verify, and commit**

### Task 9: Complete production evaluation, release, and Chapter 17 parity

**Files:**
- Modify: `src/pages/chapter-17/academic-benchmarks.mdx`
- Modify: `src/pages/ko/chapter-17/academic-benchmarks.mdx`
- Modify: `src/pages/chapter-17/elo-rating-and-leaderboards.mdx`
- Modify: `src/pages/ko/chapter-17/elo-rating-and-leaderboards.mdx`
- Modify: `src/pages/chapter-17/llm-as-a-judge.mdx`
- Modify: `src/pages/ko/chapter-17/llm-as-a-judge.mdx`
- Modify: `src/pages/chapter-17/contamination-issues.mdx`
- Modify: `src/pages/ko/chapter-17/contamination-issues.mdx`
- Modify: `src/pages/chapter-17/production-evaluation-and-release-gates.mdx`
- Modify: `src/pages/ko/chapter-17/production-evaluation-and-release-gates.mdx`
- Modify: `scripts/content-contract.test.mjs`

**Interfaces:**
- Produces: statistical release gates, immutable artifact bundles, automated rollback runbooks, and semantically equivalent EN/KO evaluation guidance.

- [ ] **Step 1: Add RED checks for missing English sections**

Require fixed seeds/decoding, paired uncertainty, slice minima, sample-size rationale, baseline hashes, raw adjudication, latency/cost/error metrics, shadow/canary/ramp-up distinction, automatic thresholds with windows and hysteresis, last-known-good switching, rollback rehearsal, and eval-set maintenance.

- [ ] **Step 2: Port the stronger Korean material into English, then reconcile both directions**

- [ ] **Step 3: Correct contamination absolutes and threshold folklore**

Explain dynamic benchmark limitations, semantic/teacher contamination, and lineage from synthetic teacher prompts and rubrics. Do not call a defense “ultimate.”

- [ ] **Step 4: Synchronize, verify, and commit**

### Task 10: Resolve remaining full-book high-risk claims and parity drift

**Files:**
- Modify as evidence requires: matching EN/KO pages in Chapters 5, 11, 12, 14–16, 18–20
- Modify: `docs/exhaustive_subchapter_audit.md`
- Modify: `docs/chapter_review_checklist.md`
- Modify: `docs/editorial_rewrite_worklog.md`
- Modify: `scripts/content-contract.test.mjs`

**Interfaces:**
- Consumes: the audit's risk list and semantic section comparison.
- Produces: evidence-calibrated full-book text and a current, inventory-complete review record.

- [ ] **Step 1: Add current-snapshot and semantic-parity audit checks**

Mechanically list claims containing `SOTA`, `state-of-the-art`, `industry standard`, `proved`, `always`, `never`, current model names, prices, or availability. For each occurrence, record keep/qualify/remove and its source in the audit ledger.

- [ ] **Step 2: Reverify time-sensitive claims with primary sources**

Prioritize commercial model benchmarks, video models, frontier safety methods, retrieval, serving, multi-agent latent communication, interpretability, and Chapter 20. Mark undisclosed details explicitly.

- [ ] **Step 3: Reconcile the remaining substantive EN/KO drift**

Use section roles, tables, formulas, code, limitations, quizzes, and references—not line count—as the acceptance criteria. Correct the duplicated Korean Chapter 13 heading number during this pass.

- [ ] **Step 4: Update the audit ledgers with current date, scope, evidence, and remaining non-blocking debates**

- [ ] **Step 5: Run tests/build and commit**

### Task 11: Final verification and home-page update

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/pages/ko/index.astro`

**Interfaces:**
- Consumes: all completed content tasks.
- Produces: final dated bilingual release state.

- [ ] **Step 1: Run the complete content contract**

```bash
/home/sungeuns/.vscode-server/bin/1b6a188127eeaf9194f945eb6eb89a657e93c54c/node --test scripts/content-contract.test.mjs
```

- [ ] **Step 2: Run the complete Astro build**

```bash
/home/sungeuns/.vscode-server/bin/1b6a188127eeaf9194f945eb6eb89a657e93c54c/node ./node_modules/astro/bin/astro.mjs build
```

- [ ] **Step 3: Inspect changed pages and interactive components**

Render changed interactive pages at desktop and narrow widths; exercise controls, keyboard focus, filters, missing data, and long labels. If no interactive component changed, record that this step is not applicable.

- [ ] **Step 4: Update both home-page dates to 2026-08-14**

Do this only after Steps 1–3 pass.

- [ ] **Step 5: Review final diff and repository status**

```bash
git diff --check
git status --short
git diff --stat origin/main...HEAD
git diff origin/main...HEAD -- AGENTS.md src/pages src/data/chapters.js scripts package.json docs
```

Confirm no untracked user file was staged or modified.

- [ ] **Step 6: Commit final date and verification record**

```bash
git add src/pages/index.astro src/pages/ko/index.astro
git commit -m "docs: complete foundation model training review"
```
