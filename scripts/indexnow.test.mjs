import assert from 'node:assert/strict';
import test from 'node:test';
import { changedRoutes, submit } from './indexnow.mjs';

const lesson = 'chapter-17/commercial-model-benchmarks';
const proof = 'fixture';
const base = 'https://sungeuns.github.io/foundation-model-engineering/';

test('only tracked homepage and inventoried lesson sources contribute canonical routes', () => {
  const unrelated = ['README.md', 'src/pages/feed.xml.js', 'src/pages/chapter-17/unknown.mdx'];
  assert.deepEqual(changedRoutes(unrelated), []);
  assert.deepEqual(changedRoutes([
    ...unrelated, 'src/pages/index.astro', 'src/pages/ko/index.astro',
    `src/pages/${lesson}.mdx`, `src/pages/ko/${lesson}.mdx`, `src/pages/${lesson}.mdx`,
  ]), ['', 'ko/', `${lesson}/`, `ko/${lesson}/`]);
});

test('retrying the proof read results in one POST with project-scoped canonical URLs', async () => {
  const calls = [];
  const fetchRequest = async (url, options) => {
    calls.push({ url, options });
    if (calls.length === 1) return new Response('old content');
    if (calls.length === 2) return new Response(proof);
    return new Response(null, { status: 202 });
  };
  const urls = [base, `${base}ko/${lesson}/`];
  const routes = ['', `ko/${lesson}/`, ''];
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
