import React, { useState } from 'react';
import './visualizers.css';

export default function OvertrainingVisualizer({lang='en'}: {lang?: 'en'|'ko'}) {
  const ko=lang==='ko';
  const [budget,setBudget]=useState(40);
  const [scenario,setScenario]=useState<'improve'|'plateau'|'regress'>('plateau');
  const loss=(x:number)=>1+2*Math.exp(-x/35);
  const score=(x:number)=>scenario==='improve' ? 30+55*(1-Math.exp(-x/35)) : scenario==='plateau' ? 30+40*(1-Math.exp(-x/20)) : 30+45*(1-Math.exp(-x/20))-Math.max(0,x-55)*.65;
  const xs=Array.from({length:101},(_,i)=>i);
  return <div className="overtraining-container"><h3>{ko ? '낮은 사전 학습 손실이 적응 성능을 결정할까요?' : 'Does lower pretraining loss determine adaptation quality?'}</h3>
    <p>{ko ? '직접 작성한 세 가지 가상 시나리오입니다. Fisher trace를 계산하거나 보편적인 과잉 학습 임계값을 제시하지 않습니다. 같은 손실 곡선에도 서로 다른 다운스트림 결과를 가정할 수 있음을 보여 줍니다.' : 'Three authored hypothetical scenarios. No Fisher trace is computed and no universal overtraining threshold is claimed. The same loss curve can accompany different assumed downstream outcomes.'}</p>
    <label>{ko ? '다운스트림 시나리오' : 'Downstream scenario'} <select value={scenario} onChange={e=>setScenario(e.target.value as typeof scenario)}><option value="improve">{ko ? '계속 개선' : 'Continued improvement'}</option><option value="plateau">{ko ? '정체' : 'Plateau'}</option><option value="regress">{ko ? '후반 회귀' : 'Late regression'}</option></select></label>
    <label style={{display:'block',marginTop:'1rem'}}>{ko ? '상대 학습 예산' : 'Relative training budget'}: {budget} <input type="range" min="0" max="100" value={budget} onChange={e=>setBudget(Number(e.target.value))}/></label>
    <svg viewBox="0 0 400 220" role="img" aria-label={ko ? '가정한 손실과 점수 곡선. 왼쪽은 손실, 오른쪽은 점수 축.' : 'Assumed loss and score curves. Left axis: loss; right axis: score.'}><title>{ko ? '학습 예산에 따른 가상 결과' : 'Hypothetical outcomes by training budget'}</title>
      {[0,50,100].map(v=><g key={v}><line x1="40" x2="350" y1={180-v*1.5} y2={180-v*1.5} stroke="#64748b" strokeWidth=".5"/><text x="5" y={184-v*1.5} fill="#60a5fa" fontSize="12">{(1+v/50).toFixed(1)}</text><text x="360" y={184-v*1.5} fill="#4ade80" fontSize="12">{v}</text></g>)}
      <polyline points={xs.map(x=>`${40+3.1*x},${180-(loss(x)-1)*75}`).join(' ')} fill="none" stroke="#60a5fa" strokeWidth="2"/>
      <polyline points={xs.map(x=>`${40+3.1*x},${180-score(x)*1.5}`).join(' ')} fill="none" stroke="#4ade80" strokeWidth="2" strokeDasharray="4 2"/>
      <line x1={40+3.1*budget} x2={40+3.1*budget} y1="30" y2="180" stroke="#cbd5e1"/>
      {[0,50,100].map(x=><text key={x} x={40+3.1*x} y="205" textAnchor="middle" fill="currentColor" fontSize="12">{x}</text>)}
    </svg>
    <p aria-live="polite"><span style={{color:'#60a5fa'}}>{ko ? '가상 손실' : 'Hypothetical loss'}: {loss(budget).toFixed(2)}</span> · <span style={{color:'#4ade80'}}>{ko ? '가상 점수' : 'Hypothetical score'}: {score(budget).toFixed(1)} / 100</span></p>
    <p>{ko ? '실제 판단에는 체크포인트별 동일 적응 레시피, 독립 평가 데이터와 불확실성, 추론 비용을 함께 비교해야 합니다.' : 'Real decisions require matched adaptation recipes across checkpoints, independent evaluation with uncertainty, and inference-cost measurements.'}</p>
  </div>;
}
