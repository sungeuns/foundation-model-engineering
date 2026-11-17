import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { readToyState } from '../src/components/chapter-19/logit-lens-calculations.js';

// Independently computed with the on-page PyTorch FP64 matrix/softmax example.
const expected = {
  normalized: [
    [0.28454818555136246, 0.5770936043426548, 0.06917910505299134, 0.06917910505299134],
    [0.6752091759227677, 0.1779846712775417, 0.09138075320750504, 0.05542539959218557],
    [0.5405132493987534, 0.25381260099320474, 0.17392683634716954, 0.031747313260872205],
  ],
  raw: [
    [0.2920128165970669, 0.5320820430765012, 0.08795257016321598, 0.08795257016321598],
    [0.636175890860475, 0.19161249608526387, 0.10515916747261389, 0.0670524455816473],
    [0.48525303403372716, 0.26631251152764013, 0.19728916093518584, 0.051145293503446806],
  ],
};
test('every toy lens state and normalization setting matches independent FP64 readouts', () => {
  for (const normalize of [false, true]) for (let i = 0; i < 3; i++) {
    const result = readToyState(i, normalize);
    const target = expected[normalize ? 'normalized' : 'raw'][i];
    result.probabilities.forEach((p, j) => {
      assert.ok(Number.isFinite(p) && p > 0 && p < 1);
      assert.ok(Math.abs(p - target[j]) < 1e-12);
    });
    assert.ok(Math.abs(result.probabilities.reduce((a, b) => a + b, 0) - 1) < 1e-12);
    assert.equal(result.top, i === 0 ? 1 : 0);
  }
  assert.notDeepEqual(readToyState(1).probabilities, readToyState(2).probabilities);
  for (const invalid of [-1, 3, 0.5, NaN]) assert.throws(() => readToyState(invalid), RangeError);
});
test('bilingual logit-lens executable examples stay equivalent', () => {
  const code = locale => fs.readFileSync(new URL(`../src/pages/${locale}chapter-19/logit-lens-and-attention-visualization.mdx`, import.meta.url), 'utf8').match(/```python\n([\s\S]*?)```/)[1];
  assert.equal(code(''), code('ko/'));
});
