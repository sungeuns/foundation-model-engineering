import React, { useState } from 'react';

interface MhaVisualizerProps {
  lang?: 'en' | 'ko';
}

export default function MhaVisualizer({ lang = 'en' }: MhaVisualizerProps) {
  const mhaSentence = "The bank was full of money".split(" ");
  const [selectedHead, setSelectedHead] = useState(1);

  const headData: { [key: number]: { [key: string]: number } } = {
    1: { "The": 0.05, "bank": 0.20, "was": 0.05, "full": 0.10, "of": 0.05, "money": 0.55 },
    2: { "The": 0.40, "bank": 0.30, "was": 0.20, "full": 0.05, "of": 0.03, "money": 0.02 }
  };

  const data = headData[selectedHead];

  const labels = {
    en: {
      title: "Sentence: \"The bank was full of money.\"",
      head1: "Head 1: Financial Context",
      head2: "Head 2: Syntactic Links"
    },
    ko: {
      title: "문장: \"The bank was full of money.\"",
      head1: "헤드 1: 금융 문맥",
      head2: "헤드 2: 구문 연결"
    }
  };

  const t = labels[lang] || labels.en;

  return (
    <div style={{ 
      padding: '20px', 
      marginTop: '2rem', 
      marginBottom: '2rem',
      background: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
      borderRadius: '12px'
    }}>
      <div style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '20px', color: '#1e293b' }}>
        {t.title}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
        <button
          onClick={() => setSelectedHead(1)}
          style={{
            padding: '10px 20px',
            borderRadius: '4px',
            border: 'none',
            backgroundColor: selectedHead === 1 ? '#8e44ad' : '#ccc',
            color: selectedHead === 1 ? 'white' : 'black',
            cursor: 'pointer',
            fontWeight: selectedHead === 1 ? 'bold' : 'normal',
            transition: 'all 0.2s ease'
          }}
        >
          {t.head1}
        </button>
        <button
          onClick={() => setSelectedHead(2)}
          style={{
            padding: '10px 20px',
            borderRadius: '4px',
            border: 'none',
            backgroundColor: selectedHead === 2 ? '#8e44ad' : '#ccc',
            color: selectedHead === 2 ? 'white' : 'black',
            cursor: 'pointer',
            fontWeight: selectedHead === 2 ? 'bold' : 'normal',
            transition: 'all 0.2s ease'
          }}
        >
          {t.head2}
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', height: '120px', alignItems: 'flex-end' }}>
        {mhaSentence.map((w, idx) => {
          const weight = data[w] || 0;
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
                  opacity: 0.7 + weight * 0.3
                }}
              />
              <span style={{ fontSize: '0.9rem', marginTop: '5px', color: '#1e293b' }}>{w}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
