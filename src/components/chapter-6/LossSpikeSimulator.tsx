import React, { useState } from 'react';
import './visualizers.css';

export default function LossSpikeSimulator({lang = 'en'}: {lang?: 'en' | 'ko'}) {
  const ko = lang === 'ko';
  const [step, setStep] = useState(50);
  const [scenario, setScenario] = useState<'recover' | 'diverge'>('recover');
  // Authored trajectories, not an optimizer or normalization experiment.
  const lossAt = (i: number) => i < 50 ? Math.max(1, 2.5-i*.02) : scenario === 'recover' ? 1+4*Math.exp(-(i-50)/8) : Math.min(25,5*1.08**(i-50));
  const values = Array.from({length: step+1}, (_,i) => lossAt(i));
  return <div className="loss-simulator-container">
    <h4>{ko ? '손실 급증 이후의 두 설명용 시나리오' : 'Two illustrative trajectories after a loss spike'}</h4>
    <p>{ko ? '수식으로 작성한 곡선입니다. QK-Norm이나 특정 학습 기법의 실험 결과가 아닙니다. 원인 판단에는 배치 ID, 그래디언트 norm과 nonfinite 기록이 필요합니다.' : 'These curves are authored formulas, not experimental evidence for QK-Norm or another intervention. Diagnosis requires batch IDs, gradient norms and nonfinite counts.'}</p>
    <div className="controls">{(['recover','diverge'] as const).map(mode => <button key={mode} type="button" aria-pressed={scenario===mode} onClick={()=>setScenario(mode)}>{mode==='recover' ? (ko ? '회복 예시' : 'Recovery example') : (ko ? '지속 악화 예시' : 'Persistent divergence example')}</button>)}</div>
    <label>{ko ? '관측 단계' : 'Observed step'}: {step} <input type="range" min="0" max="100" value={step} onChange={e=>setStep(Number(e.target.value))}/></label>
    <svg viewBox="0 0 360 190" role="img" aria-label={ko ? '단계별 설명용 손실: 위로 갈수록 증가' : 'Illustrative loss by step; higher values are higher on the chart'}>
      <title>{ko ? '설명용 손실 궤적' : 'Illustrative loss trajectory'}</title>
      {[0,5,15,25].map(v=><g key={v}><line x1="32" y1={165-v*5.6} x2="340" y2={165-v*5.6} stroke="#64748b" strokeWidth=".5"/><text x="4" y={169-v*5.6} fill="currentColor" fontSize="11">{v}</text></g>)}
      <line x1="186" x2="186" y1="25" y2="165" stroke="#f87171" strokeDasharray="3 3"/>
      <polyline points={values.map((v,i)=>`${32+i*3.08},${165-v*5.6}`).join(' ')} fill="none" stroke="#38bdf8" strokeWidth="2"/>
      <text x="32" y="183" fill="currentColor" fontSize="11">0</text><text x="178" y="183" fill="currentColor" fontSize="11">50</text><text x="323" y="183" fill="currentColor" fontSize="11">100</text>
    </svg>
    <p aria-live="polite">{ko ? '손실' : 'Loss'}: {lossAt(step).toFixed(2)} · {ko ? '50단계에서 가상의 교란 발생' : 'Hypothetical disturbance at step 50'}</p>
  </div>;
}
