import React, { useId, useState } from 'react';
import './kv_cache.css';

type Props = { lang?: 'en' | 'ko' };
const copy = {
  en: {
    title: 'How many requests fit in the KV cache?',
    description: 'Change context length, concurrency, and KV heads to see which term consumes your memory budget. These are hypothetical configurations, not model presets.',
    batch: 'Concurrent sequences', sequence: 'Cached tokens per sequence', layers: 'Transformer layers', heads: 'KV heads', dimension: 'Head dimension', precision: 'Cache precision', budget: 'Memory reserved only for KV cache',
    result: 'Requested dense KV payload', perSequence: 'Per sequence', fit: 'Sequences within budget', bytes: 'bytes/value', mha: 'MHA-sized example', gqa: 'GQA-sized example', mqa: 'MQA-sized example',
    note: 'Dense payload only: budget excludes model weights, activations, workspace, allocator overhead, quantization metadata, and tensor-parallel replication. This is not a GPU-fit or latency prediction; a serving engine must reserve additional headroom.',
    comparison: 'Same workload, different KV head counts', compareNote: 'Only KV heads change in this comparison. Changing a trained model’s attention structure requires a compatible model; it is not a free serving switch.',
    budgetNote: 'Set this after reserving memory for weights and all other runtime costs. Capacity assumes every request reaches the selected cached length.',
  },
  ko: {
    title: 'KV 캐시에 요청을 몇 개까지 넣을 수 있을까요?',
    description: '문맥 길이, 동시 요청 수, KV 헤드 수를 바꾸며 어떤 항이 메모리를 차지하는지 확인하세요. 특정 모델이 아닌 가상의 설정입니다.',
    batch: '동시 시퀀스 수', sequence: '시퀀스당 캐시 토큰 수', layers: '트랜스포머 층 수', heads: 'KV 헤드 수', dimension: '헤드 차원', precision: '캐시 정밀도', budget: 'KV 캐시만을 위해 확보한 메모리',
    result: '요청한 조밀 KV 데이터 크기', perSequence: '시퀀스당 크기', fit: '예산 안에 들어가는 시퀀스 수', bytes: '바이트/값', mha: 'MHA 규모 예시', gqa: 'GQA 규모 예시', mqa: 'MQA 규모 예시',
    note: '조밀한 KV 데이터만 계산합니다. 모델 가중치, 활성값, 작업 공간, 할당기 오버헤드, 양자화 메타데이터, 텐서 병렬 복제 비용은 제외합니다. GPU 수용 여부나 지연 시간의 예측이 아니며, 서빙 엔진에는 추가 여유 메모리가 필요합니다.',
    comparison: '같은 요청에서 KV 헤드 수만 바꾸면', compareNote: '이 비교에서는 KV 헤드 수만 바꿉니다. 학습된 모델의 주의 구조를 바꾸려면 그 구조를 지원하는 모델이 필요하며, 서빙 옵션 하나로 바꿀 수 있는 것이 아닙니다.',
    budgetNote: '가중치와 다른 실행 비용을 제외한 뒤의 메모리를 입력하세요. 모든 요청이 선택한 캐시 길이에 도달한다고 가정합니다.',
  },
};

