import React, { useState, useEffect } from 'react';
import './visualizers.css';

const FlashTilingVisualizer = () => {
  const [step, setStep] = useState(0);
  const totalSteps = 6;

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % totalSteps);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const getStepDescription = () => {
    switch (step) {
      case 0: return "Initial State: Q, K, V matrices reside in slow HBM.";
      case 1: return "Step 1: Load a block of Query (Q_block) into fast SRAM.";
      case 2: return "Step 2: Load a block of Key (K_block) and Value (V_block) into SRAM.";
      case 3: return "Step 3: Compute localized Attention Scores (S_block = Q_block * K_block^T).";
      case 4: return "Step 4: Update Online Softmax statistics and compute P_block.";
      case 5: return "Step 5: Multiply by V_block, accumulate to Output (O_block), and write to HBM.";
      default: return "";
    }
  };

  return (
    <div className="tiling-container">
      <div className="visualizer-header">
        <h3>FlashAttention Tiling Process (IO-Awareness)</h3>
        <p className="step-description">{getStepDescription()}</p>
      </div>
      
      <div className="memory-architecture">
        {/* HBM Section */}
        <div className="memory-zone hbm">
          <h4>HBM (High Bandwidth Memory) - Slow & Large</h4>
          <div className="matrix-row">
            <div className={`block ${step === 0 || step === 1 ? 'active-q' : 'idle'}`}>Q Matrix</div>
            <div className={`block ${step === 0 || step === 2 ? 'active-k' : 'idle'}`}>K Matrix</div>
            <div className={`block ${step === 0 || step === 2 ? 'active-v' : 'idle'}`}>V Matrix</div>
          </div>
          <div className="matrix-row">
            <div className={`block ${step === 5 ? 'active-o' : 'idle'}`}>Output Matrix (O)</div>
          </div>
        </div>

        {/* Bandwidth Bottleneck Indicator */}
        <div className="bandwidth-arrow">
          {step > 0 && step < 6 ? '↕ Asynchronous Transfer ↕' : ' '}
        </div>

        {/* SRAM Section */}
        <div className="memory-zone sram">
          <h4>SRAM (On-Chip Memory) - Fast & Tiny</h4>
          <div className="sram-grid">
            <div className={`sram-block ${step >= 1 ? 'loaded-q' : 'empty'}`}>
              {step >= 1 ? 'Q_block' : 'Empty'}
            </div>
            <div className={`sram-block ${step >= 2 && step <= 5 ? 'loaded-k' : 'empty'}`}>
              {step >= 2 && step <= 5 ? 'K_block' : 'Empty'}
            </div>
            <div className={`sram-block ${step >= 2 && step <= 5 ? 'loaded-v' : 'empty'}`}>
              {step >= 2 && step <= 5 ? 'V_block' : 'Empty'}
            </div>
          </div>
          
          <div className="compute-zone">
            <h4>Tensor Cores (Compute)</h4>
            <div className={`compute-op ${step === 3 ? 'active-compute' : ''}`}>
              {step === 3 ? 'MatMul: Q * K^T' : 'Idle'}
            </div>
            <div className={`compute-op ${step === 4 ? 'active-compute' : ''}`}>
              {step === 4 ? 'Online Softmax' : 'Idle'}
            </div>
            <div className={`compute-op ${step === 5 ? 'active-compute' : ''}`}>
              {step === 5 ? 'MatMul: P * V' : 'Idle'}
            </div>
          </div>
        </div>
      </div>
      
      <div className="controls">
        <button onClick={() => setStep((prev) => (prev - 1 + totalSteps) % totalSteps)}>Previous</button>
        <button onClick={() => setStep((prev) => (prev + 1) % totalSteps)}>Next</button>
      </div>
    </div>
  );
};

export default FlashTilingVisualizer;