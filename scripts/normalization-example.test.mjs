import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizeFeatures } from '../src/components/chapter-3/normalization-example.mjs';

function close(actual, expected) {
  assert.ok(Math.abs(actual - expected) < 1e-9, `expected ${expected}, got ${actual}`);
}

test('near-constant features match the float64 PyTorch LayerNorm and RMSNorm results', () => {
  const input = [1, 1.002];
  // torch.nn.functional.layer_norm and rms_norm, no affine transform.
  for (const [epsilon, ln, rms1, rms2, variance] of [
    [1e-5, 0.301511344578, 0.998995515513, 1.000993506544, 1 / 11],
    [1e-3, 0.031606977062, 0.998502371069, 1.000499375811, 1 / 1001],
  ]) {
    const result = normalizeFeatures(input, epsilon);
    close(result.layer[0], -ln);
    close(result.layer[1], ln);
    close(result.rms[0], rms1);
    close(result.rms[1], rms2);
    close(result.layerVariance, variance);
  }
});

test('LayerNorm removes a common offset and a constant input has zero output variance', () => {
  for (const epsilon of [1e-5, 1e-3]) {
    const original = normalizeFeatures([1, 3], epsilon);
    const shifted = normalizeFeatures([11, 13], epsilon);
    assert.deepEqual(shifted.layer, original.layer);
    assert.notDeepEqual(shifted.rms, original.rms);
    assert.equal(original.variance, 1);
    assert.equal(original.meanSquare, 5);
    const constant = normalizeFeatures([2, 2], epsilon);
    assert.deepEqual(constant.layer, [0, 0]);
    assert.equal(constant.layerVariance, 0);
    close(constant.rms[0], 2 / Math.sqrt(4 + epsilon));
  }
});
