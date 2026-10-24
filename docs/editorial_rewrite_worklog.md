# Editorial Rewrite Worklog

Date started: 2026-04-14

## Goals

- Tighten factual accuracy and calibrate tone in speculative or fast-moving chapters.
- Add production-engineering material as sub-chapters inside existing chapters.
- Preserve English-Korean parity for every substantive change.
- Improve Korean readability by reducing translationese and standardizing terminology.
- Add short, functional narrative hooks that make difficult material easier to enter.

## Narrative Guidelines

- Use short historical anecdotes only when they illuminate why an idea appeared.
- Use one compact metaphor or scenario before the technical explanation, then switch back to precise language.
- Prefer real engineering tension over decorative storytelling.
- Do not invent anecdotes or imply certainty that sources do not support.

## Wave 1: Foundation

- Add worklog and terminology expansion.
- Add production sub-chapters to Chapters 12, 14, 16, and 17.
- Update chapter registries and chapter list.

## Wave 2: High-Risk Rewrites

- Rework Chapter 16 pages with overconfident agent-memory and agent-autonomy claims.
- Rework Chapter 20 pages with speculative or vendor-specific claims that need softer framing or corrected sourcing.
- Add production-oriented sub-chapters for serving, RAG, agents, and evaluation in both English and Korean.

## Wave 3: Structure and Parity

- Normalize Chapter 20 quiz/reference structure.
- Clean Chapter 13 knowledge distillation parity drift and remove weak future-dated claims.
- Add narrative improvements to Chapter 4 architecture pages, especially 4.2, 4.3, and 4.5.

## Implementation Notes

- Added new sub-chapters:
  - `12.6 Serving Policies, SLOs, and Fallbacks`
  - `14.6 RAG Failure Modes and Operational Design`
  - `16.5 Agent Reliability, Recovery, and Guardrails`
  - `17.5 Production Evaluation and Release Gates`
- Rewrote high-risk EN/KO pages in Chapter 16 and Chapter 20 to use more evidence-calibrated wording.
- Reframed Chapter 4 architecture pages to emphasize the engineering pressure behind design choices rather than product-name cataloging.
- Reworked Chapter 13 `Knowledge Distillation` in EN/KO to align the sections, reduce translationese, and add a more operational explanation of KD design.

## Validation Log

- 2026-04-14: `npm run build` passed after registry updates, new sub-chapters, and Chapter 4/13/16/20 rewrites.
- 2026-04-14: Ran a follow-up audit on formulas, code snippets, and references.
- Replaced invalid or placeholder citations in `Chapter 10`, `Chapter 13`, and `Chapter 18` with live papers or anthology entries.
- Executed representative Python snippets for `Knowledge Distillation`, `Orthogonal Gradient Projection`, `GCG token gradients`, and `Cross-Attention` to confirm the examples run without shape/runtime errors.
- Patched several illustrative code blocks to avoid device-mismatch patterns such as `torch.sqrt(torch.tensor(...))`.
- 2026-04-14: `npm run build` passed again after the audit fixes.

## 2026-04-16 Remaining-Chapter Pass

- Continued the audit through the remaining high-risk chapters instead of stopping at the first batch.
- Softened over-strong claims in `Chapter 9`, `Chapter 10`, and `Chapter 15` where the cited sources supported the overall direction but not the previous level of certainty.
- Replaced mismatched Chapter 11 references with verifiable sources:
  - replaced `OMNIAR` with `Qwen2.5-Omni Technical Report`
  - replaced the unrelated `LaTo` citation with `Show-o`
  - corrected the `vLLM-Omni` arXiv identifier to `2602.02204`
  - normalized the `Scaling Law Hypothesis for Multimodal Model` author line
- Updated the Korean counterparts in the same pass to preserve EN/KO parity.

## 2026-04-16 Chapters 9-14 Review Pass

- Reviewed every sub-chapter in `src/pages/chapter-{9,10,11,12,13,14}` and the matching Korean files under `src/pages/ko/chapter-{9,10,11,12,13,14}`.
- Normalized the Korean quiz label drift in Chapter 9 so the first quiz now matches the rest of the book's `Quiz 1` format.
- Softened a few overly absolute frontier statements in PEFT, synthetic data, and commercial video sections so the prose reads as evidence-calibrated rather than promotional.
- Tightened the Any-to-Any and commercial video chapters so the EN/KO pairs track each other more closely in tone and confidence level.

## 2026-04-16 Full Audit Kickoff

- Started a tracked, exhaustive sub-chapter audit rather than an opportunistic high-risk pass.
- Fixed the user-reported quiz-format issues first:
  - normalized Korean Chapter 5 quiz blocks so the question appears in `<summary>` and the expanded body shows the answer directly
  - normalized Korean Chapter 6.1 and 6.2 first-quiz labels to match the surrounding quiz format
- Began parallel chapter-range reviews with local follow-up integration and validation.

### Full Sub-Chapter Checklist

Review completed on 2026-04-16 for every EN/KO sub-chapter pair below.

### chapter-1
- [x] bitter-lesson (EN/KO pair)
- [x] deep-learning-paradigms (EN/KO pair)
- [x] power-of-representation (EN/KO pair)
- [x] symbolism-vs-connectionism (EN/KO pair)

### chapter-2
- [x] cnns-for-nlp (EN/KO pair)
- [x] dawn-of-attention (EN/KO pair)
- [x] markov-chains-to-rnns (EN/KO pair)
- [x] vanishing-exploding-gradients (EN/KO pair)

### chapter-3
- [x] complexity-analysis (EN/KO pair)
- [x] layer-normalization-residuals (EN/KO pair)
- [x] multi-head-attention (EN/KO pair)
- [x] position-encoding-strategy (EN/KO pair)
- [x] self-attention-mathematics (EN/KO pair)

### chapter-4
- [x] decoder-only (EN/KO pair)
- [x] encoder-decoder (EN/KO pair)
- [x] encoder-only (EN/KO pair)
- [x] hybrid-prefix-lm (EN/KO pair)
- [x] various-llm-architectures (EN/KO pair)

### chapter-5
- [x] case-study (EN/KO pair)
- [x] collapsing-load-balancing (EN/KO pair)
- [x] expert-parallelism (EN/KO pair)
- [x] routing-algorithms (EN/KO pair)
- [x] sparse-vs-dense-models (EN/KO pair)

### chapter-6
- [x] data-engineering-at-scale (EN/KO pair; 2026-08-16 practitioner rewrite)
- [x] infrastructure (EN/KO pair)
- [x] large-scale-training-stability (EN/KO pair; 2026-08-16 practitioner rewrite)
- [x] synthetic-data-for-pre-training (EN/KO pair)
- [x] tokenization-science (EN/KO pair; 2026-08-16 practitioner rewrite)

### chapter-7
- [x] data-parallelism (EN/KO pair)
- [x] flash-attention (EN/KO pair; 2026-08-16 practitioner rewrite)
- [x] model-and-pipeline-parallelism (EN/KO pair; 2026-08-16 practitioner rewrite)
- [x] zero-redundancy-optimizer (EN/KO pair; 2026-08-16 practitioner rewrite)

### chapter-8
- [x] chinchilla-optimality (EN/KO pair)
- [x] over-training-vs-optimal-training (EN/KO pair; 2026-08-16 practitioner rewrite)
- [x] power-law (EN/KO pair; 2026-08-16 practitioner rewrite)
- [x] transfer-learning-and-generalization (EN/KO pair; 2026-08-16 practitioner rewrite)
- [x] continued-pretraining-and-domain-adaptation (EN/KO pair; 2026-08-16 practitioner review)

### chapter-9
- [x] dataset-quality-vs-quantity (EN/KO pair; 2026-08-16 practitioner rewrite)
- [x] parameter-efficient-fine-tuning-peft (EN/KO pair; 2026-08-16 practitioner rewrite)
- [x] prompt-engineering-as-sft (EN/KO pair)
- [x] sft-fundamentals (EN/KO pair; 2026-08-16 practitioner rewrite)
- [x] synthetic-instructions-and-self-instruct (EN/KO pair; 2026-08-16 practitioner rewrite)

### chapter-10
- [x] alignment-tax (EN/KO pair; 2026-08-16 practitioner rewrite)
- [x] dpo (EN/KO pair; 2026-08-16 practitioner rewrite)
- [x] human-feedback-loop (EN/KO pair; 2026-08-16 practitioner rewrite)
- [x] kto-and-ipo (EN/KO pair; 2026-08-16 practitioner rewrite)
- [x] ppo-proximal-policy-optimization (EN/KO pair; 2026-08-16 practitioner rewrite)

