import React, { useMemo, useState } from 'react';
import './visualizers.css';

type Locale = 'en' | 'ko';

type Candidate = {
  id: number;
  trueScore: number;
  devScore: number;
  holdoutScore: number;
};

const copy = {
  en: {
    title: 'Self-improvement promotion gate',
    subtitle: 'Search on the development set, then make the release decision on a sealed holdout.',
    candidates: 'Candidate variants',
    devTasks: 'Development tasks',
    shift: 'Deployment shift',
    points: 'points',
    dev: 'development estimate',
    holdout: 'sealed holdout estimate',
    true: 'latent deployment quality',
    selected: 'Selected candidate',
    devGain: 'Apparent dev gain',
    holdoutGain: 'Holdout gain',
    optimism: 'Selection optimism',
    gate: 'Promotion decision',
    promote: 'PROMOTE',
    reject: 'REJECT',
    gateRule: 'Gate: the holdout 95% lower bound must exceed the baseline by 1 point.',
    lessonPromote: 'The candidate clears the independent release gate. Keep the evaluation manifest and rollback artifact with the promotion record.',
    lessonReject: 'The development winner does not clear the independent release gate. Archive the result, but do not deploy it.',
    axis: 'Estimated score',
    baseline: 'baseline',
    source: 'Deterministic teaching simulation. Scores are synthetic and do not describe a real model or benchmark.',
  },
  ko: {
    title: '자기 개선 승격 게이트',
    subtitle: '개발셋에서 탐색하고, 봉인된 홀드아웃에서 릴리스 여부를 결정합니다.',
    candidates: '후보 변형 수',
    devTasks: '개발 과업 수',
    shift: '배포 분포 이동',
    points: '점',
    dev: '개발셋 추정치',
    holdout: '봉인 홀드아웃 추정치',
    true: '잠재 배포 품질',
    selected: '선택된 후보',
    devGain: '겉으로 보이는 개발셋 향상',
    holdoutGain: '홀드아웃 향상',
    optimism: '선택 낙관 편향',
    gate: '승격 결정',
    promote: '승격',
    reject: '거절',
    gateRule: '게이트: 홀드아웃 95% 신뢰구간 하한이 기준선보다 1점 이상 높아야 합니다.',
    lessonPromote: '후보가 독립 릴리스 게이트를 통과했습니다. 평가 매니페스트와 롤백 아티팩트를 승격 기록에 함께 보존해야 합니다.',
    lessonReject: '개발셋 1위 후보가 독립 릴리스 게이트를 통과하지 못했습니다. 결과는 보관하되 배포하지 않습니다.',
    axis: '추정 점수',
    baseline: '기준선',
    source: '결정론적 교육용 시뮬레이션입니다. 점수는 합성 값이며 실제 모델이나 벤치마크를 나타내지 않습니다.',
  },
};

function unit(seed: number) {
  const x = Math.sin(seed * 91.731 + 17.17) * 43758.5453;
  return x - Math.floor(x);
}

function normalish(seed: number) {
  let total = 0;
  for (let i = 0; i < 6; i += 1) total += unit(seed + i * 13.7);
  // Quantize the deterministic pseudo-noise so SSR and browser math produce
  // byte-identical SVG attributes across JavaScript engines.
  return Number(((total - 3) * 1.414).toFixed(6));
}