export default function KVCacheCalculator({ lang = 'en' }: Props) {
  const id = useId();
  const [batchSize, setBatchSize] = useState(32);
  const [seqLength, setSeqLength] = useState(8192);
  const [layers, setLayers] = useState(80);
  const [kvHeads, setKvHeads] = useState(8);
  const [headDim, setHeadDim] = useState(128);
  const [precision, setPrecision] = useState(2);
  const [budget, setBudget] = useState(24);
  const t = copy[lang];
  const ko = lang === 'ko';
  const perSequenceGiB = (2 * seqLength * layers * kvHeads * headDim * precision) / 1024 ** 3;
  const cacheSizeGiB = batchSize * perSequenceGiB;
  const capacity = Math.floor(budget / perSequenceGiB);
  const overBudget = cacheSizeGiB > budget;
  const number = (n: number) => n.toLocaleString(ko ? 'ko-KR' : 'en-US');

  return <section className="kv-calculator-container" aria-labelledby={`${id}-title`}>
    <h3 className="kv-title" id={`${id}-title`}>{t.title}</h3>
    <p className="kv-desc">{t.description}</p>
    <div className="kv-grid">
      <div className="kv-input-group"><label htmlFor={`${id}-batch`}>{t.batch} (B): {batchSize}</label><input id={`${id}-batch`} data-kv="batch" type="range" min="1" max="256" value={batchSize} onChange={e => setBatchSize(Number(e.target.value))} /></div>
      <div className="kv-input-group"><label htmlFor={`${id}-sequence`}>{t.sequence} (S): {number(seqLength)}</label><input id={`${id}-sequence`} data-kv="sequence" type="range" min="512" max="131072" step="512" value={seqLength} onChange={e => setSeqLength(Number(e.target.value))} /></div>
      <div className="kv-input-group"><label htmlFor={`${id}-layers`}>{t.layers} (L): {layers}</label><input id={`${id}-layers`} data-kv="layers" type="range" min="12" max="120" value={layers} onChange={e => setLayers(Number(e.target.value))} /></div>
      <div className="kv-input-group"><label htmlFor={`${id}-heads`}>{t.heads} (H_KV)</label><select id={`${id}-heads`} data-kv="heads" value={kvHeads} onChange={e => setKvHeads(Number(e.target.value))}><option value="64">64 ({t.mha})</option><option value="8">8 ({t.gqa})</option><option value="1">1 ({t.mqa})</option></select></div>
      <div className="kv-input-group"><label htmlFor={`${id}-dimension`}>{t.dimension} (d_h)</label><select id={`${id}-dimension`} data-kv="dimension" value={headDim} onChange={e => setHeadDim(Number(e.target.value))}><option value="64">64</option><option value="128">128</option><option value="256">256</option></select></div>
      <div className="kv-input-group"><label htmlFor={`${id}-precision`}>{t.precision} (p)</label><select id={`${id}-precision`} data-kv="precision" value={precision} onChange={e => setPrecision(Number(e.target.value))}><option value="4">FP32 (4 {t.bytes})</option><option value="2">FP16/BF16 (2 {t.bytes})</option><option value="1">FP8 (1 {t.bytes})</option><option value="0.5">INT4 (0.5 {t.bytes})</option></select></div>
    </div>
    <div className="kv-budget-control kv-input-group"><label htmlFor={`${id}-budget`}>{t.budget}: {budget} GiB</label><input id={`${id}-budget`} data-kv="budget" type="range" min="1" max="128" value={budget} onChange={e => setBudget(Number(e.target.value))} /><p className="kv-desc">{t.budgetNote}</p></div>
    <div className="kv-result" aria-live="polite">
      <h4>{t.result}</h4><div className="kv-size-display">{cacheSizeGiB.toFixed(2)} GiB</div>
      <div className="kv-summary"><div><span>{t.perSequence}</span><strong data-kv-result="per-sequence">{perSequenceGiB.toFixed(3)} GiB</strong></div><div><span>{t.fit}</span><strong data-kv-result="capacity">{number(capacity)}</strong></div></div>
      <p className={`kv-budget-status ${overBudget ? 'is-over' : ''}`}>{overBudget
        ? (ko ? `예산보다 ${(cacheSizeGiB - budget).toFixed(2)} GiB 큽니다. 동시 요청 수나 캐시 길이를 줄여 보세요.` : `${(cacheSizeGiB - budget).toFixed(2)} GiB over budget. Try fewer concurrent requests or a shorter cache.`)
        : (ko ? `KV 데이터 기준으로 ${(budget - cacheSizeGiB).toFixed(2)} GiB가 남습니다.` : `${(budget - cacheSizeGiB).toFixed(2)} GiB remains in the KV payload budget.`)}</p>
      <p className="kv-formula-text">2 × {batchSize} × {number(seqLength)} × {layers} × {kvHeads} × {headDim} × {precision} {ko ? '바이트' : 'bytes'}</p>
    </div>
    <div className="kv-comparison"><h4>{t.comparison}</h4>{[64, 8, 1].map(heads => <div className="kv-comparison-row" key={heads}><span>{heads} {ko ? '헤드' : 'heads'}</span><div className="kv-comparison-track" aria-hidden="true"><span style={{ width: `${heads / 64 * 100}%` }} /></div><strong>{(cacheSizeGiB / kvHeads * heads).toFixed(2)} GiB</strong></div>)}<p className="kv-desc">{t.compareNote}</p></div>
    <p className="kv-desc kv-limitations">{t.note}</p>
  </section>;
}
