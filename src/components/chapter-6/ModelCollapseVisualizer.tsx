import React, { useState } from 'react';
import './visualizers.css';

export default function ModelCollapseVisualizer() {
  const [generation, setGeneration] = useState(0);

  // Math for normal distribution
  const getPoints = (gen: number) => {
    const points = [];
    const sigma = Math.max(0.15, 1.5 - (gen * 0.135)); 
    const mu = 0; 

    for (let x = -5; x <= 5; x += 0.1) {
      const exponent = -0.5 * Math.pow((x - mu) / sigma, 2);
      const y = (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
      
      const svgX = ((x + 5) / 10) * 600;
      const svgY = 300 - (y * 100); 
      
      points.push(`${svgX},${svgY}`);
    }
    return points.join(' ');
  };

  return (
    <div className="visualizer-container">
      <h3>Model Collapse Simulation</h3>
      <div className="slider-container">
        <label>Synthetic Generation (N): <strong>{generation}</strong></label>
        <input 
          type="range" 
          min="0" 
          max="10" 
          value={generation} 
          onChange={(e) => setGeneration(parseInt(e.target.value))} 
        />
      </div>
      <svg width="100%" height="320" viewBox="0 0 600 320" className="collapse-svg">
        <defs>
          <linearGradient id="gradientArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(99, 102, 241, 0.5)" />
            <stop offset="100%" stopColor="rgba(99, 102, 241, 0.0)" />
          </linearGradient>
        </defs>
        <polyline 
          points={`0,300 ${getPoints(generation)} 600,300`} 
          fill="url(#gradientArea)" 
          stroke="#4f46e5" 
          strokeWidth="3" 
        />
        <line x1="0" y1="300" x2="600" y2="300" stroke="#333" strokeWidth="2" />
        <text x="300" y="315" textAnchor="middle" fill="#666" fontSize="12">Data Distribution (Mode vs Tails)</text>
      </svg>
      <div className="description">
        {generation === 0 ? "Original Human Data: Wide variance and diverse tails." : 
         generation < 5 ? `Synthetic Generation ${generation}: Tails gradually disappear, overfitting to the mode.` :
         generation < 10 ? `Synthetic Generation ${generation}: Diversity is rapidly lost, distribution narrows.` :
         "Generation 10 (Model Collapse): Distribution collapsed close to a Dirac delta function. The model repeats the same pattern."}
      </div>
    </div>
  );
}