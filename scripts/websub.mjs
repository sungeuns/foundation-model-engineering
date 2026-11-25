import { createHash } from 'node:crypto';
import { appendFileSync, readFileSync } from 'node:fs';
import { setTimeout as delay } from 'node:timers/promises';
import { pathToFileURL } from 'node:url';
import { site } from '../src/data/site.js';
import { chapterFeedHub } from '../src/utils/chapter-feed.js';

const base = new URL('/foundation-model-engineering/', site.url);
const feeds = ['feed.xml', 'ko/feed.xml', 'articles.xml', 'ko/articles.xml'];
const digest = bytes => createHash('sha256').update(bytes).digest('hex');

function entries(hashes) {
  const items = Object.entries(hashes);
  for (const [path, hash] of items) {
    if (!feeds.includes(path) || !/^[0-9a-f]{64}$/.test(hash)) throw new Error('Unexpected feed or digest');
  }
  return items;
}

async function publicDigest(path, expected, request, pause) {
  const url = new URL(path, base).href;
  let lastError;
  for (const wait of [0, 3_000, 10_000, 20_000]) {
    if (wait) await pause(wait);
    try {
      const response = await request(url, {
        cache: 'no-cache', redirect: 'error', signal: AbortSignal.timeout(10_000),
      });
      if (response.status === 404 && !expected) return null;
      if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
      const hash = digest(Buffer.from(await response.arrayBuffer()));
      if (!expected || hash === expected) return hash;
      lastError = new Error(`Published bytes still differ from the new build at ${url}`);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

export async function changedFeeds(hashes, request = fetch, pause = delay) {
  const items = entries(hashes);
  const previous = await Promise.all(items.map(([path]) => publicDigest(path, null, request, pause)));
  return Object.fromEntries(items.filter(([, hash], index) => hash !== previous[index]));
}

export async function publishFeeds(hashes, pagesUrl, request = fetch, pause = delay) {
  if (new URL(pagesUrl).href.replace(/\/?$/, '/') !== base.href) throw new Error('Unexpected Pages deployment URL');
  const items = entries(hashes);
  if (!items.length) return;
  // Wait for the public canonical URLs to serve the built bytes before telling the hub.
  await Promise.all(items.map(([path, hash]) => publicDigest(path, hash, request, pause)));
  const body = new URLSearchParams({ 'hub.mode': 'publish' });
  for (const [path] of items) body.append('hub.url', new URL(path, base).href);
  // Retry the public reads above. An ambiguous POST may already have reached the hub.
  const receipt = await request(chapterFeedHub, {
    method: 'POST', body, redirect: 'error', signal: AbortSignal.timeout(20_000),
  });
  if (!receipt.ok) throw new Error(`WebSub hub returned HTTP ${receipt.status}`);
  return `WebSub HTTP ${receipt.status} for ${body.getAll('hub.url').join(', ')}`;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const output = (key, value) => appendFileSync(process.env.GITHUB_OUTPUT, `${key}=${JSON.stringify(value)}\n`);
  switch (process.argv[2]) {
    case 'hash':
      output('hashes', Object.fromEntries(feeds.map(path => [path, digest(readFileSync(`dist/${path}`))])));
      break;
    case 'compare': {
      const changed = await changedFeeds(JSON.parse(process.env.FEED_HASHES));
      if (Object.keys(changed).length) output('changed', changed);
      break;
    }
    case 'publish': {
      const receipt = await publishFeeds(JSON.parse(process.env.FEED_HASHES), process.env.PAGES_URL);
      if (receipt) {
        console.log(receipt);
        appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${receipt}\n`);
      }
      break;
    }
    default:
      throw new Error('Expected hash, compare, or publish');
  }
}
