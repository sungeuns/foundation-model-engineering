import assert from 'node:assert/strict';
import test from 'node:test';
import { changedRoutes, submit } from './indexnow.mjs';

const lesson = 'chapter-17/commercial-model-benchmarks';
const proof = 'fixture';
const base = 'https://sungeuns.github.io/foundation-model-engineering/';

test('homepages and inventoried lesson sources contribute canonical routes', () => {
  const unrelated = ['README.md', 'src/pages/feed.xml.js', 'src/pages/chapter-17/unknown.mdx'];
  assert.deepEqual(changedRoutes(unrelated), []);
  assert.deepEqual(changedRoutes([
    ...unrelated, 'src/pages/index.astro', 'src/pages/ko/index.astro',
    `src/pages/${lesson}.mdx`, `src/pages/ko/${lesson}.mdx`, `src/pages/${lesson}.mdx`,
  ]), ['', 'ko/', `${lesson}/`, `ko/${lesson}/`]);
});

test('a short article translation announces its own URL and the player reaches both editions', () => {
  const article = 'articles/whisper-sample-rate/';
  const chapter = 'chapter-11/audio-and-speech-integration/';
  assert.deepEqual(changedRoutes(['src/pages/articles/whisper-sample-rate.astro', 'src/data/articles/whisper-sample-rate.md']), [article]);
  assert.deepEqual(changedRoutes(['src/data/articles/whisper-sample-rate.ko.md']), ['ko/' + article]);
  assert.deepEqual(changedRoutes(['src/components/chapter-11/SampleRateListening.astro']), [article, 'ko/' + article, chapter, 'ko/' + chapter]);
});

test('new short reads notify only their changed language and keep their own canonical URLs', () => {
  const files = ['src/data/articles/loop-cache-storage.ko.md', 'src/pages/articles/length-bucketing.astro',
    'src/data/articles/length-bucketing.md', 'src/pages/ko/articles/loop-cache-storage.astro'];
  assert.deepEqual(changedRoutes(files), ['ko/articles/loop-cache-storage/', 'articles/length-bucketing/']);
});

test('edition-specific catalog edits select one URL and shared inputs select both', () => {
  assert.deepEqual(changedRoutes(['src/pages/labs/index.astro']), ['labs/']);
  assert.deepEqual(changedRoutes(['src/pages/ko/labs/index.astro']), ['ko/labs/']);
  for (const shared of [
    'src/components/TeachingLabs.astro', 'src/data/teaching-labs.js',
    'src/data/lab-datasets.js', 'scripts/verify-dp-ddp-gradients.py',
  ]) {
    assert.deepEqual(changedRoutes([shared, 'src/pages/labs/index.astro', shared]), ['labs/', 'ko/labs/']);
  }
  assert.deepEqual(changedRoutes(['src/pages/labs/2026-11/other.csv.js', 'public/labs/unlisted.py']), []);
});

test('one push that changes featured links, the catalog and a bilingual lesson selects six pages', () => {
  const featured = 'src/components/FeaturedLessons.astro';
  assert.deepEqual(changedRoutes([featured]), ['', 'ko/']);
  const audio = 'chapter-11/audio-and-speech-integration';
  assert.deepEqual(changedRoutes([
    featured, 'src/pages/index.astro', 'src/data/teaching-labs.js', 'src/pages/ko/labs/index.astro',
    `src/pages/${audio}.mdx`, `src/pages/ko/${audio}.mdx`, 'src/layouts/BookLayout.astro',
  ]), ['', 'ko/', 'labs/', 'ko/labs/', `${audio}/`, `ko/${audio}/`]);
});

test('retrying the proof read results in one POST with project-scoped canonical URLs', async () => {
  const calls = [];
  const fetchRequest = async (url, options) => {
    calls.push({ url, options });
    if (calls.length === 1) return new Response('old content');
    if (calls.length === 2) return new Response(proof);
    return new Response(null, { status: 202 });
  };
  const urls = [base, `${base}ko/${lesson}/`, `${base}labs/`, `${base}ko/labs/`];
  const routes = ['', `ko/${lesson}/`, 'labs/', 'ko/labs/', ''];
  assert.deepEqual(await submit(routes, proof, fetchRequest, async () => {}), { status: 202, urlList: urls });
  assert.equal(calls.length, 3);
  const keyLocation = `${base}${proof}.txt`;
  assert.equal(calls[0].url, keyLocation);
  assert.equal(calls[1].url, keyLocation);
  assert.equal(calls[2].url, 'https://api.indexnow.org/indexnow');
  assert.equal(calls[2].options.method, 'POST');
  assert.deepEqual(JSON.parse(calls[2].options.body), { host: 'sungeuns.github.io', key: proof, keyLocation, urlList: urls });
});

test('an invalid route or unavailable proof prevents submission, and a rejected POST is not retried', async () => {
  await assert.rejects(submit(['https://elsewhere.example/'], proof, assert.fail), /Unexpected page route/);
  const missing = async (_url, options) => {
    assert.equal(options.method, undefined);
    return new Response(null, { status: 404 });
  };
  await assert.rejects(submit([''], proof, missing, async () => {}), /could not be verified/);

  let posts = 0;
  const rejected = async (_url, options) => {
    if (options.method !== 'POST') return new Response(proof);
    posts += 1;
    return new Response(null, { status: 429 });
  };
  assert.equal((await submit([''], proof, rejected)).status, 429);
  assert.equal(posts, 1);
});

test('a timeline-only change selects both lessons using it in both languages', () => {
  const steps = 'src/components/chapter-12/ContinuousBatchingVisualizer.tsx';
  const timeline = 'src/components/chapter-12/SchedulingVisualizer.tsx';
  const batching = ['chapter-12/continuous-batching/', 'ko/chapter-12/continuous-batching/'];
  assert.deepEqual(changedRoutes([steps]), batching);
  assert.deepEqual(changedRoutes([steps, timeline]), [
    ...batching, 'chapter-12/long-context-serving/', 'ko/chapter-12/long-context-serving/',
  ]);
});


test('a new serving EPUB reaches the landing pages and the six lesson downloads', () => {
  const routes = changedRoutes(['src/data/site.js']);
  const lessons = ['kv-cache-management', 'continuous-batching', 'serving-policies-slos-and-fallbacks'];
  assert.deepEqual(new Set(routes), new Set(['labs/', 'ko/labs/', '', 'ko/', ...lessons.flatMap(slug =>
    [`chapter-12/${slug}/`, `ko/chapter-12/${slug}/`])]));
});
