import { useState } from 'react';
import { normalizeFeatures } from './normalization-example.mjs';
import './normalization-example.css';

const examples = [
  { values: [1, 3], en: 'Original', ko: '기본 입력' },
  { values: [11, 13], en: 'Add 10', ko: '10 더하기' },
  { values: [1, 1.002], en: 'Nearly equal', ko: '두 값이 비슷할 때' },
  { values: [2, 2], en: 'Constant', ko: '두 값이 같을 때' },
];
const decimal = new Intl.NumberFormat('en', { maximumFractionDigits: 6, useGrouping: false });

export default function LayerNormVisualizer({ lang = 'en' }: { lang?: 'en' | 'ko' }) {
  const [selected, select] = useState(0);
  const [epsilon, setEpsilon] = useState(0.00001);
  const ko = lang === 'ko';
  const { values } = examples[selected];
  const result = normalizeFeatures(values, epsilon);
  const observations = ko ? [
    '각 특성에서 평균 2를 빼면 −1과 1이 됩니다. RMSNorm에서는 두 입력의 양의 부호가 그대로 남습니다.',
    '두 값에 10을 더해도 평균을 빼면 다시 −1과 1입니다. LayerNorm의 출력은 기본 입력과 같고 RMSNorm의 출력은 달라집니다.',
    '입력 분산이 0.000001입니다. ε를 키워 두 출력 사이의 간격이 얼마나 줄어드는지 보세요.',
    '평균을 뺀 두 값이 모두 0이므로 LayerNorm 출력도 0입니다. RMSNorm은 입력의 평균을 빼지 않습니다.',
  ] : [
    'Subtracting the mean of 2 gives −1 and 1. RMSNorm keeps both input features positive.',
    'Adding 10 shifts the mean by 10. Subtracting it gives −1 and 1 again. LayerNorm gives the original result, while RMSNorm changes.',
    'The input variance is 0.000001. Change ε and watch the gap between the two LayerNorm outputs.',
    'Both centered features are zero, so LayerNorm outputs zeros. RMSNorm retains the common signal.',
  ];

  return (
    <section className="normalization-lab" aria-label={ko ? 'LayerNorm과 RMSNorm 비교 실습' : 'LayerNorm and RMSNorm experiment'}>
      <p>{ko ? '한 토큰의 두 특성에 같은 수를 더하면 어떤 출력이 그대로일까요? 가중치는 1, 편향은 0으로 고정합니다.'
        : 'If you add the same number to both features of a token, which output stays the same? The weights are 1 and the bias is 0.'}</p>
      <div className="normalization-controls">
        <label>
          {ko ? '입력 벡터' : 'Input vector'}
          <select value={selected} onChange={event => select(Number(event.target.value))}>
            {examples.map((row, i) => <option key={i} value={i}>{row[lang]} · [{row.values.join(', ')}]</option>)}
          </select>
        </label>
        <label>
          {ko ? '안정화 상수 ε' : 'Stability constant ε'}
          <select value={epsilon} onChange={event => setEpsilon(Number(event.target.value))}>
            <option value={0.00001}>0.00001</option>
            <option value={0.001}>0.001</option>
          </select>
        </label>
      </div>
      <table>
        <caption>{ko ? '입력과 정규화 결과' : 'Input and normalized values'}</caption>
        <thead><tr>
          <th scope="col">{ko ? '벡터' : 'Vector'}</th>
          <th scope="col">{ko ? '특성 1' : 'Feature 1'}</th>
          <th scope="col">{ko ? '특성 2' : 'Feature 2'}</th>
        </tr></thead>
        <tbody>
          {[
            { name: ko ? '입력' : 'Input', vector: values },
            { name: 'LayerNorm', vector: result.layer },
            { name: 'RMSNorm', vector: result.rms },
          ].map(({ name, vector }) => (
            <tr key={name}><th scope="row">{name}</th>{vector.map((x: number, i: number) =>
              <td key={i}>{decimal.format(x)}</td>)}</tr>
          ))}
        </tbody>
      </table>
      <dl>
        <div><dt>{ko ? '입력 평균' : 'Input mean'}</dt><dd>{decimal.format(result.mean)}</dd></div>
        <div><dt>{ko ? '입력 분산' : 'Input variance'}</dt><dd>{decimal.format(result.variance)}</dd></div>
        <div><dt>{ko ? '입력 제곱의 평균' : 'Mean squared input'}</dt><dd>{decimal.format(result.meanSquare)}</dd></div>
      </dl>
      <p className="normalization-result" role="status">
        {ko ? 'LayerNorm 출력의 분산은 ' : 'LayerNorm output variance is '}{decimal.format(result.layerVariance)}{ko ? '입니다. ' : '. '}
        {observations[selected]}
      </p>
      <noscript>{ko ? '다른 입력을 선택하려면 JavaScript를 켜세요. 아래 PyTorch 예제로도 계산할 수 있습니다.' : 'Enable JavaScript to change the inputs, or run the PyTorch example in this lesson.'}</noscript>
    </section>
  );
}
