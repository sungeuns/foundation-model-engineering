# Foundation Model Engineering

### **Chapter 1: The Evolution of Intelligence**

* **1.1 Symbolism vs. Connectionism:** 규칙 기반 AI와 통계적 학습의 역사적 대립.
* **1.2 The Power of Representation:** 왜 Feature Engineering에서 Deep Learning으로 전환되었는가.
* **1.3 Deep Learning Paradigms:** Supervised, Unsupervised, Reinforcement Learning의 경계와 융합.
* **1.4 The Bitter Lesson:** 리처드 서튼의 '쓴 교훈'—연산량의 압도적 중요성 분석.
* **Summary:** AI가 '사람이 가르친 규칙'에서 '데이터에서 스스로 찾는 패턴'으로 진화해 온 과정을 공학적 관점에서 정리합니다.

### **Chapter 2: The Sequence Modeling Era**

* **2.1 Markov Chains to RNNs:** 시계열 데이터 처리를 위한 초기 접근법.
* **2.2 Vanishing & Exploding Gradients:** RNN의 고질적 문제와 LSTM/GRU의 해결책.
* **2.3 The Dawn of Attention:** RNN의 Bottleneck을 해결하기 위한 Bahdanau Attention의 등장.
* **2.4 CNNs for NLP:** TextCNN 등 합성곱 신경망을 이용한 자연어 처리 시도들.
* **Summary:** Transformer 이전의 시퀀스 모델들이 가졌던 한계와 'Attention'이라는 개념이 왜 필연적이었는지 다룹니다.

### **Chapter 3: The Transformer Deep Dive**

* **3.1 Self-Attention Mathematics:** $Q, K, V$ 행렬 연산과 Scaled Dot-Product의 수식적 이해.
* **3.2 Multi-head Attention (MHA):** 다양한 관점에서 특징을 추출하는 병렬 어텐션 구조.
* **3.3 Position Encoding Strategy:** Sinusoidal부터 최신 RoPE(Rotary), ALiBi까지의 비교 분석.
* **3.4 Layer Normalization & Residuals:** Pre-LN vs Post-LN의 학습 안정성 차이.
* **3.5 Complexity Analysis:** 시퀀스 길이에 따른 $O(n^2)$ 복잡도와 메모리 병목 현상.
* **Summary:** 현재 모든 Foundation Model의 뼈대인 Transformer의 내부 로직을 수학적, 구조적으로 파헤칩니다.

### **Chapter 4: LLM Architectures & Paradigms**

* **4.1 Encoder-only (BERT-style):** Masked Language Modeling과 분류 작업 최적화.
* **4.2 Decoder-only (GPT-style):** Causal Language Modeling과 차세대 생성 모델의 주류화.
* **4.3 Encoder-Decoder (T5/BART):** Seq2Seq 작업의 강자와 Unified Framework.
* **4.4 Hybrid & Prefix LM:** 다양한 입출력 구조에 따른 학습 효율성 비교.
* **4.5 다양한 LLM 아키텍처와 최신 트렌드:** Hybrid/linear/sparse attention, MLA, MoE, MTP를 중심으로 GLM-5.2, Kimi K3, Qwen3.7/3.8의 공개 아키텍처와 공개 범위를 비교.
* **Summary:** 목적에 따라 달라지는 모델 아키텍처의 유형과 생성형 AI에서 Decoder-only가 승리한 이유를 분석합니다.

### **Chapter 5: Scaling Mixture of Experts (MoE)**

* **5.1 Sparse vs Dense Models:** 파라미터 수와 연산량의 비동기화 전략.
* **5.2 Routing Algorithms:** Top-k routing, Noisy Top-k, Expert choice routing.
* **5.3 Expert Parallelism:** 대규모 MoE 모델을 여러 GPU에 분산하는 기술.
* **5.4 Collapsing & Load Balancing:** 특정 전문가에게 연산이 쏠리는 문제와 해결책(Auxiliary Loss).
* **5.5 Case Study:** Mixtral, DBRX, DeepSeek-V3에서 GLM-5.2까지 MoE 라우팅, sparse attention, MTP, post-training/serving pipeline을 뜯어보기.
* **Summary:** 거대 모델을 효율적으로 운영하기 위한 핵심 기술인 MoE의 라우팅 매커니즘과 분산 처리 기법을 정리합니다.

### **Chapter 6: Foundation Model Pre-training (The Engineering)**

