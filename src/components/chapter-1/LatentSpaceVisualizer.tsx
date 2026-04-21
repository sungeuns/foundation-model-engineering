import React, { useState } from 'react';
import './visualizers.css';

export const LatentSpaceVisualizer = () => {
  const [z1, setZ1] = useState(0);
  const [z2, setZ2] = useState(0);

  const r = Math.floor((z1 + 2) / 4 * 255);
  const b = Math.floor((z2 + 2) / 4 * 255);
  const g = 100;

  const size = 50 + (z1 + z2 + 4) * 10;

  return (
    <div className="viz-container glassmorphism">
      <h3 className="viz-title">Latent Space Exploration</h3>
      <p className="viz-description">Adjust the latent dimensions to see how the decoded object changes.</p>
      
      <div className="viz-controls">
        <div className="viz-control-item">
          <label>Latent Dimension 1 (z₁): {z1.toFixed(1)}</label>
          <input type="range" min="-2" max="2" step="0.1" value={z1} onChange={(e) => setZ1(parseFloat(e.target.value))} />
        </div>
        <div className="viz-control-item">
          <label>Latent Dimension 2 (z₂): {z2.toFixed(1)}</label>
          <input type="range" min="-2" max="2" step="0.1" value={z2} onChange={(e) => setZ2(parseFloat(e.target.value))} />
        </div>
      </div>

      <div className="viz-display">
        <div 
          className="viz-object" 
          style={{ 
            backgroundColor: `rgb(${r}, ${g}, ${b})`, 
            width: `${size}px`, 
            height: `${size}px`,
            boxShadow: `0 10px 20px rgba(${r}, ${g}, ${b}, 0.3)`
          }}
        ></div>
      </div>

      <div className="viz-explanation centered">
        <p>The object's color and size change smoothly as you move through the continuous latent space.</p>
      </div>
    </div>
  );
};
