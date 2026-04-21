import React, { useState } from 'react';
import './visualizers.css';

export default function DataPipelineEvolution() {
  const [activeLevel, setActiveLevel] = useState(3);
  
  const levels = [
    {
      id: 1,
      title: "Level 1: Optimized Pipelines",
      desc: "Manual ETL and batch processing. The pipeline breaks on schema changes, requiring human intervention.",
      features: ["Manual ETL", "Static Schema", "High Human Dependency"]
    },
    {
      id: 2,
      title: "Level 2: Self-Aware Pipelines",
      desc: "Continuously monitors data distribution and state. Detects anomalies and generates alerts, but cannot self-heal.",
      features: ["Data Profiling", "Anomaly Detection", "Automated Alerts"]
    },
    {
      id: 3,
      title: "Level 3: Self-Adapting Pipelines",
      desc: "AI agents detect data changes, dynamically generate and test transformation code, and self-heal the pipeline.",
      features: ["Agent Orchestration", "Auto-remediation", "Dynamic Code Generation"]
    }
  ];

  return (
    <div className="pipeline-container">
      <div className="pipeline-header">
        <h3>Data Pipeline Evolution</h3>
        <p>Evolution of data infrastructure for foundation model training.</p>
      </div>
      
      <div className="pipeline-tabs">
        {levels.map((level) => (
          <button 
            key={level.id}
            className={`pipeline-tab ${activeLevel === level.id ? 'active' : ''}`}
            onClick={() => setActiveLevel(level.id)}
          >
            Level {level.id}
          </button>
        ))}
      </div>

      <div className="pipeline-content">
        {levels.map((level) => (
          <div 
            key={level.id} 
            className={`pipeline-panel ${activeLevel === level.id ? 'active' : ''}`}
          >
            <h4>{level.title}</h4>
            <p className="pipeline-desc">{level.desc}</p>
            <ul className="pipeline-features">
              {level.features.map((feature, idx) => (
                <li key={idx}>
                  <span className="feature-icon">✓</span> {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}