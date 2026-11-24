import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { kvCapacity } from '../src/components/chapter-12/kv-capacity.mjs';
import { netBudgetBytes, readKvScenario } from '../src/components/chapter-12/kv-scenario.mjs';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const source = 'https://github.com/sungeuns/cookbook/blob/4640bbf5e5275380cf6a665e049378db30ae6d29/notebooks/en/measure_kv_cache_payload.ipynb';

test('both KV notebooks run the same pinned experiment and link back to their lesson', () => {
  const code = [];
  for (const lang of ['en', 'ko']) {
    const filename = `kv-cache-payload-${lang}.ipynb`;
    const route = (lang === 'ko' ? 'ko/' : '') + 'chapter-12/kv-cache-management';
    const lesson = `https://sungeuns.github.io/foundation-model-engineering/${route}/#kv-payload-notebook`;
    const book = JSON.parse(read('public/labs/' + filename));
    const manuscript = read('src/pages/' + route + '.mdx');
    const info = book.metadata.fme;
    assert.equal(info.language, lang);
    assert.equal(info.lesson, lesson);
    assert.equal(info.source, source);
    assert.equal(info.license, 'Apache-2.0');
    assert.ok(info.license_text.includes('END OF TERMS AND CONDITIONS'));
    assert.ok(book.cells[0].source.join('').includes(lesson));
    assert.ok(manuscript.includes('id="kv-payload-notebook"'));
    assert.ok(manuscript.includes('colab.research.google.com/github/sungeuns/foundation-model-engineering/blob/main/public/labs/' + filename));
    assert.ok(manuscript.includes(`download="${filename}"`));
    const cells = book.cells.filter(cell => cell.cell_type === 'code');
    assert.equal(cells.length, 6);
    for (const cell of cells) {
      assert.deepEqual(cell.outputs, []);
      assert.equal(cell.execution_count, null);
    }
    const steps = cells.map(cell => cell.source.join(''));
    assert.ok(steps[0].includes('transformers==5.24.1'));
    assert.ok(steps[1].includes('93efa2f097d58c2a74874c7e644dbc9b0cee75a2'));
    code.push(steps);
  }
  assert.deepEqual(code[0], code[1]);
});

test('notebook links reproduce both the measured tensors and the 120 MiB exercise', () => {
  const report = JSON.parse(read('public/labs/2026-11/kv-batch-padding-cpu.json'));
  const rows = report.unequal_lengths.rows;
  for (const lang of ['en', 'ko']) {
    const book = JSON.parse(read(`public/labs/kv-cache-payload-${lang}.ipynb`));
    const links = book.cells.flatMap(cell =>
      [...cell.source.join('').matchAll(/\]\((https:\/\/[^)]+#kv-calculator)\)/g)].map(match => new URL(match[1]))
    );
    assert.equal(links.length, 2);
    for (const link of links) {
      assert.equal(link.origin + link.pathname, book.metadata.fme.lesson.split('#')[0]);
    }
    const [measured, reservation] = links.map(link => {
      const scenario = readKvScenario(link.search);
      assert.ok(scenario, link.href);
      return kvCapacity(scenario.workload, netBudgetBytes(scenario.budget));
    });
    assert.equal(measured.prompt.requested, rows[0].dense_key + rows[0].dense_value);
    assert.equal(measured.peak.requested, rows.at(-1).dense_key + rows.at(-1).dense_value);
    assert.equal(reservation.prompt.requested, 90 * 2 ** 20);
    assert.equal(reservation.peak.requested, 135 * 2 ** 20);
    assert.equal(reservation.prompt.balance, 30 * 2 ** 20);
    assert.equal(reservation.prompt.capacity, 5);
    assert.equal(reservation.peak.capacity, 3);
  }
});

test('both padding tables report the recorded dense and independent cache sizes', () => {
  const report = JSON.parse(read('public/labs/2026-11/kv-batch-padding-cpu.json'));
  const tableTotals = [];
  for (const scenario of [report.unequal_lengths, report.equal_lengths]) {
    for (const [step, row] of scenario.rows.entries()) {
      assert.equal(row.step, step);
      const denseBytes = row.dense_key + row.dense_value;
      const soloBytes = row.solo_total.reduce((a, b) => a + b, 0);
      assert.deepEqual(row.solo_total, scenario.lengths.map(n => (n + step) * scenario.bytes_per_position));
      assert.equal(denseBytes, scenario.lengths.length * (Math.max(...scenario.lengths) + step) * scenario.bytes_per_position);
      assert.equal(denseBytes - soloBytes, row.padding_bytes);
      if (step === 0 || step === scenario.rows.length - 1) {
        tableTotals.push([denseBytes, soloBytes, row.padding_bytes].map(n => n / 1024));
      }
    }
  }
  for (const prefix of ['', 'ko/']) {
    const text = read(`src/pages/${prefix}chapter-12/kv-cache-management.mdx`);
    const section = text.split('<a id="kv-batch-padding"></a>')[1].split('\n## ')[0];
    const totals = section.split('\n').filter(line => /^\|\s*3\b/.test(line)).map(line =>
      line.trim().split('|').slice(-4, -1).map(cell => Number(cell.replaceAll(',', '').trim()))
    );
    assert.deepEqual(totals, tableTotals);
  }
});
