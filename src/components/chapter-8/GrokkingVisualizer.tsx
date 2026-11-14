import React, {useState} from 'react';
import './visualizers.css';
export default function GrokkingVisualizer({lang='en'}:{lang?:'en'|'ko'}) {
  const ko=lang==='ko';const [step,setStep]=useState(60);
  const train=(i:number)=>i<20?100-i*4.9:2;
  const valid=(i:number)=>i<60?100-i*.2:i<80?88-(i-60)*4.3:2;
  const norm=(i:number)=>i<20?10+i*2:50-(i-20)*.5;
  const curves=[{fn:train,color:'#ef4444',label:ko?'학습 손실':'Training loss'},{fn:valid,color:'#60a5fa',label:ko?'검증 손실':'Validation loss'},{fn:norm,color:'#34d399',label:ko?'가중치 norm':'Weight norm'}];
  return <div className="grokking-container"><h3>{ko?'지연된 일반화의 설명용 곡선':'Illustrative delayed generalization'}</h3>
    <p className="grokking-desc">{ko?'직접 작성한 정규화 곡선이며 실험 결과가 아닙니다. 학습 손실이 먼저 감소하고 검증 손실이 늦게 감소하는 패턴을 보여 줍니다. norm의 감소가 그로킹을 보장하거나 항상 원인이 되는 것은 아닙니다.':'Authored, normalized curves, not experimental results. Training loss falls before validation loss. A decreasing weight norm neither guarantees grokking nor establishes its cause.'}</p>
    <label>{ko?'가상 학습 진행':'Hypothetical training progress'}: {step} <input type="range" min="0" max="100" value={step} onChange={e=>setStep(Number(e.target.value))}/></label>
    <svg viewBox="0 0 360 200" role="img" aria-label={ko?'위로 갈수록 큰 정규화 값':'Normalized values increase upward'}><title>{ko?'지연된 검증 손실 감소':'Delayed validation-loss decrease'}</title>
      {[0,50,100].map(v=><g key={v}><line x1="35" x2="340" y1={170-v*1.5} y2={170-v*1.5} stroke="#64748b" strokeWidth=".5"/><text x="2" y={174-v*1.5} fill="currentColor" fontSize="11">{v}</text></g>)}
      {curves.map(c=><polyline key={c.label} points={Array.from({length:step+1},(_,i)=>`${35+3.05*i},${170-1.5*c.fn(i)}`).join(' ')} fill="none" stroke={c.color} strokeWidth="2" strokeDasharray={c.fn===norm?'4 2':undefined}/>)}
      <text x="35" y="190" fill="currentColor" fontSize="11">0</text><text x="322" y="190" fill="currentColor" fontSize="11">100</text>
    </svg>
    <div className="grokking-legend">{curves.map(c=><span key={c.label} style={{color:c.color}}>{c.label}: {c.fn(step).toFixed(1)}</span>)}</div>
  </div>;
}
