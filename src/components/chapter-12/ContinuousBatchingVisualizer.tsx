import React, { useEffect, useState } from 'react';
import './continuous-batching.css';

type Request = { id: string; length: number; color: string };
type Slot = Request & { generated: number };
type Frame = { slots: (Slot | null)[]; waiting: string[]; finished: string[]; remainingTokens: number };
const REQUESTS: Request[] = [
  { id: 'A', length: 4, color: '#93c5fd' },
  { id: 'B', length: 2, color: '#fda4af' },
  { id: 'C', length: 6, color: '#6ee7b7' },
  { id: 'D', length: 3, color: '#fcd34d' },
  { id: 'E', length: 5, color: '#c4b5fd' },
  { id: 'F', length: 2, color: '#f9a8d4' },
];
const CAPACITY = 3;

// Fixed, decode-only teaching workload. Frames show the end of an iteration.
function schedule(continuous: boolean): Frame[] {
  const waiting = [...REQUESTS];
  const slots: (Slot | null)[] = Array(CAPACITY).fill(null);
  const finished: string[] = [];
  let remainingTokens = waiting.reduce((total, request) => total + request.length, 0);
  const frames: Frame[] = [{ slots: [...slots], waiting: waiting.map(r => r.id), finished: [], remainingTokens }];
  while (waiting.length || slots.some(Boolean)) {
    if (continuous || slots.every(slot => slot === null)) {
      for (let i = 0; i < CAPACITY && waiting.length; i++) {
        if (slots[i] === null) slots[i] = { ...waiting.shift()!, generated: 0 };
      }
    }
    for (const slot of slots) {
      if (slot) {
        slot.generated += 1;
        remainingTokens -= 1;
        if (slot.generated === slot.length) finished.push(slot.id);
      }
    }
    frames.push({
      slots: slots.map(slot => slot ? { ...slot } : null),
      waiting: waiting.map(r => r.id),
      finished: [...finished],
      remainingTokens,
    });
    for (let i = 0; i < CAPACITY; i++) {
      if (slots[i]?.generated === slots[i]?.length) slots[i] = null;
    }
  }
  return frames;
}
const STATIC = schedule(false);
const CONTINUOUS = schedule(true);
const LAST_STEP = Math.max(STATIC.length, CONTINUOUS.length) - 1;
const COMPLETE: Frame = { slots: Array(CAPACITY).fill(null), waiting: [], finished: REQUESTS.map(r => r.id), remainingTokens: 0 };

