import React, { useState } from 'react';
import './visualizers.css';

interface TranslationVisualizerProps {
  lang?: 'en' | 'ko';
}

export const TranslationVisualizer = ({ lang = 'en' }: TranslationVisualizerProps) => {
  const enWords = ["The", "cat", "sat", "on", "the", "mat"];
  const frWords = ["Le", "chat", "était", "assis", "sur", "le", "tapis"];
  
  const alignData = [
      [0.8, 0.05, 0.05, 0.02, 0.05, 0.03], // Le -> The
      [0.05, 0.85, 0.02, 0.03, 0.02, 0.03], // chat -> cat
      [0.02, 0.03, 0.70, 0.10, 0.10, 0.05], // était -> sat
      [0.02, 0.03, 0.60, 0.20, 0.10, 0.05], // assis -> sat
      [0.01, 0.01, 0.03, 0.90, 0.03, 0.02], // sur -> on
      [0.02, 0.02, 0.03, 0.03, 0.80, 0.10], // le -> the
      [0.01, 0.02, 0.02, 0.05, 0.10, 0.80]  // tapis -> mat
  ];

  const [selectedFrIdx, setSelectedFrIdx] = useState(1); // Default to "chat"

  const currentAlignData = alignData[selectedFrIdx];

  const labels = {
    en: {
      title: "Attention Alignment Visualizer",
      subtitle: "Click on a French word (Target) to see which English words (Source) the model focused on.",
      source: "English (Source):",
      target: "French (Target):",
      weight: "Attention Weight on English Words:"
    },
    ko: {
      title: "어텐션 정렬 시각화",
      subtitle: "프랑스어 단어(대상)를 클릭하여 모델이 어떤 영어 단어(원본)에 집중했는지 확인하세요.",
      source: "영어 (원본):",
      target: "프랑스어 (대상):",
      weight: "영어 단어에 대한 어텐션 가중치:"
    }
  };

  const t = labels[lang] || labels.en;

  return (
    <div className="glass-container" style={{ padding: '20px', marginTop: '2rem', marginBottom: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h3 style={{ color: '#1e293b', marginBottom: '5px' }}>{t.title}</h3>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{t.subtitle}</p>
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <div style={{ fontWeight: 'bold', color: '#475569', marginBottom: '5px' }}>{t.source}</div>
        <div style={{ padding: '10px', background: 'rgba(255,255,255,0.5)', borderRadius: '5px' }}>The cat sat on the mat.</div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontWeight: 'bold', color: '#475569', marginBottom: '5px' }}>{t.target}</div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {frWords.map((word, idx) => (
            <button
              key={idx}
              style={{
                padding: '5px 10px',
                borderRadius: '4px',
                border: 'none',
                background: idx === selectedFrIdx ? '#8e44ad' : '#e2e8f0',
                color: idx === selectedFrIdx ? 'white' : '#475569',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.2s'
              }}
              onClick={() => setSelectedFrIdx(idx)}
            >
              {word}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div style={{ fontWeight: 'bold', color: '#475569', marginBottom: '10px' }}>{t.weight}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '120px', padding: '10px', background: 'rgba(255,255,255,0.5)', borderRadius: '5px' }}>
          {enWords.map((word, idx) => {
            const weight = currentAlignData[idx];
            return (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                <span style={{ fontSize: '0.8rem', color: '#7f8c8d' }}>{(weight * 100).toFixed(0)}%</span>
                <div style={{ width: '30px', height: `${weight * 100}px`, background: '#8e44ad', borderRadius: '3px 3px 0 0', transition: 'height 0.3s ease' }}></div>
                <span style={{ fontSize: '0.9rem', marginTop: '5px', fontWeight: 'bold', color: '#475569' }}>{word}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
