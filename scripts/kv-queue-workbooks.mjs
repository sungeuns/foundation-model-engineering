// Regenerate the optional teaching downloads with @oai/artifact-tool available
// in Node's module path: node scripts/kv-queue-workbooks.mjs [output-dir] [preview-dir]
// The site build serves the committed workbooks without spreadsheet dependencies.
import assert from 'node:assert/strict';
import { copyFile, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { defaultBudget, nineRequestWorkload } from '../src/components/chapter-12/kv-scenario.mjs';

const library = createRequire(import.meta.url).resolve('@oai/artifact-tool');
const { Workbook, SpreadsheetFile } = await import(pathToFileURL(library).href);
const destination = process.argv[2] || fileURLToPath(new URL('../public/labs/', import.meta.url));
const preview = process.argv[3];
const license = (await readFile(new URL('../LICENSE', import.meta.url), 'utf8')).trim().split(/\n\s*\n/);
const base = 'https://sungeuns.github.io/foundation-model-engineering/';
const first = 14;
const last = 45;
const firstMixedShort = first + 5;
const lastMixedShort = first + 8;
const input = '#fff0c9';
const ink = '#173445';
const teal = '#125960';

const copy = {
  en: {
    main: 'Queue', notes: 'Teaching notes', title: 'KV cache budget for a mixed request queue',
    intro: 'Edit the amber cells. Compare prompt memory with memory at the output caps. The teaching notes include a mixed workload.',
    summary: ['Net budget (GiB)', 'Prompts (GiB)', 'At caps (GiB)', 'Free at caps (GiB)', 'Requests', 'Result at caps'],
    geometry: 'Dense cache layout shared by every request',
    drivers: ['Layers', 'KV heads', 'Head dimension', 'Bytes per value', 'Bytes per token'],
    scope: 'Use the budget left after weights, workspaces and reserves. A negative free balance is the shortfall.',
    table: 'Requests in the same pool', edit: 'Enter both token counts for up to 32 requests. A prompt needs at least one token. A zero output cap is valid. Clear both cells to remove a row.',
    columns: ['Request', 'Prompt tokens', 'Output cap (tokens)', 'Prompt (GiB)', 'At cap (GiB)', 'Input check'],
    valid: 'Ready', invalid: 'Check lengths', badBudget: 'Check budget', badLayout: 'Check layout', badRows: 'Check rows', empty: 'Enter requests', over: 'Over budget', fit: 'Fits',
    exercise: 'Three workloads for the same cache',
    notesIntro: 'Start on the Queue sheet. Keep the 24 GiB net budget, 80 layers, 8 KV heads, 128 values per head and 2 bytes per value.',
    cases: [
      ['Nine equal requests', 'Start with nine prompts of 8,192 tokens and an output cap of 2,048 tokens per request. The last prompt fits. Will the pool still fit all nine continuations?', 'Prompts 22.5 GiB. At the caps 28.125 GiB. The queue exceeds the budget by 4.125 GiB.'],
      ['Five long and four short', `Change requests 6–9 (B${firstMixedShort}:C${lastMixedShort}) to 4,096 prompt tokens and 1,024 output tokens each. Leave requests 1–5 as they were.`, 'Prompts 17.5 GiB. At the caps 21.875 GiB. The queue has 2.125 GiB left.'],
      ['One longer continuation', `From the mixed queue, change only the first request’s output cap (C${first}) to 12,288. Predict which total stays the same.`, 'Prompts still use 17.5 GiB. At the caps the queue needs 25 GiB, which is 1 GiB over budget.'],
    ],
    why: 'How the cells are calculated',
    method: 'Each cached token needs 2 × layers × KV heads × head dimension × bytes per value. The leading 2 counts keys and values. Sum each request’s prompt tokens for the initial payload, then add its output cap for the full-length payload. One GiB is 2³⁰ bytes.',
    limit: 'The example assumes dense KV storage and independent requests in a single memory pool. Shared prefixes, paging and padding, quantization metadata, and sharded or replicated KV state require separate accounting. The result measures a payload bound, not observed GPU capacity or latency.',
    ref: 'Source and reuse', license: 'MIT License', src: 'Chapter 12.1 · KV cache management',
  },
  ko: {
    main: '요청 대기열', notes: '실습 안내', title: '길이가 다른 요청의 KV 캐시 예산',
    intro: '연노랑 셀을 수정해 프롬프트 저장 직후와 출력 한도에 도달한 시점의 메모리를 비교하세요. 실습 안내 시트에서 세 가지 사례를 풀 수 있습니다.',
    summary: ['순예산 (GiB)', '프롬프트 (GiB)', '출력 한도 시 (GiB)', '남는 용량 (GiB)', '요청 수', '출력 한도 시 판정'],
    geometry: '모든 요청에 공통인 밀집 KV 캐시 구조',
    drivers: ['레이어 수', 'KV 헤드 수', '헤드 차원', '값당 바이트', '토큰당 바이트'],
    scope: '순예산은 가중치, 작업 공간, 예비 메모리를 빼고 남은 용량입니다. 남는 용량이 음수면 그만큼 부족합니다.',
    table: '같은 메모리 풀을 쓰는 요청', edit: '최대 32개 요청의 두 토큰 수를 모두 입력하세요. 프롬프트는 1토큰 이상이며 출력 한도에는 0도 쓸 수 있습니다. 행을 제외하려면 두 입력을 모두 지우세요.',
    columns: ['요청 번호', '프롬프트 토큰', '출력 한도 (토큰)', '프롬프트 (GiB)', '한도 도달 시 (GiB)', '입력 상태'],
    valid: '입력됨', invalid: '토큰 수 확인', badBudget: '순예산 확인', badLayout: '캐시 구조 확인', badRows: '요청 입력 확인', empty: '요청 입력 필요', over: '예산 초과', fit: '예산 이내',
    exercise: '같은 KV 캐시로 세 가지 대기열 비교하기',
    notesIntro: '요청 대기열 시트에서 시작하세요. 순예산 24 GiB, 레이어 80개, KV 헤드 8개, 헤드 차원 128, 값당 2바이트는 그대로 둡니다.',
    cases: [
      ['길이가 같은 요청 9개', '기본값은 요청마다 프롬프트 8,192토큰, 출력 한도 2,048토큰입니다. 아홉 번째 프롬프트까지 저장할 수 있다면, 아홉 요청 모두 출력 한도까지 생성할 수 있을까요?', '프롬프트는 22.5 GiB, 출력 한도에 도달하면 28.125 GiB입니다. 예산보다 4.125 GiB 더 필요합니다.'],
      ['긴 요청 5개와 짧은 요청 4개', `6~9번 요청(B${firstMixedShort}:C${lastMixedShort})을 각각 프롬프트 4,096토큰, 출력 한도 1,024토큰으로 바꾸세요. 1~5번 요청은 그대로 둡니다.`, '프롬프트는 17.5 GiB, 출력 한도에 도달하면 21.875 GiB입니다. 2.125 GiB가 남습니다.'],
      ['출력이 더 길어진 요청 1개', `바로 앞의 혼합 대기열에서 1번 요청의 출력 한도(C${first})만 12,288로 바꾸세요. 어느 합계가 그대로일까요?`, '프롬프트는 여전히 17.5 GiB입니다. 한도까지 생성하면 합계가 25 GiB가 되어 1 GiB가 부족합니다.'],
    ],
    why: '계산 방법',
    method: '토큰당 바이트는 2 × 레이어 수 × KV 헤드 수 × 헤드 차원 × 값당 바이트입니다. 맨 앞의 2는 키와 값을 뜻합니다. 각 요청의 프롬프트 토큰으로 초기 용량을 구하고, 여기에 요청별 출력 한도를 더해 최종 용량을 구합니다. 1 GiB는 2³⁰바이트입니다.',
    limit: '하나의 메모리 풀에서 독립된 요청들이 밀집 KV 캐시를 사용한다고 가정합니다. 접두사 공유, 페이지 할당과 패딩, 양자화 메타데이터, KV 상태의 분할·복제 비용은 따로 계산해야 합니다. 결과는 캐시 데이터의 용량 추정치이며 실제 GPU의 동시 처리량이나 지연 시간을 측정한 값은 아닙니다.',
    ref: '출처와 재사용', license: 'MIT 라이선스', src: '12.1절 · KV 캐시 관리',
  },
};

function cell(sheet, address, value) {
  sheet.getRange(address).values = [[value]];
}

function formula(sheet, address, value) {
  sheet.getRange(address).formulas = [[value]];
}

// A full-width text area contains a single paragraph. Data cells stay independent.
function line(sheet, address, value, height, heading = false) {
  const row = sheet.getRange(address);
  row.merge();
  cell(sheet, address.split(':')[0], value);
  row.format.wrapText = true;
  row.format.rowHeight = height;
  row.format.verticalAlignment = 'center';
  if (heading) {
    row.format.fill = teal;
    row.format.font.color = '#ffffff';
    row.format.font.bold = true;
  }
}

function headers(sheet, address, labels) {
  const row = sheet.getRange(address);
  row.values = [labels];
  row.format.fill = '#deecea';
  row.format.font.bold = true;
  row.format.horizontalAlignment = 'center';
  row.format.rowHeight = 23;
}

function setup(sheet, widths, lastRow, font) {
  sheet.showGridLines = false;
  const grid = sheet.getRange(`A1:${String.fromCharCode(64 + widths.length)}${lastRow}`);
  grid.format.font.name = font;
  grid.format.font.size = 11;
  grid.format.font.color = ink;
  grid.format.rowHeight = 20;
  grid.format.verticalAlignment = 'center';
  widths.forEach((width, i) => { sheet.getCell(0, i).format.columnWidthPx = width; });
}

function makeQueue(sheet, c, font) {
  setup(sheet, [149, 150, 159, 159, 147, 160], last, font);
  line(sheet, 'A1:F1', c.title, 34, true);
  sheet.getRange('A1').format.font.size = 16;
  line(sheet, 'A2:F2', c.intro, 29);
  headers(sheet, 'A4:F4', c.summary);
  cell(sheet, 'A5', defaultBudget);
  const flags = `F${first}:F${last}`;
  formula(sheet, 'E5', `=IF(COUNTIF(${flags},"${c.invalid}")>0,"",COUNTIF(${flags},"${c.valid}"))`);
  for (const [metric, column] of [['B5', 'D'], ['C5', 'E']]) {
    formula(sheet, metric, `=IF(AND(ISNUMBER(E5),E5>0,ISNUMBER(E9)),SUM(${column}${first}:${column}${last}),"")`);
  }
  const budgetOK = 'AND(ISNUMBER(A5),A5>=0)';
  formula(sheet, 'D5', `=IFERROR(IF(AND(${budgetOK},ISNUMBER(C5)),A5-C5,""),"")`);
  formula(sheet, 'F5', `=IFERROR(IF(NOT(${budgetOK}),"${c.badBudget}",IF(NOT(ISNUMBER(E9)),"${c.badLayout}",IF(NOT(ISNUMBER(E5)),"${c.badRows}",IF(E5=0,"${c.empty}",IF(D5<0,"${c.over}","${c.fit}"))))),"${c.badBudget}")`);
  const summary = sheet.getRange('A5:F5');
  summary.format.fill = '#edf4f4';
  summary.format.font.bold = true;
  summary.format.rowHeight = 29;
  sheet.getRange('F5').format.horizontalAlignment = 'center';
  sheet.getRange('A5').format.fill = input;
  line(sheet, 'A7:F7', c.geometry, 22, true);
  headers(sheet, 'A8:E8', c.drivers);
  const { layers, heads, dimension, precision, batch, sequence, generated } = nineRequestWorkload;
  sheet.getRange('A9:D9').values = [[layers, heads, dimension, precision]];
  sheet.getRange('A9:D9').format.fill = input;
  formula(sheet, 'E9', '=IFERROR(IF(AND(COUNT(A9:D9)=4,MIN(A9:D9)>0,A9=INT(A9),B9=INT(B9),C9=INT(C9)),2*A9*B9*C9*D9,""),"")');
  line(sheet, 'A10:F10', c.scope, 25);
  line(sheet, 'A11:F11', c.table, 22, true);
  line(sheet, 'A12:F12', c.edit, 32);
  headers(sheet, 'A13:F13', c.columns);
  for (let row = first; row <= last; row++) {
    const id = row - first + 1;
    cell(sheet, 'A' + row, id);
    if (id <= batch) sheet.getRange(`B${row}:C${row}`).values = [[sequence, generated]];
    const tokens = `B${row}:C${row}`;
    formula(sheet, 'F' + row, `=IFERROR(IF(COUNTA(${tokens})=0,"",IF(AND(COUNT(${tokens})=2,B${row}>=1,C${row}>=0,B${row}=INT(B${row}),C${row}=INT(C${row})),"${c.valid}","${c.invalid}")),"${c.invalid}")`);
    const ready = `AND(F${row}="${c.valid}",ISNUMBER($E$9))`;
    formula(sheet, 'D' + row, `=IF(${ready},B${row}*$E$9/2^30,"")`);
    formula(sheet, 'E' + row, `=IF(${ready},(B${row}+C${row})*$E$9/2^30,"")`);
  }
  sheet.getRange(`B${first}:C${last}`).format.fill = input;
  sheet.getRange(`B${first}:C${last}`).setNumberFormat('#,##0');
  sheet.getRange('E9').setNumberFormat('#,##0.00');
  sheet.getRange(flags).format.horizontalAlignment = 'center';
  sheet.getRange(`D${first}:E${last}`).setNumberFormat('0.0000');
  sheet.getRange('B5:D5').setNumberFormat('0.0000');
  sheet.getRange('D5').conditionalFormats.addCustom('AND(ISNUMBER(D5),D5<0)', { fill: '#fce6dc', font: { color: '#792e13' } });
  sheet.getRange(flags).conditionalFormats.addCustom(`F${first}="${c.invalid}"`, { fill: '#fce6dc', font: { color: '#792e13' } });
}

function makeNotes(sheet, c, lang, font) {
  setup(sheet, [300, 300, 324], 26, font);
  line(sheet, 'A1:C1', c.exercise, 34, true);
  sheet.getRange('A1').format.font.size = 16;
  line(sheet, 'A2:C2', c.notesIntro, 34);
  c.cases.forEach(([title, question, answer], i) => {
    const row = 4 + 3 * i;
    line(sheet, `A${row}:C${row}`, title, 23, true);
    line(sheet, `A${row + 1}:C${row + 1}`, question, 36);
    line(sheet, `A${row + 2}:C${row + 2}`, answer, 30);
    sheet.getRange(`A${row + 2}:C${row + 2}`).format.fill = '#edf4f4';
  });
  line(sheet, 'A14:C14', c.why, 23, true);
  line(sheet, 'A15:C15', c.method, 50);
  line(sheet, 'A16:C16', c.limit, 63);
  line(sheet, 'A18:C18', c.ref, 23, true);
  line(sheet, 'A19:C19', c.src, 21);
  const source = base + (lang === 'ko' ? 'ko/' : '') + 'chapter-12/kv-cache-management/#kv-cache-capacity';
  line(sheet, 'A20:C20', source, 26);
  formula(sheet, 'A20', `=HYPERLINK("${source}","${source}")`);
  sheet.getRange('A20').format.font.color = '#185d82';
  const [notice, copyright, ...paragraphs] = license;
  line(sheet, 'A22:C22', lang === 'en' ? notice : c.license, 23, true);
  line(sheet, 'A23:C23', copyright, 23);
  paragraphs.forEach((paragraph, i) => {
    const row = 24 + i;
    line(sheet, `A${row}:C${row}`, paragraph.replaceAll('\n', ' '), [73, 43, 83][i]);
  });
}

await mkdir(destination, { recursive: true });
if (preview) await mkdir(preview, { recursive: true });
for (const [lang, c] of Object.entries(copy)) {
  const workbook = Workbook.create();
  const queue = workbook.worksheets.add(c.main);
  const notes = workbook.worksheets.add(c.notes);
  const font = lang === 'ko' ? 'Noto Sans CJK KR' : 'Arial';
  makeQueue(queue, c, font);
  makeNotes(notes, c, lang, font);
  workbook.recalculate();
  assert.deepEqual(queue.getRange('A5:F5').values[0], [24, 22.5, 28.125, -4.125, 9, c.over]);
  assert.equal(queue.getRange('E9').values[0][0], 327680);
  if (preview) {
    for (const [sheet, range, tag] of [[queue, 'A1:F23', 'queue'], [notes, 'A1:C26', 'notes']]) {
      const image = await workbook.render({ sheetName: sheet.name, range, scale: 1, format: 'png' });
      await writeFile(resolve(preview, `kv-${lang}-${tag}.png`), new Uint8Array(await image.arrayBuffer()));
    }
  }
  const name = `kv-queue-${lang}.xlsx`;
  // The export library also writes a diagnostic sidecar. Keep it out of the
  // published download directory and copy only the complete workbook there.
  const staging = await mkdtemp(join(tmpdir(), 'kv-queue-'));
  try {
    const file = await SpreadsheetFile.exportXlsx(workbook);
    await file.save(join(staging, name));
    await copyFile(join(staging, name), resolve(destination, name));
  } finally {
    await rm(staging, { recursive: true, force: true });
  }
}
