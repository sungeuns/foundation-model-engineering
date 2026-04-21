import React, { useState } from 'react';
import './visualizers.css';

export default function PowerLawVisualizer() {
  const [computeLog, setComputeLog] = useState<number>(2); // 10^2 to 10^8

  // L(C) = a * C^(-alpha) + E
  const a = 10;
  const alpha = 0.05;
  const E = 1.5;

  const computeFLOPs = Math.pow(10, computeLog);
  const currentLoss = a * Math.pow(computeFLOPs, -alpha) + E;

  // Generate curve points
  const points = [];
  for (let i = 1; i <= 9; i += 0.1) {
    const c = Math.pow(10, i);
    const l = a * Math.pow(c, -alpha) + E;
    points.push({ logC: i, logL: Math.log10(l) });
  }

  // SVG mapping
  const mapX = (logC: number) => (logC - 1) * (400 / 8);
  const mapY = (logL: number) => 300 - ((logL - 0.1) * 300);

  const pathD = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${mapX(p.logC)} ${mapY(p.logL)}`).join(' ');

  return (
    <div className="power-law-container">
      <h3>Interactive Scaling Law: Loss vs. Compute</h3>
      <div className="controls">
        <label>
          Compute Budget (10<sup>{computeLog.toFixed(1)}</sup> PetaFLOPs)
          <input 
            type="range" 
            min="1" 
            max="9" 
            step="0.1" 
            value={computeLog} 
            onChange={(e) => setComputeLog(parseFloat(e.target.value))} 
          />
        </label>
        <div className="metrics">
          <span>Predicted Loss: <strong>{currentLoss.toFixed(3)}</strong></span>
          <span>Irreducible Floor: <strong>{E.toFixed(3)}</strong></span>
        </div>
      </div>
      <svg width="100%" height="320" viewBox="-20 -20 440 340" className="power-law-svg">
        {/* Axes */}
        <line x1="0" y1="300" x2="400" y2="300" stroke="#ccc" strokeWidth="2" />
        <line x1="0" y1="0" x2="0" y2="300" stroke="#ccc" strokeWidth="2" />
        
        {/* Asymptote */}
        <line x1="0" y1={mapY(Math.log10(E))} x2="400" y2={mapY(Math.log10(E))} stroke="#ff6b6b" strokeDasharray="5,5" strokeWidth="2" />
        <text x="310" y={mapY(Math.log10(E)) - 10} fill="#ff6b6b" fontSize="12">L_irreducible</text>

        {/* Curve */}
        <path d={pathD} fill="none" stroke="#4dabf7" strokeWidth="3" />
        
        {/* Current Point */}
        <circle cx={mapX(computeLog)} cy={mapY(Math.log10(currentLoss))} r="6" fill="#1c7ed6" />
        
        {/* Labels */}
        <text x="160" y="330" fill="#888" fontSize="14">Compute (Log Scale)</text>
        <text x="-180" y="-15" fill="#888" fontSize="14" transform="rotate(-90)">Loss (Log Scale)</text>
      </svg>
    </div>
  );
}