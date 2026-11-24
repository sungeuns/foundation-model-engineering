import React, { useState } from 'react';
import { textCnnBias, textCnnExample, textCnnKernel } from '../../utils/textcnn.js';
import './textcnn.css';

export default function CnnVisualizer({ lang = 'en' }: { lang?: 'en' | 'ko' }) {
  const ko = lang === 'ko';
  const [start, setStart] = useState(3);
  const [swapped, setSwapped] = useState(false);
  const { tokens, windows, pooled, winners } = textCnnExample(swapped);
  const selected = windows[start];
  return <figure className="textcnn-figure">
    <figcaption>{ko ? '폭 3인 필터 하나로 단어 순서 읽기' : 'Reading word order with one width-3 filter'}</figcaption>
    <label className="textcnn-swap"><input type="checkbox" checked={swapped} onChange={event => setSwapped(event.target.checked)} />
      {ko ? 'not과 good의 위치 바꾸기' : 'Swap “not” and “good”'}</label>
    <div className="textcnn-sentence" lang="en">{tokens.map(({ word }, i) =>
      <span key={i} className={i >= start && i < start + textCnnKernel.length ? 'textcnn-current' : undefined}>{word}</span>
    )}</div>
    <label>{ko ? '윈도우 시작 위치' : 'Window start'} <strong>{start}</strong>
      <input type="range" min="0" max={windows.length - 1} value={start} onChange={event => setStart(Number(event.target.value))} />
    </label>
    <table><caption>{ko ? '두 좌표는 차례로 부정 단서와 긍정 단서입니다.' : 'Coordinates are the negation and praise features, in that order.'}</caption>
      <thead><tr>
        <th scope="col">{ko ? '단어' : 'Word'}</th><th scope="col">{ko ? '임베딩' : 'Embedding'}</th>
        <th scope="col">{ko ? '필터 행' : 'Filter row'}</th><th scope="col">{ko ? '내적' : 'Dot product'}</th>
      </tr></thead>
      <tbody>{selected.contributions.map((dot, offset) => <tr key={offset}>
        <th scope="row" lang="en">{tokens[start + offset].word}</th><td>({tokens[start + offset].embedding.join(', ')})</td>
        <td>({textCnnKernel[offset].join(', ')})</td><td>{dot}</td>
      </tr>)}</tbody>
    </table>
    <div className="textcnn-result" aria-live="polite">
      <p>{ko ? '세 내적의 합에 편향을 더하면' : 'Sum of dot products plus bias'}
        {' '}<strong>{selected.contributions.map(value => value < 0 ? `(${value})` : value).join(' + ')} − {Math.abs(textCnnBias)} = {selected.raw}</strong></p>
      <p>{ko ? '현재 윈도우의 ReLU 출력' : 'ReLU for this window'} <strong>{selected.activation}</strong></p>
      <p>{ko ? '다섯 윈도우의 ReLU 출력' : 'ReLU at all five windows'} <strong>[{windows.map(row => row.activation).join(', ')}]</strong></p>
      <p>{ko ? '최댓값' : 'Pooled maximum'} <strong>{pooled}</strong> · {ko ? '최댓값이 나온 시작 위치' : 'Winning starts'} <strong>{winners.join(', ')}</strong></p>
    </div>
  </figure>;
}
