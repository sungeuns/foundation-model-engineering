import { availableBytes, GiB } from './kv-capacity.mjs';

export const defaultWorkload = { batch: 32, sequence: 8192, generated: 0, layers: 80, heads: 8, dimension: 128, precision: 2 };
export const nineRequestWorkload = { ...defaultWorkload, batch: 9, generated: 2048 };
export const smolPaddedWorkload = { batch: 2, sequence: 11, generated: 4, layers: 30, heads: 3, dimension: 64, precision: 4 };
export const defaultPool = { total: '80', weights: '48', reserve: '8' };
export const defaultBudget = 24;

export const workloadRanges = {
  batch: { min: 1, max: 256 },
  sequence: { min: 1, max: 131072 },
  generated: { min: 0, max: 32768 },
  layers: { min: 1, max: 120 },
  heads: { min: 1, max: 64 },
  dimension: { min: 1, max: 256 },
};
export const precisions = [4, 2, 1, 0.5];

export function inWorkloadRange(value, { min, max }) {
  return Number.isInteger(value) && value >= min && value <= max;
}

export function completeBytePairs(workload) {
  return workload.precision !== 0.5 || workload.dimension % 2 === 0;
}

export function validWorkload(workload) {
  return precisions.includes(workload.precision) && completeBytePairs(workload) && Object.entries(workloadRanges)
    .every(([key, range]) => inWorkloadRange(workload[key], range));
}

export function netBudgetBytes(budget) {
  if (!Number.isFinite(budget)) return null;
  const bytes = Math.floor(budget * GiB);
  return Number.isSafeInteger(bytes) && bytes > 0 ? bytes : null;
}

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
  const workload = { ...defaultWorkload };
  for (const key of Object.keys(workload)) workload[key] = number(key);
  if (!validWorkload(workload)) return null;

  if (params.has('budget')) {
    const budget = number('budget');
    if (netBudgetBytes(budget) === null || Object.keys(defaultPool).some(key => params.has(key))) return null;
    return { workload, budget, deduct: false, pool: defaultPool };
  }
  const pool = { total: String(number('total')), weights: String(number('weights')), reserve: String(number('reserve')) };
  if (availableBytes([pool.total, pool.weights, pool.reserve]) === null) return null;
  return { workload, budget: defaultBudget, deduct: true, pool };
}

export function kvScenarioSearch({ workload, budget, deduct, pool }) {
  if (!validWorkload(workload)) return '';
  const params = new URLSearchParams({ kv: '1' });
  for (const key of Object.keys(defaultWorkload)) params.set(key, String(workload[key]));
  if (deduct) {
    if (availableBytes([pool.total, pool.weights, pool.reserve]) === null) return '';
    for (const key of Object.keys(defaultPool)) params.set(key, String(Number(pool[key])));
  } else {
    if (netBudgetBytes(budget) === null) return '';
    params.set('budget', String(budget));
  }
  return '?' + params.toString();
}

export function canonicalKvSearch(search) {
  const scenario = readKvScenario(search);
  return scenario ? kvScenarioSearch(scenario) : '';
}
