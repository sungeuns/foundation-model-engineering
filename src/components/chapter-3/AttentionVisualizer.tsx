import React, { useId, useState } from 'react';
import { attentionTokens, queries, keys, values, calculateAttention } from './attention-example.mjs';
import './attention-example.css';

export default function AttentionVisualizer({ lang = 'en' }: { lang?: 'en' | 'ko' }) {
  const ko = lang === 'ko';
  const id = useId();
  const [selected, setSelected] = useState(1);
  const [temperature, setTemperature] = useState(1);
  const [causal, setCausal] = useState(false);
  const { scores, weights, output } = calculateAttention(selected, temperature, causal);
  const vector = (v: number[]) => `[${v.map(n => Number.isInteger(n) ? n : n.toFixed(3)).join(', ')}]`;

  return <section className="attention-example" aria-labelledby={`${id}-title`}>
    <h3 id={`${id}-title`}>{ko ? '가중치에서 출력 벡터까지' : 'From attention weights to an output vector'}</h3>
    <p>{ko ? '질의 토큰을 고른 다음, 미래 토큰을 가리거나 점수의 온도를 바꿔 보세요. 모든 가중치와 출력은 아래의 작은 벡터로 직접 계산합니다.' : 'Choose a query token, then hide future tokens or change the score temperature. Every weight and output is calculated from the small vectors below.'}</p>
    <fieldset className="attention-token-picker">
      <legend>{ko ? '1. 질의 토큰 선택' : '1. Choose the query token'}</legend>
      <div>{attentionTokens.map((token, index) => <button type="button" key={index} aria-pressed={selected === index} onClick={() => setSelected(index)}>{token}<small>Q{index + 1}</small></button>)}</div>
    </fieldset>
    <div className="attention-controls">
      <label htmlFor={`${id}-temperature`}>{ko ? '2. 점수 온도 τ' : '2. Score temperature τ'}: <strong>{temperature.toFixed(2)}</strong>
        <input id={`${id}-temperature`} type="range" min="0.25" max="2" step="0.25" value={temperature} onChange={e => setTemperature(Number(e.target.value))} />
      </label>
      <label className="attention-mask"><input type="checkbox" checked={causal} onChange={e => setCausal(e.target.checked)} />{ko ? '미래 토큰 가리기 (인과 마스크)' : 'Hide future tokens (causal mask)'}</label>
    </div>
    <p className="attention-formula">softmax(Q{selected + 1}Kᵀ / (√2 × {temperature.toFixed(2)}){causal ? ' + M' : ''}) V</p>
    {causal && <p className="attention-mask-definition">{ko ? 'M은 미래 토큰 위치에서 −∞, 나머지 위치에서 0입니다.' : 'M is −∞ at future-token positions and 0 elsewhere.'}</p>}
    <div className="attention-bars" role="group" aria-label={ko ? '토큰별 가중치' : 'Weights by token'}>
      {attentionTokens.map((token, index) => <div className={`attention-bar-row ${causal && index > selected ? 'is-masked' : ''}`} key={index}>
        <span>{token}</span><div className="attention-bar-track" aria-hidden="true"><span style={{ width: `${weights[index] * 100}%` }} /></div>
        <strong>{causal && index > selected ? (ko ? '가림' : 'masked') : `${(weights[index] * 100).toFixed(1)}%`}</strong>
      </div>)}
    </div>
    <div className="attention-output" aria-live="polite">
      <span>{ko ? '가중합 출력' : 'Weighted output'}</span><strong>{vector(output)}</strong>
      <small>{ko ? '가중치 합' : 'Weight sum'} = {weights.reduce((sum: number, weight: number) => sum + weight, 0).toFixed(3)}</small>
    </div>
    <p className="attention-observation">{causal && selected === 0
      ? (ko ? '첫 토큰에는 자신만 보입니다. 온도를 바꿔도 가중치는 100%, 출력은 V₁입니다.' : 'The first token can see only itself. Changing temperature leaves its weight at 100% and its output equal to V₁.')
      : (ko ? '온도를 낮추면 높은 점수에 가중치가 더 몰립니다. 마스크는 미래 토큰의 가중치를 정확히 0으로 만들고 나머지 가중치를 다시 정규화합니다.' : 'Lower temperature concentrates weight on larger scores. Masking makes future-token weights exactly zero and renormalizes the visible weights.')}</p>
    <details>
      <summary>{ko ? '벡터와 중간 계산 확인' : 'Inspect the vectors and intermediate calculation'}</summary>
      <div className="attention-table-wrap" role="region" aria-label={ko ? 'Q, K, V와 계산 결과' : 'Q, K, V and calculated values'} tabIndex={0}>
        <table><thead><tr><th>{ko ? '토큰' : 'Token'}</th><th>Q</th><th>K</th><th>V</th><th>{ko ? '점수' : 'Score'}</th><th>{ko ? '가중치 × V' : 'Weight × V'}</th></tr></thead>
          <tbody>{attentionTokens.map((token, index) => <tr key={index}><th scope="row">{token}</th><td>{vector(queries[index])}</td><td>{vector(keys[index])}</td><td>{vector(values[index])}</td><td>{Number.isFinite(scores[index]) ? scores[index].toFixed(3) : '−∞'}</td><td>{vector(values[index].map((value: number) => weights[index] * value))}</td></tr>)}</tbody>
        </table>
      </div>
    </details>
    <p className="attention-source">{ko ? '직접 만든 2차원 Q/K/V 예제입니다. 실제 모델에서 측정한 주의 패턴이나 단어의 의미를 보여 주지 않습니다. τ는 주의 점수의 효과를 살펴보기 위한 도구이며, 출력 토큰 샘플링의 온도와 다릅니다. 표준 식은 τ = 1입니다.' : 'Authored two-dimensional Q/K/V example, not measured model attention or evidence about word meaning. τ is an attention-score teaching control, separate from output-token sampling temperature. The standard equation uses τ = 1.'}</p>
  </section>;
}
