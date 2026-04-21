import React, { useState } from 'react';
import './visualizers.css';

// Conceptual visualization of MoE Token Routing
export const MoERouterVisualizer = () => {
  const [activeToken, setActiveToken] = useState<string | null>(null);
  
  const tokens = [
    { text: "def", type: "code", experts: [1, 5] },
    { text: "calculate", type: "math", experts: [2, 5] },
    { text: "integral", type: "math", experts: [2, 7] },
    { text: "Bonjour", type: "language", experts: [0, 3] }
  ];

  return (
    <div className="moe-container">
      <h3 className="moe-title">MoE Routing Debugger (Top-2)</h3>
      <p className="moe-description">Hover over a token to see which experts are activated.</p>
      <div className="moe-token-group">
        {tokens.map((t, idx) => (
          <button 
            key={idx}
            onMouseEnter={() => setActiveToken(t.text)}
            onMouseLeave={() => setActiveToken(null)}
            className={`moe-token ${
              activeToken === t.text 
                ? 'moe-token-active' 
                : 'moe-token-inactive'
            }`}
          >
            {t.text}
          </button>
        ))}
      </div>
      
      <div className="moe-grid">
        {[0, 1, 2, 3, 4, 5, 6, 7].map(expertId => {
          const isActive = activeToken && tokens.find(t => t.text === activeToken)?.experts.includes(expertId);
          return (
            <div 
              key={expertId} 
              className={`moe-card ${
                isActive 
                  ? 'moe-card-active' 
                  : ''
              }`}
            >
              <div className="moe-card-title">Expert {expertId}</div>
              {isActive && <div className="moe-card-status">Activated</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};
