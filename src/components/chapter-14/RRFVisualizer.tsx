import React, { useState } from 'react';
import './visualizers.css';

export default function RRFVisualizer({ locale = 'en' }: { locale?: 'en' | 'ko' }) {
  const ko = locale === 'ko';
  const [k, setK] = useState(60);
  const docs = [
    { id: 'A', name: ko ? '시스템 X 매뉴얼' : 'System X manual', dense: 4, sparse: 1 },
    { id: 'B', name: ko ? '404 오류 안내' : '404 error guide', dense: 1, sparse: 4 },
    { id: 'C', name: ko ? '시스템 X의 404 로그' : 'System X 404 log', dense: 2, sparse: 2 },
  ];
  const fused = docs.map(x => ({ ...x, score: 1 / (k + x.dense) + 1 / (k + x.sparse) })).sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
  return <section className="rrf-container">
    <h3>{ko ? 'RRF: 순위 차이의 평활화' : 'RRF: smoothing rank differences'}</h3>
    <p>{ko ? '질의: “기존 시스템 X의 404 오류”' : 'Query: “404 error on legacy system X”'}</p>
    <label>{ko ? '평활화 상수 k' : 'Smoothing constant k'}: <strong>{k}</strong>
      <input type="range" min="0" max="100" value={k} onChange={e => setK(Number(e.target.value))} className="rrf-slider" />
    </label>
    <p>{ko ? '각 검색기에서 후보 밖인 문서는 해당 기여가 0입니다. 이 예제의 세 문서는 모두 양쪽 목록 안에 있습니다.' : 'A document outside a retriever’s candidate list receives zero contribution from that list. All three examples occur in both lists.'}</p>
    <div className="rrf-table-wrap" role="region" aria-label={ko ? '순위와 융합 점수' : 'Ranks and fusion scores'} tabIndex={0}>
      <table><thead><tr><th>{ko ? '융합 순위' : 'Fused rank'}</th><th>{ko ? '문서' : 'Document'}</th><th>{ko ? '밀집 순위' : 'Dense rank'}</th><th>{ko ? '희소 순위' : 'Sparse rank'}</th><th>{ko ? 'RRF 점수' : 'RRF score'}</th></tr></thead>
      <tbody>{fused.map((d, i) => <tr key={d.id}><td>{fused.findIndex(x => Math.abs(x.score - d.score) < 1e-12) + 1}{fused.filter(x => Math.abs(x.score - d.score) < 1e-12).length > 1 ? (ko ? ' (공동)' : ' (tie)') : ''}</td><td>{d.name}</td><td>{d.dense}</td><td>{d.sparse}</td><td>1/({k}+{d.dense}) + 1/({k}+{d.sparse}) = {d.score.toFixed(6)}</td></tr>)}</tbody></table>
    </div>
    <p aria-live="polite">{k < 2
      ? (ko ? 'k < 2: (1,4) 전문 문서들이 공동 선두입니다.' : 'k < 2: the (1,4) specialists tie for first.')
      : k === 2
        ? (ko ? 'k = 2: 세 문서가 정확히 동점입니다.' : 'k = 2: all three documents tie exactly.')
        : (ko ? 'k > 2: (2,2) 문서가 선두입니다. 평활화는 이 예제의 순위를 바꾸지만 관련성을 보증하지는 않습니다.' : 'k > 2: the (2,2) document leads. Smoothing changes this example’s ordering; it does not guarantee relevance.')}</p>
    <p>{ko ? '직접 만든 고정 순위 예제. A·B 동점의 표시 순서는 식별자로 정합니다. RRF는 검색 오류·권한 위반·프롬프트 주입을 검증하지 않습니다.' : 'Authored fixed-rank example. A/B ties are displayed in identifier order. RRF does not verify retrieval errors, access permissions, or prompt injection.'}</p>
  </section>;
}
