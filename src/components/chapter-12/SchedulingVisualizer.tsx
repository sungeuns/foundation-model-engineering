import React, { useEffect, useState } from 'react';
import './visualizers.css';

type Mode = 'unified' | 'chunked' | 'disaggregated';
type Block = { label: string; start: number; end: number; kind: string };
const schedules: Record<Mode, { label: [string, string]; blocks: Block[] }[]> = {
  unified: [{ label: ['Shared pool', '공유 자원 풀'], blocks: [
    { label: 'P', start: 0, end: 60, kind: 'prefill-large' },
    { label: 'D1', start: 62, end: 66, kind: 'decode-small' },
    { label: 'D2', start: 68, end: 72, kind: 'decode-small' },
    { label: 'D3', start: 74, end: 78, kind: 'decode-small' },
  ] }],
  chunked: [{ label: ['Shared pool', '공유 자원 풀'], blocks: [
    { label: 'P1', start: 0, end: 15, kind: 'prefill-chunk' },
    { label: 'D1', start: 16, end: 20, kind: 'decode-small' },
    { label: 'P2', start: 21, end: 36, kind: 'prefill-chunk' },
    { label: 'D2', start: 37, end: 41, kind: 'decode-small' },
    { label: 'P3', start: 42, end: 57, kind: 'prefill-chunk' },
    { label: 'D3', start: 58, end: 62, kind: 'decode-small' },
    { label: 'P4', start: 63, end: 78, kind: 'prefill-chunk' },
  ] }],
  disaggregated: [
    { label: ['Prefill pool', 'Prefill 자원 풀'], blocks: [
      { label: 'P', start: 0, end: 60, kind: 'prefill-large' },
      { label: 'KV', start: 60, end: 70, kind: 'transfer' },
    ] },
    { label: ['Decode pool', 'Decode 자원 풀'], blocks: [
      { label: 'D1', start: 5, end: 9, kind: 'decode-small' },
      { label: 'D2', start: 20, end: 24, kind: 'decode-small' },
      { label: 'D3', start: 35, end: 39, kind: 'decode-small' },
      { label: 'New', start: 70, end: 78, kind: 'decode-small highlight' },
    ] },
  ],
};

export default function SchedulingVisualizer({ lang = 'en' }: { lang?: 'en' | 'ko' }) {
  const ko = lang === 'ko';
  const [mode, setMode] = useState<Mode>('unified');
  const [progress, setProgress] = useState(0);
  const [replay, setReplay] = useState(0);
  useEffect(() => {
    setProgress(0);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setProgress(100);
      return;
    }
    let value = 0;
    const timer = window.setInterval(() => {
      value = Math.min(100, value + 2);
      setProgress(value);
      if (value === 100) window.clearInterval(timer);
    }, 50);
    return () => window.clearInterval(timer);
  }, [mode, replay]);

  const names: Record<Mode, string> = ko
    ? { unified: '통합 서빙', chunked: '청크 prefill', disaggregated: '분리형 서빙' }
    : { unified: 'Unified serving', chunked: 'Chunked prefill', disaggregated: 'Disaggregated' };
  const help = ko ? {
    unified: '이 도식에서는 큰 prefill이 끝난 뒤 기존 decode가 실행됩니다.',
    chunked: '청크 사이에 기존 decode를 배치합니다. 대기를 없애는 보장은 아닙니다.',
    disaggregated: '기존 decode는 다른 풀에서 실행합니다. 새 요청은 KV 인계 완료를 기다립니다.',
  } : {
    unified: 'In this schedule, existing decodes wait for the large prefill.',
    chunked: 'Existing decodes run between chunks. Waiting is reduced, not guaranteed to disappear.',
    disaggregated: 'Existing decodes run in a separate pool. The new request waits for the KV handoff.',
  };

  return <section className="scheduling-visualizer" aria-label={ko ? '서빙 실행 순서 도식' : 'Serving schedule illustration'}>
    <div className="controls">
      {(Object.keys(names) as Mode[]).map(option => <button key={option} type="button"
        className={mode === option ? 'active' : ''} aria-pressed={mode === option}
        onClick={() => setMode(option)}>{names[option]}</button>)}
      <button type="button" onClick={() => setReplay(value => value + 1)}>{ko ? '다시 재생' : 'Replay'}</button>
    </div>
    <p>{ko ? 'P: prefill · D1–D3: 기존 decode · KV: 상태 인계 · New: 새 요청 decode' : 'P: prefill · D1–D3: existing decodes · KV: state handoff · New: new request decode'}</p>
    <div className="timeline-container" tabIndex={0} aria-label={ko ? '시간축, 임의 단위; 좁은 화면에서 가로 스크롤' : 'Timeline in invented units; scroll horizontally on narrow screens'}>
      <div className="timeline-track">
        {schedules[mode].map((row, i) => <div className="track-row" key={i}>
          <div className="label">{row.label[ko ? 1 : 0]}</div>
          <div className="blocks">
            {row.blocks.map(block => progress > block.start && <div key={block.label}
              className={`block ${block.kind}`} title={`${block.label}: ${block.start}–${block.end}`}
              style={{ left: `${block.start}%`, width: `${Math.max(0, Math.min(progress, block.end) - block.start)}%` }}>
              {block.label}
            </div>)}
          </div>
        </div>)}
      </div>
    </div>
    <progress value={progress} max={100} aria-label={ko ? '애니메이션 진행' : 'Animation progress'} />
    <p className="status-text" role="status">{help[mode]}</p>
    <p className="scheduling-source">{ko ? '2026-10-18 · 생성 방식: 수작업으로 정한 교육용 실행 순서. 임의 단위이며 하드웨어 측정·속도 향상 예측이 아닙니다. 분리형은 자원 풀도 추가됩니다.' : '2026-10-18 · Generation method: hand-authored teaching schedules in invented units. These are not hardware measurements or speedup predictions. Disaggregation also adds a resource pool.'}</p>
  </section>;
}
