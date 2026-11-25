import React, { useEffect, useId, useState } from 'react';
import './rnn-memory.css';

interface RnnMemoryVisualizerProps {
  lang?: 'en' | 'ko';
}

function trace(firstInput: number, weight: number) {
  const states = [0];
  for (const input of [firstInput, 0, 0]) {
    const previous = states[states.length - 1];
    states.push(Math.tanh(input + weight * previous));
  }
  return states;
}

function formatState(value: number) {
  if (value === 0) return '0';
  return (value > 0 ? '+' : '−') + Math.abs(value).toFixed(3);
}

const x = (step: number) => 40 + 78 * step;
const y = (state: number) => 59 - 45 * state;
const points = (states: number[]) => states.map((state, step) => [x(step), y(state)].join(',')).join(' ');

export default function RnnMemoryVisualizer({ lang = 'en' }: RnnMemoryVisualizerProps) {
  const ko = lang === 'ko';
  const group = useId();
  const [interactive, setInteractive] = useState(false);
  const [weight, setWeight] = useState(1);
  useEffect(() => setInteractive(true), []);
  const red = trace(1, weight);
  const blue = trace(-1, weight);

  return (
    <figure className="rnn-memory">
      <figcaption>{ko ? '첫 색깔이 은닉 상태에 얼마나 남을까?' : 'Does the hidden state still distinguish the first color?'}</figcaption>
      <p className="rnn-memory-equation">
        <var>h<sub>t</sub></var> = tanh(<var>x<sub>t</sub></var> + <var>w h<sub>t−1</sub></var>), <var>h<sub>0</sub></var> = 0
      </p>
      <fieldset disabled={!interactive}>
        <legend>{ko ? '직전 은닉 상태에 곱하는 가중치 w' : 'Weight w on the previous state'}</legend>
        {[1, 0].map(value => (
          <label key={value}>
            <input type="radio" name={group} value={value} checked={weight === value} onChange={() => setWeight(value)} />
            {value === 1 ? (ko ? '1 · 이전 상태 사용' : '1 · Use the previous state') : (ko ? '0 · 이전 상태 제외' : '0 · Ignore the previous state')}
          </label>
        ))}
      </fieldset>
      <div className="rnn-memory-key" aria-hidden="true">
        <span><i className="rnn-memory-red-dot" />{ko ? 'red로 시작' : 'Starts with red'}</span>
        <span><i className="rnn-memory-blue-ring" />{ko ? 'blue로 시작' : 'Starts with blue'}</span>
      </div>
      <svg className="rnn-memory-chart" viewBox="0 0 310 132" role="img" aria-label={ko ? '0, 1, 2, 3단계의 은닉 상태. 토큰을 읽은 뒤의 값은 아래 표에 있습니다.' : 'Hidden state at steps 0, 1, 2 and 3. The table lists the state after each token.'}>
        <title>{ko ? '입력 순서에 따른 두 녹음의 은닉 상태' : 'Hidden state across both recordings'}</title>
        {[-1, 0, 1].map(tick => <g key={tick}>
          <line className="rnn-memory-grid" x1={x(0)} x2={x(3)} y1={y(tick)} y2={y(tick)} />
          <text x="27" y={y(tick) + 4} textAnchor="end">{tick === 1 ? '+1' : tick === -1 ? '−1' : '0'}</text>
        </g>)}
        <polyline className="rnn-memory-red-line" points={points(red)} />
        <polyline className="rnn-memory-blue-line" points={points(blue)} />
        {red.map((state, step) => <g key={step}>
          <circle className="rnn-memory-red-point" cx={x(step)} cy={y(state)} r="3" />
          <circle className="rnn-memory-blue-point" cx={x(step)} cy={y(blue[step])} r="5" />
          <text x={x(step)} y="124" textAnchor="middle">t={step}</text>
        </g>)}
      </svg>
      <table>
        <caption>{ko ? '토큰을 읽은 직후의 은닉 상태 (소수 셋째 자리까지)' : 'Hidden state after each token, rounded to three decimals'}</caption>
        <thead><tr>
          <th scope="col">{ko ? '단계 · 입력 토큰' : 'Step · input token'}</th>
          <th scope="col">{ko ? 'red로 시작' : 'Starts with red'}</th>
          <th scope="col">{ko ? 'blue로 시작' : 'Starts with blue'}</th>
        </tr></thead>
        <tbody>{['red / blue', 'wait', 'ready'].map((token, index) => <tr key={token}>
          <th scope="row">{index + 1} · <span lang="en">{token}</span></th>
          <td>{formatState(red[index + 1])}</td>
          <td>{formatState(blue[index + 1])}</td>
        </tr>)}</tbody>
      </table>
      <p className="rnn-memory-result" aria-live="polite">
        {weight === 1
          ? (ko ? 'ready를 읽어도 두 상태의 부호가 달라 첫 색깔을 구별할 수 있습니다.' : 'After ready, the states have opposite signs. The sign still identifies the first color.')
          : (ko ? 'wait에서 두 상태가 모두 0이 됩니다. ready를 읽은 뒤에도 같은 값입니다.' : 'At wait, both states reach zero. They stay equal after ready.')}
      </p>
    </figure>
  );
}
