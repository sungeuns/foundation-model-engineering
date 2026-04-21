import React, { useState, useEffect, useRef } from 'react';
import './visualizers.css';

const QuantizationErrorVisualizer: React.FC = () => {
  const [bitWidth, setBitWidth] = useState<number>(4);
  const [mode, setMode] = useState<'PTQ' | 'QAT'>('PTQ');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Draw Background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, height);

    const numBins = Math.pow(2, bitWidth);
    const binWidth = width / numBins;

    // Draw Quantization Bins
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    for (let i = 0; i <= numBins; i++) {
      const x = i * binWidth;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Generate Normal Distribution Weights
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = mode === 'PTQ' ? '#ef4444' : '#10b981';
    
    const mean = width / 2;
    // In QAT, the variance tightens to fit bins better, simulating learned adaptation
    const variance = mode === 'PTQ' ? width / 6 : width / 8;

    for (let x = 0; x < width; x++) {
      let y = Math.exp(-Math.pow(x - mean, 2) / (2 * Math.pow(variance, 2)));
      
      // Simulate QAT shifting peaks towards bin centers
      if (mode === 'QAT') {
        const binCenter = Math.floor(x / binWidth) * binWidth + binWidth / 2;
        const shiftFactor = Math.sin((x / binWidth) * Math.PI * 2) * 0.1;
        y = y * (1 - shiftFactor);
      }

      const drawY = height - (y * height * 0.8) - 20;
      if (x === 0) ctx.moveTo(x, drawY);
      else ctx.lineTo(x, drawY);
    }
    ctx.stroke();

    // Draw Error Area (Fill)
    ctx.fillStyle = mode === 'PTQ' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)';
    ctx.fill();

  }, [bitWidth, mode]);

  return (
    <div className="quantization-visualizer">
      <div className="controls">
        <div className="control-group">
          <label>Bit Width: <strong>{bitWidth}-bit</strong> (Levels: {Math.pow(2, bitWidth)})</label>
          <input 
            type="range" 
            min="2" 
            max="8" 
            value={bitWidth} 
            onChange={(e) => setBitWidth(Number(e.target.value))} 
          />
        </div>
        <div className="control-group">
          <label>Paradigm:</label>
          <div className="button-group">
            <button 
              className={mode === 'PTQ' ? 'active ptq' : ''} 
              onClick={() => setMode('PTQ')}
            >
              PTQ (Passive)
            </button>
            <button 
              className={mode === 'QAT' ? 'active qat' : ''} 
              onClick={() => setMode('QAT')}
            >
              QAT (Active)
            </button>
          </div>
        </div>
      </div>
      
      <div className="canvas-container">
        <canvas ref={canvasRef} width={600} height={300}></canvas>
        <div className="legend">
          <span className="legend-item">
            <span className="color-box bins"></span> Quantization Bins
          </span>
          <span className="legend-item">
            <span className={`color-box ${mode.toLowerCase()}`}></span> 
            {mode === 'PTQ' ? 'Static Weight Distribution' : 'Adapted Weight Distribution'}
          </span>
        </div>
        <p className="description">
          {mode === 'PTQ' 
            ? "In PTQ, the weight distribution is fixed, so the rounding error area increases rapidly as the bit-width decreases." 
            : "In QAT, the model actively shifts the weight distribution closer to the center of the quantization bins during training to minimize the error."}
        </p>
      </div>
    </div>
  );
};

export default QuantizationErrorVisualizer;