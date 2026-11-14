import React, { useState } from 'react';
import './visualizers.css';

export default function LinearAttentionVisualizer({lang='en'}:{lang?:'en'|'ko'}) {
 const ko=lang==='ko'; const [length,setLength]=useState(4096); const [kvHeads,setKvHeads]=useState(8); const [stateBytes,setStateBytes]=useState(4);
 const layers=32, heads=32, width=128, kvBytes=2;
 const kv=2*layers*kvHeads*width*kvBytes*length;
 const state=layers*heads*(width*width+width)*stateBytes;
 const maxKV=2*layers*kvHeads*width*kvBytes*131072;
 const format=(bytes:number)=>bytes>=2**30?`${(bytes/2**30).toFixed(2)} GiB`:`${(bytes/2**20).toFixed(2)} MiB`;
 return <div className="visualizer-container">
  <h3>{ko?'문맥 상태의 메모리 계산':'Calculate context-state memory'}</h3>
  <p>{ko?'가상 구조: 32층, query/순환 헤드 32개, 헤드·특징 폭 128, 배치 1입니다. KV는 원소당 2바이트이며 순환 상태는 정규화 벡터까지 포함합니다. 두 구조의 품질이 같다는 가정은 하지 않습니다.':'Hypothetical stacks: 32 layers, 32 query/recurrent heads, head/feature width 128, batch 1. KV uses 2 bytes per element; recurrent memory includes the normalizer vector. Equal model quality is not assumed.'}</p>
  <label>{ko?'시퀀스 길이':'Sequence length'}: {length.toLocaleString()} {ko?'토큰':'tokens'}<input type="range" min="1024" max="131072" step="1024" value={length} onChange={e=>setLength(Number(e.target.value))}/></label>
  <label>{ko?'KV 헤드 수 ':'KV head count '}<select value={kvHeads} onChange={e=>setKvHeads(Number(e.target.value))}><option value="8">8 (GQA)</option><option value="32">32 (MHA)</option></select></label>
  <label>{ko?'순환 상태 정밀도 ':'Recurrent-state precision '}<select value={stateBytes} onChange={e=>setStateBytes(Number(e.target.value))}><option value="4">FP32</option><option value="2">BF16 / FP16</option></select></label>
  <div className="bars-container">
   {[{label:ko?'어텐션 KV':'Attention KV',bytes:kv,color:'#38bdf8'},{label:ko?'선형 어텐션 상태 S + z':'Linear attention state S + z',bytes:state,color:'#34d399'}].map(row=><div className="bar-row" key={row.label}><div className="bar-label"><span>{row.label}</span><strong>{format(row.bytes)}</strong></div><div className="bar-track"><div style={{width:`${row.bytes/maxKV*100}%`,height:'100%',background:row.color}}/></div></div>)}
  </div>
  <p>{ko?'막대는 현재 KV 헤드 설정에서 131,072토큰일 때의 KV 메모리를 100%로 표시합니다.':'Bars use KV memory at 131,072 tokens for the selected KV head count as 100%.'}</p>
  <p>{ko?'가중치·활성값·임시 버퍼·블록 메타데이터는 제외했습니다. KV = 2 × 층 × KV 헤드 × 폭 × 길이 × 바이트. 순환 상태 = 층 × 헤드 × (폭² + 폭) × 바이트.':'Excludes weights, activations, temporary buffers and block metadata. KV = 2 × layers × KV heads × width × length × bytes. Recurrent state = layers × heads × (width² + width) × bytes.'}</p>
 </div>;
}
