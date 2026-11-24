import { canonicalKvSearch } from '../components/chapter-12/kv-scenario.mjs';

// These IDs name the same authored exercise in both translations. Do not infer
// counterparts from heading order, translated slugs, or reference numbers.
const lessonFragments = {
  '/chapter-1/symbolism-vs-connectionism': ['logic-gate-lab'],
  '/chapter-3/self-attention-mathematics': ['attention-weight-example'],
  '/chapter-3/multi-head-attention': ['two-head-calculation'],
  '/chapter-4/encoder-only': ['mlm-target-example'],
  '/chapter-4/decoder-only': ['shifted-target-example'],
  '/chapter-4/encoder-decoder': ['cross-attention-example'],
  '/chapter-4/hybrid-prefix-lm': ['prefix-mask-test'],
  '/chapter-5/sparse-vs-dense-models': ['moe-routing-lab'],
  '/chapter-7/tiny-decoder-lab': ['decoder-copy-trace', 'local-decoder-setup'],
  '/chapter-8/continued-pretraining-and-domain-adaptation': ['token-mixture-example'],
  '/chapter-10/dpo': ['reference-relative-example'],
  '/chapter-11/vision-language-bridges': ['visual-token-budget'],
  '/chapter-12/kv-cache-management': ['kv-cache-capacity', 'kv-calculator', 'mixed-request-budget'],
  '/chapter-12/speculative-decoding': ['speculative-sampling-example'],
  '/chapter-12/serving-policies-slos-and-fallbacks': ['streaming-latency-trace'],
  '/chapter-14/advanced-retrieval': ['rrf-candidate-cutoff'],
  '/chapter-14/rag-failure-modes-and-operational-design': ['trace-a-rag-answer'],
  '/chapter-17/commercial-model-benchmarks': ['long-context-cost'],
  '/chapter-17/llm-as-a-judge': ['translation-rubric-example'],
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

export function localeHref(baseHref, hash, sharedFragments, search = '') {
  const scenario = search && sharedFragments.includes('kv-calculator') ? canonicalKvSearch(search) : '';
  const pageHref = baseHref.split('#')[0] + scenario;
  if (!hash.startsWith('#')) return pageHref;
  let id;
  try {
    id = decodeURIComponent(hash.slice(1));
  } catch {
    return pageHref;
  }
  return sharedFragments.includes(id) ? `${pageHref}#${encodeURIComponent(id)}` : pageHref;
}
