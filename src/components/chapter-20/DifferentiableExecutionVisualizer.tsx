import React, { useState, useMemo } from 'react';
import './visualizers.css';

const DifferentiableExecutionVisualizer: React.FC = () => {
  const [logitA, setLogitA] = useState<number>(2.0);
  const [logitB, setLogitB] = useState<number>(0.5);
  const [temperature, setTemperature] = useState<number>(1.0);

  // Compute standard softmax probabilities
  const maxLogit = Math.max(logitA, logitB);
  const expA = Math.exp((logitA - maxLogit) / temperature);
  const expB = Math.exp((logitB - maxLogit) / temperature);
  const sumExp = expA + expB;
  
  const probA = expA / sumExp;
  const probB = expB / sumExp;

  return (
    <div className="visualizer-container">
      <h3 className="visualizer-title">Gumbel-Softmax Routing Visualizer</h3>
      <p className="visualizer-desc">
        Adjust the raw logits and the temperature to see how the execution path transitions from a soft mixture (both programs execute partially) to a hard discrete choice (one program executes entirely).
      </p>
      
      <div className="controls-panel">
        <div className="control-group">
          <label>Program A Logit: {logitA.toFixed(1)}</label>
          <input 
            type="range" min="-5" max="5" step="0.1" 
            value={logitA} onChange={(e) => setLogitA(parseFloat(e.target.value))} 
          />
        </div>
        <div className="control-group">
          <label>Program B Logit: {logitB.toFixed(1)}</label>
          <input 
            type="range" min="-5" max="5" step="0.1" 
            value={logitB} onChange={(e) => setLogitB(parseFloat(e.target.value))} 
          />
        </div>
        <div className="control-group temp-group">
          <label>Temperature (τ): {temperature.toFixed(2)}</label>
          <input 
            type="range" min="0.05" max="5" step="0.05" 
            value={temperature} onChange={(e) => setTemperature(parseFloat(e.target.value))} 
          />
          <span className="temp-hint">
            {temperature < 0.2 ? "Hard Routing (Discrete)" : temperature > 2 ? "Soft Mixture (Uniform)" : "Soft Routing (Continuous)"}
          </span>
        </div>
      </div>

      <div className="routing-graph">
        <div className="node input-node">Input x</div>
        
        <div className="paths-container">
          <div className="path-wrapper">
            <div className="path-line" style={{ opacity: probA, strokeWidth: probA * 10 }}>
              <div className="prob-label">P(A) = {(probA * 100).toFixed(1)}%</div>
            </div>
            <div className="node program-node" style={{ backgroundColor: `rgba(59, 130, 246, ${probA})` }}>
              Program A
            </div>
          </div>
          
          <div className="path-wrapper">
            <div className="path-line" style={{ opacity: probB, strokeWidth: probB * 10 }}>
              <div className="prob-label">P(B) = {(probB * 100).toFixed(1)}%</div>
            </div>
            <div className="node program-node" style={{ backgroundColor: `rgba(239, 68, 68, ${probB})` }}>
              Program B
            </div>
          </div>
        </div>
        
        <div className="node output-node">
          Expected Output = <br/>
          {probA > 0.95 ? "Program A(x)" : probB > 0.95 ? "Program B(x)" : "P(A)*ProgA(x) + P(B)*ProgB(x)"}
        </div>
      </div>
    </div>
  );
};

export default DifferentiableExecutionVisualizer;