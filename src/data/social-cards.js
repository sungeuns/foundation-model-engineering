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
