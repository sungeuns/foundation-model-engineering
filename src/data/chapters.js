export const chapters = [
  {
    id: 1,
    title: { en: "1. The Evolution of Intelligence", ko: "1. 지능의 진화" },
    subs: [
      { id: "1-1", title: { en: "1.1 Symbolism vs. Connectionism", ko: "1.1 기호주의 vs. 연결주의" }, path: "/chapter-1/symbolism-vs-connectionism" },
      { id: "1-2", title: { en: "1.2 The Power of Representation", ko: "1.2 표현의 힘" }, path: "/chapter-1/power-of-representation" },
      { id: "1-3", title: { en: "1.3 Deep Learning Paradigms", ko: "1.3 딥러닝 패러다임" }, path: "/chapter-1/deep-learning-paradigms" },
      { id: "1-4", title: { en: "1.4 The Bitter Lesson", ko: "1.4 쓴 교훈" }, path: "/chapter-1/bitter-lesson" },
    ]
  },
  {
    id: 2,
    title: { en: "2. The Sequence Modeling Era", ko: "2. 시퀀스 모델링 시대" },
    subs: [
      { id: "2-1", title: { en: "2.1 Markov Chains to RNNs", ko: "2.1 마르코프 체인에서 RNN까지" }, path: "/chapter-2/markov-chains-to-rnns" },
      { id: "2-2", title: { en: "2.2 Vanishing/Exploding Gradients", ko: "2.2 기울기 소실/폭주" }, path: "/chapter-2/vanishing-exploding-gradients" },
      { id: "2-3", title: { en: "2.3 The Dawn of Attention", ko: "2.3 어텐션의 여명" }, path: "/chapter-2/dawn-of-attention" },
      { id: "2-4", title: { en: "2.4 CNNs for NLP", ko: "2.4 NLP를 위한 CNN" }, path: "/chapter-2/cnns-for-nlp" },
    ]
  },
  {
    id: 3,
    title: { en: "3. The Transformer Deep Dive", ko: "3. 트랜스포머 심층 분석" },
    subs: [
      { id: "3-1", title: { en: "3.1 Self-Attention Mathematics", ko: "3.1 셀프 어텐션 수학" }, path: "/chapter-3/self-attention-mathematics" },
      { id: "3-2", title: { en: "3.2 Multi-head Attention (MHA)", ko: "3.2 멀티 헤드 어텐션" }, path: "/chapter-3/multi-head-attention" },
      { id: "3-3", title: { en: "3.3 Position Encoding Strategy", ko: "3.3 위치 인코딩 전략" }, path: "/chapter-3/position-encoding-strategy" },
      { id: "3-4", title: { en: "3.4 Layer Normalization & Residuals", ko: "3.4 레이어 정규화 및 잔차" }, path: "/chapter-3/layer-normalization-residuals" },
      { id: "3-5", title: { en: "3.5 Complexity Analysis", ko: "3.5 복잡도 분석" }, path: "/chapter-3/complexity-analysis" },
    ]
  },
  {
    id: 4,
    title: { en: "4. LLM Architectures & Paradigms", ko: "4. LLM 아키텍처 및 패러다임" },
    subs: [
      { id: "4-1", title: { en: "4.1 Encoder-only (BERT-style)", ko: "4.1 Encoder-only (BERT-style)" }, path: "/chapter-4/encoder-only" },
      { id: "4-2", title: { en: "4.2 Decoder-only (GPT-style)", ko: "4.2 Decoder-only (GPT-style)" }, path: "/chapter-4/decoder-only" },
      { id: "4-3", title: { en: "4.3 Encoder-Decoder (T5/BART)", ko: "4.3 Encoder-Decoder (T5/BART)" }, path: "/chapter-4/encoder-decoder" },
      { id: "4-4", title: { en: "4.4 Hybrid & Prefix LM", ko: "4.4 Hybrid & Prefix LM" }, path: "/chapter-4/hybrid-prefix-lm" },
      { id: "4-5", title: { en: "4.5 Various LLM Architectures & Latest Trends", ko: "4.5 다양한 LLM 아키텍처와 최신 트렌드" }, path: "/chapter-4/various-llm-architectures" },
    ]
  },
  {
    id: 5,
    title: { en: "5. Scaling Mixture of Experts (MoE)", ko: "5. 전문가 혼합(MoE) 스케일링" },
    subs: [
      { id: "5-1", title: { en: "5.1 Sparse vs Dense Models", ko: "5.1 희소 vs 밀집 모델" }, path: "/chapter-5/sparse-vs-dense-models" },
      { id: "5-2", title: { en: "5.2 Routing Algorithms", ko: "5.2 라우팅 알고리즘" }, path: "/chapter-5/routing-algorithms" },
      { id: "5-3", title: { en: "5.3 Expert Parallelism", ko: "5.3 전문가 병렬화" }, path: "/chapter-5/expert-parallelism" },
      { id: "5-4", title: { en: "5.4 Collapsing & Load Balancing", ko: "5.4 전문가 붕괴와 부하 분산" }, path: "/chapter-5/collapsing-load-balancing" },
      { id: "5-5", title: { en: "5.5 Case Study", ko: "5.5 사례 연구" }, path: "/chapter-5/case-study" },
    ]
  },
  {
    id: 6,
    title: { en: "6. Foundation Model Pre-training", ko: "6. 파운데이션 모델 사전 학습" },
    subs: [
      { id: "6-1", title: { en: "6.1 Data Engineering at Scale", ko: "6.1 대규모 데이터 엔지니어링" }, path: "/chapter-6/data-engineering-at-scale" },
      { id: "6-2", title: { en: "6.2 Tokenization Science", ko: "6.2 토큰화의 과학" }, path: "/chapter-6/tokenization-science" },
      { id: "6-3", title: { en: "6.3 Large-scale Training Stability", ko: "6.3 대규모 학습 안정성" }, path: "/chapter-6/large-scale-training-stability" },
      { id: "6-4", title: { en: "6.4 Infrastructure", ko: "6.4 인프라" }, path: "/chapter-6/infrastructure" },
      { id: "6-5", title: { en: "6.5 Synthetic Data for Pre-training", ko: "6.5 사전 학습을 위한 합성 데이터" }, path: "/chapter-6/synthetic-data-for-pre-training" },
    ]
  },
  {
    id: 7,
    title: { en: "7. Training Optimization & Systems", ko: "7. 학습 최적화 및 시스템" },
    subs: [
      { id: "7-1", title: { en: "7.1 Data Parallelism (DP/DDP)", ko: "7.1 데이터 병렬화 (DP/DDP)" }, path: "/chapter-7/data-parallelism" },
      { id: "7-2", title: { en: "7.2 ZeRO (Zero Redundancy Optimizer)", ko: "7.2 ZeRO (Zero Redundancy Optimizer)" }, path: "/chapter-7/zero-redundancy-optimizer" },
      { id: "7-3", title: { en: "7.3 Model & Pipeline Parallelism", ko: "7.3 모델 및 파이프라인 병렬화" }, path: "/chapter-7/model-and-pipeline-parallelism" },
      { id: "7-4", title: { en: "7.4 Flash Attention 1, 2, 3", ko: "7.4 Flash Attention 1, 2, 3" }, path: "/chapter-7/flash-attention" },
    ]
  },
  {
    id: 8,
    title: { en: "8. Scaling Laws & Compute Optimality", ko: "8. 스케일링 법칙 및 컴퓨팅 최적성" },
    subs: [
      { id: "8-1", title: { en: "8.1 The Power Law", ko: "8.1 거듭제곱 법칙" }, path: "/chapter-8/power-law" },
      { id: "8-2", title: { en: "8.2 Chinchilla Optimality", ko: "8.2 친칠라 최적성" }, path: "/chapter-8/chinchilla-optimality" },
      { id: "8-3", title: { en: "8.3 Over-training vs Optimal-training", ko: "8.3 과도한 학습 vs 최적 학습" }, path: "/chapter-8/over-training-vs-optimal-training" },
      { id: "8-4", title: { en: "8.4 Transfer Learning & Generalization", ko: "8.4 전이 학습 및 일반화" }, path: "/chapter-8/transfer-learning-and-generalization" },
    ]
  },
  {
    id: 9,
    title: { en: "9. Post-training: SFT & Instruction Tuning", ko: "9. 사후 학습: SFT 및 인스트럭션 튜닝" },
    subs: [
      { id: "9-1", title: { en: "9.1 SFT Fundamentals", ko: "9.1 SFT 기본 개념" }, path: "/chapter-9/sft-fundamentals" },
      { id: "9-2", title: { en: "9.2 Dataset Quality vs Quantity", ko: "9.2 데이터셋 품질 vs 양" }, path: "/chapter-9/dataset-quality-vs-quantity" },
      { id: "9-3", title: { en: "9.3 Parameter-Efficient Fine-Tuning (PEFT)", ko: "9.3 매개변수 효율적 미세 조정 (PEFT)" }, path: "/chapter-9/parameter-efficient-fine-tuning-peft" },
      { id: "9-4", title: { en: "9.4 Prompt Engineering as SFT", ko: "9.4 SFT로서의 프롬프트 엔지니어링" }, path: "/chapter-9/prompt-engineering-as-sft" },
      { id: "9-5", title: { en: "9.5 Synthetic Instructions & Self-Instruct", ko: "9.5 합성 인스트럭션 및 Self-Instruct" }, path: "/chapter-9/synthetic-instructions-and-self-instruct" },
    ]
  },
  {
    id: 10,
    title: { en: "10. Alignment: RLHF & Direct Preference", ko: "10. 정렬: RLHF 및 직접 선호도 최적화" },
    subs: [
      { id: "10-1", title: { en: "10.1 Human Feedback Loop", ko: "10.1 인간 피드백 루프" }, path: "/chapter-10/human-feedback-loop" },
      { id: "10-2", title: { en: "10.2 PPO (Proximal Policy Optimization)", ko: "10.2 PPO (근사 정책 최적화)" }, path: "/chapter-10/ppo-proximal-policy-optimization" },
      { id: "10-3", title: { en: "10.3 DPO (Direct Preference Optimization)", ko: "10.3 DPO (Direct Preference Optimization)" }, path: "/chapter-10/dpo" },
      { id: "10-4", title: { en: "10.4 KTO & IPO", ko: "10.4 KTO 및 IPO" }, path: "/chapter-10/kto-and-ipo" },
      { id: "10-5", title: { en: "10.5 Alignment Tax", ko: "10.5 정렬 세금" }, path: "/chapter-10/alignment-tax" },
    ]
  },
  {
    id: 11,
    title: { en: "11. Multimodal Learning", ko: "11. 멀티모달 학습" },
    subs: [
      { id: "11-1", title: { en: "11.1 Vision-Language Bridges", ko: "11.1 비전-언어 브리지" }, path: "/chapter-11/vision-language-bridges" },
      { id: "11-2", title: { en: "11.2 Audio & Speech Integration", ko: "11.2 오디오 및 음성 통합" }, path: "/chapter-11/audio-and-speech-integration" },
      { id: "11-3", title: { en: "11.3 Unified Multimodal (Any-to-Any)", ko: "11.3 통합 멀티모달 (Any-to-Any)" }, path: "/chapter-11/unified-multimodal-any-to-any" },
      { id: "11-4", title: { en: "11.4 Image Diffusion Models", ko: "11.4 이미지 확산 모델" }, path: "/chapter-11/image-diffusion-models" },
      { id: "11-5", title: { en: "11.5 Video Generation Foundations", ko: "11.5 비디오 생성의 기초" }, path: "/chapter-11/video-generation-foundations" },
      { id: "11-6", title: { en: "11.6 Commercial Video Models & Future Directions", ko: "11.6 상업용 비디오 모델 및 향후 방향" }, path: "/chapter-11/commercial-video-models" },
    ]
  },
  {
    id: 12,
    title: { en: "12. LLM Inference Optimization", ko: "12. LLM 추론 최적화" },
    subs: [
      { id: "12-1", title: { en: "12.1 KV Cache Management", ko: "12.1 KV 캐시 관리" }, path: "/chapter-12/kv-cache-management" },
      { id: "12-2", title: { en: "12.2 PagedAttention (vLLM)", ko: "12.2 PagedAttention (vLLM)" }, path: "/chapter-12/paged-attention-vllm" },
      { id: "12-3", title: { en: "12.3 Continuous Batching", ko: "12.3 연속 배칭" }, path: "/chapter-12/continuous-batching" },
      { id: "12-4", title: { en: "12.4 Speculative Decoding", ko: "12.4 투기적 디코딩" }, path: "/chapter-12/speculative-decoding" },
      { id: "12-5", title: { en: "12.5 Long Context Serving", ko: "12.5 롱 컨텍스트 서빙" }, path: "/chapter-12/long-context-serving" },
      { id: "12-6", title: { en: "12.6 Serving Policies, SLOs, and Fallbacks", ko: "12.6 서빙 정책, SLO, 그리고 폴백" }, path: "/chapter-12/serving-policies-slos-and-fallbacks" },
    ]
  },
  {
    id: 13,
    title: { en: "13. Model Compression & Quantization", ko: "13. 모델 압축 및 양자화" },
    subs: [
      { id: "13-1", title: { en: "13.1 PTQ vs QAT", ko: "13.1 PTQ vs QAT" }, path: "/chapter-13/ptq-vs-qat" },
      { id: "13-2", title: { en: "13.2 Quantization Methods", ko: "13.2 양자화 방법" }, path: "/chapter-13/quantization-methods" },
      { id: "13-3", title: { en: "13.3 Weight Sparsification", ko: "13.3 가중치 희소화" }, path: "/chapter-13/weight-sparsification" },
      { id: "13-4", title: { en: "13.4 Knowledge Distillation", ko: "13.4 지식 증류" }, path: "/chapter-13/knowledge-distillation" },
    ]
  },
  {
    id: 14,
    title: { en: "14. RAG (Retrieval Augmented Generation)", ko: "14. RAG (검색 증강 생성)" },
    subs: [
      { id: "14-1", title: { en: "14.1 From Lexical to Semantic Search", ko: "14.1 어휘 검색에서 시맨틱 검색으로" }, path: "/chapter-14/lexical-to-semantic-search" },
      { id: "14-2", title: { en: "14.2 Vector Indexing & DB Solutions", ko: "14.2 벡터 인덱싱 및 DB 솔루션" }, path: "/chapter-14/vector-indexing-and-db-solutions" },
      { id: "14-3", title: { en: "14.3 Advanced Retrieval & Reranking", ko: "14.3 고급 검색 및 리랭킹" }, path: "/chapter-14/advanced-retrieval" },
      { id: "14-4", title: { en: "14.4 RAG Orchestration", ko: "14.4 RAG 오케스트레이션" }, path: "/chapter-14/rag-orchestration" },
      { id: "14-5", title: { en: "14.5 GraphRAG & Ontology", ko: "14.5 GraphRAG 및 온톨로지" }, path: "/chapter-14/graphrag-and-ontology" },
      { id: "14-6", title: { en: "14.6 RAG Failure Modes and Operational Design", ko: "14.6 RAG 실패 모드와 운영 설계" }, path: "/chapter-14/rag-failure-modes-and-operational-design" },
    ]
  },
  {
    id: 15,
    title: { en: "15. Reasoning & Search-time Scaling", ko: "15. 추론 및 탐색 시간 스케일링" },
    subs: [
      { id: "15-1", title: { en: "15.1 Chain of Thought (CoT)", ko: "15.1 사고의 사슬 (CoT)" }, path: "/chapter-15/chain-of-thought" },
      { id: "15-2", title: { en: "15.2 Tree/Graph of Thoughts", ko: "15.2 생각의 트리/그래프" }, path: "/chapter-15/tree-graph-of-thoughts" },
      { id: "15-3", title: { en: "15.3 Search-time Compute", ko: "15.3 탐색 시간 컴퓨팅" }, path: "/chapter-15/search-time-compute" },
      { id: "15-4", title: { en: "15.4 Verifiers & Reward Models", ko: "15.4 검증기 및 보상 모델" }, path: "/chapter-15/verifiers-and-reward-models" },
    ]
  },
  {
    id: 16,
    title: { en: "16. Agentic AI & Tools", ko: "16. 에이전트 AI 및 도구" },
    subs: [
      { id: "16-1", title: { en: "16.1 Function Calling & Tool Use", ko: "16.1 함수 호출 및 도구 사용" }, path: "/chapter-16/function-calling-and-tool-use" },
      { id: "16-2", title: { en: "16.2 Autonomous Agents", ko: "16.2 자율 에이전트" }, path: "/chapter-16/autonomous-agents" },
      { id: "16-3", title: { en: "16.3 Multi-agent Collaboration", ko: "16.3 멀티 에이전트 협업" }, path: "/chapter-16/multi-agent-collaboration" },
      { id: "16-4", title: { en: "16.4 Long-term Memory for Agents", ko: "16.4 에이전트를 위한 장기 기억" }, path: "/chapter-16/long-term-memory-for-agents" },
      { id: "16-5", title: { en: "16.5 Agent Reliability, Recovery, and Guardrails", ko: "16.5 에이전트 신뢰성, 복구, 그리고 가드레일" }, path: "/chapter-16/agent-reliability-recovery-and-guardrails" },
    ]
  },
  {
    id: 17,
    title: { en: "17. AI Evaluation & Benchmarking", ko: "17. AI 평가 및 벤치마킹" },
    subs: [
      { id: "17-1", title: { en: "17.1 Academic Benchmarks", ko: "17.1 학술적 벤치마크" }, path: "/chapter-17/academic-benchmarks" },
      { id: "17-2", title: { en: "17.2 LLM-as-a-Judge", ko: "17.2 LLM-as-a-Judge" }, path: "/chapter-17/llm-as-a-judge" },
      { id: "17-3", title: { en: "17.3 Elo Rating & Leaderboards", ko: "17.3 Elo 레이팅 및 리더보드" }, path: "/chapter-17/elo-rating-and-leaderboards" },
      { id: "17-4", title: { en: "17.4 Contamination Issues", ko: "17.4 오염 문제" }, path: "/chapter-17/contamination-issues" },
      { id: "17-5", title: { en: "17.5 Production Evaluation and Release Gates", ko: "17.5 프로덕션 평가와 릴리스 게이트" }, path: "/chapter-17/production-evaluation-and-release-gates" },
    ]
  },
  {
    id: 18,
    title: { en: "18. AI Safety & Alignment Research", ko: "18. AI 안전 및 정렬 연구" },
    subs: [
      { id: "18-1", title: { en: "18.1 Red Teaming", ko: "18.1 레드 티밍" }, path: "/chapter-18/red-teaming" },
      { id: "18-2", title: { en: "18.2 Jailbreaking & Defense", ko: "18.2 탈옥 및 방어" }, path: "/chapter-18/jailbreaking-and-defense" },
      { id: "18-3", title: { en: "18.3 Hallucination Detection", ko: "18.3 환각 탐지" }, path: "/chapter-18/hallucination-detection" },
      { id: "18-4", title: { en: "18.4 Scalable Oversight", ko: "18.4 확장 가능한 감독" }, path: "/chapter-18/scalable-oversight" },
    ]
  },
  {
    id: 19,
    title: { en: "19. Interpretability & Science of LLMs", ko: "19. 해석 가능성 및 LLM의 과학" },
    subs: [
      { id: "19-1", title: { en: "19.1 Mechanistic Interpretability", ko: "19.1 기계론적 해석 가능성" }, path: "/chapter-19/mechanistic-interpretability" },
      { id: "19-2", title: { en: "19.2 Logit Lens & Attention Visualization", ko: "19.2 로짓 렌즈 및 어텐션 시각화" }, path: "/chapter-19/logit-lens-and-attention-visualization" },
      { id: "19-3", title: { en: "19.3 Probing Classifiers", ko: "19.3 프로빙 분류기" }, path: "/chapter-19/probing-classifiers" },
      { id: "19-4", title: { en: "19.4 Sparse Autoencoders (SAE)", ko: "19.4 희소 오토인코더 (SAE)" }, path: "/chapter-19/sparse-autoencoders-sae" },
    ]
  },
  {
    id: 20,
    title: { en: "20. Next Generation: SSM & Beyond", ko: "20. 차세대: SSM 및 그 이후" },
    subs: [
      { id: "20-1", title: { en: "20.1 State Space Models (SSM)", ko: "20.1 상태 공간 모델 (SSM)" }, path: "/chapter-20/state-space-models-ssm" },
      { id: "20-2", title: { en: "20.2 Mamba & S6", ko: "20.2 Mamba 및 S6" }, path: "/chapter-20/mamba-and-s6" },
      { id: "20-3", title: { en: "20.3 Linear Attention", ko: "20.3 선형 어텐션" }, path: "/chapter-20/linear-attention" },
      { id: "20-4", title: { en: "20.4 Neural Networks as Programs", ko: "20.4 프로그램으로서의 신경망" }, path: "/chapter-20/neural-networks-as-programs" },
      { id: "20-5", title: { en: "20.5 Multi-Token Prediction", ko: "20.5 멀티 토큰 예측" }, path: "/chapter-20/multi-token-prediction" },
      { id: "20-6", title: { en: "20.6 Diffusion-based LLMs", ko: "20.6 확산 기반 LLM" }, path: "/chapter-20/diffusion-based-llms" },
      { id: "20-7", title: { en: "20.7 Path to AGI & World Models", ko: "20.7 AGI를 향한 길과 월드 모델" }, path: "/chapter-20/path-to-agi-and-world-models" },
    ]
  }
];
