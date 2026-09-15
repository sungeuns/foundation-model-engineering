import React, { useMemo, useState } from 'react';
import './visualizers.css';

type Props = { lang?: 'en' | 'ko' };

const copy = {
  en: {
    title: 'Linear separability in a 2-D toy representation',
    caveat: 'Synthetic points, not model activations. This illustrates what a linear probe can measure; it is not evidence for a particular model.',
    signal: 'Class signal',
    shift: 'Evaluation distribution',
    inDistribution: 'In-distribution',
    shifted: 'Shifted',
    accuracy: 'Fixed-boundary accuracy',
    classA: 'Class A',
    classB: 'Class B',
    boundary: 'Fixed linear decision boundary',
    description: 'Increasing class signal makes the labels more linearly decodable. Distribution shift can still reduce test accuracy without changing the probe.',
  },
  ko: {
    title: '2-D 모형 표현의 linear separability',
    caveat: 'Model activation이 아닌 synthetic point입니다. Linear probe가 측정하는 대상을 설명할 뿐, 특정 모델에 대한 근거가 아닙니다.',
    signal: 'Class signal',
    shift: 'Evaluation 분포',
    inDistribution: '동일 분포',
    shifted: '분포 이동',
    accuracy: '고정 boundary 정확도',
    classA: 'Class A',
    classB: 'Class B',
    boundary: '고정된 linear decision boundary',
    description: 'Class signal이 커지면 label을 선형으로 decode하기 쉬워집니다. 그러나 probe를 바꾸지 않아도 distribution shift가 test accuracy를 낮출 수 있습니다.',
  },
};

type Point = { id: string; classId: 0 | 1; noiseX: number; y: number };

const points: Point[] = Array.from({ length: 80 }, (_, index) => {
  const classId = (index % 2) as 0 | 1;
  // Keep SSR and browser-rendered SVG attributes byte-identical across JS engines.
  const noiseX = Number(Math.sin(index * 12.9898 + classId * 7.23).toFixed(6));
  const y = Number((50 + 36 * Math.sin(index * 2.17 + classId * 0.31)).toFixed(4));
  return { id: String(index), classId, noiseX, y };
});

const LinearProbeVisualizer: React.FC<Props> = ({ lang = 'en' }) => {
  const [signal, setSignal] = useState(55);
  const [shifted, setShifted] = useState(false);
  const t = copy[lang];

  const rendered = useMemo(() => {
    const separation = 5 + signal * 0.3;
    const shift = shifted ? 14 : 0;
    return points.map((point) => {
      const direction = point.classId === 0 ? -1 : 1;
      const rawX = 50 + direction * separation + point.noiseX * 22 + shift;
      const x = Number(Math.max(3, Math.min(97, rawX)).toFixed(4));
      const predicted = x >= 50 ? 1 : 0;
      return { ...point, x, correct: predicted === point.classId };
    });
  }, [signal, shifted]);

  const accuracy = (100 * rendered.filter((point) => point.correct).length / rendered.length).toFixed(1);

  return (
    <div className="probe-visualizer-container">
      <div className="probe-header">
        <h4>{t.title}</h4>
        <p>{t.caveat}</p>
        <label htmlFor="probe-signal">{t.signal}: <strong>{signal}</strong>/100</label>
        <input id="probe-signal" type="range" min="0" max="100" value={signal}
          onChange={(event) => setSignal(Number(event.target.value))} className="layer-slider" />
        <div className="button-group" role="group" aria-label={t.shift}>
          <button type="button" aria-pressed={!shifted} className={!shifted ? 'active' : ''}
            onClick={() => setShifted(false)}>{t.inDistribution}</button>
          <button type="button" aria-pressed={shifted} className={shifted ? 'active' : ''}
            onClick={() => setShifted(true)}>{t.shifted}</button>
        </div>
      </div>

      <div className="probe-canvas-container">
        <svg viewBox="0 0 100 100" className="probe-svg" role="img" aria-label={t.title}>
          <title>{t.boundary}</title>
          <line x1="50" y1="4" x2="50" y2="96" stroke="rgba(255,255,255,0.65)"
            strokeWidth="1" strokeDasharray="2,2" />
          {rendered.map((point) => (
            <circle key={point.id} cx={point.x} cy={point.y} r="1.6"
              fill={point.classId === 0 ? '#4ade80' : '#f87171'} opacity="0.82" />
          ))}
        </svg>
      </div>

      <div className="probe-legend">
        <div className="legend-item"><span className="dot true-dot" /> {t.classA}</div>
        <div className="legend-item"><span className="dot false-dot" /> {t.classB}</div>
      </div>
      <div className="probe-description" aria-live="polite">
        <strong>{t.accuracy}: {accuracy}%.</strong> {t.description}
      </div>
    </div>
  );
};

export default LinearProbeVisualizer;
