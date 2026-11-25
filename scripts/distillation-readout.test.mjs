import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { distillationReadout } from '../src/components/chapter-13/distillation-readout.mjs';

const expected = [
  [false, false, [-1, 4], 0.993307150, 0, 0],
  [false, true, [5, 4], 0.268941421, 1.266389233, 0],
  [true, false, [5, 4], 0.268941421, 1.266389233, 4],
  [true, true, [-1, 4], 0.993307150, 0, 4],
];

test('independent hidden and readout swaps separate hidden MSE from forward KL', () => {
  for (const [hidden, readout, logits, prob, kl, mse] of expected) {
    const actual = distillationReadout(hidden, readout);
    assert.deepEqual(actual.logits, logits);
    assert.ok(Math.abs(actual.probabilities[1] - prob) < 1e-8);
    assert.ok(Math.abs(actual.forwardKl - kl) < 1e-8);
    assert.equal(actual.hiddenMse, mse);
  }
});

test('both language editions print the independently calculated four cases', () => {
  const output = expected.map(([, , , prob, kl, mse]) => [prob.toFixed(6), kl.toFixed(6), mse].join(' ')).join('\n');
  for (const prefix of ['', 'ko/']) {
    const path = '../src/pages/' + prefix + 'chapter-13/knowledge-distillation.mdx';
    const source = readFileSync(new URL(path, import.meta.url), 'utf8');
    const code = source.match(/```python\n(from math import exp, log\n[\s\S]*?)```/)[1];
    assert.equal(execFileSync('python3', ['-c', code], { encoding: 'utf8' }).trim(), output);
  }
});
