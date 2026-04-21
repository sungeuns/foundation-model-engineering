import React, { useState } from 'react';
import './visualizers.css';

interface CnnVisualizerProps {
  lang?: 'en' | 'ko';
}

export default function CnnVisualizer({ lang = 'en' }: CnnVisualizerProps) {
  const [pos, setPos] = useState(0);

  const text = "This movie was not good at all".split(" ");
  // Simulated scores for a filter looking for negative sentiment (e.g., "not good")
  const scores = [0.1, 0.2, 0.3, 0.9, 0.4, 0.2]; // 6 positions for window size 3

  const maxVal = Math.max(...scores);

  const labels = {
    en: {
      title: "Sentence: \"This movie was not good at all.\"",
      slider: "Slide Filter Position:",
      output: "Feature Map Output:",
      maxPool: "Max Pooled Value:"
    },
    ko: {
      title: "문장: \"This movie was not good at all.\"",
      slider: "필터 위치 슬라이드:",
      output: "피처 맵 출력:",
      maxPool: "맥스 풀링된 값:"
    }
  };

  const t = labels[lang] || labels.en;

  return (
    <div className="glass-container" style={{ padding: '20px', marginTop: '2rem', marginBottom: '2rem' }}>
      <div style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '20px', color: '#1e293b' }}>
        {t.title}
      </div>

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <label style={{ color: '#475569', marginRight: '10px' }}>{t.slider}</label>
        <input
          type="range"
          min="0"
          max="5"
          step="1"
          value={pos}
          onChange={(e) => setPos(parseInt(e.target.value))}
          style={{ width: '50%', verticalAlign: 'middle' }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '5px', marginTop: '20px' }}>
        {text.map((word, idx) => {
          const isActive = idx >= pos && idx < pos + 3;
          return (
            <span
              key={idx}
              style={{
                padding: '5px 10px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                backgroundColor: isActive ? '#8e44ad' : 'white',
                color: isActive ? 'white' : '#1e293b',
                fontWeight: isActive ? 'bold' : 'normal',
                transition: 'all 0.2s ease'
              }}
            >
              {word}
            </span>
          );
        })}
      </div>

      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <div style={{ fontSize: '0.9rem', color: '#7f8c8d', marginBottom: '10px' }}>{t.output}</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          {scores.map((score, idx) => (
            <div
              key={idx}
              style={{
                padding: '5px 10px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                borderColor: idx === pos ? '#8e44ad' : '#ccc',
                borderWidth: idx === pos ? '2px' : '1px',
                fontWeight: idx === pos ? 'bold' : 'normal',
                backgroundColor: 'white',
                color: '#1e293b',
                transition: 'all 0.2s ease'
              }}
            >
              {score.toFixed(1)}
            </div>
          ))}
        </div>
        <div style={{ marginTop: '15px', fontWeight: 'bold', color: '#8e44ad' }}>
          {t.maxPool} <span>{maxVal.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
}
