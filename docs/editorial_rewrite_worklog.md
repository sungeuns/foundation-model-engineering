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
| 1.1 | `/chapter-1/symbolism-vs-connectionism` | Inspected 2026-11-25 | 0716f9db3899f06858b670a0db1a2df64c2b7604cfd43271b47e8dc4fde62724 | 53beeda6131ee1bbdbdf19474ab6627888550515acee9b3805e2c6d330f14cd3 |
| 1.2 | `/chapter-1/power-of-representation` | Inspected 2026-11-25 | 594cb7c0c43d5e5ed15a129a3d067bb6076a8a51c9a325fba642f5b85fcbb9d0 | 1d914327b1d0f84d6af190450901d013b3dee6ecc439156f61209203c220c6da |
| 1.3 | `/chapter-1/deep-learning-paradigms` | Mechanical only | f373b59e6d5782c6150b3b363f1d61ba9d3a4ecab555ade160773d88a2489ff5 | 73265363881ee05ce8f60d1e80ab001c55ff58d7207f386e7f50a5b0b63353ac |
| 1.4 | `/chapter-1/bitter-lesson` | Mechanical only | f69188e38bc792ee461c83466da32354065ebdff52e5a7197d8a2d81743e92e3 | d44863149ee015e681a6439ed6e9ff3771e74199015814dbcbc352b61fc0a850 |
| 1.5 | `/chapter-1/learning-path-and-mastery` | Inspected 2026-11-17 | 0f8f04bb12ad70521b3c701fae89e83133b936a5d28d74a07b17d6a0f9d55c12 | 7afd35142e5986833e81c484c1c3d7fe0b717d7d728be32693fb4ec93a0ff029 |
| 2.1 | `/chapter-2/markov-chains-to-rnns` | Inspected 2026-11-15 | 0ce137827271786ce59fbb687ede850189b1842843a7e11d9420e8d51da672c8 | 0d4b5440f58a02205e9c981af00a3d028f6e7081b2923f0a609a0f0f9e581e2a |
| 2.2 | `/chapter-2/vanishing-exploding-gradients` | Inspected 2026-11-15 | f883974659fb302e235151e51e0cffb5a6f9418089342fa6be149d94c207ffac | 7a4baf6b5be2bf9ff72621f15581483e6595c47296cb169d5d1c03395b882385 |
| 2.3 | `/chapter-2/dawn-of-attention` | Inspected 2026-11-15 | e3df7fbeb285121402336d5a6a0c154e791da8c420e0e19716aa9a78ed478b16 | f8ca565f4756b8e2138133b67002a29e007ed381cbd24be6cf79b518888600c0 |
| 2.4 | `/chapter-2/cnns-for-nlp` | Inspected 2026-11-15 | 37f7b031323ada4d1eb80b89d4ba1a7a33eb6ec127580aaed5e31500107e5ca2 | 4ffc530cb6c1a5483ef59e35462a49712c19200a70593fd408e5698050ec53c5 |
| 3.1 | `/chapter-3/self-attention-mathematics` | Inspected 2026-11-25 | ef9cc6c406b93e84902c0080009a02e8b3c9a64b29a016ab10752ce974e49229 | 999ed01fb864abf45042c9ad3ccef4122d307affa4cd1420e85dcc19c1646d82 |
| 3.2 | `/chapter-3/multi-head-attention` | Inspected 2026-11-25 | bc5026a7ec1b9aa4d5bc4589f7f6011630bc877efcb8d179954ee0560d8a705f | 4316a26ed2c414ccdb0c4f4ad6642d98286b9350748fd362920a1d183cac8b68 |
| 3.3 | `/chapter-3/position-encoding-strategy` | Inspected 2026-11-15 | 63c3645268727e12760f56b1748a44bbac8afd1c7f66f9d49329e76e39130fb8 | 17d34127b63e936f20ca9f2440fa2aed52e5291548cf18a9dcf8b4f3fdf7463e |
| 3.4 | `/chapter-3/layer-normalization-residuals` | Inspected 2026-11-25 | a3587f46c53f4796ac71f768e9561130af2c053e394f20d83a1d8f12a6841487 | a69ef3c4fc27e17f5313847ce8003f1b3acb57db1b99557a5354f904818065ba |
| 3.5 | `/chapter-3/complexity-analysis` | Inspected 2026-11-15 | 528f765af0e658c5d7116b5d3651be5a3ec6496b5651970285143831e0344b2c | d5da6dea75982e92dc97033508aacd582e677911caa2afbfb61f1356fbf12537 |
| 4.1 | `/chapter-4/encoder-only` | Inspected 2026-11-25 | d1ead46157733149700b6dbe04d9b4b762b926993bb8fbd5656077c6183979a9 | 20c6167fe0147b402577fea44ad27b8267f000770e267848e558f60acc6969cf |
| 4.2 | `/chapter-4/decoder-only` | Inspected 2026-11-25 | 566f11bdb11a6760f26ac9639bd0922af4ad46077497b6332ca7d4647a090e8b | 7a42e67720a62c01c9801e20b6ef5523aa9f6fb0fe3b60cdb074afb20dc23897 |
| 4.3 | `/chapter-4/encoder-decoder` | Inspected 2026-11-25 | a81d35a1f33c94b446e07b1a1c911d1288c7936c2231803a570350bdf7ff76ae | 124605867b0725c421d411857fa79b4d56f1a39a0f1c02d401f7c82686e5128a |
| 4.4 | `/chapter-4/hybrid-prefix-lm` | Inspected 2026-11-25 | 6edb93ff3d69526c5abd2108193b487cc82eb60c9c9887033237a77e72052127 | 59715e846873b8af91b74291aa803ff3047a646a79042af60da4b04a3dccef60 |
| 4.5 | `/chapter-4/various-llm-architectures` | Inspected 2026-11-24 | 028ebccee02c3a1b30297a6c43b9ed91806975ff737f33e8a5ccd5ea26f26a30 | 5d9fb05bb56198c702831691a20832099bac533ece95857c22101dfb884863a8 |
| 5.1 | `/chapter-5/sparse-vs-dense-models` | Inspected 2026-11-25 | 01f8735ffcc52bb919dfea3402cb6fbdb0313849c20a83c447820f04e5bb6c08 | 7908d7d81bd30342d4223623ac332bf1d17f91a47e55e1deb8ba8d3ee2b88c37 |
| 5.2 | `/chapter-5/routing-algorithms` | Inspected 2026-11-15 | 3b83671dec53a4a69ee8c357d810ac48b3b2b069f1b54fdb76a8e567ae6ed3e7 | 436d75fa19297b28084c3bf55cb2e92e341e86d33370e1843de1c263a8f9d356 |
| 5.3 | `/chapter-5/expert-parallelism` | Inspected 2026-11-25 | 75beb517abd6e9d61832a0e3cdb79eac46c214026c2cbd86c6946965d07209d8 | a34266db4231c9ecb6970fbe47c569dce99129dbe3e82c2027c050b8fe1fb9dc |
| 5.4 | `/chapter-5/collapsing-load-balancing` | Inspected 2026-11-15 | 9eafbfd1e7b75ad8196d586895ed76c5c16b609fb3b6d7c3c6450331d3fbec83 | e882e33f29592a27d156efc7b998c7f7d1fa8a3f2e8f63179ad4319ef47ab56a |
| 5.5 | `/chapter-5/case-study` | Inspected 2026-11-15 | f9e6e1c0fde57aac1cbcf9f3303676fb84e6e31a7b7f11e026ef961b61d8b0c8 | dd5217b2e0027bf27ea9b37275452ae728ce3a4f7471bf309303cf6888761297 |
| 6.1 | `/chapter-6/data-engineering-at-scale` | Inspected 2026-11-15 | c962ed779370d70734cdc1d8dad26fd622732ab5add4b42eb33ca13d4e9e1978 | 196b5d2f730cb1450a5c68054444814151be61cda197d8cad6d5e761caf2e85e |
| 6.2 | `/chapter-6/tokenization-science` | Inspected 2026-11-15 | a44817c410e5d865a65e9e9125ff9695fbe0929274162a12a59ae704df03aa73 | 84985d003c16025738d2ebfabc1a19ae0ac2fd4da81131f413a295f015725678 |
| 6.3 | `/chapter-6/large-scale-training-stability` | Inspected 2026-11-15 | 233421b292101c94f4746e41c29de6422c5c103333a5c1c6968cfe0cd3cc6604 | 149cc8e85a1db21731313a38038b3f3d23c5fdc16711b51534764c5e4fd2da89 |
| 6.4 | `/chapter-6/infrastructure` | Inspected 2026-11-15 | db766374738bc9706d644b19fc1d6ff8dcddbe74bc265f21de02ac95efbffa6d | 04218b7b41cc9ee92416a1f69070eebbbb6afcb6994a1fff5c98fe3e8b5de264 |
| 6.5 | `/chapter-6/synthetic-data-for-pre-training` | Mechanical only | 3d2bab63db26c5456f88eab0f51e2e7e70ac49d93d868427783f625e4ae166ee | dd5381b0b44cb0223b04f689d010f40ea3349d668ebf9e79c98fe3d3204af54c |
| 6.6 | `/chapter-6/optimization-mechanics` | Inspected 2026-11-17 | 942111c9629675b61e7af38dd1e0bb94a0dbe0aeff5c9d142fd7c7d0cc167b3e | 948f68b51e05f15a67755538714f595ff03ec214fe3c5d518eb6ebbff8000c22 |
| 7.1 | `/chapter-7/data-parallelism` | Mechanical only | 8c37d63a720ee64a8c4f37ac09c3062f12df4870500f1ee54d598637de7e8b8c | 7b3a07ce3c7c5ba3deb802af571117fcae1656b049e6b412614823b96c01b65d |
| 7.2 | `/chapter-7/zero-redundancy-optimizer` | Mechanical only | b126180d4c8d978f8925ed51d7ace338f8cdf2e7c7ecc1309ef2301714bd4e47 | e2b4c48bc0c2d11efbc40f02c428883a3f92d462adf354587b96bc5de42d1b06 |
| 7.3 | `/chapter-7/model-and-pipeline-parallelism` | Inspected 2026-11-15 | 0832cffc306946b61c817850cb07cdbebf0d06aadfe607b6b7dfe75d14d010bf | b645ef818ecb8e33702468b9dcacf90a130b6c229ed8603d055736e2e62f5db4 |
| 7.4 | `/chapter-7/flash-attention` | Mechanical only | f305f222c5d296652a665982d6148449b7cebebdd7073ee35ef221b39b750c4c | 7c296161f2a6d17d2c88531884e7a2ffb62021cfaf28828e9166c201a8df5184 |
| 7.5 | `/chapter-7/tiny-decoder-lab` | Inspected 2026-11-25 | 7c160ef525f9a15ee038febf92bfe2d7470ce1126fd565713003f049fd201fbe | 2c6db6829a15ced3552d7159932596c3dcba11ee031067240f1c6a9d921bf9e2 |
| 8.1 | `/chapter-8/power-law` | Inspected 2026-11-18 | 4a7985e2e292146826fa76fc39706838e6e5246fcb507f4fec94dc263ef2ba8a | 5d01ec1c25346796843c2fe7b635968a64b28f6333b2925a32884fb9364b884e |
| 8.2 | `/chapter-8/chinchilla-optimality` | Inspected 2026-11-15 | a5c303a07cd048a5700ec4cf86eeb44387cdcc43775eb4a2c5678f4aed6250d1 | 113d3edaa8047c8e5b5455f712a931429e550d22c1d260be5947dab80f4ef2a6 |
| 8.3 | `/chapter-8/over-training-vs-optimal-training` | Inspected 2026-11-15 | 0cd59dc676f0efe54f93a85775af740fc13bd689502b3ead940bf61212f2d83c | 21d9ca8bfbe9e711f63a75a24d0760d53ffdd87d8f22954f7ac911f7c0a18248 |
| 8.4 | `/chapter-8/transfer-learning-and-generalization` | Inspected 2026-11-15 | 6149872f6cc783dadf7e47acf48874d9abc6519c56fc7757b4d90f038decb547 | 0ac5c5ffb3ff08bc0fdf8fdde2e69bf8bdc9e69674d6e97a2b7cc3ee5c286290 |
| 8.5 | `/chapter-8/continued-pretraining-and-domain-adaptation` | Inspected 2026-11-25 | a05fce7aa246ca02074f01e86a35fc4535a5f81889953eb35dff00a4cd73bc61 | c456d2b4ee41ac376ffd24ba79b8d45f1c95dfccaefffbbb8b7ea4de8de17217 |
| 9.1 | `/chapter-9/sft-fundamentals` | Mechanical only | b2dbb035ab6f20f9feb26b00ddd7c7682a87073a963c6c684070bd7c7f1bcfe0 | 862868e98d4f3041ce06b9738bc2fc3ddeb8ab262d21f9248abe5b2831f0fcc2 |
| 9.2 | `/chapter-9/dataset-quality-vs-quantity` | Mechanical only | c1fbbd7fb05803bfad44ce38dbb967c1be944c928bea80897aa0756dc4ac28d6 | 9818a5430db861e431fa0fc861105c64cd5749eb7661fa4b9bbd7891fc486b13 |
| 9.3 | `/chapter-9/parameter-efficient-fine-tuning-peft` | Mechanical only | c51b6e408c85486d3438fda48d4165cd1cfc8ae7d251662f0033e80726ddc580 | 5e2052d35216a2a367fd9233ddbe9255b68cbbf1f0edaab5cd9e337f3311c04c |
| 9.4 | `/chapter-9/prompt-engineering-as-sft` | Inspected 2026-11-15 | a0d054e1053d08fb0459c941fc7b54a7935c42315c12fb0534d6adc5978c2f66 | a8eb98f41ea974270f2121a28d2e2478d1b6f34c5682172c52036eaf58e79a61 |
| 9.5 | `/chapter-9/synthetic-instructions-and-self-instruct` | Mechanical only | ffbd735a54153fd69c5c1a0717da310c2cc58903b0a34fee751f67e9db76ba0e | e2ba9a38024cd3fcaab7c042fb6300bce232e0b4ff9f22ce7698ec3456a93cb3 |
| 10.1 | `/chapter-10/human-feedback-loop` | Mechanical only | c721f614debefbefa2a90afe0f4dbc41425deb1e332f9ca1fda7ea4349e85668 | 04484c7249da48a808d45b3a79161557f6ddcd14cd3082c6c336097564f45612 |
| 10.2 | `/chapter-10/ppo-proximal-policy-optimization` | Mechanical only | 731530d0c49a2d72aceb412ad7635b834d3c04341f5fe838a11788e92127896f | 2aa2a123b0740c73c99d7e1c5c495669e81eb1ca2b113335b2fd0fe90196da50 |
| 10.3 | `/chapter-10/dpo` | Mechanical only | 61b39b4e59d60952d7a969476024a61f21223d09c62ae9e06e83559eaa04a855 | 5ea81a90b4a14be940d19dde889c28380e3b2198dcf6d9670a6adac402f21d2c |
| 10.4 | `/chapter-10/kto-and-ipo` | Mechanical only | 61ac741df320db7fb3031414fdacaf5770fa28200d3f91f8d69cec83c273c046 | 6a539344952c0246f5777ddf9e6a1be24babe58b085a53cc1752efa3ea2be7c5 |
| 10.5 | `/chapter-10/alignment-tax` | Inspected 2026-11-15 | e630460ac1b1a8620d753362e400c3bea18d69cff7a6265b3820b6ce7230c6f6 | 5041f746d84764553aecee5b114599a703cc2206889aa57838d5b2719b0bec7e |
| 11.1 | `/chapter-11/vision-language-bridges` | Inspected 2026-11-25 | 24fb4f6155431bf716e88e29bceaa78cbb3a5631641da212c9e073d7d71a10b8 | d0eba2f44cf9745be286fba5bd051849ee0471874e6c208df815f5bc3da8ff9f |
| 11.2 | `/chapter-11/audio-and-speech-integration` | Mechanical only | 3c8de54d3316183f25505eea48298dc784a4b0a61b55390f944bbc0a60ffef91 | 22e94e2436f5521f61e09272972d1e6d45237c4bb02d987c49af7e99eb1e8df7 |
| 11.3 | `/chapter-11/unified-multimodal-any-to-any` | Inspected 2026-11-15 | 63b49653980ac69e7662b92d1423aad27976789545651d8f21bb97c04a0993a2 | 05b4775ea2e63d295a8def6928b0a7280187755f1e95669da1a9db2ad9134158 |
| 11.4 | `/chapter-11/image-diffusion-models` | Inspected 2026-11-24 | 5bb8bc33ff8adf86105e24018b03423e9f19e0d29739f64b843c0cbeadea05e8 | 308de426fdbc7b1c845a4d63be36b83988abe2eb36026affba1dd101194816b7 |
| 11.5 | `/chapter-11/video-generation-foundations` | Inspected 2026-11-15 | b34544d0352be5feafdfc0d30ac23092d50edf3a3af5f3e4d37cc62531230c20 | 55c0488a07c962041cdbb0cdb945d18c8e136b23dba2aed6f6970f1c33cb4b4b |
| 11.6 | `/chapter-11/commercial-video-models` | Mechanical only | 12216aad67ffc900bcfe437f20a7fcf9be618ccc5d617f698f4466ef15ff33cb | 6ee6e17876daa24bd17b8d709b7f541276019da545887510035b916819ae13a3 |
| 12.1 | `/chapter-12/kv-cache-management` | Inspected 2026-11-25 | 8ae9f8716ff34e7ede151ca3e7b9cfde3eb2e1665f49fe10d62c65b94a045560 | b4fdaf7266a4de429a38dbe840c389f31dee09a961c069d937e4414700b3d88c |
| 12.2 | `/chapter-12/paged-attention-vllm` | Inspected 2026-11-25 | 52cf569f107eda54688b02ae4a5149d5191e4e56e3241ffe32a2b53ae8bc66d8 | 14402809f988d4e8b12edd29476af19ece120d3abe6c86ac16ca1a664496bb46 |
| 12.3 | `/chapter-12/continuous-batching` | Inspected 2026-11-25 | 588de002d211758e1fbb83af67004497e5280cad3512efc790f73f9b3d2a24b3 | 3f9ff09b65675139196bd073123e28a306180a8ec7d07398d1e331351f5a7124 |
| 12.4 | `/chapter-12/speculative-decoding` | Inspected 2026-11-25 | a5f93ea8411bab0fe68bf277224f8f19f111ac0f0fd73f6b4eda75739a8990b5 | 61986787b62bf6d99f59ab08a66d2ea6312e472faea94ded13c4a7d627d03cc4 |
| 12.5 | `/chapter-12/long-context-serving` | Inspected 2026-11-15 | 82f413a5a2e2731fe01603c7036b42dee434b010cc76410eba7e0807d73742e8 | 59933e962b9f0bef0f8b50e9889ec628fd92ade6d7d0fb91636981793bd83052 |
| 12.6 | `/chapter-12/serving-policies-slos-and-fallbacks` | Inspected 2026-11-25 | 8222c69fc753a073f358acef599ad825d1193693daa931acbd774081c82f2b46 | 35067207b0e514380e54bb373c7b545a075fc1999f3e039eb327edb1e13ba1a5 |
| 13.1 | `/chapter-13/ptq-vs-qat` | Inspected 2026-11-25 | 156ca2ee736440fc77b09629f937bdc027bbd4e7e8ea80d3584499b0f0721e54 | ce7f6e01c0bc440ee12795fa1fdc6b6c5089c14c8fb83616449ee99b6a62d59b |
| 13.2 | `/chapter-13/quantization-methods` | Inspected 2026-11-25 | f128eb1a2a438226a64a9e9f82f4eea316a0ddf62f38c32553657fbd9dad6944 | d2ef6a2e7b3349d2fa4a93ef0d79356511c79d4939a24bd5913965064c16bdaf |
| 13.3 | `/chapter-13/weight-sparsification` | Mechanical only | cef7eea23f21faf8a4719bc13b2f3e28a8743ba0230c67b01438dbac642a6530 | 4d1291c234050b189b7f5c66be305966e3fadd57ef521d171ca9283131987aed |
| 13.4 | `/chapter-13/knowledge-distillation` | Mechanical only | f184dcb71820a852dee1c7b2d640412cec7cad8a6f765ee912da00daf6b337f0 | 7c19030da7fe737ad78f41f6d09a1aa1107040bbb7cedcf7176b24e5db8dfccb |
| 13.5 | `/chapter-13/advanced-quantization` | Inspected 2026-11-15 | 27a364583a8df29cdea48119e65184594a4c27ab9f8f22437778a330596d4a3b | b55fe9860d8cf44911a1bf6508787d6c865bfbdf548adff861878ccdf10fd691 |
| 14.1 | `/chapter-14/lexical-to-semantic-search` | Inspected 2026-11-15 | 14b58e7aaf9ebe7914bbdc7dcb6de1b48eee71d893d20e58039dce184d55b9cd | 80983723429f788bbd719d8ac7ce5235fa89888ad9bd39aaf7ade613b32f7bb5 |
| 14.2 | `/chapter-14/vector-indexing-and-db-solutions` | Inspected 2026-11-15 | 9cd80b8fa316923b8db209981294ea15b991ef55851416fb72455a0f12d92783 | 7f9a5d85dde7cb1d91679e64a99760562b8640003062593ded9483faf4af35c4 |
| 14.3 | `/chapter-14/advanced-retrieval` | Inspected 2026-11-25 | f5261364645a4ac9935949094a48fd98f3884e66cbf40b675070b068874ebdce | 05784d2936ca643a04d71799ea2d33822708e1d77457ebf4c577293e47f95fb2 |
| 14.4 | `/chapter-14/rag-orchestration` | Inspected 2026-11-15 | c0415652280790508493840235e671903d660547416bc0bf3a73aba796039dd8 | 71eb996863fcf49fa62bc979e9167173c39fec0312811f89ac3095eca414b283 |
| 14.5 | `/chapter-14/graphrag-and-ontology` | Inspected 2026-11-25 | 1d56da922b530c30f04507318a0384f06ab78fde769574a20d96de1d2777026e | 0a9106cf60adb75afe3e3dd465c6c642b79fe2153b696ad812a7cc9e745cb780 |
| 14.6 | `/chapter-14/rag-failure-modes-and-operational-design` | Inspected 2026-11-25 | c72856114d2cb84479aafdc3b30c627c29b5aef1166e94797f37f2694fdf81ac | 8087cbcf0189649a93b9ae5cd534eebce28cb31bbfdeed8359f7cd5d1d4583f5 |
| 15.1 | `/chapter-15/chain-of-thought` | Inspected 2026-11-18 | dfa755568cbd54f3636f06ca66bc5a279f0d5f54f81d0589f4293abdabc5979b | 217a9074408e2c33d9405b96de888fd38d7b46a996ca24cffb9ce5056c16bf55 |
| 15.2 | `/chapter-15/tree-graph-of-thoughts` | Inspected 2026-11-15 | 7e8547ebde4982cf4cbab76343d088ceef6b39d22ad8b6d1403ddb292b381251 | 59780614eb21ba3c945f22c3defcd3ff49c762ef1b1c2b9c686d68660ef9147f |
| 15.3 | `/chapter-15/search-time-compute` | Mechanical only | 31e0f131da5e3af9e46feebd7fc7546e01faeaa7e7372ae8ca06c0c51a1470de | cf70e949b5f4a0088301170a03dc7b6981b8334e20b34a2f96412fd6b53a62f7 |
| 15.4 | `/chapter-15/verifiers-and-reward-models` | Inspected 2026-11-15 | 1df2f83671fe99369f93970e14964d76e87f0b4c5eae9ae80431f19b20e9ec4b | d8fb58ecaa2190024660cee06381a0d2ab5c04f4ef830ef6ddad789603be1063 |
| 15.5 | `/chapter-15/reasoning-post-training-rlvr` | Inspected 2026-11-15 | 5d7b0b2af95b466bfd3261c57d4597e27ec2abc2c2dca49a750cefa2ff7e4c7f | ad356581811918d430e3f75ddb4fab33d944cbe31a1a87ce59eeefaaaf02d7fd |
| 16.1 | `/chapter-16/function-calling-and-tool-use` | Inspected 2026-11-15 | 2c1926ca9a765c43ce7cef9a2ae1e9a6ba7ce2e27419c81e91f94ee274d0367c | 495ad575c567acc70c086386aebbc5ce1013f711d2a54735c4291f7c05a87b86 |
| 16.2 | `/chapter-16/autonomous-agents` | Mechanical only | 1cd74977e816829cc79cec624a2ec7bac64a3097a9d99709a3bc885efc82fd47 | 388ee3c6548171a9adc7b5f30bec329e9bfad5ad3a857fdfa7d31159942e632b |
| 16.3 | `/chapter-16/self-improving-agents` | Inspected 2026-11-15 | cdbdde227c5a7dc74ca2bdfc2c54f0b62d8d659b72ff06e7832e2cf0b4566719 | 82c98f13a708cfe27d97f74869cad8cfae0c7b7ce490e24447cdf38b8c21a282 |
| 16.4 | `/chapter-16/multi-agent-collaboration` | Mechanical only | a155d11e7c31a3c47f3b5a6ecbc02c54c5a3d638c70aac59e5fa0a48af1953df | 2dca3cc2d271f458117b44c0110ea8762a1416ab4f1554e10a4a87253e7a983a |
| 16.5 | `/chapter-16/long-term-memory-for-agents` | Mechanical only | 282f35343780e2c45555ff63e389a1335a91ec8c00f22085e8f8bbd8b97d3f0e | 121d1cb19357df979ff3139d6022f6041bc711842a38f62a81ecf5d87c592fcd |
| 16.6 | `/chapter-16/agent-reliability-recovery-and-guardrails` | Mechanical only | cd83fc417cb7950d6d24116d1492925a16694aa596d897d0cb4cc7be3f18ca7e | 16b6b0641b20d49d6fd5de7a7568d32d4889fe2fa1f88289396ea078b4874895 |
| 16.7 | `/chapter-16/decision-models-and-selective-prediction` | Inspected 2026-11-25 | 968048e13fae199978a109f4fef886dcc261832fbbfdd62899e96967209cca9f | 07b1f8a70ee24b852c35c5ee40502166c5d9c9cf63e984d30013442d89da1bc2 |
| 17.1 | `/chapter-17/academic-benchmarks` | Mechanical only | 2949edf4e9fe1e16fda3f118fa009854dbb67b9501b7989aece12379a4df2686 | 1b13ad1b53dafd3bc3d45f8253913244a7c02ed8336963afc3b707ab4607a567 |
| 17.2 | `/chapter-17/llm-as-a-judge` | Inspected 2026-11-25 | c57401335205ae3dc187e512d28443027ed79d13a6858df675662fe7dbe97ce4 | fed0a9a3459a3eb9683eb1576383f225b0943f807dfd1b3564bdb8603f8986d7 |
| 17.3 | `/chapter-17/elo-rating-and-leaderboards` | Inspected 2026-11-15 | 14f931df5e4641c576c1763d446b2c663d1f282abf438767e5a330d49b31a9b9 | 1e78f5819e5452372109f72327dad0f7831b3b9ce66750000c9378a906744c30 |
| 17.4 | `/chapter-17/contamination-issues` | Mechanical only | 38a0cad52c7504804a57a8cc2deed94a3ac2fe68f7648809261abad1cf6b4fa5 | ad7b87426dcdde29f69a6921696a462359e7681d7d3b5ee5c11f3d80ec0a71c7 |
| 17.5 | `/chapter-17/production-evaluation-and-release-gates` | Inspected 2026-11-25 | d2917516ef75c2ede2cd4db285a221090b09f181104e7112bd388f427ecc5298 | cb7d670ce7898fe43516e3cc8a38e295b6e24bba8e3a65c7579c61f3e03b9fb3 |
| 17.6 | `/chapter-17/commercial-model-benchmarks` | Inspected 2026-11-25 | 4a49828c17446fd693ac686fc8ff5511adde668d5bd79ad3a5c0d385889e7bd4 | 81b1ffabb6d28b33cd31188c769502570b14c35d6f3611eb6b421c48b4611b2f |
| 17.7 | `/chapter-17/experimental-design-and-uncertainty` | Inspected 2026-11-25 | 15572b32598a7c488cd3930fe29d3dd54f54ebd5521257817788e039253cdf1d | 00b4ea5b58d4ec986eee7b8d4ed7fbb61749c27a0c9c1c77aced73a4d86f14b1 |
| 18.1 | `/chapter-18/red-teaming` | Mechanical only | fa815b07490b4a1039a2e91d2c98e9f1f212d6479f534afa5f09020cc8f93598 | 5aa628372d20829e842ce6b3fad0133fee7c40e63c345e76f0b823b351df6f59 |
| 18.2 | `/chapter-18/jailbreaking-and-defense` | Mechanical only | caff93966e1d1a925120d696bf37a09fa46cc63cd9378c818ac9f1d489348afd | 165303014a71dfa4ec8e28c0ac7f38712f5d97fbcd551510aa5539cb33c33ac1 |
| 18.3 | `/chapter-18/hallucination-detection` | Mechanical only | d3a1ee8ab17c7b845363483dd7b3112556523b0df6d833116a334717d79bdea3 | e00f30c37d36caa4f654de8a6ac61a682be8526e6be2245f2d1235f53787be8c |
| 18.4 | `/chapter-18/scalable-oversight` | Inspected 2026-11-15 | ddc4e57280940d9f2de2d5e5f551b035d60ae4feeb324a2a84256e798feb9c7f | 5536d313417dd89e9909d73ed8762c85d7450129338432d8a05ea21c7ee99f3b |
| 19.1 | `/chapter-19/mechanistic-interpretability` | Mechanical only | e78ed254abbd08dcc580e5d937948f89757d22138640f21b47a48ef61b6769c4 | 146df874ff1cb000e3684a35ed34035a22b496a75e3fbe70e205b649ec302ee4 |
| 19.2 | `/chapter-19/logit-lens-and-attention-visualization` | Mechanical only | 8f6a64cbb90f5881b4fda6b927ecbdb6a9fe1fcf319cb3bdb5c873bce37a80e5 | e8c6c59743939cc2e865e2b40d86cfd76e6139a553fd10b7f5e46bcd71324f4b |
| 19.3 | `/chapter-19/probing-classifiers` | Mechanical only | ff555220f028dcfb555ef1730dbcd13126125884b4b81d97723d546b0156ce69 | ce3910c423dc09e77e395dabc340a4387d0c06021bd34f35616bf205efccce6d |
| 19.4 | `/chapter-19/sparse-autoencoders-sae` | Mechanical only | 1c9eeb21d547629108ec41532289a1de144a79897f4e85d20b421ac6603187fd | 223a4aa84b4b0a99a418e04aae959b76c0b804a2ca4a1eb0fe600388a503b075 |
| 20.1 | `/chapter-20/state-space-models-ssm` | Inspected 2026-11-15 | 62c29a98f3b7b0a6ec6474bcb6d941c649a324cb4c28be9a9f6c7938f0a939a5 | 21d0a1a63ca16d7a1777695359d7abc310d56a9d594b70b0097af63e11def139 |
| 20.2 | `/chapter-20/mamba-and-s6` | Inspected 2026-11-18 | a89134b1f0ca60b397d0fd46c4bcfa0a1ce045cd294ff4895af664f745a59255 | f4805c489887aa69e2c78a4c55b8d10219d9a37aecdcf070a4b5f7d1b10ec988 |
| 20.3 | `/chapter-20/linear-attention` | Mechanical only | fa24114e779a597a2e5337fbdfd4578973ed02167d343d554d3e87eb46afdd95 | 20a4f1b50a1fdf248d15a5ba1e421f02b4db55c4bf90f1b430c2865a4c17ca85 |
| 20.4 | `/chapter-20/neural-networks-as-programs` | Inspected 2026-11-15 | 55b5f77c413bfd3de7fa682467ff500d07887f4dabafbb79903beccf9b5c4759 | e88b792d77ef04624e0dee7e78480fadde710c80d0f3c1cdc729c60f56e765bf |
| 20.5 | `/chapter-20/multi-token-prediction` | Inspected 2026-11-18 | e6f6d2d7bcefe3b290e7c0d81c7612e000d2bcfe5dc3593a29a285e27416f560 | d407bab93f7b3b6e03c5ec9d36bced5d4df7e538fe6083aadd5d636b14fe80a9 |
| 20.6 | `/chapter-20/diffusion-based-llms` | Inspected 2026-11-15 | f2236899fbf327ac90e1c1edae9c77a4173fb6721102a7364fbf85542541d836 | 0d5a117e60a90c1f8d746e5b29f01a13cc4929aa7a0e729e93fc003611ef22ed |
| 20.7 | `/chapter-20/path-to-agi-and-world-models` | Mechanical only | 8183cc17179d853f3eeb28ec3a79304d0f964353738881a14598a24d9cb35450 | 32d969fab57f649573a5dc7db10b1afe6897596e02d990f1a5e96bf64a7c8cb1 |

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

