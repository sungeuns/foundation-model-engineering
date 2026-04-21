import React, { useState } from 'react';
import './visualizers.css';

interface ScenarioData {
  name: string;
  features: { wheels: number; color: string; ratio: number };
  fe_status: 'Success' | 'Failed';
  rl_status: 'Success';
  fe_rules: string;
  explanation: string;
}

const scenarios: Record<string, ScenarioData> = {
  normal: {
    name: "Daytime Car",
    features: { wheels: 4, color: "Red", ratio: 1.8 },
    fe_status: "Success",
    rl_status: "Success",
    fe_rules: "if (wheels >= 4 && color == 'Red')",
    explanation: "Normal conditions. Both methods work fine."
  },
  night: {
    name: "Nighttime Car",
    features: { wheels: 4, color: "Dark Blue", ratio: 1.8 },
    fe_status: "Failed",
    rl_status: "Success",
    fe_rules: "if (wheels >= 4 && color == 'Red') -> Fails (Color is Dark Blue)",
    explanation: "Lighting changed. Feature engineering fails because the hardcoded color rule doesn't match. Representation learning succeeds by understanding shape."
  },
  occluded: {
    name: "Hidden Car",
    features: { wheels: 2, color: "Red", ratio: 1.2 },
    fe_status: "Failed",
    rl_status: "Success",
    fe_rules: "if (wheels >= 4 && color == 'Red') -> Fails (Only 2 wheels visible)",
    explanation: "Occlusion occurred. Feature engineering fails because wheel count dropped. Representation learning succeeds by inferring the whole from parts."
  }
};

export const RepresentationVisualizer = () => {
  const [scenario, setScenario] = useState<string>('normal');
  const [showFix, setShowFix] = useState(false);

  const current = scenarios[scenario];

  return (
    <div className="viz-container glassmorphism">
      <h3 className="viz-title">Feature Engineering vs Representation Learning</h3>
      <p className="viz-description">Select a scenario to see how both paradigms handle variations.</p>
      
      <div className="viz-controls centered">
        <label style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Select Scenario:</label>
        <div className="viz-btn-group">
          {Object.keys(scenarios).map((s) => (
            <button 
              key={s} 
              onClick={() => { setScenario(s); setShowFix(false); }}
              className={`viz-btn ${scenario === s ? 'active' : ''}`}
            >
              {scenarios[s].name}
            </button>
          ))}
        </div>
      </div>

      <div className="viz-row">
        {/* Feature Engineering */}
        <div className="viz-stat">
          <div className="viz-stat-label">Feature Engineering (Traditional ML)</div>
          <div className="viz-box-content">
            <div className="viz-sub-label">Extracted Features:</div>
            <ul className="viz-feature-list">
              <li>Wheels: {current.features.wheels}</li>
              <li>Color: {current.features.color}</li>
              <li>Aspect Ratio: {current.features.ratio}</li>
            </ul>
            <div className="viz-sub-label">Applied Rule:</div>
            <code className="viz-code-snippet">{current.fe_rules}</code>
            
            <div className={`viz-status-badge ${current.fe_status === 'Success' ? 'success' : 'danger'}`}>
              Result: {current.fe_status}
            </div>
            
            {current.fe_status === 'Failed' && !showFix && (
              <button onClick={() => setShowFix(true)} className="viz-action-btn">
                Update Rules Manually
              </button>
            )}
            
            {showFix && (
              <div className="viz-fix-box">
                <div className="viz-sub-label">New Rule Added:</div>
                <code className="viz-code-snippet">{"if (wheels >= 4 && color == 'Red') || (color == 'Dark Blue')"}</code>
                <div className="viz-status-badge success">Result: Success (for now)</div>
              </div>
            )}
          </div>
        </div>

        {/* Representation Learning */}
        <div className="viz-stat">
          <div className="viz-stat-label">Representation Learning (Deep Learning)</div>
          <div className="viz-box-content">
            <div className="viz-sub-label">Input Processing:</div>
            <div className="viz-nn-simulation">
              <div className="viz-nn-node">Raw Pixels</div>
              <div className="viz-arrow">↓</div>
              <div className="viz-nn-node highlight">Latent Space</div>
              <div className="viz-arrow">↓</div>
              <div className="viz-nn-node success">Concept: "Car"</div>
            </div>
            <div className="viz-sub-label">Model Behavior:</div>
            <p style={{ fontSize: '0.85rem', color: '#4a5568', textAlign: 'center' }}>
              Automatically learns robust features invariant to lighting and occlusion.
            </p>
            <div className={`viz-status-badge success`}>
              Result: Success
            </div>
          </div>
        </div>
      </div>

      <div className="viz-explanation centered">
        <p><strong>Insight:</strong> {current.explanation}</p>
      </div>
    </div>
  );
};
