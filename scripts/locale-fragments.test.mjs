import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { chapters } from '../src/data/chapters.js';
import { localeHref, sharedLocaleFragments } from '../src/utils/locale-fragments.js';

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
    ['/chapter-3/multi-head-attention', 'two-head-calculation', 'MhaVisualizer', 'chapter-3'],
    ['/chapter-5/sparse-vs-dense-models', 'moe-routing-lab', 'MoERouterVisualizer', 'chapter-5'],
    ['/chapter-11/vision-language-bridges', 'visual-token-budget', 'VisionLanguageBridgeVisualizer', 'chapter-11'],
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
    ['/chapter-3/self-attention-mathematics', 'attention-weight-example'],
    ['/chapter-10/dpo', 'reference-relative-example'],
    ['/chapter-12/serving-policies-slos-and-fallbacks', 'streaming-latency-trace'],
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