## November 15 content and reading review

All 103 EN/KO pairs were inspected through the chapter-group editorial review and follow-up corrections. Current file hashes above identify the inspected text, not a guarantee of exhaustive correctness. Three independent, read-only reviewers covered foundations (1–7), training (8–13) and applications/frontiers (14–20); targeted rereviews found and resolved additional quiz, translation, masking and numerical issues. See `docs/review-2026-11-15.md` for scope, dispositions and validation limits.


## 2026-11-17 expertise and release follow-up

Canonical inventory: **107 EN/KO pairs**. Four new pairs were initially Mechanical only, then inspected in both languages and rendered before recording current hashes. Eleven pairs changed in this follow-up; unchanged pairs retain their November 15 inspection evidence. This is a focused follow-up to that full-book pass, not a second claim of a fresh exhaustive review.

See `docs/review-2026-11-17/goldfish_review_report.md` for review scope, findings and verification. The 32-model chart remains the dated November 15 evaluation snapshot; November 17 release evidence is a separate supplement.

## 2026-11-18 reader discovery and teaching pass

Freshly inspected eight changed EN/KO pairs (3.1, 5.3, 8.1, 12.1, 12.2, 13.1, 14.6, 17.2); hashes above bind those inspections to the final text. Other rows retain their earlier inspection evidence. Whole-inventory mechanical and thumbnail screening does not establish a new complete editorial review. See [content evidence](growth-2026-11-18-content.md), [visual evidence](growth-2026-11-18-visuals.md), and [growth work](growth-2026-11-18.md). A separate fresh-context comprehension review found no Blocker/Major and three Nits; the active-mask formula, paging exercise wording, and output-projection accounting scope were corrected. Final build/browser/test evidence is in the release report.

