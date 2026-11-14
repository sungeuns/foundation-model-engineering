import React,{useState} from 'react';
import '../teaching-demo.css';
export default function ReasoningVisualizer({lang='en'}:{lang?:string}){
 const ko=lang==='ko',t=(a:string,b:string)=>ko?b:a;
 const [mode,setMode]=useState(0);
 const titles=['CoT','ToT','GoT'];
 const nodes=mode===0?[[40,110],[140,110],[240,110],[340,110]]:mode===1?[[40,110],[140,60],[140,160],[260,30],[260,90],[260,160]]:[[40,110],[140,60],[140,160],[250,110],[350,110]];
 const edges=mode===0?[[0,1],[1,2],[2,3]]:mode===1?[[0,1],[0,2],[1,3],[1,4],[2,5]]:[[0,1],[0,2],[1,3],[2,3],[3,4]];
 return <section className="teaching-demo"><h3>{t('Reasoning structures','추론 구조')}</h3>
 <div className="demo-controls">{titles.map((title,i)=><button key={title} aria-pressed={mode===i} onClick={()=>setMode(i)}>{title}</button>)}</div>
 <svg viewBox="0 0 400 210" role="img" aria-label={t('Authored directed reasoning structure','교육용 방향성 추론 구조')}><title>{titles[mode]}</title>{edges.map(([a,b],i)=><line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} stroke="#5f738a" strokeWidth="2"/>)}{nodes.map(([x,y],i)=><g key={i}><circle cx={x} cy={y} r="17" fill="#e0f2fe" stroke="#0e7490"/><text x={x} y={y+5} textAnchor="middle">{i+1}</text></g>)}</svg>
 <div className="demo-output" aria-live="polite">{mode===0?t('1 → 2 → 3 → 4: one autoregressive reasoning trace. Each step can depend on the full available prefix. A wrong intermediate step can persist.','1 → 2 → 3 → 4: 자기회귀 추론 경로 하나입니다. 각 단계는 이용 가능한 전체 접두부에 의존할 수 있고 중간 오류가 이어질 수 있습니다.'):mode===1?t('1 branches to 2/3; 2 branches to 4/5 and 3 to 6. Search generates and scores alternatives under a budget. This tree does not mark an answer as correct.','1은 2/3으로, 2는 4/5로, 3은 6으로 분기합니다. 예산 안에서 대안을 생성·평가하며 이 그림은 어느 답이 정답인지 판정하지 않습니다.'):t('1 branches to 2/3, both feed 4, then 4 feeds 5. Aggregation can reuse partial work but can also merge errors. General GoT can include refinement cycles; this example is acyclic.','1은 2/3으로 분기하고 둘을 4에서 합친 뒤 5로 이어집니다. 부분 결과를 재사용할 수 있지만 오류도 합칠 수 있습니다. 일반 GoT는 개선 순환을 포함할 수 있으며 이 예시만 비순환입니다.')}</div>
 <small>{t('Authored topology; lines show dependencies from left to right. No model, evaluator or accuracy comparison is running.','왼쪽에서 오른쪽으로 의존성을 보여주는 교육용 구조입니다. 모델·평가기를 실행하거나 정확도를 비교하지 않습니다.')}</small></section>;
}
