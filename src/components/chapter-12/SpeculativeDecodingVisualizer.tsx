import { useEffect, useState } from 'react';
import '../teaching-demo.css';
import './speculative-decoding.css';

export default function SpeculativeDecodingVisualizer({ lang = 'en' }: { lang?: 'en' | 'ko' }) {
  const ko = lang === 'ko';
  const [ready, setReady] = useState(false);
  const [draftA, setDraftA] = useState(25);
  const [targetA, setTargetA] = useState(75);
  useEffect(() => setReady(true), []);

  const acceptedA = Math.min(draftA, targetA);
  const acceptedB = Math.min(100 - draftA, 100 - targetA);
  const rejected = 100 - acceptedA - acceptedB;
  const replacementA = Math.max(0, targetA - draftA);
  const replacementB = Math.max(0, draftA - targetA);
  const rows = [
    [ko ? '그대로 채택' : 'Kept from the draft', acceptedA, acceptedB],
    [ko ? '거절 후 보충' : 'Added after rejection', replacementA, replacementB],
    [ko ? '올바른 최종 분포' : 'Final distribution', acceptedA + replacementA, acceptedB + replacementB],
    [ko ? '목표 분포에서 다시 뽑은 경우' : 'If redrawn from the target', acceptedA + rejected * targetA / 100, acceptedB + rejected * (100 - targetA) / 100],
  ] as const;

  return <section className="teaching-demo speculative-example" aria-label={ko ? '초안과 목표 확률 비교 실험' : 'Draft and target probability experiment'}>
    <fieldset disabled={!ready}>
      <legend>{ko ? '같은 문맥에서 토큰 A가 나올 확률' : 'Probability of token A for the same prefix'}</legend>
      <label>{ko ? '초안' : 'Draft'} q(A) · {draftA}%
        <input type="range" min="0" max="100" step="5" value={draftA}
          aria-valuetext={draftA + '%'} onChange={e => setDraftA(Number(e.currentTarget.value))} />
      </label>
      <label>{ko ? '목표' : 'Target'} p(A) · {targetA}%
        <input type="range" min="0" max="100" step="5" value={targetA}
          aria-valuetext={targetA + '%'} onChange={e => setTargetA(Number(e.currentTarget.value))} />
      </label>
    </fieldset>
    <noscript>{ko ? '표는 기본 확률로 계산한 결과입니다. 확률을 바꾸려면 JavaScript를 켜세요.' : 'The table shows the starting probabilities. Enable JavaScript to change them.'}</noscript>
    <table>
      <caption>{ko ? '각 토큰이 차지하는 확률 질량' : 'Probability mass for each token'}</caption>
      <thead><tr><th scope="col">{ko ? '계산' : 'Calculation'}</th><th scope="col">A</th><th scope="col">B</th></tr></thead>
      <tbody>{rows.map(([label, a, b]) => <tr key={label}><th scope="row">{label}</th><td>{a}%</td><td>{b}%</td></tr>)}</tbody>
    </table>
    <p role="status">{rejected === 0
      ? (ko ? '두 분포가 같습니다. 모든 초안을 채택하므로 대체 토큰을 뽑을 일이 없습니다.' : 'The distributions agree. Every proposal is accepted, so no replacement is drawn.')
      : (ko ? `거절 확률은 ${rejected}%입니다. 이때 잔여 분포에서 뽑으면 대체 토큰은 모두 ${replacementA > 0 ? 'A' : 'B'}입니다.`
        : `Rejection probability is ${rejected}%. Every replacement drawn from the residual is ${replacementA > 0 ? 'A' : 'B'}.`)}</p>
  </section>;
}
