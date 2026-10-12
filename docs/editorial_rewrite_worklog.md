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

The following table is the current canonical inventory, in navigation order. `Inspected 2026-10-13` applies only to the listed current SHA-256 content hashes. `Mechanical only` preserves earlier review records and makes no new editorial-completion claim. The hashes bind evidence to each language file; subsequent content edits require a fresh inspection record.

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
| 4.5 | `/chapter-4/various-llm-architectures` | Inspected 2026-10-13 | 4a2439bcb08d342a543c912ddeeca92cbd97b17d2ff3550c5caf8833b9f32673 | e6947013caf3d4efa1903a1753946cc00bce285a929b3845f7dffbc1a463c390 |
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
| 8.2 | `/chapter-8/chinchilla-optimality` | Mechanical only | — | — |
| 8.3 | `/chapter-8/over-training-vs-optimal-training` | Mechanical only | — | — |
| 8.4 | `/chapter-8/transfer-learning-and-generalization` | Mechanical only | — | — |
| 8.5 | `/chapter-8/continued-pretraining-and-domain-adaptation` | Mechanical only | — | — |
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
| 12.5 | `/chapter-12/long-context-serving` | Mechanical only | — | — |
| 12.6 | `/chapter-12/serving-policies-slos-and-fallbacks` | Mechanical only | — | — |
| 13.1 | `/chapter-13/ptq-vs-qat` | Inspected 2026-10-13 | 803bc13a7ecf2cbde30264bbff3e63b8e9bb65d52e3188225be6594f747d145e | 758e33133a4a94ead9935a6c57162530ec924e9550b22c69be5fed557a0c5ac7 |
| 13.2 | `/chapter-13/quantization-methods` | Inspected 2026-10-13 | 17786fe86f7f3bc6edf5f5cd8020b3132963266c7083d452d1e629555eb8df91 | 5eb38a0204b52eeadf4b7a019f9a64452d38f6da7e2a5b3ca7be301f46d24fbc |
| 13.3 | `/chapter-13/weight-sparsification` | Mechanical only | — | — |
| 13.4 | `/chapter-13/knowledge-distillation` | Mechanical only | — | — |
| 13.5 | `/chapter-13/advanced-quantization` | Mechanical only | — | — |
| 14.1 | `/chapter-14/lexical-to-semantic-search` | Inspected 2026-10-13 | aa4ad303530afbceb80e8823140d329b4a0f398a4d5697899b5eb9aefea900f0 | a7f23d5c7a926362f71db95949eb760e6f682cd9275fb39f341f6d63ba782c69 |
| 14.2 | `/chapter-14/vector-indexing-and-db-solutions` | Mechanical only | — | — |
| 14.3 | `/chapter-14/advanced-retrieval` | Mechanical only | — | — |
| 14.4 | `/chapter-14/rag-orchestration` | Mechanical only | — | — |
| 14.5 | `/chapter-14/graphrag-and-ontology` | Mechanical only | — | — |
| 14.6 | `/chapter-14/rag-failure-modes-and-operational-design` | Mechanical only | — | — |
| 15.1 | `/chapter-15/chain-of-thought` | Mechanical only | — | — |
| 15.2 | `/chapter-15/tree-graph-of-thoughts` | Mechanical only | — | — |
| 15.3 | `/chapter-15/search-time-compute` | Mechanical only | — | — |
| 15.4 | `/chapter-15/verifiers-and-reward-models` | Mechanical only | — | — |
| 15.5 | `/chapter-15/reasoning-post-training-rlvr` | Inspected 2026-10-13 | adb5b5717d12125a26e7af3b6a3fd442a8f117e1e8629d279c5f039c52aaac2b | 54d5fea3b4fc5f6328de91e12ce86c31042794802928c42f1033b4b4df7e45a1 |
| 16.1 | `/chapter-16/function-calling-and-tool-use` | Inspected 2026-10-13 | 2c1926ca9a765c43ce7cef9a2ae1e9a6ba7ce2e27419c81e91f94ee274d0367c | 495ad575c567acc70c086386aebbc5ce1013f711d2a54735c4291f7c05a87b86 |
| 16.2 | `/chapter-16/autonomous-agents` | Mechanical only | — | — |
| 16.3 | `/chapter-16/self-improving-agents` | Mechanical only | — | — |
| 16.4 | `/chapter-16/multi-agent-collaboration` | Mechanical only | — | — |
| 16.5 | `/chapter-16/long-term-memory-for-agents` | Mechanical only | — | — |
| 16.6 | `/chapter-16/agent-reliability-recovery-and-guardrails` | Inspected 2026-10-13 | 52e62702837e7826aeb2cbad89844683663d4dfe4ea3227539e3000cde39a9d2 | fb565e9e2b3040fa5edbaf79ceadf69a5aff68f4f4ae492117361bc15639125e |
| 17.1 | `/chapter-17/academic-benchmarks` | Mechanical only | — | — |
| 17.2 | `/chapter-17/llm-as-a-judge` | Mechanical only | — | — |
| 17.3 | `/chapter-17/elo-rating-and-leaderboards` | Mechanical only | — | — |
| 17.4 | `/chapter-17/contamination-issues` | Mechanical only | — | — |
| 17.5 | `/chapter-17/production-evaluation-and-release-gates` | Inspected 2026-10-13 | 5d35307a30661bc74be66c3fda51ba7dba5e72b94178a8ba20c6f6504ba2fd84 | 187f256cc5b3b64f82e3d4afae03ed6ea2ba45f5156ff232e9c75cb185dd2464 |
| 17.6 | `/chapter-17/commercial-model-benchmarks` | Inspected 2026-10-13 | 2fdef240d5b9304a5dc9b591c5445a80468b9297e4480d567bd19d4da3d4dc9f | cb2c31e8047b0216e2207e8dcfe4f7a64cb38b9752779c35dfa990e2d9a7020a |
| 18.1 | `/chapter-18/red-teaming` | Mechanical only | — | — |
| 18.2 | `/chapter-18/jailbreaking-and-defense` | Mechanical only | — | — |
| 18.3 | `/chapter-18/hallucination-detection` | Mechanical only | — | — |
| 18.4 | `/chapter-18/scalable-oversight` | Mechanical only | — | — |
| 19.1 | `/chapter-19/mechanistic-interpretability` | Inspected 2026-10-13 | e78ed254abbd08dcc580e5d937948f89757d22138640f21b47a48ef61b6769c4 | fae2f16d1ef936dafbbe54ff2d8896e6110a4a9ecf1d33d5c29e0fd3599aff63 |
| 19.2 | `/chapter-19/logit-lens-and-attention-visualization` | Mechanical only | — | — |
| 19.3 | `/chapter-19/probing-classifiers` | Mechanical only | — | — |
| 19.4 | `/chapter-19/sparse-autoencoders-sae` | Inspected 2026-10-13 | 018f7a8f89fbe45ae3d03369863c38d3ed0b9d65b3ff34dee1e46dce09c6e57d | 62fd29a835a49e820c66560c39b9f54d361af016c768c7fea1c5f4942943accd |
| 20.1 | `/chapter-20/state-space-models-ssm` | Mechanical only | — | — |
| 20.2 | `/chapter-20/mamba-and-s6` | Mechanical only | — | — |
| 20.3 | `/chapter-20/linear-attention` | Inspected 2026-10-13 | 1b73732c6ee958727246ce8cb7692a7bfd823b7ed76dc04477e1c427840a646e | 21f23e0ef4673c53f29bcfb74a4b1f50391e7034d72507353c97166a459bab73 |
| 20.4 | `/chapter-20/neural-networks-as-programs` | Mechanical only | — | — |
| 20.5 | `/chapter-20/multi-token-prediction` | Mechanical only | — | — |
| 20.6 | `/chapter-20/diffusion-based-llms` | Inspected 2026-10-13 | f2236899fbf327ac90e1c1edae9c77a4173fb6721102a7364fbf85542541d836 | 0d5a117e60a90c1f8d746e5b29f01a13cc4929aa7a0e729e93fc003611ef22ed |
| 20.7 | `/chapter-20/path-to-agi-and-world-models` | Mechanical only | — | — |

