// Keep search snippets separate from chapter prose so editorial work can proceed
// independently. A chapter's own frontmatter description always takes priority.
export const searchDescriptions = {
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
