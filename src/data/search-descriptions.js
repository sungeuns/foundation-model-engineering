// Keep search snippets separate from chapter prose so editorial work can proceed
// independently. A chapter's own frontmatter description always takes priority.
export const searchDescriptions = {
  '/chapter-1/learning-path-and-mastery': { en: 'Check your prerequisites, choose a foundation-model learning path, and build a portfolio with causal tests, fair comparisons, and release decisions.', ko: '선수 지식을 점검하고 파운데이션 모델 학습 경로를 고르세요. 인과성 검사·공정한 비교·출시 판단을 재현 가능한 포트폴리오로 연결합니다.' },
  '/chapter-6/optimization-mechanics': { en: 'Derive AdamW updates, fix unequal-token gradient weighting, and compare optimizers with matched data, token budgets, and held-out evaluations.', ko: 'AdamW 갱신과 토큰 수가 다른 배치의 기울기 가중을 계산하고, 데이터·토큰 예산·보류 평가를 맞춰 옵티마이저를 비교합니다.' },
  '/chapter-7/tiny-decoder-lab': { en: 'Train a tiny PyTorch decoder on CPU. Run it on Binder without an account, or read the measured losses and see whether checkpoint replay reproduces the next update.', ko: '작은 PyTorch 디코더를 CPU로 학습합니다. Binder에서 로그인 없이 실행하거나, 문맥을 가렸을 때의 손실과 체크포인트 복원 후 다음 학습 결과를 기록에서 확인하세요.' },
  '/chapter-17/experimental-design-and-uncertainty': { en: 'Run a paired evaluation in your browser. Use cluster bootstrap bounds to explain why a target gain of 15 percentage points can still block a release.', ko: '브라우저에서 대응 평가를 실행하세요. 목표 과제 점수가 15%p 올라도 배포가 차단되는 이유를 집단 부트스트랩과 기존 능력의 변화로 확인합니다.' },

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
  '/chapter-15/reasoning-post-training-rlvr': {
    en: 'Understand GRPO and verifiable-reward reasoning training, including length weighting, compositional generalization, hint dependence, rollout recovery, and release gates.',
    ko: 'GRPO와 검증 가능한 보상을 이용한 추론 학습을 이해하고, 길이 가중치·구성적 일반화·힌트 의존·rollout 복구·출시 기준을 살펴봅니다.',
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
    en: 'Recover a lost tool response with an idempotency key, replay a support-ticket example in SQLite, and decide what an agent can safely retry.',
    ko: '응답이 끊긴 뒤에도 티켓은 남습니다. Python과 SQLite로 멱등 키를 재사용해 원래 티켓을 찾고, 에이전트가 재시도해도 되는 조건을 확인합니다.',
  },
  '/chapter-16/decision-models-and-selective-prediction': {
    en: 'Compare Jev and OpenAI Decisions, then test a policy that accepts the same 40 cases even as their error rate rises from 10% to 30%.',
    ko: 'Jev와 OpenAI Decisions를 살펴보고, 같은 40건을 자동 처리하는 동안 오답 비율이 10%에서 30%로 높아지는 이유를 실습으로 확인합니다.',
  },
  '/chapter-17/academic-benchmarks': {
    en: 'Calculate pass@k from a finite pool of answers. See how rounding can hide rare failures and why combining answers across problems inflates the result.',
    ko: '생성한 답안에서 k개를 고를 때 실패할 확률을 계산합니다. 반올림으로 가려진 실패와 서로 다른 문제의 답안을 합쳐 점수가 부풀려지는 사례를 확인합니다.',
  },
  '/chapter-17/llm-as-a-judge': {
    en: 'Calibrate an LLM judge on a translation that reverses the source meaning. Compare paired verdicts and measure how many critical errors the grader misses.',
    ko: '유창하지만 원문의 뜻을 뒤집은 번역을 LLM 평가기로 어떻게 잡을까요? 두 답의 순서를 바꿔 판정을 비교하고, 놓친 오류를 유형별로 측정합니다.',
  },
  '/chapter-17/elo-rating-and-leaderboards': {
    en: 'Replay two wins and two losses in opposite orders. Calculate why sequential Elo can reverse the model ranking and why the same Bradley–Terry fit gives a tie.',
    ko: '두 번 이기고 두 번 진 모델의 네 표를 거꾸로 읽어 봅니다. 온라인 Elo 순위가 뒤집히는 이유와 Bradley–Terry에서는 동점이 되는 이유를 직접 계산합니다.',
  },
  '/chapter-17/contamination-issues': {
    en: 'Detect and prevent benchmark contamination with data lineage, multi-representation matching, decontamination pipelines, and private evaluation sets.',
    ko: '데이터 계보, 여러 표현 수준의 중복 탐지, 오염 제거 파이프라인과 비공개 평가셋으로 벤치마크 오염을 탐지하고 방지합니다.',
  },
  '/chapter-17/commercial-model-benchmarks': {
    en: 'Compare 45 model profiles as of November 24, 2026. Check GLM-5.4 access, Ling-3.2-air weights and GPT-6.2 benchmarks, then price a long-context request in Python.',
    ko: '2026년 11월 24일 기준 45개 모델을 비교합니다. GLM-5.4의 이용 경로, Ling-3.2-air의 공개 가중치, GPT-6.2의 평가 조건을 확인하고 Python으로 긴 문맥 요금을 계산하세요.',
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
    en: 'Fit a linear probe to hidden states and test what it can decode. A PyTorch example shows how standardization changes the direction of a projection.',
    ko: '은닉 상태에서 선형 프로브로 읽어 낼 수 있는 정보를 측정합니다. 표준화를 적용한 프로브에서 어느 방향을 투영해야 하는지 PyTorch 예제로 확인합니다.',
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
    en: 'Two models get 80% and 50% positive feedback. Compare their votes by request type to see why both reach 65% on the same mix, then decide which answers belong in training.',
    ko: '두 모델의 좋아요 비율은 80%와 50%입니다. 두 종류의 요청을 절반씩 반영하면 왜 두 모델의 추정치가 모두 65%가 되는지 계산하고, 어떤 답변을 학습에 쓸지 판단해 보세요.',
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
    en: 'How does a vision-language model read an image? Compare CLIP, projectors and cross-attention, then see what SmolVLM reads when a receipt’s total is erased.',
    ko: '비전–언어 모델은 사진을 어떻게 읽을까요? CLIP 검색, 패치 투영, 교차 어텐션을 비교하고 영수증의 합계 줄을 지웠을 때 SmolVLM이 내놓은 답을 확인합니다.',
  },
  '/chapter-11/audio-and-speech-integration': {
    en: 'Follow neural audio codecs in AudioLM and VALL-E, then trace how Scribe v3 Live captions settle before their speaker labels do.',
    ko: 'AudioLM과 VALL-E의 오디오 코덱을 살펴보고, Scribe v3 Live에서 확정된 자막에 화자 정보가 뒤늦게 붙고 정정되는 과정을 따라갑니다.',
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
    en: 'Map five tokens to two physical KV blocks. Check the PagedAttention addresses against dense attention on a CPU, then explore block reuse and copy-on-write sharing.',
    ko: '다섯 토큰이 물리 KV 블록 두 개에 어떻게 나뉠까요? CPU에서 블록 주소를 따라가며 어텐션 출력을 검산하고, 블록 반환과 공유 과정을 살펴봅니다.',
  },
  '/chapter-12/speculative-decoding': {
    en: 'Change two token probabilities and see why speculative decoding needs residual sampling. Redrawing from the target gives 62.5% where it should give 75%.',
    ko: '두 토큰의 확률을 바꿔 투기적 디코딩에서 왜 잔여 분포가 필요한지 확인합니다. 목표 분포에서 다시 뽑으면 75%여야 할 확률이 62.5%로 바뀝니다.',
  },
  '/chapter-12/long-context-serving': {
    en: 'Analyze long-context serving through prefill and decode costs, StreamingLLM, YaRN, chunked prefill, and disaggregated inference scheduling.',
    ko: '프리필·디코드 비용, StreamingLLM, YaRN, 청크 프리필과 분리형 추론 스케줄링을 통해 긴 문맥 서빙의 병목을 분석합니다.',
  },
  '/chapter-12/serving-policies-slos-and-fallbacks': {
    en: 'Compare TTFT, TPOT and gaps in two token streams. Use measured Sarvam-105B throughput and latency to check a 500 ms first-token target.',
    ko: '두 응답의 TTFT, TPOT, 토큰 사이 지연을 비교합니다. Sarvam-105B의 실측값으로 첫 토큰 500ms 목표를 충족하는 동시 사용자 수를 확인합니다.',
  },
  '/chapter-12/length-bucketing-lab': {
    en: 'Pair six prompts by arrival order, then by length. Compare padding across three batches and see why the largest prefill KV cache stays the same size.',
    ko: '프롬프트 여섯 개를 도착 순서대로 두 개씩 묶고, 길이 순으로 다시 묶습니다. 세 배치의 패딩 합계와 프리필 직후의 KV 캐시 크기를 재어 가장 큰 배치에 필요한 메모리를 비교합니다.',
  },
  '/chapter-13/ptq-vs-qat': {
    en: 'Compare PTQ and QAT on a 3-bit grid. Round eight values by hand, check when gradients pass through, and save and reload a calibrated PyTorch layer.',
    ko: '3비트 양자화에서 값 여덟 개를 반올림하고 어느 입력에 기울기가 전달되는지 확인합니다. PyTorch로 보정한 층을 저장하고 다시 불러와 PTQ와 QAT의 차이를 살펴봅니다.',
  },
  '/chapter-13/quantization-methods': {
    en: 'Why can rounding a small weight change an output more than clipping a large one? Test a 3-bit dot product, then compare GPTQ, AWQ, and GGUF deployment.',
    ko: '작은 가중치의 반올림이 큰 가중치를 자르는 것보다 출력을 더 크게 바꿀 수 있을까요? 3비트 내적으로 검산하고 GPTQ·AWQ·GGUF가 각각 어디에 쓰이는지 살펴봅니다.',
  },
  '/chapter-13/weight-sparsification': {
    en: 'Compare structured and unstructured pruning through SparseGPT, Wanda, 2:4 sparsity, and SliceGPT, and examine hardware execution constraints.',
    ko: 'SparseGPT, Wanda, 2:4 희소성과 SliceGPT를 통해 구조적·비구조적 가지치기를 비교하고 하드웨어 실행 제약을 살펴봅니다.',
  },
  '/chapter-13/knowledge-distillation': {
    en: 'Compare text, logit and feature distillation. Swap two hidden coordinates and their readout columns to see how hidden MSE can be 4 while output KL is zero.',
    ko: '텍스트·로짓·특징 증류를 비교합니다. 은닉 좌표 둘과 출력층의 열을 바꿔, 은닉 상태의 평균제곱오차가 4여도 출력 KL 발산이 0인 경우를 확인합니다.',
  },
  '/chapter-13/advanced-quantization': {
    en: 'Understand low-bit quantization challenges through activation outliers, rotation transforms, and ternary-weight approaches such as BitNet b1.58.',
    ko: '활성값 이상치, 회전 변환과 BitNet b1.58 같은 삼진 가중치 접근법을 통해 저비트 양자화의 어려움과 설계 선택을 이해합니다.',
  },
  '/chapter-14/lexical-to-semantic-search': {
    en: 'Try BM25 and cosine similarity on four titles, then run multilingual E5 on Korean support queries. See why a single letter in a product code can change the answer.',
    ko: 'BM25와 코사인 유사도로 제목을 비교한 뒤, 다국어 E5로 한국어 문의에 맞는 영어 설명서를 찾습니다. 제품 번호 끝 글자 하나가 검색 결과에 미치는 영향을 실측값으로 확인합니다.',
  },
  '/chapter-14/vector-indexing-and-db-solutions': {
    en: 'Trace a greedy nearest-neighbor search that stops at distance 97.74 when the exact answer is 9.49 away. Compare search budgets, HNSW, IVF, PQ and filters.',
    ko: '탐색이 거리 97.74에서 멈추는데 실제 최근접 노드는 9.49 거리에 있는 사례를 따라갑니다. 탐색 예산, HNSW, IVF, PQ와 검색 필터를 비교합니다.',
  },
  '/chapter-14/advanced-retrieval': {
    en: 'Combine BM25 and dense search with reciprocal rank fusion. Change candidate depth, trace each document’s score and see which evidence reaches the reranker.',
    ko: 'BM25와 밀집 검색의 순위를 RRF로 결합하세요. 각 검색기가 넘기는 후보 수를 바꾸면서 문서별 점수가 어떻게 변하고 어떤 근거가 재순위화 단계에 도달하는지 확인합니다.',
  },
  '/chapter-14/rag-orchestration': {
    en: 'Design RAG orchestration through query routing, context management, lost-in-the-middle effects, and agent-driven retrieval loops.',
    ko: '질의 라우팅, 문맥 관리, 긴 문맥 중간의 정보 누락 문제와 에이전트 검색 루프를 통해 RAG 오케스트레이션을 설계합니다.',
  },
  '/chapter-14/graphrag-and-ontology': {
    en: 'A graph walk ranks a CEO and a vendor equally. Follow two typed edges back to source passages to check which candidate the evidence supports.',
    ko: 'GraphRAG 예제에서 CEO와 거래처가 같은 검색 점수를 받습니다. 그래프의 관계 두 개를 따라 원문 메모를 찾아가며 누구를 CEO라고 답할 수 있는지 확인합니다.',
  },
  '/chapter-1/symbolism-vs-connectionism': {
    en: 'Spot a disagreement between two library catalogs. Test AND and XOR on all four inputs and build a two-unit PyTorch network that detects the mismatch.',
    ko: '두 도서관 장부의 대출 기록이 일치하는지 확인합니다. 네 가지 입력에 AND와 XOR을 시험하고 두 개의 은닉 유닛을 갖춘 PyTorch 신경망으로 불일치를 찾아보세요.',
  },
  '/chapter-1/power-of-representation': {
    en: 'Swap the adjectives in a film review to see what pooling loses. Fit word scores from ratings and explore a two-dimensional autoencoder bottleneck.',
    ko: '영화평에서 연기와 줄거리에 붙은 평가를 맞바꿔 평균이 어떤 정보를 잃는지 확인합니다. 단어 점수 학습과 2차원 오토인코더 병목도 다룹니다.',
  },
  '/chapter-1/deep-learning-paradigms': {
    en: 'Use eight film reviews to compute next-token loss in Python. Compare the training signal from the review itself, a written answer, and a grader’s reward.',
    ko: '영화평 여덟 건으로 다음 토큰의 확률과 손실을 계산합니다. 같은 영화평에서 원문, 예시 답안, 채점기의 보상으로 각각 무엇을 학습할 수 있는지 살펴봅니다.',
  },
  '/chapter-1/bitter-lesson': {
    en: 'Read Sutton’s Bitter Lesson through Gopher and Chinchilla. Compare their training budgets and run a short Python example that trades model size for tokens.',
    ko: '서튼의 ‘쓴 교훈’을 Gopher와 Chinchilla의 학습 실험으로 살펴봅니다. 두 모델의 파라미터와 토큰 수를 비교하고, 파이썬 예제로 같은 연산 예산을 세 가지로 배분해 봅니다.',
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
    en: 'Translate red fox into French in two steps. Compare additive and dot-product attention scores, then reproduce the weights and context vector in PyTorch.',
    ko: 'red fox를 프랑스어로 옮기는 두 단계에서 가산 어텐션과 점곱의 점수를 비교하고, 가중치와 문맥 벡터를 PyTorch로 검산합니다.',
  },
  '/chapter-2/cnns-for-nlp': {
    en: 'Slide a TextCNN filter over seven tokens. Swap two words, find windows tied for the maximum and use PyTorch to see why pooling must skip padding.',
    ko: '일곱 토큰에 TextCNN 필터를 적용하고 두 단어의 순서를 바꿔 최댓값이 같은 구간을 찾습니다. 패딩을 풀링에서 빼야 하는 이유도 PyTorch로 확인합니다.',
  },
  '/chapter-3/multi-head-attention': {
    en: 'Compute two attention heads from three tokens, mute one before the output projection, and reproduce the weights and output in PyTorch.',
    ko: '토큰 세 개로 두 헤드의 가중치를 계산합니다. 출력 투영 직전에 한 헤드의 기여를 0으로 바꾸고, 두 출력 좌표가 어떻게 달라지는지 확인합니다.',
  },
  '/chapter-3/position-encoding-strategy': {
    en: 'Pick a position and a pair of dimensions on a sinusoidal grid, reproduce the values in PyTorch and see how a relative offset enters a RoPE dot product.',
    ko: '위치와 차원 쌍을 골라 사인·코사인 값을 읽고 PyTorch로 검산합니다. RoPE 점곱에서는 두 토큰의 위치 차이가 어떻게 남는지 계산합니다.',
  },
  '/chapter-3/layer-normalization-residuals': {
    en: 'Add 10 to both features of a token and compare LayerNorm with RMSNorm. Change epsilon, reproduce the outputs in PyTorch, and trace a zero branch through Pre-LN and Post-LN.',
    ko: '두 특성에 10을 더하면 LayerNorm과 RMSNorm 중 어느 쪽의 출력이 달라질까요? 브라우저에서 엡실론을 바꾸고, PyTorch와 Pre-LN·Post-LN 예제로 확인합니다.',
  },
  '/chapter-3/complexity-analysis': {
    en: 'Double a prompt from 4,096 to 8,192 tokens and count the bytes in attention scores and the KV cache. Compare prefill with one decoding step.',
    ko: '프롬프트를 4,096토큰에서 8,192토큰으로 늘려 어텐션 점수와 KV 캐시의 크기를 직접 계산하고, 프리필과 디코딩 한 단계에 필요한 연산을 비교합니다.',
  },
  '/chapter-4/encoder-only': {
    en: 'Why can BERT score a word it never masked? Trace one attention row, compare two masked language modeling losses in PyTorch, and see how padding affects each calculation.',
    ko: 'BERT는 왜 그대로 둔 단어까지 채점할까요? 한 문장에서 어텐션에 보이는 단어와 예측할 단어를 짚고, PyTorch로 두 손실값을 계산합니다.',
  },
  '/chapter-4/decoder-only': {
    en: 'Follow three next-token predictions in a GPT-style decoder. Check the shifted labels and causal mask in PyTorch, then compare prompt prefill with token-by-token decoding.',
    ko: 'GPT 계열 디코더는 한 문장에서 다음 토큰을 어떻게 학습할까요? 세 위치의 정답과 인과 마스크를 PyTorch로 확인하고, 프롬프트 처리와 토큰 생성의 계산 차이를 살펴봅니다.',
  },
  '/chapter-4/encoder-decoder': {
    en: 'Trace two decoder queries across four source positions. Test padding in PyTorch cross-attention, then write the different training targets for T5 and BART.',
    ko: '디코더가 첫 단어를 쓸 때 원문을 어디까지 읽을 수 있을까요? 2행 4열 교차 어텐션을 PyTorch로 검산하고, 같은 문장에서 T5와 BART의 학습 정답을 비교합니다.',
  },
  '/chapter-4/hybrid-prefix-lm': {
    en: 'Build a seven-token prefix LM mask in PyTorch. Trace which tokens can see one another and test for future-token leakage with scaled dot-product attention.',
    ko: '일곱 토큰으로 접두사 언어 모델의 어텐션 마스크를 만듭니다. 각 위치에서 읽을 수 있는 토큰을 표로 확인하고 PyTorch에서 미래 토큰 누출을 검사합니다.',
  },
  '/chapter-4/various-llm-architectures': {
    en: 'Why can a model run more layers than it stores? Explore the reused 28-layer block in GLM-5.4, sparsity, and a worked example of multi-head latent attention (MLA).',
    ko: '가중치를 한 번 저장한 층을 두 번 실행하면 무엇이 달라질까요? GLM-5.4의 28층 블록 재사용 사례와 MLA 예제로 어텐션·희소성·연산량을 비교합니다.',
  },
  '/chapter-5/sparse-vs-dense-models': {
    en: 'Calculate top-k mixture-of-experts (MoE) routing, then use active and total parameter counts to budget memory for dense and sparse models. Includes a CPU PyTorch example.',
    ko: '전문가 혼합(MoE)에서 토큰이 고른 전문가와 출력 가중치를 직접 계산합니다. 활성 파라미터와 전체 가중치로 메모리 예산을 구하고 CPU PyTorch 예제로 확인하세요.',
  },
  '/chapter-5/expert-parallelism': {
    en: 'Trace six tokens through an MoE layer on two CPU processes. Inspect all-to-all traffic, expert assignments and how results return to their original order.',
    ko: 'CPU 프로세스 두 개에서 MoE 전문가 병렬화를 실습합니다. 토큰 여섯 개가 어느 전문가에게 가고, 처리 결과가 어떻게 원래 순서로 돌아오는지 추적합니다.',
  },
  '/chapter-5/collapsing-load-balancing': {
    en: 'Diagnose MoE expert collapse and compare load-balancing losses, capacity factors, token dropping, router z-loss, and loss-free routing.',
    ko: 'MoE의 전문가 붕괴를 진단하고 부하 분산 손실, 용량 계수, 토큰 드롭, 라우터 z-loss와 보조 손실 없는 라우팅을 비교합니다.',
  },
  '/chapter-5/case-study': {
    en: 'Mixtral selects two of eight experts, DBRX four of sixteen. Count the expert combinations, then follow six token assignments through fixed-capacity and dropless routing.',
    ko: 'Mixtral은 전문가 8개 중 2개를, DBRX는 16개 중 4개를 선택합니다. 가능한 조합을 세고, 토큰 여섯 개를 배정해 고정 용량 방식과 드롭리스 라우팅을 비교해 보세요.',
  },
  '/chapter-6/data-engineering-at-scale': {
    en: 'Design pre-training data pipelines with immutable manifests, evaluation quarantine, deterministic sharding, resumable loading, and acceptance tests.',
    ko: '불변 매니페스트, 평가 데이터 격리, 결정론적 샤딩, 재개 가능한 로딩과 인수 테스트를 갖춘 사전 학습 데이터 파이프라인을 설계합니다.',
  },
  '/chapter-6/tokenization-science': {
    en: 'Test a real tokenizer on a Korean character and an end-of-text marker. Inspect token IDs, Unicode offsets and the shared BOS, EOS and UNK identifier in SmolLM2.',
    ko: 'SmolLM2에서 한글 ‘가’가 토큰 세 개로 나뉘는 이유와, ID 0이 문장 경계인지 미등록 토큰인지 구별하는 법을 파이썬으로 확인합니다.',
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
    en: 'Compare PyTorch DataParallel and DistributedDataParallel (DDP). Run two CPU processes to see how masking every target on one rank affects a training step.',
    ko: 'PyTorch의 DataParallel과 DistributedDataParallel(DDP)이 그래디언트를 모으는 방식을 비교합니다. 한쪽 랭크의 토큰을 전부 마스킹하면 가중치가 어떻게 바뀌는지 CPU 프로세스 두 개로 확인하세요.',
  },
  '/chapter-7/model-and-pipeline-parallelism': {
    en: 'Compare pipeline, tensor, sequence, and context parallelism, and understand how their communication and scheduling costs combine in 3D parallelism.',
    ko: '파이프라인·텐서·시퀀스·문맥 병렬화를 비교하고, 3D 병렬화에서 통신 비용과 실행 스케줄이 어떻게 결합되는지 이해합니다.',
  },
  '/chapter-8/power-law': {
    en: 'Double a training budget and compare total loss with loss above the assumed floor. Fit a power law in PyTorch and check its forecast on a held-out run.',
    ko: '연산 예산을 두 배로 늘려 전체 손실과 가정한 하한 위의 손실이 각각 얼마나 줄어드는지 계산합니다. PyTorch로 곡선을 맞추고 따로 남긴 실행 결과로 예측을 검증합니다.',
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
    en: 'Choose between continued pre-training, RAG, and SFT for a support ticket. Count how often 80 records are reused and which tokens actually contribute to training.',
    ko: '정비 기록을 잘못 읽는 모델에는 지속 사전 학습(CPT), RAG, SFT 중 무엇이 필요할까요? 같은 기록 80건을 다시 읽을 때의 토큰 비율을 계산하고 Python으로 자신의 학습 로그를 확인합니다.',
  },
  '/chapter-3/self-attention-mathematics': {
    en: 'Trace four tokens through Q, K, V, softmax and a causal mask. Download the PyTorch example to reproduce the browser output and check it against SDPA.',
    ko: '네 토큰의 질의·키·값으로 어텐션 가중치를 계산하고 인과 마스크로 출력을 바꿔 봅니다. 내려받은 PyTorch 예제로 결과를 재현해 SDPA와 대조합니다.',
  },
  '/chapter-5/routing-algorithms': {
    en: 'Explore how MoE routers assign tokens to experts: top-k routing, load balancing, Expert Choice, Soft MoE, and auxiliary-loss-free routing.',
    ko: 'MoE가 토큰을 전문가에 배정하는 방식을 살펴봅니다. Top-k, 부하 분산, Expert Choice, Soft MoE와 보조 손실 없는 라우팅을 비교합니다.',
  },
  '/chapter-7/zero-redundancy-optimizer': {
    en: 'Trace eight weights through four PyTorch workers. Compare ZeRO stages 1–3, calculate memory per GPU, and run reduce-scatter and all-gather on a CPU.',
    ko: '가중치 여덟 개를 네 랭크에 나눠 ZeRO 1·2·3단계의 GPU당 메모리를 계산합니다. CPU에서 PyTorch로 그래디언트를 분할하고 갱신한 가중치를 다시 모아 보세요.',
  },
  '/chapter-7/flash-attention': {
    en: 'Work through a FlashAttention row where averaging tile outputs gives 6 and the correct result is 8. Trace online softmax, memory traffic, and PyTorch kernel selection.',
    ko: 'FlashAttention에서 두 타일의 출력을 단순 평균하면 6인데 전체 출력은 왜 8일까요? 네 개의 키로 온라인 소프트맥스를 계산하고 메모리 접근과 PyTorch 커널 선택을 살펴봅니다.',
  },
  '/chapter-9/sft-fundamentals': {
    en: 'Build a mental model of supervised fine-tuning: assistant loss masks, native chat templates, packing, truncation, and evaluation gates.',
    ko: '지도 미세조정의 손실 마스크, 토크나이저 고유 채팅 템플릿, 패킹과 잘림 처리를 이해하고 학습 실행·평가 기준을 살펴봅니다.',
  },
  '/chapter-9/parameter-efficient-fine-tuning-peft': {
    en: 'Count LoRA parameters in a rectangular projection. Run a CPU PyTorch merge check, then compare the memory costs of LoRA and QLoRA.',
    ko: '직사각형 가중치에 LoRA를 적용해 학습할 파라미터 수를 계산합니다. CPU PyTorch로 어댑터 병합을 검증하고 LoRA와 QLoRA의 메모리 비용을 구분합니다.',
  },
  '/chapter-10/dpo': {
    en: 'Calculate Direct Preference Optimization (DPO) loss for two response pairs in Python. Change only the reference model to see why the preference margin can flip sign.',
    ko: '두 응답 쌍의 DPO 손실을 Python으로 계산합니다. 선호 라벨과 정책 모델을 그대로 두고 기준 모델만 바꿨을 때 왜 마진의 부호가 뒤집히는지 확인하세요.',
  },
  '/chapter-10/kto-and-ipo': {
    en: 'Compare IPO, KTO, and conservative DPO: finite preference margins, unpaired feedback, label uncertainty, and shared training contracts.',
    ko: 'IPO, KTO, 보수적 DPO의 차이를 비교합니다. 유한한 선호 마진, 짝이 없는 피드백, 레이블 불확실성과 공통 학습 조건을 다룹니다.',
  },
  '/chapter-12/kv-cache-management': {
    en: 'A KV cache stores earlier tokens’ attention keys and values for reuse. Compare outputs in PyTorch and see why a 24 GiB cache fits nine requests at 2.5 GiB each.',
    ko: 'KV 캐시는 이전 토큰의 어텐션 키와 값을 저장해 다음 토큰을 생성할 때 다시 씁니다. PyTorch로 캐시 사용 여부에 따른 출력을 비교하고, 요청당 2.5 GiB일 때 24 GiB에 왜 9개까지 들어가는지 계산해 보세요.',
  },
  '/chapter-12/continuous-batching': {
    en: 'Trace six requests through static and continuous batching, run a Python scheduler, and compare chunked-prefill token budgets, first-token latency, and inter-token delay.',
    ko: '여섯 요청을 처리하는 순서로 연속 배칭을 익히고 Python 스케줄러를 실행합니다. 프리필 청크를 나누면 첫 토큰까지의 시간과 토큰 간 지연이 어떻게 달라지는지 살펴보세요.',
  },
  '/chapter-14/rag-failure-modes-and-operational-design': {
    en: 'Trace an incorrect RAG answer through retrieval, reranking, context packing, and citation. Run six Python cases to see where the evidence disappears.',
    ko: '잘못된 RAG 답변의 근거를 청크 ID로 추적하세요. 여섯 가지 Python 사례로 검색 누락, 재순위화, 문맥 구성, 잘못된 인용을 구분합니다.',
  },
  '/chapter-17/production-evaluation-and-release-gates': {
    en: 'A candidate gains 15 percentage points on its target task. See why a regression blocks deployment, then work through shadow traffic, canaries and rollback.',
    ko: '목표 과제의 성공률이 15%p 올랐는데도 배포를 보류한 사례를 풉니다. 평가를 통과한 모델은 어떤 절차로 트래픽을 받고, 언제 이전 버전으로 되돌리는지 살펴봅니다.',
  },
};
