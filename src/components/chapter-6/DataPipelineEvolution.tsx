import React, { useState } from 'react';
import './visualizers.css';

export default function DataPipelineEvolution({lang='en'}: {lang?: 'en'|'ko'}) {
  const [activeLevel,setActiveLevel]=useState(1);
  const ko=lang==='ko';
  const levels=ko ? [
    ['명시적 변환','버전이 고정된 ETL과 스키마 검사를 실행합니다. 예상하지 못한 변경은 격리하고 사람이 처리합니다.','재현 가능한 입력','스키마 검사','검토된 재실행'],
    ['관측과 경보','분포와 실패율을 측정해 변경을 감지합니다. 경보만으로 원인이나 안전한 수정이 확정되지는 않습니다.','슬라이스별 지표','이상 감지','담당자 경보'],
    ['검증 후 적응','에이전트가 변환 후보를 제안할 수 있습니다. 격리 실행, 품질·보안 검사와 이전 버전 복귀가 승격 조건입니다.','후보 코드','격리 테스트','승격·롤백 기준']
  ] : [
    ['Explicit transformations','Run versioned ETL and schema checks. Quarantine unexpected changes for human investigation.','Reproducible inputs','Schema checks','Reviewed replay'],
    ['Observation and alerts','Monitor distributions and failures. An alert alone does not establish a cause or a safe repair.','Slice metrics','Anomaly detection','Owner alerts'],
    ['Validated adaptation','An agent can propose transformations. Isolated execution, quality/security checks and switching back to a previous version gate promotion.','Candidate code','Isolated tests','Promotion/rollback gates']
  ];
  const level=levels[activeLevel];
  return <div className="pipeline-container"><div className="pipeline-header"><h3>{ko ? '데이터 파이프라인의 설계 선택' : 'Data pipeline design choices'}</h3><p>{ko ? '이 책에서 제안하는 분류이며 업계 표준 성숙도 척도가 아닙니다. 더 높은 자동화가 항상 더 좋은 선택은 아닙니다.' : 'An editorial taxonomy, not an industry maturity standard. More automation is not always the better choice.'}</p></div>
    <div className="pipeline-tabs">{levels.map((l,i)=><button type="button" key={i} aria-pressed={activeLevel===i} className={`pipeline-tab ${activeLevel===i?'active':''}`} onClick={()=>setActiveLevel(i)}>{l[0]}</button>)}</div>
    <div className="pipeline-content" aria-live="polite"><h4>{level[0]}</h4><p>{level[1]}</p><ul>{level.slice(2).map(f=><li key={f}>{f}</li>)}</ul></div>
  </div>;
}
