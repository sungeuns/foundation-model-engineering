import React, { useState, useMemo } from 'react';
import './visualizers.css';

const RVQVisualizer: React.FC = () => {
  const [layers, setLayers] = useState<number>(1);
  const maxLayers = 8;
  const numPoints = 100;

  // Generate target signal (sine wave with some high frequency noise)
  const targetSignal = useMemo(() => {
    const signal = [];
    for (let i = 0; i < numPoints; i++) {
      const x = (i / numPoints) * Math.PI * 4;
      const val = Math.sin(x) + 0.3 * Math.sin(3 * x) + 0.1 * Math.sin(10 * x);
      signal.push(val);
    }
    return signal;
  }, []);

  // Compute reconstructed and residual signals based on number of layers
  const { reconstructed, residual } = useMemo(() => {
    let currentResidual = [...targetSignal];
    let currentReconstructed = new Array(numPoints).fill(0);

    for (let l = 0; l < layers; l++) {
      const stepSize = 2.0 / Math.pow(2, l + 1); // Codebook resolution gets finer
      for (let i = 0; i < numPoints; i++) {
        // Quantize the residual
        const quantized = Math.round(currentResidual[i] / stepSize) * stepSize;
        currentReconstructed[i] += quantized;
        currentResidual[i] -= quantized;
      }
    }

    return { reconstructed: currentReconstructed, residual: currentResidual };
  }, [layers, targetSignal]);

  const renderPath = (data: number[], color: string, strokeWidth: number = 2) => {
    const maxVal = 1.5;
    const minVal = -1.5;
    const height = 150;
    const width = 600;

    const points = data.map((val, i) => {
      const x = (i / (numPoints - 1)) * width;
      const y = height - ((val - minVal) / (maxVal - minVal)) * height;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width="100%" height="150" viewBox={`0 0 600 150`} preserveAspectRatio="none" className="rvq-svg">
        <polyline points={points} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
        {/* Zero line */}
        <line x1="0" y1="75" x2="600" y2="75" stroke="#ccc" strokeWidth="1" strokeDasharray="5,5" />
      </svg>
    );
  };

  return (
    <div className="rvq-container">
      <div className="rvq-header">
        <h3>Residual Vector Quantization (RVQ) Simulator</h3>
        <p>Adjust the number of quantizer layers (codebooks) to see how the residual decreases and reconstruction improves.</p>
      </div>
      
      <div className="rvq-controls">
        <label htmlFor="layer-slider">Quantizer Layers (Q): <strong>{layers}</strong></label>
        <input 
          id="layer-slider"
          type="range" 
          min="1" 
          max={maxLayers} 
          value={layers} 
          onChange={(e) => setLayers(parseInt(e.target.value))} 
        />
      </div>

      <div className="rvq-graphs">
        <div className="rvq-graph-box">
          <h4>Target Audio Signal</h4>
          {renderPath(targetSignal, '#9ca3af', 2)}
        </div>
        
        <div className="rvq-graph-box">
          <h4>Reconstructed Signal (Sum of {layers} Codebooks)</h4>
          {renderPath(reconstructed, '#3b82f6', 2)}
        </div>

        <div className="rvq-graph-box">
          <h4>Residual Signal (Error to be quantized by next layer)</h4>
          {renderPath(residual, '#ef4444', 2)}
        </div>
      </div>
    </div>
  );
};

export default RVQVisualizer;