* **6.1 Data Engineering at Scale:** Common Crawl 정제, Deduplication, 중복 제거 알고리즘.
* **6.2 Tokenization Science:** Byte-level BPE, WordPiece, 그리고 토큰 최적화가 성능에 미치는 영향.
* **6.3 Large-scale Training Stability:** Loss Spike 대응, Gradient Clipping, z-loss 등 학습 기법.
* **6.4 Infrastructure:** TPU(Pod) vs GPU(H100/B200) 클러스터 구성, NVLink/InfiniBand 및 네트워킹(NCCL).
* **6.5 Synthetic Data for Pre-training:** 데이터 고갈 문제와 AI 생성 데이터의 활용 가능성.
* **Summary:** 수조 개의 토큰을 안정적으로 학습시키기 위한 데이터 전처리와 인프라 엔지니어링의 정수를 담습니다.

### **Chapter 7: Training Optimization & Systems**

* **7.1 Data Parallelism (DP/DDP):** 가장 기본적인 병렬화와 통신 오버헤드.
* **7.2 ZeRO (Zero Redundancy Optimizer):** 메모리 최적화의 혁명 (Stage 1, 2, 3).
* **7.3 Model & Pipeline Parallelism:** 거대 모델을 쪼개어 학습하는 텐서 병렬화와 파이프라인 스케줄링.
* **7.4 Flash Attention 1, 2, 3:** IO-Awareness를 통한 메모리 대역폭 한계 돌파.
* **Summary:** 한 대의 GPU에 담을 수 없는 모델을 학습시키기 위한 최신 분산 학습 소프트웨어 기술을 다룹니다.

### **Chapter 8: Scaling Laws & Compute Optimality**

* **8.1 The Power Law:** 모델 크기와 데이터 양에 따른 성능 예측.
* **8.2 Chinchilla Optimality:** 주어진 연산 자원 내에서 가장 효율적인 파라미터-데이터 비율.
* **8.3 Over-training vs Optimal-training:** Llama 3처럼 가이드라인 이상으로 학습시키는 이유.
* **8.4 Transfer Learning & Generalization:** 사전 학습 지식이 전이되는 원리.
* **8.5 Continued Pre-training & Domain Adaptation:** 기존 체크포인트를 도메인에 적응시키는 데이터 혼합, 파일럿, 복구, 망각 방지 실무.
* **Summary:** 무작정 키우는 것이 아닌, 수학적 근거를 바탕으로 자원을 배분하는 '스케일링의 과학'을 설명합니다.

### **Chapter 9: Post-training: SFT & Instruction Tuning**

* **9.1 Instruction Following:** 모델이 사용자의 의도를 이해하게 만드는 과정.
* **9.2 Dataset Quality vs Quantity:** 'LIMA' 논문이 시사하는 고품질 데이터의 힘.
* **9.3 Parameter-Efficient Fine-Tuning (PEFT):** LoRA, DoRA, Prefix Tuning, Adapters.
* **9.4 Prompt Engineering as SFT:** Few-shot, Chain-of-Thought 데이터 구축.
* **9.5 Synthetic Instructions & Self-Instruct:** 모델을 이용한 고품질 인스트럭션 데이터 생성.
* **Summary:** 사전 학습된 모델에 '말귀'를 알아먹게 하는 기술과 효율적인 미세 조정 기법을 정리합니다.

### **Chapter 10: Alignment: RLHF & Direct Preference**

* **10.1 Human Feedback Loop:** 비교 데이터 수집과 리워드 모델(Reward Model) 학습.
* **10.2 PPO (Proximal Policy Optimization):** 전통적인 RLHF의 핵심 알고리즘과 불안정성.
* **10.3 DPO (Direct Preference Optimization):** 리워드 모델 없이 직접 최적화하는 혁신적 방법.
* **10.4 KTO & IPO:** 다양한 Preference Optimization 알고리즘의 등장과 비교.
* **10.5 Alignment Tax:** 정렬 학습이 모델의 창의성이나 일반 성능에 미치는 부작용.
* **Summary:** AI가 인간의 가치관과 안전 가이드라인에 맞게 행동하도록 길들이는 정렬(Alignment) 기술을 다룹니다.

### **Chapter 11: Multimodal Learning**

* **11.1 Vision-Language Bridges:** CLIP, Flamingo 아키텍처와 Projection Layer.
* **11.2 Audio & Speech Integration:** Whisper, AudioLM 등 소리를 이해하고 생성하는 법.
* **11.3 Unified Multimodal (Any-to-Any):** Gemini, GPT-4o 처럼 네이티브하게 멀티모달을 지원하는 구조.
* **11.4 Image Diffusion Models:** 확산(Diffusion) 모델의 원리와 Stable Diffusion, Flux 등 대표적인 이미지 생성 모델 소개.
* **11.5 Video Generation Foundations:** Diffusion Transformer (DiT)와 공간-시간 어텐션.
* **11.6 Commercial Video Models & Future Directions:** Google Veo 3.1, OpenAI Sora, ByteDance Seedance 2.0 등 최신 상업 모델의 특징과 물리 법칙 및 공간적 일관성을 이해하는 멀티모달 종합(Synthesis) 및 향후 방향 정리.
* **Summary:** 텍스트를 넘어 시각, 청각 등 다양한 감각을 통합하는 멀티모달 인공지능의 원리를 분석하고, 최신 상업 모델의 현황과 앞으로의 발전 방향을 정리합니다.

