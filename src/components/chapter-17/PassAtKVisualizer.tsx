import { useId, useState } from 'react';
import { allFailAtK, passAtK } from './pass-at-k.mjs';
import './pass-at-k.css';

export default function PassAtKVisualizer({ locale = 'en' }: { locale?: 'en' | 'ko' }) {
  const ko = locale === 'ko';
  const id = useId();
  const [n, setN] = useState(20);
  const [c, setC] = useState(10);
  const [k, setK] = useState(9);
  const failures = n - c;
  const miss = allFailAtK(n, c, k);
  const pass = 1 - miss;
  const rounded = (100 * pass).toFixed(1);
  // At n=200, c=k=100, 1 - miss rounds to 1 even before formatting.
  const passLabel = failures >= k && rounded === '100.0' ? '>99.9%' : `${rounded}%`;
  const missLabel = Number((100 * miss).toPrecision(3)).toString() + '%';
  const changeN = (value: number) => {
    setN(value);
    setC(Math.min(c, value));
    setK(Math.min(k, value));
  };
  const x = (sample: number) => 45 + (n === 1 ? 0 : (sample - 1) / (n - 1) * 390);
  const y = (probability: number) => 180 - probability * 150;
  const points = Array.from({ length: n }, (_, i) => `${x(i + 1)},${y(passAtK(n, c, i + 1))}`).join(' ');
  const ticks = [...new Set([1, Math.ceil(n / 2), n])];
  return <section className="pass-atk-container" aria-labelledby={`${id}-title`}>
    <h3 id={`${id}-title`}>{ko ? '통과한 답이 하나 이상 있을 확률' : 'Chance of at least one passing answer'}</h3>
    <p>{ko ? '한 문제에 낸 답 n개 중 c개가 테스트를 통과했습니다. 이 답들에서 k개를 같은 확률로, 중복 없이 뽑습니다.' : 'For one problem, c of n answers passed the tests. Select k of those answers uniformly without replacement.'}</p>
    <div className="pass-controls">
      <label>{ko ? '전체 답 n' : 'Generated answers n'}: <strong>{n}</strong><input data-pass="n" type="range" min="1" max="200" value={n} onChange={e => changeN(Number(e.target.value))} /></label>
      <label>{ko ? '통과한 답 c' : 'Passing answers c'}: <strong>{c}</strong><input data-pass="c" type="range" min="0" max={n} value={c} onChange={e => setC(Number(e.target.value))} /></label>
      <label>{ko ? '뽑을 답 k' : 'Answers drawn k'}: <strong>{k}</strong><input data-pass="k" type="range" min="1" max={n} value={k} onChange={e => setK(Number(e.target.value))} /></label>
    </div>
    <div className="pass-results" aria-live="polite">
      <div><span>pass@1</span><strong>{(c / n * 100).toFixed(1)}%</strong></div>
      <div className="pass-selected"><span>pass@{k}</span><strong>{passLabel}</strong></div>
      <div><span>{ko ? '모두 실패할 확률' : 'Chance all fail'}</span><strong>{missLabel}</strong></div>
    </div>
    <svg className="pass-curve" viewBox="0 0 460 235" role="img" aria-labelledby={`${id}-chart-title ${id}-chart-desc`}>
      <title id={`${id}-chart-title`}>{ko ? '뽑는 개수 k와 pass@k' : 'pass@k as the number drawn increases'}</title>
      <desc id={`${id}-chart-desc`}>{ko ? `${n}개 중 ${c}개 통과. pass@${k}는 ${passLabel}, 모두 실패할 확률은 ${missLabel}입니다.` : `${c} of ${n} answers pass. At k=${k}, pass@${k} is ${passLabel}. The chance all fail is ${missLabel}.`}</desc>
      {[0, .5, 1].map(p => <g key={p}><line x1="45" y1={y(p)} x2="435" y2={y(p)} className="pass-grid-line" /><text x="38" y={y(p) + 4} textAnchor="end">{p * 100}%</text></g>)}
      <polyline points={points} fill="none" className="pass-curve-line" />
      <circle cx={x(k)} cy={y(pass)} r="5" className="pass-curve-dot" />
      {ticks.map(tick => <text x={x(tick)} y="201" textAnchor="middle" key={tick}>{tick}</text>)}
      <text x="240" y="224" textAnchor="middle">{ko ? '뽑을 답 k' : 'Answers drawn k'}</text>
    </svg>
    <p className="pass-observation">{c === 0
      ? (ko ? '통과한 답이 하나도 없어 몇 개를 뽑아도 모두 실패합니다.' : 'Every answer in this pool failed, so every draw contains only failures.')
      : k > failures
        ? (ko ? `실패한 답은 ${failures}개뿐입니다. ${k}개를 뽑으면 통과한 답이 반드시 들어갑니다.` : `Only ${failures} failures are available. A draw of ${k} must include a passing answer.`)
        : (ko ? `실패한 답 ${failures}개에서 ${k}개를 뽑을 수 있습니다. 모두 실패하는 조합이 남아 있습니다.` : `The pool contains ${failures} failures, enough to fill a draw of ${k} without a pass.`)}</p>
  </section>;
}
