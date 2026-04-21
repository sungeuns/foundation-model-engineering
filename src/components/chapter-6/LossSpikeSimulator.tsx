import React, { useState, useEffect, useRef } from 'react';
import './visualizers.css';

export default function LossSpikeSimulator() {
  const [step, setStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [standardLoss, setStandardLoss] = useState([2.5]);
  const [stableLoss, setStableLoss] = useState([2.5]);
  
  const MAX_STEPS = 100;
  const NOISE_STEP = 50;

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning && step < MAX_STEPS) {
      interval = setInterval(() => {
        setStep((prev) => {
          const nextStep = prev + 1;
          
          let stdLoss = standardLoss[standardLoss.length - 1];
          let stbLoss = stableLoss[stableLoss.length - 1];

          // Natural decay
          stdLoss = Math.max(1.0, stdLoss - 0.02 + (Math.random() * 0.04 - 0.02));
          stbLoss = Math.max(1.0, stbLoss - 0.02 + (Math.random() * 0.02 - 0.01));

          // Noise injection at step 50
          if (nextStep === NOISE_STEP) {
            stdLoss += 15.0; // Massive spike
            stbLoss += 0.5;  // Absorbed spike
          }

          // Divergence cascade for standard
          if (stdLoss > 5.0 && nextStep > NOISE_STEP) {
            stdLoss = Math.min(25.0, stdLoss * 1.2);
          }

          setStandardLoss([...standardLoss, stdLoss]);
          setStableLoss([...stableLoss, stbLoss]);
          
          return nextStep;
        });
      }, 50);
    } else if (step >= MAX_STEPS) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, step, standardLoss, stableLoss]);

  const resetSimulation = () => {
    setStep(0);
    setStandardLoss([2.5]);
    setStableLoss([2.5]);
    setIsRunning(false);
  };

  const generatePath = (data: number[]) => {
    return data.map((val, idx) => `${(idx / MAX_STEPS) * 100},${100 - (val / 25) * 100}`).join(' ');
  };

  return (
    <div className="loss-simulator-container">
      <div className="simulator-header">
        <h4>Training Stability Simulator</h4>
        <div className="controls">
          <button onClick={() => setIsRunning(!isRunning)} disabled={step >= MAX_STEPS}>
            {isRunning ? 'Pause' : 'Start Training'}
          </button>
          <button onClick={resetSimulation}>Reset</button>
        </div>
      </div>
      
      <div className="chart-container">
        <svg viewBox="0 0 100 100" className="loss-chart" preserveAspectRatio="none">
          {/* Grid lines */}
          <line x1="0" y1="20" x2="100" y2="20" stroke="#333" strokeDasharray="2" strokeWidth="0.5" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="#333" strokeDasharray="2" strokeWidth="0.5" />
          <line x1="0" y1="80" x2="100" y2="80" stroke="#333" strokeDasharray="2" strokeWidth="0.5" />
          
          {/* Noise indicator */}
          <line x1="50" y1="0" x2="50" y2="100" stroke="#ff4444" strokeDasharray="1" strokeWidth="0.5" opacity="0.5" />
          <text x="51" y="10" fill="#ff4444" fontSize="3">Bad Batch (Step 50)</text>

          {/* Paths */}
          <polyline 
            points={generatePath(standardLoss)} 
            fill="none" 
            stroke="#ff6b6b" 
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline 
            points={generatePath(stableLoss)} 
            fill="none" 
            stroke="#4ecdc4" 
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="legend">
        <div className="legend-item">
          <span className="color-box" style={{backgroundColor: '#ff6b6b'}}></span>
          Standard Transformer (Explodes)
        </div>
        <div className="legend-item">
          <span className="color-box" style={{backgroundColor: '#4ecdc4'}}></span>
          Stable Transformer (QK-Norm + Capping)
        </div>
      </div>
      
      <div className="status">
        Step: {step} / {MAX_STEPS} | 
        Standard Loss: {standardLoss[standardLoss.length - 1].toFixed(2)} | 
        Stable Loss: {stableLoss[stableLoss.length - 1].toFixed(2)}
      </div>
    </div>
  );
}