### **Chapter 12: LLM Inference Optimization (Deep Tech)**

* **12.1 KV Cache Management:** 생성 속도를 높이기 위한 핵심 캐싱 전략.
* **12.2 PagedAttention (vLLM):** OS의 가상 메모리 개념을 도입한 메모리 단편화 해결.
* **12.3 Continuous Batching:** 요청별로 처리 속도가 다른 문제를 해결하는 동적 배칭.
* **12.4 Speculative Decoding:** 작은 모델로 초안을 잡고 큰 모델로 검수하여 속도를 올리는 기법.
* **12.5 Long Context Serving:** StreamingLLM, YaRN 등 컨텍스트 윈도우 확장을 위한 시스템 최적화.
* **12.6 Serving Policies, SLOs, and Fallbacks:** 실제 서비스에서 admission control, latency budget, fairness, 그리고 장애 시 폴백 전략을 어떻게 설계하는지 정리.
* **Summary:** 실제 서비스 환경에서 수만 명의 요청을 처리하기 위한 최첨단 추론 가속화 기술을 다룹니다.

### **Chapter 13: Model Compression & Quantization**

* **13.1 PTQ vs QAT:** 훈련 후 양자화(PTQ)와 양자화 인지 학습(QAT)의 차이.
* **13.2 Quantization Methods:** GPTQ, AWQ, GGUF, 그리고 비트별(FP8/INT4) 성능 변화.
* **13.3 Weight Sparsification:** 불필요한 가중치를 제거하는 Pruning 기술.
* **13.4 Knowledge Distillation:** 거대 모델(Teacher)의 지식을 작은 모델(Student)로 전수하기.
* **13.5 Advanced Quantization:** Sub-4-bit quantization, ternary weights, and the hardware assumptions required for real speedups.
* **Summary:** 모델의 크기를 줄여 온디바이스 AI나 저사양 GPU에서도 동작하게 만드는 경량화 기술입니다.

### **Chapter 14: RAG (Retrieval Augmented Generation)**

* **14.1 From Lexical to Semantic Search:** 왜 벡터 임베딩이 필요한가, 키워드 검색의 한계와 시맨틱 검색, 청킹(Chunking) 기법들.
* **14.2 Vector Indexing & DB Solutions:** HNSW, ScaNN 등 벡터 인덱싱 알고리즘 비교 및 상용 벡터 DB 솔루션.
* **14.3 Advanced Retrieval & Reranking:** 하이브리드 검색, Bi-encoder와 Cross-encoder를 이용한 리랭킹(BERT와의 연결), 쿼리 변환(HyDE 등).
* **14.4 RAG Orchestration:** Self-RAG, Corrective RAG (CRAG) 등 복합 워크플로우.
* **14.5 GraphRAG & Ontology:** 지식 그래프를 결합하여 복잡한 관계 정보 추출하기 및 실용적 활용법.
* **14.6 RAG Failure Modes and Operational Design:** 검색 실패, 오래된 문서, 라우팅 불확실성, 리랭커 타임아웃 같은 운영 이슈와 방어 설계.
* **Summary:** 외부 지식을 실시간으로 참조하여 모델의 할루시네이션(환각)을 줄이는 검색 증강 생성 기술을 다룹니다.

### **Chapter 15: Reasoning & Search-time Scaling**

* **15.1 Chain of Thought (CoT):** 단계적 추론이 성능에 미치는 영향.
* **15.2 Tree/Graph of Thoughts:** 탐색 알고리즘(DFS/BFS)을 결합한 복합 추론.
* **15.3 Search-time Compute:** 추론(Test-time) 시 연산량을 늘려 성능을 높이는 'Inference-time Scaling Laws'와 OpenAI o1의 메커니즘.
* **15.4 Verifiers & Reward Models:** 추론 과정의 정답 유무를 판단하는 프로세스 보상 모델(PRM).
* **Summary:** 단순한 다음 단어 예측을 넘어, 논리적인 '생각'과 '검색'을 통해 정답에 도달하는 추론 최적화 기술입니다.

### **Chapter 16: Agentic AI & Tools**

