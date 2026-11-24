import assert from 'node:assert/strict';
import test from 'node:test';
import { retrievalFragments, retrievalQuery } from '../src/components/chapter-14/retrieval-presets.js';
import { localeHref, sharedLocaleFragments } from '../src/utils/locale-fragments.js';
import { compareTitles, examples } from '../src/components/chapter-14/lexical-dense.mjs';

test('exact identifiers, paraphrases and ties are calculated from the indexed titles in both editions', () => {
  const shared = Math.log(2);
  const rare = Math.log(10 / 3);
  for (const locale of ['en', 'ko']) {
    const [paraphrase, identifier, combined, book] = examples[locale].presets;
    const scores = query => compareTitles(locale, query).rows;
    const bm25 = query => scores(query).map(row => row.bm25);
    const cosines = query => scores(query).map(row => row.cosine);
    assert.deepEqual(bm25(paraphrase), [0, 0, 0, 0]);
    assert.deepEqual(cosines(paraphrase), [0, 0, 1, 0]);
    assert.deepEqual(cosines(book), [0, 0, 0, 1]);
    assert.deepEqual(cosines(combined), [1, 1, 0, 0]);
    assert.deepEqual(cosines(identifier), [null, null, null, null]);
    assert.deepEqual(bm25(identifier), [0, rare, 0, 0]);
    assert.deepEqual(bm25(combined), [shared, shared + rare, 0, 0]);
  }
});

test('typed terms preserve whole codes, repeat policy and missing vectors', () => {
  const lexical = query => compareTitles('en', query).rows.map(row => row.bm25);
  assert.deepEqual(lexical('xj-992-b'), lexical('ＸＪ-９９２-Ｂ xj-992-b!'));
  assert.deepEqual(lexical('992'), [0, 0, 0, 0]);
  assert.deepEqual(compareTitles('en', '  ').tokens, []);
  assert.ok(compareTitles('ko', '???').rows.every(row => row.bm25 === 0 && row.cosine === null));
  const mixed = compareTitles('en', 'tire activation');
  assert.deepEqual(mixed.queryVector, [1, 1, 0]);
  for (const row of mixed.rows.slice(0, 3)) assert.ok(Math.abs(row.cosine - 2 ** -0.5) < 1e-12);
  assert.equal(mixed.rows[3].cosine, 0);
});

test('published retrieval fragments reopen the same measurement in both editions', () => {
  const expected = ['C', 'B', 'AB', 'D'];
  for (const [i, fragment] of retrievalFragments.entries()) {
    const hash = '#' + fragment;
    for (const locale of ['en', 'ko']) {
      const { presets } = examples[locale];
      const query = retrievalQuery(presets, hash);
      assert.equal(query, presets[i]);
      assert.equal(retrievalQuery(presets, hash.replace('lexical-', '%6Cexical-')), query);
      const { rows } = compareTitles(locale, query);
      const leaders = rows.filter(row => row.cosine === 1).map(row => row.id).join('');
      if (i === 1) assert.deepEqual(rows.filter(row => row.bm25 > 0).map(row => row.id), ['B']);
      else assert.equal(leaders, expected[i]);
      assert.equal(localeHref('/other/', hash, sharedLocaleFragments('/chapter-14/lexical-to-semantic-search')), '/other/' + hash);
    }
  }
  for (const locale of ['en', 'ko']) {
    const { presets } = examples[locale];
    for (const hash of ['', '#lexical-dense-example', '#nonsense', '#references', '#%E0%A4%A']) {
      assert.equal(retrievalQuery(presets, hash), presets[2]);
    }
  }
});
