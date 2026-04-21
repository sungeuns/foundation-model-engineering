import React, { useState } from 'react';
import './visualizers.css';

export const ExpertParallelismVisualizer = () => {
  const [step, setStep] = useState(0); // 0: Init, 1: Sorted, 2: Dispatched, 3: Computed, 4: Combined

  // 4 GPUs, each with 4 initial tokens. 
  // Number represents the Target Expert ID (0-3).
  const initialTokens = [
    [1, 3, 0, 2], // GPU 0's local tokens
    [0, 0, 1, 3], // GPU 1's local tokens
    [2, 2, 3, 1], // GPU 2's local tokens
    [3, 1, 0, 2]  // GPU 3's local tokens
  ];

  const tokenColors = ['ep-token-0', 'ep-token-1', 'ep-token-2', 'ep-token-3'];
  const labelColors = ['ep-label-0', 'ep-label-1', 'ep-label-2', 'ep-label-3'];
  const gpuLabels = ['GPU 0 (Exp 0)', 'GPU 1 (Exp 1)', 'GPU 2 (Exp 2)', 'GPU 3 (Exp 3)'];

  const getTokensForStep = (gpuIndex: number) => {
    if (step === 0) return initialTokens[gpuIndex];
    
    if (step === 1) {
      // Sort tokens locally by target expert
      return [...initialTokens[gpuIndex]].sort((a, b) => a - b);
    }
    
    if (step === 2 || step === 3) {
      // Dispatched: GPU i only holds tokens destined for Expert i
      let received: number[] = [];
      initialTokens.forEach(gpuTokens => {
        received.push(...gpuTokens.filter(t => t === gpuIndex));
      });
      return received;
    }
    
    if (step === 4) {
      // Combined: Tokens return to original GPUs
      return initialTokens[gpuIndex];
    }
    return [];
  };

  return (
    <div className="ep-container">
      <h3 className="ep-title">All-to-All Token Routing Simulator</h3>
      <p className="ep-description">Observe how tokens move across the network to their target experts.</p>
      
      <div className="ep-button-group">
        {[
          { label: '0. Init', val: 0 },
          { label: '1. Sort', val: 1 },
          { label: '2. Dispatch', val: 2 },
          { label: '3. Compute', val: 3 },
          { label: '4. Combine', val: 4 }
        ].map((btn) => (
          <button 
            key={btn.val}
            onClick={() => setStep(btn.val)} 
            className={`ep-button ${step === btn.val ? 'ep-button-active' : 'ep-button-inactive'}`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      <div className="ep-grid">
        {[0, 1, 2, 3].map(gpuIdx => (
          <div key={gpuIdx} className="ep-card">
            <div className={`ep-label ${labelColors[gpuIdx]}`}>
              {gpuLabels[gpuIdx]}
            </div>
            
            <div className="ep-token-container">
              {getTokensForStep(gpuIdx).map((targetExpert, idx) => (
                <div 
                  key={idx} 
                  className={`ep-token ${tokenColors[targetExpert]} ${step === 3 ? 'ep-token-pulse' : ''}`}
                >
                  {step >= 3 && step < 4 ? '✓' : `E${targetExpert}`}
                </div>
              ))}
            </div>
            
            <div className="ep-status">
              {step === 0 && "Local"}
              {step === 1 && "Sorted"}
              {step === 2 && "Routed"}
              {step === 3 && "Done"}
              {step === 4 && "Returned"}
            </div>
          </div>
        ))}
      </div>

      <div className="ep-step-box">
        <h4 className="ep-step-title">Step Description</h4>
        <p className="ep-step-text">
          {step === 0 && "Every GPU starts with a local batch of tokens destined for different experts across the cluster."}
          {step === 1 && "Tokens are sorted locally by their target GPU rank to prepare for contiguous network transmission."}
          {step === 2 && "The All-to-All collective operation executes. Tokens are physically moved to the GPUs that own their target experts."}
          {step === 3 && "GPUs process the incoming tokens through their local expert weights. Notice the compute is now perfectly isolated."}
          {step === 4 && "Computed tokens are transmitted back to their origin GPUs (another All-to-All) to continue the dense layers."}
        </p>
      </div>
    </div>
  );
};
