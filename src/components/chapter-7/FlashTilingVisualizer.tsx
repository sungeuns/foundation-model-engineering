import { useEffect, useId, useState } from 'react';
import './flash-tiling.css';

const values = [2, 2, 10, 10];

function traceTiles(ratio: number, width: number) {
  const scores = [0, 0, Math.log(ratio), Math.log(ratio)];
  let maximum = -Infinity;
  let denominator = 0;
  let numerator = 0;
  let sumOfTileOutputs = 0;
  const rows = [];
  for (let start = 0; start < scores.length; start += width) {
    const tile = scores.slice(start, start + width);
    const tileMaximum = Math.max(...tile);
    const newMaximum = Math.max(maximum, tileMaximum);
    const correction = Math.exp(maximum - newMaximum);
    const weights = tile.map(score => Math.exp(score - newMaximum));
    const tileDenominator = weights.reduce((sum, weight) => sum + weight, 0);
    const tileNumerator = weights.reduce((sum, weight, i) => sum + weight * values[start + i], 0);
    denominator = correction * denominator + tileDenominator;
    numerator = correction * numerator + tileNumerator;
    maximum = newMaximum;
    sumOfTileOutputs += tileNumerator / tileDenominator;
    rows.push({ first: start + 1, last: start + tile.length, correction, denominator, numerator });
  }
  return { rows, output: numerator / denominator, tileMean: sumOfTileOutputs / rows.length };
}

export default function FlashTilingVisualizer({ lang = 'en' }: { lang?: 'en' | 'ko' }) {
  const ko = lang === 'ko';
  const id = useId();
  const [ready, setReady] = useState(false);
  const [width, setWidth] = useState(2);
  const [ratio, setRatio] = useState(3);
  useEffect(() => setReady(true), []);
  const { rows, output, tileMean } = traceTiles(ratio, width);
  const format = new Intl.NumberFormat(ko ? 'ko-KR' : 'en-US', { maximumFractionDigits: 3 });
  return <div className="flash-tiles">
    <fieldset disabled={!ready}>
      <legend>{ko ? '네 키를 타일로 나누어 계산하기' : 'Partition the four keys'}</legend>
      <label htmlFor={id + '-width'}>{ko ? '타일당 키 수' : 'Keys per tile'}
        <select id={id + '-width'} value={width} onChange={e => setWidth(Number(e.target.value))}>
          {[1, 2, 3, 4].map(n => <option value={n} key={n}>{n}</option>)}
        </select>
      </label>
      <label htmlFor={id + '-weight'}>{ko ? '3·4번 키의 상대 가중치' : 'Relative weight of keys 3 and 4'}
        <select id={id + '-weight'} value={ratio} onChange={e => setRatio(Number(e.target.value))}>
          <option value={1 / 3}>⅓×</option><option value={1}>1×</option><option value={3}>3×</option>
        </select>
      </label>
    </fieldset>
    <noscript><p>{ko ? '아래는 타일당 키 2개, 상대 가중치 3배의 결과입니다.' : 'The trace below uses two keys per tile and a relative weight of three.'}</p></noscript>
    <table>
      <caption>{ko ? '타일을 반영한 뒤의 누적값 (소수 셋째 자리까지 표시)' : 'State after each tile (rounded to three decimal places)'}</caption>
      <thead><tr>
        <th scope="col">{ko ? '키 번호' : 'Keys'}</th>
        <th scope="col">{ko ? '보정 계수 a' : 'Rescale a'}</th>
        <th scope="col">{ko ? '분모 ℓ' : 'Sum ℓ'}</th>
        <th scope="col">{ko ? '분자 u' : 'Sum u'}</th>
      </tr></thead>
      <tbody>{rows.map(row => <tr key={row.first}>
        <th scope="row">{row.first === row.last ? row.first : `${row.first}–${row.last}`}</th>
        <td>{format.format(row.correction)}</td><td>{format.format(row.denominator)}</td><td>{format.format(row.numerator)}</td>
      </tr>)}</tbody>
    </table>
    <dl aria-live="polite" aria-atomic="true">
      <div><dt>{ko ? '어텐션 출력 u / ℓ' : 'Attention output u / ℓ'}</dt><dd>{format.format(output)}</dd></div>
      <div><dt>{ko ? '타일별 출력의 단순 평균' : 'Unweighted mean of tile outputs'}</dt><dd>{format.format(tileMean)}</dd></div>
    </dl>
  </div>;
}
