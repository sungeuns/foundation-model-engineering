import React, { useState, useEffect } from 'react';
import './visualizers.css';

const REQUESTS = [
  { id: 'Req A', length: 4, color: '#3b82f6' },
  { id: 'Req B', length: 2, color: '#ef4444' },
  { id: 'Req C', length: 6, color: '#10b981' },
  { id: 'Req D', length: 3, color: '#f59e0b' },
  { id: 'Req E', length: 5, color: '#8b5cf6' },
  { id: 'Req F', length: 2, color: '#ec4899' },
];

export default function ContinuousBatchingVisualizer({ lang = "en" }: { lang?: "en" | "ko" }) {
  const translations: Record<string, string> = {"Idle slot": "유휴 슬롯", "Pause": "일시 정지", "Restart": "다시 시작", "Play Simulation": "재생", "Reset": "초기화", "Iteration Step:": "반복 단계:", "Static Batching": "정적 배칭", "Waits for the longest request to finish.": "배치에서 가장 긴 요청이 끝날 때까지 다음 배치를 기다립니다.", "Continuous Batching": "연속 배칭", "Swaps requests at iteration level.": "반복 단계 사이에 요청을 교체합니다.", "Complete workload": "전체 워크로드", "tokens": "토큰"};
  const t = (text: string) => lang === "ko" ? translations[text] ?? text : text;
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const staticSteps = [
    [null, null, null],
    [{id:'Req A', p:1, t:4, c:'#3b82f6'}, {id:'Req B', p:1, t:2, c:'#ef4444'}, {id:'Req C', p:1, t:6, c:'#10b981'}],
    [{id:'Req A', p:2, t:4, c:'#3b82f6'}, {id:'Req B', p:2, t:2, c:'#ef4444'}, {id:'Req C', p:2, t:6, c:'#10b981'}],
    [{id:'Req A', p:3, t:4, c:'#3b82f6'}, null, {id:'Req C', p:3, t:6, c:'#10b981'}],
    [{id:'Req A', p:4, t:4, c:'#3b82f6'}, null, {id:'Req C', p:4, t:6, c:'#10b981'}],
    [null, null, {id:'Req C', p:5, t:6, c:'#10b981'}],
    [null, null, {id:'Req C', p:6, t:6, c:'#10b981'}],
    [{id:'Req D', p:1, t:3, c:'#f59e0b'}, {id:'Req E', p:1, t:5, c:'#8b5cf6'}, {id:'Req F', p:1, t:2, c:'#ec4899'}],
    [{id:'Req D', p:2, t:3, c:'#f59e0b'}, {id:'Req E', p:2, t:5, c:'#8b5cf6'}, {id:'Req F', p:2, t:2, c:'#ec4899'}],
    [{id:'Req D', p:3, t:3, c:'#f59e0b'}, {id:'Req E', p:3, t:5, c:'#8b5cf6'}, null],
    [null, {id:'Req E', p:4, t:5, c:'#8b5cf6'}, null],
    [null, {id:'Req E', p:5, t:5, c:'#8b5cf6'}, null],
    [null, null, null]
  ];

  const continuousSteps = [
    [null, null, null],
    [{id:'Req A', p:1, t:4, c:'#3b82f6'}, {id:'Req B', p:1, t:2, c:'#ef4444'}, {id:'Req C', p:1, t:6, c:'#10b981'}],
    [{id:'Req A', p:2, t:4, c:'#3b82f6'}, {id:'Req B', p:2, t:2, c:'#ef4444'}, {id:'Req C', p:2, t:6, c:'#10b981'}],
    [{id:'Req A', p:3, t:4, c:'#3b82f6'}, {id:'Req D', p:1, t:3, c:'#f59e0b'}, {id:'Req C', p:3, t:6, c:'#10b981'}],
    [{id:'Req A', p:4, t:4, c:'#3b82f6'}, {id:'Req D', p:2, t:3, c:'#f59e0b'}, {id:'Req C', p:4, t:6, c:'#10b981'}],
    [{id:'Req E', p:1, t:5, c:'#8b5cf6'}, {id:'Req D', p:3, t:3, c:'#f59e0b'}, {id:'Req C', p:5, t:6, c:'#10b981'}],
    [{id:'Req E', p:2, t:5, c:'#8b5cf6'}, {id:'Req F', p:1, t:2, c:'#ec4899'}, {id:'Req C', p:6, t:6, c:'#10b981'}],
    [{id:'Req E', p:3, t:5, c:'#8b5cf6'}, {id:'Req F', p:2, t:2, c:'#ec4899'}, null],
    [{id:'Req E', p:4, t:5, c:'#8b5cf6'}, null, null],
    [{id:'Req E', p:5, t:5, c:'#8b5cf6'}, null, null],
    [null, null, null],
    [null, null, null],
    [null, null, null]
  ];

  const totalSteps = 12;

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setStep(s => {
          if (s >= totalSteps) {
            setIsPlaying(false);
            return s;
          }
          return s + 1;
        });
      }, 800);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const renderSlot = (slotData) => {
    if (!slotData) {
      return <div className="batch-slot empty">{t("Idle slot")}</div>;
    }
    return (
      <div className="batch-slot filled" style={{ borderColor: slotData.c, backgroundColor: `${slotData.c}20` }}>
        <div className="slot-header">
          <span style={{ color: slotData.c, fontWeight: 'bold' }}>{slotData.id}</span>
          <span className="slot-progress">{slotData.p} / {slotData.t} {t("tokens")}</span>
        </div>
        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{ width: `${(slotData.p / slotData.t) * 100}%`, backgroundColor: slotData.c }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="cb-visualizer-container">
      <p>{lang === "ko" ? "설명용 decode 슬롯 모델: prefill·KV 용량·통신 비용은 생략합니다. 모든 작업이 끝난 뒤의 유휴는 낭비된 연산이 아닙니다." : "Illustrative decode-slot model; prefill, KV capacity and communication are omitted. Idle slots after all work finishes are not wasted computation."}</p>
      <div className="cb-controls">
        <button className="cb-btn" onClick={() => { if (step >= totalSteps) setStep(0); setIsPlaying(!isPlaying); }}>
          {isPlaying ? t("Pause") : step >= totalSteps ? t("Restart") : t("Play Simulation")}
        </button>
        <button className="cb-btn" onClick={() => { setStep(0); setIsPlaying(false); }}>{t("Reset")}</button>
        <label>{lang === "ko" ? "단계 선택" : "Choose step"}<input type="range" min="0" max={totalSteps} value={step} onChange={e=>{setIsPlaying(false);setStep(Number(e.target.value));}}/></label>
        <div className="cb-step-indicator">{t("Iteration Step:")} {step} / {totalSteps}</div>
      </div>

      <div className="cb-boards">
        <div className="cb-board">
          <h3 className="cb-board-title">{t("Static Batching")}</h3>
          <p className="cb-board-desc">{t("Waits for the longest request to finish.")}</p>
          <div className="cb-slots">
            {staticSteps[step].map((slot, i) => <React.Fragment key={`static-${i}`}>{renderSlot(slot)}</React.Fragment>)}
          </div>
        </div>

        <div className="cb-board">
          <h3 className="cb-board-title">{t("Continuous Batching")}</h3>
          <p className="cb-board-desc">{t("Swaps requests at iteration level.")}</p>
          <div className="cb-slots">
            {continuousSteps[step].map((slot, i) => <React.Fragment key={`cont-${i}`}>{renderSlot(slot)}</React.Fragment>)}
          </div>
        </div>
      </div>

      <div className="cb-queue">
        <h4>{t("Complete workload")}</h4>
        <div className="cb-queue-items">
          {REQUESTS.map(req => (
            <div key={req.id} className="cb-queue-item" style={{ borderLeft: `4px solid ${req.color}` }}>
              {req.id} ({req.length}t)
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
