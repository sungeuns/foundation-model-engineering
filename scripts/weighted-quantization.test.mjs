import assert from 'node:assert/strict';
import test from 'node:test';
import { weightedQuantization } from '../src/utils/weighted-quantization.js';

test('a negative midpoint takes the even code before the activation weights its error', () => {
  const { rows, original, output } = weightedQuantization(3, 50);
  assert.deepEqual(rows.map(row => row.code), [1, -2, 0, 3, -1]);
  assert.equal(rows[1].reconstructed, -1 / 3);
  assert.ok(Math.abs(rows[1].contribution + 2 / 3) < 1e-12);
  assert.ok(Math.abs(rows[3].contribution + 0.435) < 1e-12);
  assert.equal(original.toFixed(3), '-1.615');
  assert.equal(output.toFixed(3), '-2.783');
  assert.equal(weightedQuantization(3, 15).rows[4].contribution, 0);
});

test('slider endpoints preserve clipping, round-to-zero, and the sum of signed errors', () => {
  for (const [bits, bound, codes] of [
    [2, 10, [1, -1, 1, 1, -1]],
    [2, 500, [0, 0, 0, 1, 0]],
    [8, 10, [127, -127, 102, 127, -127]],
    [8, 500, [3, -6, 2, 123, -4]],
  ]) {
    const { rows, original, output } = weightedQuantization(bits, bound);
    assert.deepEqual(rows.map(row => row.code), codes);
    const sum = rows.reduce((value, row) => value + row.contribution, 0);
    assert.ok(Math.abs(output - original - sum) < 1e-12);
  }
});
