import React, { useState } from 'react';
import './visualizers.css';

export const RoutingVisualizer = ({ lang = "en" }: { lang?: "en" | "ko" }) => {
  const translations: Record<string, string> = {"Routing Paradigm Simulator": "라우팅 방식 비교", "Authored assignments illustrate expert load and token coverage.": "설명용 할당으로 전문가 부하와 토큰 처리 범위를 비교하세요.", "Token-Choice (Top-1)": "토큰 선택 (Top-1)", "Expert-Choice (ECR)": "전문가 선택 (ECR)", "Tokens": "토큰", "Experts": "전문가", "Dropped": "전문가 미선택", "Tokens select Expert": "토큰이 전문가를 선택", "Experts pull Tokens": "전문가가 토큰을 선택", "Notice Expert 1 is bottlenecked (Load: 4), while Expert 3 is idle.": "이 예시에서 전문가 1의 부하는 4이고 전문가 3은 쉬고 있습니다.", "Every expert has load 2. In this example every token is selected; fox is processed twice.": "각 전문가의 부하는 2입니다. 이 예시에서는 모든 토큰이 선택되며 fox는 두 번 처리됩니다.", "Load:": "부하:", "tokens": "토큰"};
  const t = (text: string) => lang === "ko" ? translations[text] ?? text : text;
  const [mode, setMode] = useState<'token-choice' | 'expert-choice'>('token-choice');

  // Conceptual data
  const tokens = ['The', 'quick', 'brown', 'fox', 'jumps'];
  const experts = [1, 2, 3].map(n => `${lang === 'ko' ? '전문가' : 'Expert'} ${n}`);

  // Hardcoded routing results for demonstration
  const tokenChoiceMap: Record<string, number[]> = {
    'The': [0], 'quick': [0], 'brown': [0], 'fox': [1], 'jumps': [0]
  }; // Notice Expert 1 (index 0) is overloaded, Expert 3 is dead.

  const expertChoiceMap: Record<number, string[]> = {
    0: ['quick', 'brown'], // Capacity fixed at 2
    1: ['fox', 'jumps'],
    2: ['The', 'fox'] // 'fox' is processed twice, 'The' gets processed by E3
  };

  return (
    <div className="rv-container">
      <h3 className="rv-title">{t("Routing Paradigm Simulator")}</h3>
      <p className="rv-description">{t("Authored assignments illustrate expert load and token coverage.")}</p>

      <div className="rv-mode-group">
        <button
          aria-pressed={mode === 'token-choice'} onClick={() => setMode('token-choice')}
          className={`rv-mode-button ${mode === 'token-choice' ? 'rv-mode-button-active-token' : 'rv-mode-button-inactive'}`}
        >
          {t("Token-Choice (Top-1)")}
        </button>
        <button
          aria-pressed={mode === 'expert-choice'} onClick={() => setMode('expert-choice')}
          className={`rv-mode-button ${mode === 'expert-choice' ? 'rv-mode-button-active-expert' : 'rv-mode-button-inactive'}`}
        >
          {t("Expert-Choice (ECR)")}
        </button>
      </div>

      <div className="rv-box">
        {/* Tokens Column */}
        <div className="rv-column">
          <h4 className="rv-column-title">{t("Tokens")}</h4>
          {tokens.map((token) => {
            let isDropped = mode === 'expert-choice' && !Object.values(expertChoiceMap).flat().includes(token);
            return (
              <div key={token} className={`rv-token ${isDropped ? 'rv-token-dropped' : ''}`}>
                {token}
                {isDropped && <span className="rv-badge">{t("Dropped")}</span>}
              </div>
            );
          })}
        </div>

        {/* Connections */}
        <div className="rv-connections">
          <div className="rv-arrow">
            {mode === 'token-choice' ? '→' : '←'}
          </div>
          <span className="rv-connection-text">
            {mode === 'token-choice' ? t("Tokens select Expert") : t("Experts pull Tokens")}
          </span>
          <span className="rv-connection-subtext">
            {mode === 'token-choice' ? t("Notice Expert 1 is bottlenecked (Load: 4), while Expert 3 is idle.") : t("Every expert has load 2. In this example every token is selected; fox is processed twice.")}
          </span>
        </div>

        {/* Experts Column */}
        <div className="rv-column">
          <h4 className="rv-column-title">{t("Experts")}</h4>
          {experts.map((expert, eIdx) => {
            let load = mode === 'token-choice'
              ? Object.values(tokenChoiceMap).filter(arr => arr.includes(eIdx)).length
              : expertChoiceMap[eIdx].length;

            let isDead = load === 0;
            let isOverloaded = load > 2;

            return (
              <div key={expert} className={`rv-expert ${isDead ? 'rv-expert-dead' : isOverloaded ? 'rv-expert-overloaded' : ''}`}>
                <span className="font-semibold">{expert}</span>
                <span className={`rv-load-badge ${isOverloaded ? 'rv-load-badge-overloaded' : isDead ? 'rv-load-badge-dead' : 'rv-load-badge-normal'}`}>
                  {t("Load:")} {load} {t("tokens")}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
