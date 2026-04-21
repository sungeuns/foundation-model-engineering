import React, { useState } from 'react';
import './visualizers.css';

const OmniAttentionVisualizer = () => {
  const [hoveredToken, setHoveredToken] = useState<number | null>(null);

  const tokens = [
    { id: 0, text: 'T1', type: 'text', label: 'Text: "Look"' },
    { id: 1, text: 'T2', type: 'text', label: 'Text: "at"' },
    { id: 2, text: 'I1', type: 'image', label: 'Image Patch 1' },
    { id: 3, text: 'I2', type: 'image', label: 'Image Patch 2' },
    { id: 4, text: 'T3', type: 'text', label: 'Text: "and listen"' },
    { id: 5, text: 'A1', type: 'audio', label: 'Audio Frame 1' },
  ];

  // Simulating causal attention weights (a token can only attend to itself and previous tokens)
  const getAttentionWeight = (source: number, target: number) => {
    if (target > source) return 0; // Causal masking
    if (source === target) return 1.0;
    
    // Simulate some cross-modal attention logic
    const sourceToken = tokens[source];
    const targetToken = tokens[target];
    
    if (sourceToken.type === 'audio' && targetToken.type === 'image') return 0.8;
    if (sourceToken.type === 'text' && targetToken.type === 'image') return 0.6;
    if (sourceToken.type === targetToken.type) return 0.9;
    
    return 0.3;
  };

  return (
    <div className="omni-visualizer-container">
      <h3 className="omni-title">Interleaved Autoregression (Causal Attention)</h3>
      <p className="omni-subtitle">Hover over a token to see its attention weights to previous tokens across different modalities.</p>
      
      <div className="omni-sequence">
        {tokens.map((token, idx) => (
          <div 
            key={token.id}
            className={`omni-token omni-${token.type} ${hoveredToken === idx ? 'hovered' : ''}`}
            onMouseEnter={() => setHoveredToken(idx)}
            onMouseLeave={() => setHoveredToken(null)}
          >
            <span className="token-id">{token.text}</span>
            <span className="token-label">{token.label}</span>
            
            {hoveredToken !== null && idx <= hoveredToken && (
              <div 
                className="attention-highlight"
                style={{ opacity: getAttentionWeight(hoveredToken, idx) }}
              ></div>
            )}
          </div>
        ))}
      </div>

      <div className="omni-legend">
        <div className="legend-item"><span className="legend-box omni-text"></span> Text</div>
        <div className="legend-item"><span className="legend-box omni-image"></span> Image</div>
        <div className="legend-item"><span className="legend-box omni-audio"></span> Audio</div>
      </div>
    </div>
  );
};

export default OmniAttentionVisualizer;