import React, { useState } from 'react';
import './visualizers.css';

export default function PowerLawVisualizer({ lang = "en" }: { lang?: "en" | "ko" }) {
  const translations: Record<string,string> = {"Interactive Scaling Law: Loss vs. Compute": "스케일링 법칙: 손실과 연산량", "Compute (Log Scale)": "연산량 (로그 척도)", "Loss (Log Scale)": "손실 (로그 척도)"};
  const t = (s: string) => lang === "ko" ? (translations[s] ?? s) : s;

  const [computeLog, setComputeLog] = useState<number>(2); // 10^2 to 10^8

  // L(C) = a * C^(-alpha) + E
  const a = 10;
  const alpha = 0.05;
  const E = 1.5;

  const computeFLOPs = Math.pow(10, computeLog);
  const currentLoss = a * Math.pow(computeFLOPs, -alpha) + E;

  // Generate curve points
  const points = [];
  for (let i = 1; i <= 9; i += 0.1) {
    const c = Math.pow(10, i);
    const l = a * Math.pow(c, -alpha) + E;
    points.push({ logC: i, logL: Math.log10(l) });
  }

  // SVG mapping
  const mapX = (logC: number) => (logC - 1) * (400 / 8);
  const mapY = (logL: number) => 300 - ((logL - 0.1) * 300);

  const pathD = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${mapX(p.logC)} ${mapY(p.logL)}`).join(' ');

  return (
    <div className="power-law-container">
      <h3>{t("Interactive Scaling Law: Loss vs. Compute")}</h3>
      <p>{lang === "ko" ? "가상의 계수로 계산한 L = 10C⁻⁰·⁰⁵ + 1.5입니다. 실제 모델의 학습 예측이나 FLOPs 추정이 아닙니다. 하한 때문에 log L 대 log C는 완전한 직선이 아닙니다." : "An authored curve L = 10C⁻⁰·⁰⁵ + 1.5, not a fitted model or FLOPs estimate. The floor makes log L versus log C curve rather than remain a straight line."}</p><div className="controls">
        <label>
          {lang === "ko" ? "무차원 연산 예산 (10" : "Dimensionless compute budget (10"}<sup>{computeLog.toFixed(1)}</sup> )
          <input
            type="range"
            min="1"
            max="9"
            step="0.1"
            value={computeLog}
            onChange={(e) => setComputeLog(parseFloat(e.target.value))}
          />
        </label>
        <div className="metrics">
          <span>{lang === "ko" ? "예제 손실:" : "Example loss:"} <strong>{currentLoss.toFixed(3)}</strong></span>
          <span>{lang === "ko" ? "가정한 손실 하한:" : "Assumed loss floor:"} <strong>{E.toFixed(3)}</strong></span>
        </div>
      </div>
      <svg width="100%" height="320" viewBox="-20 -20 440 340" className="power-law-svg" role="img" aria-label={t(t("Interactive Scaling Law: Loss vs. Compute"))}>
        {/* Axes */}
        <line x1="0" y1="300" x2="400" y2="300" stroke="#ccc" strokeWidth="2" />
        <line x1="0" y1="0" x2="0" y2="300" stroke="#ccc" strokeWidth="2" />

        {/* Asymptote */}
        <line x1="0" y1={mapY(Math.log10(E))} x2="400" y2={mapY(Math.log10(E))} stroke="#ff6b6b" strokeDasharray="5,5" strokeWidth="2" />
        <text x="310" y={mapY(Math.log10(E)) - 10} fill="#ff6b6b" fontSize="12">L_irreducible</text>

        {/* Curve */}
        <path d={pathD} fill="none" stroke="#4dabf7" strokeWidth="3" />

        {/* Current Point */}
        <circle cx={mapX(computeLog)} cy={mapY(Math.log10(currentLoss))} r="6" fill="#1c7ed6" />

        {/* Labels */}
        <text x="160" y="330" fill="#888" fontSize="14">{t("Compute (Log Scale)")}</text>
        <text x="-180" y="-15" fill="#888" fontSize="14" transform="rotate(-90)">{t("Loss (Log Scale)")}</text>
      </svg>
    </div>
  );
}
