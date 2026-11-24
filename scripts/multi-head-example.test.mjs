import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateHeads } from '../src/components/chapter-3/multi-head-example.mjs';

function near(actual, expected) {
  assert.ok(Math.abs(actual - expected) < 1e-12, `${actual} ≠ ${expected}`);
}

test('two scalar heads project the same inputs independently and mix their signed values', () => {
  const denominator = 2 * Math.E + 1;
  const first = (Math.E - 1) / denominator;
  const second = 4 * Math.E / denominator;
  // A and C have the same first coordinate. B and C have the same second.
  const expected = [[first, 4 / 3], [0, second], [first, second]];
  for (const [query, [u, v]] of expected.entries()) {
    const actual = calculateHeads(query);
    near(actual.concat[0], u);
    near(actual.concat[1], v);
    near(actual.output[0], u + v);
    near(actual.output[1], u - v);
    for (const head of actual.heads) near(head.weights.reduce((a, b) => a + b, 0), 1);
    const muted = calculateHeads(query, true);
    assert.deepEqual(muted.heads, actual.heads);
    near(muted.concat[0], u);
    assert.equal(muted.concat[1], 0);
    near(muted.output[0], u);
    near(muted.output[1], u);
  }
});