### chapter-11
- [x] audio-and-speech-integration (EN/KO pair)
- [x] commercial-video-models (EN/KO pair)
- [x] image-diffusion-models (EN/KO pair)
- [x] unified-multimodal-any-to-any (EN/KO pair)
- [x] video-generation-foundations (EN/KO pair)
- [x] vision-language-bridges (EN/KO pair)

### chapter-12
- [x] continuous-batching (EN/KO pair)
- [x] kv-cache-management (EN/KO pair)
- [x] long-context-serving (EN/KO pair)
- [x] paged-attention-vllm (EN/KO pair)
- [x] serving-policies-slos-and-fallbacks (EN/KO pair)
- [x] speculative-decoding (EN/KO pair)

### chapter-13
- [x] advanced-quantization (EN/KO pair)
- [x] knowledge-distillation (EN/KO pair)
- [x] ptq-vs-qat (EN/KO pair)
- [x] quantization-methods (EN/KO pair)
- [x] weight-sparsification (EN/KO pair)

### chapter-14
- [x] advanced-retrieval (EN/KO pair)
- [x] graphrag-and-ontology (EN/KO pair)
- [x] lexical-to-semantic-search (EN/KO pair)
- [x] rag-failure-modes-and-operational-design (EN/KO pair)
- [x] rag-orchestration (EN/KO pair)
- [x] vector-indexing-and-db-solutions (EN/KO pair)

### chapter-15
- [x] chain-of-thought (EN/KO pair)
- [x] search-time-compute (EN/KO pair)
- [x] tree-graph-of-thoughts (EN/KO pair)
- [x] verifiers-and-reward-models (EN/KO pair)

- [x] 15.5 `reasoning-post-training-rlvr` (EN/KO): inspected 2026-10-13; current file hashes recorded in the October canonical inventory in `docs/editorial_rewrite_worklog.md`.

### chapter-16
- [x] agent-reliability-recovery-and-guardrails (EN/KO pair)
- [x] autonomous-agents (EN/KO pair)
- [x] function-calling-and-tool-use (EN/KO pair)
- [x] long-term-memory-for-agents (EN/KO pair)
- [x] multi-agent-collaboration (EN/KO pair)
- [x] self-improving-agents (EN/KO pair; 2026-09-15 evidence and promotion-gate rewrite)

### chapter-17
- [x] academic-benchmarks (EN/KO pair; 2026-08-16 practitioner rewrite)
- [x] contamination-issues (EN/KO pair; 2026-08-16 practitioner rewrite)
- [x] elo-rating-and-leaderboards (EN/KO pair)
- [x] llm-as-a-judge (EN/KO pair)
- [x] production-evaluation-and-release-gates (EN/KO pair; 2026-08-16 practitioner rewrite)
- [x] commercial-model-benchmarks (EN/KO pair; 2026-09-15 primary-source snapshot verification)

### chapter-18
- [x] hallucination-detection (EN/KO pair)
- [x] jailbreaking-and-defense (EN/KO pair)
- [x] red-teaming (EN/KO pair)
- [x] scalable-oversight (EN/KO pair)

### chapter-19
- [x] logit-lens-and-attention-visualization (EN/KO pair)
- [x] mechanistic-interpretability (EN/KO pair)
- [x] probing-classifiers (EN/KO pair)
- [x] sparse-autoencoders-sae (EN/KO pair)

### chapter-20
- [x] diffusion-based-llms (EN/KO pair)
- [x] linear-attention (EN/KO pair)
- [x] mamba-and-s6 (EN/KO pair)
- [x] multi-token-prediction (EN/KO pair)
- [x] neural-networks-as-programs (EN/KO pair)
- [x] path-to-agi-and-world-models (EN/KO pair)
- [x] state-space-models-ssm (EN/KO pair)

## 2026-04-16 Full Audit Completion

- Confirmed the full EN/KO sub-chapter inventory was reviewed and the checklist above was completed.
- Fixed the user-reported quiz-format issues in Korean Chapter 5 and Chapter 6, then normalized adjacent quiz-format drift found during the full pass.
- Applied additional tone, parity, and framing fixes in Chapters 1, 9, 11, and 20 based on the exhaustive review.
- 2026-04-16: `npm run build` passed after the full-audit pass.
- Added `docs/exhaustive_subchapter_audit.md` so the reviewed-file list and the edited-file list are explicitly separated in a page-by-page audit ledger.

## 2026-09-15 Current-Evidence and Technical-Depth Pass

- Mechanically scanned the canonical EN/KO inventory for mutable claims, unsupported absolutes, stale release labels, and weak training contracts; then inspected and rewrote the affected Chapter 6, 16, and 17 pairs.
- Rebuilt `synthetic-data-for-pre-training` around the published Phi-1 mixture, conditional collapse dynamics, tokenizer-native generation, immutable lineage, evaluation quarantine, resource accounting, abort criteria, complete checkpoints, and release/rollback gates. Replaced the misleading legacy raster with source-grounded EN/KO SVG diagrams.
- Reworked `self-improving-agents` to separate research-prototype evidence from recursive-improvement rhetoric and added the statistics of adaptive selection, sealed holdouts, canaries, confidence-bound gates, provenance, and evaluator trust separation. Added and exercised a deterministic bilingual interactive.
- Reverified `commercial-model-benchmarks` as of 2026-09-15 against primary provider pages and model cards, including GPT-6 Astra, Gemini 3.8 Flash, Claude Fable/Mythos 5.1, Kimi K3, and Qwen3.8-Max; preserved `not reported` rather than manufacturing cross-harness comparisons.
- Fixed the shared narrow-screen layout so horizontally scrollable teaching visuals no longer widen or squeeze the whole page.
- 2026-09-15: `npm run test:content` passed after the paired content and ledger updates.
- 2026-09-15: Browser QA passed for EN/KO Chapter 6 assets, Chapter 16 slider states and hydration, Chapter 17 metric/axis/company filters and missing-data state, plus 390px responsive layout.
- 2026-09-15: `ASTRO_TELEMETRY_DISABLED=1 npm run build` generated all 204 pages successfully; only the pre-existing KaTeX Korean-in-math warnings remained.

## 2026-10-13 Evidence Update and Technical Review

This pass scanned all 20 chapters and the 102 current EN/KO pairs for mutable claims, unsupported absolutes, release-state confusion, example correctness, and language drift. It inspected and updated 28 affected pairs (including the new 15.5). The remaining 74 pairs received mechanical inventory/risk screening; the April and September inspection records remain historical evidence, not a claim that all 102 pairs received a new deep inspection in October.

- Rebuilt 17.6 around dated primary release evidence and a common Artificial Analysis v4.3.2 snapshot. Separated released weights, hosted previews, and promised releases; kept missing scores/prices out of plotted rankings. Distinguished measured task cost from an illustrative token-price mix.
- Updated architecture, MoE, KV recovery, speculative decoding, embeddings, video, and diffusion sections. Added September–October evidence where relevant without inferring undisclosed internals or presenting provider results as independent proof.
- Added 15.5 RLVR with GRPO reduction and masking semantics, zero-contrast groups, composition and hint-shift preprints, rollout validity, and reproducible data/checkpoint/release contracts.
- Improved prompting/ICL and GEPA, attention residuals, multimodal representations, tool authorization, agent evaluation, and circuit tracing. Corrected oversimplified normalization, positional extrapolation, quantization, SAE, and infrastructure claims.
- Replaced the speculative-decoding toy implementation with a standard-library reference. Smoke checks covered last-position rejection, all-accepted bonus sampling, and a 40,000-trial marginal-distribution check (target 0.75; observed 0.750125). Other educational tensor examples explicitly state their integration limits.
- Synchronized EN/KO body structure, quizzes, code, formulas, reference anchors and URLs for the changed pairs. Added the missing terminology baseline and 15.5 search metadata.

## Current Canonical Inventory (as of 2026-10-25)

This maintained table is in navigation order. Each inspected row binds its own inspection date to the current EN/KO SHA-256 content hashes. The original 2026-10-13 table is preserved in commit `423311d`; rows re-inspected on October 18 or October 25 carry their own dates and hashes below. UI-only or partial updates remain Mechanical only pending a whole-page editorial inspection. `Mechanical only` retains earlier historical records without claiming a fresh editorial inspection. Subsequent edits require fresh inspection evidence.

