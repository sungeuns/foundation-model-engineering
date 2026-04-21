import React, { useState } from 'react';

interface ComplexityVisualizerProps {
  lang?: 'en' | 'ko';
}

export default function ComplexityVisualizer({ lang = 'en' }: ComplexityVisualizerProps) {
  const [seqLen, setSeqLen] = useState(1000);
  const d = 512;

  const attnOps = seqLen * seqLen;
  const rnnOps = seqLen * d;

  const labels = {
    en: {
      label: "Sequence Length (n):",
      attn: "Self-Attention Ops (n²)",
      rnn: `RNN Ops (n × d) *assumed d=${d}`
    },
    ko: {
      label: "시퀀스 길이 (n):",
      attn: "Self-Attention 연산 수 (n²)",
      rnn: `RNN 연산 수 (n × d) *d=${d} 가정`
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
      <div style={{ textAlign: 'center' }}>
        <label style={{ fontWeight: 'bold', marginRight: '10px', color: '#1e293b' }}>{t.label}</label>
        <input
          type="range"
          min="100"
          max="5000"
          step="100"
          value={seqLen}
          onChange={(e) => setSeqLen(parseInt(e.target.value))}
          style={{ width: '60%', verticalAlign: 'middle' }}
        />
        <span style={{ fontWeight: 'bold', color: '#8e44ad', marginLeft: '10px' }}>{seqLen.toLocaleString()}</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>{t.attn}</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#e74c3c', marginTop: '10px' }}>
            {attnOps.toLocaleString()}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>{t.rnn}</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#27ae60', marginTop: '10px' }}>
            {rnnOps.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
