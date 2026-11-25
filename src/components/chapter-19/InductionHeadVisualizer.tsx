import { useEffect, useId, useState } from 'react';
import './induction-head.css';

const examples = [
  { en: 'Repeated A', ko: 'A가 반복될 때', tokens: ['A', 'B', 'X', 'A'] },
  { en: 'Change B to C', ko: 'B를 C로 바꾸면', tokens: ['A', 'C', 'X', 'A'] },
  { en: 'New final token', ko: '마지막에 D가 오면', tokens: ['A', 'B', 'X', 'D'] },
  { en: 'Two continuations', ko: '뒤따른 토큰이 두 가지면', tokens: ['A', 'B', 'X', 'A', 'C', 'X', 'A'] },
];

export default function InductionHeadVisualizer({ lang = 'en' }: { lang?: 'en' | 'ko' }) {
  const group = useId();
  const ko = lang === 'ko';
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const [example, setExample] = useState(0);
  const [muted, setMuted] = useState(false);
  const { tokens } = examples[example];
  const query = tokens.length - 1;
  const destinations = tokens.flatMap((_, position) =>
    position > 0 && tokens[position - 1] === tokens[query] ? [position] : []
  );
  const candidates = [...new Set(destinations.map(position => tokens[position]))];

  return (
    <div className="induction-trace">
      <noscript>
        <style>{'.induction-trace fieldset, .induction-trace .induction-mute { display: none; }'}</style>
        <p>{ko ? '기본 예시는 A B X A입니다. 다른 배열을 비교하려면 자바스크립트를 켜세요.' : 'Showing A B X A. Enable JavaScript to compare the other sequences.'}</p>
      </noscript>
      <fieldset disabled={!ready}>
        <legend>{ko ? '토큰 배열 선택' : 'Choose a token sequence'}</legend>
        <div className="induction-cases">
          {examples.map((item, i) => (
            <label key={item.en}>
              <input type="radio" name={group} checked={i === example} onChange={() => setExample(i)} />
              {item[lang]}
            </label>
          ))}
        </div>
      </fieldset>
      <label className="induction-mute">
        <input type="checkbox" disabled={!ready} checked={muted} onChange={event => setMuted(event.target.checked)} />
        {ko ? '마지막 위치에서 이 헤드가 쓰는 값을 0으로 설정' : 'Zero this head’s output at the final position'}
      </label>
      <div aria-live="polite" aria-atomic="true">
        <ol className="induction-tokens" start={0} aria-label={ko ? '입력 토큰과 위치' : 'Input tokens and their positions'}>
          {tokens.map((token, position) => (
            <li key={position} className={position === query ? 'is-query' : destinations.includes(position) ? 'is-source' : ''}>
              <small>{position}</small><b>{token}</b>
              {position === query && <span>{ko ? '질의' : 'query'}</span>}
              {destinations.includes(position) && <span>{ko ? '참조' : 'read'}</span>}
            </li>
          ))}
        </ol>
        <dl>
          <div>
            <dt>{ko ? '어디를 읽나?' : 'Which positions match?'}</dt>
            <dd>{destinations.length
              ? destinations.map(position => <span key={position}>{ko
                  ? `${position}번의 ${tokens[position]} (바로 앞 ${position - 1}번이 ${tokens[query]})`
                  : `${position} · ${tokens[position]} (preceded by ${tokens[query]} at ${position - 1})`}</span>)
              : ko ? `앞서 ${tokens[query]}가 나온 적이 없습니다.` : `No earlier occurrence of ${tokens[query]}.`}</dd>
          </div>
          <div>
            <dt>{ko ? '어떤 토큰을 밀어 주나?' : 'Which token does the copy path favor?'}</dt>
            <dd>{muted
              ? ko ? '없습니다. 헤드의 출력을 0으로 설정했습니다.' : 'None. This head’s output is zero.'
              : !candidates.length
                ? ko ? '복사할 후보가 없습니다.' : 'There is no candidate to copy.'
                : candidates.length === 1 ? candidates[0]
                  : ko ? `${candidates.join(', ')} 둘 다 후보입니다. 이 규칙만으로는 순위를 정할 수 없습니다.` : `${candidates.join(' and ')} both qualify. The rule gives no ranking.`}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