### 2026-11-18 teaching follow-up

Six EN/KO pairs (5.3, 7.4, 13.2, 13.3, 14.5, 15.1) were inspected and revised with concrete numerical examples, source checks and scoped code validation. See `growth-2026-11-18-followup.md` and its companion reports for evidence and limits. The hashes above bind this inspection to the current manuscript; this entry does not newly certify untouched pages.

### 2026-11-18 runnable entry and readout pass

Inspected 7.5 and 19.2 EN/KO pairs after adding self-contained notebook entry points and replacing misleading readout/attention illustrations. Hashes above identify the current inspected source. Independent review corrected source-byte preservation and scoped final-decoder equivalence to the actual output path. See `growth-2026-11-18-lab-entry.md`, notebook execution evidence, and figure/discovery companion reports. Unchanged pages retain their previous inspection dates.

### 2026-11-18 causal-diagram follow-up

Inspected 20.2 and 20.5 EN/KO pairs after replacing misleading generated figures with source-grounded HTML/CSS diagrams. The SSD example was checked numerically against recurrence; MTP diagrams distinguish shared parameters, auxiliary depth and training context. A fresh independent source review corrected quiz head numbering and found no remaining actionable issue in this scope. See `growth-2026-11-18-reader-feedback.md` and its SSD/MTP companion reports. Unchanged pages retain their earlier inspection evidence.

