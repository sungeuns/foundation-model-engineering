import React,{useState} from 'react';
import '../teaching-demo.css';
export default function MultiAgentTopologyVisualizer({lang='en'}:{lang?:string}){
 const ko=lang==='ko',t=(a:string,b:string)=>ko?b:a;const [mode,setMode]=useState(0);
 const titles=[t('Sequential','순차'),t('Hierarchical','계층'),t('Peer debate','동료 토론')];
 const names=mode===0?[t('Plan','계획'),t('Implement','구현'),t('Check','검사')]:mode===1?[t('Manager','관리자'),t('Worker A','작업자 A'),t('Worker B','작업자 B')]:[t('Agent A','에이전트 A'),t('Agent B','에이전트 B'),t('Agent C','에이전트 C')];
 return <section className="teaching-demo"><h3>{t('Coordination and failure paths','협업 구조와 실패 경로')}</h3><div className="demo-controls">{titles.map((v,i)=><button key={v} aria-pressed={mode===i} onClick={()=>setMode(i)}>{v}</button>)}</div>
 <div className="demo-grid">{names.map((name,i)=><div className="demo-card" key={name}><strong>{i+1}. {name}</strong></div>)}</div>
 <div className="demo-output" aria-live="polite"><p>{mode===0?'1 → 2 → 3':mode===1?'2 ↔ 1 ↔ 3':'1 ↔ 2 ↔ 3 ↔ 1'}</p>{mode===0?t('Later stages consume earlier artifacts. Clear handoffs help diagnosis, but an early mistaken requirement can propagate. Add explicit feedback when needed.','후속 단계가 앞 단계의 결과를 받습니다. 명확한 인계는 진단에 유리하지만 초기 요구 오류가 전파될 수 있어 명시적 피드백이 필요합니다.'):mode===1?t('A manager delegates and integrates. Independent work can run concurrently; dependencies, manager capacity and integration errors limit the gain.','관리자가 위임·통합합니다. 독립 작업은 동시에 실행할 수 있지만 의존성·관리자 처리량·통합 오류가 이득을 제한합니다.'):t('Peers exchange critiques. Shared models and prompts can produce correlated errors; agreement is not independent evidence or proof. Bound rounds and verify against external tests.','동료끼리 비평을 교환합니다. 같은 모델·프롬프트는 상관된 오류를 만들 수 있으며 합의가 독립 근거나 증명은 아닙니다. 회차를 제한하고 외부 테스트로 검증합니다.')}</div>
 <small>{t('Authored structural examples, not a latency or quality ranking. Compare against a single-agent baseline at matched budgets.','교육용 구조 예시이며 지연 시간·품질 순위가 아닙니다. 같은 예산의 단일 에이전트 기준과 비교합니다.')}</small></section>;
}
