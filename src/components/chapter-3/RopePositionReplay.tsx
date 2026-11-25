import { useEffect, useId, useState } from 'react';
import run from '../../../public/labs/2026-11/rope-position-ids.json';
import './position-encoding.css';

const rows = run.rows;
const first = rows[0].positions[0];
const last = rows[rows.length - 1].positions[0];
const x = (position: number) => 58 + 310 * (position - first) / (last - first);
const y = (weight: number) => 126 - (weight - 0.28) * 950;
const line = (key: 'integer_weight' | 'rounded_weight') =>
  rows.map(row => `${x(row.positions[0])},${y(row[key])}`).join(' ');
const percent = (weight: number) => (100 * weight).toFixed(3) + '%';

export default function RopePositionReplay({ lang = 'en' }: { lang?: 'en' | 'ko' }) {
  const ko = lang === 'ko';
  const id = useId();
  const [ready, setReady] = useState(false);
  const [start, setStart] = useState(256);
  useEffect(() => setReady(true), []);
  const row = rows[start - first];
  const [roundedStart, roundedEnd] = row.rounded_positions;
  return (
    <figure className="position-grid rope-replay">
      <figcaption>{ko ? '‘cat’이 ‘red’에 준 어텐션 가중치' : 'Attention weight from “cat” to “red”'}</figcaption>
      <svg viewBox="0 0 390 170" role="img" aria-labelledby={id}>
        <title id={id}>{ko ? '시작 위치 248~264에서 정수 ID의 가중치는 33.814% 근처에 머뭅니다. BF16을 거치면 256부터 약 29.034%와 37.178%로 갈라집니다.' : 'From start positions 248 to 264 the integer-ID weight stays near 33.814%. Rounding through BF16 produces values near 29.034% or 37.178% starting at 256.'}</title>
        {[0.28, 0.33, 0.38].map(tick => <g key={tick}>
          <line x1="54" x2="374" y1={y(tick)} y2={y(tick)} stroke="#b4c1c6" />
          <text x="49" y={y(tick) + 5} textAnchor="end">{Math.round(100 * tick)}%</text>
        </g>)}
        <polyline className="rope-rounded" points={line('rounded_weight')} />
        <polyline className="rope-integer" points={line('integer_weight')} />
        <line x1={x(start)} x2={x(start)} y1="18" y2="129" stroke="#6e777b" strokeDasharray="2 4" />
        <circle cx={x(start)} cy={y(row.rounded_weight)} r="4" fill="#ae410e" />
        <rect x={x(start) - 3} y={y(row.integer_weight) - 3} width="6" height="6" fill="#075a7a" />
        {[first, 252, 256, 260, last].map(tick => <text key={tick} x={x(tick)} y="151" textAnchor="middle">{tick}</text>)}
      </svg>
      <label className="rope-offset-control">
        <span>{ko ? '‘red’의 시작 위치' : 'Starting position of “red”'} <strong>{start}</strong></span>
        <input type="range" min={first} max={last} step="1" value={start} disabled={!ready}
          onChange={event => setStart(Number(event.target.value))} />
      </label>
      <table aria-live="polite" aria-atomic="true">
        <thead><tr>
          <th scope="col">{ko ? '위치 처리' : 'Position path'}</th>
          <th scope="col">{ko ? '두 ID' : 'Two IDs'}</th>
          <th scope="col">{ko ? '가중치' : 'Weight'}</th>
        </tr></thead>
        <tbody>
          <tr><th scope="row"><i className="rope-integer-key" aria-hidden="true" />{ko ? '정수 유지' : 'Integer IDs'}</th><td>{row.positions.join(', ')}</td><td>{percent(row.integer_weight)}</td></tr>
          <tr><th scope="row"><i className="rope-rounded-key" aria-hidden="true" />{ko ? 'BF16 경유' : 'Via BF16'}</th><td>{roundedStart}, {roundedEnd}</td><td>{percent(row.rounded_weight)}</td></tr>
        </tbody>
      </table>
    </figure>
  );
}
