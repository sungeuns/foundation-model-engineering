import React, { useState } from 'react';
import './visualizers.css';

export default function DataQualityVisualizer({ locale = 'en' }: { locale?: 'en' | 'ko' }) {
  const ko = locale === 'ko';
  const [size, setSize] = useState(10000), [noise, setNoise] = useState(10), [duplicates, setDuplicates] = useState(20);
  const usable = Math.round(size * (1 - noise / 100) * (1 - duplicates / 100));
  return <section className="dq-visualizer-container">
    <h3>{ko ? '데이터 수와 유효 사례 수' : 'Dataset size and usable unique cases'}</h3>
    <p>{ko ? '성능 예측기가 아닌 단순 수량 모형입니다. 중복을 제거한 뒤 잘못된 레이블 비율이 같다고 가정합니다.' : 'A counting model, not a performance predictor. Assume the same invalid-label fraction after deduplication.'}</p>
    <div className="dq-controls">
      <label>{ko ? '원본 사례 수' : 'Raw examples'}: {size}<input type="range" min="1000" max="100000" step="1000" value={size} onChange={e => setSize(Number(e.target.value))} /></label>
      <label>{ko ? '잘못된 레이블 비율' : 'Invalid-label fraction'}: {noise}%<input type="range" min="0" max="100" value={noise} onChange={e => setNoise(Number(e.target.value))} /></label>
      <label>{ko ? '중복 제거로 제외할 비율' : 'Fraction removed by deduplication'}: {duplicates}%<input type="range" min="0" max="100" value={duplicates} onChange={e => setDuplicates(Number(e.target.value))} /></label>
    </div>
    <p aria-live="polite"><strong>{ko ? '유효한 고유 사례 추정' : 'Estimated usable unique cases'}: {usable}</strong> = {size} × (1 − {duplicates / 100}) × (1 − {noise / 100})</p>
    <p>{ko ? '직접 만든 교육용 수량 모형입니다. 중복·오류의 상관관계, 도메인·난도 분포, 유용한 반복 학습을 모형화하지 않습니다. 특정 중복률의 성능 최적점이나 OOD 정확도를 뜻하지 않습니다. 관련 사례를 묶어 분할한 뒤 보류 평가셋에서 실제 품질·학습 비용을 비교하세요.' : 'Authored educational counting model. It omits correlations between duplication and errors, domain/difficulty distributions, and useful repetition. It establishes neither an optimal duplication rate nor OOD accuracy. Group related examples before splitting, then compare measured quality and training cost on held-out evaluations.'}</p>
  </section>;
}
