import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { parse } from 'parse5';
import { chapters } from '../src/data/chapters.js';
import { normalizePathname, withPagePath } from '../src/utils/paths.js';

const output = process.env.SEARCH_DIST_DIR || 'dist';
const inventory = chapters.flatMap(chapter => chapter.subs);
const modelPage = '/chapter-17/commercial-model-benchmarks';
const snapshot = JSON.parse(readFileSync(new URL('../src/data/commercial-model-snapshot.json', import.meta.url)));
const modelIds = new Set(snapshot.models.map(({ id }) => `model-${id}`));
const labs = {
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
      if (node.parentNode?.tagName === 'main' && ['h2', 'h3'].includes(node.tagName)) {
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
    assert.deepEqual(Object.keys(index).sort(), ['chapters', 'lang', 'version']);
    assert.equal(index.version, 1);
    assert.equal(index.lang, lang);
    assert.deepEqual(index.chapters.map(chapter => chapter.path), localized.map(path => withPagePath(path, base)));

    inventory.forEach((sub, i) => {
      const entry = index.chapters[i];
      assert.deepEqual(Object.keys(entry).sort(), ['path', 'sections', 'title']);
      assert.equal(entry.title, sub.title[lang]);
      assert.ok(Array.isArray(entry.sections));
      const html = readFileSync(join(output, localized[i], 'index.html'), 'utf8');
      const { elementsById, chapterHeadings, outlineLinks } = renderedTargets(html);
      assert.deepEqual(outlineLinks, [...chapterHeadings], `static outline labels, order and targets: ${entry.path}`);
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
        assert.ok(tag === 'h2' || tag === 'h3' || (sub.path === modelPage && modelIds.has(id))
          || (labs[sub.path]?.id === id && tag === 'section'),
          `unexpected section target: ${entry.path}#${id}`);
        assert.ok(!labelsById.has(id), `duplicate: ${entry.path}#${id}`);
        labelsById.set(id, label);
      }
      for (const [id, label] of chapterHeadings) {
        if (id === 'quizzes' || id === 'references') continue;
        assert.equal(labelsById.get(id), label, `heading label: ${entry.path}#${id}`);
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
