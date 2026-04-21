import React, { useState, useEffect } from 'react';
import './visualizers.css';

const DataQualityVisualizer: React.FC = () => {
  const [datasetSize, setDatasetSize] = useState<number>(10); // 1k to 100k
  const [noiseLevel, setNoiseLevel] = useState<number>(10); // 0% to 50%
  const [duplicationRate, setDuplicationRate] = useState<number>(0); // 0% to 100%
  const [performance, setPerformance] = useState<number>(50);

  useEffect(() => {
    // Calculate performance based on empirical scaling heuristics
    // 1. Base score from size (Logarithmic scaling)
    const sizeScore = Math.min(100, Math.log10(datasetSize * 1000) * 18) - 40; 
    
    // 2. Noise penalty (Scales with size, as larger noisy datasets degrade performance faster)
    const noisePenalty = (noiseLevel / 100) * (datasetSize * 0.8 + 10);
    
    // 3. Duplication multiplier (Sweet spot ~25%, collapse towards 100%)
    let dupMultiplier = 1;
    if (duplicationRate <= 25) {
      dupMultiplier = 1 + (duplicationRate / 25) * 0.15; // Max 15% boost at 25% duplication
    } else {
      dupMultiplier = 1.15 - ((duplicationRate - 25) / 75) * 0.6; // Drops heavily after 25%
    }
    
    // Final Calculation
    let finalScore = (sizeScore - noisePenalty) * dupMultiplier;
    finalScore = Math.max(0, Math.min(100, finalScore)); // Clamp between 0 and 100
    
    setPerformance(finalScore);
  }, [datasetSize, noiseLevel, duplicationRate]);

  return (
    <div className="dq-visualizer-container">
      <h3 className="dq-title">Data Quality vs. Quantity Simulator</h3>
      <p className="dq-subtitle">Adjust the sliders to see how data curation impacts SFT model performance.</p>
      
      <div className="dq-controls">
        <div className="dq-control-group">
          <label>Dataset Size: {datasetSize}k examples</label>
          <input 
            type="range" 
            min="1" 
            max="100" 
            value={datasetSize} 
            onChange={(e) => setDatasetSize(Number(e.target.value))}
          />
        </div>
        
        <div className="dq-control-group">
          <label>Noise Level (Label Entropy): {noiseLevel}%</label>
          <input 
            type="range" 
            min="0" 
            max="50" 
            value={noiseLevel} 
            onChange={(e) => setNoiseLevel(Number(e.target.value))}
          />
        </div>
        
        <div className="dq-control-group">
          <label>Duplication Rate: {duplicationRate}%</label>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={duplicationRate} 
            onChange={(e) => setDuplicationRate(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="dq-result-section">
        <h4>Estimated Model Performance (OOD Generalization)</h4>
        <div className="dq-progress-bar-bg">
          <div 
            className="dq-progress-bar-fill" 
            style={{ 
              width: `${performance}%`,
              backgroundColor: performance > 75 ? '#10b981' : performance > 40 ? '#f59e0b' : '#ef4444'
            }}
          >
            <span className="dq-score-text">{performance.toFixed(1)} / 100</span>
          </div>
        </div>
        
        <div className="dq-insight">
          {performance > 80 && "Excellent! The model is learning a sharp reasoning manifold with minimal noise."}
          {performance <= 80 && performance > 50 && "Good, but there is room for optimization. Check noise or duplication."}
          {performance <= 50 && noiseLevel > 30 && "Warning: High noise is flattening the predictive distribution (Alignment Tax)."}
          {performance <= 50 && duplicationRate > 50 && "Warning: Extreme duplication is causing catastrophic overfitting and OOD collapse."}
          {performance <= 50 && datasetSize < 5 && noiseLevel <= 30 && duplicationRate <= 50 && "Dataset is too small to build a robust alignment representation."}
        </div>
      </div>
    </div>
  );
};

export default DataQualityVisualizer;