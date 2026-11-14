import React,{useState} from 'react';
import '../teaching-demo.css';
export default function MTPVisualizer({lang='en'}:{lang?:string}){
 const ko=lang==='ko',t=(a:string,b:string)=>ko?b:a;
 const [accepted,setAccepted]=useState(2),[draftCost,setDraftCost]=useState(.3),[verifyCost,setVerifyCost]=useState(1.2);
 const emitted=accepted+1,cost=draftCost+verifyCost;
 return <section className="teaching-demo"><h3>{t('Draft acceptance versus overhead','초안 수락과 추가 비용')}</h3>
 <p>{t('An illustrative exact speculative round drafts three tokens, accepts a prefix, then emits one correction/bonus token. The three-token MTP head layout is only one possible design.','정확한 speculative decoding의 한 회차를 단순화했습니다. 세 토큰을 제안하고 접두부를 수락한 뒤 교정·보너스 토큰 하나를 출력합니다. 세 토큰 MTP 헤드는 가능한 설계의 하나입니다.')}</p>
 <label>{t('Accepted prefix length','수락된 접두부 길이')}: {accepted}<input type="range" min="0" max="3" step="1" value={accepted} onChange={e=>setAccepted(+e.target.value)}/></label>
 <label>{t('Draft cost (relative units)','초안 비용 (상대 단위)')}: {draftCost.toFixed(1)}<input type="range" min=".1" max="2" step=".1" value={draftCost} onChange={e=>setDraftCost(+e.target.value)}/></label>
 <label>{t('Verification cost (relative units)','검증 비용 (상대 단위)')}: {verifyCost.toFixed(1)}<input type="range" min="1" max="3" step=".1" value={verifyCost} onChange={e=>setVerifyCost(+e.target.value)}/></label>
 <div className="demo-grid">{[0,1,2].map(i=><div className="demo-card" key={i}>{t('Draft','초안')} {i+1}: {i<accepted?t('accepted','수락'):i===accepted?t('first rejection','첫 거절'):t('discarded suffix','접미부 폐기')}</div>)}</div>
 <div className="demo-output" aria-live="polite">{t('Emitted tokens / round cost','출력 토큰 / 회차 비용')}: {emitted} / {cost.toFixed(1)} = {(emitted/cost).toFixed(2)}× {t('of the unit-cost autoregressive baseline','단위 비용 자기회귀 기준 대비')}</div>
 <small>{t('Calculated cost model, not measured speed. Real exactness requires the appropriate acceptance/correction rule; real speed also depends on batch shape, cache handling and kernels. Verification is not free.','계산한 비용 모형이며 측정 속도가 아닙니다. 정확한 분포 보존에는 수락·교정 규칙이 필요하고 실제 속도는 배치·캐시·커널에도 달려 있습니다. 검증 비용은 0이 아닙니다.')}</small></section>;
}
