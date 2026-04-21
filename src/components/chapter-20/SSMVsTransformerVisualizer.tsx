import React, { useState } from 'react';
import './visualizers.css';

const SSMVsTransformerVisualizer = () => {
  const [seqLength, setSeqLength] = useState(4);
  
  const handleToggle = () => {
    setSeqLength(prev => prev === 4 ? 8 : 4);
  };

  return (
    <div className="ssm-visualizer-container">
      <div className="ssm-header">
        <h3>Architecture Scaling Comparison</h3>
        <button className="ssm-toggle-btn" onClick={handleToggle}>
          Toggle Sequence Length (N = {seqLength})
        </button>
      </div>
      
      <div className="ssm-panels">
        {/* Transformer Panel */}
        <div className="ssm-panel">
          <h4 className="panel-title">Dense Transformer (O(N²))</h4>
          <p className="panel-desc">Every token attends to all previous tokens.</p>
          <div className="grid-viz">
            {Array.from({ length: seqLength }).map((_, i) => (
              <div key={`row-${i}`} className="grid-row">
                {Array.from({ length: seqLength }).map((_, j) => (
                  <div 
                    key={`cell-${i}-${j}`} 
                    className={`grid-cell ${j <= i ? 'active-cell' : 'inactive-cell'}`}
                  >
                    {j <= i ? '✓' : ''}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="stats">
            Connections: <strong>{(seqLength * (seqLength + 1)) / 2}</strong>
          </div>
        </div>

        {/* SSM Panel */}
        <div className="ssm-panel">
          <h4 className="panel-title">State Space Model (O(N))</h4>
          <p className="panel-desc">Tokens sequentially update a fixed hidden state.</p>
          <div className="ssm-viz">
            <div className="hidden-state-box">
              Hidden State <br/> <span>h(t)</span>
            </div>
            <div className="sequence-stream">
              {Array.from({ length: seqLength }).map((_, i) => (
                <div key={`token-${i}`} className="stream-token">
                  x_{i}
                </div>
              ))}
            </div>
          </div>
          <div className="stats">
            Connections: <strong>{seqLength}</strong> (Fixed Memory)
          </div>
        </div>
      </div>
    </div>
  );
};

export default SSMVsTransformerVisualizer;