export default function SelfImprovementGateVisualizer({ lang = 'en' }: { lang?: Locale }) {
  const [candidateCount, setCandidateCount] = useState(16);
  const [devTasks, setDevTasks] = useState(24);
  const [distributionShift, setDistributionShift] = useState(1.5);
  const t = copy[lang];
  const baseline = 60;
  const holdoutTasks = 200;

  const candidates = useMemo<Candidate[]>(() => {
    const devSe = 18 / Math.sqrt(devTasks);
    const holdoutSe = 10 / Math.sqrt(holdoutTasks);

    return Array.from({ length: candidateCount }, (_, index) => {
      const trueDelta = 0.6 + 2.2 * normalish(index * 31 + 7);
      const trueScore = baseline + trueDelta - distributionShift;
      return {
        id: index + 1,
        trueScore,
        devScore: baseline + trueDelta + devSe * normalish(index * 43 + 101),
        holdoutScore: trueScore + holdoutSe * normalish(index * 59 + 211),
      };
    });
  }, [candidateCount, devTasks, distributionShift]);

  const selected = candidates.reduce((best, row) => (row.devScore > best.devScore ? row : best));
  const holdoutSe = 10 / Math.sqrt(holdoutTasks);
  const lowerBound = selected.holdoutScore - 1.96 * holdoutSe;
  const promoted = lowerBound > baseline + 1;
  const optimism = selected.devScore - selected.holdoutScore;

  const width = 760;
  const height = 310;
  const margin = { left: 58, right: 24, top: 28, bottom: 48 };
  const values = candidates.flatMap((row) => [row.devScore, row.holdoutScore]);
  const minScore = Math.floor(Math.min(baseline - 3, ...values) / 5) * 5;
  const maxScore = Math.ceil(Math.max(baseline + 3, ...values) / 5) * 5;
  const x = (index: number) => margin.left + (index / Math.max(1, candidateCount - 1)) * (width - margin.left - margin.right);
  const y = (score: number) => margin.top + ((maxScore - score) / (maxScore - minScore)) * (height - margin.top - margin.bottom);
  const ticks = Array.from({ length: Math.round((maxScore - minScore) / 5) + 1 }, (_, i) => minScore + i * 5);

  return (
    <section className="self-improvement-gate" aria-labelledby="self-improvement-gate-title">
      <header>
        <h3 id="self-improvement-gate-title">{t.title}</h3>
        <p>{t.subtitle}</p>
      </header>

      <div className="self-improvement-controls" aria-label={t.title}>
        <label>
          <span>{t.candidates}: <strong>{candidateCount}</strong></span>
          <input type="range" min="4" max="48" step="4" value={candidateCount} onChange={(event) => setCandidateCount(Number(event.target.value))} />
        </label>
        <label>
          <span>{t.devTasks}: <strong>{devTasks}</strong></span>
          <input type="range" min="8" max="160" step="8" value={devTasks} onChange={(event) => setDevTasks(Number(event.target.value))} />
        </label>
        <label>
          <span>{t.shift}: <strong>{distributionShift.toFixed(1)} {t.points}</strong></span>
          <input type="range" min="0" max="6" step="0.5" value={distributionShift} onChange={(event) => setDistributionShift(Number(event.target.value))} />
        </label>
      </div>

      <div className="self-improvement-chart" role="img" aria-label={`${t.dev}: ${selected.devScore.toFixed(1)}, ${t.holdout}: ${selected.holdoutScore.toFixed(1)}`}>
        <svg viewBox={`0 0 ${width} ${height}`}>
          <title>{t.title}</title>
          {ticks.map((tick) => (
            <g key={tick}>
              <line x1={margin.left} x2={width - margin.right} y1={y(tick)} y2={y(tick)} className="self-improvement-grid" />
              <text x={margin.left - 10} y={y(tick) + 4} textAnchor="end" className="self-improvement-tick">{tick}</text>
            </g>
          ))}
          <line x1={margin.left} x2={width - margin.right} y1={y(baseline)} y2={y(baseline)} className="self-improvement-baseline" />
          <text x={width - margin.right} y={y(baseline) - 7} textAnchor="end" className="self-improvement-baseline-label">{t.baseline} {baseline}</text>
          {candidates.map((row, index) => {
            const isSelected = row.id === selected.id;
            return (
              <g key={row.id} className={isSelected ? 'is-selected' : ''}>
                <line x1={x(index)} x2={x(index)} y1={y(row.devScore)} y2={y(row.holdoutScore)} className="self-improvement-gap" />
                <circle cx={x(index)} cy={y(row.holdoutScore)} r={isSelected ? 6 : 3.5} className="self-improvement-holdout" />
                <rect x={x(index) - (isSelected ? 5 : 3)} y={y(row.devScore) - (isSelected ? 5 : 3)} width={isSelected ? 10 : 6} height={isSelected ? 10 : 6} transform={`rotate(45 ${x(index)} ${y(row.devScore)})`} className="self-improvement-dev" />
              </g>
            );
          })}
          <text x={width / 2} y={height - 10} textAnchor="middle" className="self-improvement-axis">{t.candidates}</text>
          <text x="16" y={height / 2} textAnchor="middle" transform={`rotate(-90 16 ${height / 2})`} className="self-improvement-axis">{t.axis}</text>
        </svg>
      </div>

      <div className="self-improvement-legend" aria-hidden="true">
        <span><i className="dev-marker" />{t.dev}</span>
        <span><i className="holdout-marker" />{t.holdout}</span>
      </div>

      <dl className="self-improvement-stats">
        <div><dt>{t.selected}</dt><dd>#{selected.id}</dd></div>
        <div><dt>{t.devGain}</dt><dd>{(selected.devScore - baseline).toFixed(1)} {t.points}</dd></div>
        <div><dt>{t.holdoutGain}</dt><dd>{(selected.holdoutScore - baseline).toFixed(1)} {t.points}</dd></div>
        <div><dt>{t.optimism}</dt><dd>{optimism.toFixed(1)} {t.points}</dd></div>
        <div className={promoted ? 'gate-pass' : 'gate-fail'}><dt>{t.gate}</dt><dd>{promoted ? t.promote : t.reject}</dd></div>
      </dl>

      <p className="self-improvement-rule">{t.gateRule}</p>
      <p className="self-improvement-lesson">{promoted ? t.lessonPromote : t.lessonReject}</p>
      <p className="self-improvement-source">{t.source}</p>
    </section>
  );
}
