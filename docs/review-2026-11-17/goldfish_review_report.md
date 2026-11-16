# Expertise-building and release-evidence follow-up — 2026-11-17

## Scope and review method

Baseline: `9f21811fcf78af27db31905ddff3929d82836927` on main. This follows the November 15 full-book review; it is not another claim that every unchanged paragraph was freshly reviewed. The canonical inventory grows from 103 to **107 English/Korean pairs**. Eleven pairs change: 1.5, 3.1, 3.2, 4.5, 6.6, 7.5, 11.1, 17.4, 17.5, 17.6 and 17.7. Both homepages gain a shared localized learning-path component.

Applied EGM review-loop's fresh-context, read-only comprehension review with repository teaching standards. Three independently spawned reviewers inspected: (1) foundations/training pedagogy, (2) evaluation/data isolation, (3) the new bilingual chapters and executable labs. A final static follow-up inspected fixes and greedy generation. This was a scaled editorial review, **not** the complete five-phase Goldfish protocol or a claim of two clean convergence rounds. Implementation and runtime verification were performed by the main agent.

## Findings and dispositions

| ID | Severity | Evidence and resolution |
|---|---|---|
| foundations-1 | Major | Missing optimization bridge: added 6.6 with likelihood/gradient, SGD curvature example, Adam moments/bias correction, decoupled decay, token weighting, fair final-budget comparison. |
| foundations-2 | Major | Isolated components never form a trainable model: added 7.5 and downloadable CPU decoder with masked copying task, context ablation, causal check, full local resume, held-out and autoregressive metrics. |
| foundations-3 | Major | Unequal-token distributed averaging lacks derivation: added R*S_r/N derivation and a numerical gradient/update equivalence test. Incorrect local means demonstrably fail. |
| foundations-4 | Major | Authored attention values interpreted as learned coreference and independent head specialization: corrected EN/KO 3.1 quiz and 3.2 prose. |
| evaluation-1 | Major | 17.4/17.5 incorrectly described siblings of training examples as independent holdouts: require whole-cluster quarantine or exposed regression labels plus untouched clusters. |
| evaluation-2 | Major | Statistics named but not executed: added 17.7 estimand, paired cluster bootstrap, noninferiority, missing-evidence policy and synthetic Pass/Review/Block exercise. |
| evaluation-3 | Major | Canary stopping rule absent: added persistent assignment and fixed terminal analysis, separate continuous safety aborts and sequential-design requirement for early efficacy. |
| evaluation-4 | Major | Zero observed failures misread as zero risk: derived exact one-sided zero-event bound with independent-trial assumptions and numerical sample-size example. |
| evaluation-5 | Major | Training/evaluation loop not closed: learning routes, competence gates, capstone rubric, executable experiment records and cross-links now connect the chapters. |
| new-labs-1 | Major, found during work | Initially the `uncertain` fixture produced Block. Changed its cluster effects so the estimated gain straddles the predetermined threshold; regression test now requires Review. |
| new-labs-2 | Nit | Schedule prose implied sequential warmup then cosine. Corrected to the actual product of envelopes, distinguishing scale from attained peak. |
| new-labs-3 | Nit | Missing clean setup: added Linux virtual-environment/CPU installation recipe and official cross-platform instructions. |
| new-labs-4 | Nit | “Same mask” ambiguous across attention ablation: specify identical loss mask and training budget. |
| new-labs-5 | Nit, follow-up | Generation became supplied code: changed exercise from implementing it to inspecting outputs and comparing free generation with teacher forcing. |

No unresolved substantive findings in the scoped final lab review. This does not establish that no other book defects exist.

## Primary evidence added

- Qwen4-Max: official November 16 blog was read in a browser because the static fetch lacked its dynamic body. It discloses 2.4T backbone, 71B active and separate 328B n-gram embeddings, hybrid GDN/QSA, gated residuals and lookup capacity. QwenCloud confirms November 11 preview versus November 16 API launch. Smaller-family weights remain a plan, not a released artifact.
- Gemini 4 Hydrogen: November 12 official launch; system-level orchestration claims remain attributed to Google.
- LongCat-2.5 and Agnes 2.5 Pro Theta: model cards, licenses, actual weight file listings and repository revisions checked. `weights.json` records evidence; weights were not downloaded or run. Preserve differences between declared model size and automatic tensor accounting.
- New research: `2611.03633v2`, `2611.17876v1`, `2611.17334v1`. Scope conclusions to optimizer/data-budget and controlled vision-capacity experiments; no universal winner claims.
- `links.json`: all **19 added external URLs** returned HTTP 200. The 32-profile independent benchmark chart remains the explicitly dated **2026-11-15 snapshot**, separate from November 17 release checks. No unverified new scores or prices were inserted.

## Runtime and editorial verification

- Python 3.12 with PyTorch 2.15.0+cpu: **5/5 new lab tests pass**, including paired/exposed-cluster invariants, duplicate evidence, unequal-token gradient/update equivalence, actual learning, exact replay and checkpoint corruption rejection.
- Three decoder runs, seeds 7/19/31: held-out NLL 0.05081/0.03624/0.08267; self-only ablations 2.70419/2.71955/2.73052. All causal/resume checks passed. Greedy sequence accuracy was 15/16 in each run. These are tiny synthetic-task measurements, not foundation-model benchmark results or a precise multi-seed uncertainty estimate.
- `public/labs/verified-seed-7.json` binds reported values to the final downloadable code hash; variable machine timing is omitted.
- Existing bilingual educational-example smoke checks passed.
- `npm run test:content`: **10/10 pass**. Complete Node suite: **57/57 pass** with the same command used by CI.
- Node 24.19.0 deployment-base build: **216 pages**, no build errors. Inventory checks compare slug, number and order; built checks cover canonical/local links, language reciprocity, search, sitemap and KaTeX errors.
- `browser.json`: **48 page/viewport checks** across changed English/Korean pages and both homepages, widths 390/1440; 64 button actions and 100 select/range/checkbox actions, no JavaScript, hydration, math or document-overflow issues. This is targeted coverage, not every possible control-state cross-product.
- Final targeted browser pass checks learning-route links and keyboard focus, lab downloads, responsive equations, mobile search/focus/Escape, chart metric×axis combinations, keyboard selection and missing-data/provider behavior. Desktop/mobile screenshots inspected locally.
- Source/parity inspection includes formulas, references, quiz structure and the deliberate scope limitations of both labs. Unchanged pages retain November 15 inspection evidence. Review hashes are in `docs/editorial_rewrite_worklog.md`.

## Limits

The CPU copying lab teaches mechanics, not natural-language generalization or distributed recovery. The statistical lab uses authored fixtures, a transparent approximate percentile bootstrap and an illustrative separate safety sample; it is not a deployment authorizer. Practical expertise still requires unfamiliar tasks, longer experiments, paper reproduction and independent human review. New provider models and research claims were researched, not independently trained or benchmarked here.
