import { useEffect, useState } from 'react';
import './position-encoding.css';

const width = 32;
const rows = 20;
const pairs = width / 2;

function angleAt(position: number, pair: number) {
  return position * 10000 ** (-2 * pair / width);
}

// Negative values run from white toward brown, positive values toward blue.
function colorFor(value: number) {
  const end = value < 0 ? [155, 70, 20] : [25, 94, 150];
  const rgb = end.map(channel => Math.round(255 + Math.abs(value) * (channel - 255)));
  return `rgb(${rgb.join(',')})`;
}

const heatmap = Array.from({ length: rows }, (_, p) => (
  Array.from({ length: width }, (_, d) => {
    const angle = angleAt(p, Math.floor(d / 2));
    const value = d % 2 === 0 ? Math.sin(angle) : Math.cos(angle);
    return <rect key={d} x={d} y={p} width="1" height="1" fill={colorFor(value)} />;
  })
));

export default function PeVisualizer({ lang = 'en' }: { lang?: 'en' | 'ko' }) {
  const ko = lang === 'ko';
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const [position, setPosition] = useState(1);
  const [pair, setPair] = useState(0);
  const angle = angleAt(position, pair);

  return (
    <figure className="position-grid">
      <figcaption>{ko ? '사인·코사인 위치 인코딩' : 'Sinusoidal position encodings'}</figcaption>
      <div className="position-grid-controls">
        <label>
          <span>{ko ? '위치' : 'Position'} <b>{position}</b></span>
          <input type="range" min="0" max={rows - 1} step="1" disabled={!ready} value={position}
            aria-label={ko ? '위치' : 'Position'}
            onChange={event => setPosition(Number(event.target.value))} />
        </label>
        <label>
          <span>{ko ? '주파수 쌍' : 'Frequency pair'} <b>{pair}</b></span>
          <input type="range" min="0" max={pairs - 1} step="1" disabled={!ready} value={pair}
            aria-label={ko ? '주파수 쌍' : 'Frequency pair'}
            onChange={event => setPair(Number(event.target.value))} />
        </label>
      </div>
      <div className="position-grid-axes">
        <span className="position-grid-columns">{ko ? '차원' : 'Dimension'} 0 → {width - 1}</span>
        <span className="position-grid-rows" aria-hidden="true"><span>0</span><span>↓</span><span>{rows - 1}</span></span>
        <svg role="img" viewBox={`0 0 ${width} ${rows}`} preserveAspectRatio="none">
          <title>{ko ? '위치 0부터 19까지의 행과 임베딩 차원 0부터 31까지의 열. 테두리는 선택한 두 값입니다.' : 'Rows are positions 0 through 19. Columns are dimensions 0 through 31. The outline marks the selected pair.'}</title>
          <g shapeRendering="crispEdges">{heatmap}</g>
          <rect className="position-grid-halo" x={2 * pair + .05} y={position + .05} width="1.9" height=".9" />
          <rect className="position-grid-selection" x={2 * pair + .05} y={position + .05} width="1.9" height=".9" />
        </svg>
      </div>
      <div className="position-grid-legend">
        <span>−1</span><i aria-hidden="true" /><span>0</span><i aria-hidden="true" /><span>+1</span>
      </div>
      <div className="position-grid-readout" aria-live="polite" aria-atomic="true">
        <p>{ko ? '각도' : 'Angle'} <strong>{angle.toFixed(6)}</strong> {ko ? '라디안' : 'radians'}</p>
        <p>{ko ? '차원' : 'Dimension'} {2 * pair} · sin <strong>{Math.sin(angle).toFixed(6)}</strong></p>
        <p>{ko ? '차원' : 'Dimension'} {2 * pair + 1} · cos <strong>{Math.cos(angle).toFixed(6)}</strong></p>
      </div>
    </figure>
  );
}
