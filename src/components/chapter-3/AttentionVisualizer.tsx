import React, { useState, useEffect } from 'react';
import './visualizers.css';

interface AttentionVisualizerProps {
  lang?: 'en' | 'ko';
}

export default function AttentionVisualizer({ lang = 'en' }: AttentionVisualizerProps) {
  const sentence = "The animal didn't cross the street because it was too tired".split(" ");
  const [selectedWord, setSelectedWord] = useState(7); // Default to 'it'

  // Simulated attention weights for "it" (index 7)
  const attentionData: { [key: number]: { [key: string]: number } } = {
    7: { "The": 0.01, "animal": 0.45, "didn't": 0.02, "cross": 0.05, "the": 0.01, "street": 0.15, "because": 0.01, "it": 0.20, "was": 0.02, "too": 0.03, "tired": 0.05 }
  };

  const getDefaultWeights = () => {
    const obj: { [key: string]: number } = {};
    sentence.forEach(w => obj[w] = 1 / sentence.length);
    return obj;
  };

  const weights = attentionData[selectedWord] || getDefaultWeights();

  const labels = {
    en: {
      title: "Sentence: \"The animal didn't cross the street because it was too tired.\"",
      subtitle: "Selected Word Attends To:",
      hint: "Click on a word to see its attention weights."
    },
    ko: {
      title: "문장: \"The animal didn't cross the street because it was too tired.\"",
      subtitle: "선택된 단어가 주목하는 대상:",
      hint: "단어를 클릭하여 어텐션 가중치를 확인하세요."
    }
  };

  const t = labels[lang] || labels.en;

  return (
    <div className="glass-container" style={{ padding: '20px', marginTop: '2rem', marginBottom: '2rem' }}>
      <div style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '10px', color: '#1e293b' }}>
        {t.title}
      </div>
      <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#7f8c8d', marginBottom: '20px' }}>
        {t.hint}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
        {sentence.map((word, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedWord(idx)}
            className={`tv-btn ${selectedWord === idx ? 'tv-btn-active' : ''}`}
            style={{
              backgroundColor: selectedWord === idx ? '#8e44ad' : 'white',
              color: selectedWord === idx ? 'white' : '#1e293b',
              fontWeight: selectedWord === idx ? 'bold' : 'normal',
              border: '1px solid #ccc',
              padding: '5px 10px',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {word}
          </button>
        ))}
      </div>

      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <div style={{ fontSize: '0.9rem', color: '#7f8c8d', marginBottom: '10px' }}>{t.subtitle}</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap', alignItems: 'flex-end', height: '120px' }}>
          {sentence.map((w, idx) => {
            const weight = weights[w] || 0;
            return (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: '#7f8c8d' }}>{(weight * 100).toFixed(0)}%</span>
                <div
                  style={{
                    width: '30px',
                    height: `${weight * 100}px`,
                    backgroundColor: '#8e44ad',
                    borderRadius: '2px',
                    marginTop: '5px',
                    transition: 'height 0.3s ease',
                    opacity: selectedWord === 7 && w === 'animal' ? 1 : 0.7
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
