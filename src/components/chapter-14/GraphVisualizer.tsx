import React, { useState } from 'react';
import './visualizers.css';

const GraphVisualizer = ({ lang = 'en' }: { lang?: string }) => {
  const [mode, setMode] = useState('vector'); // 'vector' | 'graph'

  // Define nodes
  const nodes = [
    { id: 'query', label: 'Query: "Who is the CEO of the company that acquired GitHub?"', x: 400, y: 50, type: 'query' },
    { id: 'github', label: 'GitHub', x: 200, y: 150, type: 'entity' },
    { id: 'microsoft', label: 'Microsoft', x: 400, y: 250, type: 'entity' },
    { id: 'satya', label: 'Satya Nadella', x: 600, y: 350, type: 'entity' },
    { id: 'openai', label: 'OpenAI', x: 200, y: 350, type: 'entity' },
  ];

  // Define edges
  const edges = [
    { source: 'query', target: 'github', label: 'Semantic Match', type: 'vector' },
    { source: 'github', target: 'microsoft', label: 'ACQUIRED_BY', type: 'graph' },
    { source: 'microsoft', target: 'satya', label: 'HAS_CEO', type: 'graph' },
    { source: 'microsoft', target: 'openai', label: 'INVESTED_IN', type: 'graph' },
  ];

  const isNodeActive = (nodeId) => {
    if (mode === 'vector') {
      return nodeId === 'query' || nodeId === 'github';
    } else {
      return nodeId === 'query' || nodeId === 'github' || nodeId === 'microsoft' || nodeId === 'satya';
    }
  };

  const isEdgeActive = (edge) => {
    if (mode === 'vector') {
      return edge.type === 'vector';
    } else {
      return edge.type === 'vector' || (edge.source === 'github' && edge.target === 'microsoft') || (edge.source === 'microsoft' && edge.target === 'satya');
    }
  };

  return (
    <div className="graph-visualizer-container">
      <div className="graph-controls">
        <button 
          className={mode === 'vector' ? 'active' : ''} 
          onClick={() => setMode('vector')}
        >
          1. Vector Search (Semantic)
        </button>
        <button 
          className={mode === 'graph' ? 'active' : ''} 
          onClick={() => setMode('graph')}
        >
          2. Graph Traversal (Multi-hop)
        </button>
      </div>
      
      <div className="graph-canvas-wrapper">
        <svg width="800" height="450" className="graph-svg">
          {/* Draw Edges */}
          {edges.map((edge, idx) => {
            const sourceNode = nodes.find(n => n.id === edge.source);
            const targetNode = nodes.find(n => n.id === edge.target);
            const active = isEdgeActive(edge);
            
            return (
              <g key={`edge-${idx}`}>
                <line
                  x1={sourceNode.x}
                  y1={sourceNode.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  className={`graph-edge ${active ? 'active' : 'inactive'} ${edge.type}`}
                />
                <text
                  x={(sourceNode.x + targetNode.x) / 2}
                  y={(sourceNode.y + targetNode.y) / 2 - 10}
                  className={`edge-label ${active ? 'active' : 'inactive'}`}
                  textAnchor="middle"
                >
                  {edge.label}
                </text>
              </g>
            );
          })}

          {/* Draw Nodes */}
          {nodes.map((node) => {
            const active = isNodeActive(node.id);
            return (
              <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                <circle
                  r={node.type === 'query' ? 15 : 30}
                  className={`graph-node ${active ? 'active' : 'inactive'} ${node.type}`}
                />
                <text
                  y={node.type === 'query' ? -25 : 45}
                  className={`node-label ${active ? 'active' : 'inactive'}`}
                  textAnchor="middle"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="graph-description">
        {lang === 'ko' ? (
          mode === 'vector' 
            ? "벡터 검색은 쿼리와 의미론적으로 유사한 'GitHub' 노드만 찾습니다. 모델은 CEO가 누구인지 알 수 없습니다."
            : "그래프 탐색은 'GitHub'에서 출발하여 관계(Edges)를 따라 'Microsoft'를 거쳐 'Satya Nadella'까지 도달하여 정답을 찾아냅니다."
        ) : (
          mode === 'vector'
            ? "Vector search only finds the 'GitHub' node, which is semantically similar to the query. The model does not know who the CEO is."
            : "Graph traversal starts from 'GitHub', follows the edges (relationships) to 'Microsoft', and reaches 'Satya Nadella' to find the answer."
        )}
      </div>
    </div>
  );
};

export default GraphVisualizer;