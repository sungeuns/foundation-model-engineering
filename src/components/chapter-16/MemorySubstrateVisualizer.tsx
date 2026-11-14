import React,{useState} from 'react';
import '../teaching-demo.css';
export default function MemorySubstrateVisualizer({lang='en'}:{lang?:string}){
 const ko=lang==='ko',t=(a:string,b:string)=>ko?b:a;
 const [stored,setStored]=useState(false),[scope,setScope]=useState('project');
 return <section className="teaching-demo"><h3>{t('Memory preserves claims and scope','주장과 범위를 보존하는 메모리')}</h3>
 <blockquote>{t('“I am moving my Acme data pipeline to Snowflake. Always use Python 3.11.”','“내 Acme 데이터 파이프라인을 Snowflake로 옮기고 있어요. 항상 Python 3.11을 쓰세요.”')}</blockquote>
 <label>{t('Preference scope','선호 적용 범위')}<select value={scope} onChange={e=>setScope(e.target.value)}><option value="project">{t('This project','이 프로젝트')}</option><option value="unknown">{t('Unspecified: clarify first','미지정: 먼저 확인')}</option></select></label>
 <div className="demo-controls"><button onClick={()=>setStored(!stored)}>{stored?t('Delete derived records','파생 레코드 삭제'):t('Inspect proposed records','저장 후보 확인')}</button></div>
 <div className="demo-grid">
 {[t('Graph claim','그래프 주장'),t('Retrieval text','검색용 텍스트'),t('Preference','선호')].map((name,i)=><div className="demo-card" key={name}><h4>{name}</h4>{!stored?t('No derived record','파생 레코드 없음'):i===0?t('Pipeline → planned destination → Snowflake. Employment and completed migration are not established.','파이프라인 → 계획한 이전 대상 → Snowflake. 고용 관계나 이전 완료는 확인되지 않았습니다.'):i===1?t('User reports a migration in progress. Retain the source message and project ID; an embedding is not evidence of truth.','사용자가 이전 진행 중이라고 말했습니다. 원문과 프로젝트 ID를 보존하며 임베딩을 진실성의 근거로 쓰지 않습니다.'):scope==='project'?t('Python 3.11 for this project, user-stated; revalidate before execution.','이 프로젝트의 Python 3.11 선호, 사용자 진술. 실행 전에 재확인합니다.'):t('Pending clarification; do not turn this into a global rule.','범위 확인 대기. 전역 규칙으로 바꾸지 않습니다.')}</div>)}
 </div><small>{t('Authored proposal preview; no persistence or embedding model. Real records need source ID, timestamp, access controls, version and deletion lineage.','저장 후보를 보여주는 교육용 예시이며 영속 저장이나 임베딩 모델을 실행하지 않습니다. 실제 레코드에는 원문 ID·시각·권한·버전·삭제 계보가 필요합니다.')}</small></section>;
}