### 2026-11-24 model and multimodal update

Six EN/KO pairs (4.5, 11.2, 11.4, 11.6, 17.6, 20.7) were inspected in this pass; the current inventory hashes above bind that evidence to the text. The November 24 comparison replaces the November 15 chart and November 17 supplement with 43 selected profiles, separating primary-source verification from matched evaluation evidence. Architecture, speech, image, video and world-model changes preserve their disclosure boundaries. An independent read-only reviewer checked the comparison and sampled primary claims, and reported no unresolved significant findings after the GLM API wording correction. See `review-2026-11-24.md` and its architecture, multimodal and benchmark companion reports for scope and final validation. This is a focused update, not a new exhaustive review of all 107 pairs.

The November 24 follow-up added native fragment links to all 43 model rows in both editions of 17.6. Each link identifies the same source record as the chart. The current 17.6 hashes include these links.

### 2026-11-25 Korean lesson titles

The Korean title, frontmatter and former heading anchor were inspected on 37 lessons. In the inventory these title-only edits carry the current file hashes and the scope `Mechanical only`. The previous full-page inspection dates and hashes remain in this ledger at commit `d6eeb78`. Reversing the three title edits reproduced every original Korean manuscript byte for byte; the 37 English manuscripts also matched their previous hashes. This pass checked the headings and navigation rather than repeating those earlier technical reviews.

