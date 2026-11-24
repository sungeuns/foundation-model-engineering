import React, { useEffect, useId, useState } from 'react';
import './visualizers.css';

type ZeROMemoryVisualizerProps = {
  lang?: 'en' | 'ko';
};

const budgetGB = 80;

const ZeROMemoryVisualizer = ({ lang = 'en' }: ZeROMemoryVisualizerProps) => {
  const controlId = useId();
  const [paramsB, setParamsB] = useState(70);
  const [ranks, setRanks] = useState(8);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  const ko = lang === 'ko';
  const copy = ko
    ? {
        title: 'GPU당 모델 상태 메모리',
        subtitle: 'GPU마다 데이터 병렬 랭크 하나를 둡니다. 파라미터 하나에 FP16 또는 BF16 가중치 2바이트, 그래디언트 2바이트, FP32 가중치 사본과 Adam 모멘트 두 개에 합계 12바이트를 잡습니다.',
        modelSize: '파라미터 수',
        rankCount: '데이터 병렬 랭크 수',
        budget: `예산 ${budgetGB} GB`,
        footer: `점선은 이 예제의 GPU당 예산 ${budgetGB} GB입니다(1 GB = 10억 바이트). 예산을 넘은 막대는 빨간색입니다. 활성값, 임시 버퍼, 통신 버퍼와 평가에 필요한 메모리는 별도로 계산해야 합니다.`,
        staticView: '아래는 700억 파라미터를 랭크 8개로 학습할 때의 값입니다. 설정을 바꾸려면 자바스크립트를 켜세요.',
      }
    : {
        title: 'Model-state memory per GPU',
        subtitle: 'Each GPU runs one data-parallel rank. For each parameter, this example counts 2 bytes for an FP16 or BF16 weight, 2 for its gradient and 12 for the FP32 master weight and two Adam moments.',
        modelSize: 'Model size',
        rankCount: 'Data-parallel group',
        budget: `${budgetGB} GB budget`,
        footer: `The dashed line marks the example budget of ${budgetGB} GB per GPU (1 GB = 1 billion bytes). Red bars exceed that budget. Activations, temporary buffers, communication buffers and evaluation need additional memory.`,
        staticView: 'The chart shows 70 billion parameters across eight ranks. Enable JavaScript to change the inputs.',
      };
  const modelValue = ko ? `${(paramsB * 10).toLocaleString('ko-KR')}억 개` : `${paramsB} billion parameters`;
  const rankValue = ko ? `${ranks}개` : `${ranks} ${ranks === 1 ? 'rank' : 'ranks'}`;

  // With parameter counts in billions and 1 GB = 10^9 bytes, these totals are GB per rank.
  const ddpMemory = 16 * paramsB;
  const zero1Memory = (4 + 12 / ranks) * paramsB;
  const zero2Memory = (2 + 14 / ranks) * paramsB;
  const zero3Memory = (16 / ranks) * paramsB;
  const maxScale = Math.max(ddpMemory, budgetGB * 1.5);
  const limitLeft = `${100 * budgetGB / maxScale}%`;
  const rows = [
    { label: 'DDP', memory: ddpMemory },
    { label: 'ZeRO-1', memory: zero1Memory },
    { label: 'ZeRO-2', memory: zero2Memory },
    { label: 'ZeRO-3', memory: zero3Memory },
  ];

  return (
    <div className="zero-visualizer-container">
      <div className="zero-visualizer-header">
        <h3>{copy.title}</h3>
        <p>{copy.subtitle}</p>
      </div>

      <div className="zero-controls">
        <div className="control-group">
          <label htmlFor={`${controlId}-params`}>{copy.modelSize}: <strong>{modelValue}</strong></label>
          <input id={`${controlId}-params`} type="range" min="1" max="200" value={paramsB}
            disabled={!ready} aria-valuetext={ko ? `파라미터 ${modelValue}` : modelValue}
            onChange={event => setParamsB(Number(event.currentTarget.value))} className="slider" />
        </div>
        <div className="control-group">
          <label htmlFor={`${controlId}-ranks`}>{copy.rankCount}: <strong>{rankValue}</strong></label>
          <input id={`${controlId}-ranks`} type="range" min="1" max="128" value={ranks}
            disabled={!ready} aria-valuetext={ko ? `랭크 ${rankValue}` : rankValue}
            onChange={event => setRanks(Number(event.currentTarget.value))} className="slider" />
        </div>
        <noscript><p>{copy.staticView}</p></noscript>
      </div>

      <div className="zero-chart" aria-live="polite" aria-atomic="true">
        {rows.map(({ label, memory }) => (
          <div className="chart-row" key={label}>
            <div className="chart-label">{label}</div>
            <div className="chart-bar-container">
              <div className="chart-bar" style={{
                width: `${100 * memory / maxScale}%`,
                backgroundColor: memory > budgetGB ? '#b73636' : '#2563ad',
              }} />
              <span className="chart-value">{memory.toFixed(1)} GB</span>
            </div>
          </div>
        ))}
        <div className="limit-line-container" style={{ '--limit-left': limitLeft } as React.CSSProperties}>
          <div className="limit-line" />
          <div className="limit-label">{copy.budget}</div>
        </div>
      </div>

      <div className="zero-visualizer-footer">
        <small>{copy.footer}</small>
      </div>
    </div>
  );
};

export default ZeROMemoryVisualizer;
