import React, { useId, useState } from 'react';
import { decisionCases, decisionFloors, evaluateDecisionPolicy } from '../../utils/decision-policy.js';
import './decision-policy.css';

const coverageX = (fraction: number) => `${18 + 74 * fraction}%`;

export default function DecisionPolicyExplorer({ locale = 'en' }: { locale?: 'en' | 'ko' }) {
  const ko = locale === 'ko';
  const id = useId();
  const [threshold, setThreshold] = useState(0.85);
  const [fpCost, setFpCost] = useState(1);
  const [fnCost, setFnCost] = useState(1);
  const [calibrationDrift, setCalibrationDrift] = useState(false);
  const cases = decisionCases(calibrationDrift);
  const positiveCount = cases.filter(row => row.y === 1).length;
  const highScoreCases = cases.filter(row => row.p === 0.95);
  const highScorePositives = highScoreCases.filter(row => row.y === 1).length;
  const curve = decisionFloors.map(floor => ({
    floor, ...evaluateDecisionPolicy(cases, floor, fpCost, fnCost, 0.25),
  }));
  const result = curve.find(point => point.floor === threshold)!;
  const pct = (v: number | null) => v === null ? (ko ? '해당 없음' : 'not applicable') : `${(v * 100).toFixed(1)}%`;
  const pointTitle = (point: typeof result, floorLabel: string) =>
    `${floorLabel} ${point.floor.toFixed(2)} · ${ko ? '자동 처리율' : 'Coverage'} ${pct(point.coverage)} · ${ko ? '선택 오류율' : 'Selective error'} ${pct(point.risk)}`;
  return <section className="decision-policy" aria-labelledby={`${id}-title`}>
    <h3 id={`${id}-title`}>{ko ? '자동 처리율과 오판 비용' : 'Coverage and decision cost'}</h3>
    <p>{ko ? '예측 점수와 자동 처리율이 그대로여도 오판은 늘어날 수 있을까요? 먼저 확률 보정이 나빠졌을 때의 결과를 살펴보세요.' : 'Could automatic decisions get worse while the scores and coverage stay the same? Start by switching on worse calibration.'}</p>
    <div className="decision-controls">
      <label>{ko ? '선택한 답의 확률 하한' : 'Minimum probability of chosen answer'}: <strong>{threshold.toFixed(2)}</strong>
        <input type="range" min="0.5" max="1" step="0.05" value={threshold} onChange={e => setThreshold(Number(e.target.value))} />
      </label>
      <label>{ko ? '거짓 양성 비용' : 'False-positive cost'}: <strong>{fpCost}</strong>
        <input type="range" min="1" max="20" step="1" value={fpCost} onChange={e => setFpCost(Number(e.target.value))} />
      </label>
      <label>{ko ? '거짓 음성 비용' : 'False-negative cost'}: <strong>{fnCost}</strong>
        <input type="range" min="1" max="20" step="1" value={fnCost} onChange={e => setFnCost(Number(e.target.value))} />
      </label>
      <label className="decision-shift"><input type="checkbox" checked={calibrationDrift} onChange={e => setCalibrationDrift(e.target.checked)} />{ko ? '확률 보정 악화' : 'Worse calibration'}</label>
    </div>
    <p aria-live="polite">{ko
      ? `전체 ${cases.length}건 중 양성은 ${positiveCount}건입니다. 양성 확률을 0.95로 예측한 ${highScoreCases.length}건 중 실제 양성은 ${highScorePositives}건입니다.`
      : `${positiveCount} of ${cases.length} cases are positive. Among the ${highScoreCases.length} scored 0.95, ${highScorePositives} are positive.`}</p>
    <p>{ko ? '비용에 따른 양성 판단 경계' : 'Cost-based positive threshold'}: <strong>{(fpCost / (fpCost + fnCost)).toFixed(3)}</strong>. {ko ? '선택한 답의 확률이 하한에 못 미치면 검토로 보냅니다. 검토는 정확하며 건당 0.25의 비용이 든다고 가정합니다.' : 'Cases below the floor go to review. Each review costs 0.25 units and is assumed to resolve the case correctly.'}</p>
    <p className="decision-note">{ko ? '테두리가 있는 큰 점이 선택한 하한의 결과입니다. 작은 점들은 각 하한의 결과이며 같은 위치에 겹치기도 합니다.' : 'The large outlined point marks the selected floor. Small points show each floor and can overlap when they give the same result.'}</p>
    <div className="decision-chart">
      <svg width="100%" height="240" role="img" aria-labelledby={`${id}-chart-title ${id}-chart-desc`}>
        <title id={`${id}-chart-title`}>{ko ? '자동 처리율 대비 선택 오류율' : 'Selective error rate versus coverage'}</title>
        <desc id={`${id}-chart-desc`}>{ko ? '확률 하한을 바꾼 점들을 표시합니다. 자동 처리 건이 없으면 오류율 점을 그리지 않습니다.' : 'Points vary the probability floor. No error-rate point is drawn when no cases are accepted.'}</desc>
        <line x1={coverageX(0)} y1="190" x2={coverageX(1)} y2="190" stroke="currentColor" /><line x1={coverageX(0)} y1="25" x2={coverageX(0)} y2="190" stroke="currentColor" />
        {[0, 0.5, 1].map(v => <g key={v}><text x={coverageX(v)} y="211" textAnchor="middle">{v * 100}%</text><text x={coverageX(0)} dx="-6" y={194 - 160 * v} textAnchor="end">{v * 100}%</text></g>)}
        <text x={coverageX(.5)} y="235" textAnchor="middle">{ko ? '자동 처리율' : 'Coverage'}</text><text x={coverageX(0)} y="17">{ko ? '선택 오류율' : 'Selective error rate'}</text>
        {curve.map(point => point.risk !== null && <circle key={point.floor} cx={coverageX(point.coverage)} cy={190 - 160 * point.risk} r="4" fill="#64748b">
          <title>{pointTitle(point, ko ? '확률 하한' : 'Floor')}</title>
        </circle>)}
        {result.risk !== null && <circle cx={coverageX(result.coverage)} cy={190 - 160 * result.risk} r="7" fill="#2563eb" stroke="currentColor" strokeWidth="2">
          <title>{pointTitle(result, ko ? '선택한 하한' : 'Selected floor')}</title>
        </circle>}
      </svg>
    </div>
    <dl className="decision-results" aria-live="polite">
      <div><dt>{ko ? '자동 처리 / 검토' : 'Accepted / reviewed'}</dt><dd>{result.accepted} / {result.reviewed}</dd></div>
      <div><dt>{ko ? '선택 오류율' : 'Selective error rate'}</dt><dd>{pct(result.risk)}</dd></div>
      <div><dt>{ko ? '거짓 양성 / 거짓 음성' : 'False positives / false negatives'}</dt><dd>{result.fp} / {result.fn}</dd></div>
      <div><dt>{ko ? '접수 건당 예측 비용 / 관측 비용' : 'Predicted / observed cost per incoming case'}</dt><dd>{result.expectedCost.toFixed(3)} / {result.observedCost.toFixed(3)}</dd></div>
    </dl>
    <p className="decision-note">{ko ? '이 책을 위해 만든 합성 사례와 임의의 비용 단위를 사용합니다. 하한은 선택한 답에 부여한 확률에 적용합니다. Jev의 confidence는 별도로 계산하는 지표입니다. 하한을 높였을 때 남은 사례의 오류율은 데이터에 따라 달라집니다.' : 'This exercise uses synthetic cases and costs in arbitrary units. The floor applies to the probability assigned to the chosen answer. Jev reports a separate confidence statistic. The error rate at a higher floor depends on which cases remain.'}</p>
  </section>;
}
