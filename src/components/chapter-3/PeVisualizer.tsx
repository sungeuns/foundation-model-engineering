import React from 'react';

interface PeVisualizerProps {
  lang?: 'en' | 'ko';
}

export default function PeVisualizer({ lang = 'en' }: PeVisualizerProps) {
  const d_model = 32;
  const seq_len = 20;

  const labels = {
    en: {
      title: "Positional Encoding Grid (d_model=32, seq_len=20)",
      dim0: "Dimension 0",
      dim31: "Dimension 31"
    },
    ko: {
      title: "위치 인코딩 그리드 (d_model=32, seq_len=20)",
      dim0: "차원 0",
      dim31: "차원 31"
    }
  };

  const t = labels[lang] || labels.en;

  const renderGrid = () => {
    const cells = [];
    for (let pos = 0; pos < seq_len; pos++) {
      for (let i = 0; i < d_model; i++) {
        let val = 0;
        if (i % 2 === 0) {
          val = Math.sin(pos / Math.pow(10000, i / d_model));
        } else {
          val = Math.cos(pos / Math.pow(10000, (i - 1) / d_model));
        }

        const normalized = (val + 1) / 2;
        const red = Math.floor(255 * (1 - normalized));
        const blue = Math.floor(255 * normalized);
        const backgroundColor = `rgb(${red}, 50, ${blue})`;

        cells.push(
          <div
            key={`${pos}-${i}`}
            style={{
              backgroundColor,
              width: '100%',
              height: '10px'
            }}
            title={`pos: ${pos}, dim: ${i}, val: ${val.toFixed(2)}`}
          />
        );
      }
    }
    return cells;
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
      <div style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '20px', color: '#1e293b' }}>
        {t.title}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${d_model}, 1fr)`,
          gap: '1px',
          width: '100%',
          background: '#eee',
          border: '1px solid #ddd'
        }}
      >
        {renderGrid()}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '0.8rem', color: '#7f8c8d' }}>
        <span>{t.dim0}</span>
        <span>{t.dim31}</span>
      </div>
    </div>
  );
}
