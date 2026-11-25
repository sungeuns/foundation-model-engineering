// Regenerate the committed, code-native lesson previews:
//   node scripts/generate-lab-social-cards.mjs
// Or regenerate one lesson without touching existing previews:
//   node scripts/generate-lab-social-cards.mjs --only vision-bridge
// Requires installed project dependencies (sharp) and Noto Sans CJK KR / DejaVu Sans
// fonts. The token-mixture preview also runs the chapter’s Python 3 script.
// These figures use the published exercises and require no network access.
import fs from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { socialCards } from '../src/data/social-cards.js';
import { GET as sampleClockWav, getStaticPaths as sampleClockRates } from '../src/pages/labs/audio/sample-clock-[rate].wav.js';
import { attentionTokens, calculateAttention } from '../src/components/chapter-3/attention-example.mjs';
import { compareTitles, examples } from '../src/components/chapter-14/lexical-dense.mjs';
import { denseResults, bm25Results, fuseRanks } from '../src/components/chapter-14/rank-fusion.mjs';
import { GiB, kvCapacity } from '../src/components/chapter-12/kv-capacity.mjs';
import loopCacheRun from '../public/labs/2026-11/loop-cache.json' with { type: 'json' };
import bucketingRun from '../public/labs/2026-11/kv-batch-bucketing.json' with { type: 'json' };
import receiptRun from '../public/labs/2026-11/receipt-grounding-cpu.json' with { type: 'json' };
import samplerAudit from '../public/labs/2026-11/ddp-sampler-audit.json' with { type: 'json' };

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const text = (value, x, y, size, opts = '') => `<text x="${x}" y="${y}" font-size="${size}" ${opts}>${escape(value)}</text>`;
const ink = '#192a30', teal = '#256257', muted = '#4e5d61';

