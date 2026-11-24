// This module worker is created only after the reader starts the exercise.
import { loadPyodide } from 'https://cdn.jsdelivr.net/pyodide/v314.0.8/full/pyodide.mjs';

const runtimeBase = 'https://cdn.jsdelivr.net/pyodide/v314.0.8/full/';
const scenarios = new Set(['gain', 'uncertain', 'regression', 'missing']);
let environment;

async function loadLab() {
  const [python, response] = await Promise.all([
    loadPyodide({ indexURL: runtimeBase }),
    fetch(new URL('paired_release.py', self.location.href)),
  ]);
  if (!response.ok) throw new Error('Could not load the exercise');
  const globals = python.runPython("dict(__name__='paired_release')");
  try {
    python.runPython(await response.text(), { globals });
  } catch (error) {
    globals.destroy();
    throw error;
  }
  return { python, globals };
}

self.onmessage = async ({ data }) => {
  try {
    const scenario = data?.scenario;
    if (!scenarios.has(scenario)) throw new Error('Unknown scenario');
    environment ??= loadLab();
    const { python, globals } = await environment;
    self.postMessage({ type: 'running' });
    globals.set('scenario', scenario);
    const result = python.runPython('json.dumps(packet(fixture(scenario)))', { globals });
    self.postMessage({ type: 'result', packet: JSON.parse(result) });
  } catch {
    self.postMessage({ type: 'error' });
  }
};
