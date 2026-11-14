import React, { useState } from 'react';
import '../teaching-demo.css';
export default function GraphVisualizer({lang='en'}:{lang?:string}) {
 const ko=lang==='ko',t=(en:string,kr:string)=>ko?kr:en;
 const [mode,setMode]=useState('graph'),[missing,setMissing]=useState(false);
 return <section className="teaching-demo">
  <h3>{t('Retrieval paths and missing evidence','검색 경로와 누락된 근거')}</h3>
  <p>{t('Authored fictional documents: A says Northstar acquired Orion; B says Mina is Northstar’s CEO. Query: who leads Orion’s acquirer?','가상 문서 A: Northstar가 Orion을 인수했습니다. 문서 B: Mina가 Northstar의 CEO입니다. 질문: Orion을 인수한 회사의 CEO는 누구인가요?')}</p>
  <div className="demo-controls">{['vector','graph'].map(m=><button key={m} aria-pressed={mode===m} onClick={()=>setMode(m)}>{m==='vector'?t('Vector: top-1 example','벡터: top-1 예시'):t('Graph: two hops','그래프: 두 홉')}</button>)}</div>
  <label><input type="checkbox" checked={missing} onChange={e=>setMissing(e.target.checked)}/>{t('Remove the CEO edge from extraction','추출 결과에서 CEO 관계 제거')}</label>
  <div className="demo-output" aria-live="polite">
   <p>{mode==='vector'?'Query → A':missing?'Orion → Northstar → ?':'Orion → Northstar → Mina'}</p>
   <p>{mode==='vector'?t('This selected top-1 result lacks the CEO fact. A different retrieval configuration could also retrieve B.','이 top-1 결과에는 CEO 근거가 없습니다. 다른 검색 설정은 B도 찾을 수 있습니다.'):missing?t('Traversal stops at a missing edge. Retrieve source B or abstain; do not fill the gap as fact.','간선 누락으로 탐색이 멈춥니다. 원문 B를 검색하거나 답변을 보류해야 합니다.'):t('Two edges locate candidate evidence. Check dates, permissions and source spans before answering.','두 간선으로 근거 후보를 찾았습니다. 답변 전 날짜·권한·원문 구절을 확인합니다.')}</p>
  </div>
  <small>{t('Authored teaching example; no retrieval model or graph database is running.','미리 작성한 교육용 예시이며 검색 모델이나 그래프 DB를 실행하지 않습니다.')}</small>
 </section>;
}
