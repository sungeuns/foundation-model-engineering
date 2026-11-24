import assert from 'node:assert/strict';
import test from 'node:test';
import { availableBytes, GiB, kvCapacity } from '../src/components/chapter-12/kv-capacity.mjs';

const example = { batch: 9, sequence: 8192, generated: 2048, layers: 80, heads: 8, dimension: 128, precision: 2 };

test('nine prompts fit, ten prompts exceed the pool, and only seven full continuations fit', () => {
  const budget = availableBytes(['80', '48', '8']);
  assert.equal(budget, 24 * GiB);
  const {prompt, peak} = kvCapacity(example, budget);
  assert.deepEqual(prompt, { tokens: 8192, perSequence: 2.5 * GiB, requested: 22.5 * GiB, capacity: 9, balance: 1.5 * GiB });
  assert.deepEqual(peak, { tokens: 10240, perSequence: 3.125 * GiB, requested: 28.125 * GiB, capacity: 7, balance: -4.125 * GiB });
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
