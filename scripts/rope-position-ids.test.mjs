import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { parse } from 'parse5';

const dist = process.env.SEARCH_DIST_DIR || 'dist';
const artifact = 'labs/2026-11/rope-position-ids.json';
const data = JSON.parse(readFileSync(join('public', artifact), 'utf8'));
const attr = (node, name) => node.attrs?.find(attribute => attribute.name === name)?.value;
const descendants = node => [node, ...(node.childNodes ?? []).flatMap(descendants)];
const text = node => node.value ?? (node.childNodes ?? []).map(text).join('');
const percent = weight => (100 * weight).toFixed(3) + '%';

test('the position shift keeps the tokens fixed and exposes the BF16 ties at 257 and 259', () => {
  assert.deepEqual(data.token_ids, [455, 2644]);
  assert.equal(data.model_dtype, 'float32');
  assert.deepEqual(data.rows.map(row => row.positions[0]), Array.from({length: 17}, (_, i) => i + 248));
  for (const row of data.rows) {
    const [p, q] = row.positions;
    assert.equal(q, p + 1);
    assert.ok(Math.abs(row.integer_weight - data.rows[0].integer_weight) < 1e-5);
    const gap = row.rounded_positions[1] - row.rounded_positions[0];
    const expectedWeight = { 0: 0.290336, 1: 0.338140, 2: 0.371778 }[gap];
    assert.ok(Math.abs(row.rounded_weight - expectedWeight) < 1e-5);
  }
  assert.deepEqual(data.rows.filter(row => [255, 256, 257, 258].includes(row.positions[0]))
    .map(row => row.rounded_positions), [[255, 256], [256, 256], [256, 258], [258, 260]]);
});

for (const edition of ['en', 'ko']) {
  test(`the ${edition} position figures render usable measured results before JavaScript starts`, () => {
    const page = join(dist, edition === 'ko' ? 'ko' : '', 'chapter-3/position-encoding-strategy/index.html');
    const nodes = descendants(parse(readFileSync(page, 'utf8')));
    const allFigures = nodes.filter(node => node.tagName === 'figure' && attr(node, 'class')?.includes('position-grid'));
    assert.equal(allFigures.length, 2);
    const controls = allFigures.flatMap(descendants).filter(node => node.tagName === 'input');
    assert.deepEqual(controls.map(input => attr(input, 'value')), ['1', '0', '256']);
    assert.ok(controls.every(input => attr(input, 'disabled') !== undefined));
    const replay = allFigures.find(node => attr(node, 'class').includes('rope-replay'));
    const row = data.rows.find(row => row.positions[0] === 256);
    assert.ok(text(replay).includes(percent(row.integer_weight)));
    assert.ok(text(replay).includes(percent(row.rounded_weight)));
    assert.ok(nodes.some(node => attr(node, 'href')?.endsWith('/' + artifact)));
    assert.ok(nodes.some(node => attr(node, 'href')?.endsWith('/labs/rope_position_ids.py')));
    assert.deepEqual(JSON.parse(readFileSync(join(dist, artifact), 'utf8')), data);
  });
}
