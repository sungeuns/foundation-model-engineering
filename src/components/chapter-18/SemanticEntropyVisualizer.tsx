import React, { useState } from 'react';
import './visualizers.css';

export default function SemanticEntropyVisualizer() {
  const [mode, setMode] = useState<'factual' | 'hallucination'>('factual');
  const [step, setStep] = useState(0);

  const factualSamples = [
    { id: 1, text: "Paris.", cluster: "A" },
    { id: 2, text: "The capital of France is Paris.", cluster: "A" },
    { id: 3, text: "Paris, the city of light.", cluster: "A" }
  ];

  const hallucinationSamples = [
    { id: 1, text: "Lyon.", cluster: "A" },
    { id: 2, text: "Marseille.", cluster: "B" },
    { id: 3, text: "Bordeaux.", cluster: "C" }
  ];

  const currentSamples = mode === 'factual' ? factualSamples : hallucinationSamples;
  const entropy = mode === 'factual' ? "Low (0.00)" : "High (1.09)";

  return (
    <div className="semantic-entropy-container">
      <div className="controls">
        <button onClick={() => { setMode('factual'); setStep(0); }} className={mode === 'factual' ? 'active' : ''}>Factual Scenario</button>
        <button onClick={() => { setMode('hallucination'); setStep(0); }} className={mode === 'hallucination' ? 'active' : ''}>Hallucination Scenario</button>
      </div>
      
      <div className="prompt-box">
        <strong>Prompt:</strong> Where is the capital of France?
      </div>

      <div className="step-controls">
        <button onClick={() => setStep(1)} disabled={step >= 1}>1. Sample Responses</button>
        <button onClick={() => setStep(2)} disabled={step < 1 || step >= 2}>2. NLI Clustering</button>
        <button onClick={() => setStep(3)} disabled={step < 2 || step >= 3}>3. Calculate Entropy</button>
      </div>

      {step >= 1 && (
        <div className="samples-grid">
          {currentSamples.map((sample, idx) => (
            <div key={idx} className={`sample-card ${step >= 2 ? 'clustered cluster-' + sample.cluster : ''}`}>
              <div><strong>Sample {sample.id}</strong></div>
              <div style={{ marginTop: '8px', marginBottom: '8px' }}>{sample.text}</div>
              {step >= 2 && <div className="cluster-badge">Meaning Cluster: {sample.cluster}</div>}
            </div>
          ))}
        </div>
      )}

      {step >= 3 && (
        <div className={`result-box ${mode === 'factual' ? 'success' : 'danger'}`}>
          <strong>Semantic Entropy: {entropy}</strong>
          <p style={{ marginTop: '8px', marginBottom: 0 }}>{mode === 'factual' ? "All samples point to the same meaning (Cluster A), resulting in low entropy. The model is confident in the fact." : "Samples are fully dispersed across different meanings (Clusters A, B, C), resulting in high entropy. This is a typical hallucination state."}</p>
        </div>
      )}
    </div>
  );
}