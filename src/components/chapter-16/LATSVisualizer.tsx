import React,{useState} from 'react';
import '../teaching-demo.css';
export default function LATSVisualizer({lang='en'}:{lang?:string}){
 const ko=lang==='ko',t=(a:string,b:string)=>ko?b:a;
 const [c,setC]=useState(1),[stats,setStats]=useState([{n:4,sum:3.2},{n:1,sum:.3}]);
 const total=stats.reduce((a,s)=>a+s.n,0),scores=stats.map(s=>s.sum/s.n+c*Math.sqrt(Math.log(total)/s.n));
 const selected=scores[1]>scores[0]?1:0;
 function observe(r:number){setStats(old=>old.map((s,i)=>i===selected?{n:s.n+1,sum:s.sum+r}:s));}
 return <section className="teaching-demo"><h3>{t('Exploration changes branch selection','탐색 가중치에 따른 가지 선택')}</h3>
 <p>{t('A two-child UCT calculation, illustrating one ingredient of LATS. This omits language generation, expansion and reflection.','LATS의 한 요소인 두 자식 노드 UCT 계산입니다. 언어 생성·확장·반성 과정은 생략합니다.')}</p>
 <label>{t('Exploration weight c','탐색 가중치 c')}: {c.toFixed(1)} <input type="range" min="0" max="3" step=".1" value={c} onChange={e=>setC(+e.target.value)}/></label>
 <p><code>UCT = mean reward + c × √(ln(parent visits) / child visits)</code></p>
 <div className="demo-grid">{stats.map((s,i)=><div key={i} className={'demo-card '+(selected===i?'selected':'')}><strong>{t('Branch','가지')} {i+1}{selected===i?' ✓':''}</strong><p>N={s.n}; Q={(s.sum/s.n).toFixed(3)}</p><p>UCT={scores[i].toFixed(3)}</p></div>)}</div>
 <div className="demo-controls"><button onClick={()=>observe(1)}>{t('Selected rollout: reward 1','선택된 rollout: 보상 1')}</button><button onClick={()=>observe(0)}>{t('Selected rollout: reward 0','선택된 rollout: 보상 0')}</button><button onClick={()=>{setStats([{n:4,sum:3.2},{n:1,sum:.3}]);setC(1);}}>{t('Reset','초기화')}</button></div>
 <p aria-live="polite">{t('Parent mean reward','부모 평균 보상')}: {(stats.reduce((a,s)=>a+s.sum,0)/total).toFixed(3)}; N={total}</p>
 <small>{t('Initial rewards are authored; subsequent means and UCT values are calculated. Ties choose branch 1. Low-value branches can still be explored.','초기 보상은 예시 값이며 이후 평균과 UCT는 계산합니다. 동률이면 가지 1을 선택합니다. 낮은 가치의 가지도 탐색할 수 있습니다.')}</small></section>;
}
