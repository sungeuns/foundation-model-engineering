export const releaseScenarios = /** @type {const} */ (['gain', 'uncertain', 'regression', 'missing']);

export function readReleaseScenario(search) {
  const values = new URLSearchParams(search).getAll('scenario');
  if (values.length !== 1) return null;
  return releaseScenarios.find(scenario => scenario === values[0]) ?? null;
}
