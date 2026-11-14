import test from 'node:test';
import assert from 'node:assert/strict';
import { pipelineSchedule } from '../src/components/chapter-7/pipeline-schedule.mjs';
for (const mode of ['gpipe', '1f1b']) {
  test(`${mode} respects forward/backward dependencies and frees all activations`, () => {
    for (const stages of [1, 2, 4, 6]) for (const batches of [1, 2, 8]) {
      const {timeline, memory} = pipelineSchedule(mode, stages, batches);
      const at = (r, kind, batch) => timeline[r].findIndex(j => j?.kind === kind && j.batch === batch);
      for (let r=0;r<stages;r++) {
        assert.equal(timeline[r].filter(Boolean).length, 2*batches);
        assert.equal(memory[r].at(-1), 0);
        assert.ok(memory[r].every(n => n >= 0 && n <= batches));
        for (let b=0;b<batches;b++) {
          assert.ok(at(r,'F',b) >= 0);
          assert.ok(at(r,'B',b) > at(r,'F',b));
          if (r) assert.ok(at(r,'F',b) > at(r-1,'F',b));
          if (r<stages-1) assert.ok(at(r,'B',b) > at(r+1,'B',b));
        }
      }
    }
  });
}
test('1F1B lowers peak storage, not idealized makespan', () => {
  const g=pipelineSchedule('gpipe'), f=pipelineSchedule('1f1b');
  assert.equal(g.peaks[0],8);assert.equal(f.peaks[0],4);
  assert.equal(g.timeline[0].length, f.timeline[0].length);
});
