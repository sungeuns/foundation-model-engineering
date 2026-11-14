import React,{useState} from 'react';
import './visualizers.css';
const teacher=[[80,80],[220,80],[150,220]];
const points=Array.from({length:30},(_,i)=>({id:i,x:25+(i*73%250),y:25+(i*97%250),tx:teacher[i%3][0]+(i*17%35)-17,ty:teacher[i%3][1]+(i*23%35)-17,cluster:i%3}));
export default function KDVisualizer({lang='en'}:{lang?:'en'|'ko'}) {
 const ko=lang==='ko';const [amount,setAmount]=useState(0);const [align,setAlign]=useState(true);
 return <div className="kd-visualizer-container"><h4>{ko?'표현 정렬의 기하학적 제약':'The geometric constraint of feature alignment'}</h4>
  <p>{ko?'고정 좌표를 선형 보간하는 그림이며 모델을 학습하지 않습니다. 출력 분포만 맞추는 목적은 특정 은닉 좌표를 요구하지 않습니다. 특징 손실은 추가적인 좌표 제약을 주지만 일반화 개선을 보장하지 않습니다.':'This interpolates fixed coordinates; no model is trained. Matching output distributions does not require a particular hidden coordinate system. Feature loss adds a geometric constraint without guaranteeing better generalization.'}</p>
  <label><input type="checkbox" checked={align} onChange={e=>setAlign(e.target.checked)}/>{ko?'교사 좌표 방향으로 보간':'Interpolate toward teacher coordinates'}</label>
  <label style={{display:'block'}}>{ko?'보간 비율 (학습 epoch 아님)':'Interpolation fraction (not training epochs)'}: {amount}% <input type="range" min="0" max="100" value={amount} onChange={e=>setAmount(Number(e.target.value))} disabled={!align}/></label>
  <div className="kd-canvas-wrapper"><svg viewBox="0 0 300 300" style={{width:'100%',maxWidth:300}} role="img" aria-label={ko?'회색 교사 기준점과 색상별 학생 좌표':'Gray teacher reference points and colored student coordinates'}><title>{ko?'설명용 특징 좌표':'Illustrative feature coordinates'}</title>
   {teacher.map(([x,y],i)=><circle key={i} cx={x} cy={y} r="20" fill="#94a3b8" opacity=".5"/>)}
   {points.map(p=><circle key={p.id} cx={p.x+(p.tx-p.x)*(align?amount/100:0)} cy={p.y+(p.ty-p.y)*(align?amount/100:0)} r="4" fill={['#ef4444','#3b82f6','#10b981'][p.cluster]}/>)}
  </svg></div><p>{ko?'회색: 교사 기준점 · 색 점: 학생 표현. 교사는 정답의 보장이 아니며, 차원이 다르면 학습 가능한 투영과 정렬 위치 선택이 필요합니다.':'Gray: teacher reference points. Colored: student representations. The teacher is not guaranteed correct; different dimensions require a learned projection and a choice of aligned positions.'}</p>
 </div>;
}
