import React, { useEffect, useState } from 'react';
import './visualizers.css';

type Props = { lang?: 'en' | 'ko' };

const copy = {
  en: {
    title: 'Classifying two clouds of points with a fixed boundary',
    intro: 'Each class has 40 synthetic points. The slider sets the distance between their x centers before variation is added. Switch distributions to move both centers 14 units to the right.',
    gap: 'Gap between class centers', units: 'x units', shift: 'Evaluation distribution',
    inDistribution: 'Original distribution', shifted: 'Shift right by 14',
    centers: 'Centers before variation', accuracy: 'Fixed-boundary accuracy',
    classA: 'Class A', classB: 'Class B',
    plot: 'Class A is shown as filled circles, class B as rings. The vertical boundary is at x = 50.',
    rule: 'The dashed line predicts A to the left of x = 50 and B at or to its right. Points outside x = 3–97 are drawn at the nearest edge of that interval.',
    staticView: 'This example shows a gap of 43 units in the original distribution. Enable JavaScript to change it.',
  },
  ko: {
    title: '고정된 경계로 두 집단의 점 분류하기',
    intro: '각 집단에는 예제로 만든 점이 40개씩 있습니다. 슬라이더로 개별 점의 편차를 더하기 전 두 집단의 중심이 가로축에서 얼마나 떨어져 있는지 정합니다. 분포를 옮기면 두 중심이 모두 오른쪽으로 14만큼 이동합니다.',
    gap: '두 집단 중심의 간격', units: '좌표 단위', shift: '평가 분포',
    inDistribution: '기준 분포', shifted: '오른쪽으로 14 이동',
    centers: '편차를 더하기 전 중심', accuracy: '고정된 경계의 분류 정확도',
    classA: '집단 A', classB: '집단 B',
    plot: '채운 원은 집단 A, 빈 원은 집단 B입니다. 가로 좌표 50에 세로 경계선이 있습니다.',
    rule: '점선(x = 50) 왼쪽의 점은 A로, 점선 위와 오른쪽의 점은 B로 분류합니다. 가로 좌표가 3보다 작거나 97보다 크면 각각 3 또는 97 위치에 표시합니다.',
    staticView: '현재 그림은 중심 간격이 43인 기준 분포입니다. 값을 바꾸려면 자바스크립트를 켜세요.',
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
  const [gap, setGap] = useState(43);
  const [shifted, setShifted] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const t = copy[lang];
  const midpoint = shifted ? 64 : 50;
  const centers = [midpoint - gap / 2, midpoint + gap / 2];
  const rendered = points.map(point => {
    const rawX = centers[point.classId] + point.noiseX * 22;
    const x = Number(Math.max(3, Math.min(97, rawX)).toFixed(4));
    return { ...point, x, correct: (x >= 50 ? 1 : 0) === point.classId };
  });
  const hits = rendered.filter(point => point.correct).length;
  const accuracy = (100 * hits / rendered.length).toFixed(1);

  return (
    <div className="probe-visualizer-container">
      <div className="probe-header">
        <h4>{t.title}</h4>
        <p>{t.intro}</p>
        <label htmlFor="probe-signal">{t.gap}: <strong>{gap} {t.units}</strong></label>
        <input id="probe-signal" type="range" min="10" max="70" step="0.6" value={gap}
          aria-valuetext={`${gap} ${t.units}`} disabled={!ready}
          onChange={event => setGap(Number(event.target.value))} />
        <div className="probe-shift" role="group" aria-label={t.shift}>
          <button type="button" aria-pressed={!shifted} disabled={!ready}
            onClick={() => setShifted(false)}>{t.inDistribution}</button>
          <button type="button" aria-pressed={shifted} disabled={!ready}
            onClick={() => setShifted(true)}>{t.shifted}</button>
        </div>
        <noscript><p>{t.staticView}</p></noscript>
        <p>{t.centers}: A = {centers[0].toFixed(1)}, B = {centers[1].toFixed(1)}.</p>
      </div>

      <div className="probe-canvas-container">
        <svg viewBox="0 0 100 100" className="probe-svg" role="img">
          <title>{t.plot}</title>
          <line x1="50" y1="4" x2="50" y2="96" stroke="rgba(255,255,255,0.65)"
            strokeWidth="1" strokeDasharray="2,2" />
          {rendered.map(point => (
            <circle key={point.id} cx={point.x} cy={point.y} r="1.6"
              fill={point.classId === 0 ? '#4ade80' : 'none'}
              stroke={point.classId === 1 ? '#f87171' : 'none'} strokeWidth="0.6" />
          ))}
        </svg>
        <div className="probe-axis" aria-hidden="true"><span>0</span><span>x = 50</span><span>100</span></div>
      </div>

      <div className="probe-legend">
        <span><i className="probe-dot-a" aria-hidden="true" /> {t.classA}</span>
        <span><i className="probe-dot-b" aria-hidden="true" /> {t.classB}</span>
      </div>
      <div className="probe-description" role="status">
        <strong>{t.accuracy}: {hits}/{rendered.length} ({accuracy}%)</strong>
      </div>
      <p className="probe-description">{t.rule}</p>
    </div>
  );
};

export default LinearProbeVisualizer;
