// Hand-chosen states for the two-word lesson. No translator is trained here.
export const sourceWords = ['red', 'fox'];
export const sourceStates = [[1, 0], [0, 1]];
export const targetSteps = [
  { word: 'renard', query: [1, 0] },
  { word: 'roux', query: [0, 1] },
];

export function translationReadout(query, method) {
  const scores = sourceStates.map(([h0, h1]) =>
    method === 'additive'
      ? Math.tanh(query[0] + h0) + Math.tanh(query[1] + h1)
      : query[0] * h0 + query[1] * h1);
  const maxScore = Math.max(...scores);
  const exponentials = scores.map(score => Math.exp(score - maxScore));
  const total = exponentials.reduce((sum, value) => sum + value, 0);
  const weights = exponentials.map(value => value / total);
  const context = [0, 1].map(axis =>
    sourceStates.reduce((sum, state, i) => sum + weights[i] * state[axis], 0));
  return { scores, weights, context };
}
