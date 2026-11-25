import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { parse } from 'parse5';

const dist = process.env.SEARCH_DIST_DIR || 'dist';
const chapter = 'chapter-17/elo-rating-and-leaderboards';
function nodes(node, match) {
  return (match(node) ? [node] : []).concat((node.childNodes || []).flatMap(child => nodes(child, match)));
}
const text = node => node.value ?? node.childNodes.map(text).join('');
const tag = name => node => node.tagName === name;

test('the four votes shown in each published chart reproduce the chapter’s executable Elo replay', () => {
  for (const locale of ['', 'ko']) {
    const manuscript = readFileSync(join('src/pages', locale, chapter + '.mdx'), 'utf8');
    const replay = manuscript.match(/```python\n(def replay[\s\S]*?)\n```/)[1];
    const output = execFileSync('python3', ['-c', replay], { encoding: 'utf8' });
    const [first, last] = output.trim().split('\n').map(line => JSON.parse(line));
    assert.deepEqual(first, [1500, 1516, 1530.5, 1511.7, 1494.7]);
    assert.deepEqual(last, [1500, 1484, 1469.5, 1488.3, 1505.3]);
    const html = parse(readFileSync(join(dist, locale, chapter, 'index.html'), 'utf8'));
    const figure = nodes(html, node => node.tagName === 'figure' && node.attrs.some(
      attr => attr.name === 'class' && attr.value.split(' ').includes('vote-order')))[0];
    const rows = nodes(figure, tag('tbody')).flatMap(body => nodes(body, tag('tr')));
    assert.deepEqual(rows.map(row => nodes(row, tag('td')).map(cell => Number(text(cell)))),
      first.map((rating, index) => [rating, last[index]]));
    const paths = nodes(figure, tag('polyline')).map(line =>
      line.attrs.find(attr => attr.name === 'points').value.split(' ').map(pair => pair.split(',').map(Number)));
    assert.equal(paths.length, 2);
    for (const [i, [step, y]] of paths[0].entries()) {
      assert.equal(step, paths[1][i][0]);
      if (i) assert.equal(Math.sign(paths[1][i][1] - y), Math.sign(first[i] - last[i]));
    }
  }
});
