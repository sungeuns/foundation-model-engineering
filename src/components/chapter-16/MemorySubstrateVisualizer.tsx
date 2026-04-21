import React, { useState, useEffect } from 'react';
import './visualizers.css';

const MemorySubstrateVisualizer: React.FC = () => {
  const [isConsolidating, setIsConsolidating] = useState(false);
  const [step, setStep] = useState(0);

  const handleConsolidate = () => {
    if (isConsolidating) return;
    setIsConsolidating(true);
    setStep(1);

    // Sequence of animations
    setTimeout(() => setStep(2), 800);  // Graph extraction
    setTimeout(() => setStep(3), 1600); // Vector embedding
    setTimeout(() => setStep(4), 2400); // Procedural rule
    setTimeout(() => {
      setIsConsolidating(false);
      setStep(5); // Complete
    }, 3200);
  };

  const reset = () => {
    setIsConsolidating(false);
    setStep(0);
  };

  return (
    <div className="memory-visualizer">
      <div className="memory-header">
        <h3 className="memory-title">Asynchronous Memory Consolidation</h3>
        <div className="memory-controls">
          <button 
            className={`btn-consolidate ${isConsolidating ? 'processing' : ''}`}
            onClick={step === 5 ? reset : handleConsolidate}
            disabled={isConsolidating}
          >
            {isConsolidating ? 'Processing (Async)...' : step === 5 ? 'Reset' : 'Consolidate (Async)'}
          </button>
        </div>
      </div>

      <div className="memory-layout">
        {/* Left Side: Working Memory (Input) */}
        <div className="working-memory-panel">
          <div className="panel-header">
            <span className="dot volatile"></span>
            Working Memory (Context)
          </div>
          <div className="chat-bubble user-message">
            "I am moving my Acme Corp data pipeline to Snowflake. Always use Python 3.11."
          </div>
          
          {/* Flow Particles */}
          {isConsolidating && (
            <div className="particle-container">
              {step >= 1 && <div className="particle to-graph"></div>}
              {step >= 2 && <div className="particle to-vector"></div>}
              {step >= 3 && <div className="particle to-procedural"></div>}
            </div>
          )}
        </div>

        {/* Right Side: Long-term Substrates */}
        <div className="substrates-panel">
          
          {/* Graph Memory */}
          <div className={`substrate-card ${step >= 2 ? 'active-highlight' : ''}`}>
            <div className="panel-header">
              <span className="dot graph-dot"></span>
              Graph Memory (Entities)
            </div>
            <div className="substrate-content">
              {step >= 2 ? (
                <div className="graph-nodes fade-in">
                  <div className="node-edge"><code>(User)</code> <span className="edge">-[WORKS_AT]&rarr;</span> <code>(Acme Corp)</code></div>
                  <div className="node-edge"><code>(Acme Corp)</code> <span className="edge">-[USES]&rarr;</span> <code>(Snowflake)</code></div>
                </div>
              ) : (
                <div className="empty-state">Waiting for entities...</div>
              )}
            </div>
          </div>

          {/* Vector Memory */}
          <div className={`substrate-card ${step >= 3 ? 'active-highlight' : ''}`}>
            <div className="panel-header">
              <span className="dot vector-dot"></span>
              Vector Memory (Semantic)
            </div>
            <div className="substrate-content">
              {step >= 3 ? (
                <div className="vector-nodes fade-in">
                  <div className="embedding-viz">
                    [0.12, -0.45, 0.89, ... 1024d]
                  </div>
                  <div className="text-chunk">"User is migrating data pipelines to Snowflake."</div>
                </div>
              ) : (
                <div className="empty-state">Waiting for embeddings...</div>
              )}
            </div>
          </div>

          {/* Procedural Memory */}
          <div className={`substrate-card ${step >= 4 ? 'active-highlight' : ''}`}>
            <div className="panel-header">
              <span className="dot rule-dot"></span>
              Procedural Memory (Rules)
            </div>
            <div className="substrate-content">
              {step >= 4 ? (
                <div className="rule-nodes fade-in">
                  <div className="rule-box">
                    <strong>IF</strong> generating code<br/>
                    <strong>THEN</strong> enforce `Python == 3.11`
                  </div>
                </div>
              ) : (
                <div className="empty-state">Waiting for instructions...</div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MemorySubstrateVisualizer;
