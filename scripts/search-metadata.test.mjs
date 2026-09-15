import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import test from 'node:test';
import { chapters } from '../src/data/chapters.js';
import { searchDescriptions } from '../src/data/search-descriptions.js';
import { getContentDates } from '../src/utils/content-dates.js';

const base = 'https://sungeuns.github.io/foundation-model-engineering';
const outputDir = process.env.SEARCH_DIST_DIR || 'dist';
const routes = ['/', '/ko', ...chapters.flatMap(c => c.subs.flatMap(s => [s.path, `/ko${s.path}`]))];
const escape = text => text.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

test('search descriptions have real routes and equivalent language coverage', () => {
  for (const [route, descriptions] of Object.entries(searchDescriptions)) {
    assert.ok(routes.includes(route), route);
    assert.deepEqual(Object.keys(descriptions), ['en', 'ko']);
    assert.doesNotMatch(descriptions.en, /[가-힣]/);
    assert.match(descriptions.ko, /[가-힣]/);
  }
});

// Run after the GitHub Pages build, not against the production site's old HTML.
test('every built page has canonical, reciprocal language links, and a local social image', () => {
  for (const route of routes) {
    const html = readFileSync(`${outputDir}${route === '/' ? '' : route}/index.html`, 'utf8');
    const head = html.slice(0, html.indexOf('</head>'));
    const lang = route.startsWith('/ko') ? 'ko' : 'en';
    const en = route.replace(/^\/ko/, '') || '/';
    const absolute = p => `${base}${p === '/' ? '' : p}/`;
    assert.ok(head.includes(`rel="canonical" href="${absolute(route)}"`), route);
    for (const [locale, target] of [['en', en], ['ko', en === '/' ? '/ko' : `/ko${en}`], ['x-default', en]]) {
      assert.ok(head.includes(`hreflang="${locale}" href="${absolute(target)}"`), `${route}: ${locale}`);
    }
    assert.ok(head.includes(`property="og:image" content="${base}/social/cover-${lang}.png"`), route);
    assert.ok(head.includes('name="twitter:card" content="summary_large_image"'), route);
    assert.ok(existsSync(`${outputDir}/social/cover-${lang}.png`));
    const description = searchDescriptions[en]?.[lang];
    if (description) {
      const source = readFileSync(`src/pages${route}.mdx`, 'utf8').split('---')[1];
      if (!/^description:/m.test(source)) {
        assert.ok(head.includes(`name="description" content="${escape(description)}"`), route);
      }
    }
  }
});

test('sitemap preserves canonical route order and uses only available content dates', () => {
  const xml = readFileSync(`${outputDir}/sitemap.xml`, 'utf8');
  const entries = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(m => m[1]);
  assert.deepEqual(entries.map(e => e.match(/<loc>(.*?)<\/loc>/)[1]), routes.map(p => `${base}${p === '/' ? '' : p}/`));
  const dates = getContentDates();
  for (const [index, entry] of entries.entries()) {
    const route = routes[index];
    const source = route === '/' ? 'src/pages/index.astro' : route === '/ko' ? 'src/pages/ko/index.astro' : `src/pages${route}.mdx`;
    assert.equal(entry.match(/<lastmod>(.*?)<\/lastmod>/)?.[1], dates.get(source), route);
  }
});
