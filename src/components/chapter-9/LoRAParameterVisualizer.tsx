import { useEffect, useState } from 'react';
import './lora-parameters.css';

const widths = [8, 12, 128, 512, ...Array.from({ length: 16 }, (_, i) => (i + 1) * 1024)];

export default function LoRAParameterVisualizer({ lang = 'en' }: { lang?: 'en' | 'ko' }) {
  const ko = lang === 'ko';
  const [input, setInput] = useState(4096);
  const [output, setOutput] = useState(4096);
  const [rank, setRank] = useState(16);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const maxRank = Math.min(256, input, output);
  const full = output * input;
  const a = rank * input;
  const b = output * rank;
  const format = new Intl.NumberFormat(ko ? 'ko-KR' : 'en-US');
  const percent = new Intl.NumberFormat(ko ? 'ko-KR' : 'en-US', {
    style: 'percent', maximumFractionDigits: 2,
  }).format((a + b) / full);

  function changeWidth(value: number, setWidth: (width: number) => void) {
    setWidth(value);
    setRank(current => Math.min(current, value));
  }

  return (
    <section className="lora-counts" aria-label={ko ? 'LoRA 파라미터 계산기' : 'LoRA parameter calculator'}>
      <h3>{ko ? '투영 하나에서 학습하는 파라미터는 몇 개일까?' : 'How many parameters does one projection train?'}</h3>
      <p>{ko ? '입력 폭을 4,096에 두고 출력 폭을 1,024로 줄여 보세요. A와 B 중 어느 쪽이 작아질까요?' : 'Keep the input width at 4,096 and narrow the output to 1,024. Which factor gets smaller?'}</p>
      <fieldset className="lora-controls" disabled={!ready}>
        <legend>{ko ? '투영 설정' : 'Projection settings'}</legend>
        <label>{ko ? '입력 폭 (k)' : 'Input width (k)'}
          <select value={input} onChange={event => changeWidth(Number(event.target.value), setInput)}>
            {widths.map(width => <option key={width} value={width}>{format.format(width)}</option>)}
          </select>
        </label>
        <label>{ko ? '출력 폭 (d)' : 'Output width (d)'}
          <select value={output} onChange={event => changeWidth(Number(event.target.value), setOutput)}>
            {widths.map(width => <option key={width} value={width}>{format.format(width)}</option>)}
          </select>
        </label>
        <label>{ko ? '랭크' : 'Rank'} (r) · {rank}
          <input type="range" value={rank} min={1} max={maxRank} step={1}
            onChange={event => setRank(Number(event.target.value))} />
        </label>
      </fieldset>
      <noscript><p>{ko ? '아래는 기본 설정의 값입니다. 입력을 바꾸려면 JavaScript를 켜세요.' : 'The default calculation is shown below. Enable JavaScript to change the inputs.'}</p></noscript>
      <dl className="lora-matrices">
        <div><dt>{ko ? '전체 가중치 W' : 'Full weight W'}</dt><dd>{format.format(output)} × {format.format(input)}<strong>{format.format(full)}</strong></dd></div>
        <div><dt>{ko ? '입력을 줄이는 A' : 'Input factor A'}</dt><dd>{format.format(rank)} × {format.format(input)}<strong>{format.format(a)}</strong></dd></div>
        <div><dt>{ko ? '출력을 만드는 B' : 'Output factor B'}</dt><dd>{format.format(output)} × {format.format(rank)}<strong>{format.format(b)}</strong></dd></div>
      </dl>
      <p className="lora-total" role="status">
        {ko ? <>A와 B의 학습 파라미터는 <strong>{format.format(a + b)}개</strong>입니다. W 전체 파라미터의 <strong>{percent}</strong>에 해당합니다.</>
          : <>A and B train <strong>{format.format(a + b)} parameters</strong>, or <strong>{percent}</strong> of the count for training W.</>}
      </p>
      <p>{ko ? '한 층의 가중치만 셉니다. 고정한 편향과 학습 중 보관하는 활성값은 집계에서 제외합니다.' : 'Counts cover one weight matrix. The frozen bias and the activations kept for training are excluded.'}</p>
    </section>
  );
}
