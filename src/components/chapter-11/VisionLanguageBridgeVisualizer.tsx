import React, { useEffect, useState } from 'react';
import './vision-language-bridge.css';

const copy = {
  en: {
    title: 'Where do the image features go?',
    side: 'Side of each square image',
    count: 'Number of images',
    setup: 'For this exercise, each 14 × 14 pixel patch produces one feature. The prompt has 32 text positions, including any image markers.',
    perImage: 'patches per image',
    total: 'input features across all images',
    sequence: 'Decoder sequence',
    memory: 'Separate visual memory',
    projection: 'Project each patch',
    external: 'Resample, then cross-attend',
    text: 'Text and markers',
    visual: 'Projected patches',
    positions: 'positions',
    slots: 'slots',
    projectedNote: 'One patch adds one decoder position.',
    resampledNote: 'Each image contributes 64 memory slots. A text query can read them at a cross-attention layer.',
    caption: 'Both paths use the same illustrative patch grid. The counts describe sequence length and memory slots. Measuring latency or detail retention requires a model and workload.',
    sources: 'Architectures',
    resolutionUnit: 'px',
    staticView: 'The example below uses one 224 px image. Enable JavaScript to change the inputs.',
  },
  ko: {
    title: '이미지 특징은 어디에 들어갈까?',
    side: '정사각형 이미지 한 변의 길이',
    count: '이미지 수',
    setup: '이 예제는 14 × 14픽셀 패치 하나에서 특징 벡터 하나를 얻는다고 가정합니다. 프롬프트는 이미지 표시용 토큰을 포함해 32자리입니다.',
    perImage: '이미지 한 장의 패치 수',
    total: '전체 이미지의 특징 벡터 수',
    sequence: '디코더 시퀀스',
    memory: '별도 시각 메모리',
    projection: '패치별 투영',
    external: '리샘플링 후 교차 어텐션',
    text: '텍스트와 이미지 표시 토큰',
    visual: '투영된 패치',
    positions: '자리',
    slots: '슬롯',
    projectedNote: '패치 하나가 디코더 시퀀스에서 한 자리를 차지합니다.',
    resampledNote: '이미지 한 장이 시각 메모리 64슬롯을 채웁니다. 텍스트 쿼리는 교차 어텐션 층에서 이 메모리를 읽습니다.',
    caption: '두 방식에 같은 패치 격자를 적용한 계산 예제입니다. 지연 시간이나 작은 글자를 읽는 능력은 실제 모델과 입력으로 측정해야 합니다.',
    sources: '원 논문',
    resolutionUnit: '픽셀',
    staticView: '아래는 224픽셀 이미지 한 장의 계산 결과입니다. 입력을 바꾸려면 JavaScript를 켜세요.',
  },
};

const textPositions = 32;
const patchSize = 14;
const slotsPerImage = 64;

export default function VisionLanguageBridgeVisualizer({ lang = 'en' }: { lang?: 'en' | 'ko' }) {
  const t = copy[lang];
  const [side, setSide] = useState(224);
  const [images, setImages] = useState(1);
  const [interactive, setInteractive] = useState(false);
  useEffect(() => setInteractive(true), []);
  const patchesPerSide = side / patchSize;
  const patchesPerImage = patchesPerSide ** 2;
  const features = patchesPerImage * images;
  const maxPositions = textPositions + features;
  const paths = [
    { name: t.projection, projected: features, slots: 0, note: t.projectedNote },
    { name: t.external, projected: 0, slots: slotsPerImage * images, note: t.resampledNote },
  ];

  return (
    <section className="bridge-budget" id="visual-token-budget" aria-labelledby="bridge-budget-title">
      <h3 id="bridge-budget-title">{t.title}</h3>
      <p>{t.setup}</p>
      <div className="bridge-budget-controls">
        <label>{t.side}
          <select disabled={!interactive} value={side} onChange={event => setSide(Number(event.target.value))}>
            {[224, 336, 448].map(size => <option key={size} value={size}>{size} {t.resolutionUnit}</option>)}
          </select>
        </label>
        <label>{t.count}
          <select disabled={!interactive} value={images} onChange={event => setImages(Number(event.target.value))}>
            {[1, 2, 4].map(count => <option key={count} value={count}>{count}</option>)}
          </select>
        </label>
      </div>
      <noscript><p>{t.staticView}</p></noscript>
      <div className="bridge-budget-input">
        <span>{t.perImage}<b>{patchesPerSide} × {patchesPerSide} = {patchesPerImage}</b></span>
        <span>{t.total}<b>{patchesPerImage} × {images} = {features}</b></span>
      </div>
      <div className="bridge-budget-legend" aria-hidden="true">
        <span className="bridge-budget-key-text">{t.text}</span>
        <span className="bridge-budget-key-image">{t.visual}</span>
        <span>{lang === 'ko' ? `막대 전체 길이 = 디코더 ${maxPositions}자리` : `Full track = ${maxPositions} decoder positions`}</span>
      </div>
      {paths.map(path => (
        <div key={path.name} className="bridge-budget-path">
          <h4>{path.name}</h4>
          <div className="bridge-budget-track" aria-hidden="true">
            <span className="bridge-budget-text" style={{ width: `${100 * textPositions / maxPositions}%` }} />
            <span className="bridge-budget-image" style={{ width: `${100 * path.projected / maxPositions}%` }} />
          </div>
          <dl>
            <div><dt>{t.sequence}</dt><dd>{textPositions + path.projected} {t.positions}</dd></div>
            <div><dt>{t.memory}</dt><dd>{path.slots} {t.slots}</dd></div>
          </dl>
          <p>{path.note}</p>
        </div>
      ))}
      <output className="bridge-budget-announcement" aria-live="polite" aria-atomic="true">
        {lang === 'ko'
          ? `패치별 투영은 디코더 ${maxPositions}자리, 교차 어텐션은 디코더 ${textPositions}자리와 시각 메모리 ${slotsPerImage * images}슬롯입니다.`
          : `Projection uses ${maxPositions} decoder positions. Cross-attention uses ${textPositions} decoder positions and ${slotsPerImage * images} visual memory slots.`}
      </output>
      <p className="bridge-budget-caption">{t.caption} {t.sources} · <a href="#ref-3">LLaVA</a> · <a href="#ref-2">Flamingo</a></p>
    </section>
  );
}
