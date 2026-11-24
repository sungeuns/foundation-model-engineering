import { useEffect, useState } from 'react';
import { compareTitles, examples } from './lexical-dense.mjs';
import { productCodeFragment, retrievalFragment, retrievalFragments, retrievalQuery } from './retrieval-presets.js';
import { withPagePath } from '../../utils/paths.js';
import './SearchComparisonVisualizer.css';

type Locale = 'en' | 'ko';

function Results({ locale, query }: { locale: Locale; query: string }) {
  const ko = locale === 'ko';
  const { tokens, queryVector, rows } = compareTitles(locale, query);
  const topics = ko ? ['바퀴', '등록', '학습'] : ['wheel', 'activation', 'learning'];
  const best = (field: 'bm25' | 'cosine') => {
    const max = Math.max(...rows.map(row => row[field] ?? 0));
    return rows.filter(row => max > 0 && row[field] === max).map(row => row.id).join(', ');
  };
  const undefinedScore = ko ? '정의되지 않음' : 'undefined';
  return <>
    <p>{ko ? '질의 벡터' : 'Query vector'} ({topics.join(', ')}) <strong>[{queryVector.join(', ')}]</strong></p>
    <table><caption>{ko ? '문서별 점수' : 'Scores by document'}{query && <> · {query}</>}</caption>
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
  </>;
}

export default function SearchComparisonVisualizer({ locale = 'en' }: { locale?: Locale }) {
  const ko = locale === 'ko';
  const { groups, presets } = examples[locale];
  const [query, setQuery] = useState<string | null>(null);
  const otherEdition = withPagePath((ko ? '' : '/ko') + '/chapter-14/lexical-to-semantic-search');
  const topics = ko ? ['바퀴', '등록', '학습'] : ['wheel', 'activation', 'learning'];

  useEffect(() => {
    const restore = () => setQuery(retrievalQuery(presets, location.hash));
    restore();
    window.addEventListener('hashchange', restore);
    window.addEventListener('pageshow', restore);
    return () => {
      window.removeEventListener('hashchange', restore);
      window.removeEventListener('pageshow', restore);
    };
  }, [presets]);

  function editQuery(value: string) {
    if (retrievalFragment(location.hash) || location.hash === '#lexical-dense-example') {
      history.replaceState(history.state, '', location.pathname + location.search);
      window.dispatchEvent(new Event('hashchange'));
    }
    setQuery(value);
  }

  return <section className="lexical-dense" aria-label={ko ? '제목 네 개의 검색 점수' : 'Retrieval scores for four titles'}>
    <nav className="ld-presets" aria-label={ko ? '예제 검색어 링크' : 'Example query links'}>
      {presets.map((text, i) => <a key={text} id={retrievalFragments[i]} href={'#' + retrievalFragments[i]}
        aria-current={query === text ? 'true' : undefined}>{text}</a>)}
    </nav>
    {query !== null && <label>{ko ? '다른 검색어 입력' : 'Try your own query'}
      <input type="search" value={query} onChange={e => editQuery(e.target.value)} />
    </label>}
    <noscript><p>{ko ? '예제 링크를 선택하면 해당 점수가 표시됩니다. 검색어를 직접 입력하려면 JavaScript를 켜세요.' : 'Select an example link to see its scores. Enable JavaScript to enter your own query.'}</p></noscript>
    <details><summary>{ko ? '주제 벡터에 쓰는 단어' : 'Words counted in each topic vector'}</summary>
      <ul>{groups.map((words, i) => <li key={topics[i]}><strong>{topics[i]}</strong> · {words.join(', ')}</li>)}</ul>
    </details>
    {query === null ? <div className="ld-static">{presets.map((text, i) =>
      <div key={text} data-preset={retrievalFragments[i]} data-default={retrievalFragments[i] === productCodeFragment || undefined}>
        <Results locale={locale} query={text} />
        <a href={otherEdition + '#' + retrievalFragments[i]} hrefLang={ko ? 'en' : 'ko'}>{ko ? '이 예제를 영어로 보기' : 'Read this example in Korean'}</a>
      </div>
    )}</div> : <Results locale={locale} query={query} />}
  </section>;
}
