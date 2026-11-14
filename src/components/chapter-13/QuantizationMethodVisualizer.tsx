import React, {useState} from 'react';
import './visualizers.css';
export default function QuantizationMethodVisualizer({lang='en'}:{lang?:'en'|'ko'}) {
 const ko=lang==='ko';const [bits,setBits]=useState(4);const [range,setRange]=useState(4.85);
 const weights=[.12,-.25,.08,4.85,-.15];const activation=[1,8,1,.1,2];
 const qmax=2**(bits-1)-1;const scale=range/qmax;
 const quantized=weights.map(w=>Math.max(-qmax,Math.min(qmax,Math.round(w/scale)))*scale);
 const original=weights.reduce((sum,w,i)=>sum+w*activation[i],0);
 const output=quantized.reduce((sum,w,i)=>sum+w*activation[i],0);
 return <div className="quant-method-container"><h4>{ko?'양자화 범위와 출력 오차':'Quantization range and output error'}</h4>
  <p>{ko?'직접 작성한 가중치·활성화에 대칭 균일 양자화를 실제 계산합니다. GPTQ나 AWQ의 모사 또는 성능 순위가 아닙니다. 범위를 좁히면 작은 값의 간격은 촘촘해지지만 큰 값이 잘립니다.':'Symmetric uniform quantization is computed on authored weights and activations. This is neither a GPTQ/AWQ implementation nor a ranking. Narrower range improves small-value resolution but clips large values.'}</p>
  <label>{ko?'비트 수':'Bits'}: {bits} <input type="range" min="2" max="8" value={bits} onChange={e=>setBits(Number(e.target.value))}/></label>
  <label style={{display:'block'}}>{ko?'절댓값 범위':'Absolute range'}: {range.toFixed(2)} <input type="range" min=".1" max="5" step=".05" value={range} onChange={e=>setRange(Number(e.target.value))}/></label>
  <div style={{overflowX:'auto'}} tabIndex={0} role="region" aria-label={ko?'양자화 값 비교':'Quantized value comparison'}><table style={{width:'100%',fontSize:'.9rem'}}><thead><tr><th>i</th><th>w</th><th>x</th><th>Q(w)</th><th>(Q(w)−w)x</th></tr></thead><tbody>{weights.map((w,i)=><tr key={i}><td>{i}</td><td>{w.toFixed(2)}</td><td>{activation[i]}</td><td>{quantized[i].toFixed(3)}</td><td>{((quantized[i]-w)*activation[i]).toFixed(3)}</td></tr>)}</tbody></table></div>
  <p aria-live="polite">{ko?'격자 간격':'Grid spacing'}: {scale.toFixed(4)} · {ko?'원래 출력':'Original output'}: {original.toFixed(3)} · {ko?'양자화 출력':'Quantized output'}: {output.toFixed(3)}</p>
  <p>{ko?'같은 가중치 오차도 입력 활성화에 따라 출력에 다르게 기여합니다. 실제 보정은 대표 입력 분포 전체에서 평가해야 합니다.':'The same weight error contributes differently depending on its activation. Real calibration must evaluate a representative distribution of inputs.'}</p>
 </div>;
}