| Number | Route | October review evidence | EN SHA-256 | KO SHA-256 |
|---|---|---|---|---|
| 1.1 | `/chapter-1/symbolism-vs-connectionism` | Inspected 2026-10-13 | 19edbaf2e43d8b24c55efaf3223deb73b85a88a1cd4b2fb5833658311331f991 | db6c3d195dc45b38d3c92d60d574c59f3f54cc11f8d6dfac02c1373887f1635d |
| 1.2 | `/chapter-1/power-of-representation` | Inspected 2026-10-13 | b7a5d4169f6c3c52750c3473a93fe60f270bf28278c544f1ba31e07f4d9e84bd | 00164579ccd1aef8a3cd6a66ffba6bb5818871c6740e5f706936e8d1dedaf36c |
| 1.3 | `/chapter-1/deep-learning-paradigms` | Inspected 2026-10-13 | 03e05b2867953be9950910f74b66037de0f519f25eb3816b512c37eb33cd69d5 | 6042d7dca5ab4fed23755e1e900b10fa80640a2fa8739551b0256264bfa89652 |
| 1.4 | `/chapter-1/bitter-lesson` | Inspected 2026-10-13 | eeb0e93919da27661ff9a9e1dd5420ab0e818ed22dd3931c621deeffa5d6380d | 6fb09e879035f74a7da7c7c854886e17625ed91958165efab5036684946df039 |
| 2.1 | `/chapter-2/markov-chains-to-rnns` | Mechanical only | — | — |
| 2.2 | `/chapter-2/vanishing-exploding-gradients` | Mechanical only | — | — |
| 2.3 | `/chapter-2/dawn-of-attention` | Mechanical only | — | — |
| 2.4 | `/chapter-2/cnns-for-nlp` | Mechanical only | — | — |
| 3.1 | `/chapter-3/self-attention-mathematics` | Mechanical only | — | — |
| 3.2 | `/chapter-3/multi-head-attention` | Mechanical only | — | — |
| 3.3 | `/chapter-3/position-encoding-strategy` | Inspected 2026-10-13 | f95d5ecdf8fd158da2b056d068af825aa2840b7e21656d4c8578c2aeaf47e3be | 074eee2218d65c530646b54e09afdd2a2b34c6be4561a9e6705e80c535e0c4c3 |
| 3.4 | `/chapter-3/layer-normalization-residuals` | Inspected 2026-10-13 | 1ccd9dfe73d60aa9d8d67442137e4c9d317d43c2a806cb32812fc301bb1cf36b | 404e8d3757687f9d177fdb48531728916179dfb5bdcd02d30b480dc702fed1b5 |
| 3.5 | `/chapter-3/complexity-analysis` | Mechanical only | — | — |
| 4.1 | `/chapter-4/encoder-only` | Mechanical only | — | — |
| 4.2 | `/chapter-4/decoder-only` | Mechanical only | — | — |
| 4.3 | `/chapter-4/encoder-decoder` | Inspected 2026-10-13 | c0372544843683d2e7b80936ba33fd4c343a4b6850c40844ae59ccc34362f918 | d1c77e9b87235b6e7d00b7350a01d5d813567221ce8ca91edf14e5241f400905 |
| 4.4 | `/chapter-4/hybrid-prefix-lm` | Mechanical only | — | — |
| 4.5 | `/chapter-4/various-llm-architectures` | Inspected 2026-10-18 | e5ab846a5d0f42a9d98dabadc677e0187ac9b2af55ef0b7401d5ee5885e5f5ef | 4d2caa746cf1be755510835ecf6990c99cb06bb88a7a0b5b20760d09568a5c06 |
| 5.1 | `/chapter-5/sparse-vs-dense-models` | Mechanical only | — | — |
| 5.2 | `/chapter-5/routing-algorithms` | Mechanical only | — | — |
| 5.3 | `/chapter-5/expert-parallelism` | Mechanical only | — | — |
| 5.4 | `/chapter-5/collapsing-load-balancing` | Inspected 2026-10-13 | 9eafbfd1e7b75ad8196d586895ed76c5c16b609fb3b6d7c3c6450331d3fbec83 | e882e33f29592a27d156efc7b998c7f7d1fa8a3f2e8f63179ad4319ef47ab56a |
| 5.5 | `/chapter-5/case-study` | Inspected 2026-10-13 | 0c1ccfc062b29483e65828c2c774c25fa535af323ca385fba2c347f9a85a61ee | e93630847b361439a90df9c69aa3d87b8ac1b131c734276be2c6b5200d9e7b49 |
| 6.1 | `/chapter-6/data-engineering-at-scale` | Mechanical only | — | — |
| 6.2 | `/chapter-6/tokenization-science` | Mechanical only | — | — |
| 6.3 | `/chapter-6/large-scale-training-stability` | Mechanical only | — | — |
| 6.4 | `/chapter-6/infrastructure` | Inspected 2026-10-13 | db766374738bc9706d644b19fc1d6ff8dcddbe74bc265f21de02ac95efbffa6d | 04218b7b41cc9ee92416a1f69070eebbbb6afcb6994a1fff5c98fe3e8b5de264 |
| 6.5 | `/chapter-6/synthetic-data-for-pre-training` | Mechanical only | — | — |
| 7.1 | `/chapter-7/data-parallelism` | Mechanical only | — | — |
| 7.2 | `/chapter-7/zero-redundancy-optimizer` | Mechanical only | — | — |
| 7.3 | `/chapter-7/model-and-pipeline-parallelism` | Mechanical only | — | — |
| 7.4 | `/chapter-7/flash-attention` | Mechanical only | — | — |
| 8.1 | `/chapter-8/power-law` | Mechanical only | — | — |
| 8.2 | `/chapter-8/chinchilla-optimality` | Inspected 2026-10-25 | a5c303a07cd048a5700ec4cf86eeb44387cdcc43775eb4a2c5678f4aed6250d1 | 113d3edaa8047c8e5b5455f712a931429e550d22c1d260be5947dab80f4ef2a6 |
| 8.3 | `/chapter-8/over-training-vs-optimal-training` | Mechanical only | — | — |
| 8.4 | `/chapter-8/transfer-learning-and-generalization` | Mechanical only | — | — |
| 8.5 | `/chapter-8/continued-pretraining-and-domain-adaptation` | Inspected 2026-10-18 | e0f895c99ea0caeac0672686fd1fddfba31f5d152c26d4a46db04c218edd6d73 | 1765e765a81279832270081b021b78064d9fbc7f0a831e1d83bd6767cafda069 |
| 9.1 | `/chapter-9/sft-fundamentals` | Mechanical only | — | — |
| 9.2 | `/chapter-9/dataset-quality-vs-quantity` | Mechanical only | — | — |
| 9.3 | `/chapter-9/parameter-efficient-fine-tuning-peft` | Mechanical only | — | — |
| 9.4 | `/chapter-9/prompt-engineering-as-sft` | Inspected 2026-10-13 | a0d054e1053d08fb0459c941fc7b54a7935c42315c12fb0534d6adc5978c2f66 | a8eb98f41ea974270f2121a28d2e2478d1b6f34c5682172c52036eaf58e79a61 |
| 9.5 | `/chapter-9/synthetic-instructions-and-self-instruct` | Mechanical only | — | — |
| 10.1 | `/chapter-10/human-feedback-loop` | Mechanical only | — | — |
| 10.2 | `/chapter-10/ppo-proximal-policy-optimization` | Mechanical only | — | — |
| 10.3 | `/chapter-10/dpo` | Mechanical only | — | — |
| 10.4 | `/chapter-10/kto-and-ipo` | Mechanical only | — | — |
| 10.5 | `/chapter-10/alignment-tax` | Mechanical only | — | — |
| 11.1 | `/chapter-11/vision-language-bridges` | Mechanical only | — | — |
| 11.2 | `/chapter-11/audio-and-speech-integration` | Mechanical only | — | — |
| 11.3 | `/chapter-11/unified-multimodal-any-to-any` | Inspected 2026-10-13 | 63b49653980ac69e7662b92d1423aad27976789545651d8f21bb97c04a0993a2 | 05b4775ea2e63d295a8def6928b0a7280187755f1e95669da1a9db2ad9134158 |
| 11.4 | `/chapter-11/image-diffusion-models` | Mechanical only | — | — |
| 11.5 | `/chapter-11/video-generation-foundations` | Mechanical only | — | — |
| 11.6 | `/chapter-11/commercial-video-models` | Inspected 2026-10-13 | 2299a2e11e39d98825c1b46c9dd4068a6eed9d912bfbd367b62dc12499aafd98 | 175c65c83a630767c82eeacb3063df93fa0d660981e712d60776554a95a69366 |
| 12.1 | `/chapter-12/kv-cache-management` | Inspected 2026-10-13 | 2b4dad62f76493740e0964118fb5712f441e6623497f35d6f4d89744cbdc4179 | 548f197f8ab63a2b60aa9216a52b8ef4c46fa97877ef8a2941fa7b03fcfdd60a |
| 12.2 | `/chapter-12/paged-attention-vllm` | Mechanical only | — | — |
| 12.3 | `/chapter-12/continuous-batching` | Mechanical only | — | — |
| 12.4 | `/chapter-12/speculative-decoding` | Inspected 2026-10-13 | 5a4f09e5002a2b8dd95fc1163467670b65af96c8fe24ef5d4f974dd211f81392 | dda212e58d258cba460d4717b754bfd848f879e0d40f2afe883548f15ac73116 |
| 12.5 | `/chapter-12/long-context-serving` | Inspected 2026-10-18 | 82f413a5a2e2731fe01603c7036b42dee434b010cc76410eba7e0807d73742e8 | 59933e962b9f0bef0f8b50e9889ec628fd92ade6d7d0fb91636981793bd83052 |
| 12.6 | `/chapter-12/serving-policies-slos-and-fallbacks` | Mechanical only | — | — |
| 13.1 | `/chapter-13/ptq-vs-qat` | Mechanical only | — | — |
| 13.2 | `/chapter-13/quantization-methods` | Inspected 2026-10-13 | 17786fe86f7f3bc6edf5f5cd8020b3132963266c7083d452d1e629555eb8df91 | 5eb38a0204b52eeadf4b7a019f9a64452d38f6da7e2a5b3ca7be301f46d24fbc |
| 13.3 | `/chapter-13/weight-sparsification` | Mechanical only | — | — |
| 13.4 | `/chapter-13/knowledge-distillation` | Mechanical only | — | — |
| 13.5 | `/chapter-13/advanced-quantization` | Inspected 2026-10-18 | 27a364583a8df29cdea48119e65184594a4c27ab9f8f22437778a330596d4a3b | b55fe9860d8cf44911a1bf6508787d6c865bfbdf548adff861878ccdf10fd691 |
| 14.1 | `/chapter-14/lexical-to-semantic-search` | Mechanical only | — | — |
| 14.2 | `/chapter-14/vector-indexing-and-db-solutions` | Inspected 2026-10-25 | 9cd80b8fa316923b8db209981294ea15b991ef55851416fb72455a0f12d92783 | 7f9a5d85dde7cb1d91679e64a99760562b8640003062593ded9483faf4af35c4 |
| 14.3 | `/chapter-14/advanced-retrieval` | Inspected 2026-10-25 | 185df747656780bb8c6e973099be638e6be05625deb78c043f84cf0c73c321ba | 168067b55836a797166e7bb7e17a6c36b19c39950c10fb72f58814054b45dc05 |
| 14.4 | `/chapter-14/rag-orchestration` | Mechanical only | — | — |
| 14.5 | `/chapter-14/graphrag-and-ontology` | Mechanical only | — | — |
| 14.6 | `/chapter-14/rag-failure-modes-and-operational-design` | Mechanical only | — | — |
| 15.1 | `/chapter-15/chain-of-thought` | Mechanical only | — | — |
| 15.2 | `/chapter-15/tree-graph-of-thoughts` | Mechanical only | — | — |
| 15.3 | `/chapter-15/search-time-compute` | Mechanical only | — | — |
| 15.4 | `/chapter-15/verifiers-and-reward-models` | Mechanical only | — | — |
| 15.5 | `/chapter-15/reasoning-post-training-rlvr` | Inspected 2026-10-18 | 5d7b0b2af95b466bfd3261c57d4597e27ec2abc2c2dca49a750cefa2ff7e4c7f | ad356581811918d430e3f75ddb4fab33d944cbe31a1a87ce59eeefaaaf02d7fd |
| 16.1 | `/chapter-16/function-calling-and-tool-use` | Inspected 2026-10-13 | 2c1926ca9a765c43ce7cef9a2ae1e9a6ba7ce2e27419c81e91f94ee274d0367c | 495ad575c567acc70c086386aebbc5ce1013f711d2a54735c4291f7c05a87b86 |
| 16.2 | `/chapter-16/autonomous-agents` | Mechanical only | — | — |
| 16.3 | `/chapter-16/self-improving-agents` | Mechanical only | — | — |
| 16.4 | `/chapter-16/multi-agent-collaboration` | Mechanical only | — | — |
| 16.5 | `/chapter-16/long-term-memory-for-agents` | Mechanical only | — | — |
| 16.6 | `/chapter-16/agent-reliability-recovery-and-guardrails` | Mechanical only | — | — |
| 16.7 | `/chapter-16/decision-models-and-selective-prediction` | Inspected 2026-10-25 | 0e18d9f54a4b8ac6236a1d4a47f1cd346b2eb80ee16a8788da09d44d4c1fbbfd | 8807c28bb5c3d5546553f1d8b2a33aa97ffa8a2a01871eb966c5bdc48ef646d4 |
| 17.1 | `/chapter-17/academic-benchmarks` | Mechanical only | — | — |
| 17.2 | `/chapter-17/llm-as-a-judge` | Inspected 2026-10-18 | b9ad37a58310ad8c790ac4c8988342a2233b3c96889f8fae279810964a470374 | df7b1b47ce2477bb8949d82cfa3e8336eb19b383bc7e9bdc25f940fb771c800f |
| 17.3 | `/chapter-17/elo-rating-and-leaderboards` | Mechanical only | — | — |
| 17.4 | `/chapter-17/contamination-issues` | Mechanical only | — | — |
| 17.5 | `/chapter-17/production-evaluation-and-release-gates` | Inspected 2026-10-13 | 5d35307a30661bc74be66c3fda51ba7dba5e72b94178a8ba20c6f6504ba2fd84 | 187f256cc5b3b64f82e3d4afae03ed6ea2ba45f5156ff232e9c75cb185dd2464 |
| 17.6 | `/chapter-17/commercial-model-benchmarks` | Inspected 2026-10-25 | 9bcf043b6ac457d3ab1f48a09f84ed0f9b4f78b507375e72bccd6b288a1c71bf | 98b4665865afff71a76ef8df8ddd5c205fd7e0573ad0a82a84b54ccb26dcf8ec |
| 18.1 | `/chapter-18/red-teaming` | Mechanical only | — | — |
| 18.2 | `/chapter-18/jailbreaking-and-defense` | Mechanical only | — | — |
| 18.3 | `/chapter-18/hallucination-detection` | Inspected 2026-10-25 | d3a1ee8ab17c7b845363483dd7b3112556523b0df6d833116a334717d79bdea3 | 85d58b77dcac5ff08bbdb13964faff2e93d8223760b0b46f4055337515d5162f |
| 18.4 | `/chapter-18/scalable-oversight` | Inspected 2026-10-18 | ddc4e57280940d9f2de2d5e5f551b035d60ae4feeb324a2a84256e798feb9c7f | 5536d313417dd89e9909d73ed8762c85d7450129338432d8a05ea21c7ee99f3b |
| 19.1 | `/chapter-19/mechanistic-interpretability` | Inspected 2026-10-13 | e78ed254abbd08dcc580e5d937948f89757d22138640f21b47a48ef61b6769c4 | fae2f16d1ef936dafbbe54ff2d8896e6110a4a9ecf1d33d5c29e0fd3599aff63 |
| 19.2 | `/chapter-19/logit-lens-and-attention-visualization` | Inspected 2026-10-25 | 375b38b92e928542be1229502b08c4bd2b8bfcc901efbf9c3d42c78b288ee789 | 234c4c67ae2a9c992daaf3fac45fb4b7c55163cd3da54a3fcee37d9b79641ecc |
| 19.3 | `/chapter-19/probing-classifiers` | Mechanical only | — | — |
| 19.4 | `/chapter-19/sparse-autoencoders-sae` | Inspected 2026-10-13 | 018f7a8f89fbe45ae3d03369863c38d3ed0b9d65b3ff34dee1e46dce09c6e57d | 62fd29a835a49e820c66560c39b9f54d361af016c768c7fea1c5f4942943accd |
| 20.1 | `/chapter-20/state-space-models-ssm` | Mechanical only | — | — |
| 20.2 | `/chapter-20/mamba-and-s6` | Mechanical only | — | — |
| 20.3 | `/chapter-20/linear-attention` | Mechanical only | — | — |
| 20.4 | `/chapter-20/neural-networks-as-programs` | Mechanical only | — | — |
| 20.5 | `/chapter-20/multi-token-prediction` | Mechanical only | — | — |
| 20.6 | `/chapter-20/diffusion-based-llms` | Inspected 2026-10-13 | f2236899fbf327ac90e1c1edae9c77a4173fb6721102a7364fbf85542541d836 | 0d5a117e60a90c1f8d746e5b29f01a13cc4929aa7a0e729e93fc003611ef22ed |
| 20.7 | `/chapter-20/path-to-agi-and-world-models` | Mechanical only | — | — |

