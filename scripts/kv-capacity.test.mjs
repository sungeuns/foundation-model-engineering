import assert from 'node:assert/strict';
import test from 'node:test';
import { availableBytes, GiB, kvCapacity } from '../src/components/chapter-12/kv-capacity.mjs';
import { canonicalKvSearch, defaultBudget, defaultPool, defaultWorkload, kvScenarioSearch, netBudgetBytes, readKvScenario, smolPaddedWorkload } from '../src/components/chapter-12/kv-scenario.mjs';

const example = { batch: 9, sequence: 8192, generated: 2048, layers: 80, heads: 8, dimension: 128, precision: 2 };

test('nine prompts fit, ten prompts exceed the pool, and only seven full-length caches fit at once', () => {
  const budget = availableBytes(['80', '48', '8']);
  assert.equal(budget, 24 * GiB);
  const {prompt, peak} = kvCapacity(example, budget);
  assert.deepEqual(prompt, { tokens: 8192, perSequence: 2.5 * GiB, requested: 22.5 * GiB, capacity: 9, balance: 1.5 * GiB });
  assert.deepEqual(peak, { tokens: 10240, perSequence: 3.125 * GiB, requested: 28.125 * GiB, capacity: 7, balance: -4.125 * GiB });
  const oneAtCapWithEightWaitingPrompts = peak.perSequence + (example.batch - 1) * prompt.perSequence;
  assert.equal(oneAtCapWithEightWaitingPrompts, 23.125 * GiB);
  assert.ok(oneAtCapWithEightWaitingPrompts <= budget);
  assert.equal(kvCapacity({...example, batch: 10}, budget).prompt.balance, -GiB);
  assert.equal(kvCapacity(example, prompt.perSequence * 9).prompt.capacity, 9);
  assert.equal(kvCapacity(example, prompt.perSequence * 9 - 1).prompt.capacity, 8);
});

test('missing amounts stay unknown, and pre-existing deficits cannot admit a sequence', () => {
  for (const v of ['', ' ', '-1', 'Infinity', 'bad']) {
    const budget = availableBytes(['80', v, '8']);
    assert.equal(budget, null);
    assert.equal(kvCapacity(example, budget).peak.capacity, null);
  }
  assert.equal(availableBytes(['24.5', '20.25', '4.25']), 0);
  const budget = availableBytes(['24', '20.25', '4.25']);
  assert.equal(budget, -0.5 * GiB);
  assert.equal(kvCapacity(example, budget).prompt.capacity, 0);
});

test('prompt-only and packed INT4 payloads preserve byte units even for tiny configurations', () => {
  const config = { batch: 1, sequence: 512, generated: 0, layers: 1, heads: 1, dimension: 64, precision: 0.5 };
  const {prompt, peak} = kvCapacity(config, GiB);
  assert.equal(prompt.perSequence, 32768);
  assert.equal(prompt.capacity, 32768);
  assert.deepEqual(prompt, peak);
});

test('a share link restores every active input and reproduces the admission result', () => {
  const defaults = { workload: defaultWorkload, deduct: false, budget: defaultBudget, pool: defaultPool };
  const changed = { workload: example, deduct: true, budget: defaultBudget, pool: { total: '80.25', weights: '48.25', reserve: '8' } };
  const smallest = { ...defaults, workload: { batch: 1, sequence: 512, generated: 0, layers: 1, heads: 1, dimension: 64, precision: 0.5 }, budget: 1 };
  const largest = { ...defaults, workload: { batch: 256, sequence: 131072, generated: 32768, layers: 120, heads: 64, dimension: 256, precision: 4 }, budget: 128 };
  for (const scenario of [defaults, changed, smallest, largest]) {
    const search = kvScenarioSearch(scenario);
    assert.deepEqual(readKvScenario(search), scenario);
    assert.equal(canonicalKvSearch(search + '&utm_source=book'), search);
  }
  const restored = readKvScenario(kvScenarioSearch(changed));
  const { peak } = kvCapacity(restored.workload, availableBytes(Object.values(restored.pool)));
  assert.equal(peak.capacity, 7);
  assert.equal(peak.requested, 28.125 * GiB);
  assert.equal(kvScenarioSearch({ ...changed, pool: { ...changed.pool, total: '' } }), '');
  const zero = readKvScenario(kvScenarioSearch({ ...changed, pool: { total: '0', weights: '0', reserve: '0' } }));
  assert.deepEqual(zero.pool, { total: '0', weights: '0', reserve: '0' });
});