export default function ContinuousBatchingVisualizer({ lang = 'en' }: { lang?: 'en' | 'ko' }) {
  const ko = lang === 'ko';
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  useEffect(() => setReady(true), []);
  useEffect(() => {
    if (!playing) return;
    if (step >= LAST_STEP) { setPlaying(false); return; }
    const timer = window.setTimeout(() => setStep(value => value + 1), 800);
    return () => window.clearTimeout(timer);
  }, [playing, step]);
  const chooseStep = (value: number) => { setPlaying(false); setStep(value); };
  const requestName = (id: string) => `${ko ? '요청' : 'Request'} ${id}`;

  return <section className="cb-visualizer-container" aria-label={ko ? '정적 배칭과 연속 배칭 실행 비교' : 'Static and continuous batching comparison'}>
    <p className="cb-explanation">{ko
      ? '세 슬롯으로 여섯 요청을 처리합니다. 모두 시작 전에 도착했고 prefill은 생략합니다. 각 칸은 이번 반복이 끝난 상태입니다. 남은 토큰 수에는 대기 중인 요청과 실행 중인 요청이 앞으로 생성할 토큰이 모두 들어갑니다.'
      : 'Six requests share three slots. All requests arrive before decoding starts. Prefill is omitted. Each card shows the end of this iteration. The remaining token count includes tokens still to be generated for both queued and active requests.'}</p>
    <noscript><p>{ko ? '위 표에서 11번의 반복을 전부 비교할 수 있습니다. 아래 카드는 요청을 받기 전 상태입니다.' : 'The table above compares all 11 iterations. The cards below show the queue before any request starts.'}</p></noscript>
    <fieldset className="cb-controls" disabled={!ready} aria-label={ko ? '반복 재생과 선택' : 'Iteration playback and selection'}>
      <button type="button" className="cb-btn" onClick={() => {
        if (step === LAST_STEP) setStep(0);
        setPlaying(value => !value);
      }}>{playing ? (ko ? '일시 정지' : 'Pause') : step === LAST_STEP ? (ko ? '다시 재생' : 'Replay') : (ko ? '재생' : 'Play')}</button>
      <button type="button" className="cb-btn" onClick={() => chooseStep(0)}>{ko ? '초기화' : 'Reset'}</button>
      <button type="button" className="cb-btn" disabled={step === 0} onClick={() => chooseStep(step - 1)}>{ko ? '이전 반복' : 'Previous'}</button>
      <button type="button" className="cb-btn" disabled={step === LAST_STEP} onClick={() => chooseStep(step + 1)}>{ko ? '다음 반복' : 'Next'}</button>
      <label className="cb-step-control">{ko ? '반복 선택' : 'Choose iteration'}
        <input type="range" min="0" max={LAST_STEP} value={step} onChange={event => chooseStep(Number(event.target.value))} />
      </label>
    </fieldset>
    <p className="cb-step-indicator" role="status">{step === 0 ? (ko ? '시작 전: 모든 요청 대기 중' : 'Before execution: all requests queued') : `${ko ? '반복' : 'Iteration'} ${step} / ${LAST_STEP}`}</p>
    <div className="cb-boards">
      {([{ title: ko ? '정적 배칭' : 'Static batching', frames: STATIC }, { title: ko ? '연속 배칭' : 'Continuous batching', frames: CONTINUOUS }]).map(({ title, frames }) => {
        const frame = frames[step] ?? COMPLETE;
        return <div className="cb-board" key={title}>
          <h3 className="cb-board-title">{title}</h3>
          <p className="cb-board-summary">{ko ? `완료 ${frame.finished.length}/6 · 대기 ${frame.waiting.length}` : `Finished ${frame.finished.length}/6 · Queued ${frame.waiting.length}`} · <strong>{ko ? `남은 토큰 ${frame.remainingTokens}개` : `Tokens left ${frame.remainingTokens}`}</strong></p>
          <div className="cb-slots">{frame.slots.map((slot, index) => <div key={index} className={`cb-slot ${slot ? 'cb-filled' : 'cb-empty'}`} style={slot ? { borderColor: slot.color } : undefined}>
            <span className="cb-slot-number">{ko ? '슬롯' : 'Slot'} {index + 1}</span>
            {slot ? <>
              <div className="cb-slot-header"><strong style={{ color: slot.color }}>{requestName(slot.id)}</strong><span>{slot.generated}/{slot.length} {ko ? '토큰' : 'tokens'}</span></div>
              <progress value={slot.generated} max={slot.length} aria-label={requestName(slot.id)} />
              <span className="cb-slot-state">{slot.generated === slot.length ? (ko ? '이번 반복에서 완료' : 'Finishes this iteration') : (ko ? '생성 중' : 'Generating')}</span>
            </> : <span>{step === 0 ? (ko ? '아직 배정하지 않음' : 'Not admitted yet') : frame.finished.length === REQUESTS.length ? (ko ? '전체 작업 완료' : 'All work finished') : (ko ? '빈 슬롯' : 'Unfilled slot')}</span>}
          </div>)}</div>
          <p className="cb-waiting">{ko ? '대기열' : 'Queue'}: {frame.waiting.length ? frame.waiting.join(', ') : (ko ? '없음' : 'empty')}</p>
          <p className="cb-completion">{ko ? `전체 완료: 반복 ${frames.length - 1}` : `Workload finishes at iteration ${frames.length - 1}`}</p>
        </div>;
      })}
    </div>
    <p className="cb-workload">{ko ? '시작 시 요청별 생성 목표(토큰)' : 'Starting decode targets (tokens per request)'}: {REQUESTS.map(req => `${req.id}=${req.length}`).join(' · ')}</p>
    <p className="cb-source">{ko
      ? '직접 만든 교육용 일정입니다. 반복 횟수는 밀리초나 GPU 활용률이 아닙니다. 토큰·KV 예산, 도착 시각, prefill, 통신·스케줄러 비용을 생략합니다. 전체 완료 후의 빈칸은 낭비된 연산이 아닙니다.'
      : 'Hand-authored teaching workload. Iterations are not milliseconds or GPU utilization. Token/KV budgets, arrival timing, prefill, communication and scheduler costs are omitted. Empty slots after completion are not wasted computation.'}</p>
  </section>;
}
