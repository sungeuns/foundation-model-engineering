import React, { useState, useEffect } from 'react';
import './visualizers.css';

const PassAtKVisualizer: React.FC = () => {
  const [n, setN] = useState<number>(100);
  const [c, setC] = useState<number>(10);
  const [k, setK] = useState<number>(5);
  const [passRate, setPassRate] = useState<number>(0);

  // Calculate pass@k using the product formula to avoid overflow
  useEffect(() => {
    // Edge cases
    if (c === 0) {
      setPassRate(0);
      return;
    }
    if (n - c < k) {
      setPassRate(100);
      return;
    }
    if (k === 0) {
      setPassRate(0);
      return;
    }

    let probAllFail = 1.0;
    for (let i = 0; i < k; i++) {
      probAllFail *= (n - c - i) / (n - i);
    }
    
    const passProbability = (1.0 - probAllFail) * 100;
    setPassRate(passProbability);
  }, [n, c, k]);

  // Ensure c <= n and k <= n
  const handleNChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newN = parseInt(e.target.value, 10);
    setN(newN);
    if (c > newN) setC(newN);
    if (k > newN) setK(newN);
  };

  return (
    <div className="pass-atk-container">
      <div className="pass-atk-header">
        <h3>Pass@k Calculator</h3>
        <p className="subtitle">Evaluate the probability of generating at least one correct solution.</p>
      </div>

      <div className="pass-atk-layout">
        <div className="controls-panel">
          <div className="control-group">
            <div className="control-label">
              <label>Total Samples Generated (n)</label>
              <span className="value-badge">{n}</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="200" 
              value={n} 
              onChange={handleNChange}
              className="slider slider-n"
            />
          </div>

          <div className="control-group">
            <div className="control-label">
              <label>Correct Samples in Pool (c)</label>
              <span className="value-badge correct-badge">{c}</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max={n} 
              value={c} 
              onChange={(e) => setC(parseInt(e.target.value, 10))}
              className="slider slider-c"
            />
          </div>

          <div className="control-group">
            <div className="control-label">
              <label>Samples Evaluated (k)</label>
              <span className="value-badge eval-badge">{k}</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max={n} 
              value={k} 
              onChange={(e) => setK(parseInt(e.target.value, 10))}
              className="slider slider-k"
            />
          </div>
        </div>

        <div className="result-panel">
          <div className="gauge-container">
            <svg viewBox="0 0 36 36" className="circular-chart">
              <path className="circle-bg"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path className="circle"
                strokeDasharray={`${passRate}, 100`}
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <text x="18" y="20.35" className="percentage">{passRate.toFixed(1)}%</text>
            </svg>
          </div>
          <div className="result-text">
            If you generate <strong>{n}</strong> samples and the model naturally gets <strong>{c}</strong> of them right, picking <strong>{k}</strong> samples at random gives you a <strong><span className="highlight-text">{passRate.toFixed(1)}%</span></strong> chance of passing the benchmark.
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassAtKVisualizer;