const copy = {
  'ddp-sampler-audit': {
    path: '/articles/ddp-sampler-audit', render: samplerAuditSvg,
    en: {
      title: 'Why did five predictions get six scores?',
      setup: 'PyTorch DistributedSampler on CPU · fixed predictions · shuffling off',
      rank: 'Rank', batch: 'Batch', visits: 'Score every visit', unique: 'Score each ID once',
      legend: 'Sample ID     ✓ correct     × wrong',
      note: id => `Only sample ${id} was predicted incorrectly. Both ranks receive it.`,
    },
    ko: {
      title: '예측 다섯 개를 왜 여섯 번 채점했을까?',
      setup: 'CPU에서 실행한 PyTorch DistributedSampler · 고정된 예측 · 셔플 끔',
      rank: '랭크', batch: '배치', visits: '받은 대로 채점', unique: 'ID마다 한 번씩 채점',
      legend: '샘플 ID     ✓ 정답     × 오답',
      note: id => `유일한 오답인 ${id}번 샘플이 두 랭크에 모두 들어갔습니다.`,
    },
  },
  'receipt-grounding': {
    path: '/articles/receipt-grounding', render: receiptGroundingSvg,
    en: {
      title: 'What if the receipt has no total?',
      instruction: 'Copy the printed Total line. If it is absent, answer MISSING.',
      input: 'Synthetic receipt used in the run', expected: 'Expected reply', actual: 'Recorded reply',
    },
    ko: {
      title: '영수증의 합계 줄을 지우면?',
      instruction: '합계 줄을 그대로 옮기고, 줄이 없으면 MISSING이라고 답하라는 과제입니다.',
      input: '실험에 사용한 합성 영수증', expected: '기대 응답', actual: '실제 모델 응답',
    },
  },
  'loop-cache-storage': {
    path: '/articles/loop-cache-storage', render: loopCacheStorageSvg,
    en: {
      title: 'One more token, a smaller KV buffer',
      setup: 'One pass through a 24-layer decoder with random FP32 weights on CPU.',
      states: ['After 6 tokens', 'After 7 tokens'], logical: 'Logical KV size', backing: 'Backing storage',
      detail: (before, after) => `One layer’s key tensor stays at ${before[0]} B. Its buffer shrinks from ${before[1]} B to ${after[1]} B.`,
    },
    ko: {
      title: '토큰이 하나 늘었는데 KV 버퍼는 줄었다',
      setup: '가중치를 무작위로 초기화한 24개 층을 CPU에서 FP32로 한 번 통과시켰습니다.',
      states: ['토큰 6개 처리 후', '토큰 7개 처리 후'], logical: 'KV 텐서의 논리적 크기', backing: '실제 버퍼 크기',
      detail: (before, after) => `한 층의 키 텐서는 ${before[0]} B로 그대로입니다. 버퍼는 ${before[1]} B에서 ${after[1]} B로 줄었습니다.`,
    },
  },
  'whisper-sample-rate': {
    path: '/articles/whisper-sample-rate', render: sampleRateSvg,
    en: {
      title: 'How long do 44,100 samples last?',
      setup: 'The WAV header sets the playback speed of the same two notes.',
      second: ' s', time: 'Playback time',
    },
    ko: {
      title: '샘플 44,100개를 재생하면 몇 초일까?',
      setup: '두 WAV 파일에 같은 음을 담고 헤더에 적힌 재생 속도만 바꿨습니다.',
      second: '초', time: '재생 시간',
    },
  },
  'attention-weights': {
    path: '/chapter-3/self-attention-mathematics', number: '3.1', render: attentionWeightsSvg,
    en: {
      title: 'Can “cat” attend to “here”?', setup: 'Example attention weights · Query: cat · τ = 1',
      all: 'All keys', causal: 'Causal', output: 'Weighted sum of V · all keys → causal',
    },
    ko: {
      title: 'cat은 뒤에 오는 here를 볼 수 있을까?', setup: '어텐션 가중치 예제 · 쿼리: cat · τ = 1',
      all: '전체 키', causal: '인과 마스크', output: '값 벡터의 가중합 · 전체 키 → 인과 마스크',
    },
  },
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
  'token-mixture': {
    path: '/chapter-8/continued-pretraining-and-domain-adaptation', number: '8.5', render: tokenMixtureSvg,
    en: {
      title: 'Same 80 work orders, two training runs',
      total: 'Both runs predict 112,000 tokens.',
      passes: ['Read each order once', 'Read each order twice'],
      share: 'from work orders', domain: 'Work orders', replay: 'Replay documents',
    },
    ko: {
      title: '같은 정비 기록 80건을 한 번 읽을 때와 두 번 읽을 때',
      total: '두 학습 모두 예측 대상은 112,000토큰입니다.',
      passes: ['각 기록을 한 번씩', '각 기록을 두 번씩'],
      share: '정비 기록 비율', domain: '정비 기록', replay: '리플레이 문서',
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
  'lexical-dense': {
    path: '/chapter-14/lexical-to-semantic-search', number: '14.1', render: lexicalDenseSvg,
    en: {
      title: 'Which search notices the code?', queryLabel: 'Query',
      document: 'Document title', cosine: 'Cosine',
      setup: '4 documents · 3 hand-built topic features for cosine',
    },
    ko: {
      title: '어느 검색 방식이 코드를 알아볼까?', queryLabel: '검색어',
      document: '문서 제목', cosine: '코사인',
      setup: '문서 4개 · 직접 정한 주제 특성 3개로 코사인 유사도 계산',
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
  'continuous-batching': {
    path: '/chapter-12/continuous-batching', render: continuousBatchingSvg,
    en: {
      title: 'When can request D start decoding?',
      setup: 'Six requests are queued. Each row is a slot and each letter is one generated token.',
      iteration: 'Iteration', policies: ['Static', 'Continuous'],
      first: step => `D starts at ${step}`, finish: (steps, tokens) => `${tokens} tokens in both runs. Static finishes at ${steps[0]}, continuous at ${steps[1]}.`,
    },
    ko: {
      title: '요청 D는 언제 디코딩을 시작할까?',
      setup: '여섯 요청이 대기 중입니다. 각 줄은 슬롯 하나이고 글자 하나는 생성된 토큰 하나입니다.',
      iteration: '반복 회차', policies: ['정적 배칭', '연속 배칭'],
      first: step => `D는 ${step}회차에 시작`, finish: (steps, tokens) => `토큰 ${tokens}개를 생성하는 데 정적 배칭은 ${steps[0]}회, 연속 배칭은 ${steps[1]}회가 걸립니다.`,
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
  'length-bucketing': {
    path: '/chapter-12/length-bucketing-lab', number: '12.7', render: lengthBucketingSvg,
    en: {
      title: 'Can less padding lower peak KV memory?',
      setup: 'SmolLM2-135M · FP32 · Six prompts, two per batch',
      orders: ['Arrival order', 'Sorted by length'],
      lengths: 'Tokens per prompt', cache: 'Prefill KV (KiB)',
      padding: n => `${n} padded positions in total`,
      peak: 'Largest prefill cache',
    },
    ko: {
      title: '길이순으로 묶으면 최대 KV 캐시도 줄어들까?',
      setup: 'SmolLM2-135M · FP32 · 프롬프트 여섯 개를 두 개씩 묶은 실험',
      orders: ['도착 순서', '길이 순서'],
      lengths: '프롬프트 길이 (토큰)', cache: '프리필 KV (KiB)',
      padding: n => `세 배치의 패딩 합계 ${n}자리`,
      peak: '가장 큰 프리필 캐시',
    },
  },
};

const args = process.argv.slice(2);
if (args.length && (args.length !== 2 || args[0] !== '--only' || !Object.hasOwn(copy, args[1]))) {
  throw new Error(`Usage: node scripts/generate-lab-social-cards.mjs [--only ${Object.keys(copy).join('|')}]`);
}
const selectedKind = args[1];

function samplerAuditSvg(lesson, lang, card) {
  const c = lesson[lang];
  const run = samplerAudit.runs.padded;
  const correctById = new Map(samplerAudit.sample_ids.map((id, i) =>
    [id, samplerAudit.labels[i] === samplerAudit.predictions[i]]));
  const wrong = [...correctById].filter(([, correct]) => !correct).map(([id]) => id);
  if (wrong.length !== 1 || !run.ranks.every(row => row.batches.flat().includes(wrong[0]))) {
    throw new Error('Expected a single incorrect prediction shared by both ranks');
  }
  const batchX = batch => 202 + batch * 315;
  const columns = run.ranks[0].batches.map((_, i) =>
    text(`${c.batch} ${i + 1}`, batchX(i), 224, 28, `fill="${muted}" font-weight="600"`)).join('');
  const rows = run.ranks.map(({ rank, batches }, i) => {
    const top = 253 + i * 94;
    const cells = batches.map((ids, batch) => ids.map((id, position) => {
      const x = batchX(batch) + position * 111;
      const correct = correctById.get(id);
      const color = correct ? teal : '#893c32';
      return `<rect x="${x}" y="${top}" width="102" height="66" rx="10" fill="${correct ? '#e0ebe3' : '#f4dfd9'}" stroke="${color}" stroke-width="2"/>`
        + text(`${id} ${correct ? '✓' : '×'}`, x + 51, top + 45, 34,
          `fill="${color}" font-weight="700" text-anchor="middle"`);
    }).join('')).join('');
    return text(`${c.rank} ${rank}`, 64, top + 44, 31, 'font-weight="700"') + cells;
  }).join('');
  const scores = [[c.visits, run.visit_score], [c.unique, run.full_dataset_score]]
    .map(([label, value], i) => text(label, 827, 232 + i * 125, 27, `fill="${muted}"`)
      + text(`${value.correct} / ${value.total}`, 824, 299 + i * 125, 65, 'font-weight="700"')).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" xml:lang="${lang}" role="img" aria-labelledby="card-title card-description">
<title id="card-title">${escape(c.title)}</title><desc id="card-description">${escape(card.alt)}</desc>
<rect width="1200" height="630" fill="#f5f2eb"/>
<g font-family="${lang === 'ko' ? 'Noto Sans CJK KR, DejaVu Sans' : 'DejaVu Sans'}, sans-serif" fill="${ink}">
${text(c.title, 60, 87, lang === 'en' ? 45 : 53, 'font-weight="700"')}
${text(c.setup, 64, 145, 27, `fill="${muted}"`)}
<path d="M64 173H1136 M765 197V467 M64 510H1136" fill="none" stroke="#bac7bf" stroke-width="2"/>
${columns}${rows}${scores}
${text(c.legend, 202, 463, 24, `fill="${muted}" xml:space="preserve"`)}
${text(c.note(wrong[0]), 64, 577, lang === 'en' ? 29 : 32, 'font-weight="600"')}
</g></svg>\n`;
}

async function continuousBatchingSvg(lesson, lang, card) {
  const c = lesson[lang];
  const page = path.join(root, 'src/pages', lang === 'ko' ? 'ko' : '', lesson.path.slice(1) + '.mdx');
  const source = await fs.readFile(page, 'utf8');
  // Each manuscript row contains the three slot assignments for both policies.
  const rows = [...source.matchAll(/^\| (\d+) \| ([A-F—✓ /]+) \| ([^|\n]+) \|$/gm)];
  if (rows.length === 0) throw new Error(`Missing scheduling trace in ${page}`);
  const traces = [2, 3].map(column => rows.map(row => row[column])
    .filter(state => state.includes('/'))
    .map(state => state.replaceAll(' ✓', '').split(' / ')));
  const dx = 880 / rows.length;
  const x = step => 258 + step * dx;
  const axis = rows.map((row, step) => text(row[1], x(step) + dx / 2, 205, 27,
    'text-anchor="middle" font-weight="600"')).join('');
  const panels = traces.map((trace, index) => {
    const y = index === 0 ? 225 : 388;
    const first = trace.findIndex(slots => slots.includes('D')) + 1;
    const cells = trace.map((slots, step) => slots.map((id, slot) => {
      const top = y + slot * 40;
      const fill = id === 'D' ? teal : id === '—' ? '#eeeee8' : '#d9e4dc';
      return `<rect x="${x(step)}" y="${top}" width="${dx - 3}" height="37" rx="4" fill="${fill}"/>`
        + text(id, x(step) + (dx - 3) / 2, top + 28, 27,
          `text-anchor="middle" font-weight="600" fill="${id === 'D' ? 'white' : id === '—' ? '#67736c' : ink}"`);
    }).join('')).join('');
    return text(c.policies[index], 56, y + 48, 30, 'font-weight="700"')
      + text(c.first(first), 56, y + 88, 24, `fill="${teal}"`) + cells;
  }).join('');
  const tokens = traces[0].flat().filter(id => id !== '—').length;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" xml:lang="${lang}" role="img" aria-labelledby="card-title card-description">
<title id="card-title">${escape(c.title)}</title><desc id="card-description">${escape(card.alt)}</desc>
<rect width="1200" height="630" fill="#f5f2eb"/>
<g font-family="${lang === 'ko' ? 'Noto Sans CJK KR, DejaVu Sans' : 'DejaVu Sans'}, sans-serif" fill="${ink}">
${text(c.title, 54, 83, 51, 'font-weight="700"')}
${text(c.setup, 56, 136, 26, `fill="${muted}"`)}
${text(c.iteration, 56, 205, 26, `fill="${muted}"`)}${axis}
${panels}
<path d="M56 365H1138 M56 532H1138" stroke="#bac7bf" stroke-width="2"/>
${text(c.finish(traces.map(trace => trace.length), tokens), 56, 585, 26, 'font-weight="600"')}
</g></svg>\n`;
}

async function receiptGroundingSvg(lesson, lang, card) {
  const c = lesson[lang];
  const run = receiptRun.cases.find(row => row.file === 'receipt-missing.png');
  const png = await fs.readFile(path.join(root, 'src/assets/images/chapter-11', run.file));
  const model = receiptRun.model.split('/').pop();
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1200" height="630" viewBox="0 0 1200 630" xml:lang="${lang}" role="img" aria-labelledby="card-title card-description">
<title id="card-title">${escape(c.title)}</title><desc id="card-description">${escape(card.alt)}</desc>
<rect width="1200" height="630" fill="#f5f2eb"/>
<g font-family="${lang === 'ko' ? 'Noto Sans CJK KR, DejaVu Sans' : 'DejaVu Sans'}, sans-serif" fill="${ink}">
${text(c.title, 60, 86, 58, 'font-weight="700"')}
${text(c.instruction, 64, 145, 32, `fill="${muted}"`)}
<rect x="63" y="184" width="514" height="386" fill="white" stroke="#bec7bf" stroke-width="2"/>
<image x="64" y="185" width="512" height="384" xlink:href="data:image/png;base64,${png.toString('base64')}"/>
${text(c.input, 64, 607, 24, `fill="${muted}"`)}
${text(c.expected, 647, 241, 34)}
${text('MISSING', 642, 324, 76, `font-weight="700" fill="${teal}"`)}
<path d="M647 366H1136" stroke="#b9c3ba" stroke-width="2"/>
${text(c.actual, 647, 420, 34)}
${text(run.raw_text.trim(), 640, 529, 114, 'font-weight="700" fill="#8e442e"')}
${text(model + ' · CPU', 647, 607, 26, `fill="${muted}"`)}
</g></svg>\n`;
}

function loopCacheStorageSvg(lesson, lang, card) {
  const c = lesson[lang];
  const run = loopCacheRun.runs.find(row => row.passes === 1);
  const states = [run.prefill, run.after_one_token];
  const maxBytes = Math.max(...states.map(state => state.backing_bytes));
  const plot = [
    { label: c.logical, field: 'logical_bytes', color: '#385c72' },
    { label: c.backing, field: 'backing_bytes', color: teal },
  ].map(({ label, field, color }, row) => {
    const y = 298 + row * 130;
    const values = states.map((state, i) => {
      const x = 466 + 362 * i;
      const width = 290 * state[field] / maxBytes;
      return `${text(state[field] / 1024 + ' KiB', x, y, 46, 'font-weight="700"')}
<rect x="${x}" y="${y + 19}" width="290" height="18" rx="4" fill="#dce3de"/>
<rect x="${x}" y="${y + 19}" width="${width}" height="18" rx="4" fill="${color}"/>`;
    }).join('');
    return text(label, 68, y, lang === 'ko' ? 32 : 36, 'font-weight="600"') + values;
  }).join('');
  const note = c.detail(run.prefill.first_sliding_key_bytes, run.after_one_token.first_sliding_key_bytes);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" xml:lang="${lang}" role="img" aria-labelledby="card-title card-description">
<title id="card-title">${escape(c.title)}</title><desc id="card-description">${escape(card.alt)}</desc>
<rect width="1200" height="630" fill="#f5f2eb"/>
<g font-family="${lang === 'ko' ? 'Noto Sans CJK KR, DejaVu Sans' : 'DejaVu Sans'}, sans-serif" fill="${ink}">
${text(c.title, 64, 83, 53, 'font-weight="700"')}
${text(c.setup, 66, 136, 27, `fill="${muted}"`)}
${c.states.map((label, i) => text(label, 466 + 362 * i, 209, 29, 'font-weight="600"')).join('')}
<path d="M64 230H1136 M64 362H1136 M64 498H1136" stroke="#bcc7c0" stroke-width="2"/>
${plot}
${text(note, 66, 568, lang === 'ko' ? 29 : 25, `fill="${muted}"`)}
</g></svg>\n`;
}

async function sampleRateSvg(lesson, lang, card) {
  const labels = lesson[lang];
  const pixelsPerSecond = 354;
  const x = seconds => 64 + pixelsPerSecond * seconds;
  const rows = [];
  for (const [index, route] of sampleClockRates().entries()) {
    const wav = Buffer.from(await sampleClockWav(route).arrayBuffer());
    const rate = wav.readUInt32LE(24);
    const frames = wav.readUInt32LE(40) / wav.readUInt16LE(32);
    const duration = frames / rate;
    const width = pixelsPerSecond * duration / 2;
    const top = 243 + index * 152;
    const notes = [441, 882].map((originalHz, note) => {
      const start = x(0) + width * note;
      const hz = originalHz * rate / 44100;
      return `<rect x="${start}" y="${top}" width="${width}" height="62" fill="${note === 0 ? '#244e63' : '#276f61'}"/>
      ${text(hz + ' Hz', start + width / 2, top + 43, 32, 'text-anchor="middle" font-weight="700" fill="white"')}`;
    }).join('\n');
    const seconds = Number.isInteger(duration) ? duration.toFixed(2) : String(duration);
    rows.push(`${text(rate.toLocaleString('en-US') + ' Hz', x(0), top - 21, 37, 'font-weight="700"')}
      ${text(seconds + labels.second, x(duration), top - 21, 36, `text-anchor="end" font-weight="700" fill="${teal}"`)}
      ${notes}`);
  }
  const ticks = [0, 1, 2, 3].map(seconds => `<path d="M${x(seconds)} 478v16" stroke="${ink}" stroke-width="2"/>
    ${text(seconds + labels.second, x(seconds), 533, 29, 'text-anchor="middle"')}`).join('\n');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" xml:lang="${lang}" role="img" aria-labelledby="card-title card-description">
<title id="card-title">${escape(labels.title)}</title><desc id="card-description">${escape(card.alt)}</desc>
<rect width="1200" height="630" fill="#f5f2eb"/>
<g font-family="${lang === 'ko' ? 'Noto Sans CJK KR, DejaVu Sans' : 'DejaVu Sans'}, sans-serif" fill="${ink}">
${text(labels.title, 61, 89, 54, 'font-weight="700"')}
${text(labels.setup, 64, 143, 29, `fill="${muted}"`)}
${rows.join('\n')}
<path d="M${x(0)} 482H${x(3)}" stroke="${ink}" stroke-width="2"/>
${ticks}
${text(labels.time, (x(0) + x(3)) / 2, 590, 30, `text-anchor="middle" fill="${muted}"`)}
</g></svg>\n`;
}

function attentionWeightsSvg(lesson, lang, card) {
  const labels = lesson[lang];
  const selected = attentionTokens.indexOf('cat');
  const unmasked = calculateAttention(selected, 1, false);
  const causal = calculateAttention(selected, 1, true);
  const center = index => 352 + 220 * index;
  const tokens = attentionTokens.map((token, i) =>
    text(token, center(i), 213, 44, 'text-anchor="middle" font-weight="600"')
  ).join('');
  const rows = [unmasked, causal].map(({ weights }, row) => {
    const y = 289 + row * 111;
    const cells = weights.map((weight, i) => {
      const x = center(i);
      const percent = weight === 0 ? '0%' : `${(100 * weight).toFixed(1)}%`;
      return text(percent, x, y, 47, 'text-anchor="middle" font-weight="700"') +
        `<rect x="${x - 75}" y="${y + 15}" width="150" height="9" fill="#d9dfd8"/>` +
        `<rect x="${x - 75}" y="${y + 15}" width="${150 * weight}" height="9" fill="${teal}"/>`;
    }).join('');
    return `<g id="${row ? 'causal' : 'all-keys'}">${text(row ? labels.causal : labels.all, 56, y, 40, 'font-weight="600"')}${cells}</g>`;
  }).join('');
  const vector = output => `[${output.map(value => value.toFixed(3)).join(', ')}]`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" xml:lang="${lang}" role="img" aria-labelledby="card-title card-description">
<title id="card-title">${escape(labels.title)}</title><desc id="card-description">${escape(card.alt)}</desc>
<rect width="1200" height="630" fill="#f5f2eb"/>
<g font-family="${lang === 'ko' ? 'Noto Sans CJK KR, DejaVu Sans' : 'DejaVu Sans'}, sans-serif" fill="${ink}">
${text(labels.title, 54, 85, 62, 'font-weight="700"')}
${text(labels.setup, 57, 145, 39, `fill="${muted}"`)}
${tokens}
<path d="M56 229H1144M56 340H1144M56 451H1144" fill="none" stroke="#bdc8c0" stroke-width="2"/>
${rows}
${text(labels.output, 56, 510, 39, `fill="${muted}"`)}
${text(`${vector(unmasked.output)} → ${vector(causal.output)}`, 55, 583, 54, `fill="${teal}" font-weight="700"`)}
</g></svg>\n`;
}

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

function tokenMixtureSvg(lesson, lang, card) {
  const copy = lesson[lang];
  const output = execFileSync('python3', [path.join(root, 'public/labs/token_exposure.py')], { encoding: 'utf8' });
  const records = output.trim().split('\n').slice(1).map(line => {
    const [run, source, , , targetCount, share] = line.split(',');
    return { run, source, targets: Number(targetCount), share };
  });
  const bars = ['one_pass', 'repeat_domain'].map((run, i) => {
    const domain = records.find(row => row.run === run && row.source === 'domain');
    const replay = records.find(row => row.run === run && row.source === 'replay');
    const width = 1080 * domain.targets / (domain.targets + replay.targets);
    const y = 245 + i * 138;
    const summary = lang === 'ko' ? copy.share + ' ' + domain.share + '%' : domain.share + '% ' + copy.share;
    return `<g id="${run}">
${text(copy.passes[i], 60, y - 18, 38, 'font-weight="700"')}
${text(summary, 1140, y - 18, 38, `text-anchor="end" fill="${teal}" font-weight="700"`)}
<rect x="60" y="${y}" width="1080" height="59" rx="4" fill="#dbe2df"/>
<rect x="60" y="${y}" width="${width}" height="59" rx="4" fill="${teal}"/>
${text(domain.targets.toLocaleString('en-US'), 60 + width / 2, y + 42, 37, 'fill="white" text-anchor="middle" font-weight="700"')}
${text(replay.targets.toLocaleString('en-US'), 60 + (1080 + width) / 2, y + 42, 37, 'text-anchor="middle" font-weight="700"')}
</g>`;
  }).join('\n');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" xml:lang="${lang}" role="img" aria-labelledby="card-title card-description">
<title id="card-title">${escape(copy.title)}</title><desc id="card-description">${escape(card.alt)}</desc>
<rect width="1200" height="630" fill="#f5f2eb"/>
<g font-family="${lang === 'ko' ? 'Noto Sans CJK KR, DejaVu Sans' : 'DejaVu Sans'}, sans-serif" fill="${ink}">
${text(copy.title, 58, 88, lang === 'ko' ? 47 : 48, 'font-weight="700"')}
${text(copy.total, 60, 145, 38, `fill="${muted}"`)}
${bars}
<rect x="60" y="493" width="29" height="29" rx="3" fill="${teal}"/>
${text(copy.domain, 104, 519, 34)}
<rect x="440" y="493" width="29" height="29" rx="3" fill="#dbe2df" stroke="#82918e" stroke-width="2"/>
${text(copy.replay, 484, 519, 34)}
<path d="M60 553H1140" stroke="#bbc8c1" stroke-width="2"/>
${text((lang === 'ko' ? '파운데이션 모델 엔지니어링' : 'Foundation Model Engineering') + ' · ' + lesson.number, 60, 602, 27, `fill="${teal}"`)}
</g></svg>\n`;
}

function lexicalDenseSvg(lesson, lang, card) {
  const c = lesson[lang], ko = lang === 'ko';
  const query = examples[lang].presets[2];
  const { rows } = compareTitles(lang, query);
  const matched = rows.filter(row => row.bm25 > 0);
  const best = Math.max(...matched.map(row => row.bm25));
  const tableRows = matched.map((row, i) => {
    const y = 341 + 100 * i;
    const scoreColor = row.bm25 === best ? teal : ink;
    return `<g id="document-${row.id}">
${text(row.title, 84, y, 38)}
${text(row.bm25.toFixed(3), 860, y, 50, `fill="${scoreColor}" font-weight="700" text-anchor="end"`)}
${text(row.cosine, 1106, y, 50, 'font-weight="700" text-anchor="end"')}
</g>`;
  }).join('\n');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" xml:lang="${lang}" role="img" aria-labelledby="card-title card-description">
<title id="card-title">${escape(c.title)}</title><desc id="card-description">${escape(card.alt)}</desc>
<rect width="1200" height="630" fill="#f5f2eb"/><rect width="12" height="630" fill="${teal}"/>
<g font-family="${ko ? 'Noto Sans CJK KR, DejaVu Sans' : 'DejaVu Sans'}, sans-serif" fill="${ink}">
${text(c.title, 58, 94, 58, 'font-weight="700"')}
${text(c.queryLabel, 62, 165, 33, `fill="${muted}"`)}
${text(query, 188, 165, 46, 'font-weight="700"')}
<rect x="59" y="206" width="1082" height="275" rx="14" fill="white" stroke="#c3cec8" stroke-width="2"/>
${text(c.document, 84, 263, 34, `fill="${muted}"`)}
${text('BM25', 860, 263, 34, `fill="${muted}" text-anchor="end"`)}
${text(c.cosine, 1106, 263, 34, `fill="${muted}" text-anchor="end"`)}
<path d="M60 283H1140M60 382H1140" stroke="#c3cec8" stroke-width="2"/>
${tableRows}
${text(c.setup, 60, 542, 33, `fill="${ink}"`)}
<path d="M60 568H1140" stroke="#bbc8c1" stroke-width="2"/>
${text(ko ? '파운데이션 모델 엔지니어링 · ' + lesson.number : 'Foundation Model Engineering · ' + lesson.number, 60, 605, 24, `fill="${teal}"`)}
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

function lengthBucketingSvg(lesson, lang, card) {
  const c = lesson[lang];
  const groups = [bucketingRun.arrival_order, bucketingRun.length_order];
  const peakBytes = Math.max(...groups.map(group => group.largest_batch_prefill_kv_bytes));
  const panels = groups.map((group, index) => {
    const rows = group.batches.map((batch, i) => {
      const y = 328 + i * 55;
      return `${text(batch.real_lengths.join(', '), 26, y, 34)}
<rect x="246" y="${y - 19}" width="150" height="15" rx="3" fill="#dce3de"/>
<rect x="246" y="${y - 19}" width="${150 * batch.kv_bytes / peakBytes}" height="15" rx="3" fill="${teal}"/>
${text(batch.kv_bytes / 1024, 493, y, 34, 'text-anchor="end" font-weight="700"')}`;
    }).join('\n');
    return `<g transform="translate(${60 + index * 554} 0)">
<rect y="183" width="526" height="349" rx="14" fill="white" stroke="#c3cec8" stroke-width="2"/>
${text(c.orders[index], 26, 234, 38, 'font-weight="700"')}
${text(c.lengths, 26, 281, 22, `fill="${muted}"`)}
${text(c.cache, 246, 281, 22, `fill="${muted}"`)}
${rows}
<path d="M26 465H500" stroke="#c3cec8" stroke-width="2"/>
${text(c.padding(group.padding_slots), 26, 509, 29, `fill="${teal}" font-weight="700"`)}
</g>`;
  }).join('\n');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" xml:lang="${lang}" role="img" aria-labelledby="card-title card-description">
<title id="card-title">${escape(c.title)}</title><desc id="card-description">${escape(card.alt)}</desc>
<rect width="1200" height="630" fill="#f5f2eb"/>
<g font-family="${lang === 'ko' ? 'Noto Sans CJK KR, DejaVu Sans' : 'DejaVu Sans'}, sans-serif" fill="${ink}">
${text(c.title, 58, 85, 45, 'font-weight="700"')}
${text(c.setup, 60, 143, 30, `fill="${muted}"`)}
${panels}
<path d="M60 558H1140" stroke="#bbc8c1" stroke-width="2"/>
${text(c.peak + ' · ' + groups.map(group => group.largest_batch_prefill_kv_bytes / 1024).join(' → ') + ' KiB', 60, 601, 32, 'font-weight="700"')}
${text((lang === 'ko' ? '파운데이션 모델 엔지니어링' : 'Foundation Model Engineering') + ' · ' + lesson.number, 1140, 601, 21, `text-anchor="end" fill="${teal}"`)}
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
      const svg = await lesson.render(lesson, lang, card);
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
