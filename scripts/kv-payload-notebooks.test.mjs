import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

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
