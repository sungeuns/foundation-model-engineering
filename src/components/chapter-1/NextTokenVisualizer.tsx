import React, { useState } from 'react';
import './visualizers.css';

const data: Record<string, Record<string, { word: string; prob: number }[]>> = {
  en: {
    sky: [
      { word: "blue", prob: 0.75 },
      { word: "dark", prob: 0.15 },
      { word: "cloudy", prob: 0.05 },
      { word: "falling", prob: 0.01 }
    ],
    capital: [
      { word: "Paris", prob: 0.98 },
      { word: "London", prob: 0.01 },
      { word: "huge", prob: 0.005 },
      { word: "beautiful", prob: 0.002 }
    ],
    deep: [
      { word: "neural", prob: 0.45 },
      { word: "networks", prob: 0.35 },
      { word: "data", prob: 0.10 },
      { word: "learning", prob: 0.05 }
    ]
  },
  ko: {
    sky: [
      { word: "파랗다", prob: 0.75 },
      { word: "어둡다", prob: 0.15 },
      { word: "흐리다", prob: 0.05 },
      { word: "높다", prob: 0.01 }
    ],
    capital: [
      { word: "파리", prob: 0.98 },
      { word: "런던", prob: 0.01 },
      { word: "크다", prob: 0.005 },
      { word: "아름답다", prob: 0.002 }
    ],
    deep: [
      { word: "신경망", prob: 0.45 },
      { word: "데이터", prob: 0.35 },
      { word: "학습", prob: 0.10 },
      { word: "인공지능", prob: 0.05 }
    ]
  }
};

interface Props {
  lang?: 'en' | 'ko';
}

export const NextTokenVisualizer = ({ lang = 'en' }: Props) => {
  const [prompt, setPrompt] = useState('sky');

  const sentences = data[lang] || data['en'];
  const predictions = sentences[prompt];

  const allLabels = {
    en: {
      title: "Next Token Prediction",
      desc: "Select a prompt to see simulated probabilities for the next word.",
      select: "Select a Prompt:",
      subtitle: "Top Predicted Next Tokens:",
      prompts: {
        sky: "The sky is ...",
        capital: "The capital of France is ...",
        deep: "Deep learning is based on ..."
      }
    },
    ko: {
      title: "다음 토큰 예측",
      desc: "프롬프트를 선택하여 다음 단어의 시뮬레이션된 확률을 확인하세요.",
      select: "프롬프트 선택:",
      subtitle: "가장 높은 확률의 다음 토큰들:",
      prompts: {
        sky: "하늘은 ...",
        capital: "프랑스의 수도는 ...",
        deep: "딥러닝은 ... 기반이다"
      }
    }
  };

  const labels = allLabels[lang] || allLabels['en'];

  return (
    <div className="viz-container glassmorphism">
      <h3 className="viz-title">{labels.title}</h3>
      <p className="viz-description">{labels.desc}</p>
      
      <div className="viz-controls centered">
        <label style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{labels.select}</label>
        <select value={prompt} onChange={(e) => setPrompt(e.target.value)} className="viz-select">
          <option value="sky">{labels.prompts.sky}</option>
          <option value="capital">{labels.prompts.capital}</option>
          <option value="deep">{labels.prompts.deep}</option>
        </select>
      </div>

      <div className="viz-display list-display">
        <div className="viz-subtitle">{labels.subtitle}</div>
        <div className="viz-list">
          {predictions.map((p, index) => (
            <div key={index} className="viz-list-item">
              <div className="viz-list-item-content">
                <span className="viz-word">"{p.word}"</span>
                <div className="viz-bar-container">
                  <div className="viz-bar" style={{ width: `${p.prob * 100}%` }}></div>
                </div>
              </div>
              <span className="viz-prob">{(p.prob * 100).toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
