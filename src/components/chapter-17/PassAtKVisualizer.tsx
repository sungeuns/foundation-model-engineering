import React, { useId, useState } from 'react';
import { passAtK } from './pass-at-k.mjs';
import './pass-at-k.css';

export default function PassAtKVisualizer({ locale = 'en' }: { locale?: 'en' | 'ko' }) {
  const ko = locale === 'ko';
  const id = useId();
  const [n, setN] = useState(100), [c, setC] = useState(10), [k, setK] = useState(5);
  const rate = passAtK(n, c, k) * 100;
  const changeN = (value: number) => { setN(value); setC(Math.min(c, value)); setK(Math.min(k, value)); };
  const x = (sample: number) => 45 + (n === 1 ? 0 : (sample - 1) / (n - 1) * 390);
  const y = (probability: number) => 180 - probability * 150;
  const points = Array.from({ length: n }, (_, i) => `${x(i + 1)},${y(passAtK(n, c, i + 1))}`).join(' ');
  const ticks = [...new Set([1, Math.ceil(n / 2), n])];
  return <section className="pass-atk-container" aria-labelledby={`${id}-title`}>
    <h3 id={`${id}-title`}>{ko ? '샘플을 더 뽑으면 pass@k는 어떻게 변할까요?' : 'How does pass@k change with more attempts?'}</h3>
    <p>{ko ? '같은 문제의 표본 n개 중 c개가 테스트를 통과했습니다. 이 중 복원 없이 k개를 고를 때, 적어도 하나가 통과할 확률을 계산합니다.' : 'Of n generated samples for one problem, c pass the tests. Calculate the chance that at least one passes when choosing k of these samples without replacement.'}</p>
    <div className="pass-controls">
      <label>{ko ? '전체 생성 표본 n' : 'Generated samples n'}: <strong>{n}</strong><input data-pass="n" type="range" min="1" max="200" value={n} onChange={e => changeN(Number(e.target.value))} /></label>
      <label>{ko ? '통과 표본 c' : 'Passing samples c'}: <strong>{c}</strong><input data-pass="c" type="range" min="0" max={n} value={c} onChange={e => setC(Number(e.target.value))} /></label>
      <label>{ko ? '선택할 표본 k' : 'Selected samples k'}: <strong>{k}</strong><input data-pass="k" type="range" min="1" max={n} value={k} onChange={e => setK(Number(e.target.value))} /></label>
    </div>
    <div className="pass-results" aria-live="polite"><div><span>pass@1</span><strong>{(c / n * 100).toFixed(1)}%</strong></div><div className="pass-selected"><span>pass@{k}</span><strong>{rate.toFixed(1)}%</strong></div><div><span>{ko ? '선택한 표본 수' : 'Samples selected'}</span><strong>{k} / {n}</strong></div></div>
    <svg className="pass-curve" viewBox="0 0 460 235" role="img" aria-labelledby={`${id}-chart-title ${id}-chart-desc`}>
      <title id={`${id}-chart-title`}>{ko ? 'k에 따른 pass@k 확률' : 'pass@k probability by k'}</title>
      <desc id={`${id}-chart-desc`}>{ko ? `전체 ${n}개 중 통과 ${c}개. k=${k}에서 확률은 ${rate.toFixed(1)}%입니다.` : `${c} of ${n} samples pass. At k=${k}, the probability is ${rate.toFixed(1)}%.`}</desc>
      {[0, .5, 1].map(p => <g key={p}><line x1="45" y1={y(p)} x2="435" y2={y(p)} className="pass-grid-line" /><text x="38" y={y(p) + 4} textAnchor="end">{p * 100}%</text></g>)}
      <polyline points={points} fill="none" className="pass-curve-line" />
      <circle cx={x(k)} cy={y(rate / 100)} r="5" className="pass-curve-dot" />
      {ticks.map(tick => <text x={x(tick)} y="201" textAnchor="middle" key={tick}>{tick}</text>)}
      <text x="240" y="224" textAnchor="middle">{ko ? '선택할 표본 수 k' : 'Selected samples k'}</text>
    </svg>
    <p className="pass-observation">{c === 0
      ? (ko ? '통과한 표본이 없으므로, k를 늘려도 확률은 0%입니다.' : 'No sampled solution passes, so increasing k leaves the probability at 0%.')
      : k > n - c
        ? (ko ? '실패 표본 수보다 많이 고르면 적어도 하나는 반드시 통과합니다. 다만 시스템이 그 정답을 식별할 수 있는지는 별도 문제입니다.' : 'Choosing more samples than there are failures guarantees at least one pass in this finite pool. Whether a system can identify that answer is a separate question.')
        : (ko ? `k=1일 때는 ${c}/${n}입니다. k를 늘리면 정답이 포함될 가능성이 커지지만, 생성·검증 비용도 늘어납니다.` : `At k=1 the probability is ${c}/${n}. Increasing k makes a correct answer more likely to be present, while generation and verification cost also grow.`)}</p>
    <p className="pass-formula">pass@k = 1 − C(n − c, k) / C(n, k)</p>
    <p className="pass-note">{ko ? '교육용 유한 표본 계산입니다. C(a, b)는 조합의 수이며 b > a일 때 0입니다. 벤치마크에서는 문제별 추정량을 계산한 뒤 평균합니다. 새로 생성할 답의 성공률을 보장하지 않습니다. 실제 배포에서는 답을 고르는 선택기·테스트 오라클의 품질과 전체 표본 비용을 함께 평가해야 합니다.' : 'Educational finite-sample calculation. C(a, b) counts combinations and is zero when b > a. A benchmark averages these estimates across problems. This does not guarantee success on newly generated answers. For deployment, also evaluate the selector or test oracle and the cost of all samples.'}</p>
  </section>;
}
