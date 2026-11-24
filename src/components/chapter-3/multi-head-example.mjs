// Two scalar heads operating on the same three authored token vectors.
export const tokens = ['A', 'B', 'C'];
export const inputs = [[1, 0], [0, 1], [1, 1]];

export function calculateHeads(queryIndex, muteSecond = false) {
  const heads = [0, 1].map(axis => {
    const query = inputs[queryIndex][axis];
    const keys = inputs.map(input => input[axis]);
    const values = inputs.map(([x, y]) => axis === 0 ? x - y : 2 * y);
    // d_k = 1, so the square-root scale is one.
    const scores = keys.map(key => query * key);
    const max = Math.max(...scores);
    const exps = scores.map(score => Math.exp(score - max));
    const sum = exps.reduce((a, b) => a + b, 0);
    const weights = exps.map(value => value / sum);
    const output = weights.reduce((total, w, i) => total + w * values[i], 0);
    return { query, keys, values, scores, weights, output };
  });
  const first = heads[0].output;
  const second = muteSecond ? 0 : heads[1].output;
  return { heads, concat: [first, second], output: [first + second, first - second] };
}
