import React, { useState } from 'react';
import './visualizers.css';

const SpatiotemporalAttentionVisualizer = () => {
  const [attentionType, setAttentionType] = useState('full');
  const [hoveredToken, setHoveredToken] = useState<{ frame: number; patch: number } | null>(null);

  const frames = [0, 1, 2];
  const patches = Array.from({ length: 16 }, (_, i) => i); // 4x4 grid

  const isAttended = (frameIdx: number, patchIdx: number) => {
    if (!hoveredToken) return false;
    if (frameIdx === hoveredToken.frame && patchIdx === hoveredToken.patch) return true; // Self

    switch (attentionType) {
      case 'spatial':
        // Factorized Spatial: Attends only to patches within the same frame
        return frameIdx === hoveredToken.frame;
      case 'temporal':
        // Factorized Temporal: Attends only to the same spatial patch across different frames
        return patchIdx === hoveredToken.patch;
      case 'full':
        // Full Spatiotemporal: Attends to all patches in all frames
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="attention-visualizer-container">
      <div className="attention-header">
        <h3>Spatiotemporal Attention Routing</h3>
        <p>Hover over tokens to see the receptive field for each attention mechanism.</p>
        <div className="attention-controls">
          <button 
            className={attentionType === 'spatial' ? 'active' : ''} 
            onClick={() => setAttentionType('spatial')}
          >
            Factorized Spatial
          </button>
          <button 
            className={attentionType === 'temporal' ? 'active' : ''} 
            onClick={() => setAttentionType('temporal')}
          >
            Factorized Temporal
          </button>
          <button 
            className={attentionType === 'full' ? 'active' : ''} 
            onClick={() => setAttentionType('full')}
          >
            Full Spatiotemporal
          </button>
        </div>
      </div>

      <div className="frames-container">
        {frames.map((frameIdx) => (
          <div key={`frame-${frameIdx}`} className="video-frame">
            <div className="frame-label">Frame {frameIdx + 1}</div>
            <div className="patch-grid">
              {patches.map((patchIdx) => {
                const attended = isAttended(frameIdx, patchIdx);
                const isSelf = hoveredToken?.frame === frameIdx && hoveredToken?.patch === patchIdx;
                
                return (
                  <div
                    key={`patch-${frameIdx}-${patchIdx}`}
                    className={`patch ${attended ? 'attended' : ''} ${isSelf ? 'self' : ''}`}
                    onMouseEnter={() => setHoveredToken({ frame: frameIdx, patch: patchIdx })}
                    onMouseLeave={() => setHoveredToken(null)}
                  ></div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      <div className="attention-description">
        {attentionType === 'spatial' && <p><strong>Factorized Spatial:</strong> Low computational cost, but poor tracking if objects move fast across frames.</p>}
        {attentionType === 'temporal' && <p><strong>Factorized Temporal:</strong> Tracks only temporal changes in the same spatial location, limiting the understanding of global physical laws.</p>}
        {attentionType === 'full' && <p><strong>Full Spatiotemporal:</strong> All tokens attend to each other across space and time. Highest computational complexity ($O(n^2)$), but ensures perfect 3D consistency.</p>}
      </div>
    </div>
  );
};

export default SpatiotemporalAttentionVisualizer;