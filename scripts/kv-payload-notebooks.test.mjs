import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
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

test('worked notebooks preserve every starter cell and publish four measured decoding steps', () => {
  const report = JSON.parse(read('public/labs/2026-11/kv-batch-padding-cpu.json'));
  const rows = report.unequal_lengths.rows;
  const modelOutputs = [];
  for (const lang of ['en', 'ko']) {
    const starterPath = 'public/labs/kv-cache-payload-' + lang + '.ipynb';
    const filename = 'kv-cache-payload-worked-' + lang + '.ipynb';
    const starterBytes = read(starterPath);
    const starter = JSON.parse(starterBytes);
    const worked = JSON.parse(read('public/labs/2026-11/' + filename));
    const { recorded_run: run, ...originalMetadata } = worked.metadata.fme;
    assert.deepEqual(originalMetadata, starter.metadata.fme);
    assert.equal(run.input_notebook, starterPath);
    assert.equal(run.input_notebook_sha256, createHash('sha256').update(starterBytes).digest('hex'));
    assert.equal(run.model_revision, report.revision);
    assert.equal(run.model, report.model);
    assert.equal(run.device, 'cpu');
    assert.equal(run.dtype, 'float32');
    assert.equal(run.cpu_threads, report.threads);
    for (const name of ['python', 'torch', 'transformers']) assert.equal(run[name], report[name]);
    assert.match(run.model_safetensors_sha256, /^[a-f0-9]{64}$/);
    assert.equal(run.date, '2026-11-25');

    const inputs = notebook => notebook.cells.map(({ cell_type, id, source }) => ({ cell_type, id, source }));
    assert.deepEqual(inputs(worked), inputs(starter));
    const cells = worked.cells.filter(cell => cell.cell_type === 'code');
    assert.deepEqual(cells.map(cell => cell.execution_count), [1, 2, 3, 4, 5, 6]);
    assert.deepEqual(cells[0].outputs, []);
    const stdout = cells.slice(1).map(cell => {
      assert.equal(cell.outputs.length, 1);
      const [output] = cell.outputs;
      assert.deepEqual([output.output_type, output.name], ['stream', 'stdout']);
      const text = output.text.join('');
      assert.doesNotMatch(text, /\/home\/|\/tmp\/|Traceback|warning|token=/i);
      return text;
    });
    assert.match(stdout[0], /46,080 bytes per stored position per request/);
    assert.match(stdout[1], /\(2, 3, 11, 64\)/);
    assert.match(stdout[2], /Prompt cache: 1,013,760 bytes/);
    assert.match(stdout[2], /368,640 bytes occupy padding positions/);
    const steps = stdout[3].trim().split('\n');
    assert.equal(steps.length, 4);
    for (const [index, line] of steps.entries()) {
      const match = /^\+(\d+): ([\d,]+) cache bytes; largest logit difference (\S+)$/.exec(line);
      assert.ok(match, line);
      const row = rows[index + 1];
      assert.equal(Number(match[1]), row.step);
      assert.equal(Number(match[2].replaceAll(',', '')), row.dense_key + row.dense_value);
      const measuredDelta = Number(match[3]);
      assert.ok(measuredDelta >= 0 && measuredDelta < 1e-4);
    }
    assert.match(stdout[4], /prompt: 4 requests use 90 MiB; 5 requests fit/);
    assert.match(stdout[4], /reserved: 4 requests use 135 MiB; 3 requests fit/);
    modelOutputs.push(stdout);

    const lesson = read('src/pages/' + (lang === 'ko' ? 'ko/' : '') + 'chapter-12/kv-cache-management.mdx');
    const url = 'https://nbviewer.org/urls/sungeuns.github.io/foundation-model-engineering/labs/2026-11/' + filename;
    assert.ok(lesson.includes(url + '#cell-id=' + cells[4].id));
    assert.ok(read(lang === 'en' ? 'README.md' : 'README.ko.md').includes(url + '#cell-id=' + cells[4].id));
    assert.ok(lesson.includes('download="' + filename + '"'));
  }
  assert.deepEqual(modelOutputs[0], modelOutputs[1]);
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
