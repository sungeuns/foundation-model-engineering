import React, { useState } from 'react';
import './visualizers.css';

const BPEMergeVisualizer = () => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      description: "Step 0: Initial Byte-level Tokens",
      tokens: ["e", "n", "c", "o", "d", "e", "r"],
      action: "Identify most frequent adjacent pair in corpus. (Assume 'e' and 'r' appear together frequently in the wider corpus)."
    },
    {
      description: "Step 1: First Merge",
      tokens: ["e", "n", "c", "o", "d", "er"],
      action: "Merged 'e' + 'r' -> 'er'. Next frequent pair: 'e' and 'n'."
    },
    {
      description: "Step 2: Second Merge",
      tokens: ["en", "c", "o", "d", "er"],
      action: "Merged 'e' + 'n' -> 'en'. Next frequent pair: 'c' and 'o'."
    },
    {
      description: "Step 3: Third Merge",
      tokens: ["en", "co", "d", "er"],
      action: "Merged 'c' + 'o' -> 'co'. The word is now compressed from 7 tokens to 4 tokens."
    }
  ];

  const currentStep = steps[step];

  return (
    <div className="bpe-container">
      <h3 className="bpe-title">Interactive BPE Merge Process</h3>
      <div className="bpe-card">
        <p className="bpe-description"><strong>{currentStep.description}</strong></p>
        <div className="bpe-token-display">
          {currentStep.tokens.map((token, idx) => (
            <div key={idx} className="bpe-token">
              {token}
            </div>
          ))}
        </div>
        <p className="bpe-action">{currentStep.action}</p>
        
        <div className="bpe-controls">
          <button 
            className="bpe-btn" 
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
          >
            Previous
          </button>
          <span className="bpe-step-indicator">Step {step} of {steps.length - 1}</span>
          <button 
            className="bpe-btn" 
            onClick={() => setStep(Math.min(steps.length - 1, step + 1))}
            disabled={step === steps.length - 1}
          >
            Next Merge
          </button>
        </div>
      </div>
    </div>
  );
};

export default BPEMergeVisualizer;