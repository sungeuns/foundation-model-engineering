import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import test from 'node:test';
import { changedFeeds, publishFeeds } from './websub.mjs';
import { chapterFeedHub } from '../src/utils/chapter-feed.js';

const base = 'https://sungeuns.github.io/foundation-model-engineering/';
const hash = text => createHash('sha256').update(text).digest('hex');
const built = { 'feed.xml': hash('English revision'), 'ko/feed.xml': hash('한국어 수정') };
const noWait = async () => {};

test('compare actual feed bytes so one-language edits, new feeds and unchanged rebuilds are distinguished', async () => {
  const current = url => new Response(url.endsWith('/ko/feed.xml') ? '한국어 수정' : 'English revision');
  assert.deepEqual(await changedFeeds(built, current), {});
  const changedEnglish = { ...built, 'feed.xml': hash('Next English revision') };
  assert.deepEqual(await changedFeeds(changedEnglish, current), { 'feed.xml': changedEnglish['feed.xml'] });
  assert.deepEqual(await changedFeeds(built, () => new Response(null, { status: 404 })), built);
  await assert.rejects(changedFeeds(built, () => new Response(null, { status: 503 }), noWait), /503/);
});

test('announce both verified canonical feed URLs in one form POST, then skip an unchanged rerun', async () => {
  const posts = [];
  const waits = [];
  let englishReads = 0;
  const request = async (url, options) => {
    if (url === chapterFeedHub) {
      posts.push(new Request(url, options));
      return new Response(null, { status: 204 });
    }
    if (url === base + 'feed.xml' && ++englishReads === 1) return new Response('old edge copy');
    return new Response(url === base + 'ko/feed.xml' ? '한국어 수정' : 'English revision');
  };
  const receipt = await publishFeeds(built, base, request, async ms => waits.push(ms));
  assert.match(receipt, /WebSub HTTP 204/);
  assert.deepEqual(waits, [3000]);
  assert.equal(posts.length, 1);
  assert.equal(posts[0].method, 'POST');
  assert.match(posts[0].headers.get('content-type'), /^application\/x-www-form-urlencoded/);
  const body = await posts[0].formData();
  assert.equal(body.get('hub.mode'), 'publish');
  assert.deepEqual(body.getAll('hub.url'), [base + 'feed.xml', base + 'ko/feed.xml']);
  await publishFeeds(await changedFeeds(built, request), base, request);
  assert.equal(posts.length, 1);
});

test('failed verification never publishes and a failed or ambiguous hub response is not sent twice', async () => {
  let posts = 0;
  const english = { 'feed.xml': built['feed.xml'] };
  const stale = () => new Response('old');
  await assert.rejects(publishFeeds(english, base, (url, options) => {
    assert.notEqual(options.method, 'POST');
    return stale();
  }, noWait), /Published bytes still differ/);
  for (const failure of ['status', 'timeout']) {
    await assert.rejects(publishFeeds(english, base, (url, options) => {
      if (options.method !== 'POST') return new Response('English revision');
      posts++;
      if (failure === 'timeout') throw new Error('deadline exceeded');
      return new Response(null, { status: 429 });
    }, noWait), /429|deadline exceeded/);
  }
  assert.equal(posts, 2);
  await assert.rejects(publishFeeds(english, 'https://example.com/'), /Unexpected Pages/);
  await assert.rejects(publishFeeds({ 'other.xml': built['feed.xml'] }, base), /Unexpected chapter feed/);
});
