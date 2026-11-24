import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import test from 'node:test';
import { chapters } from '../src/data/chapters.js';
import { searchDescriptions } from '../src/data/search-descriptions.js';
import { socialCards } from '../src/data/social-cards.js';
import { getContentDates, getContentRevisions } from '../src/utils/content-dates.js';

const base = 'https://sungeuns.github.io/foundation-model-engineering';
const outputDir = process.env.SEARCH_DIST_DIR || 'dist';
const routes = ['/', '/ko', ...chapters.flatMap(c => c.subs.flatMap(s => [s.path, `/ko${s.path}`]))];
const escape = text => text.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

test('search descriptions have real routes and equivalent language coverage', () => {
  assert.deepEqual(Object.keys(searchDescriptions).sort(), chapters.flatMap(c => c.subs.map(s => s.path)).sort());
  for (const [route, descriptions] of Object.entries(searchDescriptions)) {
    assert.ok(routes.includes(route), route);
    assert.deepEqual(Object.keys(descriptions), ['en', 'ko']);
    assert.doesNotMatch(descriptions.en, /[가-힣]/);
    assert.match(descriptions.ko, /[가-힣]/);
  }
});

// Run after the GitHub Pages build, not against the production site's old HTML.
test('every built page has canonical, reciprocal language links, and a local social image', () => {
  const seenDescriptions = new Set();
  const revisions = getContentRevisions();
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
    const socialImage = socialCards[en]?.[lang]?.image || `/social/cover-${lang}.png`;
    assert.ok(head.includes(`property="og:image" content="${base}${socialImage}"`), route);
    assert.ok(head.includes(`name="twitter:image" content="${base}${socialImage}"`), route);
    assert.ok(head.includes('name="twitter:card" content="summary_large_image"'), route);
    const feedPath = `/foundation-model-engineering/${lang === 'ko' ? 'ko/' : ''}feed.xml`;
    assert.ok(head.includes(`type="application/rss+xml" title="${lang === 'ko' ? '최근 수정한 장 (RSS)' : 'Recently edited chapters (RSS)'}" href="${feedPath}"`), `${route}: feed discovery`);
    assert.ok(existsSync(`${outputDir}/${lang === 'ko' ? 'ko/' : ''}feed.xml`));
    const image = readFileSync(`${outputDir}${socialImage}`);
    assert.equal(image.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', `${route}: PNG signature`);
    assert.equal(image.readUInt32BE(16), 1200, `${route}: social image width`);
    assert.equal(image.readUInt32BE(20), 630, `${route}: social image height`);
    const actualDescription = head.match(/name="description" content="([^"]+)"/)?.[1];
    assert.ok(actualDescription, `${route}: missing description`);
    assert.ok(!seenDescriptions.has(actualDescription), `${route}: duplicate description`);
    seenDescriptions.add(actualDescription);
    assert.ok(head.includes('max-image-preview:large'), route);
    assert.doesNotMatch(head, /content="[^"]*\bnoindex\b/);
    const schemas = [...head.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].map(m => JSON.parse(m[1]));
    const timestamp = revisions.get(`src/pages${route}.mdx`)?.timestamp;
    assert.equal(schemas[0].dateModified, timestamp, `${route}: manuscript revision`);
    const byline = html.match(/<p class="manuscript-revision"[^>]*>([\s\S]*?)<\/p>/)?.[1];
    if (timestamp) {
      assert.ok(byline?.includes(lang === 'ko' ? '원고 수정일' : 'Manuscript updated'), route);
      assert.ok(byline.includes('(UTC)'), route);
      const time = byline.match(/<time\b[^>]*\bdatetime="([^"]+)"[^>]*>([^<]+)<\/time>/);
      assert.equal(time?.[1], timestamp, `${route}: visible time and structured time must match`);
      const visibleDate = new Date(timestamp).toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'en-US', {
        dateStyle: 'long', timeZone: 'UTC',
      });
      assert.equal(time?.[2], visibleDate, `${route}: localized manuscript date`);
    } else {
      assert.equal(byline, undefined, `${route}: no unsupported revision date`);
    }
    assert.equal(schemas[0].image, `${base}${socialImage}`, `${route}: structured image parity`);
    const breadcrumb = schemas.find(schema => schema['@type'] === 'BreadcrumbList');
    if (route !== '/' && route !== '/ko') {
      assert.deepEqual(breadcrumb.itemListElement.map(item => item.position), [1, 2], route);
      assert.equal(breadcrumb.itemListElement[0].item, absolute(lang === 'ko' ? '/ko' : '/'));
      assert.equal(breadcrumb.itemListElement[1].item, absolute(route));
      assert.ok(html.includes('aria-current="page"'), `${route}: breadcrumb must be visible`);
    } else {
      assert.equal(breadcrumb, undefined);
      assert.equal(schemas[0].isPartOf, undefined, 'a book must not be part of itself');
    }
    const description = searchDescriptions[en]?.[lang];
    if (description) {
      const source = readFileSync(`src/pages${route}.mdx`, 'utf8').split('---')[1];
      if (!/^description:/m.test(source)) {
        assert.ok(head.includes(`name="description" content="${escape(description)}"`), route);
      }
    }
  }
});

test('internal links resolve to canonical deployed paths and real fragments', () => {
  const siteBase = new URL(base);
  const routeUrls = new Set(routes.map(route => `${base}${route === '/' ? '' : route}/`));
  const files = new Map();
  for (const route of routes) {
    const url = `${base}${route === '/' ? '' : route}/`;
    files.set(url, readFileSync(`${outputDir}${route === '/' ? '' : route}/index.html`, 'utf8'));
  }
  for (const [pageUrl, html] of files) {
    for (const match of html.matchAll(/<a\s[^>]*href="([^"]+)"/g)) {
      const href = match[1].replaceAll('&amp;', '&');
      const url = new URL(href, pageUrl);
      if (url.origin !== siteBase.origin) continue;
      assert.ok(url.pathname.startsWith(`${siteBase.pathname}/`), `${pageUrl}: outside deployment base: ${href}`);
      const target = `${url.origin}${url.pathname}`;
      if (routeUrls.has(target)) {
        if (url.hash) {
          const id = decodeURIComponent(url.hash.slice(1));
          assert.ok(files.get(target).includes(`id="${id}"`), `${pageUrl}: missing fragment ${href}`);
        }
      } else {
        const assetPath = url.pathname.slice(siteBase.pathname.length);
        assert.ok(/\.[^/]+$/.test(assetPath) && existsSync(`${outputDir}${assetPath}`), `${pageUrl}: broken or noncanonical link ${href}`);
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

test('built chapter mathematics never falls back to a KaTeX error', () => {
  function inspect(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const file = `${dir}/${entry.name}`;
      if (entry.isDirectory()) inspect(file);
      else if (entry.name.endsWith('.html')) {
        assert.doesNotMatch(readFileSync(file, 'utf8'), /class="katex-error"/, file);
      }
    }
  }
  inspect(outputDir);
});