### Verification for the October 13 pass

- Node v24.19.0; `SITE_BASE=/foundation-model-engineering ASTRO_TELEMETRY_DISABLED=1 npm run build` generated 206 pages successfully. The final build log contained no warnings or errors.
- `npm run test:content` passed; direct execution confirmed 10 content-contract assertions, including ordered inventory, EN/KO page numbers, citations/imports, and inspected-file hashes. All 11 repository test files passed after the final build, including deployed-path/search metadata checks.
- 126 distinct external references in changed English pages were checked: 122 were readable through the web tool; four tool retrieval failures were independently checked with HTTP HEAD and returned 200. Citation/anchor and external-URL parity passed for all 28 changed pairs.
- Browser verification used an isolated headless browser and the final static site at its deployment base, with browser caching disabled. It exercised 80 benchmark metric/axis/provider combinations per language, filtered selection/ranking, missing data, keyboard selection, DSPy cancellation/restart/reset, all topology tabs, normalized induction rows and keyboard focus, new-page math, and 1280px/390px layouts. All four changed interactions passed in EN/KO with no runtime exceptions.
- The content pass finished before both home-page update dates were set to 2026-10-13. `git diff --check` passed. No publication or deployment was performed.

The following hashes bind the historical October 13 UI verification to the implementations inspected then. They are not current evidence for subsequently changed files; the October 18 verification is recorded separately below.

