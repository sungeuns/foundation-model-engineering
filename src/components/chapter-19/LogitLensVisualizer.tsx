import React, { useState } from 'react';
import './visualizers.css';

const LogitLensVisualizer = ({ locale = 'en' }: { locale?: 'en' | 'ko' }) => {
  const ko = locale === 'ko';
  const controlId = React.useId();
  const [activeLayer, setActiveLayer] = useState(12);

  const tokens = ["The", "capital", "of", "France", "is"];

  // Simulated Logit Lens data for 13 layers (0 to 12)
  const layerData = [
    { layer: 0, predictions: ["The", "letter", "the", "a", "the"] },
    { layer: 1, predictions: ["First", "city", "the", "the", "a"] },
    { layer: 2, predictions: ["A", "city", "a", "the", "a"] },
    { layer: 3, predictions: ["A", "state", "the", "Paris", "a"] },
    { layer: 4, predictions: ["A", "state", "the", "Paris", "a"] },
    { layer: 5, predictions: ["The", "city", "the", "Paris", "city"] },
    { layer: 6, predictions: ["The", "city", "the", "Paris", "Paris"] },
    { layer: 7, predictions: ["The", "city", "the", "Paris", "Paris"] },
    { layer: 8, predictions: ["The", "city", "the", "Paris", "Paris"] },
    { layer: 9, predictions: ["The", "city", "the", "Paris", "Paris"] },
    { layer: 10, predictions: ["The", "city", "the", "Paris", "Paris"] },
    { layer: 11, predictions: ["The", "city", "the", "Paris", "Paris"] },
    { layer: 12, predictions: ["The", "city", "the", "Paris", "Paris"] },
  ];

  const currentData = layerData[activeLayer].predictions;

  return (
    <div className="logit-lens-container">
      <div className="lens-header">
        <h4>{ko ? 'Logit lens 교육 예제' : 'Logit lens teaching example'}</h4>
        <p>{ko ? '슬라이더로 계층을 바꿔 보세요. 토큰은 영어 예문이며 예측은 직접 작성한 값입니다.' : 'Change the layer with the slider. Tokens and predictions are authored English examples.'}</p>
      </div>

      <div className="slider-container">
        <label htmlFor={`${controlId}-1`}>{ko ? '계층' : 'Layer'}: {activeLayer}</label>
        <input id={`${controlId}-1`} type="range"
          min="0"
          max="12"
          value={activeLayer}
          onChange={(e) => setActiveLayer(parseInt(e.target.value))}
          className="layer-slider"
        />
      </div>

      <div className="tokens-grid">
        <div className="grid-row label-row">
          <div className="grid-cell row-label">{ko ? '입력 토큰' : 'Input tokens'}</div>
          {tokens.map((token, idx) => (
            <div key={`in-${idx}`} className="grid-cell token-cell">{token}</div>
          ))}
        </div>

        <div className="grid-row prediction-row">
          <div className="grid-cell row-label">{ko ? '최대 예측' : 'Top prediction'}<br/>({ko ? '계층' : 'Layer'} {activeLayer})</div>
          {currentData.map((pred, idx) => (
            <div
              key={`pred-${idx}`}
              className={`grid-cell pred-cell ${pred === 'Paris' && idx === 4 ? 'highlight-correct' : ''}`}
            >
              {pred}
            </div>
          ))}
        </div>
      </div>

      <div className="lens-explanation">
        <p>{ko ? '이 합성 예제에서는 초기 계층의 출력이 다르고 뒤쪽에서 Paris가 반복됩니다. 실제 체크포인트를 측정하지 않았습니다. 같은 argmax가 반복돼도 분포·표현이 같거나 뒷계층이 불필요하다는 뜻은 아닙니다.' : 'In this synthetic example, early readouts vary and later readouts repeat Paris. No checkpoint was measured. Repeated argmax tokens do not imply equal distributions, equal representations, or unnecessary later layers.'}</p>
        <p>{ko ? '실제 분석에서는 체크포인트·프롬프트·잔차 지점·정규화·unembedding을 고정하고 전체 분포와 대조 개입을 평가하세요. 최종 출력 헤드를 중간 표현에 적용할 때 생기는 분포 차이도 고려해야 합니다.' : 'For analysis, pin checkpoint, prompt, residual-stream location, normalization and unembedding; inspect full distributions and controlled interventions. Applying a final output head to intermediate states introduces a distribution mismatch.'}</p>
      </div>
    </div>
  );
};

export default LogitLensVisualizer;