### 2026-11-25 retrieval and model comparison

The 14.3 revision follows the same ordered document IDs in the English and Korean prose, Python example and browser exercise. The candidate cutoff determines whether the incident log can be considered at all. Equal-weight fusion, the explicit dense-weight variation and tied ranks each have a calculation readers can reproduce.

The 17.6 revision matches the November 23 Ling-3.2-air and November 20 Tencent Hy4 checkpoints with their evaluation profiles. The November 23 ChatGPT rollout has its own product note. The source-backed November 24 comparison now has 45 profiles from 19 providers, 34 matched AA indices and 32 reported task costs. The downloadable cost example shows why two pairs of calls with identical total token counts can have different prices. The current inventory hashes above cover both revised lesson pairs.

### 2026-11-25 chapter links and mask verification

In 4.4 the revised figure and PyTorch example both use three prefix tokens and four target tokens. All 49 query/key entries were checked in both editions. The CPU regression changes a future value, tests every output against its expected value and exercises the old float-mask counterexample. The current 4.4 hashes bind this editorial review to the two published manuscripts.

In 12.1, inspection covered the nine-request scenario, shareable calculator settings and bilingual links. Seven other Korean pages each changed one cross-reference to point to the matching Korean chapter. Reversing that single href edit reproduces the earlier complete manuscript in every case. These eight pairs carry current hashes and the narrower mechanical review scope. Earlier full-page inspections remain at commit `f857238`.

