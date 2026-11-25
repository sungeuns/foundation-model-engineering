const teacherHidden = [1, 3];
const teacherWeights = [[2, -1], [1, 1]];

function logitsFor(hidden, weights) {
  return weights.map(row => row.reduce((sum, weight, i) => sum + weight * hidden[i], 0));
}

function softmax(logits) {
  const maximum = Math.max(...logits);
  const terms = logits.map(value => Math.exp(value - maximum));
  const total = terms.reduce((sum, value) => sum + value, 0);
  return terms.map(value => value / total);
}

const teacherProbabilities = softmax(logitsFor(teacherHidden, teacherWeights));

export function distillationReadout(swapHidden, swapReadout) {
  const hidden = swapHidden ? [teacherHidden[1], teacherHidden[0]] : teacherHidden;
  const weights = swapReadout ? teacherWeights.map(([a, b]) => [b, a]) : teacherWeights;
  const logits = logitsFor(hidden, weights);
  const probabilities = softmax(logits);
  const forwardKl = teacherProbabilities.reduce(
    (sum, p, i) => sum + p * Math.log(p / probabilities[i]), 0
  );
  const hiddenMse = hidden.reduce(
    (sum, value, i) => sum + (value - teacherHidden[i]) ** 2, 0
  ) / hidden.length;
  return { hidden, weights, logits, probabilities, forwardKl, hiddenMse };
}
