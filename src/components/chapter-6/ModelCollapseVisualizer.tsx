import React, { useState } from 'react';
import './visualizers.css';

export default function ModelCollapseVisualizer({ locale = 'en' }: { locale?: 'en' | 'ko' }) {
  const ko = locale === 'ko';
  const controlId = React.useId();
  const [generation, setGeneration] = useState(0);

  // Math for normal distribution
  const getPoints = (gen: number) => {
    const points = [];
    const sigma = Math.max(0.15, 1.5 - (gen * 0.135));
    const mu = 0;

    for (let x = -5; x <= 5; x += 0.1) {
      const exponent = -0.5 * Math.pow((x - mu) / sigma, 2);
      const y = (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);

      const svgX = ((x + 5) / 10) * 600;
      const svgY = 300 - (y * 100);

      points.push(`${svgX},${svgY}`);
    }
    return points.join(' ');
  };

  return (
    <div className="visualizer-container">
      <h3>{ko ? '분포 폭 축소의 장난감 모형' : 'Toy model of a narrowing distribution'}</h3>
      <div className="slider-container">
        <label htmlFor={`${controlId}-1`}>{ko ? '선택한 단계 N' : 'Selected stage N'}: <strong>{generation}</strong></label>
        <input id={`${controlId}-1`} type="range"
          min="0"
          max="10"
          value={generation}
          onChange={(e) => setGeneration(parseInt(e.target.value))}
        />
      </div>
      <svg role="img" aria-label={ko ? '선택한 폭의 합성 Gaussian 밀도' : 'Synthetic Gaussian density with selected width'} width="100%" height="320" viewBox="0 0 600 320" className="collapse-svg">
        <defs>
          <linearGradient id={`${controlId}-gradient`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(99, 102, 241, 0.5)" />
            <stop offset="100%" stopColor="rgba(99, 102, 241, 0.0)" />
          </linearGradient>
        </defs>
        <polyline
          points={`0,300 ${getPoints(generation)} 600,300`}
          fill={`url(#${controlId}-gradient)`}
          stroke="#4f46e5"
          strokeWidth="3"
        />
        <line x1="0" y1="300" x2="600" y2="300" stroke="#333" strokeWidth="2" />
        <text x="300" y="315" textAnchor="middle" fill="#666" fontSize="12">{ko ? '합성 밀도: 중심과 꼬리' : 'Synthetic density: mode and tails'}</text>
      </svg>
      <div className="description">
        <p>{ko ? `고정 평균 0, 선택한 표준편차 ${Math.max(0.15,1.5-generation*.135).toFixed(3)}의 Gaussian 밀도입니다. 이 폭 축소를 직접 지정했으며 실제 재귀 학습 결과나 필연적 붕괴 법칙이 아닙니다.` : `Gaussian density with fixed mean 0 and chosen standard deviation ${Math.max(0.15,1.5-generation*.135).toFixed(3)}. Narrowing is specified by hand, not measured recursive training or an inevitable collapse law.`}</p>
        <p>{ko ? '표준편차는 마지막에도 양수이므로 Dirac delta가 아닙니다. 실제 결과는 원본 데이터 보존·혼합·필터·표본 수·학습 방식에 달려 있습니다.' : 'Standard deviation remains positive, so the final curve is not a Dirac delta. Actual outcomes depend on retained real data, mixtures, filtering, sample size and training procedure.'}</p>
      </div>
    </div>
  );
}