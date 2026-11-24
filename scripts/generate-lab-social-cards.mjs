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
import { denseResults, bm25Results, fuseRanks } from '../src/components/chapter-14/rank-fusion.mjs';
import { GiB, kvCapacity } from '../src/components/chapter-12/kv-capacity.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const text = (value, x, y, size, opts = '') => `<text x="${x}" y="${y}" font-size="${size}" ${opts}>${escape(value)}</text>`;
const ink = '#192a30', teal = '#256257', muted = '#4e5d61';

const copy = {
  'prefix-mask': {
    path: '/chapter-4/hybrid-prefix-lm', number: '4.4', render: prefixMaskSvg,
    en: {
      title: 'Can T2 change an earlier output?',
      setup: 'Change only the value at T2, from 5 to 105.',
      visible: 'Keys T1 may read', blocked: 'Future keys',
      mask: 'Mask passed to PyTorch SDPA', result: 'T1 output before → after',
      boolean: 'Boolean', float: 'Float 0/1',
    },
    ko: {
      title: 'T2가 앞선 위치의 출력을 바꿀 수 있을까?',
      setup: 'T2의 값만 5에서 105로 바꿉니다.',
      visible: 'T1이 읽을 수 있는 키', blocked: '미래 위치의 키',
      mask: 'PyTorch SDPA에 전달한 마스크', result: 'T1 출력의 변화',
      boolean: '불리언', float: '실수형 0/1',
    },
  },
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
    path: '/chapter-11/vision-language-bridges', number: '11.1', render: visionBridgeSvg,
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
  'kv-budget': {
    path: '/chapter-12/kv-cache-management', number: '12.1', render: kvBudgetSvg,
    figureDir: 'src/assets/images/chapter-12',
    en: {
      title: 'What fits in a 24 GiB KV cache?',
      setup: '80 layers · 8 KV heads · head width 128 · BF16 → 320 KiB/token',
      rows: ['9 prompts', '10 prompts', '9 at full length'],
      length: ['8,192 tokens each', '8,192 tokens each', '10,240 tokens each'],
      limit: '24 GiB available', axis: 'Dense KV payload (GiB)',
    },
    ko: {
      title: '24 GiB KV 캐시에 요청을 몇 개 넣을 수 있을까?',
      setup: '80층 · KV 헤드 8개 · 헤드 차원 128 · BF16 → 토큰당 320 KiB',
      rows: ['프롬프트 9개', '프롬프트 10개', '최대 길이 요청 9개'],
      length: ['요청당 8,192토큰', '요청당 8,192토큰', '요청당 10,240토큰'],
      limit: '캐시 예산 24 GiB', axis: '조밀 KV 캐시 용량 (GiB)',
    },
  },
  'rrf-cutoff': {
    path: '/chapter-14/advanced-retrieval', number: '14.3', render: rrfCutoffSvg,
    en: {
      title: 'When does the 404 log rank first?',
      setup: 'Reciprocal rank fusion · Equal weights · k = 60',
      depths: ['1 hit per retriever', '2 hits per retriever'], dense: 'Dense',
      first: ids => ids.length === 1 ? ids[0] + ' ranks first' : ids.join(' and ') + ' tie',
      absence: 'C is outside both lists', note: 'Constructed example · C = the 404 log',
    },
    ko: {
      title: '404 장애 로그는 언제 1위가 될까?',
      setup: '역순위 융합 · 두 목록의 가중치는 동일 · k = 60',
      depths: ['검색기마다 1건', '검색기마다 2건'], dense: '밀집 검색',
      first: ids => ids.length === 1 ? ids[0] + '가 1위' : ids.join('·') + ' 공동 1위',
      absence: '두 목록에서 모두 빠진 C', note: '학습용 예제 · C는 404 장애 로그',
    },
  },
  'streaming-latency': {
    path: '/chapter-12/serving-policies-slos-and-fallbacks', number: '12.6', render: streamingLatencySvg,
    figureDir: 'src/assets/images/chapter-12',
    en: {
      title: 'A 370 ms pause hides in the average',
      setup: 'Both streams have a 100 ms TTFT and a 100 ms mean gap (TPOT).',
      rows: ['Stream A', 'Stream B'], unit: ' ms', elapsed: 'Time since request submission (ms)',
      note: 'Illustrative client-side traces · Each mark is one received token',
    },
    ko: {
      title: '평균에 가려진 370ms의 멈춤',
      setup: '두 응답 모두 첫 토큰 지연(TTFT)과 이후 평균 간격(TPOT)이 100ms입니다.',
      rows: ['응답 A', '응답 B'], unit: 'ms', elapsed: '요청을 보낸 뒤 지난 시간(ms)',
      note: '설명용 클라이언트 수신 기록 · 표시 하나가 토큰 한 개',
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

function kvBudgetSvg(lesson, lang, card) {
  const labels = lesson[lang];
  const ko = lang === 'ko';
  const budget = 24;
  const x = gib => 346 + 21 * gib;
  const shape = { layers: 80, heads: 8, dimension: 128, precision: 2, sequence: 8192 };
  const cases = [[9, 0], [10, 0], [9, 2048]];
  const rows = cases.map(([batch, generated], index) => {
    const { peak } = kvCapacity({ ...shape, batch, generated }, budget * GiB);
    const payload = peak.requested / GiB;
    const y = 238 + 94 * index;
    const within = Math.min(payload, budget);
    const excess = payload > budget
      ? `<rect x="${x(budget)}" y="${y}" width="${x(payload) - x(budget)}" height="30" fill="#a54c2a"/>`
      : '';
    return `<g id="kv-case-${index + 1}">
      ${text(labels.rows[index], 58, y + 10, 31, 'font-weight="700"')}
      ${text(labels.length[index], 59, y + 43, 23, `fill="${muted}"`)}
      <rect x="${x(0)}" y="${y}" height="30" width="${x(within) - x(0)}" fill="${teal}"/>${excess}
      ${text(payload + ' GiB', 1144, y + 26, 32, 'text-anchor="end" font-weight="700"')}
    </g>`;
  }).join('');
  const axis = [0, 8, 16, 24, 32].map(value =>
    `<path d="M${x(value)} 500v8" stroke="${muted}" stroke-width="2"/>${text(value, x(value), 541, 26, 'text-anchor="middle"')}`
  ).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" xml:lang="${lang}" role="img" aria-labelledby="card-title card-description">
<title id="card-title">${escape(labels.title)}</title><desc id="card-description">${escape(card.alt)}</desc>
<rect width="1200" height="630" fill="#f5f2eb"/>
<g font-family="${ko ? 'Noto Sans CJK KR, DejaVu Sans' : 'DejaVu Sans'}, sans-serif" fill="${ink}">
${text(labels.title, 56, 90, ko ? 54 : 52, 'font-weight="700"')}
${text(labels.setup, 58, 148, 29, `fill="${muted}"`)}
${rows}
<path d="M${x(budget)} 201V496" fill="none" stroke="${ink}" stroke-dasharray="7 5" stroke-width="3"/>
${text(labels.limit, x(budget), 189, 27, 'text-anchor="middle" font-weight="700"')}
<path d="M${x(0)} 500H${x(32)}" stroke="${muted}" stroke-width="2"/>
${axis}
<path d="M58 563H1144" stroke="#bbc8c1" stroke-width="2"/>
${text(labels.axis, 58, 603, 24, `fill="${muted}"`)}
${text(ko ? `파운데이션 모델 엔지니어링 · ${lesson.number}` : `Foundation Model Engineering · ${lesson.number}`, 1144, 603, 21, `text-anchor="end" fill="${teal}"`)}
</g></svg>\n`;
}

function prefixMaskSvg(lesson, lang, card) {
  const c = lesson[lang], ko = lang === 'ko';
  const positions = ['P1', 'P2', 'P3', 'T1', 'T2', 'T3', 'T4'];
  const t1 = positions.indexOf('T1');
  const keys = positions.map((label, index) => {
    const x = 60 + index * 156;
    return `<rect x="${x}" y="207" width="140" height="65" rx="8" fill="${index <= t1 ? '#d6e9df' : '#ebe9e4'}"/>
${text(label, x + 70, 252, 38, 'font-weight="700" text-anchor="middle"')}`;
  }).join('\n');
  const values = positions.map((_, index) => index + 1);
  const changed = values.map((value, index) => positions[index] === 'T2' ? value + 100 : value);
  // With Q = K = 0, Boolean masking gives equal weight to visible keys.
  // The additive 0/1 mask instead gives visible keys exp(1) and future keys exp(0).
  const rows = [false, true].map((additive, row) => {
    const weights = positions.map((_, index) => additive ? Math.exp(Number(index <= t1)) : Number(index <= t1));
    const sum = weights.reduce((total, weight) => total + weight, 0);
    const output = vector => vector.reduce((total, value, index) => total + value * weights[index], 0) / sum;
    const format = value => value.toFixed(additive ? 3 : 1);
    const y = 420 + 92 * row;
    return text(additive ? c.float : c.boolean, 62, y, 44, 'font-weight="600"') +
      text(`${format(output(values))} → ${format(output(changed))}`, 638, y, 49,
        `font-weight="700" fill="${additive ? '#8c411e' : teal}"`);
  }).join('\n');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" xml:lang="${lang}" role="img" aria-labelledby="card-title card-description">
<title id="card-title">${escape(c.title)}</title><desc id="card-description">${escape(card.alt)}</desc>
<rect width="1200" height="630" fill="#f5f2eb"/>
<g font-family="${ko ? 'Noto Sans CJK KR, DejaVu Sans' : 'DejaVu Sans'}, sans-serif" fill="${ink}">
${text(c.title, 58, 83, 54, 'font-weight="700"')}
${text(c.setup, 60, 130, 32, `fill="${muted}"`)}
${text(c.visible, 60, 191, 31, `fill="${teal}" font-weight="600"`)}
${text(c.blocked, 684, 191, 31, `fill="${muted}" font-weight="600"`)}
${keys}
${text(c.mask, 60, 341, 32, `fill="${muted}"`)}
${text(c.result, 638, 341, 32, `fill="${muted}"`)}
<path d="M60 356H1140M60 452H1140M60 548H1140" fill="none" stroke="#bbc8c1" stroke-width="2"/>
${rows}
${text(ko ? '파운데이션 모델 엔지니어링 · ' + lesson.number : 'Foundation Model Engineering · ' + lesson.number, 60, 601, 25, `fill="${teal}"`)}
</g></svg>\n`;
}

function rrfCutoffSvg(lesson, lang, card) {
  const c = lesson[lang], ko = lang === 'ko';
  const panels = [1, 2].map((depth, i) => {
    const x = 60 + i * 554;
    const ranked = fuseRanks(denseResults, bm25Results, { depth, k: 60 });
    const leaders = ranked.filter(row => row.place === 1).map(row => row.id);
    return `<g transform="translate(${x} 0)">
<rect y="184" width="526" height="348" rx="18" fill="#fff" stroke="#c3cec8" stroke-width="2"/>
${text(c.depths[i], 26, 238, 37, 'font-weight="700"')}
${[denseResults, bm25Results].map((ids, row) => {
      const y = 306 + 58 * row;
      return text(row ? 'BM25' : c.dense, 26, y, 29, `fill="${muted}"`) +
        text(ids.slice(0, depth).join(' → '), 260, y, 40, 'font-weight="700"');
    }).join('')}
<path d="M26 393H500" stroke="#c3cec8" stroke-width="2"/>
${text(c.first(leaders), 26, 456, 48, `font-weight="700" fill="${teal}"`)}
${text(i ? '2/62 > 1/61' : c.absence, 26, 504, 32, `fill="${muted}"`)}
</g>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" xml:lang="${lang}" role="img" aria-labelledby="card-title card-description">
<title id="card-title">${escape(c.title)}</title><desc id="card-description">${escape(card.alt)}</desc>
<rect width="1200" height="630" fill="#f5f2eb"/>
<g font-family="${ko ? 'Noto Sans CJK KR, DejaVu Sans' : 'DejaVu Sans'}, sans-serif" fill="${ink}">
${text(c.title, 56, 88, 56, 'font-weight="700"')}
${text(c.setup, 60, 145, 32, `fill="${muted}"`)}
${panels}
<path d="M60 557H1140" stroke="#bbc8c1" stroke-width="2"/>
${text(c.note, 60, 601, 25, `fill="${muted}"`)}
${text(ko ? '파운데이션 모델 엔지니어링 · ' + lesson.number : 'Foundation Model Engineering · ' + lesson.number, 1140, 601, 22, `text-anchor="end" fill="${teal}"`)}
</g></svg>\n`;
}

function streamingLatencySvg(lesson, lang, card) {
  const labels = lesson[lang], korean = lang === 'ko';
  // Authored, individually observed arrivals from section 12.6, in milliseconds.
  const traces = [[100, 200, 300, 400, 500], [100, 110, 120, 130, 500]];
  const x = ms => 240 + 1.8 * ms;
  const axis = [0, 100, 200, 300, 400, 500].map(ms => `
    <path d="M${x(ms)} 207V445" stroke="#d2d8d3" stroke-width="2"/>
    ${text(ms, x(ms), 487, 27, `text-anchor="middle" fill="${muted}"`)}`).join('');
  const rows = traces.map((times, i) => {
    const y = 276 + 133 * i;
    const previous = times.at(-2), last = times.at(-1);
    const left = x(previous), right = x(last);
    const accent = i === 0 ? teal : '#974221';
    const ticks = times.map(ms =>
      `<line x1="${x(ms)}" x2="${x(ms)}" y1="${y - 16}" y2="${y + 16}"/>`
    ).join('');
    return `<g>
      ${text(labels.rows[i], 60, y + 9, 30, 'font-weight="700"')}
      <path d="M${x(0)} ${y}H${x(500)}" stroke="#a6b1aa" stroke-width="3"/>
      <g id="arrivals-${i === 0 ? 'a' : 'b'}" stroke="${ink}" stroke-width="7" stroke-linecap="round">${ticks}</g>
      <path d="M${left} ${y - 28}v-10H${right}v10" fill="none" stroke="${accent}" stroke-width="4"/>
      ${text(`${last - previous}${labels.unit}`, (left + right) / 2, y - 51, 33, `text-anchor="middle" fill="${accent}" font-weight="700"`)}
    </g>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" xml:lang="${lang}" role="img" aria-labelledby="card-title card-description">
<title id="card-title">${escape(labels.title)}</title><desc id="card-description">${escape(card.alt)}</desc>
<rect width="1200" height="630" fill="#f5f2eb"/><rect width="12" height="630" fill="${teal}"/>
<g font-family="${korean ? 'Noto Sans CJK KR, DejaVu Sans' : 'DejaVu Sans'}, sans-serif" fill="${ink}">
${text(labels.title, 60, 94, 53, 'font-weight="700"')}
${text(labels.setup, 62, 150, korean ? 28 : 29, `fill="${muted}"`)}
${axis}
${rows}
${text(labels.elapsed, (x(0) + x(500)) / 2, 529, 26, `text-anchor="middle" fill="${muted}"`)}
<path d="M60 554H1140" stroke="#bbc8c1" stroke-width="2"/>
${text(labels.note, 60, 599, korean ? 23 : 22, `fill="${muted}"`)}
${text(korean ? `파운데이션 모델 엔지니어링 · ${lesson.number}` : `Foundation Model Engineering · ${lesson.number}`, 1140, 599, 20, `text-anchor="end" fill="${teal}"`)}
</g></svg>\n`;
}

for (const [kind, lesson] of Object.entries(copy)) {
  if (selectedKind && selectedKind !== kind) continue;
  for (const lang of ['en', 'ko']) {
    const c = lesson[lang], card = socialCards[lesson.path][lang];
    if (lesson.render) {
      const svg = lesson.render(lesson, lang, card);
      const imagePath = path.join(root, 'public', card.image);
      const svgDir = lesson.figureDir ? path.join(root, lesson.figureDir) : path.dirname(imagePath);
      await fs.writeFile(path.join(svgDir, path.basename(imagePath, '.png') + '.svg'), svg);
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
