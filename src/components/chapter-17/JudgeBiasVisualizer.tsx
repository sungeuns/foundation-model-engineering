import React, { useState, useEffect } from 'react';
import './visualizers.css';

const JudgeBiasVisualizer: React.FC = () => {
  const [qualityA, setQualityA] = useState<number>(60);
  const [qualityB, setQualityB] = useState<number>(80);
  
  const [positionBias, setPositionBias] = useState<boolean>(false);
  const [verbosityBias, setVerbosityBias] = useState<boolean>(false);
  const [leakageBias, setLeakageBias] = useState<boolean>(false);

  const [perceivedA, setPerceivedA] = useState<number>(60);
  const [perceivedB, setPerceivedB] = useState<number>(80);

  useEffect(() => {
    let scoreA = qualityA;
    let scoreB = qualityB;

    if (positionBias) scoreA += 12; // Model A is first
    if (verbosityBias) scoreA += 18; // Model A is much longer
    if (leakageBias) scoreA += 25; // Model A is distilled from Judge

    // Cap at 100 for visual consistency
    setPerceivedA(Math.min(100, scoreA));
    setPerceivedB(Math.min(100, scoreB));
  }, [qualityA, qualityB, positionBias, verbosityBias, leakageBias]);

  const winner = perceivedA > perceivedB ? 'Model A' : perceivedB > perceivedA ? 'Model B' : 'Tie';
  const trueWinner = qualityA > qualityB ? 'Model A' : qualityB > qualityA ? 'Model B' : 'Tie';

  return (
    <div className="bias-viz-container">
      <div className="bias-viz-header">
        <h3>LLM Judge Bias Simulator</h3>
        <p>See how specific biases alter the judge's perception of reality.</p>
      </div>

      <div className="bias-viz-grid">
        <div className="bias-controls">
          <h4>1. Set True Quality</h4>
          <div className="slider-group">
            <label>Model A True Quality: {qualityA}</label>
            <input 
              type="range" min="0" max="100" 
              value={qualityA} 
              onChange={(e) => setQualityA(Number(e.target.value))} 
              className="slider slider-a"
            />
          </div>
          <div className="slider-group">
            <label>Model B True Quality: {qualityB}</label>
            <input 
              type="range" min="0" max="100" 
              value={qualityB} 
              onChange={(e) => setQualityB(Number(e.target.value))} 
              className="slider slider-b"
            />
          </div>

          <h4 className="mt-4">2. Inject Biases (Favoring Model A)</h4>
          <div className="toggle-group">
            <label className="toggle-label">
              <input 
                type="checkbox" 
                checked={positionBias} 
                onChange={(e) => setPositionBias(e.target.checked)} 
              />
              <span className="toggle-text"><strong>Position Bias</strong> (Model A is presented first)</span>
            </label>
            <label className="toggle-label">
              <input 
                type="checkbox" 
                checked={verbosityBias} 
                onChange={(e) => setVerbosityBias(e.target.checked)} 
              />
              <span className="toggle-text"><strong>Verbosity Bias</strong> (Model A is 3x longer but fluffy)</span>
            </label>
            <label className="toggle-label">
              <input 
                type="checkbox" 
                checked={leakageBias} 
                onChange={(e) => setLeakageBias(e.target.checked)} 
              />
              <span className="toggle-text"><strong>Preference Leakage</strong> (Model A distilled from Judge)</span>
            </label>
          </div>
        </div>

        <div className="bias-results">
          <h4>Judge's Perceived Score</h4>
          
          <div className="bar-chart">
            <div className="bar-container">
              <div className="bar-label">Model A</div>
              <div className="bar-track">
                <div className="bar-fill fill-a" style={{ width: `${perceivedA}%` }}>
                  {perceivedA}
                </div>
              </div>
            </div>
            <div className="bar-container">
              <div className="bar-label">Model B</div>
              <div className="bar-track">
                <div className="bar-fill fill-b" style={{ width: `${perceivedB}%` }}>
                  {perceivedB}
                </div>
              </div>
            </div>
          </div>

          <div className="verdict-box">
            <div className="verdict-row">
              <span>True Winner:</span>
              <span className={`badge ${trueWinner === 'Model A' ? 'badge-a' : trueWinner === 'Model B' ? 'badge-b' : 'badge-tie'}`}>
                {trueWinner}
              </span>
            </div>
            <div className="verdict-row highlight-verdict">
              <span>Judge's Verdict:</span>
              <span className={`badge ${winner === 'Model A' ? 'badge-a' : winner === 'Model B' ? 'badge-b' : 'badge-tie'}`}>
                {winner}
              </span>
            </div>
            {winner !== trueWinner && (
              <div className="warning-text">
                ⚠️ The judge's verdict has been corrupted by bias!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JudgeBiasVisualizer;