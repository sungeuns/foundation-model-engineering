import { useEffect, useState } from 'react';
import './linear-attention-memory.css';

const layers = 32;
const recurrentHeads = 32;
const width = 128;
const kvElementBytes = 2;
const maxLength = 131072;

function formatMemory(bytes: number) {
  if (bytes >= 2 ** 30) return `${(bytes / 2 ** 30).toFixed(2)} GiB`;
  return `${(bytes / 2 ** 20).toFixed(2)} MiB`;
}

export default function LinearAttentionVisualizer({ lang = 'en' }: { lang?: 'en' | 'ko' }) {
  const ko = lang === 'ko';
  const [lengthInput, setLengthInput] = useState('128');
  const [kvHeads, setKvHeads] = useState(8);
  const [stateBytes, setStateBytes] = useState(4);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  const length = Number(lengthInput);
  const valid = Number.isInteger(length) && length >= 1 && length <= maxLength;
  const bytesPerToken = 2 * layers * kvHeads * width * kvElementBytes;
  const state = layers * recurrentHeads * (width * width + width) * stateBytes;
  const crossover = state / bytesPerToken;
  const kv = length * bytesPerToken;
  const largest = Math.max(kv, state);

  return <section className="linear-memory">
    <h3>{ko ? '문맥을 저장하는 데 몇 바이트가 들까?' : 'How many bytes store the context?'}</h3>
    <p>{ko
      ? '한 요청을 처리하는 두 가지 가상 구조를 비교합니다. 각각 32층이고 쿼리 또는 순환 헤드는 층마다 32개입니다. 헤드 폭과 특징 폭은 모두 128입니다. KV는 원소당 2바이트이고, 순환 상태에는 정규화 벡터 z도 포함됩니다.'
      : 'Compare two hypothetical 32-layer stacks for one request. Each layer has 32 query or recurrent heads. Both the head width and the feature width are 128. KV uses two bytes per element. Recurrent state includes the normalizer z.'}</p>
    <fieldset disabled={!ready} aria-label={ko ? '메모리 계산 조건' : 'Memory calculation inputs'}>
      <label>{ko ? '문맥 길이 (토큰)' : 'Context length (tokens)'}
        <input type="number" min={1} max={maxLength} step={1} value={lengthInput}
          aria-invalid={!valid} onChange={e => setLengthInput(e.target.value)} />
      </label>
      <label>{ko ? 'KV 헤드 수' : 'KV heads'}
        <select value={kvHeads} onChange={e => setKvHeads(Number(e.target.value))}>
          <option value={8}>8 (GQA)</option><option value={32}>32 (MHA)</option>
        </select>
      </label>
      <label>{ko ? '순환 상태 정밀도' : 'Recurrent-state precision'}
        <select value={stateBytes} onChange={e => setStateBytes(Number(e.target.value))}>
          <option value={4}>FP32</option><option value={2}>BF16 / FP16</option>
        </select>
      </label>
    </fieldset>
    <div aria-live="polite" aria-atomic="true">
      {valid ? <>
        <dl>{[
          { label: ko ? '어텐션 KV 캐시' : 'Attention KV cache', bytes: kv },
          { label: ko ? '순환 상태 S + z' : 'Recurrent state S + z', bytes: state },
        ].map(row => <div key={row.label}>
          <dt>{row.label}</dt>
          <dd>{formatMemory(row.bytes)}</dd>
          <dd className="linear-memory-track" aria-hidden="true">
            <span style={{ width: `${100 * row.bytes / largest}%` }} />
          </dd>
        </div>)}</dl>
        <p>{ko
          ? `이 설정에서 KV 캐시는 토큰당 ${bytesPerToken / 1024} KiB씩 늘어납니다. 순환 상태와 같은 크기가 되는 계산상의 길이는 ${crossover}토큰입니다.`
          : `KV grows by ${bytesPerToken / 1024} KiB per token. The two payloads cross at ${crossover} tokens with these settings.`}
          {' '}{!Number.isInteger(crossover) && (ko
            ? `따라서 ${Math.floor(crossover)}토큰에서는 KV가 더 작고 ${Math.ceil(crossover)}토큰에서는 더 큽니다.`
            : `KV is smaller at ${Math.floor(crossover)} tokens and larger at ${Math.ceil(crossover)}.`)}</p>
      </> : <p>{ko ? '1부터 131,072 사이의 정수를 입력하세요.' : 'Enter a whole number from 1 through 131,072.'}</p>}
    </div>
    <p className="linear-memory-note">{ko
      ? '두 막대는 같은 눈금을 쓰며 긴 쪽이 가로 폭을 채웁니다. 값은 텐서 원소 수에 자료형 크기를 곱한 것입니다. 가중치, 활성값, 작업 버퍼와 메타데이터는 별도로 계산해야 합니다.'
      : 'The bars share a scale. The larger payload fills the track. Each value counts tensor elements at the stated precision. Weights, activations, workspace and metadata have separate costs.'}</p>
  </section>;
}
