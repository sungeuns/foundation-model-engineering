import React, { useState } from 'react';
import { quantizationGrid } from '../../utils/quantization-grid.js';
import './visualizers.css';

export default function QuantizationErrorVisualizer({ locale = 'en' }: { locale?: 'en' | 'ko' }) {
  const ko = locale === 'ko';
  const [bits, setBits] = useState(3);
  const [boundTenths, setBoundTenths] = useState(15);
  const [mode, setMode] = useState<'PTQ' | 'QAT'>('PTQ');
  const { limit, scale, rows, mse } = quantizationGrid(bits, boundTenths);
  const bound = (boundTenths / 10).toFixed(1);
  const qat = mode === 'QAT';
  return <section className="quantization-visualizer">
    <h3>{ko ? '같은 양자화 값에 다른 기울기가 생기는 이유' : 'Same quantized value, different gradient'}</h3>
    <div className="controls">
      <label>{ko ? '비트 수' : 'Bit width'} <strong>{bits}</strong>
        <input type="range" min="2" max="8" value={bits} onChange={e => setBits(Number(e.target.value))} />
      </label>
      <label>{ko ? '복원 범위의 상한' : 'Upper end of reconstruction range'} <strong>{bound}</strong>
        <input type="range" min="0.5" max="4" step="0.1" value={bound} onChange={e => setBoundTenths(Math.round(Number(e.target.value) * 10))} />
      </label>
    </div>
    <p>{ko
      ? `코드는 −${limit}부터 ${limit}까지 ${2 * limit + 1}개입니다. 격자 간격은 ${scale.toFixed(4)}이고 0은 그대로 0입니다. 정확한 중간값에서는 짝수 코드를 택합니다.`
      : `The ${2 * limit + 1} codes run from −${limit} through ${limit} at a grid spacing of ${scale.toFixed(4)}. Zero maps to zero. Halfway values round to the even code.`}</p>
    <div className="button-group" role="group" aria-label={ko ? '기울기 열 선택' : 'Choose the gradient column'}>
      {(['PTQ', 'QAT'] as const).map(value => <button type="button" key={value} aria-pressed={mode === value} onClick={() => setMode(value)}>{value}</button>)}
    </div>
    <p>{qat
      ? (ko ? 'QAT에서는 반올림의 대리 기울기를 1로 둡니다. 반올림한 코드가 허용 범위를 벗어났을 때만 clamp가 기울기를 0으로 만듭니다.' : 'QAT assigns a surrogate gradient of 1 to rounding. The clamp blocks that gradient only when the rounded code falls outside the allowed range.')
      : (ko ? 'PTQ 열은 순전파 함수의 실제 도함수입니다. 평평한 구간에서는 0이고 계단이 뛰는 지점에서는 정의되지 않습니다. PTQ는 이 기울기로 학습하지 않습니다.' : 'PTQ shows the actual derivative of the forward map. It is zero on a plateau and undefined at a jump. PTQ does not use it to train the weights.')}</p>
    <div className="quant-error-table" role="region" aria-label={ko ? '입력별 반올림·클리핑·복원 값과 기울기' : 'Rounding, clamping, reconstruction and gradients by input'} tabIndex={0}>
      <table><thead><tr>
        <th scope="col">{ko ? '입력' : 'Input'}</th><th scope="col">{ko ? '반올림' : 'Round'}</th>
        <th scope="col">{ko ? '클리핑' : 'Clamp'}</th><th scope="col">{ko ? '복원' : 'Output'}</th>
        <th scope="col">{qat ? (ko ? '대리 기울기' : 'STE gradient') : (ko ? '도함수' : 'Derivative')}</th>
      </tr></thead><tbody>{rows.map(row => <tr key={row.input}>
        <th scope="row">{row.input}</th><td>{row.rounded}</td><td>{row.code}</td><td>{row.reconstructed.toFixed(3)}</td>
        <td>{qat ? Number(!row.clamped) : row.atJump ? (ko ? '정의되지 않음' : 'undefined') : '0'}</td>
      </tr>)}</tbody></table>
    </div>
    <p aria-live="polite">{ko ? '클리핑으로 바뀐 코드' : 'Codes changed by clamping'} <strong>{rows.filter(row => row.clamped).length} / {rows.length}</strong> · {ko ? '가중치 평균제곱오차' : 'Weight MSE'} <strong>{mse.toFixed(4)}</strong></p>
  </section>;
}
