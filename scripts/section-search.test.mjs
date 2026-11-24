import assert from 'node:assert/strict';
import test from 'node:test';
import { findSections, readSectionIndex } from '../src/utils/section-search.js';

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
