import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { parse } from 'parse5';
import { chapters } from '../src/data/chapters.js';
import { normalizePathname, withPagePath } from '../src/utils/paths.js';
import { findSections, readSectionIndex } from '../src/utils/section-search.js';

const output = process.env.SEARCH_DIST_DIR || 'dist';
const inventory = chapters.flatMap(chapter => chapter.subs);
const modelPage = '/chapter-17/commercial-model-benchmarks';
const snapshot = JSON.parse(readFileSync(new URL('../src/data/commercial-model-snapshot.json', import.meta.url)));
const modelIds = new Set(snapshot.models.map(({ id }) => `model-${id}`));
const labs = {
  '/chapter-11/audio-and-speech-integration': { id: 'sample-rate-listen', en: 'Hear what a sample-rate error sounds like', ko: '샘플링 속도를 잘못 지정하면 어떻게 들릴까?' },
  '/chapter-12/kv-cache-management': { id: 'kv-calculator', en: 'KV cache calculator', ko: 'KV 캐시 계산기' },
  '/chapter-17/experimental-design-and-uncertainty': { id: 'release-lab', en: 'Release decision lab', ko: '배포 판단 실습' },
};
const traceHeading = {
  en: ['Run a Trace Audit with Stable Chunk IDs', 'run-a-trace-audit-with-stable-chunk-ids'],
  ko: ['고정된 청크 ID로 추적 기록 검사하기', '고정된-청크-id로-추적-기록-검사하기'],
};

function headingText(node) {
  if (node.nodeName === '#text') return node.value;
  // KaTeX emits parallel accessible and visual representations. Its original
  // TeX annotation supplies a single readable spelling for a search label.
  if (node.attrs?.some(attr => attr.name === 'class' && attr.value === 'katex-html')) return '';
  if (node.tagName === 'semantics') {
    const annotation = node.childNodes.find(child => child.tagName === 'annotation');
    if (annotation) return headingText(annotation);
  }
  return (node.childNodes || []).map(headingText).join('');
}

function renderedTargets(html) {
  const elementsById = new Map();
  const chapterHeadings = new Map();
  const outlineLinks = [];
  function visit(node, inOutline = false) {
    const id = node.attrs?.find(attr => attr.name === 'id')?.value;
    if (id === 'pageOutline') {
      assert.equal(node.tagName, 'details');
      assert.ok(!node.attrs.some(attr => attr.name === 'hidden'));
      inOutline = true;
    }
    if (inOutline && node.tagName === 'a') {
      const href = node.attrs.find(attr => attr.name === 'href')?.value;
      assert.ok(href?.startsWith('#'));
      outlineLinks.push([decodeURIComponent(href.slice(1)), headingText(node).replace(/\s+/gu, ' ').trim()]);
    }
    if (id) {
      elementsById.set(id, node);
      // The layout places authored MDX headings directly beneath main. Widgets
      // can also render named headings, which are outside the compiler's list.
      if (node.parentNode?.tagName === 'main' && ['h2', 'h3', 'h4'].includes(node.tagName)) {
        chapterHeadings.set(id, headingText(node).replace(/\s+/gu, ' ').trim());
      }
    }
    for (const child of node.childNodes || []) visit(child, inOutline);
  }
  visit(parse(html));
  return { elementsById, chapterHeadings, outlineLinks };
}