* **16.1 Function Calling & Tool Use:** 모델이 외부 API, 계산기, 코드를 실행하는 법.
* **16.2 Autonomous Agents:** 목표 설정, 계획 수립, 실행, 피드백 루프 자동화.
* **16.3 Self-Improving Agents:** 에이전트가 반복 실패를 평가해 도구, 메모리, 프롬프트, 검증 절차를 개선하는 방법.
* **16.4 Multi-agent Collaboration:** 서로 다른 역할을 가진 모델들의 협업 시스템.
* **16.5 Long-term Memory for Agents:** 유저와의 대화 이력을 기억하고 활용하는 아키텍처.
* **16.6 Agent Reliability, Recovery, and Guardrails:** 에이전트 루프의 실패 복구, 체크포인팅, human-in-the-loop, destructive action guardrail 설계.
* **Summary:** AI가 단순 챗봇을 넘어 스스로 도구를 사용하고 과업을 수행하는 '에이전트'로 진화하는 과정을 다룹니다.

### **Chapter 17: AI Evaluation & Benchmarking**

* **17.1 Academic Benchmarks:** MMLU, GSM8K, HumanEval 등의 구성과 한계.
* **17.2 LLM-as-a-Judge:** 강력한 모델을 이용해 다른 모델의 정성적 답변 평가하기.
* **17.3 Elo Rating & Leaderboards:** LMSYS Chatbot Arena와 같은 인간 선호도 기반 평가.
* **17.4 Contamination Issues:** 학습 데이터에 평가셋이 포함되는 문제와 검증법.
* **17.5 Production Evaluation and Release Gates:** offline eval, judge calibration, canary, rollout gate를 실제 릴리스 프로세스와 연결하는 방법.
* **17.6 Commercial Model Benchmarks:** Gemini 3.5/3.6 Flash, Qwen3.7/3.8, Claude Fable/Opus 5, GPT-5.6 Sol/Terra/Luna 등 최신 모델을 성능·가격·속도·context·공개 상태로 비교하는 interactive map.
* **Summary:** 모델의 '진짜 실력'을 객관적이고 공정하게 측정하기 위한 평가 방법론과 지표를 다룹니다.

### **Chapter 18: AI Safety & Alignment Research**

* **18.1 Red Teaming:** 모델의 취약점을 찾아내기 위한 공격적 테스트.
* **18.2 Jailbreaking & Defense:** 시스템 프롬프트 우회 공격과 이를 방어하기 위한 가드레일.
* **18.3 Hallucination Detection:** 환각 현상을 측정하고 완화하는 최신 연구.
* **18.4 Scalable Oversight:** 인간이 이해하기 힘든 복잡한 지능을 가진 AI를 감독하는 법.
* **Summary:** AI가 인간에게 해를 끼치지 않도록 안전성을 확보하고 윤리적 가이드라인을 준수하게 만드는 연구 분야입니다.

### **Chapter 19: Interpretability & Science of LLMs**

* **19.1 Mechanistic Interpretability:** 개별 뉴런과 어텐션 헤드가 어떤 역할을 하는지 분석.
* **19.2 Logit Lens & Attention Visualization:** 내부 상태가 어떻게 최종 토큰을 결정하는지 시각화.
* **19.3 Probing Classifiers:** 모델 내부에 특정 지식이 저장되어 있는지 테스트하는 법.
* **19.4 Sparse Autoencoders (SAE):** 겹쳐진 특징(Superposition)을 분리하여 해석하는 최신 기술.
* **Summary:** '블랙박스'로 불리는 신경망 내부에서 어떤 논리적 과정이 일어나는지 과학적으로 규명하는 시도들입니다.

### **Chapter 20: Next Generation: SSM & Beyond**

* **20.1 State Space Models (SSM):** 시퀀스 길이에 선형적으로 대응하는 $O(n)$ 모델링.
* **20.2 Mamba & S6:** Transformer의 대항마로 꼽히는 최신 SSM 구조 분석.
* **20.3 Linear Attention:** Softmax를 제거하여 연산량을 줄인 어텐션 변형 모델들.
* **20.4 Neural Networks as Programs:** AI가 논리적 프로그램을 직접 생성하고 실행하는 미래.
* **20.5 Multi-Token Prediction:** 시퀀스 생성 속도와 표현력을 높이기 위한 병렬 예측 기법.
* **20.6 Diffusion-based LLMs:** Autoregressive 방식의 한계를 넘어설 수 있는 대안으로 연구되는 Diffusion 기반 텍스트 생성 패러다임과 그 가능성, 한계를 정리.
* **20.7 Path to AGI & World Models:** AGI로 가기 위해 필요한 근본적 발전. 얀 르쿤(Yann LeCun)의 JEPA 아키텍처와 Google Genie 3 등 물리적 세계의 법칙을 시뮬레이션하는 World Model 및 체화된 에이전트(Embodied Agent) 비전.
* **Summary:** Transformer의 한계를 넘어서려는 시도들과 포스트-트랜스포머 시대의 핵심 기술, 그리고 AGI(인공일반지능) 달성을 위한 World Model 및 차세대 모델링 접근법들을 살펴봅니다.
