import assert from 'node:assert/strict';
import test from 'node:test';
import { findSections, normalizeSearchText, readSectionIndex, searchPhrases } from '../src/utils/section-search.js';

const paths = new Set(['/book/architecture/', '/book/profiles/']);
const index = {
  version: 1,
  lang: 'en',
  chapters: [
    { path: '/book/architecture/', title: '4.6 Architecture', sections: [
      ['2. GLM-5.4 architecture disclosures', 'disclosures'],
      ['Timing the first token', 'latency'],
    ] },
    { path: '/book/profiles/', title: '17.6 Model profiles', sections: [
      ['GLM-5.4', 'model-glm-54'],
      ['첫 토큰 지연', '첫-토큰-지연'],
    ] },
  ],
};

test('an exact model precedes a partial heading, even when the earlier chapter also matches', () => {
  const rows = readSectionIndex(index, 'en', paths);
  const found = findSections(rows, ' ＧＬＭ—５.４ ', 1);
  assert.equal(found.total, 2);
  assert.deepEqual(found.matches.map(row => row.href), ['/book/profiles/#model-glm-54']);
  assert.equal(findSections(rows, 'profiles', 10).total, 0);
  assert.equal(findSections(rows, 'architecture first token').matches[0].label, 'Timing the first token');
  assert.equal(findSections(rows, '  ').total, 0);
  const [korean] = findSections(rows, '첫_토큰').matches;
  assert.equal(decodeURIComponent(new URL(korean.href, 'https://example.com').hash.slice(1)), '첫-토큰-지연');
});

test('Korean and English KV cache spellings return the same labeled sections in the same order', () => {
  const data = {
    lang: 'ko', version: 1,
    chapters: [{ path: '/book/serving/', title: '12.1 KV 캐시', sections: [
      ['KV Cache 압축', 'compression'], ['KV캐시', 'payload'], ['KV 캐시 계산기', 'calculator'],
      ['새 요청의 메모리', 'requests'], ['Self Attention', 'attention'],
    ] }],
  };
  const rows = readSectionIndex(data, 'ko', new Set(['/book/serving/']));
  const labels = query => findSections(rows, query).matches.map(row => row.label);
  for (const query of ['kv캐시', 'kv 캐시', 'kv cache', 'ＫＶ—Ｃａｃｈｅ']) {
    assert.deepEqual(labels(query), ['KV캐시', 'KV Cache 압축', 'KV 캐시 계산기']);
  }
  assert.deepEqual(labels('kv cache 계산기'), ['KV 캐시 계산기']);
  assert.deepEqual(labels('selfattention'), []);
  assert.deepEqual(labels('self attention'), ['Self Attention']);
  assert.equal(normalizeSearchText('한국어RRF검색'), '한국어 rrf 검색');
  for (const other of ['캐시미어', '캐시', 'memcache', 'kv caches']) {
    assert.deepEqual(searchPhrases(other), [other]);
  }
});

test('quantities stay searchable and numbered section titles keep their ranking', () => {
  const labels = [
    'Capacity planning for smaller models', '1. Capacity planning', '2) Capacity planning',
    '2.3. Capacity planning', '5.1 Capacity planning',
    '24 GiB KV 캐시 계산기 예제', '3-bit weights', '1.5 GiB budget',
  ];
  const demo = { version: 1, lang: 'ko', chapters: [{
    path: '/book/serving/', title: '메모리',
    sections: labels.map((label, i) => [label, 'example-' + i]),
  }] };
  const rows = readSectionIndex(demo, 'ko', new Set(['/book/serving/']));
  const results = query => findSections(rows, query).matches.map(row => row.label);
  assert.deepEqual(results('capacity planning'), [...labels.slice(1, 5), labels[0]]);
  assert.deepEqual(results('24 GiB KV 캐시 계산기'), [labels[5]]);
  assert.deepEqual(results('3-bit'), [labels[6]]);
  assert.deepEqual(results('1.5 GiB'), [labels[7]]);
  assert.deepEqual(results('1.5'), [labels[7]]);
});

test('reject index responses for the wrong deployment, locale, version, or malformed section pair', () => {
  for (const mutate of [
    data => { data.version = 2; },
    data => { data.lang = 'ko'; },
    data => { data.chapters[0].path = 'https://example.com/other/'; },
    data => { data.chapters[0].path = data.chapters[1].path; },
    data => { data.chapters.pop(); },
    data => { data.chapters[0].sections[0] = ['Missing ID']; },
    data => { data.chapters[0].sections[0][1] = ' '; },
  ]) {
    const changed = structuredClone(index);
    mutate(changed);
    assert.throws(() => readSectionIndex(changed, 'en', paths));
  }
});