| Interactive source | SHA-256 |
|---|---|
| `src/components/chapter-17/CommercialModelBenchmarkExplorer.tsx` | 996e44475223271de6a98121b30d94d24628277a105dd57c99c28c76e9150321 |
| `src/components/chapter-19/InductionHeadVisualizer.tsx` | 52b92c26d6a3e90d77d034121529941170350433154ddc9ae6348fed2200f584 |
| `src/components/chapter-19/visualizers.css` | 0f4cc1d6cf6d53630101f85a2884189f6f05a12dcec239b1f40ff6b918fa220c |
| `src/components/chapter-6/ClusterTopologyExplorer.tsx` | a855e146a63d97f7287a69deec36709bbdbdd8fade3688d46bcff747612984a9 |
| `src/components/chapter-6/visualizers.css` | c4d501c8a07e98e360b28dc1a5e5ad84a552b42d28f59c3d5cae5ddd7108b435 |
| `src/components/chapter-9/DSPyCompilerVisualizer.tsx` | e9ab01ec69997d82609438e2bbedf89c85df47ae36e40bfbabf5201dfcbd44a0 |

## 2026-10-18 Release and Research Update

Scope: inspected and updated 11 EN/KO pairs after screening the 102-pair inventory for relevant mutable claims and technical risks. This is not a claim that every other chapter received a fresh deep review. The current inventory above separates retained October 13 inspection evidence from October 18 inspection evidence.

- Reverified 19 release/evaluation profiles using primary model documentation and AA v4.3.2 pages. Added Muse Wonder/Full, Muse Spark Open, Nemotron 3.5 Super VL and Bolt, Step 5 Preview's weight milestone, and DeepSeek Flash 1017; corrected Beam's released weights and Gemini Argon's broader API access. Weights were checked through repository file metadata, including gated access, rather than announcement wording alone.
- Preserved the September DeepSeek evaluation as a separate profile; no independent score was copied onto the October 17 checkpoint. Kept unknown costs missing, distinguished subscription access and promotional expiry, and replaced the implied top-five ranking with an alphabetical selection list. Removed the unpopulated speed axis.
- Added bounded October research on agentic midtraining, multi-session RL, set-level scientific ideation, memory writers, intrinsic memory evaluation, context-difficulty axes, rating-scale sensitivity, multilingual unlearning access paths, and evidence-grounded review. Preprints and provider claims remain labeled.
- Rewrote long-context serving around KV heads, correct GiB accounting, workload-specific bottlenecks, state handoff, and quality/latency gates. Replaced the misleading square-matmul scheduler code with a smoke-tested accounting helper.
- Reworked advanced quantization, audio integration, judge evaluation, and scalable oversight to remove unsupported precision floors, all-addition claims, audio/KV budget conflation, false calibration guarantees, and random-model “agreement” as validation.
- The two modified interactions are the model-profile explorer and the explicitly schematic scheduling visualizer. The latter now has localized controls, keyboard focus, replay after completion, reduced-motion behavior, and a visible generation-method caption.

Inspection of current files and EN/KO equations, code semantics, quizzes, references, and adjacent-page transitions was completed before recording the October 18 hashes. Verification results are recorded below.

### October 18 Verification Results

- Node v24.19.0. Ordered navigation/page/ledger inventory and current inspection hashes passed `npm run test:content` before the build. The final deployment-base build generated all 206 pages with no warnings or errors.
- All 12 repository test files passed after the final build, including the new profile-schema, bilingual table/data parity, and revision-isolation checks. The content-contract file contains 10 checks; the new model-snapshot file contains 3 checks.
- All 117 distinct external URLs in the changed pages and model dataset resolved with HTTP 200. Newly cited research was read through primary paper pages/full text; the release profiles were checked against official documentation/model cards and model-specific AA records.
- The KV accounting helper passed 7 smoke checks: two GQA sizes, the query/KV-head comparison, and four invalid-input cases. The educational RVQ/latent-attention examples are not claimed to be smoke-tested training or serving integrations.
- The final static site was exercised with caching disabled in an isolated headless browser. EN and KO each passed 88 metric/axis/provider combinations, 14 empty combinations, filtered selections, alphabetical selection lists, keyboard selection, missing subscription cost, and isolation of the unmeasured DeepSeek revision. All 3 scheduling modes, keyboard replay after completion, reduced motion, and 1280px/390px layouts passed. All 11 changed pages rendered in both languages with the expected quizzes, no broken images or KaTeX errors, and no runtime exceptions. Desktop/mobile screenshots were visually inspected.
- API alias, unified context/output contract, introductory-price expiry, weight-file existence, and gated access were rechecked immediately before commit. The table below records the verified repository revisions and safetensors shard listings, not downloaded or locally evaluated model weights. The Mistral launch still described the later-month weight plan; the publisher search did not verify a Large 4 weight release.
- Both home pages now show 2026-10-18 after the content pass. `git diff --check` passed; this pass preserves the pre-existing book inventory and changes 11 EN/KO pairs rather than claiming a new deep inspection of all other pages.

| Weight artifact | Verified revision | Safetensors shards | Access listing |
|---|---|---:|---|
| `reflection/Beam-1.0-501B-A23B` | `78f8f654d40a40919b8e9954b40dd879ecb9a692` | 188 | not gated |
| `meta-models/Muse-Spark-Open-816B-A42B` | `0fb02478b02565b2ce7fc57e6051c91172774ac9` | 65 | gated/manual |
| `stepfun-ai/Step-5-Preview-BF16` | `7734b7ffac118d70d8398bfa3eb0fab007eb45b1` | 28 | not gated |
| `nvidia/NVIDIA-Nemotron-3.5-Bolt-74B-A9B-24GB` | `c6cc2e8ffa353403213d6b9b18aaf8eb684d705a` | 90 | not gated |
| `nvidia/NVIDIA-Nemotron-3.5-Super-VL-120B-A12B-BF16` | `1f8953f7f0935358e3605150d22bc15df062061c` | 64 | not gated |
| `tencent/Hy-Memory-30B-A3B` | `64a460a94d5498b7316fb02395c72d01c47a7347` | 51 | not gated |
| `deepseek-ai/DeepSeek-V4.1-Flash-1017` | `1bae0e1088993b9b82de08f59de5be5a34e42170` | 48 | not gated |

| October 18 interactive/data source | SHA-256 |
|---|---|
| `src/data/commercial-model-snapshot.json` | 1c8aa5f00a38bfb08e9a0ae09627da145b50bef447df5b342592dd1c9c384cb2 |
| `src/components/chapter-17/CommercialModelBenchmarkExplorer.tsx` | 5229c27cb233d02aca0ba6b24d9629431c6b02206a217358a9bf02e1e2c8c125 |
| `src/components/chapter-17/visualizers.css` | 6e037bb95ea59b7753666fa0519489c8a39a12cb4f380956a1c9928eaa534247 |
| `src/components/chapter-12/SchedulingVisualizer.tsx` | 7c677ebf310739fb9d41c6e19ae2f48472f1b6f93b2339a61a3000e921cf1d22 |
| `src/components/chapter-12/visualizers.css` | 00487f06517370442b9ac351cf8e398581d74508cc91656bcfbd62a2f8a0f287 |

