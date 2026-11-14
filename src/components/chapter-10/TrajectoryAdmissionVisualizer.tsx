import React, { useState } from 'react';
import './visualizers.css';
const examples = [
  { en:'Correct result with reproducible evidence', ko:'재현 가능한 근거를 갖춘 정답', score:9.2, verified:true },
  { en:'Fluent answer that fails the test', ko:'문장은 유창하지만 테스트에 실패한 답', score:9.5, verified:false },
  { en:'Verified result with a low preference score', ko:'검증은 통과했지만 선호 점수가 낮은 답', score:6.8, verified:true },
  { en:'Borderline candidate passing both gates', ko:'두 기준을 간신히 통과한 후보', score:8, verified:true },
];
export default function TrajectoryAdmissionVisualizer({ lang='en' }: {lang?:'en'|'ko'}) {
 const ko=lang==='ko'; const [count,setCount]=useState(0); const [threshold,setThreshold]=useState(8);
 const shown=examples.slice(0,count); const admitted=shown.filter(t=>t.score>=threshold&&t.verified).length;
 return <div className="admission-visualizer">
  <h3>{ko?'학습 후보 승인 규칙':'Training-candidate admission rule'}</h3>
  <p>{ko?'미리 작성한 후보와 점수입니다. 모델이나 검증기를 실행하지 않습니다. 임계값을 바꾸면 같은 후보를 다시 판정합니다. 실제 승인에는 출처·권한·평가 격리 검사도 필요합니다.':'Authored candidates and scores; no model or verifier runs. Changing the threshold re-evaluates the same candidates. Real admission also requires provenance, permission, and evaluation-quarantine checks.'}</p>
  <label>{ko?'가상 점수 임계값':'Authored score threshold'}: {threshold.toFixed(1)} <input type="range" min="5" max="10" step="0.1" value={threshold} onChange={e=>setThreshold(Number(e.target.value))}/></label>
  <div className="controls"><button onClick={()=>setCount(v=>Math.min(v+1,examples.length))} disabled={count===examples.length}>{ko?'다음 후보':'Next candidate'}</button><button onClick={()=>setCount(0)}>{ko?'초기화':'Reset'}</button></div>
  <p role="status">{ko?'승인 후보':'Admitted candidates'}: {admitted}/{count}</p>
  <div className="trajectory-list">{shown.map((t,i)=>{const pass=t.score>=threshold&&t.verified;return <div key={i} className={`trajectory-card ${pass?'admitted':'rejected'}`}><p>{ko?t.ko:t.en}</p><p>{ko?'점수':'Score'}: {t.score.toFixed(1)} · {ko?'검증':'Verification'}: {t.verified?(ko?'통과':'pass'):(ko?'실패':'fail')} · <strong>{pass?(ko?'승인':'admit'):(ko?'거절':'reject')}</strong></p></div>})}</div>
 </div>;
}
