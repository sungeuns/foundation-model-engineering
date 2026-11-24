import { useState } from 'react';
import { sourceWords, sourceStates, targetSteps, translationReadout } from '../../utils/toy-translation.js';
import './translation-alignment.css';

export const TranslationVisualizer = ({ lang = 'en' }: { lang?: 'en' | 'ko' }) => {
  const ko = lang === 'ko';
  const [step, setStep] = useState(0);
  const [method, setMethod] = useState<'additive' | 'dot'>('additive');
  const { query } = targetSteps[step];
  const { scores, weights, context } = translationReadout(query, method);
  return (
    <section className="translation-alignment" aria-label={ko ? '번역 단계별 정렬 계산' : 'Calculate a translation alignment'}>
      <fieldset>
        <legend>{ko ? '번역 단계' : 'Translation step'}</legend>
        {targetSteps.map(({ word }, i) =>
          <button key={word} type="button" aria-pressed={step === i} onClick={() => setStep(i)}>
            {i + 1}. <span lang="fr">{word}</span>
          </button>)}
      </fieldset>
      <fieldset>
        <legend>{ko ? '정렬 점수 계산법' : 'Alignment score'}</legend>
        <button type="button" aria-pressed={method === 'additive'} onClick={() => setMethod('additive')}>
          {ko ? '가산 점수' : 'Additive'}
        </button>
        <button type="button" aria-pressed={method === 'dot'} onClick={() => setMethod('dot')}>
          {ko ? '점곱' : 'Dot product'}
        </button>
      </fieldset>
      <p>{ko ? '이 단계의 질의' : 'Query at this step'} <code>[{query.join(', ')}]</code></p>
      <table>
        <thead><tr>
          <th scope="col">{ko ? '원문' : 'Source'}</th>
          <th scope="col">{ko ? '상태' : 'State'}</th>
          <th scope="col">{ko ? '점수' : 'Score'}</th>
          <th scope="col">{ko ? '가중치' : 'Weight'}</th>
        </tr></thead>
        <tbody>{sourceWords.map((word, i) => <tr key={word}>
          <th scope="row" lang="en">{word}</th>
          <td>[{sourceStates[i].join(', ')}]</td>
          <td>{scores[i].toFixed(4)}</td>
          <td>{weights[i].toFixed(4)}<progress aria-hidden="true" value={weights[i]} max="1" /></td>
        </tr>)}</tbody>
      </table>
      <p aria-live="polite">{ko ? '문맥 벡터' : 'Context vector'} <strong>[{context.map(x => x.toFixed(4)).join(', ')}]</strong></p>
    </section>
  );
};
