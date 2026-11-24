import React, { useEffect, useId, useState } from 'react';
import './visualizers.css';

export const ScaleVisualizer = ({ lang = 'en' }: { lang?: 'en' | 'ko' }) => {
  const ko = lang === 'ko';
  const id = useId();
  const [ready, setReady] = useState(false);
  const [budget, setBudget] = useState(2);
  const [allocation, setAllocation] = useState(50);
  useEffect(() => setReady(true), []);
  // Dimensionless teaching curve: fixed ND, symmetric exponents, no empirical fit.
  const product = 10 ** budget;
  const ratio = 10 ** ((allocation - 50) / 25);
  const parameters = Math.sqrt(product * ratio);
  const tokens = Math.sqrt(product / ratio);
  const modelTerm = parameters ** -0.3;
  const dataTerm = tokens ** -0.3;
  const loss = 0.5 + modelTerm + dataTerm;
  const budgetText = Number.isInteger(budget) ? `ND = ${product}` : `ND ≈ ${product.toFixed(2)}`;
  const ratioText = `N/D ≈ ${Number(ratio.toPrecision(3))}`;
  return <div className="viz-container glassmorphism">
    <h3>{ko ? '같은 연산 예산, 다른 배분' : 'Same compute, different allocation'}</h3>
    <p>{ko ? '가상의 무차원 곡선 L = 0.5 + N⁻⁰·³ + D⁻⁰·³입니다. ND를 고정하고 모델 크기와 데이터 양을 바꾸세요. 실제 모델의 성능이나 능력 발현을 예측하지 않습니다.' : 'A synthetic dimensionless curve: L = 0.5 + N⁻⁰·³ + D⁻⁰·³. Hold ND fixed and change model size versus data. This does not predict real-model performance or emerging abilities.'}</p>
    <label htmlFor={`${id}-budget`}>{ko ? '연산 예산' : 'Compute budget'} ({budgetText})</label>
    <input id={`${id}-budget`} type="range" min="1" max="4" step="0.5" value={budget}
      disabled={!ready} aria-valuetext={budgetText} onChange={e => setBudget(Number(e.target.value))} style={{ width: '100%' }} />
    <label htmlFor={`${id}-allocation`}>{ko ? '배분 · 데이터 중심 → 모델 중심' : 'Allocation · more data → larger model'} ({ratioText})</label>
    <input id={`${id}-allocation`} type="range" min="0" max="100" value={allocation}
      disabled={!ready} aria-valuetext={ratioText} onChange={e => setAllocation(Number(e.target.value))} style={{ width: '100%' }} />
    <noscript><p>{ko ? '기본 배분의 계산값입니다. 값을 바꾸려면 JavaScript를 켜세요.' : 'The values below show the initial allocation. Enable JavaScript to change it.'}</p></noscript>
    <dl className="viz-row">
      <div><dt>{ko ? '모델 크기 N' : 'Model size N'}</dt><dd>{parameters.toFixed(2)}</dd></div>
      <div><dt>{ko ? '데이터 양 D' : 'Data size D'}</dt><dd>{tokens.toFixed(2)}</dd></div>
      <div><dt>{ko ? '예시 손실 L' : 'Illustrative loss L'}</dt><dd>{loss.toFixed(3)}</dd></div>
    </dl>
    <p>{ko ? '이 대칭 곡선에서는 N=D일 때 손실이 최소입니다. 실제 최적 비율은 적합한 계수·지수, 데이터 품질, 아키텍처, 추론 비용에 따라 달라집니다. 연산 예산을 늘려도 한쪽을 부족하게 배분하면 손실이 커질 수 있습니다.' : 'This symmetric curve is minimized at N=D. Real optimal ratios depend on fitted coefficients and exponents, data quality, architecture and inference cost. A larger budget can still be allocated poorly.'}</p>
  </div>;
};
