// Authored teaching vectors, not extracted activations or measured model scores.
export const lensTokens = ['Paris', 'London', 'city', 'other'];
export const lensStates = [[0.6, 1.2, -0.6], [1.5, 0.3, -0.3], [1.2, 0.6, 0.3]];
export const lensHead = [[1, 0, 0], [0, 1, 0], [0, 0, 1], [-0.5, -0.5, -0.5]];
export function readToyState(index, normalize = true) {
  if (!Number.isInteger(index) || index < 0 || index >= lensStates.length) throw new RangeError('Unknown authored state');
  const raw = lensStates[index];
  const divisor = normalize ? Math.sqrt(raw.reduce((sum, x) => sum + x * x, 0) / raw.length + 1e-5) : 1;
  const state = raw.map(x => x / divisor);
  const logits = lensHead.map(row => row.reduce((sum, weight, i) => sum + weight * state[i], 0));
  const maximum = Math.max(...logits);
  const exp = logits.map(z => Math.exp(z - maximum));
  const denominator = exp.reduce((sum, x) => sum + x, 0);
  const probabilities = exp.map(x => x / denominator);
  return { raw, state, logits, probabilities, top: probabilities.indexOf(Math.max(...probabilities)) };
}
