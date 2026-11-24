import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { socialCards } from '../src/data/social-cards.js';
import { bm25Results, denseResults, fuseRanks } from '../src/components/chapter-14/rank-fusion.mjs';

const example = (k, depth = 4, denseWeight = 1) => fuseRanks(denseResults, bm25Results, { k, depth, denseWeight });
const leaders = rows => rows.filter(row => row.place === 1).map(row => row.id);

test('fusion merges stable IDs and counts only retained ranks', () => {
  assert.deepEqual(example(60, 1), [
    { id: 'A', dense: null, bm25: 1, score: 1 / 61, place: 1 },
    { id: 'B', dense: 1, bm25: null, score: 1 / 61, place: 1 },
  ]);
  assert.deepEqual(example(60, 2)[0], { id: 'C', dense: 2, bm25: 2, score: 2 / 62, place: 1 });
  assert.equal(example(60).length, 5);
  assert.deepEqual(example(60).find(row => row.id === 'D'), { id: 'D', dense: 3, bm25: null, score: 1 / 63, place: 4 });
  assert.deepEqual(fuseRanks(['X', 'X', 'Y'], [], { k: 0, depth: 2 }).map(row => row.score), [1, 0.5]);
  assert.deepEqual(fuseRanks([], [], { k: 0, depth: 4 }), []);
});

test('finite crossover and weight changes follow the two lists', () => {
  assert.deepEqual(leaders(example(0)), ['A', 'B']);
  assert.deepEqual(example(2).map(row => [row.place, row.score]), [[1, .5], [1, .5], [1, .5], [4, .2], [4, .2]]);
  assert.deepEqual(leaders(example(3)), ['C']);
  assert.deepEqual(leaders(example(100)), ['C']);
  assert.deepEqual(leaders(example(60, 4, 2)), ['B']);
  assert.equal(example(60, 4, 2)[0].score, 2 / 61 + 1 / 64);
});

test('both editions run and link to the exact Python example used by the trace', () => {
  const code = ['', 'ko/'].map(locale => {
    const chapter = new URL(`../src/pages/${locale}chapter-14/advanced-retrieval.mdx`, import.meta.url);
    const source = readFileSync(chapter, 'utf8');
    const printed = source.match(/```python\n([\s\S]+?)\n```/)[1];
    const link = new URL(source.match(/^\[rrf-code-trace\]: <([^>]+)>$/m)[1]);
    assert.equal(link.origin + link.pathname, 'https://pythontutor.com/visualize.html');
    const options = new URLSearchParams(link.hash.slice(1));
    assert.equal(options.get('mode'), 'display');
    assert.equal(options.get('py'), '311');
    assert.equal(options.get('curInstr'), '22'); // C's second contribution, just before the update.
    assert.equal(options.get('code'), printed);
    return printed;
  });
  assert.equal(code[0], code[1]);
  const run = spawnSync('python3', ['-c', code[0]], { encoding: 'utf8' });
  assert.equal(run.status, 0, run.stderr);
});

test('shared previews preserve the two illustrated cutoffs in each language', () => {
  for (const lang of ['en', 'ko']) {
    const card = socialCards['/chapter-14/advanced-retrieval'][lang];
    const svgPath = new URL('../public' + card.image.replace(/\.png$/, '.svg'), import.meta.url);
    const svg = readFileSync(svgPath, 'utf8');
    const labels = [...svg.matchAll(/<text [^>]*>(.*?)<\/text>/g)].map(match => match[1]);
    for (const depth of [1, 2]) {
      for (const list of [denseResults, bm25Results]) {
        assert.ok(labels.includes(list.slice(0, depth).join(' → ')));
      }
    }
    assert.ok(labels.includes('2/62 &gt; 1/61'));
    assert.ok(labels.includes(lang === 'en' ? 'A and B tie' : 'A·B 공동 1위'));
    assert.ok(labels.includes(lang === 'en' ? 'C ranks first' : 'C가 1위'));
  }
});
