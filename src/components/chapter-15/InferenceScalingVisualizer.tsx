import React, { useMemo, useState } from 'react';
import './visualizers.css';

type Difficulty = 'easy' | 'medium' | 'hard';
type Props = { lang?: 'en' | 'ko' };

const copy = {
  en: {
    title: 'Test-time budget allocation: a toy model',
    caveat: 'Illustrative dynamics—not benchmark results. The curves make the assumptions below explicit.',
    budget: 'Relative compute budget',
    verifier: 'Verifier reliability',
    difficulty: 'Problem difficulty',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    coverage: 'At least one useful candidate',
    selected: 'Useful candidate selected',
    cost: 'Compute cost index',
    insight: 'Interpretation',
    messages: {
      easy: 'Coverage saturates early. A large fixed budget mostly buys redundant samples.',
      medium: 'Extra candidates help until coverage saturates; verifier errors then become the binding constraint.',
      hard: 'Budget helps only if the generator has a non-zero chance of producing a useful path. Search cannot supply missing knowledge.',
    },
  },
  ko: {
    title: 'Test-time budget allocation: 모형 시뮬레이션',
    caveat: 'Benchmark 결과가 아닌 설명용 모형입니다. 아래 곡선은 가정을 명시적으로 보여줍니다.',
    budget: '상대 compute budget',
    verifier: 'Verifier 신뢰도',
    difficulty: '문제 난이도',
    easy: '쉬움',
    medium: '중간',
    hard: '어려움',
    coverage: '유용한 candidate가 하나 이상 존재',
    selected: '유용한 candidate를 실제로 선택',
    cost: 'Compute cost index',
    insight: '해석',
    messages: {
      easy: 'Coverage가 일찍 포화합니다. 큰 고정 budget은 대부분 중복 sample에 쓰입니다.',
      medium: 'Coverage가 포화하기 전까지 candidate 추가가 유효하며, 이후에는 verifier 오류가 병목이 됩니다.',
      hard: 'Generator가 유용한 경로를 만들 확률이 0보다 클 때만 budget이 도움이 됩니다. Search는 없는 지식을 만들어 내지 못합니다.',
    },
  },
};

const InferenceScalingVisualizer: React.FC<Props> = ({ lang = 'en' }) => {
  const [budget, setBudget] = useState(24);
  const [verifier, setVerifier] = useState(82);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const t = copy[lang];

  const metrics = useMemo(() => {
    const scale = { easy: 5, medium: 22, hard: 65 }[difficulty];
    const ceiling = { easy: 0.99, medium: 0.9, hard: 0.62 }[difficulty];
    const coverage = ceiling * (1 - Math.exp(-budget / scale));
    const selected = coverage * (verifier / 100);
    return {
      coverage: (coverage * 100).toFixed(1),
      selected: (selected * 100).toFixed(1),
      cost: budget.toFixed(0),
    };
  }, [budget, verifier, difficulty]);

  return (
    <div className="visualizer-container">
      <h4 className="visualizer-title">{t.title}</h4>
      <p>{t.caveat}</p>
      <div className="visualizer-controls">
        <div className="control-group">
          <label htmlFor="inference-budget">{t.budget}: {budget}</label>
          <input id="inference-budget" className="slider" type="range" min="1" max="100" value={budget}
            onChange={(event) => setBudget(Number(event.target.value))} />
        </div>
        <div className="control-group">
          <label htmlFor="verifier-reliability">{t.verifier}: {verifier}%</label>
          <input id="verifier-reliability" className="slider" type="range" min="50" max="100" value={verifier}
            onChange={(event) => setVerifier(Number(event.target.value))} />
        </div>
        <div className="control-group">
          <span>{t.difficulty}:</span>
          <div className="button-group" role="group" aria-label={t.difficulty}>
            {(['easy', 'medium', 'hard'] as Difficulty[]).map((level) => (
              <button key={level} type="button" aria-pressed={difficulty === level}
                className={difficulty === level ? 'active' : ''} onClick={() => setDifficulty(level)}>
                {t[level]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="chart-container" aria-live="polite">
        <div className="bar-group">
          <span className="bar-label">{t.coverage}: {metrics.coverage}%</span>
          <div className="bar-track"><div className="bar-fill small-model" style={{ width: metrics.coverage + '%' }} /></div>
        </div>
        <div className="bar-group">
          <span className="bar-label">{t.selected}: {metrics.selected}%</span>
          <div className="bar-track"><div className="bar-fill large-model" style={{ width: metrics.selected + '%' }} /></div>
        </div>
        <div className="bar-group">
          <span className="bar-label">{t.cost}: {metrics.cost}/100</span>
          <div className="bar-track"><div className="bar-fill" style={{ width: metrics.cost + '%' }} /></div>
        </div>
      </div>

      <div className="visualizer-insight"><strong>{t.insight}:</strong> {t.messages[difficulty]}</div>
    </div>
  );
};

export default InferenceScalingVisualizer;
