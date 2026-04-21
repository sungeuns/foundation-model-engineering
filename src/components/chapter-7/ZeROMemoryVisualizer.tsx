import React, { useState } from 'react';
import './visualizers.css';

type ZeROMemoryVisualizerProps = {
  lang?: 'en' | 'ko';
};

const ZeROMemoryVisualizer = ({ lang = 'en' }: ZeROMemoryVisualizerProps) => {
  const [paramsB, setParamsB] = useState(70);
  const [gpus, setGpus] = useState(8);

  const copy = lang === 'ko'
    ? {
        title: 'ZeRO 메모리 사용량 시뮬레이터',
        subtitle: 'GPU당 모델 상태 메모리(FP16/BF16 + Adam) 분석',
        modelSize: '모델 크기',
        paramsUnit: 'Billion',
        parameters: '파라미터',
        clusterSize: '클러스터 크기',
        gpus: 'GPU',
        ddp: '표준 DDP',
        zero1: 'ZeRO Stage 1',
        zero2: 'ZeRO Stage 2',
        zero3: 'ZeRO Stage 3',
        limit: 'H100 80GB 한계',
        footer: '*빨간색은 80GB GPU에서 OOM을 의미합니다. 활성화 메모리는 포함하지 않습니다.',
      }
    : {
        title: 'ZeRO Memory Footprint Simulator',
        subtitle: 'Analyze Model State Memory per GPU (FP16/BF16 + Adam)',
        modelSize: 'Model Size',
        paramsUnit: 'Billion',
        parameters: 'Parameters',
        clusterSize: 'Cluster Size',
        gpus: 'GPUs',
        ddp: 'Standard DDP',
        zero1: 'ZeRO Stage 1',
        zero2: 'ZeRO Stage 2',
        zero3: 'ZeRO Stage 3',
        limit: 'H100 80GB Limit',
        footer: '*Red indicates Out-Of-Memory (OOM) on an 80GB GPU. Note: This only calculates Model States, not Activations.',
      };

  // Formulas for memory footprint in GB per GPU
  // 1 Billion params = 10^9 parameters. 
  // 1 GB = 10^9 bytes (simplified for visualizer)
  // Therefore, memory per parameter in bytes directly translates to GB for Billion parameters.
  
  const ddpMemory = 16 * paramsB;
  const zero1Memory = (4 + 12 / gpus) * paramsB;
  const zero2Memory = (2 + 14 / gpus) * paramsB;
  const zero3Memory = (16 / gpus) * paramsB;

  const h100Limit = 80; // 80GB VRAM

  const getBarColor = (memory: number) => {
    return memory > h100Limit ? '#ef4444' : '#3b82f6';
  };

  const getWidth = (memory: number) => {
    const maxScale = Math.max(ddpMemory, h100Limit * 1.5);
    return `${Math.min(100, (memory / maxScale) * 100)}%`;
  };
  const limitLeft = getWidth(h100Limit);

  return (
    <div className="zero-visualizer-container">
      <div className="zero-visualizer-header">
        <h3>{copy.title}</h3>
        <p>{copy.subtitle}</p>
      </div>

      <div className="zero-controls">
        <div className="control-group">
          <label>{copy.modelSize}: <strong>{paramsB} {copy.paramsUnit}</strong> {copy.parameters}</label>
          <input 
            type="range" 
            min="1" 
            max="200" 
            value={paramsB} 
            onChange={(e) => setParamsB(Number(e.target.value))}
            className="slider"
          />
        </div>
        <div className="control-group">
          <label>{copy.clusterSize}: <strong>{gpus} {copy.gpus}</strong></label>
          <input 
            type="range" 
            min="1" 
            max="128" 
            value={gpus} 
            onChange={(e) => setGpus(Number(e.target.value))}
            className="slider"
          />
        </div>
      </div>

      <div className="zero-chart">
        <div className="chart-row">
          <div className="chart-label">{copy.ddp}</div>
          <div className="chart-bar-container">
            <div className="chart-bar" style={{ width: getWidth(ddpMemory), backgroundColor: getBarColor(ddpMemory) }}></div>
            <span className="chart-value">{ddpMemory.toFixed(1)} GB</span>
          </div>
        </div>
        
        <div className="chart-row">
          <div className="chart-label">{copy.zero1}</div>
          <div className="chart-bar-container">
            <div className="chart-bar" style={{ width: getWidth(zero1Memory), backgroundColor: getBarColor(zero1Memory) }}></div>
            <span className="chart-value">{zero1Memory.toFixed(1)} GB</span>
          </div>
        </div>

        <div className="chart-row">
          <div className="chart-label">{copy.zero2}</div>
          <div className="chart-bar-container">
            <div className="chart-bar" style={{ width: getWidth(zero2Memory), backgroundColor: getBarColor(zero2Memory) }}></div>
            <span className="chart-value">{zero2Memory.toFixed(1)} GB</span>
          </div>
        </div>

        <div className="chart-row">
          <div className="chart-label">{copy.zero3}</div>
          <div className="chart-bar-container">
            <div className="chart-bar" style={{ width: getWidth(zero3Memory), backgroundColor: getBarColor(zero3Memory) }}></div>
            <span className="chart-value">{zero3Memory.toFixed(1)} GB</span>
          </div>
        </div>

        <div className="limit-line-container" style={{ '--limit-left': limitLeft } as React.CSSProperties}>
          <div className="limit-line"></div>
          <div className="limit-label">{copy.limit}</div>
        </div>
      </div>
      
      <div className="zero-visualizer-footer">
        <small>{copy.footer}</small>
      </div>
    </div>
  );
};

export default ZeROMemoryVisualizer;
