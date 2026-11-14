import React, { useState } from 'react';
import './visualizers.css';

export default function SSMDualityVisualizer({lang='en'}:{lang?:'en'|'ko'}) {
 const ko=lang==='ko'; const [mode,setMode]=useState<'decode'|'scan'|'ssd'>('scan');
 const views={
  decode:{title:ko?'한 토큰씩 decode':'One-token decoding',body:ko?'새 토큰이 도착할 때 이전 상태에서 다음 상태를 계산합니다. Mamba-1과 Mamba-2 모두 이 순환 관점을 가집니다.':'When a new token arrives, compute the next state from the previous one. Both Mamba-1 and Mamba-2 have this recurrent view.',steps:['h₀ → h₁','h₁ → h₂','h₂ → h₃','h₃ → h₄']},
  scan:{title:ko?'Mamba-1: 병렬 스캔':'Mamba-1: parallel scan',body:ko?'전체 입력이 주어지면 affine 전이 Tᵢ(h) = aᵢh + bᵢ를 연관적으로 결합합니다. T₂∘T₁ = (a₂a₁, a₂b₁+b₂)이므로 순서를 보존한 병렬 prefix 계산이 가능합니다.':'With the full input available, compose affine transitions Tᵢ(h) = aᵢh + bᵢ associatively. T₂∘T₁ = (a₂a₁, a₂b₁+b₂), enabling order-preserving parallel prefix evaluation.',steps:['T₁ · T₂ · T₃ · T₄', 'T₂∘T₁ · T₄∘T₃', 'prefix(T₁ … Tᵢ) → hᵢ']},
  ssd:{title:ko?'Mamba-2: 청크 단위 SSD':'Mamba-2: chunkwise SSD',body:ko?'상태 축의 전이가 스칼라인 구조를 이용해 청크 내부를 행렬 곱으로 계산합니다. 청크의 상태 요약을 전달하는 계산도 포함해야 합니다. 이 도식은 처리 시간이나 Tensor Core 사용률을 측정하지 않습니다.':'Scalar transitions across state coordinates allow matrix-heavy intra-chunk work. Propagation of chunk-state summaries must also be included. This diagram measures neither runtime nor Tensor Core utilization.',steps:[ko?'청크 내부 행렬 곱':'Intra-chunk matrix products',ko?'청크 상태 요약의 전파':'Propagate chunk-state summaries',ko?'들어온 상태의 출력 기여 추가':'Add incoming-state contributions']}
 };
 const v=views[mode];
 return <div className="ssm-duality-container">
  <h3>{ko?'같은 순환을 실행하는 여러 방식':'Different execution views of recurrence'}</h3>
  <div className="ssm-toggle" style={{flexWrap:'wrap'}}>{(['decode','scan','ssd'] as const).map(m=><button key={m} type="button" aria-pressed={mode===m} className={mode===m?'active':''} onClick={()=>setMode(m)}>{views[m].title}</button>)}</div>
  <p>{v.body}</p><ol>{v.steps.map(step=><li key={step}>{step}</li>)}</ol>
  <p>{ko?'h는 상태이며 a와 b는 입력에서 계산한 전이 계수입니다. 연관성은 순서를 바꿔도 된다는 뜻이 아닙니다. 위 affine 예시는 스칼라로 단순화했습니다.':'Here h is state and a,b are input-derived transition coefficients. Associativity does not permit reordering. The affine example is scalar for clarity.'}</p>
 </div>;
}
