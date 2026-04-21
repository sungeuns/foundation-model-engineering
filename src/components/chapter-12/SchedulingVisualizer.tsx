import React, { useState, useEffect } from 'react';
import './visualizers.css';

const SchedulingVisualizer: React.FC = () => {
  const [mode, setMode] = useState<'unified' | 'chunked' | 'disaggregated'>('unified');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + 1));
    }, 50);
    return () => clearInterval(interval);
  }, [mode]);

  const renderTimeline = () => {
    if (mode === 'unified') {
      return (
        <div className="timeline-track">
          <div className="label">GPU 1 (Unified)</div>
          <div className="blocks">
            <div className="block prefill-large" style={{ width: `${Math.min(progress, 60)}%` }}>
              {progress > 10 && '100K Prefill (Blocking)'}
            </div>
            {progress > 60 && (
              <>
                <div className="block decode-small" style={{ left: '62%' }}>D1</div>
                <div className="block decode-small" style={{ left: '68%' }}>D2</div>
                <div className="block decode-small" style={{ left: '74%' }}>D3</div>
              </>
            )}
          </div>
          <div className="status-text text-red">Decode requests are stalled until Prefill finishes!</div>
        </div>
      );
    } else if (mode === 'chunked') {
      return (
        <div className="timeline-track">
          <div className="label">GPU 1 (Chunked)</div>
          <div className="blocks">
            {progress > 0 && <div className="block prefill-chunk" style={{ left: '0%', width: '15%' }}>Prefill Chunk</div>}
            {progress > 15 && <div className="block decode-small" style={{ left: '16%' }}>D1</div>}
            {progress > 20 && <div className="block prefill-chunk" style={{ left: '22%', width: '15%' }}>Prefill Chunk</div>}
            {progress > 35 && <div className="block decode-small" style={{ left: '38%' }}>D2</div>}
            {progress > 40 && <div className="block prefill-chunk" style={{ left: '44%', width: '15%' }}>Prefill Chunk</div>}
            {progress > 55 && <div className="block decode-small" style={{ left: '60%' }}>D3</div>}
            {progress > 60 && <div className="block prefill-chunk" style={{ left: '66%', width: '15%' }}>Prefill Chunk</div>}
            {progress > 75 && <div className="block decode-small" style={{ left: '82%' }}>D4</div>}
          </div>
          <div className="status-text text-green">Decodes are interleaved. No blocking!</div>
        </div>
      );
    } else {
      return (
        <div className="timeline-track disaggregated">
          <div className="track-row">
            <div className="label">Prefill Node (H100)</div>
            <div className="blocks">
              <div className="block prefill-large" style={{ width: `${Math.min(progress, 40)}%` }}>
                {progress > 10 && '100K Prefill'}
              </div>
              {progress > 40 && progress < 55 && (
                 <div className="block transfer" style={{ left: '42%', width: '10%' }}>KV Transfer ➔</div>
              )}
            </div>
          </div>
          <div className="track-row mt-2">
            <div className="label">Decode Node (L40S)</div>
            <div className="blocks">
              {progress > 0 && <div className="block decode-small" style={{ left: '5%' }}>D1</div>}
              {progress > 15 && <div className="block decode-small" style={{ left: '20%' }}>D2</div>}
              {progress > 30 && <div className="block decode-small" style={{ left: '35%' }}>D3</div>}
              {progress > 55 && (
                <>
                  <div className="block decode-small highlight" style={{ left: '55%' }}>D (New)</div>
                  <div className="block decode-small" style={{ left: '65%' }}>D4</div>
                  <div className="block decode-small highlight" style={{ left: '75%' }}>D (New)</div>
                </>
              )}
            </div>
          </div>
          <div className="status-text text-blue">Heavy Prefill and Decodes run in parallel on separate hardware.</div>
        </div>
      );
    }
  };

  return (
    <div className="scheduling-visualizer">
      <div className="controls">
        <button className={mode === 'unified' ? 'active' : ''} onClick={() => setMode('unified')}>Unified Serving</button>
        <button className={mode === 'chunked' ? 'active' : ''} onClick={() => setMode('chunked')}>Chunked Prefill</button>
        <button className={mode === 'disaggregated' ? 'active' : ''} onClick={() => setMode('disaggregated')}>Disaggregated</button>
        <button onClick={() => setProgress(0)}>Replay</button>
      </div>
      <div className="timeline-container">
        {renderTimeline()}
      </div>
    </div>
  );
};

export default SchedulingVisualizer;