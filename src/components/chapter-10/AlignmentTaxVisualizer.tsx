import React, { useState, useEffect } from 'react';
import './visualizers.css';

export const AlignmentTaxVisualizer: React.FC = () => {
  const [strategy, setStrategy] = useState<string>('standard');
  const [steps, setSteps] = useState<number>(50);

  // Calculate scores based on strategy and steps
  // Base model: Capability 95, Safety 10
  const calculateScores = () => {
    let capability = 95;
    let safety = 10;
    const progress = steps / 100; // 0 to 1

    if (strategy === 'standard') {
      // Standard RLHF degrades capability significantly
      capability = 95 - (40 * progress);
      safety = 10 + (85 * progress);
    } else if (strategy === 'ptx') {
      // PTX preserves some capability, but safety grows slightly slower
      capability = 95 - (15 * progress);
      safety = 10 + (75 * progress);
    } else if (strategy === 'weight_interpolation') {
      // Weight interpolation (averaging base and aligned)
      capability = 95 - (20 * progress);
      safety = 10 + (70 * progress);
    } else if (strategy === 'orthogonal') {
      // Orthogonal Projection perfectly preserves capability, but safety is harder to maximize
      capability = 95;
      safety = 10 + (65 * progress);
    }

    return { capability, safety };
  };

  const { capability, safety } = calculateScores();

  return (
    <div className="alignment-tax-container">
      <div className="controls-panel">
        <h3>Alignment Strategy</h3>
        <div className="radio-group">
          <label>
            <input type="radio" value="standard" checked={strategy === 'standard'} onChange={() => setStrategy('standard')} />
            Standard RLHF
          </label>
          <label>
            <input type="radio" value="ptx" checked={strategy === 'ptx'} onChange={() => setStrategy('ptx')} />
            PTX (Pre-Training Mix)
          </label>
          <label>
            <input type="radio" value="weight_interpolation" checked={strategy === 'weight_interpolation'} onChange={() => setStrategy('weight_interpolation')} />
            Weight Interpolation
          </label>
          <label>
            <input type="radio" value="orthogonal" checked={strategy === 'orthogonal'} onChange={() => setStrategy('orthogonal')} />
            Orthogonal Projection
          </label>
        </div>

        <div className="slider-group">
          <label>RLHF Steps: {steps}%</label>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={steps} 
            onChange={(e) => setSteps(Number(e.target.value))} 
            className="slider"
          />
        </div>
      </div>

      <div className="visualization-panel">
        <div className="chart-area">
          <div className="y-axis-label">Safety Score</div>
          <div className="x-axis-label">Capability Score</div>
          
          {/* Grid Background */}
          <div className="grid-background">
            <div className="optimal-zone">Ideal Zone<br/>(Pareto Optimal)</div>
          </div>

          {/* Data Point */}
          <div 
            className="data-point" 
            style={{ 
              left: `${capability}%`, 
              bottom: `${safety}%`,
              backgroundColor: strategy === 'orthogonal' ? '#10b981' : strategy === 'standard' ? '#ef4444' : '#3b82f6'
            }}
          >
            <span className="tooltip">
              Capability: {capability.toFixed(1)}<br/>Safety: {safety.toFixed(1)}
            </span>
          </div>
          
          {/* Base Model Reference Point */}
          <div className="base-model-point" style={{ left: '95%', bottom: '10%' }}>
            <span>Base Model</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlignmentTaxVisualizer;
