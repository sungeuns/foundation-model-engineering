import React, { useState, useEffect } from 'react';
import './visualizers.css';

const LinearProbeVisualizer = () => {
  const [layer, setLayer] = useState(1);
  const totalLayers = 12;
  const numPoints = 50;

  // Generate deterministic pseudo-random points
  const generatePoints = (classId) => {
    const points = [];
    for (let i = 0; i < numPoints; i++) {
      // Seed based on index and class
      const seed = Math.sin(i * 100 + classId * 1000);
      points.push({
        id: `${classId}-${i}`,
        class: classId,
        baseX: (seed * 1000) % 100,
        baseY: (Math.cos(i * 100 + classId * 1000) * 1000) % 100,
      });
    }
    return points;
  };

  const [points] = useState([...generatePoints(0), ...generatePoints(1)]);

  // Calculate positions based on current layer
  const getPointPosition = (point, currentLayer) => {
    const progress = (currentLayer - 1) / (totalLayers - 1); // 0 to 1
    
    // Initial state: entangled (completely mixed in the center)
    const initX = 50 + (point.baseX - 50) * 0.8;
    const initY = 50 + (point.baseY - 50) * 0.8;

    // Final state: linearly separable
    // Class 0 goes top-left, Class 1 goes bottom-right
    const targetX = point.class === 0 ? 20 + (point.baseX % 30) : 60 + (point.baseX % 30);
    const targetY = point.class === 0 ? 20 + (point.baseY % 30) : 60 + (point.baseY % 30);

    // Easing function for smooth transition
    const easeProgress = progress < 0.5 
      ? 2 * progress * progress 
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;

    return {
      x: initX + (targetX - initX) * easeProgress,
      y: initY + (targetY - initY) * easeProgress
    };
  };

  return (
    <div className="probe-visualizer-container">
      <div className="probe-header">
        <h4>Linear Representation Hypothesis Simulation</h4>
        <p>Layer Depth: <strong>{layer}</strong> / {totalLayers}</p>
        <input 
          type="range" 
          min="1" 
          max={totalLayers} 
          value={layer} 
          onChange={(e) => setLayer(parseInt(e.target.value))}
          className="layer-slider"
        />
      </div>
      
      <div className="probe-canvas-container">
        <svg viewBox="0 0 100 100" className="probe-svg">
          {/* Decision Boundary (only visible in deeper layers) */}
          <line 
            x1="10" y1="90" 
            x2="90" y2="10" 
            stroke="rgba(255,255,255,0.4)" 
            strokeWidth="1"
            strokeDasharray="2,2"
            opacity={Math.max(0, (layer - 4) / 8)}
          />
          
          {/* Render Points */}
          {points.map(point => {
            const pos = getPointPosition(point, layer);
            return (
              <circle
                key={point.id}
                cx={pos.x}
                cy={pos.y}
                r="1.5"
                fill={point.class === 0 ? "#4ade80" : "#f87171"}
                opacity="0.8"
                className="probe-point"
              />
            );
          })}
        </svg>
      </div>
      
      <div className="probe-legend">
        <div className="legend-item"><span className="dot true-dot"></span> Class A (e.g., True)</div>
        <div className="legend-item"><span className="dot false-dot"></span> Class B (e.g., False)</div>
      </div>
      <div className="probe-description">
        {layer < 4 && "Early Layers: Concepts are entangled. A linear probe cannot separate them accurately."}
        {layer >= 4 && layer < 9 && "Middle Layers: Concepts begin to organize geometrically. The probe starts finding a direction."}
        {layer >= 9 && "Deep Layers: Concepts are linearly separable. The linear probe achieves high accuracy."}
      </div>
    </div>
  );
};

export default LinearProbeVisualizer;