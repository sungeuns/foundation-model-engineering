import React, { useEffect, useId, useState } from 'react';
import { calculateHeads, inputs, tokens } from './multi-head-example.mjs';
import '../teaching-demo.css';
import './multi-head-example.css';

const decimal = (value: number) => value.toFixed(3);
const vector = (values: number[]) => `[${values.map(decimal).join(', ')}]`;

export default function MhaVisualizer({ lang = 'en' }: { lang?: 'en' | 'ko' }) {
  const ko = lang === 'ko';
  const id = useId();
  const [ready, setReady] = useState(false);
  const [query, setQuery] = useState(2);
  const [mute, setMute] = useState(false);
  useEffect(() => setReady(true), []);
  const { heads, concat, output } = calculateHeads(query, mute);

  return <section id="two-head-calculation" className="teaching-demo multi-head-example" aria-labelledby={`${id}-title`}>
    <h3 id={`${id}-title`}>{ko ? '두 헤드의 출력은 어떻게 섞일까?' : 'How do two head outputs combine?'}</h3>
    <p>{ko ? 'A, B, C가 모두 보이는 셀프 어텐션입니다. 각 헤드는 같은 입력의 서로 다른 좌표로 어텐션 점수를 계산합니다.' : 'Every query can see A, B and C. Each head uses a different coordinate of the same input to calculate its scores.'}</p>
    <fieldset className="mha-inputs" disabled={!ready}>
      <legend>{ko ? '질의 토큰' : 'Query token'}</legend>
      <div className="demo-controls">{tokens.map((token, index) => <button
        key={token} type="button" aria-pressed={query === index} onClick={() => setQuery(index)}>
        {token} [{inputs[index].join(', ')}]
      </button>)}</div>
    </fieldset>
    <div className="demo-grid">
      {heads.map((head, h) => <div key={h} className="demo-card">
        <h4>{ko ? '헤드' : 'Head'} {h + 1}</h4>
        <p>q = {head.query} · K = [{head.keys.join(', ')}]<br/>V = [{head.values.join(', ')}]</p>
        <ul aria-label={ko ? '토큰별 어텐션 가중치' : 'Attention weights by token'}>
          {head.weights.map((weight, i) => <li key={tokens[i]}>
            <span>{tokens[i]}</span>
            <span className="mha-weight" aria-hidden="true"><span style={{ width: `${weight * 100}%` }} /></span>
            <span>{(weight * 100).toFixed(1)}%</span>
          </li>)}
        </ul>
        <p>{ko ? '값의 가중합' : 'Weighted value'} <strong>{decimal(head.output)}</strong></p>
      </div>)}
    </div>
    <label className="mha-ablation">
      <input type="checkbox" disabled={!ready} checked={mute} onChange={e => setMute(e.target.checked)} />
      {ko ? '출력 투영 직전에 헤드 2의 값을 0으로 바꾸기' : 'Set head 2’s value to zero just before the output projection'}
    </label>
    <div className="demo-output" aria-live="polite" aria-atomic="true">
      <span>{ko ? '연결한 두 값' : 'Concatenated values'} <b>{vector(concat)}</b></span>
      <span>{ko ? '투영 결과' : 'Projected output'} <b>{vector(output)}</b></span>
    </div>
    <small>{ko ? '직접 정한 입력과 투영으로 계산한 예제입니다. 출력의 첫 좌표는 두 값의 합, 둘째는 첫 값에서 둘째 값을 뺀 차입니다. 가중합과 출력은 소수 셋째 자리까지 표시합니다. 계산에는 반올림 전 가중치를 사용합니다.' : 'Authored inputs and projections. The first output coordinate sums the two values. The second takes their difference. Calculations use the unrounded weights.'}</small>
    <noscript><p>{ko ? '위에는 C의 계산 결과가 표시됩니다. 질의와 출력 투영을 바꾸려면 JavaScript를 켜세요.' : 'The calculation above uses C. Enable JavaScript to change the query or mute a head.'}</p></noscript>
  </section>;
}