## 2026-10-25 Update Review

- [x] `chapter-16/decision-models-and-selective-prediction` — EN/KO inspected 2026-10-25; numbered navigation, search metadata, references, equations, quizzes, and browser behavior checked. Current hashes are in the canonical inventory.

### October 25 scope and evidence

- Baseline: clean `main` at `3ae730d44557ef85bd3055db18598fc57be084f3`. The final canonical inventory contains **103 EN/KO pairs**, in the same slug/number/order in pages, navigation, chapter list and current inventory. The newly added 16.7 was initially marked unreviewed and was promoted only after source and rendered inspection.
- Changed 19 pairs. Full editorial inspection is recorded for 8.2, 14.2, 14.3, 16.7, 17.6, 18.3 and 19.2. Other changed rows remain `Mechanical only` in the canonical table: their focused research/UI edits do not claim a whole-page editorial reinspection. Their former inspection evidence remains in the baseline commit. Unchanged pages retain their own earlier evidence dates; a whole-book mechanical scan is not a fresh deep review of all pages.
- Rechecked 26 selected generative-model profiles, including MiniMax M3.1 Flash, Kimi K3.1 Pro/Highspeed, Ling 3.1 Flash, Sante, Smaug NVFP4 and Bolt E4B. Separated API launch, promised weights, actual files and artifact-revision dates. Added revision-specific DeepSeek 1017 evaluation; refreshed three observed task costs. Hosted 1019/Highspeed profiles do not donate measurements to different checkpoints. No universal winner or equal-effort ranking is claimed.
- Added 16.7 for Jev 1.14, the October 22 Decisions GA, open d1 and LemonDecider: typed contracts, calibration versus confidence/coherence, cost-sensitive decisions, abstention, evaluation isolation, execution authority and rollback. Added October 20 Voxtral 3 API-preview evidence to 11.2, preserving the distinction between self-deployment and public weights.
- Recent research includes option-name/definition instability, probability coherence, Raw-RAG (October 22), plan compliance and right-sizing by completed-task cost. Source findings, provider claims, bounded evidence and editorial engineering implications are distinguished. Rewrote unsupported RRF/MaxSim, entropy/truth, ANN scaling, Chinchilla-ratio and logit-lens claims; removed unsupported example references and production-grade labels.
- Mechanical pass: ordered inventory, MDX/frontmatter/import/reference/quiz/local-link contracts, bilingual headings/quizzes/reference URLs, time-sensitive patterns, and Python-block syntax. All 14 Python blocks in the affected pages parse. The lens extraction is deliberately educational and **not GPU/model smoke-tested**; no training run or local model-quality evaluation is claimed.
- Node **v24.19.0**. `npm run test:content` passes. `node --test --test-isolation=none scripts/*.test.mjs` passes **53 tests** across 13 files. `SITE_BASE=/foundation-model-engineering ASTRO_TELEMETRY_DISABLED=1 npm run build` produces **208 pages**, with no build/KaTeX warnings or errors. `git diff --check` passes.
- Browser evidence uses an isolated headless Chrome profile with cache disabled and waits for navigation plus island hydration. Baseline: 52 interactions × 2 languages × 2 widths = 208 mounts, identifying mobile overflow in ten examples and unlabeled controls. Updated inventory: **53 interactions × 2 × 2 = 212 mounts**, all with no runtime/hydration exception, NaN/Infinity, unlabeled input/select/textarea, or component-root overflow. Nested, explicitly scrollable tables/plots retain readable content.
- Model explorer: **480** metric/axis/provider/language/width states, including **112 empty states**, passed against the dataset. Verified filter/selection/list consistency, revision-isolated missing values, keyboard selection, Highspeed's absent index/cost and mobile layout. The source snapshots remain visible.
- Targeted functional suite: **172 checks** over both languages and widths for decision-cost/shift/zero-coverage policies, exact RRF ties at k=2, current preset query and unsupported-query behavior, edge-bound traversal and keyboard replay, pass@k boundaries, entropy's consistent-but-wrong counterexample, effective data counts, Korean/empty n-grams, fixed-ratio unit conversion, PTQ/QAT gradient states and deterministic pixel-noise replay. **36 final checks** cover the later graph-scroll/readability, quantizer jump derivative, chart keyboard focus, memory-fit caveat, lens section parity and Voxtral reference changes. Desktop/mobile screenshots were visually inspected.
- All **137 distinct content URLs** in the changed pages resolved with HTTP 200 at final verification. Eight public weight repositories were checked again for file listings/revisions below; weights were not downloaded or evaluated. A separate Kimi repository metadata query returned unavailable (401), which is **not proof of absence**; the provider's explicit November 4 plan is the evidence for the planned-weight label. Rechecked TypeSafe aliases, Mistral's still-preview/still-coming weight status, and Decisions' current official documentation.
- Both home pages show **2026-10-25** after the content pass. No external service credentials or paid model calls were used. The benchmark and teaching data are dated/static, not live claims of production readiness.

### Current changed-file evidence (2026-10-25)

| Route | Inspection scope | EN SHA-256 | KO SHA-256 |
|---|---|---|---|
| `chapter-11/audio-and-speech-integration` | Focused changes + mechanical/rendered | fa7776b0ab0b37009a782b6a3a287422cadbca98042f32aeb96d15128840cbe4 | 7b5ea4a0872f18019dd5c3e2717a5f86cf91542503a80b389373ca856e2207da |
| `chapter-11/image-diffusion-models` | Focused changes + mechanical/rendered | 89d8c76a3552193fa4a004176f77b1a66ac3ac22be96c45e83d03f4c6ecc5eab | 3d131457c3967a1b0526d533d4c1fd4dacc32efd613fae4a0d51df28ea6404c0 |
| `chapter-13/ptq-vs-qat` | Focused changes + mechanical/rendered | 5e3392378cb6f94f5118e745f20941979f460980aadea1460b1ba7bc62542185 | ef6b7fd390c5ec19460cf86378893cd6bfd67e4b55fd193307a6eebc40b051a4 |
| `chapter-14/advanced-retrieval` | Full editorial + rendered | 185df747656780bb8c6e973099be638e6be05625deb78c043f84cf0c73c321ba | 168067b55836a797166e7bb7e17a6c36b19c39950c10fb72f58814054b45dc05 |
| `chapter-14/lexical-to-semantic-search` | Focused changes + mechanical/rendered | 14b58e7aaf9ebe7914bbdc7dcb6de1b48eee71d893d20e58039dce184d55b9cd | 80983723429f788bbd719d8ac7ce5235fa89888ad9bd39aaf7ade613b32f7bb5 |
| `chapter-14/vector-indexing-and-db-solutions` | Full editorial + rendered | 9cd80b8fa316923b8db209981294ea15b991ef55851416fb72455a0f12d92783 | 7f9a5d85dde7cb1d91679e64a99760562b8640003062593ded9483faf4af35c4 |
| `chapter-16/agent-reliability-recovery-and-guardrails` | Focused changes + mechanical/rendered | cd83fc417cb7950d6d24116d1492925a16694aa596d897d0cb4cc7be3f18ca7e | 482fba3bba250ed2809c19f0acb31acc9d97fcf9d99b2088f72d33ec92ccf79c |
| `chapter-16/autonomous-agents` | Focused changes + mechanical/rendered | b51f1edbbc8e2835b81513202253bcc99bbb787b1943b63ca8c790f2dd8d8890 | 3a50252d5e6af7cb8e023553ae0eb4891d6dbc2b966c09f6960cc0e4b46e7c41 |
| `chapter-16/decision-models-and-selective-prediction` | Full editorial + rendered | 0e18d9f54a4b8ac6236a1d4a47f1cd346b2eb80ee16a8788da09d44d4c1fbbfd | 8807c28bb5c3d5546553f1d8b2a33aa97ffa8a2a01871eb966c5bdc48ef646d4 |
| `chapter-16/long-term-memory-for-agents` | Focused changes + mechanical/rendered | cc0dab02bb1ad2f5143836e2c99d8cf9ba36cb5b821df40ecd5e4abe8f13c814 | 24aaff72796bba711452b39745f3918b28e1c71abd741d90ab8e040d6c3e28ee |
| `chapter-17/academic-benchmarks` | Focused changes + mechanical/rendered | 2949edf4e9fe1e16fda3f118fa009854dbb67b9501b7989aece12379a4df2686 | 68c20de93679d7182f7813dbdb81fcacfeba0b5da7fa7cd25f2b210281858f9b |
| `chapter-17/commercial-model-benchmarks` | Full editorial + rendered | 9bcf043b6ac457d3ab1f48a09f84ed0f9b4f78b507375e72bccd6b288a1c71bf | 98b4665865afff71a76ef8df8ddd5c205fd7e0573ad0a82a84b54ccb26dcf8ec |
| `chapter-17/contamination-issues` | Focused changes + mechanical/rendered | 62c64faa2eace7fc44a1a5cacdd1d18f66a77076f895cdc174e3567a3eb670e3 | 34a7f9ae4c5bd1a8a665432847db7e40944911304323b083fd917b8300ab6ac2 |
| `chapter-18/hallucination-detection` | Full editorial + rendered | d3a1ee8ab17c7b845363483dd7b3112556523b0df6d833116a334717d79bdea3 | 85d58b77dcac5ff08bbdb13964faff2e93d8223760b0b46f4055337515d5162f |
| `chapter-19/logit-lens-and-attention-visualization` | Full editorial + rendered | 375b38b92e928542be1229502b08c4bd2b8bfcc901efbf9c3d42c78b288ee789 | 234c4c67ae2a9c992daaf3fac45fb4b7c55163cd3da54a3fcee37d9b79641ecc |
| `chapter-20/linear-attention` | Focused changes + mechanical/rendered | b5f004ec68fb2eab41361a24120bc2e7d505f555518ce9d219521b02f875a3ca | 855616db495c32f6d6686876915334dcba7b91187a3959988dc8052d230c42d3 |
| `chapter-6/synthetic-data-for-pre-training` | Focused changes + mechanical/rendered | aca3bc81c523dc7020041f03228c239c6b1bf2508215150219b4792811aabfcf | e741d3016b35739b5c2005462becdc3a00c9a13b9205eb66eb9854369915a0f1 |
| `chapter-8/chinchilla-optimality` | Full editorial + rendered | a5c303a07cd048a5700ec4cf86eeb44387cdcc43775eb4a2c5678f4aed6250d1 | 113d3edaa8047c8e5b5455f712a931429e550d22c1d260be5947dab80f4ef2a6 |
| `chapter-9/dataset-quality-vs-quantity` | Focused changes + mechanical/rendered | c1fbbd7fb05803bfad44ce38dbb967c1be944c928bea80897aa0756dc4ac28d6 | 4332f4d0804b6dfce324a5800be9907766526cd2299a2ee73a862326b97a7c98 |

