import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import test from 'node:test';
import { load } from 'js-yaml';
import { parse, parseFragment } from 'parse5';
import { chapters } from '../src/data/chapters.js';
import { searchDescriptions } from '../src/data/search-descriptions.js';
import { socialCards } from '../src/data/social-cards.js';
import { labsTitle, servingGuide } from '../src/data/site.js';
import { defaultBudget, defaultPool, nineRequestWorkload, readKvScenario } from '../src/components/chapter-12/kv-scenario.mjs';
import { getContentDates, getContentRevisions } from '../src/utils/content-dates.js';

const base = 'https://sungeuns.github.io/foundation-model-engineering';
const outputDir = process.env.SEARCH_DIST_DIR || 'dist';
const routes = ['/', '/ko', '/labs', '/ko/labs', ...chapters.flatMap(c => c.subs.flatMap(s => [s.path, `/ko${s.path}`]))];
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

test('the long-context price link opens the 272K exercise in both editions', () => {
  for (const locale of ['', '/ko']) {
    const html = readFileSync(`${outputDir}${locale}/chapter-17/commercial-model-benchmarks/index.html`, 'utf8');
    assert.match(html, /<a id="long-context-cost"><\/a>\s*<h2\b[^>]*>[^<]*272K/i);
  }
});

test('localized Korean lesson names reach the page title and the visible main heading', () => {
  for (const { subs } of chapters) {
    for (const { path, title } of subs) {
      const html = readFileSync(`${outputDir}/ko${path}/index.html`, 'utf8');
      const pageTitle = html.match(/<title>([^<]*)<\/title>/)?.[1];
      assert.ok(pageTitle?.includes(escape(title.ko)), path);
      // A native name such as FlashAttention is valid in either locale. If the
      // Korean inventory describes it in Korean, the main heading should too.
      if (/[가-힣]/u.test(title.ko)) {
        const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1];
        const headings = [...(main ?? '').matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)];
        assert.equal(headings.length, 1, path);
        assert.match(headings[0][1].replace(/<[^>]+>/g, ''), /[가-힣]/u, path);
      }
    }
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
    const switchLink = html.match(/<a\b[^>]*\bid="localeLink"[^>]*>/)?.[0];
    const otherLang = lang === 'en' ? 'ko' : 'en';
    const otherRoute = lang === 'ko' ? en : en === '/' ? '/ko' : `/ko${en}`;
    assert.ok(switchLink?.includes(`href="${new URL(absolute(otherRoute)).pathname}"`), `${route}: visible edition link`);
    assert.ok(switchLink.includes(`hreflang="${otherLang}"`), route);
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
    const pageType = en === '/' ? 'Book' : en === '/labs' ? 'CollectionPage' : 'TechArticle';
    assert.equal(schemas[0]['@type'], pageType, route);
    assert.ok(head.includes(`property="og:type" content="${pageType === 'TechArticle' ? 'article' : 'website'}"`), route);
    const metaTags = parseFragment(head).childNodes.filter(node => node.tagName === 'meta');
    const citation = {};
    for (const tag of metaTags) {
      const { name, content } = Object.fromEntries(tag.attrs.map(attr => [attr.name, attr.value]));
      if (name?.startsWith('citation_')) citation[name] = content;
    }
    if (pageType !== 'TechArticle') {
      assert.deepEqual(citation, {}, `${route}: citations describe individual chapters`);
    } else {
      assert.ok(citation.citation_title, route);
      assert.equal(citation.citation_book_title, schemas[0].isPartOf.name, route);
      assert.equal(citation.citation_inbook_title, citation.citation_book_title, route);
      assert.equal(citation.citation_author, 'So, Seongeun', route);
      assert.equal(citation.citation_language, lang, route);
      assert.equal(citation.citation_public_url, absolute(route), route);
    }
    const revision = revisions.get(`src/pages${route}.mdx`);
    const timestamp = revision?.timestamp;
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
      const sourceUrl = `https://github.com/sungeuns/foundation-model-engineering/blob/${revision.commit}/src/pages${route}.mdx`;
      const links = parseFragment(byline).childNodes.filter(node => node.tagName === 'a');
      const [sourceLink, citationLink] = links.map(link => Object.fromEntries(link.attrs.map(a => [a.name, a.value])));
      assert.equal(sourceLink.href, sourceUrl, route);
      assert.equal(links[0].childNodes.map(node => node.value).join('').trim(),
        lang === 'ko' ? 'GitHub 원고' : 'Chapter source on GitHub', route);
      assert.match(citationLink.download, new RegExp(`-${lang}-${revision.commit.slice(0, 12)}\\.ris$`));
      const prefix = 'data:application/x-research-info-systems;charset=utf-8,';
      assert.ok(citationLink.href.startsWith(prefix), route);
      const fields = decodeURIComponent(citationLink.href.slice(prefix.length)).split('\r\n');
      assert.equal(fields[0], 'TY  - CHAP', route);
      const risTitle = fields.find(line => line.startsWith('TI  - ')).slice(6);
      assert.equal(citation.citation_title, risTitle, `${route}: URL import and RIS must cite the same title`);
      assert.ok(fields.includes(`LA  - ${lang}`) && fields.includes(`UR  - ${absolute(route)}`), route);
      assert.ok(fields.includes(`DA  - ${timestamp.slice(0, 10).replaceAll('-', '/')}`), route);
      assert.ok(fields.some(line => line.startsWith('N1  - ') && line.endsWith(sourceUrl)), route);
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

test('internal links resolve to real canonical destinations and respect the chapter edition', () => {
  const siteBase = new URL(base);
  const pages = new Map();
  for (const route of routes) {
    const suffix = route === '/' ? '' : route;
    const html = readFileSync(`${outputDir}${suffix}/index.html`, 'utf8');
    const links = [];
    const ids = new Set();
    function visit(node, inMain) {
      const attrs = Object.fromEntries((node.attrs || []).map(({ name, value }) => [name, value]));
      if (attrs.id) ids.add(attrs.id);
      if (node.tagName === 'a' && attrs.href) links.push({ ...attrs, inMain });
      for (const child of node.childNodes || []) visit(child, inMain || node.tagName === 'main');
    }
    visit(parse(html), false);
    const chapterLang = route === '/' || route === '/ko' ? null : route.startsWith('/ko/') ? 'ko' : 'en';
    pages.set(`${base}${suffix}/`, { ids, links, chapterLang });
  }
  for (const [pageUrl, page] of pages) {
    for (const { href, hreflang, inMain } of page.links) {
      const url = new URL(href, pageUrl);
      if (url.origin !== siteBase.origin) continue;
      assert.ok(url.pathname.startsWith(`${siteBase.pathname}/`), `${pageUrl}: outside deployment base: ${href}`);
      const target = pages.get(url.origin + url.pathname);
      if (target) {
        if (url.hash) assert.ok(target.ids.has(decodeURIComponent(url.hash.slice(1))), `${pageUrl}: missing fragment ${href}`);
        if (inMain && page.chapterLang && target.chapterLang && page.chapterLang !== target.chapterLang) {
          assert.equal(hreflang, target.chapterLang, `${pageUrl}: unlabeled change of edition to ${href}`);
        }
      } else {
        const assetPath = url.pathname.slice(siteBase.pathname.length);
        assert.ok(/\.[^/]+$/.test(assetPath) && existsSync(`${outputDir}${assetPath}`), `${pageUrl}: broken or noncanonical link ${href}`);
      }
    }
  }
});

test('home notebook download links save the localized notebook file', () => {
  for (const edition of ['', '/ko']) {
    const html = readFileSync(`${outputDir}${edition}/index.html`, 'utf8');
    const filename = `tiny-decoder-lab${edition ? '-ko' : ''}.ipynb`;
    const href = `href="${new URL(base).pathname}/labs/${filename}"`;
    const link = [...html.matchAll(/<a\s[^>]*>/g)].map(([tag]) => tag).find(tag => tag.includes(href));
    assert.ok(link?.includes(`download="${filename}"`), `${edition}/index.html: notebook download`);
  }
});

test('downloaded Python modules link back to the exercise that supplies them in each edition', () => {
  const exercises = {
    'self_attention.py': 'batched-padding-example',
    'cross_attention.py': 'cross-attention-example',
    'prefix_mask.py': 'prefix-mask-test',
    'expert_dispatch.py': 'expert-dispatch-lab',
    'zero_shards.py': 'zero-shard-ownership',
    'causal_lab.py': 'local-decoder-setup',
    'token_exposure.py': 'token-mixture-example',
    'paged_attention.py': 'paged-kv-addresses',
    'request_cost.py': 'long-context-cost',
    'paired_release.py': 'release-lab',
  };
  const lessons = chapters.flatMap(chapter => chapter.subs);
  for (const [file, exercise] of Object.entries(exercises)) {
    const source = readFileSync(`${outputDir}/labs/${file}`, 'utf8');
    const docstring = source.match(/^"""([\s\S]*?)"""/)?.[1] || '';
    assert.match(docstring, /Foundation Model Engineering/, file);
    const urls = (docstring.match(/https:\/\/[^\s"<>]+/g) || []).filter(url => url.startsWith(base + '/'));
    const lesson = lessons.find(sub => urls.includes(`${base}${sub.path}/#${exercise}`));
    assert.ok(lesson, `${file}: canonical English exercise`);
    assert.ok(docstring.includes(lesson.id.replace('-', '.')), `${file}: lesson number`);
    for (const locale of ['', '/ko']) {
      const page = `${base}${locale}${lesson.path}/`;
      assert.ok(urls.includes(`${page}#${exercise}`), `${file}: ${page}`);
      const html = readFileSync(`${outputDir}${locale}${lesson.path}/index.html`, 'utf8');
      const main = html.match(/<main\b[^>]*>([\s\S]+?)<\/main>/)[1];
      assert.equal(main.split(` id="${exercise}"`).length, 2, `${page}: unique exercise target`);
      const links = [...main.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)];
      assert.ok(links.some(([, href]) => new URL(href, page).href === `${base}/labs/${file}`), `${page}: source download`);
    }
  }
});

test('the two homepages and the six collected lessons link to their serving EPUB', () => {
  const collected = new Set(['kv-cache-management', 'continuous-batching', 'serving-policies-slos-and-fallbacks']);
  for (const route of routes) {
    const lang = route.startsWith('/ko') ? 'ko' : 'en';
    const lesson = route.replace(/^\/ko(?=\/|$)/, '').match(/^\/chapter-12\/([^/]+)$/)?.[1];
    const home = route === '/' || route === '/ko';
    const html = readFileSync(`${outputDir}${route === '/' ? '' : route}/index.html`, 'utf8');
    const epubLinks = [...html.matchAll(/<a\b[^>]*href="([^"]+\.epub)"[^>]*>/g)].filter(match => match[1].includes('/llm-serving-'));
    assert.equal(epubLinks.length, home || collected.has(lesson) ? 1 : 0, route);
    if (!epubLinks.length) continue;
    const [link] = epubLinks;
    assert.equal(link[1], servingGuide.downloads[lang], route);
    assert.ok(link[0].includes('type="application/epub+zip"'), route);
    if (home) {
      const readme = readFileSync(lang === 'en' ? 'README.md' : 'README.ko.md', 'utf8');
      assert.ok(readme.includes(`(${link[1]})`), `${lang}: README links to the same edition`);
    }
    if (!home) assert.ok(link.index < html.indexOf('<main'), `${route}: keep self-downloads outside exported lesson text`);
  }
});

test('each OER catalogue entry previews the localized lesson or its EPUB cover', () => {
  for (const record of load(readFileSync('metadata.yml', 'utf8'))) {
    const [lang] = record.inLanguage;
    const landing = new URL(record.id);
    const route = landing.pathname.slice(new URL(base).pathname.length);
    const html = readFileSync(`${outputDir}${route}index.html`, 'utf8');
    const pageImage = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1];
    const expected = landing.hash === '#serving-guide' ? `${base}/social/serving-field-guide-${lang}.png` : pageImage;
    assert.ok(expected, record.id);
    assert.equal(record.image, expected, record.id);
    assert.ok(record.image.startsWith(`${base}/social/`) && record.image.endsWith(`-${lang}.png`), record.id);
    const image = readFileSync(`${outputDir}${record.image.slice(base.length)}`);
    assert.equal(image.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', record.image);
  }
});

test('the indexed OER textbook records link their own teaching material collections', () => {
  const records = load(readFileSync('metadata.yml', 'utf8'));
  const hubUrls = [`${base}/labs/`, `${base}/ko/labs/`];
  for (const [lang, title] of Object.entries(labsTitle)) {
    const edition = lang === 'ko' ? '/ko' : '';
    const books = records.filter(record => record.id === `${base}${edition}/`);
    assert.equal(books.length, 1, lang);
    assert.deepEqual(books[0].inLanguage, [lang]);
    const hub = `${base}${edition}/labs/`;
    const parts = books[0].hasPart.filter(part => hubUrls.includes(part.id));
    assert.deepEqual(parts, [{ type: 'LearningResource', id: hub, name: title }]);
    const html = readFileSync(`${outputDir}${edition}/labs/index.html`, 'utf8');
    assert.ok(html.includes(`rel="canonical" href="${hub}"`), hub);
    assert.ok(html.includes(`<h1>${escape(title)}</h1>`), hub);
  }
});

test('the OER catalogue opens the localized guide and points to its current EPUB', () => {
  const records = load(readFileSync('metadata.yml', 'utf8'));
  const guides = records.filter(record => record.encoding?.some(file => file.encodingFormat === 'application/epub+zip'));
  assert.equal(guides.length, 2, 'one catalogue record per guide language');
  for (const [lang, download] of Object.entries(servingGuide.downloads)) {
    const edition = lang === 'ko' ? '/ko' : '';
    const landing = `${base}${edition}/#serving-guide`;
    const guide = guides.find(record => record.id === landing);
    assert.deepEqual(guide?.inLanguage, [lang], landing);
    assert.deepEqual(guide.encoding, [{ type: 'MediaObject', encodingFormat: 'application/epub+zip', contentUrl: download }]);

    const html = readFileSync(`${outputDir}${edition}/index.html`, 'utf8');
    assert.equal(html.split(' id="serving-guide"').length, 2, landing);
    const paragraph = html.match(/<p\b[^>]*\bid="serving-guide"[^>]*>([\s\S]*?)<\/p>/)?.[1];
    assert.ok(paragraph?.includes(guide.name) && paragraph.includes(`href="${download}"`), landing);
    const switcher = parseFragment(html.match(/<a\b[^>]*\bid="localeLink"[^>]*>/)[0]).childNodes[0];
    const fragments = switcher.attrs.find(attribute => attribute.name === 'data-shared-fragments');
    assert.ok(JSON.parse(fragments.value).includes('serving-guide'), landing);
  }
});

test('the book and README open the same worked KV budget in each edition', () => {
  for (const edition of ['', '/ko']) {
    const html = readFileSync(`${outputDir}${edition}/index.html`, 'utf8');
    const tag = html.match(/<a\b[^>]*href="[^"]*\?kv=1[^"]*"[^>]*>/)?.[0];
    assert.ok(tag, `${edition}/index.html: worked KV example`);
    const href = parseFragment(tag).childNodes[0].attrs.find(attr => attr.name === 'href').value;
    const url = new URL(href, base);
    assert.equal(url.origin + url.pathname, `${base}${edition}/chapter-12/kv-cache-management/`);
    assert.equal(url.hash, '#kv-calculator');
    assert.deepEqual(readKvScenario(url.search), {
      workload: nineRequestWorkload, budget: defaultBudget, deduct: false, pool: defaultPool,
    });
    const readme = readFileSync(edition ? 'README.ko.md' : 'README.md', 'utf8');
    assert.ok(readme.includes(`](${url.href})`), 'README and book must open the same calculation');
  }
});

test('the homepage and README take each edition directly to the checkpoint context limit', () => {
  const fragment = 'ling-32-air-context';
  for (const edition of ['', '/ko']) {
    const route = `${edition}/chapter-17/commercial-model-benchmarks/`;
    const target = new URL(`${base}${route}#${fragment}`);
    const home = readFileSync(`${outputDir}${edition}/index.html`, 'utf8');
    const readme = readFileSync(edition ? 'README.ko.md' : 'README.md', 'utf8');
    assert.ok(home.includes(`href="${target.pathname}${target.hash}"`), `homepage: ${target}`);
    assert.ok(readme.includes(`](${target.href})`), `README: ${target}`);

    const page = readFileSync(`${outputDir}${route}index.html`, 'utf8');
    const passage = page.split(`<a id="${fragment}"></a>`)[1]?.split(/<h[23]\b/)[1];
    assert.ok(passage?.includes('262,144') && passage.includes('max_position_embeddings'), `missing checkpoint setting: ${target}`);
    assert.ok(passage.includes('href="#ref-117"'), `missing configuration source: ${target}`);
  }
});

test('sitemap preserves canonical route order and uses only available content dates', () => {
  const xml = readFileSync(`${outputDir}/sitemap.xml`, 'utf8');
  const entries = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(m => m[1]);
  assert.deepEqual(entries.map(e => e.match(/<loc>(.*?)<\/loc>/)[1]), routes.map(p => `${base}${p === '/' ? '' : p}/`));
  const dates = getContentDates();
  for (const [index, entry] of entries.entries()) {
    const route = routes[index];
    if (route === '/labs' || route === '/ko/labs') {
      assert.doesNotMatch(entry, /<lastmod>/, `${route}: the shared catalog has multiple content sources`);
      continue;
    }
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
