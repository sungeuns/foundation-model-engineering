import React, { useState } from 'react';
import './visualizers.css';

const LogitLensVisualizer = () => {
  const [activeLayer, setActiveLayer] = useState(12);

  const tokens = ["The", "capital", "of", "France", "is"];
  
  // Simulated Logit Lens data for 13 layers (0 to 12)
  const layerData = [
    { layer: 0, predictions: ["The", "letter", "the", "a", "the"] },
    { layer: 1, predictions: ["First", "city", "the", "the", "a"] },
    { layer: 2, predictions: ["A", "city", "a", "the", "a"] },
    { layer: 3, predictions: ["A", "state", "the", "Paris", "a"] },
    { layer: 4, predictions: ["A", "state", "the", "Paris", "a"] },
    { layer: 5, predictions: ["The", "city", "the", "Paris", "city"] },
    { layer: 6, predictions: ["The", "city", "the", "Paris", "Paris"] },
    { layer: 7, predictions: ["The", "city", "the", "Paris", "Paris"] },
    { layer: 8, predictions: ["The", "city", "the", "Paris", "Paris"] },
    { layer: 9, predictions: ["The", "city", "the", "Paris", "Paris"] },
    { layer: 10, predictions: ["The", "city", "the", "Paris", "Paris"] },
    { layer: 11, predictions: ["The", "city", "the", "Paris", "Paris"] },
    { layer: 12, predictions: ["The", "city", "the", "Paris", "Paris"] },
  ];

  const currentData = layerData[activeLayer].predictions;

  return (
    <div className="logit-lens-container">
      <div className="lens-header">
        <h4>Logit Lens Simulation</h4>
        <p>Hover over or click the slider to change the Transformer layer.</p>
      </div>
      
      <div className="slider-container">
        <label>Layer: {activeLayer}</label>
        <input 
          type="range" 
          min="0" 
          max="12" 
          value={activeLayer} 
          onChange={(e) => setActiveLayer(parseInt(e.target.value))}
          className="layer-slider"
        />
      </div>

      <div className="tokens-grid">
        <div className="grid-row label-row">
          <div className="grid-cell row-label">Input Tokens</div>
          {tokens.map((token, idx) => (
            <div key={`in-${idx}`} className="grid-cell token-cell">{token}</div>
          ))}
        </div>
        
        <div className="grid-row prediction-row">
          <div className="grid-cell row-label">Top Prediction<br/>(Layer {activeLayer})</div>
          {currentData.map((pred, idx) => (
            <div 
              key={`pred-${idx}`} 
              className={`grid-cell pred-cell ${pred === 'Paris' && idx === 4 ? 'highlight-correct' : ''}`}
            >
              {pred}
            </div>
          ))}
        </div>
      </div>
      
      <div className="lens-explanation">
        {activeLayer < 3 && <p><strong>Early Layers (0-2):</strong> The model is focused on local syntax and detokenization. Predictions are noisy or default to common stop words.</p>}
        {activeLayer >= 3 && activeLayer < 6 && <p><strong>Middle Layers (3-5):</strong> The model begins to form semantic categories. It knows the context is about a "city" or "state", and the entity "Paris" starts emerging in the residual stream.</p>}
        {activeLayer >= 6 && <p><strong>Late Layers (6-12):</strong> The model has converged on the factual answer. The remaining layers simply pass this confident prediction forward to the final output.</p>}
      </div>
    </div>
  );
};

export default LogitLensVisualizer;