import { useEffect, useId, useState } from 'react';
import './next-token.css';

const training = {
  acting: ['good', 'good', 'good', 'weak'],
  plot: ['good', 'weak', 'weak', 'weak'],
};
type Aspect = keyof typeof training;
type Ending = 'good' | 'weak';

export const NextTokenVisualizer = ({ lang = 'en' }: { lang?: 'en' | 'ko' }) => {
  const ko = lang === 'ko';
  const id = useId();
  const [ready, setReady] = useState(false);
  const [aspect, setAspect] = useState<Aspect>('acting');
  const [ending, setEnding] = useState<Ending>('good');
  const [extra, setExtra] = useState(false);
  useEffect(() => setReady(true), []);

  const words = ko
    ? { acting: '연기는', plot: '줄거리는', good: '좋았다', weak: '아쉬웠다' }
    : { acting: 'acting', plot: 'plot', good: 'good', weak: 'weak' };
  const observations = extra && aspect === 'acting' ? [...training.acting, 'weak'] : training[aspect];
  const count = (word: Ending) => observations.filter(value => value === word).length;
  const hits = count(ending);
  const loss = -Math.log(hits / observations.length);

  return <section className="next-token-example" aria-labelledby={id}>
    <h3 id={id}>{ko ? '연기와 줄거리 뒤에 어떤 말이 이어졌을까?' : 'Which word followed “acting” or “plot”?'}</h3>
    <fieldset disabled={!ready}>
      <legend>{ko ? '별도로 채점할 영화평' : 'Review to score separately'}</legend>
      <label>{ko ? '첫 토큰' : 'First token'}
        <select value={aspect} onChange={e => setAspect(e.currentTarget.value as Aspect)}>
          <option value="acting">{words.acting}</option><option value="plot">{words.plot}</option>
        </select>
      </label>
      <label>{ko ? '실제로 이어진 토큰' : 'Observed next token'}
        <select value={ending} onChange={e => setEnding(e.currentTarget.value as Ending)}>
          <option value="good">{words.good}</option><option value="weak">{words.weak}</option>
        </select>
      </label>
      <label className="next-token-extra">
        <input type="checkbox" checked={extra} onChange={e => setExtra(e.currentTarget.checked)} />
        {ko ? '학습 자료에 별개의 “연기는 아쉬웠다” 영화평 한 건 추가' : 'Add one separate “acting weak” review to the training set'}
      </label>
    </fieldset>
    <table>
      <thead><tr><th scope="col">{ko ? '다음 토큰' : 'Next token'}</th><th scope="col">{ko ? '학습에서 센 횟수' : 'Training count'}</th><th scope="col">{ko ? '예측 확률' : 'Probability'}</th></tr></thead>
      <tbody>{(['good', 'weak'] as const).map(word => <tr key={word}>
        <th scope="row">{words[word]}</th><td>{count(word)} / {observations.length}</td>
        <td>{100 * count(word) / observations.length}%</td>
      </tr>)}</tbody>
    </table>
    <p className="next-token-score" aria-live="polite" aria-atomic="true">
      <strong>{words[aspect]} → {words[ending]}</strong><br />
      {ko ? '이 토큰의 손실' : 'Loss for this token'} = −ln({hits}/{observations.length}) = <strong>{loss.toFixed(3)} {ko ? 'nat' : 'nats'}</strong>
    </p>
    <noscript><p>{ko ? '초기 예제의 계산값입니다. 선택을 바꾸려면 JavaScript를 켜세요.' : 'The initial calculation is shown. Enable JavaScript to change the review.'}</p></noscript>
  </section>;
};
