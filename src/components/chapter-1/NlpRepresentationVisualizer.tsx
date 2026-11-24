import { useId, useState } from 'react';
import '../teaching-demo.css';

type Word = 'vivid' | 'flat' | 'spare';
type Language = 'en' | 'ko';

const words: Word[] = ['vivid', 'flat', 'spare'];
const labels = {
  en: { vivid: 'vivid', flat: 'flat', spare: 'spare' },
  ko: { vivid: '생생함', flat: '밋밋함', spare: '담백함' },
};
const ratings: Record<Word, number[]> = {
  vivid: [1, 1, 1, -1],
  flat: [1, -1, -1, -1],
  spare: [],
};

function mean(values: number[]) {
  if (values.length === 0) return undefined;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function signed(value: number) {
  return value > 0 ? '+' + value : String(value);
}

export const NlpRepresentationVisualizer = ({ lang = 'en' }: { lang?: Language }) => {
  const id = useId();
  const ko = lang === 'ko';
  const [review, setReview] = useState<{ acting: Word; plot: Word }>({ acting: 'vivid', plot: 'flat' });
  const acting = mean(ratings[review.acting]);
  const plot = mean(ratings[review.plot]);
  const pooled = acting === undefined || plot === undefined ? undefined : (acting + plot) / 2;
  const format = (value: number | undefined) => value === undefined
    ? (ko ? '평점 없음' : 'Unrated')
    : signed(value);

  return <section className="teaching-demo" aria-labelledby={id + '-title'}>
    <h3 id={id + '-title'}>{ko ? '이 평이 칭찬한 건 연기일까, 줄거리일까?' : 'Did the review praise the acting or the plot?'}</h3>
    <p>{ko ? '연기와 줄거리에 붙은 평가를 맞바꿔 보세요. 어떤 숫자를 보면 무엇을 칭찬했는지 알 수 있을까요?' : 'Swap the two descriptions. Which numbers tell you what the reviewer liked?'}</p>
    <div className="demo-controls">
      {(['acting', 'plot'] as const).map(aspect =>
        <label key={aspect}>
          {aspect === 'acting' ? (ko ? '연기' : 'Acting') : (ko ? '줄거리' : 'Plot')}
          <select value={review[aspect]} onChange={event => setReview({ ...review, [aspect]: event.target.value as Word })}>
            {words.map(word => <option key={word} value={word}>{labels[lang][word]}</option>)}
          </select>
        </label>
      )}
      <button type="button" disabled={review.acting === review.plot}
        onClick={() => setReview({ acting: review.plot, plot: review.acting })}>
        {ko ? '두 평가 맞바꾸기' : 'Swap descriptions'}
      </button>
    </div>
    <div className="demo-grid" aria-live="polite">
      <div className="demo-card">
        <h4>{ko ? '평균 하나만 저장' : 'Keep one mean'}</h4>
        <p><strong>{format(pooled)}</strong></p>
        <small>{ko ? '연기와 줄거리의 점수를 더해 2로 나눕니다. 두 단어 모두 평점이 있어야 계산합니다.' : 'Add the two word scores and divide by two. Both words need a fitted score.'}</small>
      </div>
      <div className="demo-card">
        <h4>{ko ? '항목별로 저장' : 'Keep the two aspects'}</h4>
        <p>{ko ? '연기' : 'Acting'} <strong>{format(acting)}</strong><br />
          {ko ? '줄거리' : 'Plot'} <strong>{format(plot)}</strong></p>
        <small>{ko ? '어느 단어가 어느 항목을 꾸미는지는 입력에서 알려 줍니다.' : 'The input supplies which word describes each aspect.'}</small>
      </div>
    </div>
    <details>
      <summary>{ko ? '단어별 점수는 어떻게 구했을까?' : 'Where do the word scores come from?'}</summary>
      <p>{ko ? '이 예제를 위해 만든 평점입니다. 단어마다 긍정(+1)과 부정(−1) 평점의 평균을 구합니다.' : 'These are authored training ratings. Each word gets the mean of its positive (+1) and negative (−1) ratings.'}</p>
      <ul>{words.map(word => <li key={word}>{labels[lang][word]} · {ratings[word].length > 0
        ? ratings[word].map(signed).join(', ') + ' → ' + format(mean(ratings[word]))
        : format(undefined)}</li>)}</ul>
    </details>
  </section>;
};
