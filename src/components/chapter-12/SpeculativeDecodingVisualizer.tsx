import React, { useState, useEffect } from 'react';
import './visualizers.css';

const SpeculativeDecodingVisualizer: React.FC = () => {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const sequenceSteps = [
    { text: "The", status: "committed" },
    { text: "quick", status: "committed" },
    { text: "brown", status: "committed" },
  ];

  const draftSteps = [
    { text: "fox", draftProb: 0.9, targetProb: 0.85, status: "drafting" },
    { text: "jumps", draftProb: 0.8, targetProb: 0.9, status: "drafting" },
    { text: "in", draftProb: 0.6, targetProb: 0.1, status: "drafting" },
    { text: "the", draftProb: 0.7, targetProb: 0.0, status: "drafting" },
  ];

  // Animation states
  // 0: Initial
  // 1: Draft model generates 4 tokens
  // 2: Target model verifies 'fox' (Accept)
  // 3: Target model verifies 'jumps' (Accept)
  // 4: Target model verifies 'in' (Reject)
  // 5: Target model corrects 'in' to 'over'
  // 6: Sequence committed, 'the' is discarded.

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setTimeout(() => {
        setStep((prev) => (prev >= 6 ? 0 : prev + 1));
      }, 1500);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, step]);

  const renderDraftToken = (idx: number) => {
    const token = draftSteps[idx];
    let currentStatus = "hidden";
    let displayText = token.text;

    if (step >= 1) currentStatus = "drafted";

    if (idx === 0 && step >= 2) currentStatus = "accepted";
    if (idx === 1 && step >= 3) currentStatus = "accepted";
    
    if (idx === 2) {
      if (step === 4) currentStatus = "rejected";
      if (step >= 5) {
        currentStatus = "corrected";
        displayText = "over";
      }
    }

    if (idx === 3 && step >= 4) {
      currentStatus = "discarded";
    }

    if (step === 6 && (currentStatus === "accepted" || currentStatus === "corrected")) {
        currentStatus = "committed";
    }

    return (
      <div key={idx} className={`sd-token ${currentStatus}`}>
        <span className="sd-token-text">{displayText}</span>
        {step >= 2 && currentStatus !== "discarded" && currentStatus !== "hidden" && currentStatus !== "committed" && (
          <div className="sd-probs">
            <small>Q: {token.draftProb}</small>
            <small>P: {idx === 2 && step >= 5 ? "1.0" : token.targetProb}</small>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="sd-visualizer-container">
      <div className="sd-controls">
        <button onClick={() => setIsPlaying(!isPlaying)} className="sd-btn">
          {isPlaying ? "Pause" : "Play Animation"}
        </button>
        <button onClick={() => setStep(0)} className="sd-btn">Reset</button>
        <span className="sd-step-indicator">Phase: {
          step === 0 ? "Idle" :
          step === 1 ? "Drafting Phase (Fast)" :
          step <= 4 ? "Verification Phase (Parallel)" :
          step === 5 ? "Correction (Resampling)" : "Commit"
        }</span>
      </div>

      <div className="sd-sequence-box">
        <div className="sd-label">Base Sequence</div>
        <div className="sd-tokens-row">
          {sequenceSteps.map((t, i) => (
            <div key={`base-${i}`} className={`sd-token ${t.status}`}>
              <span className="sd-token-text">{t.text}</span>
            </div>
          ))}
          {draftSteps.map((_, i) => renderDraftToken(i))}
        </div>
      </div>

      <div className="sd-legend">
        <div className="sd-legend-item"><span className="sd-dot drafted"></span> Drafted</div>
        <div className="sd-legend-item"><span className="sd-dot accepted"></span> Accepted</div>
        <div className="sd-legend-item"><span className="sd-dot rejected"></span> Rejected</div>
        <div className="sd-legend-item"><span className="sd-dot corrected"></span> Corrected</div>
        <div className="sd-legend-item"><span className="sd-dot discarded"></span> Discarded</div>
      </div>
    </div>
  );
};

export default SpeculativeDecodingVisualizer;