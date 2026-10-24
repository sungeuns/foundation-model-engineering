// Authored deterministic graph: illustrates greedy hierarchy traversal, not HNSW construction.
export const demoNodes = Array.from({ length: 40 }, (_, id) => ({
  id, x: 30 + (id % 8) * 75 + ((id * 17) % 19), y: 30 + Math.floor(id / 8) * 75 + ((id * 11) % 23),
  layer: id === 0 ? 2 : id % 5 === 0 ? 1 : 0,
}));
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
export function layerGraph(layer) {
  const nodes = demoNodes.filter(x => x.layer >= layer);
  const graph = new Map(nodes.map(x => [x.id, new Set()]));
  for (const node of nodes) {
    const nearest = nodes.filter(x => x.id !== node.id).sort((a, b) => distance(node, a) - distance(node, b) || a.id - b.id).slice(0, 3);
    for (const other of nearest) {graph.get(node.id).add(other.id);graph.get(other.id).add(node.id);}
  }
  return graph;
}
export function greedyTrace(query) {
  let current = demoNodes[0];
  const steps = [];
  for (let layer = 2; layer >= 0; layer--) {
    const graph = layerGraph(layer);
    steps.push({ node: current, layer, neighbors: [...graph.get(current.id)] });
    while (true) {
      const neighbors = [...graph.get(current.id)].map(id => demoNodes[id]);
      const next = neighbors.sort((a, b) => distance(query, a) - distance(query, b) || a.id - b.id)[0];
      if (!next || distance(query, next) >= distance(query, current)) break;
      current = next;
      steps.push({ node: current, layer, neighbors: [...graph.get(current.id)] });
    }
  }
  const exact = [...demoNodes].sort((a, b) => distance(query, a) - distance(query, b) || a.id - b.id)[0];
  return { steps, exact };
}
