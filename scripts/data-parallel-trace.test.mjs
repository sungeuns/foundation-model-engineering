import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { parse } from 'parse5';

const dist = process.env.SEARCH_DIST_DIR || 'dist';

function elements(node, tag) {
  const children = (node.childNodes || []).flatMap(child => elements(child, tag));
  return node.tagName === tag ? [node, ...children] : children;
}

const text = node => node.value ?? node.childNodes.map(text).join(' ');

test('both editions reproduce a masked DDP step against an unsharded reference', () => {
  for (const locale of ['', 'ko']) {
    const html = readFileSync(join(dist, locale, 'chapter-7/data-parallelism/index.html'), 'utf8');
    const table = elements(parse(html), 'table').find(node => text(node).includes('(−1.5, 1.75)'));
    assert.ok(table);
    const rows = elements(table, 'tr').slice(1).map(row => elements(row, 'td').map(text));
    const cases = [[1, 1], [1, 3], [0, 3], [0, 0]];
    assert.equal(rows.length, cases.length);
    for (const [index, [left, right]] of cases.entries()) {
      const total = left + right;
      const rankMean = ((left ? 1 : 0) + (right ? -3 : 0)) / 2;
      const tokenMean = total ? (left - 3 * right) / total : 0;
      const step = gradient => total
        ? '(' + String(gradient).replace('-', '−') + ', ' + (1 - 0.5 * gradient) + ')'
        : (locale ? '(그래디언트 없음, 1)' : '(no gradient, 1)');
      assert.deepEqual(rows[index], [[left, right].join(', '), step(rankMean), step(tokenMean), step(tokenMean)]);
    }
  }
});

test('both rendered gradient traces distinguish the gathered loss from the per-rank mean', () => {
  const local = [0, 4].map(target => 1 - target);
  const contributions = local.map(gradient => gradient / local.length);
  const gradient = contributions.reduce((a, b) => a + b);
  const newWeight = 1 - 0.5 * gradient;
  const signed = value => value < 0 ? '−' + Math.abs(value) : '+' + value;
  for (const locale of ['', 'ko']) {
    const html = readFileSync(join(dist, locale, 'chapter-7/data-parallelism/index.html'), 'utf8');
    assert.doesNotMatch(html, /dp_vs_ddp_topology/);
    assert.match(html, /id="dp-ddp-gradient-trace"/);
    const figure = elements(parse(html), 'figure').find(node =>
      node.attrs.some(attr => attr.name === 'class' && attr.value.split(' ').includes('gradient-trace')));
    assert.ok(figure);
    assert.equal(elements(figure, 'figcaption').length, 1);
    const download = elements(figure, 'a').find(link =>
      link.attrs.some(attr => attr.name === 'download' && attr.value === 'verify-dp-ddp-gradients.py'));
    assert.ok(download);
    const href = download.attrs.find(attr => attr.name === 'href').value;
    assert.match(href, /^\/foundation-model-engineering\/_astro\/.+\.py$/);
    const relativePath = href.slice('/foundation-model-engineering/'.length);
    assert.deepEqual(readFileSync(join(dist, relativePath)), readFileSync(new URL('./verify-dp-ddp-gradients.py', import.meta.url)));
    const paths = elements(figure, 'ol');
    assert.equal(paths.length, 2);
    for (const [index, gradients] of [contributions, local].entries()) {
      const steps = elements(paths[index], 'li').map(text);
      assert.equal(steps.length, 3);
      for (const value of gradients) assert.ok(steps[1].includes(signed(value)));
      assert.ok(steps[2].includes(signed(gradient)));
      assert.ok(steps[2].includes(String(newWeight)));
    }
  }
});