### 2026-11-25 library records and downloadable mask example

Both editions of 1.1 now follow the same four catalog records through a symbolic rule, a threshold neuron and two ReLU units. The truth table, threshold equality and hand-set PyTorch weights were checked on all four inputs. Review covered the bilingual controls, keyboard input, narrow screens and existing section anchors.

Both editions of 4.4 show the source of the downloadable Python file. The CPU test changes one future value and checks the earlier output with each mask type. Inspection covered all 49 mask entries, both language editions, the shared images and the downloaded file. The November 25 inventory hashes identify the versions reviewed here.

### 2026-11-25 speculative sampling

Both editions of 12.4 now follow the same two-token distribution from proposal to rejection and replacement. The worked example accounts for the accepted mass, the residual, the biased result of redrawing from the original target and the case of no rejections. The cost example states its independence and stopping assumptions. The tree-decoding example was checked against the authors’ September preprint.
The Python example was checked over 225 pairs of three-token distributions, every possible rejection depth in a three-token chain, the all-accepted case and trailing zero-probability tokens at the upper random-number boundary.

### 2026-11-25 mixed-length KV caching

Both editions of 12.1 now count the same causal query/key pairs across two decode steps and follow nine unequal-length requests through prefill, reserved output and an over-budget case. The printed PyTorch examples ran on CPU. Each localized workbook was recalculated in LibreOffice against 15 cases including exact fit, zero output, invalid input and a changed cache geometry. The linked SmolLM2 notebook measures padding bytes and compares cached logits with recomputation. The current 12.1 hashes record this review.

