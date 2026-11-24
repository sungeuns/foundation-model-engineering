import { useEffect, useId, useState } from 'react';
import { kvCalculatorTitle } from '../../data/lab-titles.js';
import { availableBytes, GiB, kvCapacity } from './kv-capacity.mjs';
import {
  completeBytePairs, defaultBudget, defaultPool, defaultWorkload, inWorkloadRange, kvScenarioSearch, netBudgetBytes,
  nineRequestWorkload, precisions, readKvScenario, smolPaddedWorkload, validWorkload, workloadRanges,
} from './kv-scenario.mjs';
import './kv_cache.css';

type IntegerControl = keyof typeof workloadRanges;

export default function KVCacheCalculator({ lang = 'en' }: { lang?: 'en' | 'ko' }) {
  const id = useId();
  const [ready, setReady] = useState(false);
  const [workload, setWorkload] = useState(defaultWorkload);
  const [budget, setBudget] = useState(defaultBudget);
  const [deduct, setDeduct] = useState(false);
  const [pool, setPool] = useState(defaultPool);
  const [invalidLink, setInvalidLink] = useState(false);
  useEffect(() => {
    let lastSearch = window.location.search;
    function restore() {
      lastSearch = window.location.search;
      const params = new URLSearchParams(window.location.search);
      const scenario = readKvScenario(params);
      setWorkload(scenario?.workload ?? defaultWorkload);
      setBudget(scenario?.budget ?? defaultBudget);
      setDeduct(scenario?.deduct ?? false);
      setPool(scenario?.pool ?? defaultPool);
      setInvalidLink(params.has('kv') && !scenario);
      setReady(true);
    }
    restore();
    // A bfcache entry can contain unsaved slider edits made after opening a link.
    const onPageShow = (event: PageTransitionEvent) => { if (event.persisted) restore(); };
    const onPopState = () => { if (window.location.search !== lastSearch) restore(); };
    window.addEventListener('pageshow', onPageShow);
    window.addEventListener('popstate', onPopState);
    return () => {
      window.removeEventListener('pageshow', onPageShow);
      window.removeEventListener('popstate', onPopState);
    };
  }, []);
  const t = (en: string, ko: string) => lang === 'ko' ? ko : en;
  const number = (n: number) => n.toLocaleString(lang === 'ko' ? 'ko-KR' : 'en-US', { maximumFractionDigits: 3 });
  const memory = (bytes: number, unitFrom = bytes) => {
    if (bytes === 0) return '0 GiB';
    for (const [unit, size] of [['GiB', GiB], ['MiB', 2 ** 20], ['KiB', 2 ** 10]] as const) {
      if (unitFrom >= size) return number(bytes / size) + ' ' + unit;
    }
    return number(bytes) + ' B';
  };
  const update = (key: keyof typeof defaultWorkload, value: number) => setWorkload(prev => ({ ...prev, [key]: value }));
  const available = deduct ? availableBytes([pool.total, pool.weights, pool.reserve]) : netBudgetBytes(budget);
  const result = validWorkload(workload) ? kvCapacity(workload, available) : null;
  const search = kvScenarioSearch({ workload, budget, deduct, pool });
  function loadExample(example: typeof defaultWorkload) {
    setWorkload(example);
    setBudget(defaultBudget);
    setDeduct(false);
    setInvalidLink(false);
  }

  function slider(key: IntegerControl, label: string) {
    return <div className="kv-input-group">
      <label htmlFor={id + key}>{label}: {number(workload[key])}</label>
      <input id={id + key} data-kv={key} type="range" {...workloadRanges[key]}
        value={workload[key]} onChange={e => update(key, Number(e.target.value))} />
    </div>;
  }
  function integer(key: IntegerControl, label: string) {
    const range = workloadRanges[key];
    const inRange = inWorkloadRange(workload[key], range);
    const valid = inRange && (key !== 'dimension' || completeBytePairs(workload));
    return <div className="kv-input-group">
      <label htmlFor={id + key}>{label}</label>
      <input id={id + key} data-kv={key} type="number" inputMode="numeric" required {...range} step="1"
        value={Number.isFinite(workload[key]) ? workload[key] : ''} aria-invalid={!valid}
        aria-describedby={valid ? undefined : id + key + '-error'}
        onChange={e => update(key, e.currentTarget.valueAsNumber)} />
      {!valid && <small id={id + key + '-error'} className="kv-field-error">{inRange
        ? t('This calculator packs each INT4 vector in pairs. Enter an even head dimension.', '이 계산기는 INT4 벡터 안에서 두 값을 1바이트에 묶습니다. 헤드 차원에 짝수를 입력하세요.')
        : t(
        `Enter a whole number from ${number(range.min)} to ${number(range.max)}.`,
        `${number(range.min)}~${number(range.max)} 사이의 정수를 입력하세요.`,
      )}</small>}
    </div>;
  }
  function allowance(key: keyof typeof pool, label: string) {
    return <div className="kv-input-group">
      <label htmlFor={id + key}>{label} (GiB)</label>
      <input id={id + key} data-kv={key} type="number" inputMode="decimal" min="0" step="any" value={pool[key]}
        onChange={e => setPool({ ...pool, [key]: e.target.value })} />
    </div>;
  }

  const units = t('bytes/value','바이트/값');
  const precisionLabels: Record<number, string> = { 4: 'FP32', 2: 'FP16/BF16', 1: 'FP8', 0.5: 'INT4' };
  return <section id="kv-calculator" className="kv-calculator-container" aria-labelledby={id + '-title'}>
    <h3 className="kv-title" id={id + '-title'}>{kvCalculatorTitle[lang]}</h3>
    <p className="kv-desc">{t('Compare dense KV payload at prefill and at the output limit. Enter the stored prompt width for each row. For a padded batch this includes padding positions.', '프롬프트 처리 직후와 출력 한도에 도달했을 때의 KV 캐시 용량을 비교합니다. 행마다 실제 저장한 프롬프트 길이를 입력하세요. 패딩한 배치에서는 패딩 자리도 셉니다.')}</p>
    {invalidLink && <p role="status">{t('The shared settings could not be read. The calculator opened with its defaults.', '공유 링크의 설정을 읽을 수 없어 기본값으로 계산기를 열었습니다.')}</p>}
    <fieldset className="kv-controls" disabled={!ready} onChange={() => setInvalidLink(false)}>
      <legend className="kv-sr-only">{t('Capacity inputs','용량 계산 입력')}</legend>
      <div className="kv-examples">
        <button type="button" className="kv-example-button" onClick={() => loadExample(nineRequestWorkload)}>{t('Load the nine-request example','요청 9개 예제 불러오기')}</button>
        <button type="button" className="kv-example-button" onClick={() => loadExample(smolPaddedWorkload)}>{t('Load the SmolLM2-135M padded batch','SmolLM2-135M 패딩 배치 불러오기')}</button>
      </div>
      <p className="kv-desc"><a href="#kv-batch-padding">{t('SmolLM2-135M CPU measurement','SmolLM2-135M CPU 실측')}</a>{t(' (2026-11-25). The FP32 batch stored the 3- and 11-token prompts at width 11, then added four positions per row. The 24 GiB budget is illustrative.', ' (2026-11-25). 길이가 3과 11인 프롬프트를 FP32 배치의 각 행에 11자리씩 저장한 뒤 4자리씩 더했습니다. 24 GiB는 계산용 예산입니다.')}</p>
      <div className="kv-grid">
        {slider('batch',t('Concurrent sequences (B)','동시 시퀀스 수 (B)'))}
        {integer('sequence',t('Stored prompt positions per sequence','시퀀스당 저장한 프롬프트 길이'))}
        {integer('generated',t('Additional tokens allowed per sequence','시퀀스당 허용할 추가 토큰'))}
        {slider('layers',t('Transformer layers (L)','트랜스포머 층 수 (L)'))}
        {integer('heads',t('KV heads per layer','층당 KV 헤드 수'))}
        {integer('dimension',t('Head dimension','헤드 차원'))}
        <div className="kv-input-group">
          <label htmlFor={id + 'precision'}>{t('Cache precision','캐시 정밀도')}</label>
          <select id={id + 'precision'} data-kv="precision" value={workload.precision} onChange={e => update('precision', Number(e.target.value))}>
            {precisions.map(n => <option key={n} value={n}>{precisionLabels[n]} ({n} {units})</option>)}
          </select>
        </div>
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
        </div> : <div className="kv-input-group"><label htmlFor={id + '-budget'}>{t('Memory reserved only for KV cache','KV 캐시 전용 예산')} (GiB)</label>
          <input id={id + '-budget'} data-kv="budget" type="number" inputMode="decimal" step="any" min={1 / GiB} required
            value={Number.isFinite(budget) ? budget : ''} aria-invalid={available === null}
            aria-describedby={available === null ? id + '-budget-error' : undefined}
            onChange={e => setBudget(e.currentTarget.valueAsNumber)} />
          {available === null && <small className="kv-field-error" id={id + '-budget-error'}>{t('Enter at least 1 byte and less than 8 PiB, in GiB.','1바이트 이상, 8 PiB 미만인 용량을 GiB 단위로 입력하세요.')}</small>}</div>}
        <p className="kv-desc">{deduct
          ? t('Use one pool for all three values. Include activations, workspace, allocator costs and safety margin in other reservations. The starting figures are an arithmetic example.', '세 숫자 모두 같은 메모리 풀을 기준으로 입력하세요. 기타 예약분에는 활성값, 작업 공간, 할당기 비용, 안전 여유분을 넣습니다. 처음 표시되는 숫자는 계산 예시입니다.')
          : t('Enter the pool left after weights and other runtime memory. For example, 120 MiB is 0.1171875 GiB. Capacity uses whole available bytes.', '가중치와 다른 실행 비용을 빼고 남은 용량을 입력하세요. 예를 들어 120 MiB는 0.1171875 GiB입니다. 용량은 1바이트 단위로 계산합니다.')}</p>
      </div>
    </fieldset>
    <noscript><p>{t('The default calculation is shown below. Enable JavaScript to load shared settings or change the inputs.','아래는 기본 설정의 계산 결과입니다. 공유된 설정을 불러오거나 입력값을 바꾸려면 JavaScript를 켜세요.')}</p></noscript>
    <div className="kv-result" aria-live="polite">
      <h4>{t('Requested dense KV payload','요청 전체의 KV 캐시 용량')}</h4>
      {available === null ? <p>{t('Complete the memory budget to calculate concurrent capacity.', '동시에 담을 수 있는 요청 수를 계산하려면 메모리 예산을 입력하세요.')}</p>
        : <p>{t('Space available for KV','KV에 남은 공간')} <strong data-kv-result="budget">{memory(Math.max(0,available))}</strong>
          {available < 0 && <> · {t('Fixed reservations exceed total memory by','예약분이 전체 메모리를 초과한 크기')} {memory(-available)}</>}</p>}
      {result ? <><div className="kv-summary">{([
        ['prompt', t('At prompt length','프롬프트를 캐시했을 때'), result.prompt],
        ['peak', t('At maximum length','출력 한도까지 캐시했을 때'), result.peak],
      ] as const).map(([stage, title, row]) => <div key={stage} className="kv-stage">
        <h5>{title}</h5>
        <p>{t(`${number(row.tokens)} stored positions per request`, `요청당 ${number(row.tokens)}자리 저장`)}</p>
        <strong className="kv-size-display" data-kv-result={stage + '-total'}>{memory(row.requested, result.prompt.requested)}</strong>
        <p>{t('Per sequence','시퀀스당')} <b data-kv-result={stage === 'peak' ? 'per-sequence' : 'prompt-per-sequence'}>{memory(row.perSequence)}</b></p>
        <p>{t('Max concurrent requests','동시에 담을 수 있는 최대 요청 수')} <b data-kv-result={stage === 'peak' ? 'capacity' : 'prompt-capacity'}>{row.capacity === null ? '—' : number(row.capacity)}</b></p>
        {row.balance !== null && available !== null && available >= 0 && <p className={'kv-budget-status' + (row.balance < 0 ? ' is-over' : '')}>
          {memory(Math.abs(row.balance))} {row.balance < 0 ? t('over budget','초과') : t('remaining','남음')}</p>}
      </div>)}</div>
      <p className="kv-formula-text">{t('At maximum length','최대 길이에서')} · 2 × {number(workload.batch)} × {number(result.peak.tokens)} × {workload.layers} × {workload.heads} × {workload.dimension} × {workload.precision} {t('bytes','바이트')}</p></>
        : <p>{t('Complete the highlighted fields to calculate KV payload.', '표시된 입력값을 확인하면 KV 캐시 용량을 계산할 수 있습니다.')}</p>}
    </div>
    {ready && search && <p className="kv-share"><a href={search + '#kv-calculator'}>{t('Link to these calculator settings', '이 계산 설정의 고유 링크')}</a></p>}
    {result && <div className="kv-comparison"><h4>{t('What if a model with 64 query heads shares KV heads?', '질의 헤드 64개가 KV 헤드를 공유하면?')}</h4>{[64,8,1].map(heads => <div className="kv-comparison-row" key={heads}>
      <span>{heads} KV</span><div className="kv-comparison-track" aria-hidden="true"><span style={{ width: `${heads / 64 * 100}%` }} /></div><strong>{memory(result.peak.requested / workload.heads * heads)}</strong>
    </div>)}<p className="kv-desc">{t('At the same batch size, length, layer count, head dimension and precision, these hypothetical models use 64 KV heads (MHA), 8 (GQA) or 1 (MQA). A checkpoint fixes its head layout.', '배치 크기·길이·층 수·헤드 차원·정밀도가 같은 가상의 모델 세 개를 비교합니다. 질의 헤드가 64개일 때는 KV 헤드 64개가 MHA, 8개가 GQA, 1개가 MQA입니다. 실제 헤드 구성은 체크포인트가 결정합니다.')}</p></div>}
    <p className="kv-desc kv-limitations">{t('These counts assume a dense, unshared payload. A serving engine may allocate whole blocks, share prefixes or store quantization scales. For sharded deployments, calculate each device separately with its actual layers, local or replicated heads, and memory budget.', '조밀한 데이터를 공유 없이 저장할 때의 수치입니다. 실제 엔진은 블록 단위로 공간을 잡고 접두사를 공유하거나 양자화 스케일을 저장할 수 있습니다. 샤딩 배포는 장치마다 실제로 배치된 층과 로컬·복제 헤드 수, 메모리 예산을 따로 계산해야 합니다.')}</p>
  </section>;
}
