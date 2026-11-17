import React, { useId, useState } from 'react';
import { lensTokens, lensHead, readToyState } from './logit-lens-calculations.js';
import './logit-lens.css';

export default function LogitLensVisualizer({ locale = 'en' }: { locale?: 'en' | 'ko' }) {
  const ko = locale === 'ko';
  const id = useId();
  const [selected, setSelected] = useState(1);
  const [normalize, setNormalize] = useState(true);
  const result = readToyState(selected, normalize);
  return <section className="lens-calculator" aria-labelledby={`${id}-title`}>
    <h4 id={`${id}-title`}>{ko ? '같은 최대 토큰, 다른 확률 분포' : 'Same top token, different distribution'}</h4>
    <p>{ko ? '직접 만든 상태 세 개와 고정 출력 행렬로 매번 계산합니다. 실제 모델의 레이어가 아니며, 네 토큰이 이 예제의 전체 어휘입니다.' : 'Computed from three authored states and a fixed output matrix. These are not model layers; the four tokens are the entire toy vocabulary.'}</p>
    <div className="lens-state-controls" role="group" aria-label={ko ? '설명용 상태 선택' : 'Select an authored state'}>
      {['A', 'B', 'C'].map((name, index) => <button key={name} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)}>{ko ? '상태' : 'State'} {name}</button>)}
    </div>
    <label className="lens-normalization"><input type="checkbox" checked={normalize} onChange={e => setNormalize(e.target.checked)} />{ko ? '고정 RMS 정규화 적용 (gain = 1, ε = 10⁻⁵)' : 'Apply fixed RMS normalization (gain = 1, ε = 10⁻⁵)'}</label>
    <dl className="lens-vectors"><div><dt>{ko ? '원래 상태 h' : 'Raw state h'}</dt><dd>[{result.raw.map(x => x.toFixed(1)).join(', ')}]</dd></div><div><dt>{normalize ? (ko ? '정규화한 상태' : 'Normalized state') : (ko ? '정규화 생략' : 'Normalization bypassed')}</dt><dd>[{result.state.map(x => x.toFixed(3)).join(', ')}]</dd></div></dl>
    <p className="lens-result" aria-live="polite">{ko ? '최대 토큰' : 'Top token'}: <strong>{lensTokens[result.top]}</strong> · {(100 * result.probabilities[result.top]).toFixed(2)}%</p>
    <div className="lens-probabilities" role="list" aria-label={ko ? '전체 설명용 어휘 확률, 0–100%' : 'Full toy vocabulary probabilities, 0–100%'}>
      {lensTokens.map((token, index) => <div className="lens-probability" role="listitem" key={token}><span>{token}</span><span className="lens-bar-track" aria-hidden="true"><span style={{width: `${result.probabilities[index] * 100}%`}} /></span><span>{(100 * result.probabilities[index]).toFixed(2)}%</span></div>)}
    </div>
    <details className="lens-matrix"><summary>{ko ? '출력 행렬과 현재 로짓 확인' : 'Inspect output matrix and current logits'}</summary><div tabIndex={0} role="region" aria-label={ko ? '출력 행렬 표' : 'Output matrix table'}><table><thead><tr><th>{ko ? '토큰' : 'Token'}</th><th>Wᵤ[i, :]</th><th>{ko ? '로짓' : 'Logit'}</th></tr></thead><tbody>{lensTokens.map((token, index) => <tr key={token}><th scope="row">{token}</th><td>[{lensHead[index].join(', ')}]</td><td>{result.logits[index].toFixed(3)}</td></tr>)}</tbody></table></div></details>
    <p className="lens-note">{ko ? 'B와 C는 모두 Paris를 고르지만 정규화 시 확률은 약 67.52%와 54.05%입니다. 이 값은 사실의 정답 확률이나 실제 모델의 확신을 측정하지 않습니다. 정규화를 끄면 다른 측정 절차가 됩니다.' : 'B and C both select Paris, but normalized probabilities are about 67.52% and 54.05%. These values do not measure factual correctness or confidence in a real model. Bypassing normalization changes the measurement procedure.'}</p>
  </section>;
}
