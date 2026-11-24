import { availableBytes } from './kv-capacity.mjs';

export const defaultWorkload = { batch: 32, sequence: 8192, generated: 0, layers: 80, heads: 8, dimension: 128, precision: 2 };
export const defaultPool = { total: '80', weights: '48', reserve: '8' };
export const defaultBudget = 24;

export const sliderRanges = {
  batch: { min: 1, max: 256, step: 1 },
  sequence: { min: 512, max: 131072, step: 512 },
  generated: { min: 0, max: 32768, step: 128 },
  layers: { min: 1, max: 120, step: 1 },
};
export const headCounts = [64, 32, 16, 8, 4, 2, 1];
export const dimensions = [64, 128, 256];
export const precisions = [4, 2, 1, 0.5];
export const budgetRange = { min: 1, max: 128, step: 1 };

const choices = { heads: headCounts, dimension: dimensions, precision: precisions };

// A link describes one complete calculation. Never combine half a shared
// workload with local defaults, since that can change the admission decision.
export function readKvScenario(search) {
  const params = new URLSearchParams(search);
  if (params.getAll('kv').length !== 1 || params.get('kv') !== '1') return null;

  function number(name) {
    const values = params.getAll(name);
    if (values.length !== 1 || !/^(?:\d+(?:\.\d+)?|\.\d+)(?:e[+-]?\d+)?$/i.test(values[0])) return NaN;
    return Number(values[0]);
  }
  const onSlider = (value, { min, max, step }) =>
    Number.isInteger(value) && value >= min && value <= max && (value - min) % step === 0;
  const workload = { ...defaultWorkload };
  for (const [key, range] of Object.entries(sliderRanges)) {
    workload[key] = number(key);
    if (!onSlider(workload[key], range)) return null;
  }
  for (const [key, allowed] of Object.entries(choices)) {
    workload[key] = number(key);
    if (!allowed.includes(workload[key])) return null;
  }

  if (params.has('budget')) {
    const budget = number('budget');
    if (!onSlider(budget, budgetRange) || Object.keys(defaultPool).some(key => params.has(key))) return null;
    return { workload, budget, deduct: false, pool: defaultPool };
  }
  const pool = { total: String(number('total')), weights: String(number('weights')), reserve: String(number('reserve')) };
  if (availableBytes([pool.total, pool.weights, pool.reserve]) === null) return null;
  return { workload, budget: defaultBudget, deduct: true, pool };
}

export function kvScenarioSearch({ workload, budget, deduct, pool }) {
  const params = new URLSearchParams({ kv: '1' });
  for (const key of Object.keys(defaultWorkload)) params.set(key, String(workload[key]));
  if (deduct) {
    if (availableBytes([pool.total, pool.weights, pool.reserve]) === null) return '';
    for (const key of Object.keys(defaultPool)) params.set(key, String(Number(pool[key])));
  } else {
    params.set('budget', String(budget));
  }
  return '?' + params.toString();
}

export function canonicalKvSearch(search) {
  const scenario = readKvScenario(search);
  return scenario ? kvScenarioSearch(scenario) : '';
}
