// Keep search snippets separate from chapter prose so editorial work can proceed
// independently. A chapter's own frontmatter description always takes priority.
export const searchDescriptions = {
  '/chapter-15/chain-of-thought': {
    en: 'Understand chain-of-thought prompting, compare zero-shot and example-based reasoning prompts, and examine when added reasoning helps or hurts.',
    ko: '사고의 사슬 프롬프팅을 이해하고 제로샷·예시 기반 추론 프롬프트를 비교하며, 추론 과정이 도움이 되거나 해가 되는 조건을 살펴봅니다.',
  },
  '/chapter-15/tree-graph-of-thoughts': {
    en: 'Compare Tree of Thoughts and Graph of Thoughts through branching, evaluation, state reuse, and the cost of orchestrating reasoning searches.',
    ko: '분기, 평가, 상태 재사용을 통해 생각의 트리와 그래프를 비교하고, 추론 탐색을 조율할 때 발생하는 비용을 살펴봅니다.',
  },
  '/chapter-15/search-time-compute': {
    en: 'Allocate inference-time compute across sampling, search, and verification, accounting for tokens, latency, routing, and evaluation gates.',
    ko: '샘플링·탐색·검증에 추론 시점의 연산을 배분하고, 토큰 수뿐 아니라 지연 시간과 라우팅·평가 기준까지 함께 고려합니다.',
  },
  '/chapter-15/verifiers-and-reward-models': {
    en: 'Compare discriminative reward models, generative verifiers, and self-correction loops, including their role in synthetic-data verification.',
    ko: '판별형 보상 모델, 생성형 검증기와 자기 수정 루프를 비교하고, 합성 데이터 검증 과정에서 각 방법이 맡는 역할을 살펴봅니다.',
  },
  '/chapter-16/function-calling-and-tool-use': {
    en: 'Understand LLM function calling through the tool-use loop, training examples, schema design, routing, and security boundaries around execution.',
    ko: '도구 사용 루프, 학습 예제, 스키마 설계와 라우팅을 통해 LLM 함수 호출을 이해하고 도구 실행의 보안 경계를 살펴봅니다.',
  },
  '/chapter-16/autonomous-agents': {
    en: 'Build a mental model of autonomous agents through bounded execution loops, planning, reflection, reliability limits, and tree-search visualization.',
    ko: '실행 범위를 제한한 루프, 계획과 성찰, 신뢰성의 한계를 통해 자율 에이전트를 이해하고 트리 탐색 시각화를 살펴봅니다.',
  },
  '/chapter-16/self-improving-agents': {
    en: 'Explore agent self-improvement as an outer loop of proposals, experiments, evaluation, and retained changes, with research examples and engineering limits.',
    ko: '제안·실험·평가·변경 채택으로 이어지는 외부 루프로 에이전트의 자기 개선을 이해하고, 연구 사례와 엔지니어링 한계를 살펴봅니다.',
  },
  '/chapter-16/multi-agent-collaboration': {
    en: 'Compare multi-agent communication topologies, shared blackboard state, and latent-space communication, with an interactive topology explorer.',
    ko: '멀티 에이전트의 통신 구조, 공유 블랙보드 상태와 잠재 공간 통신을 비교하고, 인터랙티브 탐색기로 협업 구조의 차이를 살펴봅니다.',
  },
  '/chapter-16/long-term-memory-for-agents': {
    en: 'Design agent memory beyond a vector store: write, manage, and read policies, memory substrates, provenance, stale information, and privacy.',
    ko: '벡터 저장소를 넘어 쓰기·관리·읽기 정책, 저장 방식, 출처와 오래된 정보·개인정보 처리를 포함한 에이전트 장기 기억을 설계합니다.',
  },
  '/chapter-16/agent-reliability-recovery-and-guardrails': {
    en: 'Improve agent reliability with bounded loops, checkpoints before risky actions, tool-execution policies, human approval, and recovery procedures.',
    ko: '루프 제한, 위험한 작업 전 체크포인트, 도구 실행 정책과 사람의 승인 및 복구 절차를 통해 에이전트의 신뢰성을 높입니다.',
  },
  '/chapter-17/academic-benchmarks': {
    en: 'Evaluate language and multimodal models with benchmark methodology, compatible metrics, statistical comparisons, and contamination checks.',
    ko: '벤치마크 방법론, 호환 가능한 지표, 통계적 비교와 오염 점검을 통해 언어·멀티모달 모델의 평가 결과를 해석합니다.',
  },
  '/chapter-17/llm-as-a-judge': {
    en: 'Design LLM-as-a-judge evaluations using pairwise comparisons, calibrated rubrics, consistency checks, bias analysis, and evaluator validation.',
    ko: '쌍대 비교, 보정된 평가 기준, 일관성 점검과 편향 분석을 통해 LLM 판정 평가를 설계하고 평가자 자체를 검증합니다.',
  },
  '/chapter-17/elo-rating-and-leaderboards': {
    en: 'Understand Elo ratings for model comparisons, including crowdsourced pairwise results, rating updates, uncertainty, and leaderboard interpretation.',
    ko: '크라우드소싱 쌍대 비교와 레이팅 갱신을 통해 모델 비교에 쓰이는 Elo를 이해하고, 불확실성과 리더보드 해석의 한계를 살펴봅니다.',
  },
  '/chapter-17/contamination-issues': {
    en: 'Detect and prevent benchmark contamination with data lineage, multi-representation matching, decontamination pipelines, and private evaluation sets.',
    ko: '데이터 계보, 여러 표현 수준의 중복 탐지, 오염 제거 파이프라인과 비공개 평가셋으로 벤치마크 오염을 탐지하고 방지합니다.',
  },
  '/chapter-17/commercial-model-benchmarks': {
    en: 'Interpret commercial model benchmarks across quality, cost, latency, and public evaluation methodologies without reducing model choice to one leaderboard.',
    ko: '상용 모델 벤치마크의 품질·비용·지연 시간과 공개 평가 방법론을 비교하고, 하나의 순위표에 의존하지 않는 모델 선택 기준을 살펴봅니다.',
  },
  '/chapter-18/red-teaming': {
    en: 'Explore LLM red teaming through threat taxonomies, automated testing, multi-turn attacks, and the gap between refusal behavior and robust safety.',
    ko: '위협 분류, 자동화된 테스트와 다중 턴 공격을 통해 LLM 레드 티밍을 이해하고, 거절 행동과 견고한 안전성 사이의 차이를 살펴봅니다.',
  },
  '/chapter-18/jailbreaking-and-defense': {
    en: 'Distinguish jailbreaks from prompt injection, define an LLM threat model, and evaluate defense in depth rather than relying on role labels alone.',
    ko: '탈옥과 프롬프트 인젝션을 구분하고 LLM 위협 모델을 정의하며, 역할 레이블에만 의존하지 않는 심층 방어를 평가합니다.',
  },
  '/chapter-18/hallucination-detection': {
    en: 'Classify LLM hallucinations, examine detection signals and their limits, and design mitigation around evidence, verification, and production checks.',
    ko: 'LLM 환각의 유형과 탐지 신호의 한계를 살펴보고, 근거·검증·운영 점검을 중심으로 환각 완화 체계를 설계합니다.',
  },
  '/chapter-18/scalable-oversight': {
    en: 'Explore scalable oversight through assistance, decomposition, and multi-agent critique, focusing on the limits of human evaluation capacity.',
    ko: '사람의 평가 역량이 갖는 한계를 출발점으로, 평가 보조·작업 분해·멀티 에이전트 비평을 활용한 확장 가능한 감독을 살펴봅니다.',
  },
  '/chapter-19/mechanistic-interpretability': {
    en: 'Explore mechanistic interpretability through linear representations, circuits, induction heads, and PyTorch hooks for inspecting model activations.',
    ko: '선형 표현, 회로, 유도 헤드와 모델 활성값을 관찰하는 PyTorch 훅을 통해 기계론적 해석 가능성의 방법을 살펴봅니다.',
  },
  '/chapter-19/logit-lens-and-attention-visualization': {
    en: 'Inspect residual-stream predictions with the logit lens, compare the tuned lens, and understand the limits of interpreting attention visualizations.',
    ko: '로짓 렌즈로 잔차 스트림의 예측을 관찰하고 튜닝된 렌즈와 비교하며, 어텐션 시각화를 해석할 때의 한계를 이해합니다.',
  },
  '/chapter-19/probing-classifiers': {
    en: 'Design auditable probing experiments with linear classifiers, controls, selectivity, held-out splits, and a clear distinction between decoding and causation.',
    ko: '선형 분류기, 대조 실험, 선택성과 독립 평가 분할을 갖춘 프로빙 실험을 설계하고, 정보 해독 가능성과 인과적 역할을 구분합니다.',
  },
  '/chapter-19/sparse-autoencoders-sae': {
    en: 'Understand sparse autoencoders through superposition, polysemantic neurons, dictionary learning, dead latents, and Top-K feature activation.',
    ko: '중첩, 다의적 뉴런, 딕셔너리 학습, 비활성 잠재 특성과 Top-K 활성화를 통해 희소 오토인코더가 모델 표현을 분해하는 원리를 이해합니다.',
  },
  '/chapter-20/state-space-models-ssm': {
    en: 'Understand state space models through continuous-to-discrete dynamics, selective state spaces, Mamba, and structured state space duality.',
    ko: '연속 동역학의 이산화, 선택적 상태 공간, Mamba와 구조화된 상태 공간 쌍대성을 통해 상태 공간 모델의 원리를 이해합니다.',
  },
  '/chapter-20/mamba-and-s6': {
    en: 'Trace Mamba from selective state spaces (S6) to state space duality, with mathematical mechanisms, PyTorch examples, and inference-oriented design choices.',
    ko: '선택적 상태 공간(S6)에서 상태 공간 쌍대성으로 이어지는 Mamba의 발전을 수학적 원리, PyTorch 예제와 추론 중심 설계로 살펴봅니다.',
  },
  '/chapter-20/linear-attention': {
    en: 'Understand linear attention, its memory advantages and representation limits, with an educational PyTorch example and a complexity visualizer.',
    ko: '선형 어텐션의 원리, 메모리 이점과 표현의 한계를 이해하고 교육용 PyTorch 예제 및 복잡도 시각화로 동작을 살펴봅니다.',
  },
  '/chapter-20/neural-networks-as-programs': {
    en: 'Explore neural networks as programs through dynamic execution, execution-guided program synthesis, and neural interpreter examples.',
    ko: '동적 실행, 실행 결과를 활용한 프로그램 합성과 신경망 인터프리터 예제를 통해 신경망을 프로그램으로 바라보는 관점을 살펴봅니다.',
  },
  '/chapter-20/multi-token-prediction': {
    en: 'Understand multi-token prediction through auxiliary prediction heads, training objectives, speculative decoding, and compute-quality trade-offs.',
    ko: '보조 예측 헤드, 학습 목적함수와 추측 디코딩을 통해 멀티 토큰 예측을 이해하고 연산량과 품질 사이의 트레이드오프를 살펴봅니다.',
  },
  '/chapter-20/diffusion-based-llms': {
    en: 'Explore diffusion language models through iterative denoising, discrete text representations, and the challenges of scaling beyond autoregressive generation.',
    ko: '반복적인 잡음 제거와 이산 텍스트 표현을 통해 확산 언어 모델을 이해하고, 자기회귀 생성과 다른 방식으로 확장할 때의 어려움을 살펴봅니다.',
  },
  '/chapter-20/path-to-agi-and-world-models': {
    en: 'Examine world models through action-conditioned prediction, JEPA, evaluation boundaries, and engineering questions beyond next-token prediction.',
    ko: '행동 조건부 예측, JEPA와 평가의 한계를 통해 월드 모델을 살펴보고, 다음 토큰 예측을 넘어서는 엔지니어링 과제를 정리합니다.',
  },
  '/chapter-9/dataset-quality-vs-quantity': {
    en: 'Define instruction-data quality using provenance, deduplication, split isolation, judge calibration, mixture design, and measurable acceptance tests.',
    ko: '출처 추적, 중복 제거, 데이터 분할 격리, 판정 모델 보정과 혼합 설계를 통해 지시 데이터의 품질을 측정 가능한 기준으로 정의합니다.',
  },
  '/chapter-9/prompt-engineering-as-sft': {
    en: 'Connect in-context learning and supervised fine-tuning, then explore chain-of-thought prompting, DSPy, and automatic prompt compilation.',
    ko: '문맥 내 학습과 지도 미세조정의 관계를 살펴보고, 사고의 사슬 프롬프팅, DSPy와 자동 프롬프트 컴파일 과정을 이해합니다.',
  },
  '/chapter-9/synthetic-instructions-and-self-instruct': {
    en: 'Build synthetic instruction datasets with generation templates, verification, human audits, lineage tracking, and safeguards against recursive degradation.',
    ko: '생성 템플릿, 검증, 사람의 표본 감사와 계보 추적을 통해 합성 지시 데이터셋을 구성하고 반복 생성에 따른 품질 저하를 관리합니다.',
  },
  '/chapter-10/human-feedback-loop': {
    en: 'Design human-feedback loops with annotation contracts, offline and online signals, active learning, leakage prevention, and model release gates.',
    ko: '주석 기준, 오프라인·온라인 신호, 능동 학습과 데이터 누출 방지를 바탕으로 사람 피드백 수집부터 모델 배포까지의 절차를 설계합니다.',
  },
  '/chapter-10/ppo-proximal-policy-optimization': {
    en: 'Understand PPO for RLHF through policy, reference, reward, and value models, with rollout rewards, GAE, clipping, and training-stability checks.',
    ko: '정책·기준·보상·가치 모델을 통해 RLHF의 PPO를 이해하고, 롤아웃 보상, GAE, 클리핑과 학습 안정성 점검 항목을 살펴봅니다.',
  },
  '/chapter-10/alignment-tax': {
    en: 'Measure alignment-related capability regressions, test competing causes, and evaluate mitigation strategies with slice-level release criteria.',
    ko: '정렬 과정에서 발생하는 능력 저하를 측정하고 원인 가설과 완화 방법을 비교하며, 데이터 하위 집합별 배포 기준을 설계합니다.',
  },
  '/chapter-11/vision-language-bridges': {
    en: 'Compare CLIP contrastive alignment, Flamingo cross-attention, and projection-layer bridges, including the engineering costs of connecting vision and language.',
    ko: 'CLIP의 대조 정렬, Flamingo의 교차 어텐션과 투영 레이어를 비교하며 시각과 언어를 연결하는 방식 및 시스템 비용을 살펴봅니다.',
  },
  '/chapter-11/audio-and-speech-integration': {
    en: 'Explore neural audio codecs, discrete speech tokens, AudioLM, VALL-E, and the trade-offs of integrating speech into language-model systems.',
    ko: '신경망 오디오 코덱, 이산 음성 토큰, AudioLM과 VALL-E를 살펴보고 언어 모델 시스템에 음성을 통합할 때의 트레이드오프를 이해합니다.',
  },
  '/chapter-11/unified-multimodal-any-to-any': {
    en: 'Explore any-to-any multimodal models through shared token spaces, diffusion and flow, cross-modal transfer, and disaggregated serving.',
    ko: '공유 토큰 공간, 확산과 흐름, 모달리티 간 전이 및 분리형 서빙을 통해 다양한 입력·출력을 통합하는 멀티모달 모델을 살펴봅니다.',
  },
  '/chapter-11/image-diffusion-models': {
    en: 'Understand forward and reverse diffusion, latent diffusion, and Stable Diffusion, with comparisons to GANs and image-generation architecture choices.',
    ko: '순방향·역방향 확산과 잠재 확산, Stable Diffusion을 이해하고, GAN과의 비교를 통해 이미지 생성 아키텍처의 선택 기준을 살펴봅니다.',
  },
  '/chapter-11/video-generation-foundations': {
    en: 'Learn video-generation fundamentals through spacetime patches, attention costs, diffusion Transformers, and the limits of interpreting generated motion.',
    ko: '시공간 패치, 어텐션 비용과 확산 Transformer를 통해 비디오 생성의 기초를 배우고, 생성된 움직임을 해석할 때의 한계를 살펴봅니다.',
  },
  '/chapter-11/commercial-video-models': {
    en: 'Evaluate commercial video models using disclosed capabilities, private test cases, and evidence boundaries between visual plausibility and physical reasoning.',
    ko: '공개된 기능과 자체 테스트 사례로 상용 비디오 모델을 평가하고, 시각적 그럴듯함과 물리적 추론 능력을 구분하는 기준을 살펴봅니다.',
  },
  '/chapter-12/paged-attention-vllm': {
    en: 'Understand vLLM PagedAttention through KV cache fragmentation, block tables, non-contiguous allocation, and copy-on-write cache sharing.',
    ko: 'KV 캐시 단편화, 블록 테이블, 비연속 메모리 할당과 쓰기 시 복사 기반 캐시 공유를 통해 vLLM의 PagedAttention을 이해합니다.',
  },
  '/chapter-12/speculative-decoding': {
    en: 'Learn speculative decoding through draft-and-verify execution, rejection sampling, acceptance rates, and the serving conditions that determine speedup.',
    ko: '초안 생성과 검증, 거절 샘플링, 수락률을 통해 추측 디코딩을 이해하고 실제 속도 향상을 결정하는 서빙 조건을 살펴봅니다.',
  },
  '/chapter-12/long-context-serving': {
    en: 'Analyze long-context serving through prefill and decode costs, StreamingLLM, YaRN, chunked prefill, and disaggregated inference scheduling.',
    ko: '프리필·디코드 비용, StreamingLLM, YaRN, 청크 프리필과 분리형 추론 스케줄링을 통해 긴 문맥 서빙의 병목을 분석합니다.',
  },
  '/chapter-12/serving-policies-slos-and-fallbacks': {
    en: 'Design LLM serving policies with latency SLOs, cost-aware admission control, tenant isolation, fallbacks, and actionable incident metrics.',
    ko: '지연 시간 SLO, 비용 기반 요청 수락, 테넌트 격리, 대체 처리와 장애 대응 지표를 바탕으로 LLM 서빙 정책을 설계합니다.',
  },
  '/chapter-13/ptq-vs-qat': {
    en: 'Compare post-training quantization (PTQ) and quantization-aware training (QAT), including linear quantization, calibration, and quantization error.',
    ko: '학습 후 양자화(PTQ)와 양자화 인지 학습(QAT)을 비교하고, 선형 양자화의 원리와 보정 과정 및 양자화 오차를 이해합니다.',
  },
  '/chapter-13/quantization-methods': {
    en: 'Compare GPTQ, AWQ, rotation-based quantization, and GGUF deployment, with attention to calibration, data types, and hardware compatibility.',
    ko: 'GPTQ, AWQ, 회전 기반 양자화와 GGUF 배포를 비교하며 보정 데이터, 자료형, 하드웨어 호환성이 선택에 미치는 영향을 살펴봅니다.',
  },
  '/chapter-13/weight-sparsification': {
    en: 'Compare structured and unstructured pruning through SparseGPT, Wanda, 2:4 sparsity, and SliceGPT, and examine hardware execution constraints.',
    ko: 'SparseGPT, Wanda, 2:4 희소성과 SliceGPT를 통해 구조적·비구조적 가지치기를 비교하고 하드웨어 실행 제약을 살펴봅니다.',
  },
  '/chapter-13/knowledge-distillation': {
    en: 'Explore knowledge distillation for language models through logits, rationales, forward and reverse KL, on-policy sampling, and student evaluation.',
    ko: '로짓과 추론 과정, 순방향·역방향 KL, 온폴리시 샘플링과 학생 모델 평가를 통해 언어 모델의 지식 증류 방법을 살펴봅니다.',
  },
  '/chapter-13/advanced-quantization': {
    en: 'Understand low-bit quantization challenges through activation outliers, rotation transforms, and ternary-weight approaches such as BitNet b1.58.',
    ko: '활성값 이상치, 회전 변환과 BitNet b1.58 같은 삼진 가중치 접근법을 통해 저비트 양자화의 어려움과 설계 선택을 이해합니다.',
  },
  '/chapter-14/lexical-to-semantic-search': {
    en: 'Compare lexical and semantic retrieval, explore document chunking, and connect embedding quality to contrastive learning and Matryoshka representations.',
    ko: '키워드 검색과 의미 검색, 문서 청킹을 비교하고, 대조 학습과 Matryoshka 표현이 임베딩 품질에 어떻게 연결되는지 살펴봅니다.',
  },
  '/chapter-14/vector-indexing-and-db-solutions': {
    en: 'Compare exact search and approximate nearest-neighbor indexing, including HNSW, ScaNN, metadata filtering, and vector-database access control.',
    ko: '정확 검색과 근사 최근접 이웃 인덱싱을 비교하며 HNSW, ScaNN, 메타데이터 필터링과 벡터 데이터베이스의 접근 제어를 살펴봅니다.',
  },
  '/chapter-14/advanced-retrieval': {
    en: 'Improve retrieval pipelines with SPLADE, hybrid search, reciprocal rank fusion, HyDE, cross-encoder reranking, and ColBERT late interaction.',
    ko: 'SPLADE, 하이브리드 검색, RRF, HyDE, 크로스 인코더 리랭킹과 ColBERT의 후기 상호작용으로 검색 파이프라인을 개선하는 방법을 배웁니다.',
  },
  '/chapter-14/rag-orchestration': {
    en: 'Design RAG orchestration through query routing, context management, lost-in-the-middle effects, and agent-driven retrieval loops.',
    ko: '질의 라우팅, 문맥 관리, 긴 문맥 중간의 정보 누락 문제와 에이전트 검색 루프를 통해 RAG 오케스트레이션을 설계합니다.',
  },
  '/chapter-14/graphrag-and-ontology': {
    en: 'Decide when GraphRAG is useful, then explore ontology design, entity and relationship extraction, multi-hop traversal, and global graph summaries.',
    ko: 'GraphRAG가 필요한 조건을 판단하고 온톨로지 설계, 개체·관계 추출, 다중 홉 탐색과 그래프 전체 요약 방식을 살펴봅니다.',
  },
  '/chapter-1/symbolism-vs-connectionism': {
    en: 'Compare symbolic rules and learned neural representations, their mathematical assumptions, and the shift from hand-written knowledge to learned weights.',
    ko: '기호 규칙과 학습된 신경망 표현의 가정을 비교하고, 사람이 작성한 지식에서 데이터로 학습한 가중치로 옮겨 간 흐름을 살펴봅니다.',
  },
  '/chapter-1/power-of-representation': {
    en: 'Explore feature engineering, representation learning, the manifold hypothesis, and latent spaces to understand what deep networks learn from data.',
    ko: '특성 공학, 표현 학습, 매니폴드 가설과 잠재 공간을 통해 심층 신경망이 데이터에서 무엇을 학습하는지 이해합니다.',
  },
  '/chapter-1/deep-learning-paradigms': {
    en: 'Compare supervised, self-supervised, and reinforcement learning, then connect these paradigms to foundation models and autoregressive training loss.',
    ko: '지도·자기지도·강화 학습을 비교하고, 각 학습 패러다임이 파운데이션 모델과 자기회귀 학습 손실에 어떻게 연결되는지 살펴봅니다.',
  },
  '/chapter-1/bitter-lesson': {
    en: 'Examine the Bitter Lesson: why general search and learning methods benefit from computation, and how scaling laws inform engineering choices.',
    ko: '쓴 교훈을 바탕으로 범용 탐색과 학습이 연산 규모의 이점을 얻는 이유, 스케일링 법칙이 엔지니어링 선택에 주는 의미를 살펴봅니다.',
  },
  '/chapter-2/markov-chains-to-rnns': {
    en: 'Trace sequence modeling from Markov chains to recurrent neural networks, with hidden-state intuition and a PyTorch RNN example.',
    ko: '마르코프 체인에서 순환 신경망으로 이어지는 시퀀스 모델링의 발전을 따라가며 은닉 상태와 PyTorch RNN 예제를 살펴봅니다.',
  },
  '/chapter-2/vanishing-exploding-gradients': {
    en: 'Understand vanishing and exploding gradients through backpropagation through time, repeated multiplication, and gradient-flow visualizations.',
    ko: '시간 역전파와 반복적인 곱셈을 통해 기울기가 소실되거나 폭주하는 이유를 이해하고, 시각화로 기울기의 흐름을 확인합니다.',
  },
  '/chapter-2/dawn-of-attention': {
    en: 'Learn how Bahdanau attention addresses the sequence-to-sequence bottleneck using alignment weights, context vectors, and a PyTorch example.',
    ko: 'Bahdanau 어텐션이 정렬 가중치와 문맥 벡터를 사용해 Seq2Seq의 정보 병목을 해결하는 원리를 PyTorch 예제와 함께 배웁니다.',
  },
  '/chapter-2/cnns-for-nlp': {
    en: 'See how one-dimensional convolutions process text, why local receptive fields matter, and how a TextCNN is implemented in PyTorch.',
    ko: '1차원 합성곱이 텍스트를 처리하는 방식과 국소 수용 영역의 의미를 살펴보고, PyTorch로 구현한 TextCNN을 이해합니다.',
  },
  '/chapter-3/multi-head-attention': {
    en: 'Understand multi-head attention through representation subspaces, projection shapes, head concatenation, and a PyTorch implementation.',
    ko: '표현 부분 공간, 투영 텐서의 형태와 헤드 결합을 통해 멀티 헤드 어텐션을 이해하고 PyTorch 구현을 살펴봅니다.',
  },
  '/chapter-3/position-encoding-strategy': {
    en: 'Compare sinusoidal position encodings and rotary position embeddings (RoPE), including their mathematics and PyTorch implementation.',
    ko: '사인·코사인 위치 인코딩과 회전 위치 임베딩(RoPE)을 비교하고, 위치 정보를 전달하는 수학적 원리와 PyTorch 구현을 살펴봅니다.',
  },
  '/chapter-3/layer-normalization-residuals': {
    en: 'Learn how residual connections and layer normalization support Transformer training, and compare Pre-LN and Post-LN architectures.',
    ko: '잔차 연결과 레이어 정규화가 Transformer 학습을 돕는 원리를 이해하고, Pre-LN과 Post-LN 구조의 차이를 비교합니다.',
  },
  '/chapter-3/complexity-analysis': {
    en: 'Analyze Transformer computation and memory complexity, compare sequence-model costs, and visualize the quadratic growth of attention.',
    ko: 'Transformer의 연산량과 메모리 복잡도를 분석하고 시퀀스 모델별 비용을 비교하며, 어텐션의 제곱 증가를 시각화로 확인합니다.',
  },
  '/chapter-4/encoder-only': {
    en: 'Explore BERT-style encoder-only models: bidirectional attention, masked language modeling, representation learning, and an MLM head example.',
    ko: 'BERT 계열 인코더 전용 모델의 양방향 어텐션, 마스킹 언어 모델링과 표현 학습을 살펴보고 MLM 헤드 예제를 이해합니다.',
  },
  '/chapter-4/decoder-only': {
    en: 'Explore GPT-style decoder-only models through causal attention masks, next-token prediction, and the engineering implications of autoregression.',
    ko: '인과적 어텐션 마스크와 다음 토큰 예측을 통해 GPT 계열 디코더 전용 모델을 이해하고 자기회귀 구조의 엔지니어링 의미를 살펴봅니다.',
  },
  '/chapter-4/encoder-decoder': {
    en: 'Understand T5- and BART-style encoder-decoder models, how cross-attention connects input and output, and the corresponding PyTorch mechanism.',
    ko: 'T5·BART 계열 인코더-디코더 모델과 입력·출력을 연결하는 교차 어텐션을 이해하고, 해당 메커니즘의 PyTorch 예제를 살펴봅니다.',
  },
  '/chapter-4/hybrid-prefix-lm': {
    en: 'Learn how prefix language models combine bidirectional prompt attention with causal generation, using an explicit prefix-mask implementation.',
    ko: 'Prefix LM이 프롬프트의 양방향 어텐션과 인과적 생성을 결합하는 방식을 배우고, 프리픽스 마스크 구현을 살펴봅니다.',
  },
  '/chapter-4/various-llm-architectures': {
    en: 'Compare LLM architecture choices by attention, sparsity, and disclosed design details, with a simplified multi-head latent attention example.',
    ko: '어텐션, 희소성, 공개된 설계 정보를 기준으로 LLM 아키텍처를 비교하고, 단순화한 MLA 예제로 구조적 차이를 이해합니다.',
  },
  '/chapter-5/sparse-vs-dense-models': {
    en: 'Compare dense models and mixture-of-experts (MoE) models through active versus total parameters, conditional computation, and systems trade-offs.',
    ko: '활성 파라미터와 전체 파라미터, 조건부 연산을 기준으로 밀집 모델과 전문가 혼합(MoE) 모델의 비용 및 시스템 트레이드오프를 비교합니다.',
  },
  '/chapter-5/expert-parallelism': {
    en: 'Explore MoE expert parallelism, token dispatch, all-to-all communication, grouped matrix multiplication, and communication-compute overlap.',
    ko: 'MoE 전문가 병렬화의 토큰 분배, All-to-All 통신, 그룹 행렬 곱셈과 통신·연산 중첩을 통해 분산 실행의 병목을 살펴봅니다.',
  },
  '/chapter-5/collapsing-load-balancing': {
    en: 'Diagnose MoE expert collapse and compare load-balancing losses, capacity factors, token dropping, router z-loss, and loss-free routing.',
    ko: 'MoE의 전문가 붕괴를 진단하고 부하 분산 손실, 용량 계수, 토큰 드롭, 라우터 z-loss와 보조 손실 없는 라우팅을 비교합니다.',
  },
  '/chapter-5/case-study': {
    en: 'Study MoE architecture case studies through expert granularity, routing, active parameters, and the limits of publicly disclosed model details.',
    ko: '전문가의 세분화, 라우팅, 활성 파라미터를 중심으로 MoE 아키텍처 사례를 비교하고 공개된 모델 정보의 한계를 살펴봅니다.',
  },
  '/chapter-6/data-engineering-at-scale': {
    en: 'Design pre-training data pipelines with immutable manifests, evaluation quarantine, deterministic sharding, resumable loading, and acceptance tests.',
    ko: '불변 매니페스트, 평가 데이터 격리, 결정론적 샤딩, 재개 가능한 로딩과 인수 테스트를 갖춘 사전 학습 데이터 파이프라인을 설계합니다.',
  },
  '/chapter-6/tokenization-science': {
    en: 'Explore subword and byte tokenization, vocabulary-compute trade-offs, normalization, special tokens, and tokenizer-checkpoint compatibility.',
    ko: '서브워드·바이트 토큰화, 어휘 크기와 연산 비용, 정규화와 특수 토큰을 살펴보고 토크나이저와 체크포인트의 호환성을 점검합니다.',
  },
  '/chapter-6/large-scale-training-stability': {
    en: 'Diagnose large-scale training instability with mask-correct loss, gradient and activation monitoring, loss-spike triage, and recovery criteria.',
    ko: '올바른 손실 마스킹, 그래디언트·활성값 관측, 손실 급증 진단과 복구 기준을 통해 대규모 학습의 불안정성을 분석합니다.',
  },
  '/chapter-6/infrastructure': {
    en: 'Explore foundation model training infrastructure: rack-scale compute, network topology, GPU and TPU interconnects, power, cooling, and NCCL.',
    ko: '랙 단위 연산, 네트워크 토폴로지, GPU·TPU 연결망, 전력·냉각과 NCCL을 통해 파운데이션 모델 학습 인프라의 제약을 살펴봅니다.',
  },
  '/chapter-6/synthetic-data-for-pre-training': {
    en: 'Evaluate synthetic pre-training data through model-collapse risks, textbook-style corpora, rejection sampling, and data-quality controls.',
    ko: '모델 붕괴 위험, 교재형 말뭉치, 거절 샘플링과 데이터 품질 관리를 통해 합성 데이터를 사전 학습에 활용하는 방법을 살펴봅니다.',
  },
  '/chapter-7/data-parallelism': {
    en: 'Compare PyTorch DataParallel and DistributedDataParallel, including gradient synchronization, bucketing, and communication-compute overlap.',
    ko: 'PyTorch의 DataParallel과 DistributedDataParallel을 비교하며 그래디언트 동기화, 버킷 구성과 통신·연산 중첩을 이해합니다.',
  },
  '/chapter-7/model-and-pipeline-parallelism': {
    en: 'Compare pipeline, tensor, sequence, and context parallelism, and understand how their communication and scheduling costs combine in 3D parallelism.',
    ko: '파이프라인·텐서·시퀀스·문맥 병렬화를 비교하고, 3D 병렬화에서 통신 비용과 실행 스케줄이 어떻게 결합되는지 이해합니다.',
  },
  '/chapter-8/power-law': {
    en: 'Understand empirical neural scaling laws, log-log relationships, extrapolation uncertainty, and why apparent emergence depends on measurement.',
    ko: '신경망의 경험적 스케일링 법칙, 로그-로그 관계와 외삽의 불확실성을 이해하고, 창발적으로 보이는 현상이 측정에 좌우되는 이유를 살펴봅니다.',
  },
  '/chapter-8/chinchilla-optimality': {
    en: 'Study Chinchilla compute allocation through model size, training tokens, and the Gopher comparison, with a training-budget calculation example.',
    ko: '모델 크기와 학습 토큰의 배분, Gopher와의 비교를 통해 Chinchilla 최적성을 이해하고 학습 예산 계산 예제를 살펴봅니다.',
  },
  '/chapter-8/over-training-vs-optimal-training': {
    en: 'Examine training beyond compute optimality, downstream adaptation, checkpoint selection, and pilot experiments with explicit stopping criteria.',
    ko: '연산 최적점을 넘는 학습과 후속 적응의 관계를 살펴보고, 중단 기준이 있는 파일럿 실험과 체크포인트 선택 절차를 설계합니다.',
  },
  '/chapter-8/transfer-learning-and-generalization': {
    en: 'Explore effective data transfer, grokking, weak-to-strong supervision, and a practical transfer matrix for evaluating generalization claims.',
    ko: '유효 데이터 전이, 그로킹, 약한 모델에서 강한 모델로의 감독을 살펴보고 전이 평가표로 일반화 주장을 검증하는 방법을 배웁니다.',
  },
  '/chapter-8/continued-pretraining-and-domain-adaptation': {
    en: 'Choose between continued pre-training, RAG, and SFT, then plan domain adaptation with checkpoint selection, data mixtures, and tokenizer checks.',
    ko: '지속 사전 학습·RAG·SFT 중 적합한 방법을 선택하고, 체크포인트·데이터 혼합·토크나이저 점검을 바탕으로 도메인 적응을 계획합니다.',
  },
  '/chapter-3/self-attention-mathematics': {
    en: 'Understand self-attention through Q, K, V projections, scaled dot products, attention weights, and a PyTorch implementation.',
    ko: 'Q, K, V 투영부터 스케일드 닷 프로덕트와 어텐션 가중치까지, 셀프 어텐션의 수학적 원리를 PyTorch 코드와 함께 설명합니다.',
  },
  '/chapter-5/routing-algorithms': {
    en: 'Explore how MoE routers assign tokens to experts: top-k routing, load balancing, Expert Choice, Soft MoE, and auxiliary-loss-free routing.',
    ko: 'MoE가 토큰을 전문가에 배정하는 방식을 살펴봅니다. Top-k, 부하 분산, Expert Choice, Soft MoE와 보조 손실 없는 라우팅을 비교합니다.',
  },
  '/chapter-7/zero-redundancy-optimizer': {
    en: 'Compare ZeRO stages 1, 2, and 3: how sharding optimizer states, gradients, and parameters changes GPU memory use and communication costs.',
    ko: 'ZeRO 1·2·3단계가 옵티마이저 상태, 그래디언트, 파라미터를 분할하는 방식과 GPU 메모리 절감에 따른 통신 비용을 비교합니다.',
  },
  '/chapter-7/flash-attention': {
    en: 'Learn how FlashAttention uses tiling, recomputation, and parallelism to reduce memory traffic, and how to check PyTorch SDPA kernel selection.',
    ko: 'FlashAttention의 타일링, 재계산, 병렬화가 메모리 접근을 줄이는 원리를 배우고 PyTorch SDPA의 커널 선택을 확인합니다.',
  },
  '/chapter-9/sft-fundamentals': {
    en: 'Build a mental model of supervised fine-tuning: assistant loss masks, native chat templates, packing, truncation, and evaluation gates.',
    ko: '지도 미세조정의 손실 마스크, 토크나이저 고유 채팅 템플릿, 패킹과 잘림 처리를 이해하고 학습 실행·평가 기준을 살펴봅니다.',
  },
  '/chapter-9/parameter-efficient-fine-tuning-peft': {
    en: 'Understand LoRA and QLoRA through memory budgets, low-rank updates, adapter merging, base-model compatibility, and release evaluation.',
    ko: '메모리 예산과 저랭크 업데이트를 통해 LoRA와 QLoRA를 이해하고, 어댑터 병합·베이스 모델 호환성·배포 평가를 살펴봅니다.',
  },
  '/chapter-10/dpo': {
    en: 'Understand Direct Preference Optimization: preference pairs, the reference policy, completion log probabilities, masking, and training metrics.',
    ko: 'DPO의 선호 쌍과 기준 정책, 응답 로그 확률, 손실 마스킹을 이해하고 데이터 분할과 학습 모니터링에서 확인할 항목을 살펴봅니다.',
  },
  '/chapter-10/kto-and-ipo': {
    en: 'Compare IPO, KTO, and conservative DPO: finite preference margins, unpaired feedback, label uncertainty, and shared training contracts.',
    ko: 'IPO, KTO, 보수적 DPO의 차이를 비교합니다. 유한한 선호 마진, 짝이 없는 피드백, 레이블 불확실성과 공통 학습 조건을 다룹니다.',
  },
  '/chapter-12/kv-cache-management': {
    en: 'Estimate KV cache memory from batch size, context length, layers, and KV heads. Explore GQA, MLA, cache quantization, and fragmentation.',
    ko: '배치 크기, 문맥 길이, 레이어 수와 KV 헤드 수로 캐시 메모리를 계산하고 GQA·MLA·캐시 양자화·메모리 단편화를 살펴봅니다.',
  },
  '/chapter-12/continuous-batching': {
    en: 'See how continuous batching schedules LLM requests at each decoding step, and explore static batching, chunked prefill, and latency trade-offs.',
    ko: '연속 배칭이 디코딩 단계마다 요청을 교체하는 원리를 시각화로 살펴보고 정적 배칭, 청크 프리필과 지연 시간의 관계를 이해합니다.',
  },
  '/chapter-14/rag-failure-modes-and-operational-design': {
    en: 'Diagnose RAG failures across retrieval, routing, and generation. Design confidence thresholds, timeouts, degraded modes, and pipeline evaluations.',
    ko: 'RAG의 검색·라우팅·생성 단계별 실패를 진단하고 신뢰도 임계값, 타임아웃, 기능 축소 운영과 파이프라인 평가를 설계합니다.',
  },
  '/chapter-17/production-evaluation-and-release-gates': {
    en: 'Design LLM release gates with immutable artifacts, statistical evaluation, shadow traffic, canary rollouts, and a rehearsed rollback runbook.',
    ko: '불변 모델 아티팩트, 통계적 평가, 섀도 트래픽과 카나리 배포를 바탕으로 LLM 출시 기준과 검증 가능한 롤백 절차를 설계합니다.',
  },
};
