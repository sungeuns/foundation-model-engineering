import React, { useState, useEffect } from 'react';
import './visualizers.css';

const DPOMarginVisualizer: React.FC = () => {
  const [beta, setBeta] = useState<number>(0.1);
  const [chosenRatio, setChosenRatio] = useState<number>(2.0);
  const [rejectedRatio, setRejectedRatio] = useState<number>(-1.0);
  
  const [margin, setMargin] = useState<number>(0);
  const [loss, setLoss] = useState<number>(0);

  useEffect(() => {
    // implicit reward = beta * log_ratio
    const rChosen = beta * chosenRatio;
    const rRejected = beta * rejectedRatio;
    
    const currentMargin = rChosen - rRejected;
    setMargin(currentMargin);
    
    // Loss = -log(sigmoid(margin))
    const sigmoid = 1 / (1 + Math.exp(-currentMargin));
    // clamp to avoid -Infinity
    const safeSigmoid = Math.max(sigmoid, 1e-7);
    setLoss(-Math.log(safeSigmoid));
  }, [beta, chosenRatio, rejectedRatio]);

  return (
    <div className="dpo-visualizer-container">
      <div className="dpo-header">
        <h3>DPO Loss Landscape Visualizer</h3>
        <p>Adjust the log-probability ratios to see how the implicit rewards and DPO loss react.</p>
      </div>
      
      <div className="dpo-controls">
        <div className="control-group">
          <label>Beta (KL Penalty): {beta.toFixed(2)}</label>
          <input 
            type="range" 
            min="0.01" max="0.5" step="0.01" 
            value={beta} 
            onChange={(e) => setBeta(parseFloat(e.target.value))} 
          />
        </div>
        
        <div className="control-group">
          <label>Chosen Log-Prob Ratio ($\pi_\theta / \pi_{ref}$): {chosenRatio.toFixed(1)}</label>
          <input 
            type="range" 
            min="-5" max="5" step="0.1" 
            value={chosenRatio} 
            onChange={(e) => setChosenRatio(parseFloat(e.target.value))} 
          />
        </div>
        
        <div className="control-group">
          <label>Rejected Log-Prob Ratio ($\pi_\theta / \pi_{ref}$): {rejectedRatio.toFixed(1)}</label>
          <input 
            type="range" 
            min="-5" max="5" step="0.1" 
            value={rejectedRatio} 
            onChange={(e) => setRejectedRatio(parseFloat(e.target.value))} 
          />
        </div>
      </div>

      <div className="dpo-metrics">
        <div className="metric-box">
          <h4>Implicit Reward (Chosen)</h4>
          <div className="metric-value">{(beta * chosenRatio).toFixed(3)}</div>
        </div>
        <div className="metric-box">
          <h4>Implicit Reward (Rejected)</h4>
          <div className="metric-value">{(beta * rejectedRatio).toFixed(3)}</div>
        </div>
        <div className="metric-box highlight">
          <h4>Reward Margin</h4>
          <div className="metric-value">{margin.toFixed(3)}</div>
        </div>
        <div className="metric-box alert">
          <h4>DPO Loss</h4>
          <div className="metric-value">{loss.toFixed(4)}</div>
        </div>
      </div>
      
      <div className="dpo-explanation">
        <p>
          <strong>Observation:</strong> As the <em>Reward Margin</em> increases (meaning the policy strongly prefers the chosen response over the rejected, relative to the reference model), the <em>DPO Loss</em> approaches zero. If the margin goes negative, the loss explodes exponentially.
        </p>
      </div>
    </div>
  );
};

export default DPOMarginVisualizer;