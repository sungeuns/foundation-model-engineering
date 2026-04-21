import React, { useState } from 'react';
import './visualizers.css';

interface Props {
  lang?: string;
}

const InferenceScalingVisualizer: React.FC<Props> = ({ lang = 'en' }) => {
  const [computeBudget, setComputeBudget] = useState<number>(10);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');

  // Simulated performance calculation based on Inference-Time Scaling Laws
  const calculatePerformance = (baseScore: number, scalingFactor: number) => {
    let diffMultiplier = 1.0;
    if (difficulty === 'Easy') diffMultiplier = 0.2;
    if (difficulty === 'Hard') diffMultiplier = 1.8;

    const score = baseScore + scalingFactor * diffMultiplier * Math.log10(computeBudget);
    return Math.min(Math.max(score, 0), 100).toFixed(1);
  };

  const smallModelScore = calculatePerformance(30, 25);
  const largeModelScore = calculatePerformance(65, 10);

  const insights = {
    en: {
      Easy: "On easy problems, small models achieve sufficient performance with low compute, and the gap with large models is small.",
      Medium: "On medium difficulty, increasing test-time compute allows the small model to begin overtaking the large model's zero-shot performance.",
      Hard: "On hard problems, the effect of test-time compute is maximized; if the small model has enough 'thinking time', it can overwhelm a much larger model."
    },
    ko: {
      Easy: "쉬운 문제에서는 작은 모델도 적은 연산량으로 충분한 성능을 내며, 큰 모델과의 격차가 적습니다.",
      Medium: "중간 난이도에서는 Test-Time Compute를 늘릴수록 작은 모델이 큰 모델의 Zero-shot 성능을 역전하기 시작합니다.",
      Hard: "어려운 문제에서는 Test-Time Compute의 효과가 극대화되어, 작은 모델이 충분한 '생각할 시간'을 가지면 훨씬 거대한 모델을 압도할 수 있습니다."
    }
  };

  const currentInsights = insights[lang as keyof typeof insights] || insights.en;

  return (
    <div className="visualizer-container">
      <h4 className="visualizer-title">Inference-Time Scaling Simulator</h4>
      <div className="visualizer-controls">
        <div className="control-group">
          <label>Test-Time Compute Budget (N or Thinking Tokens): {computeBudget}</label>
          <input 
            type="range" 
            min="1" 
            max="100" 
            value={computeBudget} 
            onChange={(e) => setComputeBudget(Number(e.target.value))}
            className="slider"
          />
        </div>
        <div className="control-group">
          <label>Prompt Difficulty:</label>
          <div className="button-group">
            <button 
              className={difficulty === 'Easy' ? 'active' : ''} 
              onClick={() => setDifficulty('Easy')}
            >Easy</button>
            <button 
              className={difficulty === 'Medium' ? 'active' : ''} 
              onClick={() => setDifficulty('Medium')}
            >Medium</button>
            <button 
              className={difficulty === 'Hard' ? 'active' : ''} 
              onClick={() => setDifficulty('Hard')}
            >Hard</button>
          </div>
        </div>
      </div>

      <div className="chart-container">
        <div className="bar-group">
          <span className="bar-label">Small Model (7B) + Test-Time Compute</span>
          <div className="bar-track">
            <div className="bar-fill small-model" style={{ width: `${smallModelScore}%` }}>
              {smallModelScore}%
            </div>
          </div>
        </div>
        
        <div className="bar-group">
          <span className="bar-label">Large Model (70B) Zero-Shot (No Extra Compute)</span>
          <div className="bar-track">
            <div className="bar-fill large-model" style={{ width: `${largeModelScore}%` }}>
              {largeModelScore}%
            </div>
          </div>
        </div>
      </div>
      
      <div className="visualizer-insight">
        <strong>Insight:</strong> {currentInsights[difficulty]}
      </div>
    </div>
  );
};

export default InferenceScalingVisualizer;