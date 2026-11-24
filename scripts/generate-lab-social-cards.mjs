// Regenerate the committed, code-native lesson previews:
//   node scripts/generate-lab-social-cards.mjs
// Or regenerate one lesson without touching existing previews:
//   node scripts/generate-lab-social-cards.mjs --only vision-bridge
// Requires installed project dependencies (sharp) and Noto Sans CJK KR / DejaVu Sans
// fonts. No network, model call, or external image is used. These are explanatory
// cards, not plots or screenshots of measured experimental outcomes.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { socialCards } from '../src/data/social-cards.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const text = (value, x, y, size, opts = '') => `<text x="${x}" y="${y}" font-size="${size}" ${opts}>${escape(value)}</text>`;
const ink = '#192a30', teal = '#256257', muted = '#4e5d61';

const copy = {
  decoder: {
    path: '/chapter-7/tiny-decoder-lab', number: '7.5',
    en: {
      title: ['Train a tiny', 'decoder.'], subtitle: 'Then challenge what it learned.',
      chips: ['CPU + PyTorch', 'Synthetic copying task'],
      detail: 'Code, explanation, and a testable result.',
      panel: 'CHECK THREE THINGS',
      checks: [
        ['Causal masking', 'Can future tokens leak backward?'],
        ['Remove past context', 'What changes without earlier tokens?'],
        ['Checkpoint replay', 'Does a restored run continue exactly?'],
      ],
    },
    ko: {
      title: ['작은 디코더를', '직접 학습해 보세요'], subtitle: '결과를 믿기 전에, 동작부터 확인합니다.',
      chips: ['CPU + PyTorch', '합성 토큰 복사 과제'],
      detail: '코드와 설명을 읽고, 직접 검증합니다.',
      panel: '세 가지 동작을 확인하세요',
      checks: [
        ['인과 마스크', '미래 토큰의 정보가 새어 나올까?'],
        ['과거 문맥 제거', '과거 토큰을 가리면 무엇이 달라질까?'],
        ['체크포인트 재개', '복원한 학습은 같은 경로를 따를까?'],
      ],
    },
  },
  evaluation: {
    path: '/chapter-17/experimental-design-and-uncertainty', number: '17.7',
    en: {
      title: ['Does the gain', 'justify a release?'], subtitle: 'Compare the same cases. Account for uncertainty.',
      chips: ['Python standard library', 'No model API'],
      detail: 'A runnable, synthetic decision exercise.',
      panel: 'FROM EVIDENCE TO A DECISION',
      checks: [
        ['Pair the same cases', 'Keep each candidate–champion pair.'],
        ['Resample whole clusters', 'Preserve dependence among siblings.'],
      ],
      decisions: ['Pass', 'Review', 'Block'], gate: 'Synthetic offline gates',
    },
    ko: {
      title: ['점수가 올랐다면,', '배포해도 될까요?'], subtitle: '같은 사례의 결과와 불확실성을 함께 봅니다.',
      chips: ['Python 표준 라이브러리', '모델 API 불필요'],
      detail: '직접 실행하는 합성 평가 실습입니다.',
      panel: '근거에서 판단까지',
      checks: [
        ['같은 사례를 대응 비교', '기존 모델·후보 모델의 쌍을 유지합니다.'],
        ['군집 단위 재표집', '유사 사례 사이의 의존성을 보존합니다.'],
      ],
      decisions: ['통과', '재검토', '차단'], gate: '합성 오프라인 평가 기준',
    },
  },
  'vision-bridge': {
    path: '/chapter-11/vision-language-bridges', number: '11.1',
    en: {
      title: 'Same image. Different decoder length.',
      setup: '1 image · 224 × 224 px · 14 × 14 px patches · 32 prompt positions',
      projection: 'Project each patch',
      resampling: 'Resample, then cross-attend',
      positions: 'decoder positions',
      formula: patches => `${patches} patches + 32 prompt positions`,
      memory: 'slots · separate visual memory',
      note: 'Toy calculation · Prompt count includes image markers',
    },
    ko: {
      title: '같은 이미지, 달라지는 디코더 길이',
      setup: '이미지 1장 · 224 × 224픽셀 · 14 × 14픽셀 패치 · 프롬프트 32자리',
      projection: '패치별 투영',
      resampling: '리샘플링 후 교차 어텐션',
      positions: '자리 · 디코더',
      formula: patches => `패치 ${patches}개 + 프롬프트 32자리`,
      memory: '슬롯 · 별도 시각 메모리',
      note: '계산 예제 · 프롬프트에 이미지 표시 토큰 포함',
    },
  },
};

