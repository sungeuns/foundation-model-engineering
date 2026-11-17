import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateAttention, values } from '../src/components/chapter-3/attention-example.mjs';
import { passAtK } from '../src/components/chapter-17/pass-at-k.mjs';

const close = (a, b) => assert.ok(Math.abs(a - b) < 1e-12, `${a} != ${b}`);
test('attention: every selectable query/temperature/mask state normalizes; masked values cannot contribute', () => {
  for (let query = 0; query < 4; query++) for (const causal of [false, true]) for (let temperature = .25; temperature <= 2; temperature += .25) {
    const { weights, output } = calculateAttention(query, temperature, causal);
    close(weights.reduce((sum, w) => sum + w, 0), 1);
    assert.ok(weights.every(w => Number.isFinite(w) && w >= 0));
    if (causal) weights.slice(query + 1).forEach(w => assert.equal(w, 0));
    output.forEach((o, dim) => {
      const visible = values.slice(0, causal ? query + 1 : values.length).map(v => v[dim]);
      assert.ok(o >= Math.min(...visible) - 1e-12 && o <= Math.max(...visible) + 1e-12);
    });
  }
  assert.deepEqual(calculateAttention(0, .25, true).output, values[0]);
  assert.deepEqual(calculateAttention(0, 2, true).output, values[0]);
  assert.ok(calculateAttention(1, .25).weights[1] > calculateAttention(1, 2).weights[1]);
});
test('pass@k agrees with exhaustive enumeration of small finite sample pools', () => {
  for (let n = 1; n <= 9; n++) for (let c = 0; c <= n; c++) for (let k = 1; k <= n; k++) {
    let subsets = 0, successes = 0;
    for (let mask = 0; mask < 2 ** n; mask++) {
      if ([...mask.toString(2)].filter(b => b === '1').length !== k) continue;
      subsets++;
      if (mask & ((1 << c) - 1)) successes++;
    }
    close(passAtK(n, c, k), successes / subsets);
  }
  assert.throws(() => passAtK(1, 2, 1), RangeError);
  assert.throws(() => passAtK(3, 1, 4), RangeError);
});
