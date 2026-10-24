import React, { useId, useState } from 'react';
import { decisionCases, evaluateDecisionPolicy } from '../../utils/decision-policy.js';
import './decision-policy.css';

export default function DecisionPolicyExplorer({ locale = 'en' }: { locale?: 'en' | 'ko' }) {
  const ko = locale === 'ko';
  const id = useId();
  const [threshold, setThreshold] = useState(0.8);
  const [fpCost, setFpCost] = useState(5);
  const [fnCost, setFnCost] = useState(1);
  const [shifted, setShifted] = useState(false);
  const cases = decisionCases(shifted);
  const result = evaluateDecisionPolicy(cases, threshold, fpCost, fnCost, 0.25);
  const curve = Array.from({ length: 11 }, (_, i) => evaluateDecisionPolicy(cases, 0.5 + i * 0.05, fpCost, fnCost, 0.25));
  const pct = (v: number | null) => v === null ? (ko ? '해당 없음' : 'not applicable') : `${(v * 100).toFixed(1)}%`;
  return <section className="decision-policy" aria-labelledby={`${id}-title`}>
    <h3 id={`${id}-title`}>{ko ? '자동 처리율과 오판 비용' : 'Coverage and decision cost'}</h3>
    <p>{ko ? '합성 사례 100개의 예측 확률은 그대로 두고 정답 분포만 바꿔 보세요. 확신이 같아도 운영 비용은 달라집니다.' : 'Keep the predicted probabilities of 100 synthetic cases fixed while changing the labels. Equal confidence can hide a different operational cost.'}</p>
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
      <label className="decision-shift"><input type="checkbox" checked={shifted} onChange={e => setShifted(e.target.checked)} />{ko ? '정답 분포 이동: 과도한 확신' : 'Label shift: overconfident predictions'}</label>
    </div>
    <p>{ko ? '비용에 따른 양성 판단 경계' : 'Cost-based positive threshold'}: <strong>{(fpCost / (fpCost + fnCost)).toFixed(3)}</strong>. {ko ? '그다음 확률 하한 미달 건은 검토로 보냅니다. 검토는 정확하다고 가정하며 건당 비용은 0.25입니다. 비용 단위는 임의 단위입니다.' : 'The probability floor then sends rejected cases to review. Review is assumed correct and costs 0.25 per case. Costs use arbitrary units.'}</p>
    <p className="decision-note">{ko ? '좁은 화면에서는 그래프를 가로로 스크롤할 수 있습니다. 아래 수치에도 현재 정책의 결과를 표시합니다.' : 'Scroll the chart horizontally on a narrow screen. The values below also report the current policy.'}</p>
    <div className="decision-chart" role="region" aria-label={ko ? '자동 처리율과 선택 오류율 그래프' : 'Coverage and selective error chart'} tabIndex={0}>
      <svg viewBox="0 0 600 240" role="img" aria-labelledby={`${id}-chart-title ${id}-chart-desc`}>
        <title id={`${id}-chart-title`}>{ko ? '자동 처리율 대비 선택 오류율' : 'Selective error rate versus coverage'}</title>
        <desc id={`${id}-chart-desc`}>{ko ? '확률 하한을 바꾼 점들을 표시합니다. 자동 처리 건이 없으면 오류율 점을 그리지 않습니다.' : 'Points vary the probability floor. No error-rate point is drawn when no cases are accepted.'}</desc>
        <line x1="62" y1="190" x2="570" y2="190" stroke="currentColor" /><line x1="62" y1="25" x2="62" y2="190" stroke="currentColor" />
        {[0, 0.5, 1].map(v => <g key={v}><text x={62 + 500 * v} y="211" textAnchor="middle">{v * 100}%</text><text x="53" y={194 - 160 * v} textAnchor="end">{v * 100}%</text></g>)}
        <text x="320" y="235" textAnchor="middle">{ko ? '자동 처리율' : 'Coverage'}</text><text x="65" y="17">{ko ? '선택 오류율' : 'Selective error rate'}</text>
        {curve.filter(x => x.risk !== null).map((x, i) => <circle key={i} cx={62 + 500 * x.coverage} cy={190 - 160 * x.risk!} r="4" fill="#64748b" />)}
        {result.risk !== null && <circle cx={62 + 500 * result.coverage} cy={190 - 160 * result.risk} r="7" fill="#2563eb" stroke="currentColor" strokeWidth="2" />}
      </svg>
    </div>
    <dl className="decision-results" aria-live="polite">
      <div><dt>{ko ? '자동 처리 / 검토' : 'Accepted / reviewed'}</dt><dd>{result.accepted} / {result.reviewed}</dd></div>
      <div><dt>{ko ? '선택 오류율' : 'Selective error rate'}</dt><dd>{pct(result.risk)}</dd></div>
      <div><dt>{ko ? '거짓 양성 / 거짓 음성' : 'False positives / false negatives'}</dt><dd>{result.fp} / {result.fn}</dd></div>
      <div><dt>{ko ? '예측 비용 / 실제 비용' : 'Predicted / observed cost'}</dt><dd>{result.expectedCost.toFixed(3)} / {result.observedCost.toFixed(3)}</dd></div>
    </dl>
    <p className="decision-note">{ko ? '직접 만든 고정 합성 데이터·교육용 비용 모형, 2026-10-25. 특정 제공사의 성능 측정이 아닙니다. 이 하한은 선택한 클래스의 확률이며 Jev의 confidence 필드와 다릅니다. 높은 하한이 모든 분포에서 낮은 오류율을 보장하지 않습니다.' : 'Deterministic synthetic data and an educational cost model, 2026-10-25; not provider measurements. This floor uses the chosen class probability, not Jev’s confidence field. A higher floor does not guarantee lower error under every distribution.'}</p>
  </section>;
}
