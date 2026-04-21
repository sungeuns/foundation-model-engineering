import React, { useState, useEffect } from 'react';
import './visualizers.css';

const MultiAgentTopologyVisualizer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Sequential' | 'Hierarchical' | 'Debate'>('Sequential');
  const [animationKey, setAnimationKey] = useState(0);

  // Re-trigger animations when tab changes
  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [activeTab]);

  const renderSequential = () => (
    <svg className="topology-svg" viewBox="0 0 600 300" key={animationKey}>
      {/* Edges */}
      <line x1="150" y1="150" x2="300" y2="150" className="edge-line" />
      <line x1="300" y1="150" x2="450" y2="150" className="edge-line" />
      
      {/* Animated Packets */}
      <circle r="4" className="packet seq-packet-1" fill="#3b82f6" />
      <circle r="4" className="packet seq-packet-2" fill="#3b82f6" />

      {/* Nodes */}
      <g className="node-group" transform="translate(150, 150)">
        <circle r="40" className="node-circle" />
        <text className="node-text" dy="5">Planner</text>
      </g>
      <g className="node-group" transform="translate(300, 150)">
        <circle r="40" className="node-circle" />
        <text className="node-text" dy="5">Coder</text>
      </g>
      <g className="node-group" transform="translate(450, 150)">
        <circle r="40" className="node-circle" />
        <text className="node-text" dy="5">QA</text>
      </g>
    </svg>
  );

  const renderHierarchical = () => (
    <svg className="topology-svg" viewBox="0 0 600 300" key={animationKey}>
      {/* Edges */}
      <line x1="300" y1="80" x2="150" y2="220" className="edge-line" />
      <line x1="300" y1="80" x2="300" y2="220" className="edge-line" />
      <line x1="300" y1="80" x2="450" y2="220" className="edge-line" />

      {/* Animated Packets */}
      <circle r="4" className="packet hier-packet-1" fill="#10b981" />
      <circle r="4" className="packet hier-packet-2" fill="#10b981" />
      <circle r="4" className="packet hier-packet-3" fill="#10b981" />

      {/* Nodes */}
      <g className="node-group manager-node" transform="translate(300, 80)">
        <circle r="45" className="node-circle" />
        <text className="node-text" dy="5">Manager</text>
      </g>
      <g className="node-group" transform="translate(150, 220)">
        <circle r="35" className="node-circle" />
        <text className="node-text" dy="5">Worker 1</text>
      </g>
      <g className="node-group" transform="translate(300, 220)">
        <circle r="35" className="node-circle" />
        <text className="node-text" dy="5">Worker 2</text>
      </g>
      <g className="node-group" transform="translate(450, 220)">
        <circle r="35" className="node-circle" />
        <text className="node-text" dy="5">Worker 3</text>
      </g>
    </svg>
  );

  const renderDebate = () => (
    <svg className="topology-svg" viewBox="0 0 600 300" key={animationKey}>
      {/* Edges */}
      <line x1="300" y1="70" x2="200" y2="220" className="edge-line" />
      <line x1="300" y1="70" x2="400" y2="220" className="edge-line" />
      <line x1="200" y1="220" x2="400" y2="220" className="edge-line" />

      {/* Animated Packets */}
      <circle r="4" className="packet debate-packet-1" fill="#f59e0b" />
      <circle r="4" className="packet debate-packet-2" fill="#f59e0b" />
      <circle r="4" className="packet debate-packet-3" fill="#f59e0b" />
      <circle r="4" className="packet debate-packet-4" fill="#f59e0b" />
      <circle r="4" className="packet debate-packet-5" fill="#f59e0b" />
      <circle r="4" className="packet debate-packet-6" fill="#f59e0b" />

      {/* Nodes */}
      <g className="node-group" transform="translate(300, 70)">
        <circle r="40" className="node-circle" />
        <text className="node-text" dy="5">Agent A</text>
      </g>
      <g className="node-group" transform="translate(200, 220)">
        <circle r="40" className="node-circle" />
        <text className="node-text" dy="5">Agent B</text>
      </g>
      <g className="node-group" transform="translate(400, 220)">
        <circle r="40" className="node-circle" />
        <text className="node-text" dy="5">Agent C</text>
      </g>
    </svg>
  );

  return (
    <div className="topology-visualizer">
      <div className="topology-tabs">
        <button 
          className={`topology-tab ${activeTab === 'Sequential' ? 'active' : ''}`}
          onClick={() => setActiveTab('Sequential')}
        >
          Sequential
        </button>
        <button 
          className={`topology-tab ${activeTab === 'Hierarchical' ? 'active' : ''}`}
          onClick={() => setActiveTab('Hierarchical')}
        >
          Hierarchical
        </button>
        <button 
          className={`topology-tab ${activeTab === 'Debate' ? 'active' : ''}`}
          onClick={() => setActiveTab('Debate')}
        >
          Debate (P2P)
        </button>
      </div>
      
      <div className="topology-canvas">
        {activeTab === 'Sequential' && renderSequential()}
        {activeTab === 'Hierarchical' && renderHierarchical()}
        {activeTab === 'Debate' && renderDebate()}
      </div>
      
      <div className="topology-caption">
        {activeTab === 'Sequential' && "선형 파이프라인 구조. 한 방향으로만 데이터가 흐릅니다 (역방향 피드백이 어려움)."}
        {activeTab === 'Hierarchical' && "Manager가 작업을 위임하고 취합합니다. Manager 노드에 병목이 발생할 수 있습니다."}
        {activeTab === 'Debate' && "양방향 P2P 통신. 여러 에이전트가 결과를 교차 검증하며 환각을 줄입니다."}
      </div>
    </div>
  );
};

export default MultiAgentTopologyVisualizer;
