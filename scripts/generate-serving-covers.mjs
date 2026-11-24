// Regenerate both EPUB covers with node scripts/generate-serving-covers.mjs.
// Uses the project's sharp dependency and local Lato and Noto Sans CJK KR fonts.
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { GiB, kvCapacity } from '../src/components/chapter-12/kv-capacity.mjs';
import { defaultBudget, nineRequestWorkload } from '../src/components/chapter-12/kv-scenario.mjs';

const editions = {
  en: {
    series: 'Foundation Model Engineering',
    title: ['LLM Serving', 'in Practice'],
    subtitle: ['KV cache memory, request scheduling', 'and streaming latency'],
    chart: 'KV memory for nine requests', prompt: 'Prompts only', peak: 'At the output caps',
    budget: `${defaultBudget} GiB budget`,
  },
  ko: {
    series: '파운데이션 모델 엔지니어링',
    title: ['LLM 서빙', '실전'],
    subtitle: ['KV 캐시 메모리, 요청 스케줄링,', '스트리밍 지연'],
    chart: '요청 9개의 KV 메모리', prompt: '프롬프트만 저장', peak: '출력 한도까지 저장',
    budget: `KV 예산 ${defaultBudget} GiB`,
  },
};
const { prompt, peak } = kvCapacity(nineRequestWorkload, defaultBudget * GiB);
const promptGiB = prompt.requested / GiB;
const peakGiB = peak.requested / GiB;
const left = 76, right = 884;
const scale = (right - left) / 32;

function bar(y, value) {
  const width = value * scale;
  const budgetWidth = defaultBudget * scale;
  const over = value > defaultBudget
    ? `<rect x="${left + budgetWidth}" y="${y}" width="${width - budgetWidth}" height="31" fill="#f0a56f"/>`
    : '';
  return `<rect x="${left}" y="${y}" width="${right - left}" height="31" fill="#315253"/>
    <rect x="${left}" y="${y}" width="${Math.min(width, budgetWidth)}" height="31" fill="#a9d6c7"/>${over}`;
}

for (const [lang, t] of Object.entries(editions)) {
  const font = lang === 'ko' ? 'Noto Sans CJK KR' : 'Lato';
  const budgetX = left + defaultBudget * scale;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="1360" viewBox="0 0 960 1360" xml:lang="${lang}">
  <rect width="960" height="1360" fill="#f7f3e8"/>
  <g font-family="${font}, sans-serif" fill="#12383b">
    <text x="76" y="92" font-size="36" font-weight="600">${t.series}</text>
    <path d="M76 120H884" stroke="#78918a" stroke-width="2"/>
    <g font-size="146" font-weight="900" letter-spacing="-5">
      <text x="68" y="308">${t.title[0]}</text>
      <text x="68" y="461">${t.title[1]}</text>
    </g>
    <g font-size="40">
      <text x="76" y="550">${t.subtitle[0]}</text>
      <text x="76" y="606">${t.subtitle[1]}</text>
    </g>
    <rect x="0" y="686" width="960" height="499" fill="#12383b"/>
    <g fill="#f7f3e8">
      <text x="76" y="770" font-size="42" font-weight="700">${t.chart}</text>
      <g font-size="32">
        <text x="76" y="850">${t.prompt}</text>
        <text x="884" y="850" text-anchor="end">${promptGiB} GiB</text>
        <text x="76" y="979">${t.peak}</text>
        <text x="884" y="979" text-anchor="end">${peakGiB} GiB</text>
      </g>
    </g>
    ${bar(871, promptGiB)}
    ${bar(1000, peakGiB)}
    <path d="M${budgetX} 855V1078" stroke="#f7f3e8" stroke-width="3" stroke-dasharray="6 6"/>
    <text x="${budgetX}" y="1126" fill="#f7f3e8" font-size="31" text-anchor="middle">${t.budget}</text>
    <text x="76" y="1292" font-size="43" font-weight="700">Seongeun So</text>
  </g>
</svg>`;
  const destination = fileURLToPath(new URL(`../public/social/serving-field-guide-${lang}.png`, import.meta.url));
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(destination);
}
