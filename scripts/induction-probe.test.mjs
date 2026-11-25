import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const run = JSON.parse(read('public/labs/2026-11/induction-probe.json'));

test('both editions print the measured logit shifts from the same held-out token pairs', () => {
  const pages = ['', 'ko/'].map(prefix =>
    read('src/pages/' + prefix + 'chapter-19/mechanistic-interpretability.mdx'));
  for (const row of Object.values(run.held_out_logits)) {
    assert.equal(row.paired_shifts.length, run.held_out_prompts);
    assert.equal(row.paired_shifts.filter(value => value > 0).length, row.positive_shifts);
    const mean = row.paired_shifts.reduce((sum, value) => sum + value, 0) / run.held_out_prompts;
    assert.ok(Math.abs(mean - row.swap_shift_mean) < 1e-5);
    assert.ok(Math.abs(mean - (row.B_minus_C_original_mean - row.B_minus_C_swapped_mean)) < 1e-5);
    const cells = [row.B_minus_C_original_mean, row.B_minus_C_swapped_mean, row.swap_shift_mean]
      .map(value => value.toFixed(2).replace('-', '−')).join(' | ');
    for (const page of pages) assert.ok(page.includes('| ' + cells + ' |'), cells);
  }
  const { repeated_A, fresh_D } = run.held_out_mean_attention_to_position_2;
  for (const page of pages) {
    for (const text of [(repeated_A * 100).toFixed(2) + '%', (fresh_D * 100).toFixed(3) + '%',
      run.revision, 'id="induction-probe"', '/labs/induction_probe.py', '/labs/2026-11/induction-probe.json']) {
      assert.ok(page.includes(text), text);
    }
  }
});
