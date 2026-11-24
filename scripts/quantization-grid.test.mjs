import assert from 'node:assert/strict';
import test from 'node:test';
import { quantizationGrid, quantizeSignedRatio } from '../src/utils/quantization-grid.js';

test('the three-bit exercise has the same forward values and defined rounded-code mask in both modes', () => {
  const { rows, scale, mse } = quantizationGrid(3, 15);
  assert.equal(scale, .5);
  assert.deepEqual(rows.map(row => row.reconstructed), [-1.5, -1, -1, 0, 0, 1, 1.5, 1.5]);
  assert.deepEqual(rows.map(row => Number(!row.clamped)), [0, 1, 1, 1, 1, 1, 1, 0]);
  assert.deepEqual(rows.map(row => row.atJump), [false, true, true, false, true, true, false, false]);
  assert.ok(Math.abs(mse - .095) < 1e-12);
});

test('both chapter fixtures select the nearest even code at every supported scale and bit width', () => {
  const exercises = [
    { inputs: [-200, -125, -75, 0, 25, 125, 160, 200], start: 50, end: 400, step: 10 },
    { inputs: [12, -25, 8, 485, -15], start: 10, end: 500, step: 5 },
  ];
  for (let bits = 2; bits <= 8; bits++) {
    const limit = 2 ** (bits - 1) - 1;
    for (const { inputs, start, end, step } of exercises) {
      for (let bound = start; bound <= end; bound += step) {
        for (const input of inputs) {
          const actual = quantizeSignedRatio(input, bound, limit);
          // Compare the two integer neighbours by exact distance, breaking ties by parity.
          const left = Math.floor(input * limit / bound);
          const right = left + 1;
          const dl = input * limit - left * bound;
          const dr = right * bound - input * limit;
          const rounded = dl === dr ? (left % 2 === 0 ? left : right) : dl < dr ? left : right;
          assert.equal(actual.rounded, rounded);
          assert.equal(actual.code, Math.min(limit, Math.max(-limit, rounded)));
          assert.equal(actual.clamped, Math.abs(rounded) > limit);
          assert.equal(actual.atJump, dl === dr && left >= -limit && right <= limit);
        }
      }
    }
  }
});
