import React, { useState } from 'react';
import './visualizers.css';

export default function ChinchillaAllocator({ locale = 'en' }: { locale?: 'en' | 'ko' }) {
  const ko = locale === 'ko';
  const [compute, setCompute] = useState(.1);
  // N,D in billions; C in 10^21 FLOPs. Fixed illustrative D=20N gives C=.12N².
  const parameters = Math.sqrt(compute / .12), tokens = 20 * parameters;
  return <section className="chinchilla-container">
    <h3>{ko ? '고정 토큰 비율의 계산 예산 배분' : 'Allocate compute at a fixed token ratio'}</h3>
    <p>{ko ? 'C ≈ 6ND, D = 20N을 가정한 교육용 계산입니다. 20:1은 모든 모델·데이터·배포 목적의 보편적 최적값이 아닙니다.' : 'Educational calculation assuming C ≈ 6ND and D = 20N. The 20:1 token ratio is not a universal optimum across models, data or deployment objectives.'}</p>
    <label>{ko ? '계산 예산' : 'Compute budget'}: <strong>{compute.toFixed(3)} × 10²¹ FLOPs</strong><input type="range" min="0.001" max="10" step="0.001" value={compute} onChange={e => setCompute(Number(e.target.value))} /></label>
    <div className="chinchilla-results" aria-live="polite"><div className="result-card"><h4>{ko ? '파라미터 N' : 'Parameters N'}</h4><div className="result-value">{parameters.toFixed(3)} B</div></div><div className="result-card"><h4>{ko ? '학습 토큰 D' : 'Training tokens D'}</h4><div className="result-value">{tokens.toFixed(3)} B</div></div></div>
    <p>{ko ? 'B는 10⁹개입니다. 따라서 이 단위에서 C = 0.12N²입니다. 표시값은 반올림하지만 내부 계산은 반올림하지 않습니다. FLOPs는 연산량이며 FLOP/s 처리량이나 소요 시간이 아닙니다.' : 'B denotes 10⁹. In these units C = 0.12N². Display values are rounded; internal calculations are not. FLOPs measure operation count, not FLOP/s throughput or elapsed time.'}</p>
    <p>{ko ? '이 모형은 dense 학습의 근사 계산만 다루며 어텐션 길이·MoE 활성 전문가·통신·평가·체크포인트 비용은 생략합니다. 실제 배분은 고정 보류셋의 손실 곡선과 총 학습·서빙 비용으로 정하세요.' : 'This is a dense-training compute approximation; sequence-length attention, active MoE experts, communication, evaluation and checkpoints are omitted. Choose real allocations using held-out loss curves and total training/serving cost.'}</p>
  </section>;
}
