import { useEffect, useId, useState } from 'react';
import './visualizers.css';

export default function ComplexityVisualizer({ lang = 'en' }: { lang?: 'en' | 'ko' }) {
  const ko = lang === 'ko';
  const width = 512;
  const maxLength = 5000;
  const id = useId();
  const [length, setLength] = useState(width);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const format = new Intl.NumberFormat(ko ? 'ko-KR' : 'en-US');

  return (
    <section className="complexity-comparison" aria-labelledby={id}>
      <h3 id={id}>{ko ? '은닉 차원 512에서의 연산량 비교' : 'Compare growth at a hidden width of 512'}</h3>
      <fieldset disabled={!ready}>
        <label>
          {ko ? '시퀀스 길이' : 'Sequence length'} <strong>{format.format(length)}</strong>
          <input type="range" min="100" max={maxLength} step="4" value={length}
            onChange={event => setLength(event.currentTarget.valueAsNumber)} />
        </label>
        <button type="button" disabled={length * 2 > maxLength} onClick={() => setLength(length * 2)}>
          {ko ? '길이 두 배로' : 'Double the length'}
        </button>
      </fieldset>
      <dl aria-live="polite" aria-atomic="true">
        <div>
          <dt>{ko ? '어텐션 핵심 연산' : 'Attention core'} · n²</dt>
          <dd>{format.format(length * length)}</dd>
        </div>
        <div>
          <dt>{ko ? '순환층 연산' : 'Recurrent layer'} · n × 512</dt>
          <dd>{format.format(length * width)}</dd>
        </div>
      </dl>
    </section>
  );
}
