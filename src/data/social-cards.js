// Focused previews for independently useful lessons. Other pages keep the book cover.
// Paths are site-root-relative; the layout applies the deployment base.
export const socialCards = {
  '/chapter-3/self-attention-mathematics': {
    en: {
      image: '/social/attention-weights-en.png',
      alt: 'For the query “cat” in “The cat sat here”, the four attention weights in this example are 23.4%, 47.5%, 23.4% and 5.7%. With a causal mask they become 33.0%, 67.0%, 0% and 0%. The weighted output changes from [0.645, 1.241] to [0.330, 1.340].',
    },
    ko: {
      image: '/social/attention-weights-ko.png',
      alt: '예제 문장 “The cat sat here”에서 cat의 어텐션 가중치는 차례로 23.4%, 47.5%, 23.4%, 5.7%입니다. 인과 마스크를 켜면 33.0%, 67.0%, 0%, 0%가 되고, 출력 벡터는 [0.645, 1.241]에서 [0.330, 1.340]으로 바뀝니다.',
    },
  },
  '/chapter-4/hybrid-prefix-lm': {
    en: {
      image: '/social/prefix-mask-en.png',
      alt: 'PyTorch prefix-mask example with seven values from 1 to 7. T1 should read only P1, P2, P3 and T1. Raising T2 from 5 to 105 leaves T1 at 2.5 with a Boolean mask. Passing the same ones and zeros as floats changes T1 from 3.257 to 10.465.',
    },
    ko: {
      image: '/social/prefix-mask-ko.png',
      alt: '값이 1부터 7까지인 PyTorch 접두사 마스크 예제. T1에서 읽을 수 있는 위치는 P1, P2, P3, T1입니다. T2를 5에서 105로 올리면 불리언 마스크에서는 T1 출력이 2.5로 유지됩니다. 같은 1과 0을 실수로 넘기면 T1 출력이 3.257에서 10.465로 바뀝니다.',
    },
  },
  '/chapter-7/tiny-decoder-lab': {
    en: {
      image: '/social/tiny-decoder-en.png',
      alt: 'CPU PyTorch lab: train a tiny decoder, check causal masking, remove past context, and replay a saved checkpoint on a synthetic copying task.',
    },
    ko: {
      image: '/social/tiny-decoder-ko.png',
      alt: 'CPU PyTorch 실습: 작은 디코더로 합성 토큰 복사 과제를 학습하고 인과 마스크, 과거 문맥 제거, 체크포인트 재개를 검증합니다.',
    },
  },
  '/chapter-8/continued-pretraining-and-domain-adaptation': {
    en: {
      image: '/social/token-mixture-en.png',
      alt: 'Two runs each predict 112,000 tokens. Reading 80 work orders once supplies 32,000 domain tokens (28.6%). Reading the same orders twice supplies 64,000 (57.1%). Replay text supplies the remaining 80,000 and 48,000 tokens respectively.',
    },
    ko: {
      image: '/social/token-mixture-ko.png',
      alt: '두 학습 모두 예측 대상은 112,000토큰입니다. 정비 기록 80건을 한 번 읽으면 32,000토큰(28.6%), 같은 기록을 두 번 읽으면 64,000토큰(57.1%)이 정비 기록에서 나옵니다. 나머지 80,000토큰과 48,000토큰은 각각 리플레이 문서에서 옵니다.',
    },
  },
  '/chapter-11/vision-language-bridges': {
    en: {
      image: '/social/vision-bridge-en.png',
      alt: 'Toy calculation for one 224 × 224 pixel image with 14 × 14 pixel patches and 32 prompt positions: patch projection uses 288 decoder positions; resampling with cross-attention uses 32 decoder positions and 64 separate visual memory slots.',
    },
    ko: {
      image: '/social/vision-bridge-ko.png',
      alt: '224 × 224픽셀 이미지 한 장, 14 × 14픽셀 패치, 프롬프트 32자리로 계산한 예제입니다. 패치별 투영은 디코더 288자리를, 리샘플링과 교차 어텐션은 디코더 32자리와 별도 시각 메모리 64슬롯을 사용합니다.',
    },
  },
  '/chapter-12/kv-cache-management': {
    en: {
      image: '/social/kv-budget-en.png',
      alt: 'Dense KV payload under a 24 GiB cache budget. Nine prompts of 8,192 tokens need 22.5 GiB, ten need 25 GiB, and nine sequences grown to 10,240 tokens need 28.125 GiB.',
    },
    ko: {
      image: '/social/kv-budget-ko.png',
      alt: 'KV 캐시 예산은 24 GiB입니다. 8,192토큰 프롬프트 9개에는 22.5 GiB, 10개에는 25 GiB가 필요합니다. 9개가 각각 10,240토큰까지 늘어나면 28.125 GiB입니다.',
    },
  },
  '/chapter-12/serving-policies-slos-and-fallbacks': {
    en: {
      image: '/social/streaming-latency-en.png',
      alt: 'Two illustrative streams each deliver five tokens between 100 and 500 ms after submission. Both have a 100 ms TTFT and a mean gap of 100 ms. Stream A delivers a token every 100 ms. Stream B delivers four tokens 10 ms apart, then waits 370 ms for its last token.',
    },
    ko: {
      image: '/social/streaming-latency-ko.png',
      alt: '두 예시 응답에서 토큰 다섯 개가 요청 후 100~500ms 사이에 도착합니다. 둘 다 첫 토큰 지연과 이후 평균 토큰 간격이 100ms입니다. A에서는 토큰이 100ms마다 도착합니다. B에서는 토큰 네 개가 10ms 간격으로 도착한 뒤 마지막 토큰까지 370ms를 기다립니다.',
    },
  },
  '/chapter-12/length-bucketing-lab': {
    en: {
      image: '/social/length-bucketing-en.png',
      alt: 'Measured SmolLM2-135M prefill KV cache for three pairs of prompts. In arrival order the pairs use 990, 900 and 810 KiB. Grouped by length they use 360, 810 and 990 KiB. Padding falls from 18 positions to 6. The largest pair uses 990 KiB in both orders.',
    },
    ko: {
      image: '/social/length-bucketing-ko.png',
      alt: 'SmolLM2-135M으로 프롬프트를 두 개씩 처리한 뒤 측정한 프리필 KV 캐시입니다. 도착 순서에서는 배치마다 990, 900, 810 KiB를 쓰고, 길이 순서에서는 360, 810, 990 KiB를 씁니다. 패딩은 총 18자리에서 6자리로 줄고 두 경우 모두 가장 큰 배치는 990 KiB를 씁니다.',
    },
  },
  '/chapter-14/lexical-to-semantic-search': {
    en: {
      image: '/social/lexical-dense-en.png',
      alt: 'Four support titles, query “activation XJ-992-B”. BM25 scores “Device activation guide” at 0.693 and “Device activation XJ-992-B” at 1.897. Both have cosine similarity 1 with the query because the three hand-built topic features omit the code.',
    },
    ko: {
      image: '/social/lexical-dense-ko.png',
      alt: '문서 제목 네 개에서 “등록 XJ-992-B”를 검색했습니다. BM25 점수는 “기기 등록 안내”가 0.693, “기기 등록 XJ-992-B”가 1.897입니다. 직접 정한 세 가지 주제 특성에는 코드가 없어 두 제목 모두 질의와의 코사인 유사도가 1입니다.',
    },
  },
  '/chapter-14/advanced-retrieval': {
    en: {
      image: '/social/rrf-cutoff-en.png',
      alt: 'Constructed RRF example with equal weights and k = 60. One hit per retriever leaves A and B tied and the 404 log C absent. At two hits, both return C second. Its 2/62 beats the 1/61 from either first-place hit.',
    },
    ko: {
      image: '/social/rrf-cutoff-ko.png',
      alt: '가중치가 같고 k = 60인 역순위 융합 예제입니다. 검색기마다 한 건씩 받으면 A와 B가 공동 1위이고 장애 로그 C는 빠집니다. 두 건씩 받으면 양쪽에서 2위인 C가 2/62점을 얻어 1/61점인 A와 B를 앞섭니다.',
    },
  },
  '/chapter-14/rag-failure-modes-and-operational-design': {
    en: {
      image: '/social/rag-trace-en.png',
      alt: 'Fictional refund case. The current 7-day renewal rule in v3 ranked eighth among 20 retrieved passages. The model received only the top five and cited the old 30-day rule from v2.',
    },
    ko: {
      image: '/social/rag-trace-ko.png',
      alt: '가상의 갱신 환불 사례입니다. 검색 후보 20개 중 현행 v3의 7일 규정은 8위였습니다. 모델은 상위 5개만 받아 그 안에 남은 v2의 옛 30일 규정을 인용했습니다.',
    },
  },
  '/chapter-17/experimental-design-and-uncertainty': {
    en: {
      image: '/social/paired-evaluation-en.png',
      alt: 'Python evaluation lab: compare paired cases, estimate cluster uncertainty, and distinguish Pass, Review, and Block using synthetic offline gates.',
    },
    ko: {
      image: '/social/paired-evaluation-ko.png',
      alt: 'Python 평가 실습: 같은 사례의 결과를 대응 비교하고 군집 단위 불확실성을 계산해 합성 오프라인 기준의 통과·재검토·차단을 구분합니다.',
    },
  },
};
