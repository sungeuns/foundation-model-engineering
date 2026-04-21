import React, { useState } from 'react';
import './visualizers.css';

const VerifierFlowVisualizer = () => {
  const [activeTab, setActiveTab] = useState('orm');

  const mathProblem = "Solve: 3x + 7 = 22";
  const candidateSolution = [
    { step: 1, text: "3x + 7 = 22", isCorrect: true },
    { step: 2, text: "3x = 22 + 7", isCorrect: false, note: "Sign error" },
    { step: 3, text: "3x = 29", isCorrect: false },
    { step: 4, text: "x = 29/3", isCorrect: false }
  ];

  return (
    <div className="verifier-visualizer-container">
      <div className="verifier-header">
        <h3>Interactive: Verifier Paradigms</h3>
        <p>Observe how different Reward Models evaluate the same flawed reasoning path.</p>
      </div>
      
      <div className="verifier-tabs">
        <button className={activeTab === 'orm' ? 'active' : ''} onClick={() => setActiveTab('orm')}>ORM (Outcome)</button>
        <button className={activeTab === 'prm' ? 'active' : ''} onClick={() => setActiveTab('prm')}>PRM (Process)</button>
        <button className={activeTab === 'genrm' ? 'active' : ''} onClick={() => setActiveTab('genrm')}>GenRM (Generative)</button>
      </div>

      <div className="verifier-content">
        <div className="problem-panel">
          <h4>Problem</h4>
          <div className="code-font">{mathProblem}</div>
          
          <h4 style={{ marginTop: '1rem' }}>Candidate Solution</h4>
          <div className="solution-steps">
            {candidateSolution.map((s, idx) => (
              <div key={idx} className="step-row">
                <span className="step-num">Step {s.step}:</span>
                <span className="step-text code-font">{s.text}</span>
                {activeTab === 'prm' && (
                  <span className={`prm-badge ${s.isCorrect ? 'positive' : 'negative'}`}>
                    {s.isCorrect ? '✓ Valid' : '✗ Invalid'}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="evaluation-panel">
          <h4>Evaluation Logic</h4>
          {activeTab === 'orm' && (
            <div className="eval-box orm-box">
              <p><strong>Mechanism:</strong> Scalar Regression on Final Token</p>
              <div className="eval-process">
                <p>Reading final step: <code className="code-font">x = 29/3</code></p>
                <p>Comparing to Target: <code className="code-font">x = 5</code></p>
                <div className="result final-score-bad">
                  Score: 0.01 (Incorrect)
                </div>
                <p className="insight"><strong>Flaw:</strong> The model gets a 0, but has no idea that Step 2 was the actual mistake. The credit assignment is too sparse.</p>
              </div>
            </div>
          )}

          {activeTab === 'prm' && (
            <div className="eval-box prm-box">
              <p><strong>Mechanism:</strong> Token-level Classification at Step Boundaries</p>
              <div className="eval-process">
                <p>Evaluating Step 1... <span className="score-good">Score: 0.98</span></p>
                <p>Evaluating Step 2... <span className="score-bad">Score: 0.05</span></p>
                <div className="result final-action">
                  Action: Prune Branch at Step 2
                </div>
                <p className="insight"><strong>Flaw:</strong> Excellent for search, but requires massive human labeling. The model outputs scalars, not explanations.</p>
              </div>
            </div>
          )}

          {activeTab === 'genrm' && (
            <div className="eval-box genrm-box">
              <p><strong>Mechanism:</strong> Next-Token Prediction (Rationale -&gt; Verdict)</p>
              <div className="eval-process">
                <p><strong>Generated Rationale:</strong></p>
                <div className="rationale-text">
                  "Let's check the steps. Step 1 is the premise. In Step 2, the candidate moves +7 to the right side. When moving across the equals sign, the sign should flip to -7. The candidate wrote 22 + 7 instead of 22 - 7. This is an arithmetic error. Therefore, the solution is incorrect."
                </div>
                <div className="result final-verdict">
                  Final Token: <strong>No</strong> (P = 0.99)
                </div>
                <p className="insight"><strong>Advantage:</strong> The model uses its KV cache to compute the logic before deciding. We can also sample 16 rationales and take a majority vote!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifierFlowVisualizer;