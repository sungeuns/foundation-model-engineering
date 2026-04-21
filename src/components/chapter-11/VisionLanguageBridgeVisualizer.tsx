import React, { useState } from 'react';
import './visualizers.css';

const VisionLanguageBridgeVisualizer = () => {
  const [bridgeType, setBridgeType] = useState('linear');
  const [resolution, setResolution] = useState(224);
  const [isProcessing, setIsProcessing] = useState(false);

  // Constants
  const patchSize = 14;
  const numLatents = 64;

  // Calculations
  const patches1D = Math.floor(resolution / patchSize);
  const totalPatches = patches1D * patches1D;

  let outputTokens = 0;
  let description = '';

  if (bridgeType === 'linear') {
    outputTokens = totalPatches;
    description = "Linear Projection maps every single patch to an LLM token (1:1). High resolutions cause Token Explosion.";
  } else if (bridgeType === 'perceiver') {
    outputTokens = numLatents;
    description = `Perceiver Resampler compresses all ${totalPatches} patches into exactly ${numLatents} latent tokens via Cross-Attention.`;
  } else if (bridgeType === 'qwen2') {
    // Simulating dynamic resolution windowing (simplified)
    const activePatches = Math.floor(totalPatches * 0.6); // Assuming 40% of patches are empty/background and dropped
    outputTokens = activePatches;
    description = `Dynamic Resolution (Qwen2.5-VL style) drops uninformative patches and processes native aspect ratios. Estimated ${totalPatches - activePatches} patches dropped.`;
  }

  const handleSimulate = () => {
    setIsProcessing(true);
    setTimeout(() => setIsProcessing(false), 800);
  };

  return (
    <div className="vlm-bridge-container">
      <div className="vlm-controls">
        <div className="vlm-control-group">
          <label>Bridge Architecture:</label>
          <select value={bridgeType} onChange={(e) => { setBridgeType(e.target.value); handleSimulate(); }}>
            <option value="linear">Linear / MLP (LLaVA)</option>
            <option value="perceiver">Perceiver Resampler (Flamingo)</option>
            <option value="qwen2">Dynamic Resolution (Qwen2.5-VL)</option>
          </select>
        </div>
        <div className="vlm-control-group">
          <label>Image Resolution: {resolution}x{resolution}</label>
          <input 
            type="range" 
            min="112" 
            max="1024" 
            step="112" 
            value={resolution} 
            onChange={(e) => { setResolution(Number(e.target.value)); handleSimulate(); }} 
          />
        </div>
      </div>

      <div className="vlm-stats-panel">
        <div className="vlm-stat">
          <span className="vlm-stat-label">Input Patches</span>
          <span className="vlm-stat-value">{totalPatches}</span>
        </div>
        <div className="vlm-stat">
          <span className="vlm-stat-label">Output LLM Tokens</span>
          <span className={`vlm-stat-value ${outputTokens > 2000 ? 'vlm-warning' : 'vlm-safe'}`}>
            {outputTokens}
          </span>
        </div>
      </div>
      
      <p className="vlm-description">{description}</p>

      <div className="vlm-visualization-area">
        <div className="vlm-stage">
          <h4>Vision Encoder</h4>
          <div className={`vlm-grid ${isProcessing ? 'vlm-pulse' : ''}`}>
            {/* Visualizing a subset of patches to avoid DOM overload */}
            {Array.from({ length: Math.min(totalPatches, 100) }).map((_, i) => (
              <div key={i} className="vlm-patch"></div>
            ))}
            {totalPatches > 100 && <div className="vlm-patch-overflow">+{totalPatches - 100} more</div>}
          </div>
        </div>

        <div className="vlm-arrow">
          <div className="vlm-arrow-line"></div>
          <div className="vlm-arrow-head"></div>
          <span className="vlm-bridge-label">{bridgeType.toUpperCase()} BRIDGE</span>
        </div>

        <div className="vlm-stage">
          <h4>LLM Context Window</h4>
          <div className={`vlm-tokens ${isProcessing ? 'vlm-pulse' : ''}`}>
             {Array.from({ length: Math.min(outputTokens, 100) }).map((_, i) => (
              <div key={i} className={`vlm-token ${bridgeType === 'perceiver' ? 'vlm-latent' : ''}`}></div>
            ))}
            {outputTokens > 100 && <div className="vlm-token-overflow">+{outputTokens - 100} more</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisionLanguageBridgeVisualizer;