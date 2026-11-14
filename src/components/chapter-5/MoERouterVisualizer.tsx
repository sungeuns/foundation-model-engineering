import React, { useState } from 'react';
import './visualizers.css';

// Conceptual visualization of MoE Token Routing
export const MoERouterVisualizer = ({ lang = "en" }: { lang?: "en" | "ko" }) => {
  const translations: Record<string, string> = {"MoE Routing Debugger (Top-2)": "MoE 라우팅 예시 (Top-2)", "Select a token to inspect an authored routing assignment, not a trained result.": "토큰을 선택해 활성화할 전문가를 확인하세요. 학습 결과가 아닌 설명용 할당입니다.", "Expert": "전문가", "Activated": "활성화"};
  const t = (text: string) => lang === "ko" ? translations[text] ?? text : text;
  const [activeToken, setActiveToken] = useState<string | null>(null);

  const tokens = [
    { text: "def", type: "code", experts: [1, 5] },
    { text: "calculate", type: "math", experts: [2, 5] },
    { text: "integral", type: "math", experts: [2, 7] },
    { text: "Bonjour", type: "language", experts: [0, 3] }
  ];

  return (
    <div className="moe-container">
      <h3 className="moe-title">{t("MoE Routing Debugger (Top-2)")}</h3>
      <p className="moe-description">{t("Select a token to inspect an authored routing assignment, not a trained result.")}</p>
      <div className="moe-token-group">
        {tokens.map((t, idx) => (
          <button
            key={idx}
            type="button"
            aria-pressed={activeToken === t.text}
            onClick={() => setActiveToken(t.text)}
            onFocus={() => setActiveToken(t.text)}
            className={`moe-token ${
              activeToken === t.text
                ? 'moe-token-active'
                : 'moe-token-inactive'
            }`}
          >
            {t.text}
          </button>
        ))}
      </div>

      <div className="moe-grid">
        {[0, 1, 2, 3, 4, 5, 6, 7].map(expertId => {
          const isActive = activeToken && tokens.find(t => t.text === activeToken)?.experts.includes(expertId);
          return (
            <div
              key={expertId}
              className={`moe-card ${
                isActive
                  ? 'moe-card-active'
                  : ''
              }`}
            >
              <div className="moe-card-title">{t("Expert")} {expertId}</div>
              {isActive && <div className="moe-card-status">{t("Activated")}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};
