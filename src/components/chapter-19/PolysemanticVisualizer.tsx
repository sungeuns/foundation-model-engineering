import React, { useState } from 'react';
import './visualizers.css';

export default function PolysemanticVisualizer() {
  const [activeConcept, setActiveConcept] = useState<string | null>(null);

  const concepts = {
    A: { id: 'A', name: 'Apple (Fruit)', x: 100, y: 0, color: '#ef4444' },
    B: { id: 'B', name: 'Apple (Tech)', x: 50, y: 86, color: '#22c55e' },
    C: { id: 'C', name: 'Dog (Animal)', x: -50, y: 86, color: '#3b82f6' },
  };

  const activeData = activeConcept ? concepts[activeConcept as keyof typeof concepts] : null;

  const neuron1 = activeData ? Math.max(0, activeData.x) : 0;
  const neuron2 = activeData ? Math.max(0, activeData.y) : 0;

  return (
    <div className="poly-wrapper">
      <div className="poly-header">
        <h4>Superposition & Polysemanticity Simulator</h4>
        <p>See how 3 concepts are superimposed in 2 neurons (2D space).</p>
      </div>
      
      <div className="poly-layout">
        <div className="poly-controls">
          {Object.values(concepts).map((c) => (
            <button 
              key={c.id}
              className={`poly-btn ${activeConcept === c.id ? 'active' : ''}`}
              style={{ borderColor: c.color, backgroundColor: activeConcept === c.id ? c.color : 'transparent', color: activeConcept === c.id ? '#fff' : c.color }}
              onClick={() => setActiveConcept(c.id)}
            >
              Activate: {c.name}
            </button>
          ))}
          <button className="poly-btn reset" onClick={() => setActiveConcept(null)}>Reset</button>
        </div>

        <div className="poly-visualization">
          <svg width="300" height="250" viewBox="0 0 300 250" className="poly-svg">
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#888" />
              </marker>
            </defs>
            {/* Axes */}
            <line x1="150" y1="200" x2="280" y2="200" stroke="#888" strokeWidth="2" markerEnd="url(#arrowhead)" />
            <line x1="150" y1="200" x2="150" y2="20" stroke="#888" strokeWidth="2" markerEnd="url(#arrowhead)" />
            <text x="240" y="215" fontSize="12" fill="#888">Neuron 1</text>
            <text x="155" y="30" fontSize="12" fill="#888">Neuron 2</text>
            
            {/* Origin */}
            <circle cx="150" cy="200" r="4" fill="#888" />

            {/* Vectors */}
            {Object.values(concepts).map((c) => {
              const isActive = activeConcept === c.id;
              const opacity = activeConcept === null ? 0.5 : (isActive ? 1 : 0.1);
              const endX = 150 + c.x;
              const endY = 200 - c.y;
              
              return (
                <g key={c.id} style={{ opacity, transition: 'opacity 0.3s' }}>
                  <line x1="150" y1="200" x2={endX} y2={endY} stroke={c.color} strokeWidth="3" markerEnd="url(#arrowhead)" />
                  <text x={endX + (c.x > 0 ? 10 : -35)} y={endY - 10} fontSize="12" fill={c.color} fontWeight="bold">{c.name}</text>
                </g>
              );
            })}

            {/* Projections (Dashed lines) */}
            {activeData && (
              <>
                {/* To Neuron 1 (X axis) */}
                {activeData.x > 0 && (
                  <line x1={150 + activeData.x} y1={200 - activeData.y} x2={150 + activeData.x} y2="200" stroke={activeData.color} strokeWidth="2" strokeDasharray="5,5" />
                )}
                {/* To Neuron 2 (Y axis) */}
                {activeData.y > 0 && (
                  <line x1={150 + activeData.x} y1={200 - activeData.y} x2="150" y2={200 - activeData.y} stroke={activeData.color} strokeWidth="2" strokeDasharray="5,5" />
                )}
              </>
            )}
          </svg>
        </div>

        <div className="poly-neurons">
          <h4>Neuron Activations (ReLU)</h4>
          <div className="neuron-bar-container">
            <span className="neuron-label">Neuron 1</span>
            <div className="neuron-bar-bg">
              <div className="neuron-bar-fill" style={{ width: `${neuron1}%`, backgroundColor: activeData?.color || '#ccc' }}></div>
            </div>
            <span className="neuron-value">{(neuron1 / 100).toFixed(2)}</span>
          </div>
          <div className="neuron-bar-container">
            <span className="neuron-label">Neuron 2</span>
            <div className="neuron-bar-bg">
              <div className="neuron-bar-fill" style={{ width: `${neuron2}%`, backgroundColor: activeData?.color || '#ccc' }}></div>
            </div>
            <span className="neuron-value">{(neuron2 / 100).toFixed(2)}</span>
          </div>
          <div className="poly-explanation">
            {activeConcept === 'A' && <p>Neuron 1 is strongly activated. But this alone cannot confirm it is the fruit 'Apple'.</p>}
            {activeConcept === 'B' && <p>Neuron 1 and Neuron 2 are activated simultaneously. Both neurons exhibit <strong>polysemantic</strong> traits, responding to multiple concepts.</p>}
            {activeConcept === 'C' && <p>Neuron 2 is strongly activated. Neuron 1 becomes negative and is treated as 0 by ReLU.</p>}
            {!activeConcept && <p>Click the concept buttons to see activation patterns.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}