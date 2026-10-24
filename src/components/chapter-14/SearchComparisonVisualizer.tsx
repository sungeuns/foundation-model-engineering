import React, { useState } from 'react';
import './SearchComparisonVisualizer.css';

export default function SearchComparisonVisualizer({ locale = 'en' }: { locale?: 'en' | 'ko' }) {
  const ko = locale === 'ko';
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState<string | null>(null);
  const docs = ko ? ['펑크 난 바퀴를 수리하는 방법', '제품 활성화 코드: XJ-992-B', '웹 개발과 404 오류 안내', '딥러닝 교재'] : ['How to repair a punctured wheel', 'Product activation code: XJ-992-B', 'Web development and 404 errors', 'Deep learning textbook'];
  const presets = ko ? ['타이어 펑크', 'XJ-992-B', 'AI 책'] : ['flat tire', 'XJ-992-B', 'AI book'];
  const normalized = submitted?.trim().toLowerCase() ?? '';
  const preset = presets.findIndex(x => x.toLowerCase() === normalized);
  const semantic = preset === 0 ? [0] : preset === 1 ? [2, 1] : preset === 2 ? [3] : [];
  const terms = normalized.split(/\s+/).filter(Boolean);
  const lexical = docs.map((text, i) => ({ i, hits: terms.filter(x => text.toLowerCase().includes(x)).length })).filter(x => x.hits > 0).sort((a, b) => b.hits - a.hits || a.i - b.i);
  const run = (value: string) => {setQuery(value);setSubmitted(value.trim() ? value : null);};
  return <section className="search-visualizer glass">
    <h3>{ko ? '키워드 일치와 의미 검색의 차이' : 'Lexical matching and semantic retrieval'}</h3>
    <p>{ko ? '고정 교육 예제입니다. 키워드는 부분 문자열 일치 개수이며 BM25가 아닙니다. 의미 순위는 미리 작성했으며 임베딩을 계산하지 않습니다.' : 'Fixed teaching example. Lexical results count substring matches, not BM25. Semantic rankings are authored; no embeddings are computed.'}</p>
    <form className="search-input-container" onSubmit={e => {e.preventDefault();run(query);}}>
      <label className="search-query-label">{ko ? '검색 질의' : 'Search query'}<input type="text" value={query} onChange={e => {setQuery(e.target.value);setSubmitted(null);}} className="search-input" /></label>
      <button type="submit" className="search-button">{ko ? '검색' : 'Search'}</button>
    </form>
    <div className="presets">{presets.map(q => <button type="button" key={q} onClick={() => run(q)} className="preset-btn">{q}</button>)}</div>
    {submitted !== null && <div className="search-results-grid" aria-live="polite">
      <div><h4>{ko ? '키워드 일치 순위' : 'Substring-match ranking'}</h4>{lexical.length ? <ol>{lexical.map(x => <li key={x.i}>{docs[x.i]} ({x.hits})</li>)}</ol> : <p>{ko ? '일치 없음' : 'No matches'}</p>}</div>
      <div><h4>{ko ? '작성된 의미 순위' : 'Authored semantic ranking'}</h4>{preset < 0 ? <p>{ko ? '이 질의의 의미 예제는 없습니다. 프리셋을 선택하세요.' : 'No semantic example for this query. Choose a preset.'}</p> : <ol>{semantic.map(i => <li key={i}>{docs[i]}</li>)}</ol>}</div>
    </div>}
    <p>{ko ? '동의어가 키워드 일치에서 빠질 수 있고 정확한 코드는 의미 검색에서 밀릴 수 있음을 보여 줍니다. 실제 실패율이나 유사도 점수는 나타내지 않습니다. 평가에서는 두 검색기의 후보 합집합과 관련성 레이블을 비교하세요.' : 'This illustrates synonym misses and an exact identifier being demoted by semantic retrieval. It does not measure failure rates or similarity scores. Evaluate the candidate union against relevance labels.'}</p>
  </section>;
}
