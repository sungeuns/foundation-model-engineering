import React, { useId, useState } from 'react';
import { ngramOverlap } from '../../utils/ngram-overlap.js';
import './visualizers.css';

export default function NgramContaminationVisualizer({ locale = 'en' }: { locale?: 'en' | 'ko' }) {
  const ko = locale === 'ko', id = useId();
  const [a, setA] = useState(ko ? '빠른 갈색 여우가 개를 뛰어넘는다' : 'The quick brown fox jumps over the lazy dog');
  const [b, setB] = useState(ko ? '빠른 갈색 여우가 강을 뛰어넘는다' : 'A quick brown fox leaps over a lazy dog');
  const [n, setN] = useState(3);
  const result = ngramOverlap(a, b, n);
  return <section className="ngram-visualizer-container">
    <h3>{ko ? 'N-gram 겹침 탐색' : 'Explore n-gram overlap'}</h3>
    <div className="input-group"><label htmlFor={`${id}-a`}>{ko ? '텍스트 A: 학습 문서' : 'Text A: training document'}</label><textarea id={`${id}-a`} rows={2} value={a} onChange={e => setA(e.target.value)} /></div>
    <div className="input-group"><label htmlFor={`${id}-b`}>{ko ? '텍스트 B: 평가 문항' : 'Text B: evaluation item'}</label><textarea id={`${id}-b`} rows={2} value={b} onChange={e => setB(e.target.value)} /></div>
    <label>{ko ? 'N-gram 길이' : 'N-gram length'}: {n}<input type="range" min="1" max="6" value={n} onChange={e => setN(Number(e.target.value))} /></label>
    <p aria-live="polite">{ko ? 'Jaccard 유사도' : 'Jaccard similarity'}: <strong>{result.jaccard === null ? (ko ? '정의되지 않음' : 'undefined') : `${(result.jaccard * 100).toFixed(1)}%`}</strong>; {ko ? '교집합 / 합집합' : 'intersection / union'}: {result.intersection.length} / {result.unionSize}</p>
    <div className="ngrams-display">{[result.left,result.right].map((values,i) => <div className="ngram-column" key={i}><h4>{ko ? '텍스트' : 'Text'} {i ? 'B' : 'A'}</h4><ul>{values.length ? values.map(value => <li key={value} className={result.intersection.includes(value) ? 'highlight-match' : ''}>{value}</li>) : <li>{ko ? 'N-gram 없음: 입력이 너무 짧음' : 'No n-grams: input is too short'}</li>}</ul></div>)}</div>
    <p>{ko ? 'NFKC 정규화·소문자화 후 유니코드 문자/숫자를 보존하고 구두점을 공백으로 바꾸는 교육용 구현입니다. 공백 토큰화는 한국어 형태소·무공백 언어를 충분히 처리하지 않습니다. 두 집합이 비면 유사도를 정의하지 않습니다. 낮은 겹침은 의미적 오염의 부재를 입증하지 않습니다.' : 'Educational implementation: NFKC normalization, lowercasing, Unicode letters/numbers retained, punctuation replaced by spaces. Whitespace tokenization does not model Korean morphology or unspaced languages adequately. Two empty sets have undefined similarity. Low overlap does not establish absence of semantic contamination.'}</p>
  </section>;
}
