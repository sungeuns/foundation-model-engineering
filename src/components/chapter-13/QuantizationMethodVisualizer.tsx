import React, { useState } from 'react';
import { weightedQuantization } from '../../utils/weighted-quantization.js';
import './visualizers.css';

export default function QuantizationMethodVisualizer({ lang = 'en' }: { lang?: 'en' | 'ko' }) {
  const ko = lang === 'ko';
  const [bits, setBits] = useState(3);
  const [boundHundredths, setBoundHundredths] = useState(50);
  const { scale, rows, original, output } = weightedQuantization(bits, boundHundredths);
  const bound = (boundHundredths / 100).toFixed(2);

  return <div className="quant-method-container">
    <p>{ko
      ? '다섯 가중치가 같은 균일 격자를 사용하고 입력 x는 고정되어 있습니다. 범위를 바꾸며 각 행의 반올림과 클리핑이 출력에 얼마나 기여하는지 마지막 열에서 확인하세요.'
      : 'All five weights share a uniform grid, and the inputs x stay fixed. As you change the range, the last column shows how much rounding and clipping in each row change the output.'}</p>
    <label style={{ display: 'block' }}>{ko ? '비트 수' : 'Bit width'} <strong>{bits}</strong>{' '}
      <input type="range" min="2" max="8" value={bits} onChange={event => setBits(event.currentTarget.valueAsNumber)} />
    </label>
    <label style={{ display: 'block' }}>{ko ? '대칭 범위의 상한' : 'Upper end of symmetric range'} <strong>{bound}</strong>{' '}
      <input type="range" min="0.10" max="5" step="0.05" value={bound}
        onChange={event => setBoundHundredths(Math.round(event.currentTarget.valueAsNumber * 100))} />
    </label>
    <div className="quant-error-table" tabIndex={0} role="region"
      aria-label={ko ? '가중치별 복원 값과 출력 오차 기여도' : 'Reconstruction and output error by weight'}>
      <table>
        <thead><tr>
          <th scope="col">w</th><th scope="col">x</th><th scope="col">{ko ? '코드' : 'Code'}</th>
          <th scope="col">Q(w)</th><th scope="col">(Q(w)−w)x</th>
        </tr></thead>
        <tbody>{rows.map(row => <tr key={row.weight}>
          <th scope="row">{row.weight.toFixed(2)}</th><td>{row.x}</td><td>{row.code}</td>
          <td>{row.reconstructed.toFixed(3)}</td><td>{row.contribution.toFixed(3)}</td>
        </tr>)}</tbody>
      </table>
    </div>
    <p aria-live="polite">
      {ko ? '격자 간격' : 'Grid spacing'} <strong>{scale.toFixed(4)}</strong> ·{' '}
      {ko ? '원래 출력' : 'Original output'} <strong>{original.toFixed(3)}</strong> ·{' '}
      {ko ? '양자화 출력' : 'Quantized output'} <strong>{output.toFixed(3)}</strong>
    </p>
  </div>;
}