test('partial, ambiguous or out-of-range shared settings never become a different calculation', () => {
  const search = kvScenarioSearch({ workload: defaultWorkload, deduct: false, budget: 24, pool: defaultPool });
  for (const bad of [
    '', '?kv=1&batch=9', search + '&batch=1', search + '&kv=1', search + '&total=80',
    search.replace('kv=1','kv=2'), search.replace('batch=32','batch=257'),
    search.replace('sequence=8192','sequence=0'), search.replace('generated=0','generated=1.5'),
    search.replace('layers=80','layers=0'), search.replace('heads=8','heads=65'),
    search.replace('dimension=128','dimension=NaN'), search.replace('precision=2','precision=0'),
    search.replace('budget=24','budget='), search.replace('budget=24','total=80&weights=48'),
    search.replace('budget=24','total=1e50&weights=0&reserve=0'),
    search.replace('budget=24','total=80&weights=-1&reserve=8'),
  ]) {
    assert.equal(readKvScenario(bad), null, bad);
    assert.equal(canonicalKvSearch(bad), '', bad);
  }
});

test('the measured padded FP32 batch and the 120 MiB notebook challenge round-trip exactly', () => {
  const budget = 120 / 1024;
  for (const [workload, promptKiB, peakKiB] of [
    [smolPaddedWorkload, 990, 1350],
    [{ ...smolPaddedWorkload, batch: 1, sequence: 3 }, 135, 315],
    [{ ...smolPaddedWorkload, batch: 1 }, 495, 675],
    [{ ...smolPaddedWorkload, batch: 4, sequence: 512, generated: 256 }, 90 * 1024, 135 * 1024],
  ]) {
    const scenario = { workload, budget, deduct: false, pool: defaultPool };
    const restored = readKvScenario(kvScenarioSearch(scenario));
    assert.deepEqual(restored, scenario);
    const result = kvCapacity(restored.workload, netBudgetBytes(restored.budget));
    assert.equal(result.prompt.requested, promptKiB * 1024);
    assert.equal(result.peak.requested, peakKiB * 1024);
    if (workload.batch === 4) {
      assert.equal(result.prompt.capacity, 5);
      assert.equal(result.peak.capacity, 3);
    }
  }
});

test('share links accept only usable budgets and complete integer geometry', () => {
  const scenario = { workload: smolPaddedWorkload, budget: defaultBudget, deduct: false, pool: defaultPool };
  const search = kvScenarioSearch(scenario);
  assert.equal(netBudgetBytes(1 / GiB), 1);
  assert.equal(netBudgetBytes(0.1), 107374182);
  for (const budget of [NaN, 0, 0.5 / GiB, -1, Infinity, 2 ** 23]) {
    assert.equal(netBudgetBytes(budget), null);
    assert.equal(kvScenarioSearch({ ...scenario, budget }), '');
    assert.equal(readKvScenario(search.replace('budget=24', 'budget=' + budget)), null);
  }
  for (const [key, value] of [['heads', NaN], ['dimension', 0], ['generated', 0.5], ['sequence', -1]]) {
    assert.equal(kvScenarioSearch({ ...scenario, workload: { ...smolPaddedWorkload, [key]: value } }), '');
  }
  const oddWidth = { ...scenario, workload: { ...smolPaddedWorkload, dimension: 63 } };
  const oddLink = kvScenarioSearch(oddWidth);
  assert.deepEqual(readKvScenario(oddLink), oddWidth);
  assert.equal(readKvScenario(oddLink.replace('precision=4', 'precision=0.5')), null);
  assert.equal(kvScenarioSearch({ ...oddWidth, workload: { ...oddWidth.workload, precision: 0.5 } }), '');
});
