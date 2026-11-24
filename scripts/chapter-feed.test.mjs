import assert from 'node:assert/strict';
import test from 'node:test';
import { chapterFeed, chapterFeedHub } from '../src/utils/chapter-feed.js';
import { chapters } from '../src/data/chapters.js';

const subs = chapters.flatMap(chapter => chapter.subs);
const options = { lang: 'en', basePath: '/foundation-model-engineering' };
const revision = (timestamp, commit = 'a'.repeat(40), order = 0) => ({ timestamp, commit, order });

test('chapter feeds never invent edits when Git revisions are unavailable', () => {
  const xml = chapterFeed({ ...options, revisions: new Map() });
  assert.doesNotMatch(xml, /<item>|<pubDate>|<lastBuildDate>/);
  assert.match(xml, /<language>en<\/language>/);
  assert.match(xml, /href="https:\/\/sungeuns.github.io\/foundation-model-engineering\/feed.xml"/);
});

test('feeds use locale-specific revisions and real timestamps in newest-first order', () => {
  const revisions = new Map([
    [`src/pages${subs[0].path}.mdx`, revision('2026-11-15T12:00:00.000Z')],
    [`src/pages${subs[1].path}.mdx`, revision('2026-11-17T16:45:30.000Z')],
    [`src/pages/ko${subs[0].path}.mdx`, revision('2026-11-16T03:00:00.000Z')],
  ]);
  const en = chapterFeed({ ...options, revisions });
  assert.equal([...en.matchAll(/<item>/g)].length, 2);
  assert.ok(en.indexOf(`${subs[1].path}/#revision-`) < en.indexOf(`${subs[0].path}/#revision-`));
  assert.match(en, /Manuscript edited: 2026-11-17 16:45:30 UTC/);
  assert.match(en, /<pubDate>Tue, 17 Nov 2026 16:45:30 GMT<\/pubDate>/);
  assert.doesNotMatch(en, /2026-11-16|\/ko\//);
  const ko = chapterFeed({ ...options, lang: 'ko', revisions });
  assert.equal([...ko.matchAll(/<item>/g)].length, 1);
  assert.match(ko, /<language>ko<\/language>/);
  assert.ok(ko.includes(`/foundation-model-engineering/ko${subs[0].path}/`));
  assert.match(ko, /원고 수정: 2026-11-16 03:00:00 UTC/);
  assert.match(ko, /\/ko\/feed.xml/);
  for (const feed of [en, ko]) {
    assert.ok(feed.includes(`<atom:link href="${chapterFeedHub}" rel="hub" />`));
    assert.equal([...feed.matchAll(/rel="self"/g)].length, 1);
    assert.equal([...feed.matchAll(/rel="hub"/g)].length, 1);
  }
  assert.equal(en, chapterFeed({ ...options, revisions }), 'a rebuild must not change item identifiers');
});

test('feeds cap recent entries, escape XML, and support a root deployment', () => {
  const revisions = new Map(subs.map(sub => [`src/pages${sub.path}.mdx`, revision('2026-11-17T12:00:00.000Z')]));
  const xml = chapterFeed({ lang: 'en', basePath: '/', revisions });
  assert.equal([...xml.matchAll(/<item>/g)].length, 20);
  assert.match(xml, /<link>https:\/\/sungeuns.github.io\/<\/link>/);
  assert.match(xml, /&amp;/); // Several real chapter titles contain ampersands.
  assert.doesNotMatch(xml, / & /);
  assert.equal(new Set([...xml.matchAll(/<guid[^>]*>(.*?)<\/guid>/g)].map(m => m[1])).size, 20);
});

test('same-day updates are sorted before truncation and commit identity changes the GUID', () => {
  const revisions = new Map(subs.slice(0, 21).map((sub, i) => [
    `src/pages${sub.path}.mdx`, revision(`2026-11-17T12:00:${String(i).padStart(2, '0')}.000Z`),
  ]));
  const xml = chapterFeed({ ...options, revisions });
  assert.equal([...xml.matchAll(/<item>/g)].length, 20);
  assert.ok(xml.indexOf(`${subs[20].path}/#revision-`) < xml.indexOf(`${subs[19].path}/#revision-`));
  assert.ok(!xml.includes(`${subs[0].path}/#revision-`), 'the oldest entry should be excluded');
  const key = `src/pages${subs[20].path}.mdx`;
  revisions.set(key, { ...revisions.get(key), commit: 'b'.repeat(40) });
  const next = chapterFeed({ ...options, revisions });
  assert.ok(xml.includes(`${subs[20].path}/#revision-${'a'.repeat(40)}`));
  assert.ok(next.includes(`${subs[20].path}/#revision-${'b'.repeat(40)}`));
});

test('commits sharing a timestamp retain Git history ordering', () => {
  const revisions = new Map([
    [`src/pages${subs[0].path}.mdx`, revision('2026-11-17T12:00:00.000Z', 'a'.repeat(40), 1)],
    [`src/pages${subs[1].path}.mdx`, revision('2026-11-17T12:00:00.000Z', 'b'.repeat(40), 0)],
  ]);
  const xml = chapterFeed({ ...options, revisions });
  assert.ok(xml.indexOf(`${subs[1].path}/#revision-`) < xml.indexOf(`${subs[0].path}/#revision-`));
});
