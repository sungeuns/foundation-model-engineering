import React, { useState } from 'react';
import './visualizers.css';

export const LogicGateVisualizer = ({ lang = "en" }: { lang?: "en" | "ko" }) => {
  const translations: Record<string, string> = {"Symbolism vs Connectionism: The AND Gate": "기호주의와 연결주의: AND 게이트", "Toggle inputs and adjust weights to see how both paradigms solve the AND gate.": "입력을 바꾸고 가중치를 조절하며 두 방식이 AND 게이트를 표현하는 방법을 살펴보세요.", "Input A:": "입력 A:", "Input B:": "입력 B:", "Symbolic (Rule-Based)": "기호 방식 (규칙)", "Connectionist (Neural)": "연결 방식 (뉴런)", "Output:": "출력:", "Bias:": "편향:", "AND Gate Goal:": "AND 게이트의 목표:", "Output should be 1 ONLY when both inputs are 1.": "두 입력이 모두 1일 때만 출력이 1이어야 합니다.", "✅ Outputs match for this input. Test all four input pairs.": "✅ 현재 입력에서 두 출력이 같습니다.", "❌ Systems disagree. Adjust weights/bias to fix the neuron!": "❌ 출력이 다릅니다. 가중치와 편향을 조절해 보세요."};
  const t = (text: string) => lang === "ko" ? translations[text] ?? text : text;
  const [inputA, setInputA] = useState(0);
  const [inputB, setInputB] = useState(0);
  const [w1, setW1] = useState(1.0);
  const [w2, setW2] = useState(1.0);
  const [bias, setBias] = useState(-1.5); // Default for AND gate

  const symbolicOutput = (inputA === 1 && inputB === 1) ? 1 : 0;

  const sum = inputA * w1 + inputB * w2 + bias;
  const connectionistOutput = sum >= 0 ? 1 : 0;

  return (
    <div className="lg-container">
      <h3 className="lg-title">{t("Symbolism vs Connectionism: The AND Gate")}</h3>
      <p className="lg-description">{t("Toggle inputs and adjust weights to see how both paradigms solve the AND gate.")}</p>

      <div className="lg-inputs">
        <button onClick={() => setInputA(inputA === 0 ? 1 : 0)} className="lg-input-btn">
          {t("Input A:")} {inputA}
        </button>
        <button onClick={() => setInputB(inputB === 0 ? 1 : 0)} className="lg-input-btn">
          {t("Input B:")} {inputB}
        </button>
      </div>

      <div className="lg-row">
        {/* Symbolic Column */}
        <div className="lg-column">
          <h4 className="lg-column-title">{t("Symbolic (Rule-Based)")}</h4>
          <div className="lg-box">
            <code className="lg-code">
              if A == 1 and B == 1:<br/>
              &nbsp;&nbsp;return 1<br/>
              else:<br/>
              &nbsp;&nbsp;return 0
            </code>
            <div className="lg-output-label">{t("Output:")} {symbolicOutput}</div>
          </div>
        </div>

        {/* Connectionist Column */}
        <div className="lg-column">
          <h4 className="lg-column-title">{t("Connectionist (Neural)")}</h4>
          <div className="lg-box">
            <div className="lg-formula">
              f({inputA} × {w1.toFixed(1)} + {inputB} × {w2.toFixed(1)} + {bias.toFixed(1)}) = f({sum.toFixed(1)})
            </div>
            <div className="lg-sliders">
              <label>W1: {w1.toFixed(1)}
                <input type="range" min="-2" max="2" step="0.1" value={w1} onChange={(e) => setW1(parseFloat(e.target.value))} />
              </label>
              <label>W2: {w2.toFixed(1)}
                <input type="range" min="-2" max="2" step="0.1" value={w2} onChange={(e) => setW2(parseFloat(e.target.value))} />
              </label>
              <label>{t("Bias:")} {bias.toFixed(1)}
                <input type="range" min="-2" max="2" step="0.1" value={bias} onChange={(e) => setBias(parseFloat(e.target.value))} />
              </label>
            </div>
            <div className="lg-output-label">{t("Output:")} {connectionistOutput}</div>
          </div>
        </div>
      </div>

      <div className="lg-explanation">
        <p>
          <strong>{t("AND Gate Goal:")}</strong> {t("Output should be 1 ONLY when both inputs are 1.")}
        </p>
        <p>
          {symbolicOutput === connectionistOutput
            ? t("\u2705 Both systems match!")
            : t("\u274c Systems disagree. Adjust weights/bias to fix the neuron!")}
        </p>
      </div>
    </div>
  );
};
