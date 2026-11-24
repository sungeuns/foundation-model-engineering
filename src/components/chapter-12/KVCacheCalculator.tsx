import { useEffect, useId, useState } from 'react';
import { availableBytes, GiB, kvCapacity } from './kv-capacity.mjs';
import './kv_cache.css';

const initial = { batch: 32, sequence: 8192, generated: 0, layers: 80, heads: 8, dimension: 128, precision: 2 };
type Control = keyof typeof initial;

export default function KVCacheCalculator({ lang = 'en' }: { lang?: 'en' | 'ko' }) {
  const id = useId();
  const [ready, setReady] = useState(false);
  const [workload, setWorkload] = useState(initial);
  const [budget, setBudget] = useState(24);
  const [deduct, setDeduct] = useState(false);
  const [pool, setPool] = useState({ total: '80', weights: '48', reserve: '8' });
  useEffect(() => setReady(true), []);
  const t = (en: string, ko: string) => lang === 'ko' ? ko : en;
  const number = (n: number) => n.toLocaleString(lang === 'ko' ? 'ko-KR' : 'en-US', { maximumFractionDigits: 3 });
  const memory = (bytes: number) => {
    if (bytes === 0) return '0 GiB';
    for (const [unit, size] of [['GiB', GiB], ['MiB', 2 ** 20], ['KiB', 2 ** 10]] as const) {
      if (bytes >= size) return number(bytes / size) + ' ' + unit;
    }
    return number(bytes) + ' B';
  };
  const update = (key: Control, value: number) => setWorkload(prev => ({ ...prev, [key]: value }));
  const available = deduct ? availableBytes([pool.total, pool.weights, pool.reserve]) : budget * GiB;
  const { prompt, peak } = kvCapacity(workload, available);
  function workedExample() {
    setWorkload({ ...initial, batch: 9, generated: 2048 });
    setBudget(24);
    setDeduct(false);
  }

  function slider(key: Control, label: string, min: number, max: number, step = 1) {
    return <div className="kv-input-group">
      <label htmlFor={id + key}>{label}: {number(workload[key])}</label>
      <input id={id + key} data-kv={key} type="range" min={min} max={max} step={step}
        value={workload[key]} onChange={e => update(key, Number(e.target.value))} />
    </div>;
  }
  function select(key: Control, label: string, choices: [number, string][]) {
    return <div className="kv-input-group">
      <label htmlFor={id + key}>{label}</label>
      <select id={id + key} data-kv={key} value={workload[key]} onChange={e => update(key, Number(e.target.value))}>
        {choices.map(([n, text]) => <option key={n} value={n}>{text}</option>)}
      </select>
    </div>;
  }
  function allowance(key: keyof typeof pool, label: string) {
    return <div className="kv-input-group">
      <label htmlFor={id + key}>{label} (GiB)</label>
      <input id={id + key} data-kv={key} type="number" min="0" step="any" value={pool[key]}
        onChange={e => setPool({ ...pool, [key]: e.target.value })} />
    </div>;
  }

  const units = t('bytes/value','바이트/값');
  return <section className="kv-calculator-container" aria-labelledby={id + '-title'}>
    <h3 className="kv-title" id={id + '-title'}>{t('Will the requests still fit after generation?', '출력까지 생성해도 요청이 모두 들어갈까요?')}</h3>
    <p className="kv-desc">{t('Compare the payload for the prompts with the payload when every request reaches its output limit. All requests use the same lengths and the same hypothetical cache layout.', '프롬프트만 저장한 경우와 모든 요청이 출력 한도까지 자란 경우를 비교합니다. 요청마다 길이가 같고 동일한 가상의 캐시 구조를 쓴다고 가정합니다.')}</p>
    <fieldset className="kv-controls" disabled={!ready}>
      <legend className="kv-sr-only">{t('Capacity inputs','용량 계산 입력')}</legend>
      <button type="button" className="kv-example-button" onClick={workedExample}>{t('Load the nine-request example','요청 9개 예제 불러오기')}</button>
      <div className="kv-grid">
        {slider('batch',t('Concurrent sequences (B)','동시 시퀀스 수 (B)'),1,256)}
        {slider('sequence',t('Cached prompt tokens per sequence','시퀀스당 캐시한 프롬프트 토큰'),512,131072,512)}
        {slider('generated',t('Additional tokens allowed per sequence','시퀀스당 허용할 추가 토큰'),0,32768,128)}
        {slider('layers',t('Transformer layers (L)','트랜스포머 층 수 (L)'),1,120)}
        {select('heads',t('KV heads','KV 헤드 수'),[[64,'64 (MHA)'],[32,'32 (GQA)'],[16,'16 (GQA)'],[8,'8 (GQA)'],[4,'4 (GQA)'],[2,'2 (GQA)'],[1,'1 (MQA)']])}
        {select('dimension',t('Head dimension','헤드 차원'),[[64,'64'],[128,'128'],[256,'256']])}
        {select('precision',t('Cache precision','캐시 정밀도'),[[4,`FP32 (4 ${units})`],[2,`FP16/BF16 (2 ${units})`],[1,`FP8 (1 ${units})`],[0.5,`INT4 (0.5 ${units})`]])}
      </div>
      <div className="kv-budget-control">
        <div className="kv-input-group"><label htmlFor={id + '-mode'}>{t('How is the memory budget specified?','메모리 예산을 어떻게 입력할까요?')}</label>
          <select id={id + '-mode'} data-kv="mode" value={deduct ? 'total' : 'net'} onChange={e => setDeduct(e.target.value === 'total')}>
            <option value="net">{t('KV budget after reservations','예약분을 뺀 KV 예산')}</option>
            <option value="total">{t('Subtract from total memory','전체 메모리에서 차감')}</option>
          </select></div>
        {deduct ? <div className="kv-allowances">
          {allowance('total', t('Total memory','전체 메모리'))}
          {allowance('weights', t('Model weights','모델 가중치'))}
          {allowance('reserve', t('Other reserved memory','기타 예약 메모리'))}
        </div> : <div className="kv-input-group"><label htmlFor={id + '-budget'}>{t('Memory reserved only for KV cache','KV 캐시 전용 예산')}: {number(budget)} GiB</label>
          <input id={id + '-budget'} data-kv="budget" type="range" min="1" max="128" value={budget} onChange={e => setBudget(Number(e.target.value))} /></div>}
        <p className="kv-desc">{deduct
          ? t('Use one pool for all three values. Include activations, workspace, allocator costs and safety margin in other reservations. The starting figures are an arithmetic example.', '세 숫자 모두 같은 메모리 풀을 기준으로 입력하세요. 기타 예약분에는 활성값, 작업 공간, 할당기 비용, 안전 여유분을 넣습니다. 처음 표시되는 숫자는 계산 예시입니다.')
          : t('Enter the pool left after paying for model weights and other runtime memory.', '모델 가중치와 다른 실행 비용을 빼고 남은 공간을 입력하세요.')}</p>
      </div>
    </fieldset>
    <noscript><p>{t('The default calculation is shown below. Enable JavaScript to change the inputs.','아래에는 기본 설정의 계산 결과가 표시됩니다. 입력값을 바꾸려면 JavaScript를 켜세요.')}</p></noscript>
    <div className="kv-result" aria-live="polite">
      <h4>{t('Requested dense KV payload','요청 전체의 KV 캐시 용량')}</h4>
      {available === null ? <p>{t('Enter a nonnegative number for each memory amount to calculate capacity.', '용량을 계산하려면 세 메모리 항목에 각각 0 이상의 값을 입력하세요.')}</p>
        : <p>{t('Space available for KV','KV에 남은 공간')} <strong data-kv-result="budget">{memory(Math.max(0,available))}</strong>
          {available < 0 && <> · {t('Fixed reservations exceed total memory by','예약분이 전체 메모리를 초과한 크기')} {memory(-available)}</>}</p>}
      <div className="kv-summary">{([
        ['prompt', t('At prompt length','프롬프트를 캐시했을 때'), prompt],
        ['peak', t('At maximum length','출력 한도까지 캐시했을 때'), peak],
      ] as const).map(([stage, title, row]) => <div key={stage} className="kv-stage">
        <h5>{title}</h5>
        <p>{number(row.tokens)} {t('tokens per request','토큰/요청')}</p>
        <strong className="kv-size-display" data-kv-result={stage + '-total'}>{memory(row.requested)}</strong>
        <p>{t('Per sequence','시퀀스당')} <b data-kv-result={stage === 'peak' ? 'per-sequence' : 'prompt-per-sequence'}>{memory(row.perSequence)}</b></p>
        <p>{t('Sequences within budget','들어가는 시퀀스 수')} <b data-kv-result={stage === 'peak' ? 'capacity' : 'prompt-capacity'}>{row.capacity === null ? '—' : number(row.capacity)}</b></p>
        {row.balance !== null && available !== null && available >= 0 && <p className={'kv-budget-status' + (row.balance < 0 ? ' is-over' : '')}>
          {memory(Math.abs(row.balance))} {row.balance < 0 ? t('over budget','초과') : t('remaining','남음')}</p>}
      </div>)}</div>
      <p className="kv-formula-text">{t('At maximum length','최대 길이에서')} · 2 × {number(workload.batch)} × {number(peak.tokens)} × {workload.layers} × {workload.heads} × {workload.dimension} × {workload.precision} {t('bytes','바이트')}</p>
    </div>
    <div className="kv-comparison"><h4>{t('Same maximum length, different KV head counts','최대 길이는 같고 KV 헤드 수만 다를 때')}</h4>{[64,8,1].map(heads => <div className="kv-comparison-row" key={heads}>
      <span>{heads} {t('heads','헤드')}</span><div className="kv-comparison-track" aria-hidden="true"><span style={{ width: `${heads / 64 * 100}%` }} /></div><strong>{memory(peak.requested / workload.heads * heads)}</strong>
    </div>)}<p className="kv-desc">{t('These three architectures assume 64 query heads. Changing the number of KV heads requires a compatible model.', '세 구조 모두 질의 헤드 64개를 가정합니다. KV 헤드 수를 바꾸려면 해당 구조를 지원하는 모델이 필요합니다.')}</p></div>
    <p className="kv-desc kv-limitations">{t('These counts assume a dense, unshared payload. A serving engine may allocate whole blocks, share prefixes or store quantization scales. For sharded deployments, calculate each device separately with its actual layers, local or replicated heads, and memory budget.', '조밀한 데이터를 공유 없이 저장할 때의 수치입니다. 실제 엔진은 블록 단위로 공간을 잡고 접두사를 공유하거나 양자화 스케일을 저장할 수 있습니다. 샤딩 배포는 장치마다 실제로 배치된 층과 로컬·복제 헤드 수, 메모리 예산을 따로 계산해야 합니다.')}</p>
  </section>;
}
