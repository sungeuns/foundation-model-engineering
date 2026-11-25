import React from 'react';
import { distillationReadout } from './distillation-readout.mjs';
import './visualizers.css';

const labels = {
  en: {
    controls: 'Change the student',
    hiddenSwap: 'Swap hidden coordinates',
    readoutSwap: 'Swap readout columns',
    unchanged: 'Original order',
    hiddenOnly: 'Only hidden coordinates swapped',
    readoutOnly: 'Only readout columns swapped',
    both: 'Both pairs swapped',
    hidden: 'Hidden state',
    weights: 'Readout rows',
    logits: 'Logits (A, B)',
    probability: 'Probability of B',
    kl: 'Forward KL (nats)',
    mse: 'Hidden MSE',
  },
  ko: {
    controls: '학생 모델 바꾸기',
    hiddenSwap: '은닉 좌표 교환',
    readoutSwap: '출력층의 열 교환',
    unchanged: '처음 순서',
    hiddenOnly: '은닉 좌표만 교환',
    readoutOnly: '출력층의 열만 교환',
    both: '두 쌍 모두 교환',
    hidden: '은닉 상태',
    weights: '출력층 행벡터',
    logits: '로짓 (A, B)',
    probability: 'B의 확률',
    kl: '순방향 KL (nat)',
    mse: '은닉 상태 MSE',
  },
};

const cases = [
  { key: 'unchanged', swapHidden: false, swapReadout: false },
  { key: 'hiddenOnly', swapHidden: true, swapReadout: false },
  { key: 'readoutOnly', swapHidden: false, swapReadout: true },
  { key: 'both', swapHidden: true, swapReadout: true },
] as const;

const vector = (values: number[]) => '[' + values.join(', ') + ']';

export default function KDVisualizer({ lang = 'en' }: { lang?: 'en' | 'ko' }) {
  const t = labels[lang];
  return <div className="kd-readout">
    <fieldset>
      <legend>{t.controls}</legend>
      <label><input className="kd-hidden-swap" type="checkbox" /> {t.hiddenSwap}</label>
      <label><input className="kd-column-swap" type="checkbox" /> {t.readoutSwap}</label>
    </fieldset>
    <div aria-live="polite" aria-atomic="true">
      {cases.map(({ key, swapHidden, swapReadout }) => {
        const result = distillationReadout(swapHidden, swapReadout);
        return <div key={key} className={'kd-result kd-' + key}>
          <h3>{t[key]}</h3>
          <dl>
            <div><dt>{t.hidden}</dt><dd>{vector(result.hidden)}</dd></div>
            <div><dt>{t.weights}</dt><dd>{result.weights.map(vector).join(', ')}</dd></div>
            <div><dt>{t.logits}</dt><dd>{vector(result.logits)}</dd></div>
            <div><dt>{t.probability}</dt><dd>{(100 * result.probabilities[1]).toFixed(2)}%</dd></div>
            <div><dt>{t.kl}</dt><dd>{result.forwardKl.toFixed(6)}</dd></div>
            <div><dt>{t.mse}</dt><dd>{result.hiddenMse}</dd></div>
          </dl>
        </div>;
      })}
    </div>
  </div>;
}
