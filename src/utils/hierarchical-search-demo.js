// The layers and symmetric edges are authored for this experiment.
export const demoNodes = Array.from({ length: 40 }, (_, id) => ({
  id, x: 30 + (id % 8) * 75 + ((id * 17) % 19), y: 30 + Math.floor(id / 8) * 75 + ((id * 11) % 23),
  layer: id === 0 ? 2 : id % 5 === 0 ? 1 : 0,
}));
export const detourQuery = { x: 100, y: 180 };
export const directQuery = { x: 480, y: 250 };
export const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

export function layerGraph(layer) {
  const nodes = demoNodes.filter(node => node.layer >= layer);
  const graph = new Map(nodes.map(node => [node.id, new Set()]));
  for (const node of nodes) {
    const nearest = nodes.filter(other => other.id !== node.id)
      .sort((a, b) => distance(node, a) - distance(node, b) || a.id - b.id).slice(0, 3);
    for (const other of nearest) {
      graph.get(node.id).add(other.id);
      graph.get(other.id).add(node.id);
    }
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

export function bottomLayerTrace(query, entryId, expansionLimit) {
  const graph = layerGraph(0);
  const rank = (a, b) => distance(query, demoNodes[a]) - distance(query, demoNodes[b]) || a - b;
  const frontier = [entryId];
  const seen = new Set(frontier);
  const trace = [];
  let best = entryId;
  while (frontier.length && trace.length < expansionLimit) {
    // A sorted array implements the priority queue for these forty nodes.
    frontier.sort(rank);
    const expanded = frontier.shift();
    const discovered = [];
    for (const neighbor of graph.get(expanded)) {
      if (seen.has(neighbor)) continue;
      seen.add(neighbor);
      frontier.push(neighbor);
      discovered.push(neighbor);
      if (rank(neighbor, best) < 0) best = neighbor;
    }
    trace.push({ expanded, discovered, best });
  }
  return trace;
}
