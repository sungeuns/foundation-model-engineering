import React, { useState } from 'react';
import './visualizers.css';

const QuantizationMethodVisualizer = () => {
  const [method, setMethod] = useState('original');

  const originalWeights = [0.12, -0.25, 0.08, 4.85, -0.15];
  
  // Simulated outputs based on algorithms
  const getWeights = () => {
    switch (method) {
      case 'uniform':
        // Uniform INT4 clips the outlier to max bin or destroys small weights
        return [0.0, 0.0, 0.0, 3.5, 0.0]; 
      case 'awq':
        // AWQ scales up the weights, preserving relative structure better
        return [0.1, -0.2, 0.1, 4.8, -0.1];
      case 'gptq':
        // GPTQ shifts errors. The first weight rounds, error pushes to next.
        return [0.1, -0.28, 0.05, 4.85, -0.12];
      default:
        return originalWeights;
    }
  };

  const weights = getWeights();

  const getDescription = () => {
    switch (method) {
      case 'uniform':
        return 'Uniform INT4: The scale is too large to represent the massive outlier (4.85), causing the remaining small weights to collapse to 0.';
      case 'awq':
        return 'AWQ (Activation-aware): Dynamically adjusts the scale of channels with outliers to preserve them while relatively maintaining the precision of small weights.';
      case 'gptq':
        return 'GPTQ (Hessian-based): Shifts the quantization error to the next weights via the inverse Hessian to mathematically minimize the overall output error.';
      default:
        return 'Original Weights (FP16): A typical LLM weight distribution with small weights densely packed around 0 and one extreme outlier (4.85).';
    }
  };

  return (
    <div className="quant-method-container">
      <div className="quant-header">
        <h4>Quantization Algorithm Simulator</h4>
        <div className="quant-tabs">
          <button className={method === 'original' ? 'active' : ''} onClick={() => setMethod('original')}>Original (FP16)</button>
          <button className={method === 'uniform' ? 'active' : ''} onClick={() => setMethod('uniform')}>Uniform INT4</button>
          <button className={method === 'awq' ? 'active' : ''} onClick={() => setMethod('awq')}>AWQ</button>
          <button className={method === 'gptq' ? 'active' : ''} onClick={() => setMethod('gptq')}>GPTQ</button>
        </div>
      </div>
      
      <div className="quant-visualization">
        <div className="weights-grid">
          {weights.map((w, idx) => {
            const isOutlier = Math.abs(w) > 2.0;
            const height = Math.min(Math.abs(w) * 30, 150) + 10;
            return (
              <div key={idx} className={`weight-bar-container ${isOutlier ? 'outlier' : ''}`}>
                <div 
                  className="weight-bar" 
                  style={{ height: `${height}px`, backgroundColor: isOutlier ? '#e74c3c' : '#3498db' }}
                ></div>
                <div className="weight-value">{w.toFixed(2)}</div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="quant-description">
        <p>{getDescription()}</p>
      </div>
    </div>
  );
};

export default QuantizationMethodVisualizer;