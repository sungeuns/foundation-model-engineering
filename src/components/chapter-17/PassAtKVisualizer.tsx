import React, { useState } from 'react';
import './visualizers.css';

export default function PassAtKVisualizer({ locale = 'en' }: { locale?: 'en' | 'ko' }) {
  const ko = locale === 'ko';
  const [n, setN] = useState(100), [c, setC] = useState(10), [k, setK] = useState(5);
  let allFail = 1;
  for (let i = 0; i < k; i++) allFail *= Math.max(0, (n - c - i) / (n - i));
  const rate = (1 - allFail) * 100;
  const changeN = (value: number) => { setN(value); setC(Math.min(c, value)); setK(Math.min(k, value)); };
  return <section className="pass-atk-container">
    <h3>{ko ? 'pass@k 추정량 탐색' : 'Explore the pass@k estimator'}</h3>
    <p>{ko ? '같은 문제의 표본 n개 중 c개가 테스트를 통과했을 때, 복원 없이 k개를 뽑아 적어도 하나가 통과할 확률입니다.' : 'From n samples for one problem, c pass the tests. Estimate the chance that at least one of k samples drawn without replacement passes.'}</p>
    <div className="pass-controls">
      <label>{ko ? '전체 생성 표본 n' : 'Generated samples n'}: {n}<input type="range" min="1" max="200" value={n} onChange={e => changeN(Number(e.target.value))} /></label>
      <label>{ko ? '통과 표본 c' : 'Passing samples c'}: {c}<input type="range" min="0" max={n} value={c} onChange={e => setC(Number(e.target.value))} /></label>
      <label>{ko ? '선택할 표본 k' : 'Selected samples k'}: {k}<input type="range" min="1" max={n} value={k} onChange={e => setK(Number(e.target.value))} /></label>
    </div>
    <p className="pass-result" aria-live="polite"><strong>{rate.toFixed(1)}%</strong></p>
    <p>{ko ? '교육용 계산: 문제별 추정량을 계산한 뒤 문제 전체에서 평균합니다. 적어도 하나의 정답이 있다는 사실은 배포 시스템이 그 답을 고를 수 있다는 뜻이 아닙니다. 선택기·테스트 오라클의 품질과 전체 표본 비용도 평가해야 합니다.' : 'Educational calculation: compute per problem, then average across problems. Having at least one correct sample does not mean a deployed selector can identify it. Evaluate the selector or test oracle and the cost of all samples.'}</p>
  </section>;
}
