import React, { useState } from 'react';
import './visualizers.css';

interface RnnMemoryVisualizerProps {
  lang?: 'en' | 'ko';
}

export default function RnnMemoryVisualizer({ lang = 'en' }: RnnMemoryVisualizerProps) {
  const [step, setStep] = useState(0);

  const words = ["The", "cat", "sat", "on", "the", "mat"];

  const memoryData = [
    [1.0], // Step 0: "The"
    [0.6, 1.0], // Step 1: "cat"
    [0.3, 0.6, 1.0], // Step 2: "sat"
    [0.1, 0.3, 0.6, 1.0], // Step 3: "on"
    [0.05, 0.1, 0.3, 0.6, 1.0], // Step 4: "the"
    [0.01, 0.05, 0.1, 0.3, 0.6, 1.0] // Step 5: "mat"
  ];

  const labels = {
    en: {
      title: "Sentence: \"The cat sat on the mat.\"",
      subtitle: "Illustrative retention strength:",
      step: "Step"
    },
    ko: {
      title: "문장: \"The cat sat on the mat.\"",
      subtitle: "설명용 기억 강도:",
      step: "단계"
    }
  };

  const t = labels[lang] || labels.en;

  return (
    <div className="glass-container" style={{ padding: '20px', marginTop: '2rem', marginBottom: '2rem' }}>
      <div style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '20px', color: '#1e293b' }}>
        {t.title}
        <p style={{fontSize: "0.85rem", fontWeight: 400}}>{lang === "ko" ? "설명용 기억 강도이며 은닉 상태에서 측정한 비율이 아닙니다. RNN이 항상 단조롭게 잊는 것은 아닙니다." : "Authored retention strengths, not measured percentages of a hidden state. RNNs need not forget monotonically."}</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {words.map((word, idx) => (
          <button
            key={idx}
            onClick={() => setStep(idx)}
            className={`tv-btn ${step === idx ? 'tv-btn-active' : ''}`}
            style={{
              backgroundColor: step === idx ? '#8e44ad' : idx < step ? '#e1bee7' : 'white',
              color: step === idx ? 'white' : 'black',
              fontWeight: step === idx ? 'bold' : 'normal',
              border: '1px solid #ccc',
              padding: '5px 10px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {word}
          </button>
        ))}
      </div>

      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <div style={{ fontSize: '0.9rem', color: '#7f8c8d', marginBottom: '10px' }}>{t.subtitle}</div>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '15px', alignItems: 'flex-end', minHeight: '120px' }}>
          {words.map((w, idx) => {
            if (idx > step) return null;
            const weight = memoryData[step][idx];
            return (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: '#7f8c8d' }}>{weight.toFixed(2)}</span>
                <div
                  style={{
                    width: '30px',
                    height: `${weight * 80}px`,
                    backgroundColor: '#8e44ad',
                    borderRadius: '2px',
                    marginTop: '5px',
                    transition: 'height 0.3s ease'
                  }}
                />
                <span style={{ fontSize: '0.9rem', marginTop: '5px', color: '#1e293b' }}>{w}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