### Reverified public weight files (2026-10-25)

| Repository | Revision | Weight files | Format |
|---|---|---:|---|
| `MiniMaxAI/MiniMax-M3.1-Flash` | `54e4e69dfc452b1e94a426c24a4fdeeaa8e3ad5e` | 49 | safetensors |
| `inclusionAI/Ling-3.1-flash` | `93e96ab91e800998388563295340a4238ff3e962` | 54 | safetensors |
| `inclusionAI/Ling-3.0-flash-Sante` | `f74bd27bd26ffc71a50dd847805f8f7666ff0b43` | 27 | safetensors |
| `abacusai/Smaug-Nemotron-3.5-NVFP4` | `f5b1cbbc0aa7aa83db2d02b6595420234d1e681e` | 88 | safetensors |
| `nvidia/NVIDIA-Nemotron-3.5-Bolt-E4B-4GB` | `1db54d5b12533ff1bcaa8e42cf4c667988a1f1be` | 1 | gguf |
| `LiquidAI/d1-3B` | `051bcc464b01b9f92942b364d9586b0ef5912432` | 1 | safetensors |
| `LiquidAI/d1-omni-600M` | `02b55d7076f15129e59ab3f94783f32c4b088674` | 1 | safetensors |
| `inclusionAI/LemonDecider` | `9a2f41d590a4ea0ed88af1938865695f9d6d8330` | 2 | safetensors |

### Active interactive inventory (2026-10-25)

Each row passed EN/KO × 1280px/390px mount/range checks. This table records browser verification, not a semantic endorsement of every unchanged teaching model. Rewritten interactions have the targeted checks above. Components present on disk but not mounted by MDX are excluded.

