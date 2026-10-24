import React, { useState } from 'react';
import { demoNodes, greedyTrace, layerGraph } from '../../utils/hierarchical-search-demo.js';
import './visualizers.css';

export default function HNSWVisualizer({ locale = 'en' }: { locale?: 'en' | 'ko' }) {
  const ko = locale === 'ko';
  const [query, setQuery] = useState({x: 480, y: 250});
  const [index, setIndex] = useState(0);
  const {steps, exact} = greedyTrace(query);
  const step = steps[Math.min(index, steps.length - 1)];
  const done = index === steps.length - 1;
  const graph = layerGraph(step.layer);
  const change = (x: number, y: number) => {setQuery({x,y});setIndex(0);};
  return <section className="hnsw-container">
    <h3>{ko ? '계층 그래프의 이웃 기반 탐색' : 'Neighbor search through a hierarchy'}</h3>
    <p>{ko ? '좌표를 조절하거나 그래프를 클릭하고 한 단계씩 진행하세요. 이동은 실제로 그려진 이웃 간선으로 제한됩니다.' : 'Adjust coordinates or click the graph, then advance one step. Moves are restricted to the displayed neighbor edges.'}</p>
    <div className="hnsw-controls"><label>{ko ? '질의 X 좌표' : 'Query X coordinate'}: {query.x}<input type="range" min="0" max="600" value={query.x} onChange={e => change(Number(e.target.value),query.y)} /></label><label>{ko ? '질의 Y 좌표' : 'Query Y coordinate'}: {query.y}<input type="range" min="0" max="400" value={query.y} onChange={e => change(query.x,Number(e.target.value))} /></label></div>
    <div className="hnsw-actions"><button type="button" onClick={() => setIndex(i => Math.min(i + 1, steps.length - 1))} disabled={done}>{ko ? '다음 단계' : 'Next step'}</button><button type="button" onClick={() => setIndex(steps.length - 1)} disabled={done}>{ko ? '끝까지 탐색' : 'Finish search'}</button><button type="button" onClick={() => setIndex(0)}>{ko ? '처음부터' : 'Replay'}</button></div>
    <svg className="hnsw-canvas" viewBox="0 0 600 400" role="img" aria-label={ko ? '현재 계층의 이웃 간선과 탐색 지점' : 'Neighbor edges and current search position'} onClick={e => {const r=e.currentTarget.getBoundingClientRect();change(Math.round((e.clientX-r.left)*600/r.width),Math.round((e.clientY-r.top)*400/r.height));}}>
      <title>{ko ? '교육용 계층 그래프' : 'Educational hierarchical graph'}</title>
      {[...graph].flatMap(([from, neighbors]) => [...neighbors].filter(to => to > from).map(to => <line key={`${from}-${to}`} x1={demoNodes[from].x} y1={demoNodes[from].y} x2={demoNodes[to].x} y2={demoNodes[to].y} stroke="#94a3b8" />))}
      {demoNodes.filter(n => n.layer >= step.layer).map(n => <g key={n.id}><circle cx={n.x} cy={n.y} r={n.id === step.node.id ? 9 : 5} fill={n.id === step.node.id ? '#2563eb' : '#475569'} /><title>{`${ko ? '노드' : 'Node'} ${n.id}`}</title></g>)}
      <circle cx={query.x} cy={query.y} r="7" fill="#dc2626" /><circle cx={exact.x} cy={exact.y} r="13" fill="none" stroke="#16a34a" strokeWidth="2" />
    </svg>
    <p aria-live="polite">{ko ? '단계 / 전체' : 'Step / total'}: {index + 1} / {steps.length}; {ko ? '계층' : 'layer'} {step.layer}; {ko ? '현재 노드' : 'current node'} {step.node.id}. {done && (step.node.id === exact.id ? (ko ? '정확한 최근접 노드를 찾았습니다.' : 'The exact nearest node was found.') : (ko ? '지역 최솟값에 멈췄습니다. 정확한 최근접 노드와 다릅니다.' : 'Stopped at a local minimum, not the exact nearest node.'))}</p>
    <p>{ko ? '파랑: 현재 노드, 빨강: 질의, 초록 원: 전수 검색으로 찾은 정답. 고정 좌표와 계층별 3개 최근접 이웃의 대칭 간선으로 만든 예제이며, HNSW 삽입·이웃 선택 휴리스틱·efSearch 후보 큐는 구현하지 않았습니다. 교육용 greedy 탐색이며 실제 HNSW의 재현이나 지연 측정이 아닙니다.' : 'Blue: current node; red: query; green ring: brute-force nearest node. Fixed coordinates and symmetrized three-nearest-neighbor edges per layer. HNSW insertion, neighbor-selection heuristics, and the efSearch candidate queue are omitted. This is an educational greedy traversal, not a reproduction or latency measurement of full HNSW.'}</p>
  </section>;
}
