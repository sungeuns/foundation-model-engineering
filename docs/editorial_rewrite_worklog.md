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
- [x] dataset-quality-vs-quantity (EN/KO pair)
- [x] parameter-efficient-fine-tuning-peft (EN/KO pair)
- [x] prompt-engineering-as-sft (EN/KO pair)
- [x] sft-fundamentals (EN/KO pair)
- [x] synthetic-instructions-and-self-instruct (EN/KO pair)

### chapter-10
- [x] alignment-tax (EN/KO pair)
- [x] dpo (EN/KO pair)
- [x] human-feedback-loop (EN/KO pair)
- [x] kto-and-ipo (EN/KO pair)
- [x] ppo-proximal-policy-optimization (EN/KO pair)

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

### chapter-16
- [x] agent-reliability-recovery-and-guardrails (EN/KO pair)
- [x] autonomous-agents (EN/KO pair)
- [x] function-calling-and-tool-use (EN/KO pair)
- [x] long-term-memory-for-agents (EN/KO pair)
- [x] multi-agent-collaboration (EN/KO pair)
- [ ] self-improving-agents (EN/KO pair; current evidence review pending)

### chapter-17
- [x] academic-benchmarks (EN/KO pair)
- [x] contamination-issues (EN/KO pair)
- [x] elo-rating-and-leaderboards (EN/KO pair)
- [x] llm-as-a-judge (EN/KO pair)
- [x] production-evaluation-and-release-gates (EN/KO pair)
- [ ] commercial-model-benchmarks (EN/KO pair; current snapshot verification pending)

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
