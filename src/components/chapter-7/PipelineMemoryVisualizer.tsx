import React, { useState } from 'react';
import { pipelineSchedule } from './pipeline-schedule.mjs';
import './visualizers.css';

export default function PipelineMemoryVisualizer({ lang = 'en' }: { lang?: 'en' | 'ko' }) {
  const [schedule, setSchedule] = useState<'gpipe' | '1f1b'>('1f1b');
  const ko = lang === 'ko';
  const {timeline, memory, peaks} = pipelineSchedule(schedule);
  return <div className="pipeline-visualizer">
    <div className="controls" aria-label={ko ? '파이프라인 스케줄' : 'Pipeline schedule'}>
      {(['gpipe', '1f1b'] as const).map(mode => <button key={mode} type="button" aria-pressed={schedule === mode} className={schedule === mode ? 'active' : ''} onClick={() => setSchedule(mode)}>{mode === 'gpipe' ? 'GPipe' : '1F1B'}</button>)}
    </div>
    <p>{ko ? '4개 단계, 8개 마이크로배치. F: 순전파, B: 역전파. 각 연산은 한 슬롯이며 통신·재계산 시간은 생략한 이상화 모델입니다.' : '4 stages, 8 microbatches. F: forward, B: backward. Each operation takes one slot; this idealized model omits communication and recomputation.'}</p>
    <div className="pipeline-scroll" tabIndex={0} role="region" aria-label={ko ? '실행 시간표: 가로 스크롤' : 'Execution timeline: scroll horizontally'}>
      <table className="pipeline-table"><caption>{ko ? '의존성을 만족하는 실행 순서' : 'Dependency-valid execution order'}</caption><thead><tr><th>GPU</th>{timeline[0].map((_: unknown, t: number) => <th key={t}>T{t + 1}</th>)}</tr></thead>
        <tbody>{timeline.map((row: Array<{kind: string; batch: number} | null>, rank: number) => <tr key={rank}><th scope="row">{rank}</th>{row.map((job, t) => <td key={t} className={job?.kind ?? 'idle'}>{job ? `${job.kind}${job.batch + 1}` : '—'}</td>)}</tr>)}</tbody>
      </table>
    </div>
    <h4>{ko ? 'GPU 0의 보관 활성화' : 'Stored activations on GPU 0'}</h4>
    <p aria-live="polite">{ko ? '최댓값' : 'Peak'}: {peaks[0]} / 8 · {ko ? '전체 시간 슬롯' : 'Total time slots'}: {timeline[0].length}</p>
    <div className="pipeline-scroll" tabIndex={0} role="region" aria-label={ko ? '시간별 활성화 개수' : 'Activation counts over time'}>
      <div className="pipeline-memory-bars">{memory[0].map((n: number, t: number) => <div key={t}><div className="pipeline-memory-bar" style={{height: `${n * 10}px`}}>{n}</div><small>T{t + 1}</small></div>)}</div>
    </div>
    <p className="memory-desc">{ko ? '순전파가 끝나면 해당 마이크로배치의 활성화를 보관하고 역전파가 끝나면 해제합니다. 이 예제에서 1F1B는 GPU 0의 최대 보관량을 줄이지만 전체 완료 시간을 줄이지는 않습니다. 실제 바이트 수는 단계별 텐서 크기와 재계산 정책에 따라 달라집니다.' : 'A completed forward stores one microbatch activation; its backward releases it. Here 1F1B reduces GPU 0 peak storage without reducing total completion time. Actual bytes depend on stage tensor sizes and recomputation policy.'}</p>
  </div>;
}
