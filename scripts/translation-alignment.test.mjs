import assert from 'node:assert/strict';
import test from 'node:test';
import { sourceWords, targetSteps, translationReadout } from '../src/utils/toy-translation.js';

// Values for the published example, independently calculated in float64 PyTorch.
const cases = [
  ['renard', 'additive', [0.96402758, 1.52318831], [0.36374167, 0.63625833]],
  ['renard', 'dot', [1, 0], [0.73105858, 0.26894142]],
  ['roux', 'additive', [1.52318831, 0.96402758], [0.63625833, 0.36374167]],
  ['roux', 'dot', [0, 1], [0.26894142, 0.73105858]],
];

function close(actual, expected) {
  assert.equal(actual.length, expected.length);
  for (let i = 0; i < actual.length; i++) {
    assert.ok(Math.abs(actual[i] - expected[i]) < 1e-7, `${actual[i]} vs ${expected[i]}`);
  }
}

test('both scoring rules reproduce each target step in source-word order', () => {
  assert.deepEqual(sourceWords, ['red', 'fox']);
  assert.deepEqual(targetSteps.map(step => step.word), ['renard', 'roux']);
  for (const [word, method, scores, weights] of cases) {
    const { query } = targetSteps.find(step => step.word === word);
    const readout = translationReadout(query, method);
    close(readout.scores, scores);
    close(readout.weights, weights);
    // The lesson's two source states are orthogonal coordinate vectors.
    close(readout.context, weights);
  }
});
