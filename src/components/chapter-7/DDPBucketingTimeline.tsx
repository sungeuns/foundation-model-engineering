import React, { useState, useEffect } from 'react';
import './visualizers.css';

const DDPBucketingTimeline: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return prev + 0.5;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handlePlayPause = () => {
    if (progress >= 100) setProgress(0);
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  // State calculations based on timeline progress (0 to 100)
  const computeL4 = progress > 5;
  const computeL3 = progress > 20;
  const computeL2 = progress > 45;
  const computeL1 = progress > 60;

  const bucket1Filled = progress > 25;
  const bucket1Syncing = progress > 25 && progress < 65;
  const bucket1Done = progress >= 65;

  const bucket2Filled = progress > 65;
  const bucket2Syncing = progress > 65 && progress < 95;
  const bucket2Done = progress >= 95;

  return (
    <div className="ddp-timeline-container">
      <div className="ddp-header">
        <h4>Gradient Bucketing & Overlap Visualization</h4>
        <div className="ddp-controls">
          <button className="ddp-btn" onClick={handlePlayPause}>
            {isPlaying ? 'Pause' : progress >= 100 ? 'Replay' : 'Play'}
          </button>
          <button className="ddp-btn secondary" onClick={handleReset}>Reset</button>
        </div>
      </div>

      <div className="ddp-visualization">
        {/* Compute Stream */}
        <div className="ddp-stream">
          <div className="ddp-stream-label">GPU Compute (Backward Pass)</div>
          <div className="ddp-track">
            <div className={`ddp-block compute ${computeL4 ? 'active' : ''}`}>
              Layer 4 Grad
            </div>
            <div className={`ddp-block compute ${computeL3 ? 'active' : ''}`}>
              Layer 3 Grad
            </div>
            <div className={`ddp-block compute ${computeL2 ? 'active' : ''}`}>
              Layer 2 Grad
            </div>
            <div className={`ddp-block compute ${computeL1 ? 'active' : ''}`}>
              Layer 1 Grad
            </div>
            {/* Progress indicator line */}
            <div 
              className="ddp-progress-line" 
              style={{ left: `${Math.min(progress, 80)}%` }}
            />
          </div>
        </div>

        {/* Network Stream */}
        <div className="ddp-stream">
          <div className="ddp-stream-label">Network (NCCL All-Reduce)</div>
          <div className="ddp-track network-track">
            <div className={`ddp-bucket ${bucket1Filled ? 'filled' : ''} ${bucket1Syncing ? 'syncing' : ''} ${bucket1Done ? 'done' : ''}`} style={{ left: '25%' }}>
              Bucket 1 (L4 + L3)
              {bucket1Syncing && <div className="sync-spinner"></div>}
            </div>
            <div className={`ddp-bucket ${bucket2Filled ? 'filled' : ''} ${bucket2Syncing ? 'syncing' : ''} ${bucket2Done ? 'done' : ''}`} style={{ left: '65%' }}>
              Bucket 2 (L2 + L1)
              {bucket2Syncing && <div className="sync-spinner"></div>}
            </div>
          </div>
        </div>
      </div>

      <div className="ddp-explanation">
        <p>
          <strong>Notice:</strong> As soon as <em>Bucket 1</em> is filled with gradients from Layers 4 and 3, the network transmission (All-Reduce) begins immediately. The GPU does not sit idle; it continues computing gradients for Layers 2 and 1 simultaneously, effectively hiding the network latency.
        </p>
      </div>
    </div>
  );
};

export default DDPBucketingTimeline;