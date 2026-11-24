import { useEffect, useId, useState } from 'react';
import './visualizers.css';

const floor = 1.5;
const excessAt = (logBudget: number) => 10 * 10 ** (-0.05 * logBudget);
const x = (logBudget: number) => 38 + (logBudget - 1) * 35;
const y = (loss: number) => 172 - Math.log(loss / floor) / Math.log(12 / floor) * 152;
const curve = (offset: number) => Array.from({ length: 81 }, (_, index) => {
  const logBudget = 1 + index / 10;
  return `${index === 0 ? 'M' : 'L'}${x(logBudget)},${y(excessAt(logBudget) + offset)}`;
}).join(' ');

const labels = {
  en: {
    title: 'What changes when compute doubles?',
    intro: 'Compare two budgets on the example curve. The dashed line shows excess loss above the assumed floor of 1.5 nats per token.',
    budget: 'Starting compute budget (relative units)',
    axis: 'Relative compute budget · log scale',
    loss: 'Loss in nats per token · log scale',
    chart: 'Total and excess loss against relative compute budget',
    description: 'The solid total-loss curve lies above the dashed excess-loss line. Markers show the starting budget; the table also evaluates twice that budget.',
    total: 'Total loss', excess: 'Excess loss', decrease: 'Decrease', measure: 'Loss', floor: 'Floor',
  },
  ko: {
    title: '연산량을 두 배로 늘리면 손실은 얼마나 줄어들까?',
    intro: '예제 곡선에서 두 연산 예산을 비교합니다. 점선은 전체 손실에서 가정한 하한인 토큰당 1.5 nat를 뺀 초과 손실입니다.',
    budget: '시작 연산 예산(상대 단위)',
    axis: '상대 연산 예산 · 로그 척도',
    loss: '토큰당 손실(nat) · 로그 척도',
    chart: '상대 연산 예산에 따른 전체 손실과 초과 손실',
    description: '실선은 전체 손실, 그 아래 점선은 초과 손실입니다. 표식은 시작 예산을 가리킵니다. 아래 표에서 예산을 두 배로 늘렸을 때의 손실을 비교할 수 있습니다.',
    total: '전체 손실', excess: '초과 손실', decrease: '감소율', measure: '손실', floor: '하한',
  },
};

export default function PowerLawVisualizer({ lang = 'en' }: { lang?: 'en' | 'ko' }) {
  const t = labels[lang];
  const id = useId();
  const [logBudget, setLogBudget] = useState(2);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const budget = 10 ** logBudget;
  const format = new Intl.NumberFormat(lang);
  const excess = excessAt(logBudget);
  const doubled = excessAt(Math.log10(2 * budget));
  const rows = [
    { name: t.total, value: excess + floor, next: doubled + floor },
    { name: t.excess, value: excess, next: doubled },
  ];

  return (
    <section className="power-law-container" aria-labelledby={`${id}-heading`}>
      <h3 id={`${id}-heading`}>{t.title}</h3>
      <p>{t.intro}</p>
      <label htmlFor={`${id}-budget`}>{t.budget}: <strong>{format.format(budget)} → {format.format(2 * budget)}</strong></label>
      <input id={`${id}-budget`} type="range" min="1" max="8" step="1" value={logBudget}
        disabled={!ready} aria-valuetext={format.format(budget)}
        onChange={event => setLogBudget(Number(event.currentTarget.value))} />
      <div className="power-law-y-label">{t.loss}</div>
      <svg className="power-law-svg" viewBox="0 0 346 205" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
        <title id={`${id}-title`}>{t.chart}</title>
        <desc id={`${id}-desc`}>{t.description}</desc>
        {[1.5, 3, 6, 12].map(value => <g key={value}>
          <line x1="38" x2="318" y1={y(value)} y2={y(value)} />
          <text x="31" y={y(value) + 4} textAnchor="end">{value}</text>
        </g>)}
        <text x="315" y={y(floor) - 5} textAnchor="end">{t.floor}</text>
        {['10', '10³', '10⁵', '10⁷', '10⁹'].map((label, index) => <g key={label}>
          <line x1={x(2 * index + 1)} x2={x(2 * index + 1)} y1="172" y2="178" />
          <text x={x(2 * index + 1)} y="196" textAnchor="middle">{label}</text>
        </g>)}
        <path className="power-law-total" d={curve(floor)} />
        <path className="power-law-excess" d={curve(0)} />
        <circle className="power-law-total" cx={x(logBudget)} cy={y(rows[0].value)} r="4" />
        <rect className="power-law-excess" x={x(logBudget) - 3.5} y={y(excess) - 3.5} width="7" height="7" />
      </svg>
      <div className="power-law-x-label">{t.axis}</div>
      <table>
        <thead><tr><th scope="col">{t.measure}</th><th scope="col">C</th><th scope="col">2C</th><th scope="col">{t.decrease}</th></tr></thead>
        <tbody>{rows.map(row => <tr key={row.name}><th scope="row">{row.name}</th><td>{row.value.toFixed(3)}</td><td>{row.next.toFixed(3)}</td><td>{((1 - row.next / row.value) * 100).toFixed(2)}%</td></tr>)}</tbody>
      </table>
    </section>
  );
}
