import { useState } from 'react';
import { compareTitles, examples } from './lexical-dense.mjs';
import './SearchComparisonVisualizer.css';

export default function SearchComparisonVisualizer({ locale = 'en' }: { locale?: 'en' | 'ko' }) {
  const ko = locale === 'ko';
  const { groups, presets } = examples[locale];
  const [query, setQuery] = useState(presets[0]);
  const { tokens, queryVector, rows } = compareTitles(locale, query);
  const topics = ko ? ['바퀴', '등록', '학습'] : ['wheel', 'activation', 'learning'];
  const best = (field: 'bm25' | 'cosine') => {
    const max = Math.max(...rows.map(row => row[field] ?? 0));
    return rows.filter(row => max > 0 && row[field] === max).map(row => row.id).join(', ');
  };
  const undefinedScore = ko ? '정의되지 않음' : 'undefined';
  return <section className="lexical-dense" aria-label={ko ? '제목 네 개의 검색 점수' : 'Retrieval scores for four titles'}>
    <label>{ko ? '검색어' : 'Query'}
      <input type="search" value={query} onChange={e => setQuery(e.target.value)} />
    </label>
    <div className="ld-presets">{presets.map(text =>
      <button type="button" key={text} aria-pressed={query === text} onClick={() => setQuery(text)}>{text}</button>
    )}</div>
    <details><summary>{ko ? '주제 벡터에 쓰는 단어' : 'Words counted in each topic vector'}</summary>
      <ul>{groups.map((words, i) => <li key={topics[i]}><strong>{topics[i]}</strong> · {words.join(', ')}</li>)}</ul>
    </details>
    <p>{ko ? '질의 벡터' : 'Query vector'} ({topics.join(', ')}) <strong>[{queryVector.join(', ')}]</strong></p>
    <table><caption>{ko ? '문서별 점수' : 'Scores by document'}</caption>
      <thead><tr><th scope="col">{ko ? '문서' : 'Title'}</th><th scope="col">{ko ? '벡터' : 'Vector'}</th><th scope="col">BM25</th><th scope="col">{ko ? '코사인' : 'Cosine'}</th></tr></thead>
      <tbody>{rows.map(row => <tr key={row.id}><th scope="row">{row.id} · {row.title}</th><td>[{row.vector.join(', ')}]</td>
        <td>{row.bm25.toFixed(3)}</td><td>{row.cosine === null ? <abbr title={undefinedScore} aria-label={undefinedScore}>—</abbr> : row.cosine.toFixed(3)}</td></tr>)}</tbody>
    </table>
    <div aria-live="polite">
      {tokens.length > 0 ? <>
        <p>{ko ? 'BM25 최고점' : 'Highest BM25'} · <strong>{best('bm25') || (ko ? '일치하는 단어 없음' : 'no matching term')}</strong></p>
        <p>{ko ? '코사인 최고점' : 'Highest cosine'} · <strong>{best('cosine') || (ko ? '질의 벡터가 0이어서 계산할 수 없음' : 'undefined for a zero query vector')}</strong></p>
      </> : <p>{ko ? '검색어를 입력해 점수를 비교하세요.' : 'Enter a query to compare scores.'}</p>}
    </div>
  </section>;
}
