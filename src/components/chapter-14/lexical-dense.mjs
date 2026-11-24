// The three feature groups are deliberately supplied by hand for this exercise.
export const examples = {
  en: {
    documents: ['Device activation guide', 'Device activation XJ-992-B', 'Patch punctured wheels', 'Machine learning textbook'],
    groups: [['flat', 'tire', 'punctured', 'wheels'], ['activation'], ['ai', 'book', 'learning', 'textbook']],
    presets: ['flat tire', 'XJ-992-B', 'activation XJ-992-B', 'AI book'],
  },
  ko: {
    documents: ['기기 등록 안내', '기기 등록 XJ-992-B', '바퀴 구멍 수선', '기계 학습 교재'],
    groups: [['타이어', '펑크', '바퀴', '구멍'], ['등록'], ['ai', '책', '학습', '교재']],
    presets: ['타이어 펑크', 'XJ-992-B', '등록 XJ-992-B', 'AI 책'],
  },
};

function terms(text) {
  return text.normalize('NFKC').toLowerCase().match(/[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*/gu) ?? [];
}

function features(tokens, groups) {
  return groups.map(group => tokens.filter(token => group.includes(token)).length);
}

function cosine(a, b) {
  const denom = Math.hypot(...a) * Math.hypot(...b);
  if (!denom) return null;
  return a.reduce((sum, x, i) => sum + x * b[i], 0) / denom;
}

export function compareTitles(locale, query) {
  const { documents, groups } = examples[locale];
  const corpus = documents.map(terms);
  const averageLength = corpus.reduce((sum, doc) => sum + doc.length, 0) / corpus.length;
  const tokens = terms(query);
  const queryVector = features(tokens, groups);
  const queryTerms = [...new Set(tokens)].map(term => {
    const df = corpus.filter(doc => doc.includes(term)).length;
    return { term, idf: Math.log1p((corpus.length - df + 0.5) / (df + 0.5)) };
  });
  const k1 = 1.2, b = 0.75;
  const rows = corpus.map((doc, i) => {
    let bm25 = 0;
    const lengthFactor = k1 * (1 - b + b * doc.length / averageLength);
    for (const { term, idf } of queryTerms) {
      const tf = doc.filter(word => word === term).length;
      bm25 += idf * tf * (k1 + 1) / (tf + lengthFactor);
    }
    const vector = features(doc, groups);
    return { id: 'ABCD'[i], title: documents[i], vector, bm25, cosine: cosine(queryVector, vector) };
  });
  return { tokens, queryVector, rows };
}
