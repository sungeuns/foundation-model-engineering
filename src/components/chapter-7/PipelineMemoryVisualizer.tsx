import React, { useState } from 'react';
import './visualizers.css';

const PipelineMemoryVisualizer: React.FC = () => {
  const [schedule, setSchedule] = useState<'gpipe' | '1f1b'>('1f1b');

  // Simplified timeline representation for 4 GPUs and 4 Micro-batches
  // F = Forward, B = Backward, - = Idle
  const schedules = {
    gpipe: [
      ['F1', 'F2', 'F3', 'F4', '-', '-', '-', '-', '-', '-', 'B1', 'B2', 'B3', 'B4'],
      ['-', 'F1', 'F2', 'F3', 'F4', '-', '-', '-', '-', 'B1', 'B2', 'B3', 'B4', '-'],
      ['-', '-', 'F1', 'F2', 'F3', 'F4', '-', '-', 'B1', 'B2', 'B3', 'B4', '-', '-'],
      ['-', '-', '-', 'F1', 'F2', 'F3', 'F4', 'B1', 'B2', 'B3', 'B4', '-', '-', '-']
    ],
    '1f1b': [
      ['F1', 'F2', 'F3', 'F4', 'B1', 'B2', 'B3', 'B4', '-', '-', '-', '-', '-', '-'],
      ['-', 'F1', 'F2', 'F3', 'F4', 'B1', 'B2', 'B3', 'B4', '-', '-', '-', '-', '-'],
      ['-', '-', 'F1', 'F2', 'F3', 'F4', 'B1', 'B2', 'B3', 'B4', '-', '-', '-', '-'],
      ['-', '-', '-', 'F1', 'F2', 'F3', 'F4', 'B1', 'B2', 'B3', 'B4', '-', '-', '-']
    ]
  };

  // Memory footprint (number of activations stored) for GPU 0 over time
  const memoryUsage = {
    gpipe: [1, 2, 3, 4, 4, 4, 4, 4, 4, 4, 3, 2, 1, 0],
    '1f1b': [1, 2, 3, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0]
  };

  const currentSchedule = schedules[schedule];
  const currentMemory = memoryUsage[schedule];

  return (
    <div className="pipeline-visualizer">
      <div className="controls">
        <button 
          className={schedule === 'gpipe' ? 'active' : ''} 
          onClick={() => setSchedule('gpipe')}
        >
          GPipe Schedule
        </button>
        <button 
          className={schedule === '1f1b' ? 'active' : ''} 
          onClick={() => setSchedule('1f1b')}
        >
          1F1B Schedule
        </button>
      </div>

      <div className="grid-container">
        <h4>Pipeline Execution Timeline (4 GPUs, 4 Micro-batches)</h4>
        <div className="timeline-grid">
          <div className="row header-row">
            <div className="cell label">GPU</div>
            {currentSchedule.map((_, i) => (
              <div key={i} className="cell header">T{i+1}</div>
            ))}
          </div>
          {currentSchedule.map((gpuTimeline, gpuIdx) => (
            <div key={gpuIdx} className="row">
              <div className="cell label">GPU {gpuIdx}</div>
              {gpuTimeline.map((task, timeIdx) => (
                <div key={timeIdx} className={`cell task ${task.charAt(0)} ${task === '-' ? 'idle' : ''}`}>
                  {task !== '-' ? task : ''}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="memory-container">
        <h4>GPU 0 Peak Memory (Stored Activations)</h4>
        <div className="memory-chart">
          {currentMemory.map((val, idx) => (
            <div key={idx} className="bar-container">
              <div 
                className="bar" 
                style={{ height: `${(val / 4) * 100}%` }}
                title={`Time ${idx+1}: ${val} activations`}
              >
                {val > 0 ? val : ''}
              </div>
              <div className="time-label">T{idx+1}</div>
            </div>
          ))}
        </div>
        <p className="memory-desc">
          {schedule === 'gpipe' 
            ? 'GPipe accumulates activations for all micro-batches in memory until the backward pass begins.' 
            : '1F1B interleaves forward and backward passes, immediately freeing activation memory after the backward pass completes.'}
        </p>
      </div>
    </div>
  );
};

export default PipelineMemoryVisualizer;