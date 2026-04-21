import React, { useState, useEffect } from 'react';
import './visualizers.css';

const GrokkingVisualizer: React.FC = () => {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && step < 100) {
      interval = setInterval(() => {
        setStep((prev) => prev + 1);
      }, 50);
    } else if (step >= 100) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, step]);

  const handlePlay = () => {
    if (step >= 100) setStep(0);
    setIsPlaying(true);
  };

  const trainLoss = step < 20 ? 100 - step * 4.9 : 2;
  const valLoss = step < 60 ? 100 - step * 0.2 : (step < 80 ? 88 - (step - 60) * 4.3 : 2);
  const weightNorm = step < 20 ? 10 + step * 2 : 50 - (step - 20) * 0.5;

  return (
    <div className="grokking-container">
      <h3>Interactive: Grokking Phase Transition</h3>
      <p className="grokking-desc">
        훈련 손실(Training Loss)이 0에 도달한 후에도 검증 손실(Validation Loss)이 높게 유지되다가, 가중치 노름(Weight Norm)이 충분히 수축하면서 "그로킹(Grokking)" 상전이가 발생하는 과정을 관찰해 보세요.
      </p>
      
      <div className="grokking-graph">
        <div className="grokking-y-axis">Loss / Norm</div>
        <div className="grokking-chart-area">
          <svg viewBox="0 0 100 100" className="grokking-svg">
            {/* Training Loss */}
            <polyline
              fill="none"
              stroke="#ef4444"
              strokeWidth="2"
              points={Array.from({ length: step + 1 }).map((_, i) => `${i},${i < 20 ? 100 - i * 4.9 : 2}`).join(' ')}
            />
            {/* Validation Loss */}
            <polyline
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              points={Array.from({ length: step + 1 }).map((_, i) => {
                const vL = i < 60 ? 100 - i * 0.2 : (i < 80 ? 88 - (i - 60) * 4.3 : 2);
                return `${i},${vL}`;
              }).join(' ')}
            />
            {/* Weight Norm */}
            <polyline
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
              strokeDasharray="4"
              points={Array.from({ length: step + 1 }).map((_, i) => {
                const wN = i < 20 ? 10 + i * 2 : 50 - (i - 20) * 0.5;
                return `${i},${100 - wN}`; // Invert for visual scaling
              }).join(' ')}
            />
            {step >= 80 && (
              <line x1="80" y1="0" x2="80" y2="100" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2" />
            )}
          </svg>
        </div>
        <div className="grokking-x-axis">Training Steps (x1000)</div>
      </div>

      <div className="grokking-legend">
        <div className="legend-item"><span className="color-box train"></span> Training Loss (Memorization)</div>
        <div className="legend-item"><span className="color-box val"></span> Validation Loss (Generalization)</div>
        <div className="legend-item"><span className="color-box norm"></span> Weight Norm (Regularization)</div>
      </div>

      <div className="grokking-controls">
        <button onClick={handlePlay} disabled={isPlaying}>
          {isPlaying ? 'Simulating...' : (step >= 100 ? 'Restart Simulation' : 'Start Training')}
        </button>
        <span className="grokking-status">
          {step < 20 ? "Phase: Memorizing Training Data..." : 
           step < 60 ? "Phase: Overfitted. Weight Norm Contracting..." :
           step < 80 ? "Phase: Grokking! Circuits Collapsing..." :
           step > 0 ? "Phase: Generalized Solution Found." : "Ready"}
        </span>
      </div>
    </div>
  );
};

export default GrokkingVisualizer;