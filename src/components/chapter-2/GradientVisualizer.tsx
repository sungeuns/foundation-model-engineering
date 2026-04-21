import React, { useState } from 'react';
import './visualizers.css';

interface GradientVisualizerProps {
  lang?: 'en' | 'ko';
}

export const GradientVisualizer = ({ lang = 'en' }: GradientVisualizerProps) => {
  const [weightScale, setWeightScale] = useState(0.9); // Default to slightly vanishing

  const numLayers = 5;
  const calculateGradients = () => {
    let gradients = [];
    let currentGrad = 1.0;
    for (let i = 0; i < numLayers; i++) {
      gradients.push(currentGrad);
      currentGrad *= weightScale;
    }
    return gradients.reverse();
  };

  const gradients = calculateGradients();

  const labels = {
    en: {
      title: "Vanishing & Exploding Gradients Simulator",
      subtitle: "Adjust the weight scale to see how gradients shrink or grow across layers during backpropagation.",
      weightScale: "Weight Scale (W):",
      layer: "Layer",
      formula: "Formula at Layer i: Gradient is proportional to W^(5-i)",
      perfect: "Perfect balance! Gradients stay constant.",
      vanishing: "Vanishing Gradient: Gradients shrink exponentially as they go back to early layers.",
      exploding: "Exploding Gradient: Gradients grow exponentially, risking numerical instability."
    },
    ko: {
      title: "기울기 소실 및 폭주 시뮬레이터",
      subtitle: "가중치 스케일을 조절하여 역전파 중에 기울기가 레이어를 거치며 어떻게 줄어들거나 커지는지 확인하세요.",
      weightScale: "가중치 스케일 (W):",
      layer: "레이어",
      formula: "레이어 i에서의 공식: 기울기는 W^(5-i)에 비례합니다.",
      perfect: "완벽한 균형! 기울기가 일정하게 유지됩니다.",
      vanishing: "기울기 소실: 초기 레이어로 갈수록 기울기가 기하급수적으로 줄어듭니다.",
      exploding: "기울기 폭주: 기울기가 기하급수적으로 커져 수치적 불안정성을 유발합니다."
    }
  };

  const t = labels[lang] || labels.en;

  return (
    <div className="glass-container" style={{ padding: '20px', marginTop: '2rem', marginBottom: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h3 style={{ color: '#1e293b', marginBottom: '5px' }}>{t.title}</h3>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{t.subtitle}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontWeight: 'bold', color: '#475569' }}>
          {t.weightScale} {weightScale.toFixed(2)}
          <input 
            type="range" 
            min="0.5" 
            max="1.5" 
            step="0.05" 
            value={weightScale} 
            onChange={(e) => setWeightScale(parseFloat(e.target.value))} 
            style={{ width: '100%', maxWidth: '300px' }}
          />
        </label>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '200px', padding: '10px', background: 'rgba(255,255,255,0.5)', borderRadius: '5px', marginBottom: '20px' }}>
        {gradients.map((grad, idx) => {
          const displayHeight = Math.min(grad * 50, 150); 
          const isExploding = grad > 2.0;
          const isVanishing = grad < 0.1;
          
          let barColor = 'rgba(59, 130, 246, 0.6)'; // Normal blue
          if (isExploding) barColor = 'rgba(239, 68, 68, 0.6)'; // Exploding red
          if (isVanishing) barColor = 'rgba(148, 163, 184, 0.6)'; // Vanishing gray
          
          return (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#94a3b8', marginBottom: '5px' }}>{t.layer} {idx + 1}</div>
              <div style={{ height: '150px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', width: '100%' }}>
                <div 
                  style={{ 
                    width: '20px', 
                    height: `${displayHeight}px`, 
                    background: barColor, 
                    borderRadius: '3px 3px 0 0', 
                    transition: 'height 0.3s, background-color 0.3s' 
                  }}
                ></div>
              </div>
              <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#475569', marginTop: '5px' }}>{grad.toFixed(4)}</div>
            </div>
          );
        })}
      </div>

      <div style={{ padding: '10px', background: 'rgba(255,255,255,0.5)', borderRadius: '5px', fontSize: '0.875rem', color: '#334155' }}>
        <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>{t.formula}</p>
        <p style={{ margin: 0 }}>
          {weightScale === 1.0 && t.perfect}
          {weightScale < 1.0 && t.vanishing}
          {weightScale > 1.0 && t.exploding}
        </p>
      </div>
    </div>
  );
};