| Route | Component | Current source SHA-256 |
|---|---|---|
| `chapter-10/human-feedback-loop` | `TrajectoryAdmissionVisualizer` | e168c86be195aeae7a5841b299966514f44d4c11c1f9f44f3b901f0681f1a145 |
| `chapter-10/ppo-proximal-policy-optimization` | `PPOClippingVisualizer` | 1e2019addb4eeed08760491f1b4eb8f554c47f290b06ef604fe7425c80802b98 |
| `chapter-11/image-diffusion-models` | `DiffusionVisualizer` | 89d8c76a3552193fa4a004176f77b1a66ac3ac22be96c45e83d03f4c6ecc5eab | 3d131457c3967a1b0526d533d4c1fd4dacc32efd613fae4a0d51df28ea6404c0 |
| `chapter-11/video-generation-foundations` | `SpatiotemporalAttentionVisualizer` | e96a3ac89197abad00629c7e5298f502a5c7c2b9be87f1196fbda6f83c25b49b |
| `chapter-12/continuous-batching` | `ContinuousBatchingVisualizer` | c70f80f573cb1a4e4e827d5114328aaf0329ebade51331c6b6eb28099c4a1d29 |
| `chapter-12/kv-cache-management` | `KVCacheCalculator` | 3bac9d22a074afb4276e2bf705e295fdc15ee34c36c45fa073861a54a0455a64 |
| `chapter-12/long-context-serving` | `SchedulingVisualizer` | 7c677ebf310739fb9d41c6e19ae2f48472f1b6f93b2339a61a3000e921cf1d22 |
| `chapter-12/paged-attention-vllm` | `PagedAttentionVisualizer` | af544ff9f266fdcaf3a3e0f51fe20ff4b621d6ab5d4264850715cbc1611bb70c |
| `chapter-13/knowledge-distillation` | `KDVisualizer` | 8a144507608305431c17e24740a1feca192750d6d718593233e98ebf09384415 |
| `chapter-13/ptq-vs-qat` | `QuantizationErrorVisualizer` | 5e3392378cb6f94f5118e745f20941979f460980aadea1460b1ba7bc62542185 | ef6b7fd390c5ec19460cf86378893cd6bfd67e4b55fd193307a6eebc40b051a4 |
| `chapter-13/quantization-methods` | `QuantizationMethodVisualizer` | c5dca6c29a80d367bcc19884703ff2fcb237838e0de0f4a750bcd925409726bf |
| `chapter-13/weight-sparsification` | `SparsityVisualizer` | cb8a28e01813a5885ee47cf78fd62a88f7cf7e4335c709a583218ca44be7c598 |
| `chapter-14/advanced-retrieval` | `RRFVisualizer` | 185df747656780bb8c6e973099be638e6be05625deb78c043f84cf0c73c321ba | 168067b55836a797166e7bb7e17a6c36b19c39950c10fb72f58814054b45dc05 |
| `chapter-14/graphrag-and-ontology` | `GraphVisualizer` | 9555526cde2631410ce1c765ada571e80db142754957c8039125264797e0d906 |
| `chapter-14/lexical-to-semantic-search` | `SearchComparisonVisualizer` | 14b58e7aaf9ebe7914bbdc7dcb6de1b48eee71d893d20e58039dce184d55b9cd | 80983723429f788bbd719d8ac7ce5235fa89888ad9bd39aaf7ade613b32f7bb5 |
| `chapter-14/vector-indexing-and-db-solutions` | `HNSWVisualizer` | 9cd80b8fa316923b8db209981294ea15b991ef55851416fb72455a0f12d92783 | 7f9a5d85dde7cb1d91679e64a99760562b8640003062593ded9483faf4af35c4 |
| `chapter-15/search-time-compute` | `InferenceScalingVisualizer` | 89d640432bfb568981dd966b4343171022b543cb3a42d634547eec8c9088a2d0 |
| `chapter-15/tree-graph-of-thoughts` | `ReasoningVisualizer` | 893d4819ef8f86a89d748155b0f837e7bdbf258ade24eaaaf8b72584c9d2012c |
| `chapter-15/verifiers-and-reward-models` | `VerifierFlowVisualizer` | b8972fbf75134a30dd7565439d69d8fbe77a36a9d8164cf464a6cff08b44a401 |
| `chapter-16/autonomous-agents` | `LATSVisualizer` | b51f1edbbc8e2835b81513202253bcc99bbb787b1943b63ca8c790f2dd8d8890 | 3a50252d5e6af7cb8e023553ae0eb4891d6dbc2b966c09f6960cc0e4b46e7c41 |
| `chapter-16/decision-models-and-selective-prediction` | `DecisionPolicyExplorer` | 0e18d9f54a4b8ac6236a1d4a47f1cd346b2eb80ee16a8788da09d44d4c1fbbfd | 8807c28bb5c3d5546553f1d8b2a33aa97ffa8a2a01871eb966c5bdc48ef646d4 |
| `chapter-16/long-term-memory-for-agents` | `MemorySubstrateVisualizer` | cc0dab02bb1ad2f5143836e2c99d8cf9ba36cb5b821df40ecd5e4abe8f13c814 | 24aaff72796bba711452b39745f3918b28e1c71abd741d90ab8e040d6c3e28ee |
| `chapter-16/multi-agent-collaboration` | `MultiAgentTopologyVisualizer` | e47eb75ae9c29915b096f500bd6910c4aa85ba066c0c671c73d49da8d201a636 |
| `chapter-16/self-improving-agents` | `SelfImprovementGateVisualizer` | 9604ba7a53b9a2e6c73e5ac29cad3c718a9d963d23fee5e64b4501de015ad9a5 |
| `chapter-17/academic-benchmarks` | `PassAtKVisualizer` | 2949edf4e9fe1e16fda3f118fa009854dbb67b9501b7989aece12379a4df2686 | 68c20de93679d7182f7813dbdb81fcacfeba0b5da7fa7cd25f2b210281858f9b |
| `chapter-17/commercial-model-benchmarks` | `CommercialModelBenchmarkExplorer` | 9bcf043b6ac457d3ab1f48a09f84ed0f9b4f78b507375e72bccd6b288a1c71bf | 98b4665865afff71a76ef8df8ddd5c205fd7e0573ad0a82a84b54ccb26dcf8ec |
| `chapter-17/contamination-issues` | `NgramContaminationVisualizer` | 62c64faa2eace7fc44a1a5cacdd1d18f66a77076f895cdc174e3567a3eb670e3 | 34a7f9ae4c5bd1a8a665432847db7e40944911304323b083fd917b8300ab6ac2 |
| `chapter-18/hallucination-detection` | `SemanticEntropyVisualizer` | d3a1ee8ab17c7b845363483dd7b3112556523b0df6d833116a334717d79bdea3 | 85d58b77dcac5ff08bbdb13964faff2e93d8223760b0b46f4055337515d5162f |
| `chapter-18/jailbreaking-and-defense` | `SmoothLLMVisualizer` | 918929cd65f562caac7d24988ff38a14be27f1aeba0859fd3ca02d771d4cba0f |
| `chapter-18/red-teaming` | `AutomatedRedTeamingVisualizer` | 5fdb4a6a2cba38f034f72492f5f5610646e2b7ac579f8bf786b693f3c36a7225 |
| `chapter-19/logit-lens-and-attention-visualization` | `LogitLensVisualizer` | 375b38b92e928542be1229502b08c4bd2b8bfcc901efbf9c3d42c78b288ee789 | 234c4c67ae2a9c992daaf3fac45fb4b7c55163cd3da54a3fcee37d9b79641ecc |
| `chapter-19/mechanistic-interpretability` | `InductionHeadVisualizer` | 52b92c26d6a3e90d77d034121529941170350433154ddc9ae6348fed2200f584 |
| `chapter-19/probing-classifiers` | `LinearProbeVisualizer` | ea7eec5a2c60ef145627fed639558ba1d4583e17a0b63e213179e4e85e855ecf |
| `chapter-19/sparse-autoencoders-sae` | `PolysemanticVisualizer` | fa9b9e1fbb8e71acb5af373421aaceb24370055fa3d15f52bf00072b357e621c |
| `chapter-20/linear-attention` | `LinearAttentionVisualizer` | b5f004ec68fb2eab41361a24120bc2e7d505f555518ce9d219521b02f875a3ca | 855616db495c32f6d6686876915334dcba7b91187a3959988dc8052d230c42d3 |
| `chapter-20/mamba-and-s6` | `SSMDualityVisualizer` | 3b61a556b96561c7b5b5e5a8bb6281133ac98b09c4184d9620f1688e647129a5 |
| `chapter-20/multi-token-prediction` | `MTPVisualizer` | 06fb312e5b07e1d7141142738fd1027574ce377df309276ae6cc41f7d651d58f |
| `chapter-20/state-space-models-ssm` | `SSMVsTransformerVisualizer` | 3ae63bf94cec0a20a7b5030f9ea65f3c0c88c995cfa54a3e5168b6e707ae7763 |
| `chapter-6/data-engineering-at-scale` | `DataPipelineEvolution` | f48e0a208841ef5cafb3ba420571cd1fa52cb82a4d5e01efca16485d3f927122 |
| `chapter-6/infrastructure` | `ClusterTopologyExplorer` | a855e146a63d97f7287a69deec36709bbdbdd8fade3688d46bcff747612984a9 |
| `chapter-6/large-scale-training-stability` | `LossSpikeSimulator` | 5ed83bb25f36407c27656d1f38707adf9a6925bf95e5976ae2b10472f795faac |
| `chapter-6/synthetic-data-for-pre-training` | `ModelCollapseVisualizer` | aca3bc81c523dc7020041f03228c239c6b1bf2508215150219b4792811aabfcf | e741d3016b35739b5c2005462becdc3a00c9a13b9205eb66eb9854369915a0f1 |
| `chapter-7/data-parallelism` | `DDPBucketingTimeline` | 8a445e6a1b2580799d14be970209b9bc77166f03c1fa43af3a6f156af46b39b8 |
| `chapter-7/model-and-pipeline-parallelism` | `PipelineMemoryVisualizer` | 19da550e504d8bb7da3e41bde078dd64d1458b9dbb3a68f723c6387a0fdbcd24 |
| `chapter-7/zero-redundancy-optimizer` | `ZeROMemoryVisualizer` | b8877d5c479fde24367e80b03fea52b86478733638013bf53b1fef406e6e8461 |
| `chapter-8/chinchilla-optimality` | `ChinchillaAllocator` | a5c303a07cd048a5700ec4cf86eeb44387cdcc43775eb4a2c5678f4aed6250d1 | 113d3edaa8047c8e5b5455f712a931429e550d22c1d260be5947dab80f4ef2a6 |
| `chapter-8/over-training-vs-optimal-training` | `OvertrainingVisualizer` | e56f4e148ac3b11cdd1798f8afe5b28918bcd121408febedefccb5df9351842c |
| `chapter-8/power-law` | `PowerLawVisualizer` | 4504e68e806f58330301fc2b2a2b3f10be37056295167070d9c61cace67da1a9 |
| `chapter-8/transfer-learning-and-generalization` | `GrokkingVisualizer` | 4cc105ab9ee533c1e90e43db51aa475472c875da7fbeafd3286dfcfa299b774e |
| `chapter-9/dataset-quality-vs-quantity` | `DataQualityVisualizer` | c1fbbd7fb05803bfad44ce38dbb967c1be944c928bea80897aa0756dc4ac28d6 | 4332f4d0804b6dfce324a5800be9907766526cd2299a2ee73a862326b97a7c98 |
| `chapter-9/parameter-efficient-fine-tuning-peft` | `LoRAParameterVisualizer` | dd52d5a5bb934eed3aa91b83bc1b02ff0817c86d9b9efd7bd3f1eb0bf01d0b1c |
| `chapter-9/prompt-engineering-as-sft` | `DSPyCompilerVisualizer` | e9ab01ec69997d82609438e2bbedf89c85df47ae36e40bfbabf5201dfcbd44a0 |
| `chapter-9/synthetic-instructions-and-self-instruct` | `EvolInstructVisualizer` | 183e7bfe49ac50ff6b4a14e59ea0ad3f398f60e957f61ee7bc43017eb733cf63 |

Current benchmark dataset SHA-256: `49ff48120b3b889c671b270e8d8d466348ad2e1f0b5014fb0c25ab7a710a5ccf`.

### Final publication recheck

- The 22 mapped AA profiles were fetched again immediately before publication: all index values, task costs and v4.3.2 methodology matched the snapshot. Eight weight listings/revisions were unchanged.
- Highspeed has no independently verified context limit or separate public weight artifact in this pass. Those fields remain unreported rather than inheriting Pro specifications. After tightening that contract, all **64 affected All/Kimi × metric/axis × language/width states**, including eight empty states, passed again against the final dataset. The 36 final content/accessibility checks also passed again.
- Final unit/content/metadata/link tests: **53/53 pass**; deployment-base build: **208 pages**, no warnings/errors. Current changed-file and component hashes above bind this review to the final sources.

- Final visual follow-up: the RRF table keeps a minimum readable width and explicit keyboard-focusable horizontal scrolling; **16 final EN/KO desktop/mobile checks** passed for layout, exact ties and focus. The final screenshot was inspected after the CSS change.