### Verification for the October pass

- Node v24.19.0; `SITE_BASE=/foundation-model-engineering ASTRO_TELEMETRY_DISABLED=1 npm run build` generated 206 pages successfully. The final build log contained no warnings or errors.
- `npm run test:content` passed; direct execution confirmed 10 content-contract assertions, including ordered inventory, EN/KO page numbers, citations/imports, and inspected-file hashes. All 11 repository test files passed after the final build, including deployed-path/search metadata checks.
- 126 distinct external references in changed English pages were checked: 122 were readable through the web tool; four tool retrieval failures were independently checked with HTTP HEAD and returned 200. Citation/anchor and external-URL parity passed for all 28 changed pairs.
- Browser verification used an isolated headless browser and the final static site at its deployment base, with browser caching disabled. It exercised 80 benchmark metric/axis/provider combinations per language, filtered selection/ranking, missing data, keyboard selection, DSPy cancellation/restart/reset, all topology tabs, normalized induction rows and keyboard focus, new-page math, and 1280px/390px layouts. All four changed interactions passed in EN/KO with no runtime exceptions.
- The content pass finished before both home-page update dates were set to 2026-10-13. `git diff --check` passed. No publication or deployment was performed.

The inspected interactive-source hashes below bind the UI verification to the current implementations.

| Interactive source | SHA-256 |
|---|---|
| `src/components/chapter-17/CommercialModelBenchmarkExplorer.tsx` | 996e44475223271de6a98121b30d94d24628277a105dd57c99c28c76e9150321 |
| `src/components/chapter-19/InductionHeadVisualizer.tsx` | 52b92c26d6a3e90d77d034121529941170350433154ddc9ae6348fed2200f584 |
| `src/components/chapter-19/visualizers.css` | 0f4cc1d6cf6d53630101f85a2884189f6f05a12dcec239b1f40ff6b918fa220c |
| `src/components/chapter-6/ClusterTopologyExplorer.tsx` | a855e146a63d97f7287a69deec36709bbdbdd8fade3688d46bcff747612984a9 |
| `src/components/chapter-6/visualizers.css` | c4d501c8a07e98e360b28dc1a5e5ad84a552b42d28f59c3d5cae5ddd7108b435 |
| `src/components/chapter-9/DSPyCompilerVisualizer.tsx` | e9ab01ec69997d82609438e2bbedf89c85df47ae36e40bfbabf5201dfcbd44a0 |
