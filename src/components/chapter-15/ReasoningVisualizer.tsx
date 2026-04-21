import React, { useState } from 'react';
import './visualizers.css';

interface Props {
  lang?: string;
}

const ReasoningVisualizer: React.FC<Props> = ({ lang = 'en' }) => {
  const [activeTab, setActiveTab] = useState('cot');

  const renderCoT = () => (
    <svg className="graph-svg" viewBox="0 0 500 200">
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#888" />
        </marker>
      </defs>
      <line x1="80" y1="100" x2="160" y2="100" className="edge" markerEnd="url(#arrow)" />
      <line x1="200" y1="100" x2="280" y2="100" className="edge" markerEnd="url(#arrow)" />
      <line x1="320" y1="100" x2="400" y2="100" className="edge" markerEnd="url(#arrow)" />
      
      <circle cx="60" cy="100" r="20" className="node active" />
      <text x="60" y="105" className="node-text">1</text>
      
      <circle cx="180" cy="100" r="20" className="node" />
      <text x="180" y="105" className="node-text">2</text>
      
      <circle cx="300" cy="100" r="20" className="node" />
      <text x="300" y="105" className="node-text">3</text>
      
      <circle cx="420" cy="100" r="20" className="node result" />
      <text x="420" y="105" className="node-text">A</text>
    </svg>
  );

  const renderToT = () => (
    <svg className="graph-svg" viewBox="0 0 500 200">
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#888" />
        </marker>
      </defs>
      
      {/* Edges from 1 */}
      <line x1="75" y1="90" x2="165" y2="50" className="edge" markerEnd="url(#arrow)" />
      <line x1="75" y1="110" x2="165" y2="150" className="edge" markerEnd="url(#arrow)" />
      
      {/* Edges from 2 */}
      <line x1="195" y1="40" x2="285" y2="20" className="edge" markerEnd="url(#arrow)" />
      <line x1="195" y1="60" x2="285" y2="80" className="edge" markerEnd="url(#arrow)" />
      
      {/* Edges from 3 */}
      <line x1="195" y1="140" x2="285" y2="120" className="edge" markerEnd="url(#arrow)" />
      <line x1="195" y1="160" x2="285" y2="180" className="edge" markerEnd="url(#arrow)" />

      {/* Nodes */}
      <circle cx="60" cy="100" r="20" className="node active" />
      <text x="60" y="105" className="node-text">1</text>
      
      <circle cx="180" cy="50" r="20" className="node" />
      <text x="180" y="55" className="node-text">2</text>
      
      <circle cx="180" cy="150" r="20" className="node" />
      <text x="180" y="155" className="node-text">3</text>
      
      <circle cx="300" cy="20" r="20" className="node" />
      <text x="300" y="25" className="node-text">4</text>
      
      <circle cx="300" cy="80" r="20" className="node result" />
      <text x="300" y="85" className="node-text">A</text>
      
      <circle cx="300" cy="120" r="20" className="node pruned" />
      <text x="300" y="125" className="node-text">5</text>
      
      <circle cx="300" cy="180" r="20" className="node pruned" />
      <text x="300" y="185" className="node-text">6</text>
    </svg>
  );

  const renderGoT = () => (
    <svg className="graph-svg" viewBox="0 0 500 200">
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#888" />
        </marker>
      </defs>
      
      {/* Edges from 1 */}
      <line x1="75" y1="90" x2="165" y2="50" className="edge" markerEnd="url(#arrow)" />
      <line x1="75" y1="110" x2="165" y2="150" className="edge" markerEnd="url(#arrow)" />
      
      {/* Aggregation Edges */}
      <line x1="195" y1="60" x2="285" y2="90" className="edge synergy" markerEnd="url(#arrow)" />
      <line x1="195" y1="140" x2="285" y2="110" className="edge synergy" markerEnd="url(#arrow)" />
      
      {/* Final Edge */}
      <line x1="320" y1="100" x2="400" y2="100" className="edge" markerEnd="url(#arrow)" />

      {/* Nodes */}
      <circle cx="60" cy="100" r="20" className="node active" />
      <text x="60" y="105" className="node-text">1</text>
      
      <circle cx="180" cy="50" r="20" className="node" />
      <text x="180" y="55" className="node-text">2</text>
      
      <circle cx="180" cy="150" r="20" className="node" />
      <text x="180" y="155" className="node-text">3</text>
      
      <circle cx="300" cy="100" r="20" className="node aggregate" />
      <text x="300" y="105" className="node-text">2+3</text>
      
      <circle cx="420" cy="100" r="20" className="node result" />
      <text x="420" y="105" className="node-text">A</text>
    </svg>
  );

  const captions = {
    en: {
      cot: "Linear progression. An error at step 2 permanently derails step 3 and the final answer.",
      tot: "Branching exploration. Node 3 leads to pruned dead-ends, but node 2 finds a successful path.",
      got: "Synergistic aggregation. The best aspects of node 2 and 3 are merged to form a superior state."
    },
    ko: {
      cot: "선형적 진행. 2단계의 오류는 3단계와 최종 정답을 영구적으로 탈선시킵니다.",
      tot: "분기 탐색. 노드 3은 잘린 막다른 골목으로 이어지지만, 노드 2는 성공적인 경로를 찾습니다.",
      got: "시너지 집계. 노드 2와 3의 최상의 측면이 병합되어 우수한 상태를 형성합니다."
    }
  };

  const currentCaptions = captions[lang as keyof typeof captions] || captions.en;

  return (
    <div className="reasoning-visualizer">
      <div className="rv-tabs">
        <button className={activeTab === 'cot' ? 'active' : ''} onClick={() => setActiveTab('cot')}>Chain of Thought</button>
        <button className={activeTab === 'tot' ? 'active' : ''} onClick={() => setActiveTab('tot')}>Tree of Thoughts</button>
        <button className={activeTab === 'got' ? 'active' : ''} onClick={() => setActiveTab('got')}>Graph of Thoughts</button>
      </div>
      <div className="rv-content">
        {activeTab === 'cot' && renderCoT()}
        {activeTab === 'tot' && renderToT()}
        {activeTab === 'got' && renderGoT()}
      </div>
      <div className="rv-caption">
        {activeTab === 'cot' && currentCaptions.cot}
        {activeTab === 'tot' && currentCaptions.tot}
        {activeTab === 'got' && currentCaptions.got}
      </div>
    </div>
  );
};

export default ReasoningVisualizer;