### 2026-11-25 translation judgment

Both editions of 17.2 follow the same three candidate translations through placeholder validation and a permission check. The example ran in Python. Tencent's release and public checkpoints were verified against its model cards. The reported 3.31-point average standard deviation describes repeated judgments of 651 Chinese–English translations in the cited experiment. The Korean warning is a separate authored exercise.

### 2026-11-25 next-token training and serving

Both editions of 4.2 follow the three shifted targets in one four-token sequence. The PyTorch example checks causal visibility and a mean token loss of 0.520 nats. The new diagrams implement the four-position mask directly and distinguish allowed keys from learned weights. Review covered GPT-3's task-specific few-shot result, the scope of the scaling-law findings, and how both decoder-only and encoder-decoder models can reuse cached state.

### 2026-11-25 training exposure and serving cross-references

Inspection of both 8.5 manuscripts covered the service-ticket diagnosis, the meaning of a counted loss target, and two different sampling schedules with the same 112,000 targets. The inline examples and downloadable CSV auditor reproduce the same token shares. The 12.1 and 12.3 manuscripts reviewed earlier that day now link directly to the relevant block table, speculative decoding lesson and disaggregated serving section. Verification of these link-only edits covered the URLs, destination anchors and language in both editions.

### 2026-11-25 encoder attention and training targets

