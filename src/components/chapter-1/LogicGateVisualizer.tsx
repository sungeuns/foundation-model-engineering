import { useEffect, useId, useState } from 'react';
import './logic-gate.css';

const inputs = [[0, 0], [0, 1], [1, 0], [1, 1]] as const;

export const LogicGateVisualizer = ({ lang = 'en' }: { lang?: 'en' | 'ko' }) => {
  const ko = lang === 'ko';
  const titleId = useId();
  const [ready, setReady] = useState(false);
  const [rule, setRule] = useState('AND');
  // Integer tenths keep an exact zero on the inclusive threshold.
  const [weightA, setWeightA] = useState(10);
  const [weightB, setWeightB] = useState(10);
  const [bias, setBias] = useState(-15);
  useEffect(() => setReady(true), []);

  const rows = inputs.map(([a, b]) => {
    const score = weightA * a + weightB * b + bias;
    const neuron = Number(score >= 0);
    const target = Number(rule === 'AND' ? a === 1 && b === 1 : a !== b);
    return { a, b, score, neuron, target };
  });
  const matches = rows.filter(row => row.neuron === row.target).length;
  const sliders = [
    { label: ko ? 'A 가중치' : 'Weight A', ticks: weightA, set: setWeightA },
    { label: ko ? 'B 가중치' : 'Weight B', ticks: weightB, set: setWeightB },
    { label: ko ? '편향' : 'Bias', ticks: bias, set: setBias },
  ];
  const display = (ticks: number) => (ticks / 10).toFixed(1);

  return (
    <section id="logic-gate-lab" className="logic-gate" aria-labelledby={titleId}>
      <h3 id={titleId}>{ko ? '뉴런 하나로 네 행을 모두 맞힐 수 있을까?' : 'Can one neuron match all four rows?'}</h3>
      <p>{ko ? '점수는 A 가중치 × A + B 가중치 × B + 편향입니다. 점수가 0 이상이면 뉴런은 1을 출력합니다.' : 'Score = weight A × A + weight B × B + bias. The neuron returns 1 when the score is zero or greater.'}</p>
      <fieldset disabled={!ready}>
        <legend>{ko ? '규칙과 뉴런 설정' : 'Rule and neuron settings'}</legend>
        <label className="logic-gate-rule">{ko ? '비교할 규칙' : 'Target rule'}
          <select value={rule} onChange={event => setRule(event.target.value)}>
            <option value="AND">{ko ? 'AND · 둘 다 1' : 'AND · both are 1'}</option>
            <option value="XOR">{ko ? 'XOR · 둘이 다름' : 'XOR · the flags differ'}</option>
          </select>
        </label>
        <div className="logic-gate-controls">
          {sliders.map(({ label, ticks, set }) => (
            <label key={label}>
              <span>{label} <strong>{display(ticks)}</strong></span>
              <input type="range" min="-2" max="2" step="0.1" value={ticks / 10}
                onChange={event => set(Math.round(Number(event.currentTarget.value) * 10))} />
            </label>
          ))}
        </div>
      </fieldset>
      <noscript>{ko ? '아래 표는 기본 설정입니다. 값을 바꾸려면 자바스크립트를 켜세요.' : 'The table shows the starting settings. Enable JavaScript to change them.'}</noscript>
      <table>
        <caption>{ko ? '같은 입력에 대한 두 출력' : 'Two outputs for the same inputs'}</caption>
        <thead><tr>
          {['A', 'B', ko ? '점수' : 'Score', ko ? '뉴런' : 'Neuron', rule].map(heading => <th key={heading} scope="col">{heading}</th>)}
        </tr></thead>
        <tbody>{rows.map(({ a, b, score, neuron, target }) => (
          <tr key={`${a}-${b}`}><td>{a}</td><td>{b}</td><td>{display(score)}</td><td>{neuron}</td><td>{target}</td></tr>
        ))}</tbody>
      </table>
      <p className="logic-gate-result" aria-live="polite">{ko ? `네 입력 중 ${matches}개에서 뉴런이 ${rule} 규칙과 일치합니다.` : `The neuron matches ${rule} on ${matches} of 4 inputs.`}</p>
    </section>
  );
};
