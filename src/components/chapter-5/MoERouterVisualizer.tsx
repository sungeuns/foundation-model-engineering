import React, { useEffect, useState } from 'react';
import './visualizers.css';

const contexts = {
  river: { prefix: 'We sat on the river ', logits: [3, 2, 0, -1] },
  loan: { prefix: 'For a loan, I visited the ', logits: [0, -1, 2, 3] },
};
const expertValues = [2, -2, 6, 10];

const labels = {
  en: {
    title: 'Where does “bank” go?',
    intro: 'Change the words before “bank” to change its router scores. The logits and expert outputs are illustrative values chosen for this exercise.',
    context: 'Context', river: 'River', loan: 'Loan', count: 'Experts to run (k)',
    table: 'Routing weights and one output coordinate per expert',
    expert: 'Expert', logit: 'Logit', weight: 'Weight', value: 'Value',
    skipped: 'if run',
    result: 'Weighted output coordinate (unitless)',
    note: 'Softmax uses only the selected logits. Values marked “if run” belong to skipped experts and contribute zero. The sum uses unrounded weights.',
  },
  ko: {
    title: '문맥을 바꾸면 ‘bank’는 어느 전문가로 갈까?',
    intro: '‘bank’ 앞의 단어를 바꿔 라우터 점수를 비교해 보세요. 로짓과 전문가 출력은 이 실습을 위해 정한 예시 값입니다.',
    context: '문맥', river: '강둑', loan: '대출', count: '실행할 전문가 수 (k)',
    table: '전문가별 라우팅 가중치와 출력 좌표 하나',
    expert: '전문가', logit: '로짓', weight: '가중치', value: '출력값',
    skipped: '가정값',
    result: '출력 좌표의 가중합 (단위 없음)',
    note: '선택된 로짓에만 소프트맥스를 적용합니다. 가정값은 건너뛴 전문가를 실행했다면 얻을 출력입니다. 이 전문가의 가중치는 0입니다. 합산에는 반올림 전 가중치를 사용합니다.',
  },
};

export function MoERouterVisualizer({ lang = 'en' }: { lang?: 'en' | 'ko' }) {
  const copy = labels[lang];
  const [ready, setReady] = useState(false);
  const [context, setContext] = useState<keyof typeof contexts>('river');
  const [k, setK] = useState(2);
  useEffect(() => setReady(true), []);
  const { prefix, logits } = contexts[context];
  const selected = logits.map((_, index) => index)
    .sort((a, b) => logits[b] - logits[a] || a - b)
    .slice(0, k);
  const maxLogit = logits[selected[0]];
  const expScores = selected.map(index => Math.exp(logits[index] - maxLogit));
  const denominator = expScores.reduce((sum, value) => sum + value, 0);
  const weights = logits.map(() => 0);
  selected.forEach((index, rank) => { weights[index] = expScores[rank] / denominator; });
  const output = selected.reduce((sum, index) => sum + weights[index] * expertValues[index], 0);

  return (
    <section id="moe-routing-lab" className="moe-container" aria-labelledby="moe-routing-title">
      <h3 id="moe-routing-title" className="moe-title">{copy.title}</h3>
      <p className="moe-description">{copy.intro}</p>
      <noscript><p>{lang === 'ko' ? '아래는 강둑 문맥의 top-2 계산입니다. 문맥이나 전문가 수를 바꾸려면 JavaScript를 켜세요.' : 'The river example below uses two experts. Enable JavaScript to change the context or expert count.'}</p></noscript>
      <div className="moe-controls">
        <fieldset className="moe-group" disabled={!ready}>
          <legend>{copy.context}</legend>
          {(['river', 'loan'] as const).map(choice => (
            <button key={choice} type="button" aria-pressed={choice === context} onClick={() => setContext(choice)}>
              {copy[choice]}
            </button>
          ))}
        </fieldset>
        <fieldset className="moe-group" disabled={!ready}>
          <legend>{copy.count}</legend>
          {[1, 2, 4].map(count => (
            <button key={count} type="button" aria-pressed={count === k} onClick={() => setK(count)}>
              {count}
            </button>
          ))}
        </fieldset>
      </div>
      <p className="moe-example" lang="en">{prefix}<strong>bank</strong>.</p>
      <table className="moe-table" aria-label={copy.table}>
        <thead>
          <tr>
            <th scope="col">{copy.expert}</th>
            <th scope="col">{copy.logit}</th>
            <th scope="col">{copy.weight}</th>
            <th scope="col">{copy.value}</th>
          </tr>
        </thead>
        <tbody>
          {expertValues.map((value, index) => (
            <tr key={index} className={weights[index] > 0 ? 'moe-selected' : undefined}>
              <th scope="row">E{index}</th>
              <td>{logits[index]}</td>
              <td>{weights[index].toFixed(3)}</td>
              <td>{value}{weights[index] === 0 && <small className="moe-skipped"> ({copy.skipped})</small>}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="moe-result" role="status" aria-live="polite" aria-atomic="true">
        <span>{copy.result}</span>
        <strong>{output.toFixed(3)}</strong>
      </div>
      <p className="moe-note">{copy.note}</p>
    </section>
  );
}
