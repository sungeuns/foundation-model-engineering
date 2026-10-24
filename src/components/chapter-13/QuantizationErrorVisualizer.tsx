import React, { useState } from 'react';
import './visualizers.css';

export default function QuantizationErrorVisualizer({ locale = 'en' }: { locale?: 'en' | 'ko' }) {
  const ko = locale === 'ko';
  const [bits, setBits] = useState(4), [clip, setClip] = useState(2), [mode, setMode] = useState<'PTQ' | 'QAT'>('PTQ');
  const weights = [-3, -1, -.2, 0, .4, 1.1, 1.8, 4];
  const levels = 2 ** bits, scale = 2 * clip / (levels - 1);
  const quantized = weights.map(x => Math.round((Math.max(-clip, Math.min(clip,x)) + clip) / scale) * scale - clip);
  const atRoundingJump = (x: number) => Math.abs(x) < clip && Math.abs(((x + clip) / scale) % 1 - .5) < 1e-9;
  const mse = weights.reduce((sum,x,i) => sum + (x - quantized[i]) ** 2,0) / weights.length;
  return <section className="quantization-visualizer">
    <h3>{ko ? '반올림·클리핑·대리 기울기' : 'Rounding, clipping and surrogate gradients'}</h3>
    <p>{ko ? '직접 정한 스칼라 8개를 균일 격자로 양자화합니다. PTQ·QAT 모드의 순전파는 같으며, QAT에서는 선택한 STE의 학습 기울기만 설명합니다. 실제 모델 학습은 실행하지 않습니다.' : 'Quantize eight authored scalars on a uniform grid. PTQ and QAT use the same forward values here; QAT mode illustrates a selected STE training gradient. No model training runs.'}</p>
    <div className="controls"><label>{ko ? '비트 수' : 'Bit width'}: {bits} ({levels} {ko ? '수준' : 'levels'})<input type="range" min="2" max="8" value={bits} onChange={e => setBits(Number(e.target.value))} /></label><label>{ko ? '클리핑 절댓값' : 'Clipping magnitude'}: {clip.toFixed(1)}<input type="range" min="0.5" max="4" step="0.1" value={clip} onChange={e => setClip(Number(e.target.value))} /></label></div>
    <div className="button-group">{(['PTQ','QAT'] as const).map(value => <button type="button" key={value} aria-pressed={mode===value} className={mode===value ? 'active' : ''} onClick={() => setMode(value)}>{value}</button>)}</div>
    <div className="quant-error-table" role="region" aria-label={ko ? '원본·양자화 값과 기울기' : 'Original, quantized values and gradients'} tabIndex={0}><table><thead><tr><th>{ko ? '원본 값' : 'Original'}</th><th>{ko ? '복원 값' : 'Dequantized'}</th><th>{ko ? '기울기' : 'Gradient'}</th></tr></thead><tbody>{weights.map((x,i) => <tr key={i}><td>{x.toFixed(1)}</td><td>{quantized[i].toFixed(3)}</td><td>{mode==='PTQ' ? (atRoundingJump(x) ? (ko ? '도함수 없음' : 'undefined at jump') : '0*') : Math.abs(x) < clip ? '1' : Math.abs(x) > clip ? '0' : (ko ? '경계 관례 필요' : 'boundary convention')}</td></tr>)}</tbody></table></div>
    <p aria-live="polite">{ko ? '가중치 MSE' : 'Weight MSE'}: <strong>{mse.toFixed(4)}</strong>; {ko ? '클리핑된 값' : 'Clipped values'}: {weights.filter(x => Math.abs(x)>clip).length} / {weights.length}; {ko ? '격자 간격' : 'Grid spacing'}: {scale.toFixed(4)}.</p>
    <p>{mode==='PTQ' ? (ko ? '*반올림 함수의 도함수는 경계를 제외하면 0입니다. PTQ는 이 도함수로 가중치를 학습하지 않습니다.' : '*The rounding derivative is zero away from boundaries. PTQ does not train weights through that derivative.') : (ko ? '예시의 clipped STE는 범위 안에서 1, 밖에서 0을 대리 기울기로 씁니다. 경계 처리와 학습할 scale 등은 구현에 따라 다릅니다. 더 좁은 가중치 분포나 낮은 오류를 보장하지 않습니다.' : 'This illustrative clipped STE uses gradient 1 inside the range and 0 outside. Boundary handling and learned scales depend on the implementation. It guarantees neither narrower weights nor lower error.')}</p>
    <p>{ko ? '실수 구간 [-a,a]의 2^b개 끝점 포함 격자입니다. 여기서는 정확한 중간값을 양의 무한대 쪽으로 반올림합니다. 0을 정확히 표현하는 일반적인 정수 zero-point 구현과 다를 수 있습니다. 가중치 MSE는 과업 정확도가 아니며 clipping·비트 수·보정 데이터·실제 서빙 커널을 함께 검증해야 합니다.' : 'The grid contains 2^b endpoints over the real interval [-a,a]. Ties round toward positive infinity here. It can differ from integer zero-point schemes that represent zero exactly. Weight MSE is not task accuracy; validate clipping, bit width, calibration data and the actual serving kernels together.'}</p>
  </section>;
}
