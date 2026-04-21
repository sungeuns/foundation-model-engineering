import React, { useState } from 'react';
import './visualizers.css';

interface OvertrainingVisualizerProps {
  lang?: 'en' | 'ko';
}

const OvertrainingVisualizer: React.FC<OvertrainingVisualizerProps> = ({ lang = 'en' }) => {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const translations = {
    en: {
      title: "Training Dynamics: Loss vs. Brittleness",
      desc: "Hover over the chart to inspect the trade-off between Pre-training Loss and Downstream Utility.",
      tokens: "Tokens Trained",
      loss: "Pre-training Loss",
      brittleness: "Fisher Trace (Brittleness)",
      utility: "Downstream Utility",
      chinchilla: "Chinchilla Optimal",
      utilityOptimal: "Utility Optimal",
      overtraining: "Catastrophic Overtraining"
    },
    ko: {
      title: "학습 역학: 손실 vs 부서짐성",
      desc: "차트 위에 마우스를 올려 사전 학습 손실과 다운스트림 효용성 간의 트레이드오프를 확인하세요.",
      tokens: "학습된 토큰",
      loss: "사전 학습 손실",
      brittleness: "피셔 정보 대각합 (부서짐성)",
      utility: "다운스트림 효용성",
      chinchilla: "친칠라 최적점",
      utilityOptimal: "효용 최적점",
      overtraining: "파국적 과잉 학습"
    }
  };

  const text = translations[lang];

  // Mock data for the curve
  const dataPoints = Array.from({ length: 100 }, (_, i) => {
    const tokens = i * 10; // 0 to 990 Billion tokens
    // Loss decreases logarithmically
    const loss = 4.5 - Math.log(tokens + 10) * 0.4;
    // Brittleness (Fisher Trace) increases exponentially after a certain point
    const brittleness = 0.5 + Math.exp((tokens - 600) / 100) * 0.1;
    // Downstream Utility increases then drops (The Paradox)
    const utility = tokens < 700 
      ? 10 + Math.log(tokens + 10) * 15 
      : 10 + Math.log(710) * 15 - Math.exp((tokens - 700) / 80) * 2;

    return { tokens, loss, brittleness, utility };
  });

  const getX = (tokens: number) => (tokens / 1000) * 300;
  const getY = (val: number, max: number, min: number = 0) => 100 - ((val - min) / (max - min)) * 100;

  const activeData = hoveredPoint !== null ? dataPoints[hoveredPoint] : dataPoints[0];

  return (
    <div className="overtraining-container">
      <div className="ot-header">
        <h3>{text.title}</h3>
        <p>{text.desc}</p>
      </div>

      <div className="ot-chart-wrapper">
        <svg viewBox="0 0 300 100" className="ot-svg">
          {/* Zones */}
          <rect x="0" y="0" width="60" height="100" fill="#f0f4f8" opacity="0.2" />
          <rect x="60" y="0" width="120" height="100" fill="#e6fffa" opacity="0.2" />
          <rect x="180" y="0" width="120" height="100" fill="#fff5f5" opacity="0.2" />

          {/* Lines */}
          <polyline
            fill="none"
            stroke="#3182ce"
            strokeWidth="2"
            points={dataPoints.map(d => `${getX(d.tokens)},${getY(d.loss, 4.5, 1.5)}`).join(' ')}
          />
          <polyline
            fill="none"
            stroke="#e53e3e"
            strokeWidth="2"
            points={dataPoints.map(d => `${getX(d.tokens)},${getY(d.brittleness, 6, 0)}`).join(' ')}
          />
          <polyline
            fill="none"
            stroke="#38a169"
            strokeWidth="2"
            strokeDasharray="2,2"
            points={dataPoints.map(d => `${getX(d.tokens)},${getY(d.utility, 100, 0)}`).join(' ')}
          />

          {/* Zone Labels inside SVG */}
          <text x="30" y="12" textAnchor="middle" className="ot-svg-text" fontSize="3.5" fill="#e2e8f0">{text.chinchilla}</text>
          <text x="120" y="12" textAnchor="middle" className="ot-svg-text" fontSize="3.5" fill="#e2e8f0">{text.utilityOptimal}</text>
          <text x="240" y="12" textAnchor="middle" className="ot-svg-text" fontSize="3.5" fill="#e2e8f0">{text.overtraining}</text>

          {/* Hover Interaction Overlay */}
          {dataPoints.map((d, i) => (
            <rect
              key={i}
              x={getX(d.tokens) - 1.5}
              y="0"
              width="3"
              height="100"
              fill="transparent"
              onMouseEnter={() => setHoveredPoint(i)}
              onMouseLeave={() => setHoveredPoint(null)}
              style={{ cursor: 'crosshair' }}
            />
          ))}

          {/* Active Indicator */}
          {hoveredPoint !== null && (
            <line
              x1={getX(activeData.tokens)}
              y1="0"
              x2={getX(activeData.tokens)}
              y2="100"
              stroke="#718096"
              strokeWidth="0.5"
              strokeDasharray="1,1"
            />
          )}
        </svg>
      </div>

      {/* Legend */}
      <div className="ot-legend">
        <div className="ot-legend-item">
          <span className="ot-legend-color" style={{ backgroundColor: '#3182ce' }}></span>
          <span>{text.loss}</span>
        </div>
        <div className="ot-legend-item">
          <span className="ot-legend-color" style={{ backgroundColor: '#e53e3e' }}></span>
          <span>{text.brittleness}</span>
        </div>
        <div className="ot-legend-item">
          <span className="ot-legend-color" style={{ backgroundColor: '#38a169' }}></span>
          <span>{text.utility}</span>
        </div>
      </div>

      <div className="ot-dashboard">
        <div className="ot-stat">
          <span className="ot-stat-title">{text.tokens}</span>
          <span className="ot-stat-value">{activeData.tokens}B</span>
        </div>
        <div className="ot-stat loss">
          <span className="ot-stat-title">{text.loss}</span>
          <span className="ot-stat-value">{activeData.loss.toFixed(2)}</span>
        </div>
        <div className="ot-stat brittleness">
          <span className="ot-stat-title">{text.brittleness}</span>
          <span className="ot-stat-value">{activeData.brittleness.toFixed(2)}</span>
        </div>
        <div className="ot-stat utility">
          <span className="ot-stat-title">{text.utility}</span>
          <span className="ot-stat-value">{activeData.utility.toFixed(1)} / 100</span>
        </div>
      </div>
    </div>
  );
};

export default OvertrainingVisualizer;