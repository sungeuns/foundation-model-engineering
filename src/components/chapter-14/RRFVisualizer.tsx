import { useEffect, useId, useState } from 'react';
import { bm25Results, denseResults, fuseRanks } from './rank-fusion.mjs';
import './rrf-visualizer.css';

const names: Record<string, [string, string]> = {
  A: ['System X manual', '시스템 X 매뉴얼'],
  B: ['404 error guide', '404 오류 안내'],
  C: ['System X 404 log', '시스템 X의 404 로그'],
  D: ['Broken link troubleshooting', '끊어진 링크 해결 방법'],
  E: ['System X release notes', '시스템 X 릴리스 노트'],
};

export default function RRFVisualizer({ locale = 'en' }: { locale?: 'en' | 'ko' }) {
  const ko = locale === 'ko';
  const titleId = useId();
  const [ready, setReady] = useState(false);
  const [k, setK] = useState(60);
  const [depth, setDepth] = useState(4);
  const [denseWeight, setDenseWeight] = useState(1);
  useEffect(() => setReady(true), []);

  const ranked = fuseRanks(denseResults, bm25Results, { depth, k, denseWeight });
  const leaders = ranked.filter(row => row.place === 1).map(row => row.id).join(', ');
  const sources = [
    { label: ko ? '밀집 검색' : 'Dense', ids: denseResults },
    { label: 'BM25', ids: bm25Results },
  ];
  const term = (rank: number | null, weight: number) =>
    rank === null ? (ko ? '0 (후보에 없음)' : '0 (absent)') : `${weight}/(${k}+${rank})`;

  return (
    <section className="rrf-container" aria-labelledby={titleId}>
      <h3 id={titleId}>{ko ? '“구형 시스템 X의 404 오류”로 검색하면 어떤 문서가 앞설까요?' : 'Which document wins for “404 error on legacy system X”?'}</h3>
      <p>{ko ? '두 검색기가 반환한 순서입니다. 취소선이 그어진 문서는 지정한 후보 수를 벗어납니다.' : 'Each retriever returns its own ordering. Crossed-out documents fall below the selected cutoff.'}</p>
      <div className="rrf-inputs">
        {sources.map(({ label, ids }) => (
          <div key={label}>
            <strong>{label}</strong>
            <ol aria-label={label}>
              {ids.map((id, i) => <li key={id} className={i >= depth ? 'rrf-excluded' : ''}>
                {i + 1}. {id}
                {i >= depth && <span className="rrf-sr">{ko ? ' (제외)' : ' (excluded)'}</span>}
              </li>)}
            </ol>
          </div>
        ))}
      </div>
      <div className="rrf-controls">
        <label>{ko ? '검색기별 후보 수' : 'Hits per retriever'}
          <select disabled={!ready} value={depth} onChange={e => setDepth(Number(e.target.value))}>
            {[1, 2, 3, 4].map(n => <option key={n}>{n}</option>)}
          </select>
        </label>
        <label>{ko ? '밀집 검색 가중치' : 'Dense weight'}
          <select disabled={!ready} value={denseWeight} onChange={e => setDenseWeight(Number(e.target.value))}>
            {[1, 2].map(n => <option key={n} value={n}>{n}×</option>)}
          </select>
        </label>
        <label>{ko ? '평활화 상수' : 'Smoothing constant'} <span>k = {k}</span>
          <input disabled={!ready} type="range" min="0" max="100" value={k} onChange={e => setK(Number(e.target.value))} />
        </label>
      </div>
      <noscript>{ko ? '위 설정을 바꾸려면 자바스크립트를 켜세요. 아래는 기본 설정의 결과입니다.' : 'Enable JavaScript to change these settings. The default results are shown below.'}</noscript>
      <p aria-live="polite" className="rrf-summary">
        {ko ? `검색 결과 ${2 * depth}건을 합치면 서로 다른 문서는 ${ranked.length}개입니다. 1위: ${leaders}.`
          : `${2 * depth} hits give ${ranked.length} distinct documents. First place: ${leaders}.`}
      </p>
      <ul className="rrf-ranking" aria-label={ko ? '융합 순위' : 'Fused ranking'}>
        {ranked.map(row => (
          <li key={row.id} data-doc={row.id}>
            <span className="rrf-place">#{row.place}</span>
            <div>
              <strong>{row.id} · {names[row.id][ko ? 1 : 0]}</strong>
              <div className="rrf-terms">
                <span>{ko ? '밀집 검색' : 'Dense'} {term(row.dense, denseWeight)}</span>
                <span>+ BM25 {term(row.bm25, 1)}</span>
              </div>
            </div>
            <strong className="rrf-total"><span className="rrf-sr">{ko ? '합계 ' : 'Total '}</span>{row.score.toFixed(6)}</strong>
          </li>
        ))}
      </ul>
      <p className="rrf-note">{ko ? '학습용으로 구성한 순위입니다. BM25의 가중치는 1입니다. 동점에는 같은 순위를 부여하며 문서 ID 순으로 표시합니다.' : 'Constructed example. BM25 has weight 1. Equal scores share a rank and are displayed in document ID order.'}</p>
    </section>
  );
}
