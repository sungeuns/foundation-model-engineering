import React, { useMemo, useState } from 'react';
import './kv_cache.css';

type Props = {
  lang?: 'en' | 'ko';
};

const copy = {
  en: {
    title: 'KV cache capacity calculator',
    description: 'Estimate the dense cache payload. Allocator metadata, padding, temporary buffers, and tensor-parallel replication are not included.',
    batch: 'Concurrent sequences',
    sequence: 'Cached tokens per sequence',
    layers: 'Transformer layers',
    heads: 'KV heads',
    dimension: 'Head dimension',
    precision: 'Cache precision',
    result: 'Dense KV payload',
    bytes: 'B/value',
    mha: 'MHA-sized example',
    gqa: 'GQA-sized example',
    mqa: 'MQA-sized example',
    note: 'Capacity estimate only: benchmark latency and quality on the actual model and serving engine.',
  },
  ko: {
    title: 'KV cache 용량 계산기',
    description: '조밀한 cache payload를 추정합니다. allocator metadata, padding, 임시 buffer, tensor-parallel 복제 비용은 포함하지 않습니다.',
    batch: '동시 sequence 수',
    sequence: 'Sequence당 cache token',
    layers: 'Transformer layer',
    heads: 'KV head',
    dimension: 'Head dimension',
    precision: 'Cache precision',
    result: '조밀한 KV payload',
    bytes: 'B/value',
    mha: 'MHA 규모 예시',
    gqa: 'GQA 규모 예시',
    mqa: 'MQA 규모 예시',
    note: '용량 추정치일 뿐입니다. 실제 모델과 serving engine에서 latency와 품질을 benchmark해야 합니다.',
  },
};

const KVCacheCalculator: React.FC<Props> = ({ lang = 'en' }) => {
  const [batchSize, setBatchSize] = useState<number>(32);
  const [seqLength, setSeqLength] = useState<number>(8192);
  const [layers, setLayers] = useState<number>(80);
  const [kvHeads, setKvHeads] = useState<number>(8); // Default to GQA (e.g., Llama 3 70B uses 8 KV heads)
  const [headDim, setHeadDim] = useState<number>(128);
  const [precision, setPrecision] = useState<number>(2);
  const t = copy[lang];
  const cacheSizeGiB = useMemo(
    () => (2 * batchSize * seqLength * layers * kvHeads * headDim * precision) / (1024 ** 3),
    [batchSize, seqLength, layers, kvHeads, headDim, precision],
  );

  return (
    <div className="kv-calculator-container">
      <h3 className="kv-title">{t.title}</h3>
      <p className="kv-desc">{t.description}</p>
      
      <div className="kv-grid">
        <div className="kv-input-group">
          <label htmlFor="kv-batch">{t.batch} (B): {batchSize}</label>
          <input id="kv-batch" type="range" min="1" max="256" value={batchSize} onChange={(e) => setBatchSize(Number(e.target.value))} />
        </div>
        
        <div className="kv-input-group">
          <label htmlFor="kv-sequence">{t.sequence} (S): {seqLength.toLocaleString()}</label>
          <input id="kv-sequence" type="range" min="512" max="131072" step="512" value={seqLength} onChange={(e) => setSeqLength(Number(e.target.value))} />
        </div>

        <div className="kv-input-group">
          <label htmlFor="kv-layers">{t.layers} (L): {layers}</label>
          <input id="kv-layers" type="range" min="12" max="120" value={layers} onChange={(e) => setLayers(Number(e.target.value))} />
        </div>

        <div className="kv-input-group">
          <label htmlFor="kv-heads">{t.heads} (H_KV): {kvHeads}</label>
          <select id="kv-heads" value={kvHeads} onChange={(e) => setKvHeads(Number(e.target.value))}>
            <option value="64">64 ({t.mha})</option>
            <option value="8">8 ({t.gqa})</option>
            <option value="1">1 ({t.mqa})</option>
          </select>
        </div>

        <div className="kv-input-group">
          <label htmlFor="kv-dimension">{t.dimension} (d_h): {headDim}</label>
          <select id="kv-dimension" value={headDim} onChange={(e) => setHeadDim(Number(e.target.value))}>
            <option value="64">64</option>
            <option value="128">128</option>
            <option value="256">256</option>
          </select>
        </div>

        <div className="kv-input-group">
          <label htmlFor="kv-precision">{t.precision} (p): {precision} {t.bytes}</label>
          <select id="kv-precision" value={precision} onChange={(e) => setPrecision(Number(e.target.value))}>
            <option value="4">FP32 (4 {t.bytes})</option>
            <option value="2">FP16/BF16 (2 {t.bytes})</option>
            <option value="1">FP8 (1 {t.bytes})</option>
            <option value="0.5">INT4 (0.5 {t.bytes})</option>
          </select>
        </div>
      </div>

      <div className="kv-result">
        <h4>{t.result}:</h4>
        <div className="kv-size-display">
          {cacheSizeGiB.toFixed(2)} GiB
        </div>
        <p className="kv-formula-text">
          {2 + ' × ' + batchSize + ' × ' + seqLength + ' × ' + layers + ' × ' + kvHeads + ' × ' + headDim + ' × ' + precision + ' bytes'}
        </p>
        <p className="kv-desc">{t.note}</p>
      </div>
    </div>
  );
};

export default KVCacheCalculator;
