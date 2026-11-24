export const denseResults = ['B', 'C', 'D', 'A'];
export const bm25Results = ['A', 'C', 'E', 'B'];

/** Each input is an ordered list of stable document IDs. Depth counts distinct IDs. */
export function fuseRanks(dense, bm25, { depth, k, denseWeight = 1 }) {
  const candidates = new Map();
  for (const [source, ids, weight] of [['dense', dense, denseWeight], ['bm25', bm25, 1]]) {
    const retained = [...new Set(ids)].slice(0, depth);
    retained.forEach((id, index) => {
      const candidate = candidates.get(id) ?? { id, dense: null, bm25: null, score: 0 };
      const rank = index + 1;
      candidate[source] = rank;
      candidate.score += weight / (k + rank);
      candidates.set(id, candidate);
    });
  }

  const ranked = [...candidates.values()].sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
  let place = 0;
  return ranked.map((candidate, index) => {
    if (index === 0 || candidate.score !== ranked[index - 1].score) place = index + 1;
    return { ...candidate, place };
  });
}
