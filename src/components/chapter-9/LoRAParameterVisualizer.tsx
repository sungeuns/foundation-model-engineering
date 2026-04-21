import React, { useState } from 'react';
import './visualizers.css';

const LoRAParameterVisualizer = () => {
  const [dimension, setDimension] = useState(4096);
  const [rank, setRank] = useState(16);

  const fullParams = dimension * dimension;
  const loraParams = 2 * dimension * rank;
  const reduction = ((1 - loraParams / fullParams) * 100).toFixed(4);

  return (
    <div className="lora-visualizer">
      <h3>LoRA Parameter Efficiency Calculator</h3>
      <div className="controls">
        <label>
          Model Dimension (d): {dimension}
          <input type="range" min="1024" max="16384" step="1024" value={dimension} onChange={(e) => setDimension(Number(e.target.value))} />
        </label>
        <label>
          LoRA Rank (r): {rank}
          <input type="range" min="2" max="256" step="2" value={rank} onChange={(e) => setRank(Number(e.target.value))} />
        </label>
      </div>
      <div className="stats">
        <div className="stat-box full-tune">
          <h4>Full Fine-Tuning</h4>
          <p>Matrix W (d × d)</p>
          <div className="param-count">{fullParams.toLocaleString()}</div>
          <span>Trainable Parameters</span>
        </div>
        <div className="stat-box lora-tune">
          <h4>LoRA</h4>
          <p>Matrices A (d × r) + B (r × d)</p>
          <div className="param-count">{loraParams.toLocaleString()}</div>
          <span>Trainable Parameters</span>
        </div>
      </div>
      <div className="reduction-bar">
        <div className="reduction-fill" style={{ width: `${100 - (loraParams / fullParams) * 100}%` }}>
          Parameter Reduction: {reduction}%
        </div>
      </div>
    </div>
  );
};

export default LoRAParameterVisualizer;