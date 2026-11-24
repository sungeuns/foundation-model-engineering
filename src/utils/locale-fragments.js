// These IDs name the same authored exercise in both translations. Do not infer
// counterparts from heading order, translated slugs, or reference numbers.
const lessonFragments = {
  '/chapter-5/sparse-vs-dense-models': ['moe-routing-lab'],
  '/chapter-10/dpo': ['reference-relative-example'],
  '/chapter-11/vision-language-bridges': ['visual-token-budget'],
  '/chapter-12/serving-policies-slos-and-fallbacks': ['streaming-latency-trace'],
  '/chapter-14/rag-failure-modes-and-operational-design': ['trace-a-rag-answer'],
  '/chapter-17/experimental-design-and-uncertainty': ['release-lab'],
};

// chapterPath comes from the canonical chapter inventory, not the browser URL.
// Model IDs come from the snapshot that supplies both translated profile tables.
export function sharedLocaleFragments(chapterPath, modelIds = []) {
  if (!chapterPath) return [];
  const models = chapterPath === '/chapter-17/commercial-model-benchmarks'
    ? modelIds.map(id => `model-${id}`) : [];
  return ['quizzes', 'references', ...(lessonFragments[chapterPath] || []), ...models];
}

export function localeHref(baseHref, hash, sharedFragments) {
  const pageHref = baseHref.split('#')[0];
  if (!hash.startsWith('#')) return pageHref;
  let id;
  try {
    id = decodeURIComponent(hash.slice(1));
  } catch {
    return pageHref;
  }
  return sharedFragments.includes(id) ? `${pageHref}#${encodeURIComponent(id)}` : pageHref;
}
