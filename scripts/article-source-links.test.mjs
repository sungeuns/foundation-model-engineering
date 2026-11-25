import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const dist = process.env.SEARCH_DIST_DIR || 'dist';
const site = 'https://sungeuns.github.io/foundation-model-engineering/';
const repository = 'https://github.com/sungeuns/foundation-model-engineering/blob/';
const scripts = {
  'loop-cache-storage': 'loop_cache.py',
  'length-bucketing': 'kv_batch_bucketing.py',
  'whisper-sample-rate': 'whisper_sample_rate.py',
};

for (const prefix of ['', 'ko/']) {
  test(`the ${prefix || 'en'} short reads open from home and carry the same code permalinks as the feed`, () => {
    const xml = readFileSync(join(dist, prefix, 'articles.xml'), 'utf8');
    const articles = [...xml.matchAll(/<content:encoded>([\s\S]*?)<\/content:encoded>/g)].map(match => match[1]);
    const home = readFileSync(join(dist, prefix, 'index.html'), 'utf8');
    const shortReads = home.match(/<section\b[^>]*\baria-labelledby="short-reads"[^>]*>([\s\S]*?)<\/section>/)?.[1];
    assert.ok(shortReads);
    for (const [slug, file] of Object.entries(scripts)) {
      const route = prefix + 'articles/' + slug + '/';
      assert.ok(shortReads.includes('href="' + new URL(route, site).pathname + '"'), route);
      const page = readFileSync(join(dist, route, 'index.html'), 'utf8');
      const feedMatches = articles.filter(article => article.includes(site + 'labs/' + file));
      assert.equal(feedMatches.length, 1, file);
      const links = [...feedMatches[0].matchAll(/https:\/\/github\.com\/sungeuns\/foundation-model-engineering\/blob\/[a-f0-9]{40}\/public\/labs\/[\w.-]+#L\d+(?:-L\d+)?/g)];
      const source = links.find(([link]) => link.includes('/public/labs/' + file + '#L'));
      assert.ok(source, file);
      assert.ok(page.includes('href="' + source[0] + '"'), route);
    }
  });
}

test('both Whisper articles show the recorded transcriptions and link to the scoring code', () => {
  const output = 'labs/2026-11/whisper-sample-rate.json';
  const { cases } = JSON.parse(readFileSync(join(dist, output), 'utf8'));
  for (const lang of ['', 'ko/']) {
    const page = readFileSync(join(dist, lang, 'articles/whisper-sample-rate/index.html'), 'utf8');
    for (const sample of cases) {
      assert.ok(page.includes(sample.first_five_words), sample.name);
    }
    assert.ok(page.includes('href="' + site + output + '"'));
    assert.ok(page.includes('href="' + repository));
    assert.match(page, /\/public\/labs\/whisper_sample_rate\.py#L\d+/);
  }
});
