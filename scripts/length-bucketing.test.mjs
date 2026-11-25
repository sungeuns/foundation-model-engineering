import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const receipt = JSON.parse(read('public/labs/2026-11/kv-batch-bucketing.json'));

test('pairings preserve each request and their padding and peak are accounted for by the recorded tensor bytes', () => {
  const prompts = Object.entries(receipt.solo_requests);
  const arrival = prompts.map(([id]) => id);
  const sorted = prompts.toSorted(([, a], [, b]) => a.length - b.length).map(([id]) => id);
  const bytesPerSlot = 2 * receipt.layers * receipt.kv_heads * receipt.head_dim * 4;
  assert.equal(receipt.dtype, 'torch.float32');
  assert.equal(bytesPerSlot, 46080);
  for (const [schedule, order] of [[receipt.arrival_order, arrival], [receipt.length_order, sorted]]) {
    assert.deepEqual(schedule.batches.flatMap(batch => batch.requests), order);
    let padding = 0;
    let sum = 0;
    let peak = 0;
    for (const pair of schedule.batches) {
      const solo = pair.requests.map(id => receipt.solo_requests[id]);
      const lengths = solo.map(request => request.length);
      assert.equal(lengths.length, 2);
      assert.deepEqual(pair.real_lengths, lengths);
      assert.deepEqual(pair.greedy_next_ids, solo.map(request => request.greedy_next_id));
      const slots = 2 * Math.max(...lengths);
      assert.equal(pair.padding_slots, slots - lengths[0] - lengths[1]);
      assert.equal(pair.kv_bytes, slots * bytesPerSlot);
      assert.equal(pair.key_bytes + pair.value_bytes, pair.kv_bytes);
      padding += pair.padding_slots;
      sum += pair.kv_bytes;
      peak = Math.max(peak, pair.kv_bytes);
    }
    assert.equal(schedule.padding_slots, padding);
    assert.equal(schedule.sum_prefill_kv_bytes, sum);
    assert.equal(schedule.largest_batch_prefill_kv_bytes, peak);
  }
});

test('both editions reproduce the receipt from the printed dependency-free calculation', () => {
  const route = 'chapter-12/length-bucketing-lab';
  const expected = [receipt.arrival_order, receipt.length_order].map(schedule =>
    [schedule.padding_slots, schedule.sum_prefill_kv_bytes / 1024, schedule.largest_batch_prefill_kv_bytes / 1024].join(' ')
  ).join('\n') + '\n';
  for (const locale of ['', 'ko/']) {
    const mdx = read(`src/pages/${locale}${route}.mdx`);
    const code = mdx.match(/```python\n([\s\S]*?)```/)[1];
    assert.equal(execFileSync('python3', ['-c', code], {encoding: 'utf8'}), expected);
    assert.match(mdx, /5118, 30, 28, 617, 284(?: and|,) 30/);
    assert.ok(mdx.includes('<LabDataset dataset="kv-batch-bucketing"'));
    assert.ok(mdx.includes('/labs/kv_batch_bucketing.py'));
  }
});
