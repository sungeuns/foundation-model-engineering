import React, { useState } from 'react';
import { bottomLayerTrace, demoNodes, detourQuery, directQuery, distance, greedyTrace, layerGraph } from '../../utils/hierarchical-search-demo.js';
import './visualizers.css';

type Point = { x: number; y: number };

export default function HNSWVisualizer({ locale = 'en' }: { locale?: 'en' | 'ko' }) {
  const ko = locale === 'ko';
  const [query, setQuery] = useState<Point>(detourQuery);
  const [mode, setMode] = useState<'greedy' | 'candidates'>('candidates');
  const [index, setIndex] = useState(0);
  const [budget, setBudget] = useState(3);
  const { steps, exact } = greedyTrace(query);
  const entry = steps.find(step => step.layer === 0)!.node.id;
  const rows = bottomLayerTrace(query, entry, 3);
  const row = rows[budget - 1];
  const step = steps[index];
  const greedy = mode === 'greedy';
  const layer = greedy ? step.layer : 0;
  const graph = layerGraph(layer);
  const current = greedy ? step.node.id : row.expanded;
  const done = index === steps.length - 1;
  const measured = (nodeId: number) => distance(demoNodes[nodeId], query).toFixed(2);
  const path = [];
  if (greedy) {
    path.push(...steps.slice(0, index + 1).filter(item => item.layer === layer).map(item => item.node.id));
  } else {
    const parent = new Map<number, number>();
    for (const expansion of rows.slice(0, budget)) {
      for (const id of expansion.discovered) parent.set(id, expansion.expanded);
    }
    for (let id: number | undefined = row.best; id !== undefined; id = parent.get(id)) path.unshift(id);
  }
  const chooseQuery = (next: Point) => {
    setQuery(next);
    setIndex(0);
    setBudget(3);
  };
  const selected = (point: Point) => point.x === query.x && point.y === query.y;

  return <section className="hnsw-container">
    <h4>{ko ? '같은 질의를 두 방법으로 탐색하기' : 'Search the same graph two ways'}</h4>
    <div className="hnsw-actions" role="group" aria-label={ko ? '예제 질의' : 'Example queries'}>
      <button type="button" aria-pressed={selected(detourQuery)} onClick={() => chooseQuery(detourQuery)}>{ko ? '우회가 필요한 질의' : 'Detour query'} (100, 180)</button>
      <button type="button" aria-pressed={selected(directQuery)} onClick={() => chooseQuery(directQuery)}>{ko ? '바로 찾는 질의' : 'Direct query'} (480, 250)</button>
    </div>
    <div className="hnsw-controls">
      <label>{ko ? '질의 X 좌표' : 'Query X coordinate'} · {query.x}<input type="range" min="0" max="600" value={query.x} onChange={e => chooseQuery({ x: Number(e.target.value), y: query.y })} /></label>
      <label>{ko ? '질의 Y 좌표' : 'Query Y coordinate'} · {query.y}<input type="range" min="0" max="400" value={query.y} onChange={e => chooseQuery({ x: query.x, y: Number(e.target.value) })} /></label>
    </div>
    <div className="hnsw-actions" role="group" aria-label={ko ? '탐색 방법' : 'Search method'}>
      <button type="button" aria-pressed={greedy} onClick={() => setMode('greedy')}>{ko ? '계층별 탐욕 탐색' : 'Greedy descent'}</button>
      <button type="button" aria-pressed={!greedy} onClick={() => setMode('candidates')}>{ko ? '최하층 후보 확장' : 'Bottom-layer candidates'}</button>
    </div>
    {greedy ? <div className="hnsw-actions">
      <button type="button" onClick={() => setIndex(i => Math.min(i + 1, steps.length - 1))} disabled={done}>{ko ? '다음 단계' : 'Next step'}</button>
      <button type="button" onClick={() => setIndex(steps.length - 1)} disabled={done}>{ko ? '끝까지 탐색' : 'Finish search'}</button>
      <button type="button" onClick={() => setIndex(0)}>{ko ? '처음부터' : 'Replay'}</button>
    </div> : <label className="hnsw-budget">{ko ? '확장할 노드 수' : 'Nodes to expand'} · {budget}<input type="range" min="1" max="3" value={budget} onChange={e => setBudget(Number(e.target.value))} /></label>}
    <svg className="hnsw-canvas" viewBox="-15 -15 630 430" role="img" aria-label={ko ? '현재 계층의 간선과 탐색 경로' : 'Edges and search path on the current layer'} onClick={e => {
      const transform = e.currentTarget.getScreenCTM();
      if (!transform) return;
      const point = new DOMPoint(e.clientX, e.clientY).matrixTransform(transform.inverse());
      chooseQuery({ x: Math.max(0, Math.min(600, Math.round(point.x))), y: Math.max(0, Math.min(400, Math.round(point.y))) });
    }}>
      <title>{ko ? '질의 좌표와 선택한 경로' : 'Query coordinates and selected route'}</title>
      {[...graph].flatMap(([from, neighbors]) => [...neighbors].filter(to => to > from).map(to => <line key={`${from}-${to}`} x1={demoNodes[from].x} y1={demoNodes[from].y} x2={demoNodes[to].x} y2={demoNodes[to].y} stroke="#94a3b8" />))}
      <polyline points={path.map(id => `${demoNodes[id].x},${demoNodes[id].y}`).join(' ')} fill="none" stroke="#075985" strokeWidth="4" />
      {demoNodes.filter(node => node.layer >= layer).map(node => <g key={node.id}>
        <circle cx={node.x} cy={node.y} r={node.id === current ? 9 : 4} fill={node.id === current ? '#0369a1' : '#475569'} />
        {path.includes(node.id) && <text x={node.x + 11} y={node.y - 10}>{node.id}</text>}
        <title>{`${ko ? '노드' : 'Node'} ${node.id}`}</title>
      </g>)}
      <circle cx={exact.x} cy={exact.y} r="14" fill="none" stroke="#15803d" strokeWidth="3" />
      <path d={`M ${query.x-5} ${query.y-5} l 10 10 m -10 0 l 10 -10`} stroke="#b91c1c" strokeWidth="4" />
    </svg>
    <p className="hnsw-key">{ko ? '×는 질의, 초록 원은 40개 점을 전부 비교해 찾은 최근접 노드입니다. 큰 파란 점은 현재 노드입니다. 그래프를 눌러 질의를 옮길 수 있습니다.' : 'The cross marks the query. The green ring marks the nearest of all 40 points. The large blue dot marks the current node. Click the graph to move the query.'}</p>
    <p aria-live="polite">{greedy ? (ko ? `${steps.length}단계 중 ${index+1}단계 · ${layer}층 · 현재 노드 ${current}.` : `Step ${index+1} of ${steps.length} · layer ${layer} · current node ${current}.`) : (ko ? `${entry}번에서 시작해 노드 ${budget}개를 확장했습니다. 지금까지 가장 가까운 노드는 ${row.best}번입니다. 선은 이 노드를 발견한 경로입니다.` : `From node ${entry}, ${budget} node${budget === 1 ? '' : 's'} expanded. The line traces the route to the closest node discovered so far, ${row.best}.`)} {greedy && done && (ko ? `전수 검색 결과는 ${exact.id}번입니다.` : `The exact nearest node is ${exact.id}.`)}</p>
    <table className="hnsw-table">
      <caption>{ko ? `${entry}번에서 시작한 최하층 탐색 · 괄호 안은 질의까지의 거리` : `Bottom-layer search from node ${entry} · distance to the query in parentheses`}</caption>
      <thead><tr><th scope="col">{ko ? '횟수' : 'Step'}</th><th scope="col">{ko ? '확장한 노드' : 'Node expanded'}</th><th scope="col">{ko ? '발견한 최근접 노드' : 'Closest discovered'}</th></tr></thead>
      <tbody>{rows.map((item, i) => <tr key={item.expanded} aria-current={!greedy && budget === i + 1 ? 'step' : undefined}>
        <th scope="row">{i+1}</th><td>{item.expanded} ({measured(item.expanded)})</td><td>{item.best} ({measured(item.best)})</td>
      </tr>)}</tbody>
    </table>
  </section>;
}
