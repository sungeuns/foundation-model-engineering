import { useEffect, useId, useState } from 'react';
import './visualizers.css';

// One authored backward pass. A bar occupies [start, end) on both tracks.
const gradients = [
  { label: 'L4', start: 0, end: 2 },
  { label: 'L3', start: 2, end: 4 },
  { label: 'L2', start: 4, end: 6 },
  { label: 'L1', start: 6, end: 8 },
];
const buckets = [
  { label: 'B1', members: 'L4 + L3', start: gradients[1].end, end: 7 },
  { label: 'B2', members: 'L2 + L1', start: gradients[3].end, end: 10 },
];
const backwardEnd = gradients[gradients.length - 1].end;
const endTime = buckets[buckets.length - 1].end;
const exposed = endTime - backwardEnd;

export default function DDPBucketingTimeline({ lang = 'en' }: { lang?: 'en' | 'ko' }) {
  const ko = lang === 'ko';
  const id = useId();
  const [ready, setReady] = useState(false);
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  useEffect(() => setReady(true), []);
  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => {
      const next = time + 1;
      setTime(next);
      if (next === endTime) setPlaying(false);
    }, 700);
    return () => window.clearTimeout(timer);
  }, [playing, time]);

  function seek(value: number) {
    setPlaying(false);
    setTime(value);
  }

  const atTime = (bar: { start: number; end: number }) => bar.start <= time && time < bar.end;
  const gradient = gradients.find(atTime);
  const bucket = buckets.find(atTime);
  const tracks = [
    { name: ko ? '역전파 · 층별 그래디언트' : 'Backward pass · layer gradients', bars: gradients, active: gradient },
    { name: ko ? '통신 · 버킷별 All-Reduce' : 'Network · bucket all-reduce', bars: buckets, active: bucket },
  ];
  const computeStatus = gradient
    ? (ko ? `${gradient.label} 그래디언트 계산 중` : `Computing the ${gradient.label} gradient`)
    : (ko ? '역전파 완료' : 'Backward pass complete');
  const networkStatus = bucket
    ? (ko ? `${bucket.label} All-Reduce 진행 중` : `Reducing ${bucket.label}`)
    : time === endTime ? (ko ? '통신 완료' : 'Communication complete') : (ko ? '통신 대기' : 'Network idle');

  return <figure className="ddp-timeline" aria-labelledby={id}>
    <figcaption id={id}>{ko ? '그래디언트가 준비되면 언제 통신을 시작할까?' : 'When can each gradient bucket start communicating?'}</figcaption>
    <p>{ko
      ? '모든 랭크가 같은 속도로 역전파하는 예제입니다. 두 줄은 같은 시간축을 사용합니다. 숫자는 설명을 위해 정한 시간 단위입니다.'
      : 'All ranks follow the same backward schedule in this example. Both rows use the same clock, in illustrative time units.'}</p>
    <p className="ddp-members">{buckets.map(bucket => `${bucket.label} = ${bucket.members}`).join(' · ')}</p>
    {tracks.map(track => <div className="ddp-lane" key={track.name}>
      <b>{track.name}</b>
      <div className="ddp-track-grid" style={{ gridTemplateColumns: `repeat(${endTime}, minmax(0, 1fr))` }}>
        {track.bars.map(bar => <span key={bar.label} className="ddp-event" data-active={track.active === bar}
          style={{ gridColumn: `${bar.start + 1} / ${bar.end + 1}` }}>
          <strong>{bar.label}</strong><small>{bar.start}–{bar.end}</small>
        </span>)}
        <i className="ddp-clock" aria-hidden="true" style={{ left: `${100 * time / endTime}%` }} />
      </div>
    </div>)}
    <fieldset className="ddp-controls" disabled={!ready}>
      <label>{ko ? '시간' : 'Time'} <span>{time} / {endTime}</span>
        <input type="range" min="0" max={endTime} step="1" value={time} onChange={e => seek(e.currentTarget.valueAsNumber)} />
      </label>
      <button type="button" onClick={() => {
        if (time === endTime) setTime(0);
        setPlaying(!playing);
      }}>{playing ? (ko ? '일시 정지' : 'Pause') : time === endTime ? (ko ? '다시 재생' : 'Replay') : (ko ? '재생' : 'Play')}</button>
      <button type="button" onClick={() => seek(0)}>{ko ? '초기화' : 'Reset'}</button>
    </fieldset>
    <output className="ddp-readout" aria-live={playing ? 'off' : 'polite'}>
      {computeStatus} · {networkStatus}
    </output>
    <p>{ko
      ? `시간 ${buckets[0].start}에 L3 계산이 끝나면 B1의 All-Reduce와 L2의 그래디언트 계산이 함께 시작됩니다. 시간 ${backwardEnd}에 L1이 끝나야 B2가 준비됩니다. 이후 B2가 끝나는 시간 ${endTime}까지 남은 통신은 ${exposed}단위입니다.`
      : `At time ${buckets[0].start}, L3 finishes and the all-reduce for B1 starts alongside the gradient calculation for L2. B2 needs L1, the last gradient, at time ${backwardEnd}. Its reduction ends at ${endTime}, leaving ${exposed} units of communication after compute.`}</p>
  </figure>;
}
