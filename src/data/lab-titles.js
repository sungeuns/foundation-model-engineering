// Component headings are visible to readers but absent from the MDX heading list.
export const kvCalculatorTitle = { en: 'KV cache calculator', ko: 'KV 캐시 계산기' };
export const releaseLabTitle = { en: 'Release decision lab', ko: '배포 판단 실습' };
export const sampleRateListeningTitle = {
  en: 'Hear what a sample-rate error sounds like',
  ko: '샘플링 속도를 잘못 지정하면 어떻게 들릴까?',
};

export const chapterLabs = {
  '/chapter-11/audio-and-speech-integration': { id: 'sample-rate-listen', title: sampleRateListeningTitle },
  '/chapter-12/kv-cache-management': { id: 'kv-calculator', title: kvCalculatorTitle },
  '/chapter-17/experimental-design-and-uncertainty': { id: 'release-lab', title: releaseLabTitle },
};
