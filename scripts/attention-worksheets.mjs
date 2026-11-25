// Generate the two printable HTML sources in a temporary directory:
//   node scripts/attention-worksheets.mjs /tmp/attention-sheets
// Open each source in a browser and print all pages at 100%, with browser
// headers/footers off. The published PDFs are public/labs/attention-worksheet-{en,ko}.pdf.
// The offline source uses local fonts; install Noto Sans CJK KR for Korean.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { attentionTokens, calculateAttention, keys, queries, values } from '../src/components/chapter-3/attention-example.mjs';

const base = 'https://sungeuns.github.io/foundation-model-engineering/';
const repo = 'https://github.com/sungeuns/foundation-model-engineering';
const cat = attentionTokens.indexOf('cat');
const all = calculateAttention(cat, 1, false);
const causal = calculateAttention(cat, 1, true);
const raw = keys.map(key => key.reduce((sum, x, d) => sum + x * queries[cat][d], 0));
const visibleMass = all.weights.slice(0, cat + 1).reduce((a, b) => a + b, 0);
const fix = x => x.toFixed(4);
const vector = xs => '[' + xs.join(', ') + ']';
const styles = `
@page {size: A4; margin: 0}
* {box-sizing: border-box}
body {margin:0;color:#162d36;font-family:"Noto Sans",Arial,sans-serif;font-size:11pt;line-height:1.45}
:lang(ko) body {font-family:"Noto Sans CJK KR","Malgun Gothic",sans-serif;word-break:keep-all}
article {box-sizing:border-box;width:210mm;height:297mm;padding:15mm 17mm 12mm;display:flex;flex-direction:column;break-after:page}
article:last-child {break-after:auto}
header,footer {display:flex;align-items:center;justify-content:space-between;gap:1em;font-size:9pt}
header {border-bottom:1.1pt solid #1e4956;padding-bottom:2.7mm;color:#245865}
h1 {font-size:25pt;letter-spacing:-.035em;line-height:1.2;margin:7mm 0 1.5mm}
h2 {font-size:14pt;letter-spacing:-.02em;margin:5.5mm 0 1.2mm;line-height:1.3}
p {margin:1.2mm 0 2mm}
code,.formula,td {font-family:"DejaVu Sans Mono",monospace;font-variant-numeric:tabular-nums}
.formula {font-size:10.5pt;line-height:1.7;border-left:2.5pt solid #2b6570;padding:1.5mm 3mm;margin:3mm 0}
table {width:100%;border-collapse:collapse;text-align:center;font-size:10pt;margin:2mm 0}
th {font-size:9pt;font-weight:600;color:#245865;border-bottom:1pt solid #607e83}
td,th {padding:2.6mm 1mm}
td {border-bottom:.55pt solid #a4b7ba}
td:first-child,th:first-child {text-align:left}
.workline {height:8.5mm;border-bottom:.5pt solid #aab5b6}
footer {margin-top:auto;border-top:.65pt solid #87999c;padding-top:3mm;color:#375761}
footer span:last-child {white-space:nowrap}
a {color:#15596c;text-underline-offset:2px}
.note {font-size:9pt;color:#42585f}
`;
function worksheet(lang) {
  const t = (en, ko) => lang === 'ko' ? ko : en;
  const lesson = base + (lang === 'ko' ? 'ko/' : '') + 'chapter-3/self-attention-mathematics/#attention-weight-example';
  const title = t('What can “cat” read?', '‘cat’은 어느 토큰을 읽을 수 있을까?');
  const work = t('Causal attention worksheet', '인과 어텐션 활동지');
  const answers = t('Worked solution', '풀이');
  const intro = t('Each row is one token. Use the query at “cat”. The key width is 2 and the score temperature is 1. A calculator is enough.', '각 행은 토큰 하나입니다. ‘cat’ 위치의 질의로 계산하세요. 키의 차원은 2, 점수 온도는 1입니다. 계산기만 있으면 됩니다.');
  const page = (number, label, content) => `<article><header><strong>Foundation Model Engineering</strong><span>3.1 · ${label}</span></header>${content}
    <footer><span>© 2026 Seongeun So · <a href="${repo}">github.com/sungeuns/foundation-model-engineering</a> · <a href="${repo}/blob/main/LICENSE">${t('MIT license', 'MIT 라이선스')}</a></span><span>${number} / 2</span></footer></article>`;
  const lines = n => '<div class="workline"></div>'.repeat(n);
  const table = filled => `<table><thead><tr>${[
    t('Token','토큰'), 'K', 'V', 'q · k', t('All keys','전체 가중치'), t('Causal','인과 가중치'),
  ].map(x=>`<th scope="col">${x}</th>`).join('')}</tr></thead><tbody>${attentionTokens.map((token, i) =>
    `<tr><td>${token}</td><td>${vector(keys[i])}</td><td>${vector(values[i])}</td><td>${filled ? raw[i] : ''}</td><td>${filled ? fix(all.weights[i]) : ''}</td><td>${filled ? fix(causal.weights[i]) : ''}</td></tr>`
  ).join('')}</tbody></table>`;
  const q1=t('1. Fill in two attention rows','1. 두 가지 가중치 행을 채워 보세요');
  const q2=t('2. Mix the values','2. 값 벡터를 섞어 보세요');
  const q3=t('3. Change one future value','3. 미래 위치의 값 하나를 바꿔 보세요');
  const q4=t('4. Find the masking bug','4. 마스크 처리 오류를 찾아보세요');
  const solution1 = t('Divide each raw dot product by √2. In the causal run the first two tokens are visible. Their scores are about 0.7071 and 1.4142. Compute each weight using only the visible terms in the denominator.', '내적을 각각 √2로 나눕니다. 인과 마스크를 켜면 처음 두 토큰만 보이고, 두 점수는 약 0.7071과 1.4142입니다. 보이는 토큰만 분모에 넣어 각 가중치를 구합니다.');
  const worked = `<h1>${answers}</h1><p>${solution1}</p>
    <p class="formula">w(The) = exp(1/√2) / (exp(1/√2) + exp(2/√2)) ≈ ${fix(causal.weights[0])}</p>
    ${table(true)}<p class="note">${t('Displayed weights are rounded. Keep full precision until the final output.', '표의 가중치는 반올림했습니다. 최종 출력은 반올림 전 값으로 계산합니다.')}</p>
    <h2>${q2}</h2><p>${t('For each weight row w, the first coordinate is w(The) + 2w(sat) − w(here). The second coordinate is 2w(cat) + w(sat) + w(here).', '가중치 행을 w라 하면 첫 좌표는 w(The) + 2w(sat) − w(here), 둘째 좌표는 2w(cat) + w(sat) + w(here)입니다.')}</p>
    <p class="formula">${t('All keys','전체 키')} → ${vector(all.output.map(fix))}<br>${t('Causal','인과 마스크')} → ${vector(causal.output.map(fix))}</p>
    <h2>${q3}</h2><p>${t('Q and K stay fixed, so the weights stay fixed. Only the second output coordinate can change. With all keys its increase is', '값 벡터만 바꿨으므로 질의와 키는 그대로이고 가중치도 변하지 않습니다. 둘째 출력 좌표만 변할 수 있습니다. 전체 키를 쓰면 그 좌표는')} 8 × w(here) ≈ ${fix(8 * all.weights.at(-1))}${t('. With the causal mask that weight is zero, so both output coordinates stay the same.','만큼 커집니다. 인과 마스크를 켜면 그 가중치가 0이므로 두 출력 좌표가 모두 그대로입니다.')}</p>
    <h2>${q4}</h2><p>${t('After the late mask the surviving weights sum to','뒤늦게 가리면 살아남은 두 가중치의 합은')} ${fix(visibleMass)}${t('. A normalized row should sum to 1. Mask the scores before softmax, or divide the surviving weights by their sum when that sum is positive.', '입니다. 정규화한 행의 합은 1이어야 합니다. 소프트맥스 전에 점수를 가리거나, 남은 가중치의 합이 양수일 때 그 합으로 각각 나눕니다.')}</p>
    <p><a href="${lesson}">${t('Try every query in the browser','브라우저에서 다른 질의도 실험하기')}</a> · <a href="${base}labs/self_attention.py">${t('Download the matching PyTorch script','같은 계산을 하는 PyTorch 예제')}</a></p>`;
  const problems = `<h1>${title}</h1><p>${intro} <code>q(cat) = ${vector(queries[cat])}</code></p>
    <p class="formula">sᵢ = (q · kᵢ) / √2<br>wᵢ = exp(sᵢ) / Σⱼ exp(sⱼ)</p>
    <h2>${q1}</h2><p>${t('First allow every key. Then apply a causal mask: “cat” can read itself and earlier positions. Sum over visible keys only. Write 0 for a blocked key.', '먼저 네 키를 모두 사용합니다. 이어서 인과 마스크를 켜면 ‘cat’은 자신과 앞선 위치만 읽습니다. 분모에는 보이는 키만 포함하고 가려진 키의 가중치는 0으로 적으세요.')}</p>${table(false)}
    <h2>${q2}</h2><p>${t('Multiply each V by its weight and add the four vectors. Write the two output vectors, one for each mask setting.', '각 V에 그 위치의 가중치를 곱해 네 벡터를 더하세요. 마스크를 껐을 때와 켰을 때의 출력 벡터를 각각 적으세요.')}</p>${lines(2)}
    <h2>${q3}</h2><p>${t('Add [0, 8] to V(here). How much does each output move? Use the weights you already calculated.', 'V(here)에 [0, 8]을 더합니다. 앞에서 구한 가중치만 이용해 두 경우의 출력 변화량을 구하세요.')}</p>${lines(1)}
    <h2>${q4}</h2><p>${t('A teammate applies softmax to all four scores, then zeros the last two weights. What quick check reveals the error?', '동료가 네 점수에 소프트맥스를 적용한 뒤 마지막 두 가중치를 0으로 바꿨습니다. 어느 숫자를 확인하면 오류를 찾을 수 있을까요?')}</p>${lines(1)}`;
  return `<!doctype html><html lang="${lang}"><meta charset="utf-8"><title>${title} · Foundation Model Engineering</title><style>${styles}</style><body>${page(1,work,problems)}${page(2,answers,worked)}</body></html>`;
}

const destination = process.argv[2];
if (!destination) throw new Error('Pass a destination directory for the printable HTML files.');
mkdirSync(destination, {recursive:true});
for (const lang of ['en','ko']) writeFileSync(join(destination, 'attention-worksheet-' + lang + '.html'), worksheet(lang));
