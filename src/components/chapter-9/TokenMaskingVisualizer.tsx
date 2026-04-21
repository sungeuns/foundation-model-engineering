import React, { useState } from 'react';
import './visualizers.css';

const TokenMaskingVisualizer: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const tokens = [
    { text: "<|im_start|>", role: "system", isMasked: true },
    { text: "system", role: "system", isMasked: true },
    { text: "\\n", role: "system", isMasked: true },
    { text: "You", role: "system", isMasked: true },
    { text: "are", role: "system", isMasked: true },
    { text: "helpful.", role: "system", isMasked: true },
    { text: "<|im_end|>", role: "system", isMasked: true },
    { text: "\\n", role: "user", isMasked: true },
    { text: "<|im_start|>", role: "user", isMasked: true },
    { text: "user", role: "user", isMasked: true },
    { text: "\\n", role: "user", isMasked: true },
    { text: "Hi!", role: "user", isMasked: true },
    { text: "<|im_end|>", role: "user", isMasked: true },
    { text: "\\n", role: "assistant", isMasked: true },
    { text: "<|im_start|>", role: "assistant", isMasked: true },
    { text: "assistant", role: "assistant", isMasked: true },
    { text: "\\n", role: "assistant", isMasked: true },
    { text: "Hello", role: "assistant", isMasked: false },
    { text: "there!", role: "assistant", isMasked: false },
    { text: "<|im_end|>", role: "assistant", isMasked: false }
  ];

  return (
    <div className="token-visualizer-container">
      <h3>Interactive Chat Template & Loss Masking</h3>
      <p className="visualizer-desc">
        Hover over the tokens to see how the sequence is structured and which tokens contribute to the SFT loss. 
        Notice that the loss is only computed starting from the first actual word of the assistant's response.
      </p>
      
      <div className="token-grid">
        {tokens.map((token, idx) => (
          <div 
            key={idx} 
            className={`token-box ${token.role} ${token.isMasked ? 'masked' : 'active'} ${hoveredIndex === idx ? 'hovered' : ''}`}
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <span className="token-text">{token.text}</span>
          </div>
        ))}
      </div>

      <div className="token-info-panel">
        {hoveredIndex !== null ? (
          <>
            <div className="info-row">
              <strong>Token:</strong> <code>{tokens[hoveredIndex].text}</code>
            </div>
            <div className="info-row">
              <strong>Role Segment:</strong> <span className={`badge ${tokens[hoveredIndex].role}`}>{tokens[hoveredIndex].role.toUpperCase()}</span>
            </div>
            <div className="info-row">
              <strong>Loss Computed?</strong> 
              <span className={tokens[hoveredIndex].isMasked ? 'loss-false' : 'loss-true'}>
                {tokens[hoveredIndex].isMasked ? ' FALSE (Label = -100)' : ' TRUE (Label = Token ID)'}
              </span>
            </div>
          </>
        ) : (
          <div className="info-placeholder">Hover over a token to inspect its SFT properties.</div>
        )}
      </div>
    </div>
  );
};

export default TokenMaskingVisualizer;