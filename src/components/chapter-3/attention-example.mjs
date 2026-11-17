// Authored vectors: this is a numerical example, not a trained model's activations.
export const attentionTokens = ['The', 'cat', 'sat', 'here'];
export const queries = [[1, 0], [1, 1], [0, 1], [-1, 1]];
export const keys = [[1, 0], [1, 1], [0, 1], [-1, 0]];
export const values = [[1, 0], [0, 2], [2, 1], [-1, 1]];

export function calculateAttention(queryIndex, temperature = 1, causal = false) {
  const scores = keys.map((key, index) => causal && index > queryIndex
    ? -Infinity
    : queries[queryIndex].reduce((sum, q, dim) => sum + q * key[dim], 0) / (Math.sqrt(2) * temperature));
  const maxScore = Math.max(...scores);
  const exp = scores.map(score => Math.exp(score - maxScore));
  const total = exp.reduce((sum, value) => sum + value, 0);
  const weights = exp.map(value => value / total);
  const output = [0, 1].map(dim => values.reduce((sum, value, index) => sum + weights[index] * value[dim], 0));
  return { scores, weights, output };
}