In 4.1, both editions distinguish the keys attended to by one query from the positions scored by the MLM loss. The two PyTorch reductions reproduce 1.040 and 0.693 nats. Review of 4.3 covered the three attention masks, the different reconstruction targets in T5 and BART, and the scope of the DeepSeek causal encoder description. With the two-query CPU fixture, changing a padding value leaves both outputs unchanged. Increasing the last real source value by 21 raises them by 7 and 12. Existing heading links are retained in both editions.

The 17.6 product note was checked against OpenAI’s November 24 API changelog and the Chat Latest model card. The rolling API alias can change between evaluations. The profile table retains the Astra and Sol evaluation settings.

### 2026-11-25 normalization and paged KV address checks

In both editions of 3.4, the two-feature browser example and CPU PyTorch agree for an offset, a nearly constant input and a constant input at both epsilon settings. The worked residual example distinguishes the zero-branch behavior of Pre-LN and Post-LN. In 12.2, request A’s block table maps five logical values to physical blocks 0 and 2. The CPU example checks the logical rows and final attention value, excludes unused tail slots and refuses incomplete or out-of-range active mappings.

### 2026-11-25 expert dispatch, decision costs and deployment

In 5.3, the code visible in both editions is also the downloadable two-process CPU exercise. Six tokens test uneven all-to-all dispatch and the return to source order. Additional runs cover a process that starts with no tokens and one that receives none. In 16.7 the two fixtures keep scores and the overall positive rate fixed. Of the same 40 automatically accepted cases, errors rise from four to twelve. The cost estimate and observed cost have separate readouts. In 17.5 the worked release decision uses the 17.7 fixture. A 15-point target gain clears its threshold while a 25-point loss on a protected capability blocks deployment.

### 2026-11-25 quantization and graph evidence

The 13.1 CPU examples and browser grid cover a value on a half-step, a rounded code still within range, and a clamped code. The PTQ example accumulates activation maxima over calibration batches and includes both scales in the checkpoint. In 13.2, a five-weight dot product exposes the effect of the input activation on each rounding error. The browser's 693 bit-width and range combinations were checked against a CPU PyTorch calculation with the stated midpoint convention.

In 14.5, ranking the graph nodes places Mina and Vendor Z at exactly the same score. The example includes both at the cutoff and checks the two source passages used to answer the CEO question. Section 14.3 links to that exercise. The 12.1 worked example can be found by its 24 GiB budget and retains its previous heading links. In-book search also indexes the two named exercises rendered by React in 12.1 and 17.7.

### 2026-11-25 batched padding and measured cache payloads

The two-request example in 3.1 verifies valid outputs against independent expected values. With the mask axes reversed, changing a padding value from 90 to 900 changes a valid answer from 50 to 455, even when two implementations agree with each other. The correctly expanded batch mask keeps that answer at 10. The downloadable script preserves the earlier four-token exercise.

In 12.1, both notebook editions use the same pinned checkpoint, tokenizer and executable cells. Independent CPU kernels measured 1,013,760 bytes after prefill and 1,382,400 bytes after four additional positions per request. Eight padding positions account for 368,640 bytes. All four cached next-token logit comparisons passed. The experiment counts logical key/value tensor contents on CPU.
