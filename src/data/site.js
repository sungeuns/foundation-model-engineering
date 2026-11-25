export const authorName = { given: 'Seongeun', family: 'So' };

export const whisperArticlePath = '/articles/whisper-sample-rate';

export const labsTitle = { en: 'Hands-on labs and teaching materials', ko: '실습과 수업 자료' };

export const site = {
  author: `${authorName.given} ${authorName.family}`,
  url: 'https://sungeuns.github.io',
  titles: {
    en: 'Foundation Model Engineering',
    ko: '파운데이션 모델 엔지니어링',
  },
  descriptions: {
    en: 'A free English and Korean textbook on foundation models. Train a tiny decoder on a CPU, trace evidence in a RAG answer, and test whether a model is ready to ship.',
    ko: 'CPU로 작은 디코더를 학습하고, RAG 답변의 근거를 추적하고, 모델을 배포해도 될지 평가해 보세요. 학습·서빙·평가를 실습으로 익히는 무료 한영 교재입니다.',
  },
};

const servingGuideRelease = 'https://github.com/sungeuns/foundation-model-engineering/releases/download/serving-guide-2026-11-r3';
export const servingGuide = {
  lessons: [
    '/chapter-12/kv-cache-management',
    '/chapter-12/continuous-batching',
    '/chapter-12/serving-policies-slos-and-fallbacks',
  ],
  downloads: {
    en: `${servingGuideRelease}/llm-serving-en-r3.epub`,
    ko: `${servingGuideRelease}/llm-serving-ko-r3.epub`,
  },
};
