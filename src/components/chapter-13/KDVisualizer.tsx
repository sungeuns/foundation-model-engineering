import React, { useState, useEffect } from 'react';
import './visualizers.css';

export default function KDVisualizer() {
  const [epoch, setEpoch] = useState(0);
  const [isTraining, setIsTraining] = useState(false);
  const [mode, setMode] = useState('feature'); // 'logit' or 'feature'

  // 교사 모델의 완벽한 군집 (Teacher clusters)
  const teacherPoints = [
    { x: 80, y: 80, color: '#94a3b8' },
    { x: 220, y: 80, color: '#94a3b8' },
    { x: 150, y: 220, color: '#94a3b8' }
  ];

  // 학생 모델의 초기 무작위 위치
  const initialStudentPoints = Array.from({ length: 30 }).map((_, i) => {
    const targetCluster = i % 3;
    return {
      id: i,
      startX: Math.random() * 260 + 20,
      startY: Math.random() * 260 + 20,
      targetX: teacherPoints[targetCluster].x + (Math.random() * 40 - 20),
      targetY: teacherPoints[targetCluster].y + (Math.random() * 40 - 20),
      cluster: targetCluster
    };
  });

  const [studentPoints, setStudentPoints] = useState(initialStudentPoints);

  useEffect(() => {
    let interval;
    if (isTraining && epoch < 100) {
      interval = setInterval(() => {
        setEpoch((prev) => prev + 2);
      }, 50);
    } else if (epoch >= 100) {
      setIsTraining(false);
    }
    return () => clearInterval(interval);
  }, [isTraining, epoch]);

  const handleStart = () => {
    setEpoch(0);
    setIsTraining(true);
  };

  const handleReset = () => {
    setEpoch(0);
    setIsTraining(false);
  };

  // 진행률에 따른 보간(Interpolation) 함수
  const getInterpolatedPosition = (point) => {
    const progress = epoch / 100;
    
    if (mode === 'logit') {
      // Logit-Only: 정답 경계 방향으로만 이동, 군집화는 실패
      const moveX = point.startX + (point.targetX > 150 ? 30 * progress : -30 * progress);
      const moveY = point.startY + (point.targetY > 150 ? 30 * progress : -30 * progress);
      return { x: moveX, y: moveY };
    } else {
      // Feature-Based: 교사의 기하학적 위치로 완벽히 흡수됨
      // Ease-out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const moveX = point.startX + (point.targetX - point.startX) * easeProgress;
      const moveY = point.startY + (point.targetY - point.startY) * easeProgress;
      return { x: moveX, y: moveY };
    }
  };

  return (
    <div className="kd-visualizer-container">
      <div className="kd-controls">
        <button className={mode === 'logit' ? 'active' : ''} onClick={() => { setMode('logit'); handleReset(); }}>
          Logit-Only KD
        </button>
        <button className={mode === 'feature' ? 'active' : ''} onClick={() => { setMode('feature'); handleReset(); }}>
          Feature-Based KD
        </button>
        <button className="train-btn" onClick={handleStart} disabled={isTraining}>
          Start Distillation
        </button>
        <button className="reset-btn" onClick={handleReset}>
          Reset
        </button>
      </div>

      <div className="kd-status">
        <span>Epoch: {epoch}</span>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${epoch}%` }}></div>
        </div>
      </div>

      <div className="kd-canvas-wrapper">
        <svg width="300" height="300" className="kd-canvas">
          {/* Background Grid */}
          <g className="grid">
            {Array.from({ length: 10 }).map((_, i) => (
              <line key={`h${i}`} x1="0" y1={i * 30} x2="300" y2={i * 30} stroke="#e2e8f0" />
            ))}
            {Array.from({ length: 10 }).map((_, i) => (
              <line key={`v${i}`} x1={i * 30} y1="0" x2={i * 30} y2="300" stroke="#e2e8f0" />
            ))}
          </g>

          {/* Teacher Points */}
          {teacherPoints.map((tp, idx) => (
            <circle key={`teacher-${idx}`} cx={tp.x} cy={tp.y} r="25" fill={tp.color} opacity="0.3" />
          ))}
          {teacherPoints.map((tp, idx) => (
            <circle key={`teacher-core-${idx}`} cx={tp.x} cy={tp.y} r="6" fill="#475569" />
          ))}

          {/* Student Points */}
          {studentPoints.map((sp) => {
            const pos = getInterpolatedPosition(sp);
            const colors = ['#ef4444', '#3b82f6', '#10b981']; // Red, Blue, Green based on target class
            return (
              <g key={`student-${sp.id}`} transform={`translate(${pos.x}, ${pos.y})`}>
                <line x1="-4" y1="-4" x2="4" y2="4" stroke={colors[sp.cluster]} strokeWidth="2" />
                <line x1="-4" y1="4" x2="4" y2="-4" stroke={colors[sp.cluster]} strokeWidth="2" />
              </g>
            );
          })}
        </svg>
      </div>
      
      <div className="kd-legend">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#94a3b8', borderRadius: '50%' }}></div>
          <span>Teacher Latent Space</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#3b82f6', clipPath: 'polygon(20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30%)' }}></div>
          <span>Student Hidden States</span>
        </div>
      </div>
    </div>
  );
}