for (const lang of ['en', 'ko']) {
  test(`${lang} section index resolves every heading and model in canonical chapter order`, {
    skip: !existsSync(output) && 'Build the site first',
  }, () => {
    const home = readFileSync(join(output, 'index.html'), 'utf8');
    const canonical = home.match(/<link\b[^>]*\brel="canonical"[^>]*\bhref="([^"]+)"/);
    assert.ok(canonical, 'the built homepage declares its deployment URL');
    const base = normalizePathname(new URL(canonical[1]).pathname);
    const localized = inventory.map(sub => lang === 'en' ? sub.path : `/ko${sub.path}`);
    const index = JSON.parse(readFileSync(join(output, 'search', `${lang}.json`), 'utf8'));
    assert.deepEqual(Object.keys(index).sort(), ['articles', 'catalog', 'chapters', 'lang', 'version']);
    assert.equal(index.version, 1);
    assert.equal(index.lang, lang);
    assert.deepEqual(index.chapters.map(chapter => chapter.path), localized.map(path => withPagePath(path, base)));

    const hub = lang === 'ko' ? '/ko/labs' : '/labs';
    const hubPath = withPagePath(hub, base);
    const { elementsById: labElements } = renderedTargets(readFileSync(join(output, hub, 'index.html'), 'utf8'));
    const localizedArticles = lang === 'en' ? 'articles' : 'ko/articles';
    const articlePages = readdirSync(join(output, localizedArticles), { withFileTypes: true })
      .filter(item => item.isDirectory() && existsSync(join(output, localizedArticles, item.name, 'index.html')))
      .map(item => '/' + localizedArticles + '/' + item.name);
    const published = articlePages.map(page => withPagePath(page, base));
    const localizedHome = readFileSync(join(output, lang === 'ko' ? 'ko' : '', 'index.html'), 'utf8');
    const input = renderedTargets(localizedHome).elementsById.get('chapterSearch');
    const allowed = JSON.parse(input.attrs.find(attr => attr.name === 'data-article-paths').value);
    assert.deepEqual(allowed.toSorted(), published.toSorted());
    assert.deepEqual(index.articles.map(item => item.path).toSorted(), published.toSorted());
    const entries = readSectionIndex(index, lang, new Set(index.chapters.map(chapter => chapter.path)), hubPath, new Set(allowed));
    for (const page of articlePages) {
      const targets = renderedTargets(readFileSync(join(output, page, 'index.html'), 'utf8')).elementsById;
      const main = targets.get('main-content');
      const label = headingText(main.childNodes.find(node => node.tagName === 'h1'));
      const [match] = findSections(entries, label).matches;
      assert.equal(match.label, label);
      assert.equal(match.href, withPagePath(page, base) + '#main-content');
    }
    const article = withPagePath('/' + localizedArticles + '/whisper-sample-rate', base) + '#main-content';
    const query = lang === 'en' ? 'Whisper sample rate' : 'Whisper 샘플링 속도';
    assert.ok(findSections(entries, query).matches.some(row => row.href === article), query);
    for (const [, id] of index.catalog.sections) assert.equal(labElements.get(id)?.tagName, 'li', id);
    for (const [query, id] of [
      [lang === 'en' ? 'worksheet' : '활동지', 'attention-weight-example'],
      [lang === 'en' ? 'spreadsheet' : '엑셀', 'mixed-request-budget'],
      [lang === 'en' ? 'KV notebook' : 'KV 노트북', 'kv-payload-notebook'],
    ]) {
      assert.ok(findSections(entries, query).matches.some(row => row.href === hubPath + '#' + id), query);
    }

    inventory.forEach((sub, i) => {
      const entry = index.chapters[i];
      assert.deepEqual(Object.keys(entry).sort(), ['path', 'sections', 'title']);
      assert.equal(entry.title, sub.title[lang]);
      assert.ok(Array.isArray(entry.sections));
      const html = readFileSync(join(output, localized[i], 'index.html'), 'utf8');
      const { elementsById, chapterHeadings, outlineLinks } = renderedTargets(html);
      const outlineHeadings = [...chapterHeadings].filter(([id]) => elementsById.get(id).tagName !== 'h4');
      assert.deepEqual(outlineLinks, outlineHeadings, `static outline labels, order and targets: ${entry.path}`);
      const labelsById = new Map();
      for (const section of entry.sections) {
        assert.ok(Array.isArray(section) && section.length === 2, entry.path);
        const [label, id] = section;
        assert.equal(typeof label, 'string');
        assert.ok(label.trim(), entry.path);
        assert.doesNotMatch(label, /^(quizzes|references|퀴즈|참고\s*문헌)$/iu);
        const target = elementsById.get(id);
        assert.ok(target, `missing rendered target: ${entry.path}#${id}`);
        const tag = target.tagName;
        assert.ok(id !== 'quizzes' && id !== 'references');
        assert.ok(['h2', 'h3', 'h4'].includes(tag) || (sub.path === modelPage && modelIds.has(id))
          || (labs[sub.path]?.id === id && tag === 'section'),
          `unexpected section target: ${entry.path}#${id}`);
        assert.ok(!labelsById.has(id), `duplicate: ${entry.path}#${id}`);
        labelsById.set(id, label);
      }
      for (const [id, label] of chapterHeadings) {
        if (id === 'quizzes' || id === 'references') continue;
        assert.equal(labelsById.get(id), label, `heading label: ${entry.path}#${id}`);
        if (elementsById.get(id).tagName === 'h4') {
          const href = entry.path + '#' + encodeURIComponent(id);
          assert.ok(findSections(entries, label).matches.some(match => match.href === href), href);
        }
      }
      const lab = labs[sub.path];
      if (lab) {
        assert.equal(labelsById.get(lab.id), lab[lang]);
        const labelledBy = elementsById.get(lab.id).attrs.find(attr => attr.name === 'aria-labelledby').value;
        assert.equal(headingText(elementsById.get(labelledBy)), lab[lang]);
      }
      if (sub.path === modelPage) {
        assert.equal(labelsById.get('model-glm-54'), 'GLM-5.4');
        for (const { id, model } of snapshot.models) {
          assert.equal(labelsById.get(`model-${id}`), model);
        }
      }
      if (sub.path === '/chapter-14/rag-failure-modes-and-operational-design') {
        const [label, id] = traceHeading[lang];
        assert.equal(labelsById.get(id), label);
      }
    });
  });
}
