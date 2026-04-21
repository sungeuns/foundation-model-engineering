import React, { useState } from 'react';
import './visualizers.css';

const PPOClippingVisualizer: React.FC = () => {
  const [advantage, setAdvantage] = useState<number>(1.0);
  const epsilon = 0.2;

  // Generate data points for r_t(theta) from 0.0 to 2.0
  const dataPoints = Array.from({ length: 100 }, (_, i) => {
    const r = i / 50; // 0.0 to 2.0
    const unclipped = r * advantage;
    const clippedR = Math.min(Math.max(r, 1 - epsilon), 1 + epsilon);
    const clipped = clippedR * advantage;
    const finalObjective = Math.min(unclipped, clipped);
    return { r, unclipped, finalObjective };
  });

  return (
    <div className="ppo-visualizer-container">
      <div className="ppo-controls">
        <label htmlFor="adv-slider" className="ppo-label">
          {'Advantage (\\hat{A}_t):'} <strong>{advantage.toFixed(1)}</strong>
        </label>
        <input
          id="adv-slider"
          type="range"
          min="-2.0"
          max="2.0"
          step="0.1"
          value={advantage}
          onChange={(e) => setAdvantage(parseFloat(e.target.value))}
          className="ppo-slider"
        />
        <p className="ppo-hint">
          {advantage > 0 
            ? "Positive Advantage: The action was better than expected. Objective is clipped when r_t > 1.2 to prevent over-updating." 
            : "Negative Advantage: The action was worse than expected. Clipped only when r_t < 0.8; penalization continues when r_t > 1.0."}
        </p>
      </div>

      <div className="ppo-chart">
        <svg viewBox="0 0 500 300" className="ppo-svg">
          {/* Axes */}
          <line x1="50" y1="150" x2="450" y2="150" stroke="#ccc" strokeWidth="2" />
          <line x1="250" y1="20" x2="250" y2="280" stroke="#ccc" strokeWidth="2" />
          
          {/* Epsilon Boundaries */}
          <line x1="210" y1="20" x2="210" y2="280" stroke="#ff9999" strokeWidth="1" strokeDasharray="5,5" />
          <line x1="290" y1="20" x2="290" y2="280" stroke="#ff9999" strokeWidth="1" strokeDasharray="5,5" />
          
          <text x="210" y="15" fontSize="10" fill="#ff6666" textAnchor="middle">1 - ε</text>
          <text x="290" y="15" fontSize="10" fill="#ff6666" textAnchor="middle">1 + ε</text>
          
          <text x="440" y="140" fontSize="12" fill="#666">r_t(θ)</text>
          <text x="260" y="30" fontSize="12" fill="#666">L^CLIP</text>

          {/* Lines */}
          <polyline
            fill="none"
            stroke="#e0e0e0"
            strokeWidth="2"
            strokeDasharray="4,4"
            points={dataPoints.map(d => `${50 + d.r * 200},${150 - d.unclipped * 50}`).join(' ')}
          />
          <polyline
            fill="none"
            stroke="#4a90e2"
            strokeWidth="3"
            points={dataPoints.map(d => `${50 + d.r * 200},${150 - d.finalObjective * 50}`).join(' ')}
          />
        </svg>
      </div>
      
      <div className="ppo-legend">
        <div className="ppo-legend-item">
          <span className="ppo-legend-color" style={{ backgroundColor: '#e0e0e0' }}></span>
          <span>Unclipped Value</span>
        </div>
        <div className="ppo-legend-item">
          <span className="ppo-legend-color" style={{ backgroundColor: '#4a90e2' }}></span>
          <span>Final Objective</span>
        </div>
      </div>
    </div>
  );
};

export default PPOClippingVisualizer;