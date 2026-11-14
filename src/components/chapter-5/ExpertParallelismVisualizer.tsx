import React, { useState } from 'react';
import './visualizers.css';

export const ExpertParallelismVisualizer = ({ lang = "en" }: { lang?: "en" | "ko" }) => {
  const translations: Record<string, string> = {"All-to-All Token Routing Simulator": "All-to-All 토큰 전송 예시", "Observe how tokens move across the network to their target experts.": "목적지 전문가를 따라 토큰이 이동하는 과정을 살펴보세요.", "0. Init": "0. 초기화", "1. Sort": "1. 정렬", "2. Dispatch": "2. 전송", "3. Compute": "3. 연산", "4. Combine": "4. 결합", "Local": "로컬", "Sorted": "정렬됨", "Routed": "전송됨", "Done": "연산 완료", "Returned": "복귀", "Step Description": "단계 설명", "Every GPU starts with a local batch of tokens destined for different experts across the cluster.": "각 GPU의 로컬 토큰들은 서로 다른 전문가를 목적지로 가집니다.", "Tokens are sorted locally by their target GPU rank to prepare for contiguous network transmission.": "연속된 버퍼로 전송할 수 있도록 목적지 GPU 순서로 정렬합니다.", "The All-to-All collective operation executes. Tokens are physically moved to the GPUs that own their target experts.": "All-to-All 통신으로 토큰을 해당 전문가를 가진 GPU로 보냅니다.", "Each GPU processes received tokens with local experts. Expert IDs must travel in the same order.": "각 GPU가 받은 토큰을 로컬 전문가로 처리합니다. 전문가 ID도 같은 순서로 전달해야 합니다.", "Computed tokens are transmitted back to their origin GPUs (another All-to-All) to continue the dense layers.": "두 번째 All-to-All로 결과를 원래 GPU에 돌려보내고 토큰 순서를 복원합니다."};
  const t = (text: string) => lang === "ko" ? translations[text] ?? text : text;
  const [step, setStep] = useState(0); // 0: Init, 1: Sorted, 2: Dispatched, 3: Computed, 4: Combined

  // 4 GPUs, each with 4 initial tokens.
  // Number represents the Target Expert ID (0-3).
  const initialTokens = [
    [1, 3, 0, 2], // GPU 0's local tokens
    [0, 0, 1, 3], // GPU 1's local tokens
    [2, 2, 3, 1], // GPU 2's local tokens
    [3, 1, 0, 2]  // GPU 3's local tokens
  ];

  const tokenColors = ['ep-token-0', 'ep-token-1', 'ep-token-2', 'ep-token-3'];
  const labelColors = ['ep-label-0', 'ep-label-1', 'ep-label-2', 'ep-label-3'];
  const gpuLabels = [0,1,2,3].map(i => `GPU ${i} (${lang === 'ko' ? '전문가' : 'Expert'} ${i})`);

  const getTokensForStep = (gpuIndex: number) => {
    if (step === 0) return initialTokens[gpuIndex];

    if (step === 1) {
      // Sort tokens locally by target expert
      return [...initialTokens[gpuIndex]].sort((a, b) => a - b);
    }

    if (step === 2 || step === 3) {
      // Dispatched: GPU i only holds tokens destined for Expert i
      let received: number[] = [];
      initialTokens.forEach(gpuTokens => {
        received.push(...gpuTokens.filter(t => t === gpuIndex));
      });
      return received;
    }

    if (step === 4) {
      // Combined: Tokens return to original GPUs
      return initialTokens[gpuIndex];
    }
    return [];
  };

  return (
    <div className="ep-container">
      <h3 className="ep-title">{t("All-to-All Token Routing Simulator")}</h3>
      <p className="ep-description">{t("Observe how tokens move across the network to their target experts.")}</p>

      <div className="ep-button-group">
        {[
          { label: t("0. Init"), val: 0 },
          { label: t("1. Sort"), val: 1 },
          { label: t("2. Dispatch"), val: 2 },
          { label: t("3. Compute"), val: 3 },
          { label: t("4. Combine"), val: 4 }
        ].map((btn) => (
          <button
            key={btn.val}
            aria-pressed={step === btn.val} onClick={() => setStep(btn.val)}
            className={`ep-button ${step === btn.val ? 'ep-button-active' : 'ep-button-inactive'}`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      <div className="ep-grid">
        {[0, 1, 2, 3].map(gpuIdx => (
          <div key={gpuIdx} className="ep-card">
            <div className={`ep-label ${labelColors[gpuIdx]}`}>
              {gpuLabels[gpuIdx]}
            </div>

            <div className="ep-token-container">
              {getTokensForStep(gpuIdx).map((targetExpert, idx) => (
                <div
                  key={idx}
                  className={`ep-token ${tokenColors[targetExpert]} ${step === 3 ? 'ep-token-pulse' : ''}`}
                >
                  {step >= 3 && step < 4 ? '✓' : `E${targetExpert}`}
                </div>
              ))}
            </div>

            <div className="ep-status">
              {step === 0 && t("Local")}
              {step === 1 && t("Sorted")}
              {step === 2 && t("Routed")}
              {step === 3 && t("Done")}
              {step === 4 && t("Returned")}
            </div>
          </div>
        ))}
      </div>

      <div className="ep-step-box">
        <h4 className="ep-step-title">{t("Step Description")}</h4>
        <p className="ep-step-text">
          {step === 0 && t("Every GPU starts with a local batch of tokens destined for different experts across the cluster.")}
          {step === 1 && t("Tokens are sorted locally by their target GPU rank to prepare for contiguous network transmission.")}
          {step === 2 && t("The All-to-All collective operation executes. Tokens are physically moved to the GPUs that own their target experts.")}
          {step === 3 && t("Each GPU processes received tokens with local experts. Expert IDs must travel in the same order.")}
          {step === 4 && t("Computed tokens are transmitted back to their origin GPUs (another All-to-All) to continue the dense layers.")}
        </p>
      </div>
    </div>
  );
};
