import React, { useState } from 'react';
import './visualizers.css';

const MTPVisualizer = () => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Step 1: Main Trunk Forward Pass",
      desc: "The base Transformer model generates the hidden state h_t based on the current context.",
      activeNodes: ['trunk'],
      tokens: ['h_t'],
    },
    {
      title: "Step 2: Parallel MTP Projections",
      desc: "Independent MTP heads take h_t as input and predict n future tokens simultaneously (Drafting).",
      activeNodes: ['trunk', 'head1', 'head2', 'head3'],
      tokens: ['x_{t+1}', 'x_{t+2}', 'x_{t+3}'],
    },
    {
      title: "Step 3: Zero-Overhead Verification",
      desc: "In the next step, the main model verifies the predicted draft tokens in a single forward pass. If they match, generation speed increases dramatically.",
      activeNodes: ['verify'],
      tokens: ['Verified: x_{t+1}, x_{t+2}, x_{t+3}'],
    }
  ];

  const handleNext = () => setStep((p) => (p + 1) % steps.length);
  const handlePrev = () => setStep((p) => (p - 1 + steps.length) % steps.length);

  return (
    <div className="mtp-visualizer">
      <div className="mtp-header">
        <h4>Interactive: MTP Speculative Decoding Process</h4>
        <p className="mtp-desc">{steps[step].desc}</p>
      </div>
      
      <div className="mtp-canvas">
        {step === 0 && (
          <div className="node trunk active">Main Trunk<br/>(Shared) -&gt; h_t</div>
        )}
        
        {step === 1 && (
          <div className="mtp-parallel">
            <div className="node trunk active">h_t</div>
            <div className="arrows">
              <span>➔</span>
              <span>➔</span>
              <span>➔</span>
            </div>
            <div className="heads">
              <div className="node head active">LM Head (t+1)</div>
              <div className="node head active">MTP Head 1 (t+2)</div>
              <div className="node head active">MTP Head 2 (t+3)</div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="mtp-verify">
            <div className="node verify active">Target Model Verification Pass</div>
            <div className="tokens-accepted">
              <span className="token success">{"x_{t+1} (Accept)"}</span>
              <span className="token success">{"x_{t+2} (Accept)"}</span>
              <span className="token reject">{"x_{t+3} (Reject)"}</span>
            </div>
          </div>
        )}
      </div>

      <div className="mtp-controls">
        <button onClick={handlePrev} className="btn">Prev</button>
        <span className="step-indicator">{step + 1} / 3</span>
        <button onClick={handleNext} className="btn">Next</button>
      </div>
    </div>
  );
};

export default MTPVisualizer;