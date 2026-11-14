import React, { useState } from 'react';
import './visualizers.css';

export default function AlignmentTaxVisualizer({ lang = 'en' }: { lang?: 'en' | 'ko' }) {
  const ko = lang === 'ko';
  const [scenario, setScenario] = useState('tradeoff');
  const [strength, setStrength] = useState(50);
  const p = strength / 100;
  const capability = 80 + (scenario === 'tradeoff' ? -30 : scenario === 'joint' ? 10 : 0) * p;
  const safety = 35 + (scenario === 'joint' ? 40 : 50) * p;
  return <div className="alignment-tax-container">
    <div className="controls-panel">
      <h3>{ko ? '정렬의 결과는 평가로 확인하기' : 'Measure alignment outcomes'}</h3>
      <p>{ko ? '가상의 결과 세 가지를 비교합니다. 특정 정렬 기법의 성능 순위나 안전성 보장이 아닙니다. 실제 배포에서는 능력 유지와 안전성의 세부 항목을 각각 평가해야 합니다.' : 'Three authored outcomes, not rankings or safety guarantees for alignment methods. A deployment needs separate capability-retention and safety evaluations by slice.'}</p>
      <label>{ko ? '가정한 결과 ' : 'Assumed outcome '}
        <select value={scenario} onChange={e => setScenario(e.target.value)}>
          <option value="tradeoff">{ko ? '능력 저하와 안전성 개선' : 'Capability loss, safety gain'}</option>
          <option value="retention">{ko ? '능력 유지와 안전성 개선' : 'Capability retained, safety gain'}</option>
          <option value="joint">{ko ? '두 지표 모두 개선' : 'Both metrics improve'}</option>
        </select>
      </label>
      <label>{ko ? '가상 변화의 진행률' : 'Progress along the assumed change'}: {strength}%
        <input type="range" min="0" max="100" value={strength} onChange={e => setStrength(Number(e.target.value))} />
      </label>
    </div>
    <div className="visualization-panel" style={{color:"#e2e8f0", height:"auto", padding:"16px"}}>
      <svg viewBox="0 0 400 300" role="img" aria-label={ko ? '가상 능력 점수와 안전 점수' : 'Authored capability and safety scores'} style={{width:'100%', color:'#e2e8f0'}} fill="currentColor">
        <path d="M50 25V250H375" fill="none" stroke="currentColor" />
        {[0, 50, 100].map(v => <g key={v}><text x={50+3*v} y="270" textAnchor="middle" fontSize="12">{v}</text><text x="42" y={254-2*v} textAnchor="end" fontSize="12">{v}</text></g>)}
        <line x1="290" y1="180" x2={50+3*capability} y2={250-2*safety} stroke="#52616b" strokeDasharray="4 4" />
        <circle cx="290" cy="180" r="5" fill="#52616b" />
        <circle cx={50+3*capability} cy={250-2*safety} r="7" fill="#38bdf8" />
        <text x="200" y="292" textAnchor="middle" fontSize="12">{ko ? '가상 능력 점수' : 'Authored capability score'}</text>
        <text x="50" y="16" fontSize="12">{ko ? '가상 안전 점수 ↑' : 'Authored safety score ↑'}</text>
      </svg>
      <p aria-live="polite">{ko ? '능력' : 'Capability'}: {capability.toFixed(1)} / {ko ? '안전성' : 'Safety'}: {safety.toFixed(1)}</p>
    </div>
  </div>;
}

export { AlignmentTaxVisualizer };
