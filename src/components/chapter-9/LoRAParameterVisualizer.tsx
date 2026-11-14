import React, { useState } from 'react';
import './visualizers.css';

const LoRAParameterVisualizer = ({ lang = "en" }: { lang?: "en" | "ko" }) => {
  const translations: Record<string,string> = {"LoRA Parameter Efficiency Calculator": "LoRA 파라미터 계산기", "Full Fine-Tuning": "전체 미세 조정", "Matrix W (d × d)": "행렬 W (d × d)", "Matrices A (d × r) + B (r × d)": "행렬 A (d × r) + B (r × d)", "Trainable Parameters": "학습 대상 파라미터"};
  const t = (s: string) => lang === "ko" ? (translations[s] ?? s) : s;

  const [dimension, setDimension] = useState(4096);
  const [rank, setRank] = useState(16);

  const fullParams = dimension * dimension;
  const loraParams = 2 * dimension * rank;
  const reduction = ((1 - loraParams / fullParams) * 100).toFixed(4);

  return (
    <div className="lora-visualizer">
      <h3>{t("LoRA Parameter Efficiency Calculator")}</h3>
      <p>{lang === "ko" ? "정사각형 행렬 하나의 d²와 2dr을 비교합니다. 베이스 가중치·활성값을 포함한 전체 모델 메모리의 감소율은 아닙니다." : "Compares d² with 2dr for one square matrix. This is not total model memory savings: base weights and activations remain."}</p><div className="controls">
        <label>
          {lang === "ko" ? "행렬 차원 (d):" : "Matrix dimension (d):"} {dimension}
          <input type="range" min="1024" max="16384" step="1024" value={dimension} onChange={(e) => setDimension(Number(e.target.value))} />
        </label>
        <label>
          {lang === "ko" ? "LoRA 랭크 (r):" : "LoRA rank (r):"} {rank}
          <input type="range" min="2" max="256" step="2" value={rank} onChange={(e) => setRank(Number(e.target.value))} />
        </label>
      </div>
      <div className="stats">
        <div className="stat-box full-tune">
          <h4>{t("Full Fine-Tuning")}</h4>
          <p>{t("Matrix W (d \u00d7 d)")}</p>
          <div className="param-count">{fullParams.toLocaleString()}</div>
          <span>{t("Trainable Parameters")}</span>
        </div>
        <div className="stat-box lora-tune">
          <h4>LoRA</h4>
          <p>{t("Matrices A (d \u00d7 r) + B (r \u00d7 d)")}</p>
          <div className="param-count">{loraParams.toLocaleString()}</div>
          <span>{t("Trainable Parameters")}</span>
        </div>
      </div>
      <div className="reduction-bar">
        <div className="reduction-fill" style={{ width: `${100 - (loraParams / fullParams) * 100}%` }}>
          {lang === "ko" ? "학습 파라미터 감소:" : "Trainable parameter reduction:"} {reduction}%
        </div>
      </div>
    </div>
  );
};

export default LoRAParameterVisualizer;
