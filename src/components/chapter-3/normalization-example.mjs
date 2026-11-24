// Statistics over the features of one token, with identity affine parameters.
export function normalizeFeatures(values, epsilon) {
  const mean = values.reduce((sum, x) => sum + x, 0) / values.length;
  const variance = values.reduce((sum, x) => sum + (x - mean) ** 2, 0) / values.length;
  const meanSquare = values.reduce((sum, x) => sum + x ** 2, 0) / values.length;
  const layerScale = Math.sqrt(variance + epsilon);
  const rmsScale = Math.sqrt(meanSquare + epsilon);
  return {
    mean, variance, meanSquare,
    layer: values.map(x => (x - mean) / layerScale),
    rms: values.map(x => x / rmsScale),
    layerVariance: variance / (variance + epsilon),
  };
}
