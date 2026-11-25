import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { chapters } from '../src/data/chapters.js';
import { localeHref, sharedHeadingAliases, sharedLocaleFragments } from '../src/utils/locale-fragments.js';

const read = file => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const modelIds = JSON.parse(read('src/data/commercial-model-snapshot.json')).models.map(model => model.id);
const routes = chapters.flatMap(chapter => chapter.subs.map(sub => sub.path));
const pages = route => ['', '/ko'].map(locale => read(`src/pages${locale}${route}.mdx`));

test('shared end sections exist in both translations of every canonical chapter', () => {
  assert.deepEqual(sharedLocaleFragments(undefined, modelIds), []);
  for (const route of routes) {
    for (const source of pages(route)) {
      assert.match(source, /^## Quizzes\s*$/m, route);
      assert.match(source, /^## References\s*$/m, route);
    }
  }
});

test('shared exercise IDs belong to the same authored content in both translations', () => {
  const components = [
    ['/chapter-1/symbolism-vs-connectionism', 'logic-gate-lab', 'LogicGateVisualizer', 'chapter-1'],
    ['/chapter-3/multi-head-attention', 'two-head-calculation', 'MhaVisualizer', 'chapter-3'],
    ['/chapter-5/sparse-vs-dense-models', 'moe-routing-lab', 'MoERouterVisualizer', 'chapter-5'],
    ['/chapter-11/vision-language-bridges', 'visual-token-budget', 'VisionLanguageBridgeVisualizer', 'chapter-11'],
    ['/chapter-12/kv-cache-management', 'kv-calculator', 'KVCacheCalculator', 'chapter-12'],
    ['/chapter-17/experimental-design-and-uncertainty', 'release-lab', 'PairedReleaseLab', 'chapter-17'],
  ];
  for (const [route, id, component, chapter] of components) {
    assert.ok(routes.includes(route), route);
    assert.ok(sharedLocaleFragments(route, modelIds).includes(id), route);
    assert.ok(read(`src/components/${chapter}/${component}.tsx`).includes(`id="${id}"`), id);
    for (const source of pages(route)) {
      assert.ok(source.includes(`components/${chapter}/${component}.tsx`), route);
      assert.ok(source.includes(`<${component}`), route);
    }
  }
  for (const [route, id] of [
    ['/chapter-7/data-parallelism', 'dp-ddp-gradient-trace'],
    ['/chapter-11/audio-and-speech-integration', 'scribe-speaker-events'],
    ['/chapter-12/serving-policies-slos-and-fallbacks', 'sarvam-ttft-load'],
    ['/chapter-17/elo-rating-and-leaderboards', 'elo-vote-order'],
    ['/chapter-1/deep-learning-paradigms', 'next-token-loss-example'],
    ['/chapter-4/various-llm-architectures', 'mla-cache-example'],
    ['/chapter-7/flash-attention', 'online-softmax-tiles'],
    ['/chapter-1/bitter-lesson', 'chinchilla-budget-example'],
    ['/chapter-19/probing-classifiers', 'probe-projection-coordinates'],
    ['/chapter-7/zero-redundancy-optimizer', 'zero-shard-ownership'],
    ['/chapter-6/tokenization-science', 'tokenizer-acceptance-probes'],
    ['/chapter-11/vision-language-bridges', 'receipt-grounding'],
    ['/chapter-3/self-attention-mathematics', 'attention-weight-example'],
    ['/chapter-3/self-attention-mathematics', 'batched-padding-example'],
    ['/chapter-3/layer-normalization-residuals', 'normalization-example'],
    ['/chapter-3/layer-normalization-residuals', 'pytorch-normalization-check'],
    ['/chapter-3/complexity-analysis', 'attention-scores-vs-kv-cache'],
    ['/chapter-8/power-law', 'scaling-loss-floor'],
    ['/chapter-4/encoder-only', 'mlm-target-example'],
    ['/chapter-4/decoder-only', 'shifted-target-example'],
    ['/chapter-4/encoder-decoder', 'cross-attention-example'],
    ['/chapter-4/various-llm-architectures', 'glm-54-layer-reuse'],
    ['/chapter-4/various-llm-architectures', 'glm-54-cache-positions'],
    ['/chapter-4/hybrid-prefix-lm', 'prefix-mask-test'],
    ['/chapter-5/expert-parallelism', 'expert-dispatch-lab'],
    ['/chapter-5/case-study', 'dropless-routing-example'],
    ['/chapter-7/tiny-decoder-lab', 'decoder-copy-trace'],
    ['/chapter-7/tiny-decoder-lab', 'local-decoder-setup'],
    ['/chapter-8/continued-pretraining-and-domain-adaptation', 'token-mixture-example'],
    ['/chapter-8/continued-pretraining-and-domain-adaptation', 'tokenizer-perplexity-example'],
    ['/chapter-10/human-feedback-loop', 'feedback-exposure-example'],
    ['/chapter-10/dpo', 'reference-relative-example'],
    ['/chapter-12/kv-cache-management', 'kv-cache-capacity'],
    ['/chapter-12/kv-cache-management', 'mixed-request-budget'],
    ['/chapter-12/kv-cache-management', 'kv-payload-notebook'],
    ['/chapter-12/kv-cache-management', 'kv-batch-padding'],
    ['/chapter-12/paged-attention-vllm', 'paged-kv-addresses'],
    ['/chapter-12/speculative-decoding', 'speculative-sampling-example'],
    ['/chapter-12/serving-policies-slos-and-fallbacks', 'streaming-latency-trace'],
    ['/chapter-13/ptq-vs-qat', 'quantization-grid-example'],
    ['/chapter-13/ptq-vs-qat', 'ernie-expert-weights'],
    ['/chapter-13/quantization-methods', 'weighted-rounding-example'],
    ['/chapter-14/advanced-retrieval', 'rrf-candidate-cutoff'],
    ['/chapter-14/graphrag-and-ontology', 'graph-evidence-example'],
    ['/chapter-16/decision-models-and-selective-prediction', 'calibration-drift-example'],
    ['/chapter-17/production-evaluation-and-release-gates', 'release-gate-example'],
    ['/chapter-17/llm-as-a-judge', 'translation-rubric-example'],
    ['/chapter-17/commercial-model-benchmarks', 'long-context-cost'],
    ['/chapter-17/commercial-model-benchmarks', 'background-completion-cost'],
    ['/chapter-17/commercial-model-benchmarks', 'ling-32-air-context'],
    ['/chapter-2/dawn-of-attention', 'translation-alignment-example'],
    ['/chapter-2/cnns-for-nlp', 'textcnn-filter-example'],
    ['/chapter-3/position-encoding-strategy', 'positional-encoding-grid'],
    ['/chapter-17/academic-benchmarks', 'pass-at-k-example'],
    ['/chapter-14/lexical-to-semantic-search', 'lexical-dense-example'],
    ['/chapter-14/lexical-to-semantic-search', 'multilingual-retrieval-check'],
    ['/chapter-16/agent-reliability-recovery-and-guardrails', 'lost-ticket-receipt'],
    ['/chapter-14/rag-failure-modes-and-operational-design', 'trace-a-rag-answer'],
  ]) {
    assert.ok(sharedLocaleFragments(route, modelIds).includes(id), route);
    for (const source of pages(route)) assert.ok(source.includes(`<a id="${id}"></a>`), route);
  }
});

test('model fragments share record identity, rather than guessing at every model-prefixed ID', () => {
  const route = '/chapter-17/commercial-model-benchmarks';
  const fragments = sharedLocaleFragments(route, modelIds);
  for (const id of modelIds) {
    assert.ok(fragments.includes(`model-${id}`));
    for (const source of pages(route)) assert.ok(source.includes(`<a id="model-${id}" href="#model-${id}">`), id);
  }
  assert.equal(localeHref('/ko/benchmarks/', '#model-not-in-the-snapshot', fragments), '/ko/benchmarks/');
  assert.ok(!sharedLocaleFragments('/chapter-11/vision-language-bridges', modelIds).includes('model-glm-54'));
});

test('switching editions preserves a valid shared KV calculation only on its lesson', () => {
  const fragments = sharedLocaleFragments('/chapter-12/kv-cache-management');
  const page = '/preview/ko/chapter-12/kv-cache-management/';
  const query = '?kv=1&batch=9&sequence=8192&generated=2048&layers=80&heads=8&dimension=128&precision=2&budget=24';
  for (const hash of ['', '#kv-calculator', '#quizzes']) {
    assert.equal(localeHref(page, hash, fragments, query + '&utm_source=example'), page + query + hash);
  }
  assert.equal(localeHref(page, '#kv-calculator', fragments, query + '&budget=12'), page + '#kv-calculator');
  const other = '/preview/ko/chapter-3/multi-head-attention/';
  assert.equal(localeHref(other, '#two-head-calculation', sharedLocaleFragments('/chapter-3/multi-head-attention'), query), other + '#two-head-calculation');
});

test('locale links keep deployment paths and only verified fragments as the location changes', () => {
  const fragments = sharedLocaleFragments('/chapter-17/commercial-model-benchmarks', modelIds);
  for (const base of ['', '/foundation-model-engineering', '/preview']) {
    for (const locale of ['', '/ko']) {
      const page = `${base}${locale}/chapter-17/commercial-model-benchmarks/`;
      assert.equal(localeHref(page, '#model-glm-54', fragments), `${page}#model-glm-54`);
      assert.equal(localeHref(page, '#%71uizzes', fragments), `${page}#quizzes`);
      assert.equal(localeHref(page, '#references', fragments), `${page}#references`);
      // These may exist in one translation, but do not establish a counterpart.
      for (const hash of ['', '#ref-1', '#3-what-the-latest-releases-change', '#_r1R_0_-title', '#%', '#%E0%A4%A']) {
        assert.equal(localeHref(page, hash, fragments), page, hash);
      }
      assert.equal(localeHref(`${page}#quizzes`, '#references', fragments), `${page}#references`);
      assert.equal(localeHref(`${page}#references`, '', fragments), page);
    }
  }
});

test('a shared release fixture survives translation only on its own lesson', () => {
  const fragments = sharedLocaleFragments('/chapter-17/experimental-design-and-uncertainty');
  const page = '/preview/ko/chapter-17/experimental-design-and-uncertainty/';
  for (const scenario of ['gain', 'regression', 'uncertain', 'missing']) {
    const search = `?tracking=abc&scenario=${scenario}`;
    assert.equal(localeHref(page, '#release-lab', fragments, search), `${page}?scenario=${scenario}#release-lab`);
  }
  for (const search of ['?scenario=other', '?scenario=missing&scenario=gain', '?scenario=']) {
    assert.equal(localeHref(page, '#release-lab', fragments, search), page + '#release-lab');
  }
  assert.equal(localeHref('/ko/', '', [], '?scenario=gain'), '/ko/');
});

test('a previously shared heading URL switches to the exercise in the other edition', () => {
  const route = '/chapter-3/self-attention-mathematics';
  const shared = sharedLocaleFragments(route);
  // Minimal element siblings. Only empty, unlinked markers belong to the heading.
  const marker = (id, previousElementSibling) => ({
    id, previousElementSibling, matches: selector => selector === 'a[id]:empty:not([href])',
  });
  const older = marker('이전-제목');
  const exercise = marker('attention-weight-example', older);
  const prose = { matches: () => false, previousElementSibling: exercise };
  const local = '예제-어텐션-가중치-행렬';
  const aliases = sharedHeadingAliases([
    { id: local, previousElementSibling: exercise },
    { id: 'other-topic', previousElementSibling: prose },
  ], shared);
  const otherEdition = '/book/chapter-3/self-attention-mathematics/';
  for (const id of [local, older.id, exercise.id]) {
    assert.equal(localeHref(otherEdition, '#' + encodeURIComponent(id), shared, '', aliases),
      otherEdition + '#attention-weight-example');
  }
  assert.equal(localeHref(otherEdition, '#other-topic', shared, '', aliases), otherEdition);
  assert.equal(localeHref(otherEdition, '#ref-1', shared, '', aliases), otherEdition);
});
