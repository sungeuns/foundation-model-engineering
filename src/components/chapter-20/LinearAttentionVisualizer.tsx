import React, { useState } from 'react';
import './visualizers.css';

const LinearAttentionVisualizer: React.FC = () => {
  const [seqLength, setSeqLength] = useState<number>(4000);

  // Constants for calculation (Based on 32 layers, 32 heads, 128 head dim, FP16)
  const bytesPerTokenStandard = 2 * 32 * 32 * 128 * 2; // ~524KB
  const standardMemoryMB = (seqLength * bytesPerTokenStandard) / (1024 * 1024);
  
  // Linear Attention State: 32 layers * 32 heads * 128 * 128 (d x d) * 2 bytes
  const linearMemoryBytes = 32 * 32 * 128 * 128 * 2;
  const linearMemoryMB = linearMemoryBytes / (1024 * 1024); // ~33.55 MB (Constant)

  const maxStandardMB = (128000 * bytesPerTokenStandard) / (1024 * 1024);

  return (
    <div className="visualizer-container">
      <h3 className="visualizer-title">KV Cache Memory Complexity: $O(n)$ vs $O(1)$</h3>
      <p className="visualizer-desc">
        Adjust the sequence length to see how the memory footprint of Standard Attention grows linearly with context, while Linear Attention maintains a constant state size.
      </p>
      
      <div className="slider-container">
        <label htmlFor="seq-slider" className="slider-label">
          Sequence Length: <strong>{seqLength.toLocaleString()} tokens</strong>
        </label>
        <input 
          id="seq-slider"
          type="range" 
          min="1000" 
          max="128000" 
          step="1000" 
          value={seqLength} 
          onChange={(e) => setSeqLength(Number(e.target.value))}
          className="context-slider"
        />
      </div>

      <div className="bars-container">
        <div className="bar-row">
          <div className="bar-label">
            <span>Standard Attention</span>
            <span className="memory-value">{standardMemoryMB >= 1024 ? (standardMemoryMB/1024).toFixed(2) + ' GB' : standardMemoryMB.toFixed(1) + ' MB'}</span>
          </div>
          <div className="bar-track">
            <div 
              className="bar-fill standard-fill" 
              style={{ width: `${Math.max(1, (standardMemoryMB / maxStandardMB) * 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="bar-row">
          <div className="bar-label">
            <span>Linear Attention (RNN State)</span>
            <span className="memory-value">{linearMemoryMB.toFixed(1)} MB</span>
          </div>
          <div className="bar-track">
            <div 
              className="bar-fill linear-fill" 
              style={{ width: `${Math.max(1, (linearMemoryMB / maxStandardMB) * 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="visualizer-footer">
        * Calculation based on typical Llama-3 8B dimensions (32 layers, 32 heads, 128 head dim, FP16 precision). Standard Attention requires caching past tokens, while Linear Attention only maintains a fixed $d \times d$ memory matrix per head.
      </div>
    </div>
  );
};

export default LinearAttentionVisualizer;