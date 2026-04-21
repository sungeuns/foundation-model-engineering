import React, { useState, useEffect } from 'react';
import './kv_cache.css';

const KVCacheCalculator: React.FC = () => {
  const [batchSize, setBatchSize] = useState<number>(32);
  const [seqLength, setSeqLength] = useState<number>(8192);
  const [layers, setLayers] = useState<number>(80);
  const [kvHeads, setKvHeads] = useState<number>(8); // Default to GQA (e.g., Llama 3 70B uses 8 KV heads)
  const [headDim, setHeadDim] = useState<number>(128);
  const [precision, setPrecision] = useState<number>(2); // 2 bytes for FP16/BF16

  const [cacheSizeGB, setCacheSizeGB] = useState<number>(0);

  useEffect(() => {
    // Formula: 2 * B * S * L * H * D * P
    const bytes = 2 * batchSize * seqLength * layers * kvHeads * headDim * precision;
    const gb = bytes / (1024 ** 3);
    setCacheSizeGB(gb);
  }, [batchSize, seqLength, layers, kvHeads, headDim, precision]);

  return (
    <div className="kv-calculator-container">
      <h3 className="kv-title">Interactive KV Cache Calculator</h3>
      <p className="kv-desc">
        Adjust the parameters below to see how architectural choices impact the memory footprint of the KV Cache.
      </p>
      
      <div className="kv-grid">
        <div className="kv-input-group">
          <label>Batch Size ($B$): {batchSize}</label>
          <input type="range" min="1" max="256" value={batchSize} onChange={(e) => setBatchSize(Number(e.target.value))} />
        </div>
        
        <div className="kv-input-group">
          <label>Sequence Length ($S$): {seqLength}</label>
          <input type="range" min="512" max="131072" step="512" value={seqLength} onChange={(e) => setSeqLength(Number(e.target.value))} />
        </div>

        <div className="kv-input-group">
          <label>Layers ($L$): {layers}</label>
          <input type="range" min="12" max="120" value={layers} onChange={(e) => setLayers(Number(e.target.value))} />
        </div>

        <div className="kv-input-group">
          <label>KV Heads ($H$): {kvHeads}</label>
          <select value={kvHeads} onChange={(e) => setKvHeads(Number(e.target.value))}>
            <option value="64">64 (Standard MHA)</option>
            <option value="8">8 (GQA - e.g., Llama 3)</option>
            <option value="1">1 (MQA)</option>
          </select>
        </div>

        <div className="kv-input-group">
          <label>Head Dimension ($D$): {headDim}</label>
          <select value={headDim} onChange={(e) => setHeadDim(Number(e.target.value))}>
            <option value="64">64</option>
            <option value="128">128</option>
            <option value="256">256</option>
          </select>
        </div>

        <div className="kv-input-group">
          <label>Precision ($P$): {precision} Bytes</label>
          <select value={precision} onChange={(e) => setPrecision(Number(e.target.value))}>
            <option value="4">FP32 (4 Bytes)</option>
            <option value="2">FP16/BF16 (2 Bytes)</option>
            <option value="1">FP8 (1 Byte)</option>
            <option value="0.5">INT4 (0.5 Bytes)</option>
          </select>
        </div>
      </div>

      <div className="kv-result">
        <h4>Total KV Cache Size:</h4>
        <div className="kv-size-display">
          {cacheSizeGB.toFixed(2)} GB
        </div>
        <p className="kv-formula-text">
          {`Calculation: $2 \\times ${batchSize} \\times ${seqLength} \\times ${layers} \\times ${kvHeads} \\times ${headDim} \\times ${precision} \\text{ bytes}$`}
        </p>
      </div>
    </div>
  );
};

export default KVCacheCalculator;