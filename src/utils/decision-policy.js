// Deterministic teaching data; these are not measurements of a deployed model.
export function decisionCases(shifted = false) {
  const positives = shifted ? [3, 3, 4, 4, 5, 5, 6, 6, 7, 7] : [1, 1, 3, 3, 5, 5, 7, 7, 9, 9];
  return positives.flatMap((count, bin) => Array.from({ length: 10 }, (_, i) => ({
    p: (bin + 0.5) / 10, y: Number(i < count),
  })));
}

export function evaluateDecisionPolicy(cases, threshold, falsePositiveCost, falseNegativeCost, reviewCost) {
  let accepted = 0, fp = 0, fn = 0, expected = 0;
  for (const { p, y } of cases) {
    const positive = (1 - p) * falsePositiveCost;
    const negative = p * falseNegativeCost;
    const predictPositive = positive <= negative;
    const chosenProbability = predictPositive ? p : 1 - p;
    if (chosenProbability < threshold) continue;
    accepted++;
    expected += Math.min(positive, negative);
    fp += Number(predictPositive && !y);
    fn += Number(!predictPositive && y);
  }
  const reviewed = cases.length - accepted;
  return {
    accepted, reviewed, fp, fn, coverage: accepted / cases.length,
    risk: accepted ? (fp + fn) / accepted : null,
    expectedCost: (expected + reviewed * reviewCost) / cases.length,
    observedCost: (fp * falsePositiveCost + fn * falseNegativeCost + reviewed * reviewCost) / cases.length,
  };
}
