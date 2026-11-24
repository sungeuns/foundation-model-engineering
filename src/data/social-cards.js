// Focused previews for independently useful lessons. Other pages keep the book cover.
// Paths are site-root-relative; the layout applies the deployment base.
export const socialCards = {
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