const args = process.argv.slice(2);
if (args.length && (args.length !== 2 || args[0] !== '--only' || !Object.hasOwn(copy, args[1]))) {
  throw new Error(`Usage: node scripts/generate-lab-social-cards.mjs [--only ${Object.keys(copy).join('|')}]`);
}
const selectedKind = args[1];

function visionBridgeSvg(lesson, lang, card) {
  const c = lesson[lang], korean = lang === 'ko';
  // Same authored setup as VisionLanguageBridgeVisualizer's initial state.
  // These are sequence and memory counts, not performance measurements.
  const patches = (224 / 14) ** 2, prompt = 32, memory = 64;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" xml:lang="${lang}" role="img" aria-labelledby="card-title card-description">
<title id="card-title">${escape(c.title)}</title><desc id="card-description">${escape(card.alt)}</desc>
<rect width="1200" height="630" fill="#f5f2eb"/><rect width="12" height="630" fill="${teal}"/>
<g font-family="${korean ? 'Noto Sans CJK KR, DejaVu Sans' : 'DejaVu Sans'}, sans-serif" fill="${ink}">
${text(korean ? '파운데이션 모델 엔지니어링' : 'FOUNDATION MODEL ENGINEERING', 64, 61, 19, `fill="${teal}" font-weight="600" ${korean ? '' : 'letter-spacing="1.6"'}`)}
${text(korean ? `${lesson.number} · 비전–언어 모델` : `${lesson.number} / VISION–LANGUAGE MODELS`, 1136, 61, 18, `fill="${teal}" text-anchor="end"`)}
${text(c.title, 61, 140, korean ? 48 : 45, 'font-weight="700"')}
${text(c.setup, 64, 193, korean ? 24 : 25, `fill="${muted}"`)}
<rect x="64" y="229" width="520" height="260" rx="20" fill="#ffffff" stroke="#c5cec6"/>
<rect x="616" y="229" width="520" height="260" rx="20" fill="#ffffff" stroke="#c5cec6"/>
${text(c.projection, 90, 276, 26, `fill="${teal}" font-weight="600"`)}
${text(c.resampling, 642, 276, korean ? 26 : 25, `fill="${teal}" font-weight="600"`)}
${text(prompt + patches, 87, 372, 90, 'font-weight="700"')}
${text(c.positions, 288, 351, 26, `fill="${muted}"`)}
${text(prompt, 639, 372, 90, 'font-weight="700"')}
${text(c.positions, 786, 351, 26, `fill="${muted}"`)}
<path d="M90 402H558" stroke="#dbe1db"/>
${text(c.formula(patches), 90, 447, korean ? 24 : 22, `fill="${muted}"`)}
<rect x="642" y="408" width="468" height="54" rx="9" fill="#f8ecd9"/>
${text(memory, 659, 444, 29, 'fill="#82491f" font-weight="700"')}
${text(c.memory, 711, 444, korean ? 23 : 21, 'fill="#82491f"')}
${text(c.note, 64, 529, korean ? 21 : 22, `fill="${muted}"`)}
<path d="M64 554H1136" stroke="#bbc8c1" stroke-width="2"/>
${text(korean ? '무료 온라인 교재 · 한국어 / 영어' : 'Free online textbook · English / Korean', 64, 597, 20, `fill="${teal}"`)}
${text('sungeuns.github.io', 1136, 597, 20, `fill="${muted}" text-anchor="end"`)}
</g></svg>\n`;
}

for (const [kind, lesson] of Object.entries(copy)) {
  if (selectedKind && selectedKind !== kind) continue;
  for (const lang of ['en', 'ko']) {
    const c = lesson[lang], card = socialCards[lesson.path][lang];
    if (kind === 'vision-bridge') {
      const svg = visionBridgeSvg(lesson, lang, card);
      const imagePath = path.join(root, 'public', card.image);
      await fs.writeFile(imagePath.replace(/\.png$/, '.svg'), svg);
      await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(imagePath);
      console.log(`${path.relative(root, imagePath)}: 1200 × 630`);
      continue;
    }
    const korean = lang === 'ko', evaluation = kind === 'evaluation';
    const chipWidth = evaluation ? 300 : 215;
    const secondX = 64 + chipWidth + 16;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" xml:lang="${lang}" role="img" aria-labelledby="card-title card-description">
<title id="card-title">${escape(c.title.join(' '))}</title><desc id="card-description">${escape(card.alt)}</desc>
<rect width="1200" height="630" fill="#f5f2eb"/><rect width="12" height="630" fill="${teal}"/>
<g font-family="${korean ? 'Noto Sans CJK KR, DejaVu Sans' : 'DejaVu Sans'}, sans-serif" fill="${ink}">
${text(korean ? '파운데이션 모델 엔지니어링' : 'FOUNDATION MODEL ENGINEERING', 64, 61, 19, `fill="${teal}" font-weight="600" ${korean ? '' : 'letter-spacing="1.6"'}`)}
${text(korean ? `${lesson.number} · 실행 실습` : `${lesson.number} / RUNNABLE LAB`, 1136, 61, 18, `fill="${teal}" text-anchor="end"`)}
${text(c.title[0], 61, 163, korean ? 52 : 54, 'font-weight="700"')}
${text(c.title[1], 61, 232, korean ? 52 : 54, 'font-weight="700"')}
${text(c.subtitle, 64, 293, korean ? 24 : evaluation ? 22 : 27, `fill="${muted}"`)}
<rect x="64" y="344" width="${chipWidth}" height="48" rx="8" fill="#e3ece5"/>
${text(c.chips[0], 82, 375, 21, `fill="${teal}"`)}
<rect x="${secondX}" y="344" width="${evaluation ? 225 : 324}" height="48" rx="8" fill="#ebe9df"/>
${text(c.chips[1], secondX + 18, 375, 21, `fill="${muted}"`)}
${text(c.detail, 64, 445, 21, `fill="${muted}"`)}
<rect x="716" y="112" width="420" height="390" rx="20" fill="#ffffff" stroke="#c5cec6"/>
${text(c.panel, 742, 150, korean ? 19 : 16, `fill="${teal}" font-weight="600"`)}
${c.checks.map(([label, detail], i) => {
      const y = 201 + i * 106;
      return `${i ? `<path d="M742 ${y - 40}H1110" stroke="#dbe1db"/>` : ''}${text(label, 742, y, korean ? 25 : 25, 'font-weight="700"')}${text(detail, 742, y + 31, korean ? 18 : 18, `fill="${muted}"`)}`;
    }).join('\n')}
${evaluation ? `<path d="M742 373H1110" stroke="#dbe1db"/>${c.decisions.map((label, i) => `<rect x="${742 + i * 126}" y="399" width="116" height="46" rx="8" fill="${['#e3efe5','#f8eed6','#f4e5e3'][i]}"/>${text(label, 800 + i * 126, 429, 22, `text-anchor="middle" font-weight="600" fill="${['#245c37','#775208','#913c34'][i]}"`)}`).join('')}${text(c.gate, 742, 479, 18, `fill="${muted}"`)}` : ''}
<path d="M64 543H1136" stroke="#bbc8c1" stroke-width="2"/>
${text(korean ? '무료 온라인 교재 · 한국어 / 영어' : 'Free online textbook · English / Korean', 64, 587, 20, `fill="${teal}"`)}
${text('sungeuns.github.io', 1136, 587, 20, `fill="${muted}" text-anchor="end"`)}
</g></svg>\n`;
    const imagePath = path.join(root, 'public', card.image);
    const sourcePath = imagePath.replace(/\.png$/, '.svg');
    await fs.writeFile(sourcePath, svg);
    await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(imagePath);
    console.log(`${path.relative(root, imagePath)}: 1200 × 630`);
  }
}
