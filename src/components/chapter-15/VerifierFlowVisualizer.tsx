import React,{useState} from 'react';
import '../teaching-demo.css';
export default function VerifierFlowVisualizer({lang='en'}:{lang?:string}){
 const ko=lang==='ko',t=(a:string,b:string)=>ko?b:a;
 const [mode,setMode]=useState('orm'),[fixed,setFixed]=useState(false);
 const lines=fixed?['3x + 7 = 22','3x = 22 − 7','3x = 15','x = 5']:['3x + 7 = 22','3x = 22 + 7','3x = 29','x = 29/3'];
 return <section className="teaching-demo"><h3>{t('What is supervised?','무엇을 감독하나요?')}</h3>
 <p>{t('Compare outcome, step and generated-critique signals on the same authored solution.','같은 풀이 예시에서 결과·단계·생성 비평 신호를 비교합니다.')}</p>
 <div className="demo-controls">{['orm','prm','genrm'].map(m=><button key={m} aria-pressed={mode===m} onClick={()=>setMode(m)}>{m.toUpperCase()}</button>)}</div>
 <label><input type="checkbox" checked={fixed} onChange={e=>setFixed(e.target.checked)}/>{t('Repair the sign in step 2','2단계의 부호 수정')}</label>
 <ol>{lines.map((line,i)=><li key={i}><code>{line}</code>{mode==='prm'&&<span> — {i===1&&!fixed?t('first invalid transition','첫 잘못된 변환'):i>1&&!fixed?t('algebra follows the erroneous premise','잘못된 전제에서의 대수 변환'):t('valid in this example','이 예시에서는 타당')}</span>}</li>)}</ol>
 <div className="demo-output" aria-live="polite">{mode==='orm'?t(`Outcome label: ${fixed?'correct':'incorrect'}. An ORM may read the whole trace; its supervision is the outcome, not necessarily a binary output or final-token-only input.`,`결과 라벨: ${fixed?'정답':'오답'}. ORM은 전체 풀이를 읽을 수도 있습니다. 결과 감독이 핵심이며 출력이 반드시 이진이거나 입력이 마지막 토큰뿐인 것은 아닙니다.`):mode==='prm'?t('Step supervision can locate an error. A step after a wrong premise may be locally valid: define the labeling rubric. Real PRMs can still misjudge.','단계 감독은 오류 위치를 찾는 데 도움을 줍니다. 잘못된 전제 뒤의 단계도 국소적으로 타당할 수 있으므로 라벨 기준을 정해야 합니다. 실제 PRM도 오판할 수 있습니다.'):t(fixed?'Authored critique: subtracting 7 gives 15, then division gives x=5. A generated critique needs independent validation.':'Authored critique: step 2 should subtract 7. A convincing explanation is not a correctness certificate.',fixed?'작성한 비평: 7을 빼면 15, 3으로 나누면 x=5입니다. 생성 비평에도 독립 검증이 필요합니다.':'작성한 비평: 2단계에서는 7을 빼야 합니다. 설득력 있는 설명이 정확성 증명은 아닙니다.')}</div>
 <small>{t('Authored labels, not measured reward scores or live model outputs.','라벨은 교육용으로 작성했으며 측정한 보상 점수나 실시간 모델 출력이 아닙니다.')}</small></section>;
}
