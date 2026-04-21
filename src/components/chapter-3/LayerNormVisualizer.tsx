import React, { useState, useEffect } from 'react';

interface LayerNormVisualizerProps {
  lang?: 'en' | 'ko';
}

export default function LayerNormVisualizer({ lang = 'en' }: LayerNormVisualizerProps) {
  const [raw, setRaw] = useState<string[]>([]);
  const [normalized, setNormalized] = useState<string[]>([]);

  const generateRandomVec = () => {
    const newRaw: string[] = [];
    for (let i = 0; i < 5; i++) {
      newRaw.push((Math.random() * 10 - 5).toFixed(2));
    }

    const mean = newRaw.reduce((a, b) => a + parseFloat(b), 0) / newRaw.length;
    const variance = newRaw.reduce((a, b) => a + Math.pow(parseFloat(b) - mean, 2), 0) / newRaw.length;
    const std = Math.sqrt(variance);

    const newNormalized = newRaw.map(v => ((parseFloat(v) - mean) / (std + 1e-6)).toFixed(2));

    setRaw(newRaw);
    setNormalized(newNormalized);
  };

  useEffect(() => {
    generateRandomVec();
  }, []);

  const labels = {
    en: {
      raw: "Raw Vector",
      norm: "Normalized Vector",
      btn: "Generate New Vector"
    },
    ko: {
      raw: "원본 벡터",
      norm: "정규화된 벡터",
      btn: "새 벡터 생성"
    }
  };

  const t = labels[lang] || labels.en;

  const renderVec = (vec: string[]) => {
    return vec.map((v, idx) => {
      const val = parseFloat(v);
      const intensity = Math.min(Math.abs(val) / 3, 1);
      let backgroundColor = 'white';
      let color = '#1e293b';

      if (val > 0) {
        backgroundColor = `rgba(46, 204, 113, ${intensity})`;
      } else if (val < 0) {
        backgroundColor = `rgba(231, 76, 60, ${intensity})`;
      }

      return (
        <div
          key={idx}
          style={{
            padding: '5px 10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            textAlign: 'center',
            backgroundColor,
            color,
            fontWeight: intensity > 0.5 ? 'bold' : 'normal',
            transition: 'all 0.3s ease'
          }}
        >
          {v}
        </div>
      );
    });
  };

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
      <div style={{ display: 'flex', justifyContent: 'space-around', gap: '20px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 'bold', marginBottom: '10px', textAlign: 'center', color: '#1e293b' }}>{t.raw}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {renderVec(raw)}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 'bold', marginBottom: '10px', textAlign: 'center', color: '#1e293b' }}>{t.norm}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {renderVec(normalized)}
          </div>
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button
          onClick={generateRandomVec}
          style={{
            padding: '10px 20px',
            borderRadius: '4px',
            border: 'none',
            backgroundColor: '#8e44ad',
            color: 'white',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'background-color 0.2s ease',
            display: 'block',
            margin: '0 auto'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#7d3c98'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#8e44ad'}
        >
          {t.btn}
        </button>
      </div>
    </div>
  );
}
