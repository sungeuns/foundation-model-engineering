import React, { useState } from 'react';

interface AttentionMaskVisualizerProps {
  lang?: 'en' | 'ko';
}

export default function AttentionMaskVisualizer({ lang = 'en' }: AttentionMaskVisualizerProps) {
  const [arch, setArch] = useState<'encoder' | 'decoder' | 'prefix'>('encoder');

  const tokens = {
    en: ["Deep", "Learning", "Is", "Super", "Fun"],
    ko: ["딥", "러닝", "은", "정말", "신나"]
  };

  const currentTokens = tokens[lang] || tokens.en;
  const n = currentTokens.length;

  const labels = {
    en: {
      title: "Attention Mask Visualizer",
      subtitle: "Select architecture to see the attention mask pattern",
      encoder: "Encoder-Only (Bidirectional)",
      decoder: "Decoder-Only (Causal)",
      prefix: "Prefix-LM (Hybrid)",
      allowed: "Attend",
      masked: "Masked",
      desc_encoder: "All tokens can attend to all other tokens. Fully visible.",
      desc_decoder: "Tokens can only attend to previous tokens and themselves. Used in autoregressive generation.",
      desc_prefix: "First 3 tokens (prefix) are fully visible to each other. Subsequent tokens have causal masking."
    },
    ko: {
      title: "어텐션 마스크 시각화",
      subtitle: "아키텍처를 선택하여 어텐션 마스크 패턴을 확인하세요",
      encoder: "인코더 전용 (양방향)",
      decoder: "디코더 전용 (인과적)",
      prefix: "Prefix-LM (하이브리드)",
      allowed: "참조 가능",
      masked: "마스킹됨",
      desc_encoder: "모든 토큰이 다른 모든 토큰을 참조할 수 있습니다. 완전 공개.",
      desc_decoder: "토큰은 이전 토큰과 자기 자신만 참조할 수 있습니다. 자동 회귀 생성에 사용됩니다.",
      desc_prefix: "처음 3개 토큰(접두사)은 서로를 완전히 볼 수 있습니다. 이후 토큰은 인과적 마스킹이 적용됩니다."
    }
  };

  const t = labels[lang] || labels.en;

  const getMask = (i: number, j: number) => {
    if (arch === 'encoder') return true;
    if (arch === 'decoder') return i >= j;
    if (arch === 'prefix') {
      if (i < 3) return j < 3 || i >= j; // Prefix tokens see each other
      return i >= j; // Causal for the rest
    }
    return false;
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
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h3 style={{ color: '#1e293b', marginBottom: '5px' }}>{t.title}</h3>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{t.subtitle}</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
        <button
          onClick={() => setArch('encoder')}
          style={{
            padding: '10px 15px',
            borderRadius: '8px',
            border: 'none',
            background: arch === 'encoder' ? '#8e44ad' : '#e2e8f0',
            color: arch === 'encoder' ? 'white' : '#475569',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'all 0.2s'
          }}
        >
          {t.encoder}
        </button>
        <button
          onClick={() => setArch('decoder')}
          style={{
            padding: '10px 15px',
            borderRadius: '8px',
            border: 'none',
            background: arch === 'decoder' ? '#8e44ad' : '#e2e8f0',
            color: arch === 'decoder' ? 'white' : '#475569',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'all 0.2s'
          }}
        >
          {t.decoder}
        </button>
        <button
          onClick={() => setArch('prefix')}
          style={{
            padding: '10px 15px',
            borderRadius: '8px',
            border: 'none',
            background: arch === 'prefix' ? '#8e44ad' : '#e2e8f0',
            color: arch === 'prefix' ? 'white' : '#475569',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'all 0.2s'
          }}
        >
          {t.prefix}
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
        <div>
          {/* Row labels */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginRight: '10px', justifyContent: 'space-around', height: `${n * 42}px` }}>
            {currentTokens.map((tok, i) => (
              <div key={i} style={{ textAlign: 'right', fontSize: '0.8rem', fontWeight: 'bold', color: '#475569', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                {tok}
              </div>
            ))}
          </div>
        </div>

        <div>
          {/* Column labels */}
          <div style={{ display: 'flex', gap: '2px', marginBottom: '5px', marginLeft: '0px' }}>
            {currentTokens.map((tok, i) => (
              <div key={i} style={{ width: '40px', textAlign: 'center', fontSize: '0.8rem', fontWeight: 'bold', color: '#475569' }}>
                {tok}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${n}, 40px)`, gap: '2px' }}>
            {Array.from({ length: n }).map((_, i) =>
              Array.from({ length: n }).map((_, j) => {
                const allowed = getMask(i, j);
                return (
                  <div
                    key={`${i}-${j}`}
                    style={{
                      width: '40px',
                      height: '40px',
                      background: allowed ? 'rgba(46, 204, 113, 0.6)' : 'rgba(231, 76, 60, 0.6)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      color: 'white',
                      borderRadius: '4px',
                      boxShadow: 'inset 0 0 5px rgba(0,0,0,0.1)'
                    }}
                    title={`${currentTokens[i]} -> ${currentTokens[j]}: ${allowed ? t.allowed : t.masked}`}
                  >
                    {allowed ? '1' : '0'}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '20px', textAlign: 'center', color: '#475569', fontSize: '0.9rem' }}>
        {arch === 'encoder' && t.desc_encoder}
        {arch === 'decoder' && t.desc_decoder}
        {arch === 'prefix' && t.desc_prefix}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '10px', fontSize: '0.8rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div style={{ width: '15px', height: '15px', background: 'rgba(46, 204, 113, 0.6)', borderRadius: '3px' }}></div>
          <span>{t.allowed}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div style={{ width: '15px', height: '15px', background: 'rgba(231, 76, 60, 0.6)', borderRadius: '3px' }}></div>
          <span>{t.masked}</span>
        </div>
      </div>
    </div>
  );
}
