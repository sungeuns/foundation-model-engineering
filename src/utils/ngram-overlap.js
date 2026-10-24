export function ngrams(text, n) {
  const tokens = text.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/u).filter(Boolean);
  return new Set(Array.from({ length: Math.max(0, tokens.length - n + 1) }, (_, i) => tokens.slice(i, i + n).join(' ')));
}
export function ngramOverlap(a, b, n) {
  const left = ngrams(a, n), right = ngrams(b, n);
  const intersection = [...left].filter(x => right.has(x));
  const union = new Set([...left, ...right]);
  return { left: [...left], right: [...right], intersection, unionSize: union.size, jaccard: union.size ? intersection.length / union.size : null };
}
