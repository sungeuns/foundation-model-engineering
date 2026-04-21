import React, { useState, useEffect, useRef } from 'react';
import './visualizers.css';

interface Trajectory {
  id: number;
  prompt: string;
  score: number;
  verified: boolean;
  status: 'pending' | 'admitted' | 'rejected';
}

const prompts = [
  "Write a Python script to scrape...",
  "Explain quantum entanglement...",
  "Solve this differential equation...",
  "Generate a SQL query for...",
  "Summarize the financial report...",
  "Debug this memory leak in C++...",
];

export default function TrajectoryAdmissionVisualizer() {
  const [trajectories, setTrajectories] = useState<Trajectory[]>([]);
  const [bufferSize, setBufferSize] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const nextId = useRef(1);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        const newTraj: Trajectory = {
          id: nextId.current++,
          prompt: prompts[Math.floor(Math.random() * prompts.length)],
          score: Math.round((Math.random() * 5 + 5) * 10) / 10, // 5.0 to 10.0
          verified: Math.random() > 0.3, // 70% chance to pass verification
          status: 'pending',
        };
        
        setTrajectories(prev => [newTraj, ...prev].slice(0, 5));

        // Process after a short delay to simulate evaluation
        setTimeout(() => {
          setTrajectories(currentTrajs => 
            currentTrajs.map(t => {
              if (t.id === newTraj.id) {
                const isAdmitted = t.score >= 8.0 && t.verified;
                if (isAdmitted) setBufferSize(b => b + 1);
                return { ...t, status: isAdmitted ? 'admitted' : 'rejected' };
              }
              return t;
            })
          );
        }, 800);

      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <div className="admission-visualizer">
      <div className="controls">
        <button onClick={() => setIsRunning(!isRunning)} className={isRunning ? 'stop-btn' : 'start-btn'}>
          {isRunning ? 'Stop Rollout Stream' : 'Start Rollout Stream'}
        </button>
        <div className="buffer-stats">
          Training Buffer: <strong>{bufferSize}</strong> trajectories
        </div>
      </div>

      <div className="stream-container">
        <div className="stream-header">Live Trajectory Evaluation (Threshold: Score ≥ 8.0 & Verified)</div>
        <div className="trajectory-list">
          {trajectories.map(t => (
            <div key={t.id} className={`trajectory-card ${t.status}`}>
              <div className="traj-info">
                <span className="traj-id">#{t.id}</span>
                <span className="traj-prompt">{t.prompt}</span>
              </div>
              <div className="traj-metrics">
                <span className="metric">RM Score: <strong>{t.score.toFixed(1)}</strong></span>
                <span className="metric">Verifier: <strong>{t.verified ? '✅ Pass' : '❌ Fail'}</strong></span>
              </div>
              <div className="traj-status">
                {t.status === 'pending' ? '⏳ Evaluating...' : 
                 t.status === 'admitted' ? '🟢 Admitted' : '🔴 Rejected'}
              </div>
            </div>
          ))}
          {trajectories.length === 0 && <div className="empty-state">Click start to begin asynchronous rollouts...</div>}
        </div>
      </div>
    </div>
  );
}