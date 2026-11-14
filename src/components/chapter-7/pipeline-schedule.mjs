/** Unit-duration stage operations, zero communication time, no recomputation. */
export function pipelineSchedule(mode, stages = 4, batches = 8) {
  if (!['gpipe', '1f1b'].includes(mode) || !Number.isInteger(stages) || !Number.isInteger(batches) || stages < 1 || batches < 1) throw new Error('invalid schedule');
  const queues = Array.from({ length: stages }, (_, rank) => {
    const jobs = [];
    if (mode === 'gpipe') {
      for (let m = 0; m < batches; m++) jobs.push({ kind: 'F', batch: m });
      for (let m = batches - 1; m >= 0; m--) jobs.push({ kind: 'B', batch: m });
    } else {
      const warmup = Math.min(stages - rank - 1, batches);
      for (let m = 0; m < warmup; m++) jobs.push({ kind: 'F', batch: m });
      for (let m = 0; m < batches - warmup; m++) jobs.push({ kind: 'F', batch: m + warmup }, { kind: 'B', batch: m });
      for (let m = batches - warmup; m < batches; m++) jobs.push({ kind: 'B', batch: m });
    }
    return jobs;
  });
  const done = new Set();
  const timeline = Array.from({ length: stages }, () => []);
  const memory = Array.from({ length: stages }, () => []);
  const live = Array(stages).fill(0);
  const key = (rank, kind, batch) => `${rank}:${kind}:${batch}`;
  while (queues.some(q => q.length)) {
    const ready = queues.map((q, rank) => {
      const job = q[0];
      if (!job) return null;
      const {kind, batch} = job;
      const valid = kind === 'F'
        ? rank === 0 || done.has(key(rank - 1, 'F', batch))
        : done.has(key(rank, 'F', batch)) && (rank === stages - 1 || done.has(key(rank + 1, 'B', batch)));
      return valid ? job : null;
    });
    if (!ready.some(Boolean)) throw new Error('schedule deadlock');
    ready.forEach((job, rank) => {
      timeline[rank].push(job);
      if (job) {
        queues[rank].shift();
        done.add(key(rank, job.kind, job.batch));
        live[rank] += job.kind === 'F' ? 1 : -1;
      }
      memory[rank].push(live[rank]);
    });
  }
  return {timeline, memory, peaks: memory.map(row => Math.max(...row))};
}
