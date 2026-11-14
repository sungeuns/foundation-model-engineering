import React, { useState } from 'react';
import './visualizers.css';

const SSMVsTransformerVisualizer = ({ lang = "en" }: { lang?: "en" | "ko" }) => {
  const translations: Record<string,string> = {"Architecture Scaling Comparison": "시퀀스 연산량 비교", "Dense Transformer (O(N²))": "밀집 인과 어텐션 (O(N²))", "Every token attends to all previous tokens and itself.": "각 토큰은 자기 자신과 앞선 토큰을 참조합니다.", "State Space Model (O(N))": "상태 공간 모델 (O(N))", "Decode updates a fixed state one token at a time; training can use a parallel scan.": "각 토큰이 고정 크기 상태를 갱신합니다. 학습은 병렬 스캔이 가능합니다."};
  const t = (s: string) => lang === "ko" ? (translations[s] ?? s) : s;

  const [seqLength, setSeqLength] = useState(4);

  const handleToggle = () => {
    setSeqLength(prev => prev === 4 ? 8 : 4);
  };

  return (
    <div className="ssm-visualizer-container">
      <div className="ssm-header">
        <h3>{t("Architecture Scaling Comparison")}</h3>
        <button className="ssm-toggle-btn" onClick={handleToggle}>
          {lang === "ko" ? "길이 전환" : "Toggle length"} (N = {seqLength})
        </button>
      </div>

      <p>{lang === "ko" ? "폭을 고정한 prefill 계산의 구조를 비교합니다. 쌍 하나와 상태 갱신 하나의 비용은 같지 않습니다. 학습 메모리·커널 시간·모델 품질은 표시하지 않습니다." : "Compares prefill structure at fixed width. A token pair and a state update do not have equal cost. Training memory, kernel time and quality are not represented."}</p><div className="ssm-panels">
        {/* Transformer Panel */}
        <div className="ssm-panel">
          <h4 className="panel-title">{t("Dense Transformer (O(N\u00b2))")}</h4>
          <p className="panel-desc">{t("Every token attends to all previous tokens and itself.")}</p>
          <div className="grid-viz">
            {Array.from({ length: seqLength }).map((_, i) => (
              <div key={`row-${i}`} className="grid-row">
                {Array.from({ length: seqLength }).map((_, j) => (
                  <div
                    key={`cell-${i}-${j}`}
                    className={`grid-cell ${j <= i ? 'active-cell' : 'inactive-cell'}`}
                  >
                    {j <= i ? '✓' : ''}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="stats">
            {lang === "ko" ? "토큰 쌍:" : "Token pairs:"} <strong>{(seqLength * (seqLength + 1)) / 2}</strong>
          </div>
        </div>

        {/* SSM Panel */}
        <div className="ssm-panel">
          <h4 className="panel-title">{t("State Space Model (O(N))")}</h4>
          <p className="panel-desc">{t("Decode updates a fixed state one token at a time; training can use a parallel scan.")}</p>
          <div className="ssm-viz">
            <div className="hidden-state-box">
              {lang === "ko" ? "고정 크기 상태" : "Fixed-size state"} <br/> <span>h(t)</span>
            </div>
            <div className="sequence-stream">
              {Array.from({ length: seqLength }).map((_, i) => (
                <div key={`token-${i}`} className="stream-token">
                  x_{i}
                </div>
              ))}
            </div>
          </div>
          <div className="stats">
            {lang === "ko" ? "상태 갱신:" : "State updates:"} <strong>{seqLength}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SSMVsTransformerVisualizer;
