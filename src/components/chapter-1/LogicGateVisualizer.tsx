import React, { useState } from 'react';
import './visualizers.css';

export const LogicGateVisualizer = () => {
  const [inputA, setInputA] = useState(0);
  const [inputB, setInputB] = useState(0);
  const [w1, setW1] = useState(1.0);
  const [w2, setW2] = useState(1.0);
  const [bias, setBias] = useState(-1.5); // Default for AND gate

  const symbolicOutput = (inputA === 1 && inputB === 1) ? 1 : 0;
  
  const sum = inputA * w1 + inputB * w2 + bias;
  const connectionistOutput = sum >= 0 ? 1 : 0;

  return (
    <div className="lg-container">
      <h3 className="lg-title">Symbolism vs Connectionism: The AND Gate</h3>
      <p className="lg-description">Toggle inputs and adjust weights to see how both paradigms solve the AND gate.</p>
      
      <div className="lg-inputs">
        <button onClick={() => setInputA(inputA === 0 ? 1 : 0)} className="lg-input-btn">
          Input A: {inputA}
        </button>
        <button onClick={() => setInputB(inputB === 0 ? 1 : 0)} className="lg-input-btn">
          Input B: {inputB}
        </button>
      </div>

      <div className="lg-row">
        {/* Symbolic Column */}
        <div className="lg-column">
          <h4 className="lg-column-title">Symbolic (Rule-Based)</h4>
          <div className="lg-box">
            <code className="lg-code">
              if A == 1 and B == 1:<br/>
              &nbsp;&nbsp;return 1<br/>
              else:<br/>
              &nbsp;&nbsp;return 0
            </code>
            <div className="lg-output-label">Output: {symbolicOutput}</div>
          </div>
        </div>

        {/* Connectionist Column */}
        <div className="lg-column">
          <h4 className="lg-column-title">Connectionist (Neural)</h4>
          <div className="lg-box">
            <div className="lg-formula">
              f({inputA} × {w1.toFixed(1)} + {inputB} × {w2.toFixed(1)} + {bias.toFixed(1)}) = f({sum.toFixed(1)})
            </div>
            <div className="lg-sliders">
              <label>W1: {w1.toFixed(1)}
                <input type="range" min="-2" max="2" step="0.1" value={w1} onChange={(e) => setW1(parseFloat(e.target.value))} />
              </label>
              <label>W2: {w2.toFixed(1)}
                <input type="range" min="-2" max="2" step="0.1" value={w2} onChange={(e) => setW2(parseFloat(e.target.value))} />
              </label>
              <label>Bias: {bias.toFixed(1)}
                <input type="range" min="-2" max="2" step="0.1" value={bias} onChange={(e) => setBias(parseFloat(e.target.value))} />
              </label>
            </div>
            <div className="lg-output-label">Output: {connectionistOutput}</div>
          </div>
        </div>
      </div>
      
      <div className="lg-explanation">
        <p>
          <strong>AND Gate Goal:</strong> Output should be 1 ONLY when both inputs are 1.
        </p>
        <p>
          {symbolicOutput === connectionistOutput 
            ? "✅ Both systems match!" 
            : "❌ Systems disagree. Adjust weights/bias to fix the neuron!"}
        </p>
      </div>
    </div>
  );
};
