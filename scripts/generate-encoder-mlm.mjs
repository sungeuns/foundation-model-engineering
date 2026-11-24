// Rebuild the chapter 4.1 worked example with node scripts/generate-encoder-mlm.mjs.
import { writeFileSync } from 'node:fs';

const rows = [
  { input: 'the', units: 1 },
  { input: '[MASK]', units: 2, target: 'river' },
  { input: 'bank', units: 1, target: 'bank' },
  { input: 'flooded', units: 4 },
  { input: '[PAD]', units: 0 },
];
const total = rows.reduce((sum, { units }) => sum + units, 0);
const labels = {
  en: {
    title: 'One query at “bank”', input: 'Input key', weight: 'Attention weight', target: 'MLM target',
    note: 'A dash means this position contributes no MLM loss.',
    description: 'The query at bank reads the input keys the, [MASK], bank and flooded with weights 1/8, 2/8, 1/8 and 4/8. The padding key has zero weight. Only [MASK] and bank are scored in the loss, against river and bank respectively.',
  },
  ko: {
    title: 'bank 위치의 쿼리 하나', input: '입력 키', weight: '어텐션 가중치', target: 'MLM 정답',
    note: '줄표는 해당 위치를 MLM 손실에서 제외한다는 뜻입니다.',
    description: 'bank 위치에서 입력 키 the, [MASK], bank, flooded에 준 가중치는 1/8, 2/8, 1/8, 4/8입니다. 패딩 키의 가중치는 0입니다. 손실은 [MASK] 위치와 bank 위치에서만 계산하며, 원래 토큰인 river와 bank가 각각 정답입니다.',
  },
};

for (const [lang, t] of Object.entries(labels)) {
  const grid = rows.map(({ input, units, target }, i) => {
    const y = 87 + i * 34;
    const fraction = units ? `${units}/${total}` : '0';
    return `<g><path d="M12 ${y+12}h336" stroke="#d2dcd9"/>
  <text x="16" y="${y}">${input}</text>
  <rect x="116" y="${y-12}" width="80" height="12" rx="2" fill="#e7efed"/>
  <rect x="116" y="${y-12}" width="${80 * units / total}" height="12" rx="2" fill="#24645b"/>
  <text x="209" y="${y}">${fraction}</text>
  <text x="271" y="${y}">${target ?? '—'}</text></g>`;
  }).join('\n');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="278" viewBox="0 0 360 278" xml:lang="${lang}" role="img" aria-labelledby="mlm-title mlm-description">
<title id="mlm-title">${t.title}</title><desc id="mlm-description">${t.description}</desc>
<rect width="360" height="278" fill="white"/>
<g font-family="system-ui, Noto Sans CJK KR, sans-serif" fill="#1e3533">
 <text x="15" y="27" font-weight="700" font-size="20">${t.title}</text>
 <g font-size="15" font-weight="600"><text x="15" y="57">${t.input}</text><text x="115" y="57">${t.weight}</text><text x="266" y="57">${t.target}</text></g>
 <path d="M12 65h336" stroke="#7a928b"/>
 <g font-family="ui-monospace, monospace" font-size="17">${grid}</g>
 <text x="14" y="262" font-size="13">${t.note}</text>
</g></svg>\n`;
  writeFileSync(new URL(`../src/assets/images/chapter-4/encoder-mlm-${lang}.svg`, import.meta.url), svg);
}
