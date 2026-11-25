import { useState } from 'react';
import './visualizers.css';

// These are the three fixtures in the downloadable expert_dispatch.py.
const assignments = [
  [[2, 0, 3, 2], [1, 3]],
  [[], [0, 3]],
  [[0, 1], [0, 1]],
];

type Row = { token: number; expert: number; source: number; slot: number; value: number };

function expertOwner(row: Row) {
  return Math.floor(row.expert / 2);
}

// Each receiver concatenates its slices in sender-rank order.
function exchange(buffers: Row[][], destination: (row: Row) => number) {
  return buffers.map((_, rank) => buffers.flatMap(rows => rows.filter(row => destination(row) === rank)));
}

function trace(expertsByRank: number[][]) {
  const inputs = expertsByRank.map((experts, source) => experts.map((expert, slot) => {
    const token = 100 * source + slot + 1;
    return { token, expert, source, slot, value: token };
  }));
  const packed = inputs.map(rows => [...rows].sort((a, b) => expertOwner(a) - expertOwner(b)));
  const received = exchange(packed, expertOwner);
  const outputs = received.map(rows => rows.map(row => ({ ...row, value: row.value + 1000 * row.expert })));
  const returned = exchange(outputs, row => row.source);
  const restored = returned.map(rows => [...rows].sort((a, b) => a.slot - b.slot));
  return [inputs, packed, received, outputs, returned, restored];
}

const copy = {
  en: {
    input: 'Inputs', cases: ['Six tokens', 'Rank 0 starts empty', 'Rank 1 receives no rows'],
    stage: 'Stage', steps: ['Input', 'Pack', 'Dispatch', 'Compute', 'Send back', 'Restore order'],
    descriptions: [
      'Read down each buffer in source order. Each row carries its token ID and the expert selected for it.',
      'Pack rows for rank 0 first, then rank 1. Keep rows for the same destination in their original order.',
      'Each expert owner receives its rows from rank 0 first, then rank 1. A rank with an empty buffer still takes part.',
      'Expert e adds 1000 × e to the first coordinate shown here. The token ID stays the same.',
      'The reverse exchange delivers results to their source ranks. They arrive grouped by expert owner.',
      'Place each result in its original slot using the permutation saved at packing time.',
    ],
    rank: 'Rank', experts: 'Experts', token: 'Token ID', expert: 'Expert', value: 'First coordinate', empty: 'No rows at this stage.',
  },
  ko: {
    input: '입력 사례', cases: ['토큰 여섯 개', '랭크 0의 입력이 비어 있음', '랭크 1로 가는 토큰이 없음'],
    stage: '단계', steps: ['입력', '목적지별 정렬', '전송', '전문가 연산', '결과 반환', '순서 복원'],
    descriptions: [
      '각 버퍼에 담긴 행을 위에서부터 읽어 보세요. 행마다 토큰 번호와 라우터가 선택한 전문가 번호가 있습니다.',
      '랭크 0으로 보낼 행을 앞에, 랭크 1로 보낼 행을 뒤에 모읍니다. 목적지가 같은 행끼리는 원래 순서를 유지합니다.',
      '각 랭크는 자신이 맡은 전문가에게 갈 행을 받습니다. 랭크 0에서 출발한 행이 먼저 옵니다. 버퍼가 빈 랭크도 통신에 참여합니다.',
      'e번 전문가는 표에 보이는 첫 번째 좌표에 1000 × e를 더합니다. 토큰 번호는 그대로입니다.',
      '각 결과를 토큰이 출발한 랭크로 돌려보냅니다. 이때 결과는 전문가를 실행한 랭크별로 묶여 있습니다.',
      '처음에 목적지별로 정렬하면서 기록해 둔 위치를 이용해 결과를 각각 원래 자리에 놓습니다.',
    ],
    rank: '랭크', experts: '전문가', token: '토큰 번호', expert: '전문가', value: '첫 번째 좌표', empty: '이 단계에는 행이 없습니다.',
  },
};

export function ExpertParallelismVisualizer({ lang = 'en' }: { lang?: 'en' | 'ko' }) {
  const [example, setExample] = useState(0);
  const [stage, setStage] = useState(0);
  const t = copy[lang];
  const buffers = trace(assignments[example])[stage];

  return (
    <div className="ep-container">
      <label className="ep-case">
        {t.input}
        <select value={example} onChange={event => setExample(Number(event.target.value))}>
          {t.cases.map((name, index) => <option key={name} value={index}>{name}</option>)}
        </select>
      </label>
      <fieldset className="ep-stages">
        <legend>{t.stage}</legend>
        {t.steps.map((name, index) => (
          <button key={name} type="button" aria-pressed={stage === index} onClick={() => setStage(index)}>
            {index + 1}. {name}
          </button>
        ))}
      </fieldset>
      <p className="ep-instruction" aria-live="polite">{t.descriptions[stage]}</p>
      <div className="ep-grid">
        {buffers.map((rows, rank) => (
          <table key={rank}>
            <caption>
              <strong>{t.rank} {rank}</strong>
              <span>{t.experts} {rank * 2}–{rank * 2 + 1}</span>
            </caption>
            <thead><tr>
              <th scope="col">{t.token}</th><th scope="col">{t.expert}</th><th scope="col">{t.value}</th>
            </tr></thead>
            <tbody>
              {rows.map(row => (
                <tr key={row.token}>
                  <th scope="row">{row.token}</th><td>{row.expert}</td><td>{row.value}</td>
                </tr>
              ))}
              {rows.length === 0 && <tr><td className="ep-empty" colSpan={3}>{t.empty}</td></tr>}
            </tbody>
          </table>
        ))}
      </div>
    </div>
  );
}
