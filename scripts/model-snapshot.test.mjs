import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const snapshot = JSON.parse(readFileSync('src/data/commercial-model-snapshot.json', 'utf8'));

test('model profiles preserve dates, provenance, and finite optional measurements', () => {
  assert.match(snapshot.asOf, /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(new Set(snapshot.models.map(row => row.id)).size, snapshot.models.length);
  for (const row of snapshot.models) {
    assert.ok(row.release <= snapshot.asOf, `${row.model}: future milestone`);
    assert.ok(Number.isFinite(Date.parse(row.release)), row.model);
    for (const key of ['company', 'model', 'access', 'accessKo', 'note', 'noteKo', 'setting']) {
      assert.ok(typeof row[key] === 'string' && row[key].length > 0, `${row.model}: missing ${key}`);
    }
    assert.ok(new URL(row.source).protocol === 'https:');
    for (const key of ['aaIndex', 'benchmarkCost', 'contextK', 'inputPrice', 'outputPrice']) {
      if (row[key] !== undefined) assert.ok(Number.isFinite(row[key]) && row[key] >= 0, `${row.model}: invalid ${key}`);
    }
    if (row.aaIndex !== undefined || row.benchmarkCost !== undefined) {
      assert.ok(row.evaluation?.startsWith('https://artificialanalysis.ai/'), `${row.model}: evaluation provenance`);
    }
    assert.equal(row.inputPrice === undefined, row.outputPrice === undefined, `${row.model}: incomplete price mix`);
  }
});

test('both language tables match the plotted source record without filling missing measurements', () => {
  for (const lang of ['en', 'ko']) {
    const prefix = lang === 'en' ? 'src/pages' : 'src/pages/ko';
    const source = readFileSync(`${prefix}/chapter-17/commercial-model-benchmarks.mdx`, 'utf8');
    assert.ok(source.includes(snapshot.asOf));
    const rows = source.split('\n').filter(line => line.startsWith('| ')).map(line => line.split('|').slice(1, -1).map(x => x.trim()));
    for (const model of snapshot.models) {
      const matches = rows.filter(row => row[0] === model.model);
      assert.equal(matches.length, 1, `${lang}: ${model.model}`);
      const row = matches[0];
      const missing = lang === 'en' ? 'not reported' : '미공개';
      assert.equal(row[1], model.release, model.model);
      assert.equal(row[2], lang === 'en' ? model.access : model.accessKo, model.model);
      assert.equal(row[4], model.aaIndex === undefined ? missing : String(model.aaIndex), model.model);
      assert.equal(row[5], model.benchmarkCost === undefined ? missing : model.benchmarkCost.toFixed(2), model.model);
      assert.ok(source.includes(model.source), `${model.model}: absent primary reference`);
      if (model.evaluation) assert.ok(source.includes(model.evaluation), `${model.model}: absent evaluation reference`);
    }
  }
});

test('a separately identified revision cannot inherit another row’s evaluation silently', () => {
  const newer = snapshot.models.find(row => row.id === 'deepseek-v41-flash-1017');
  const older = snapshot.models.find(row => row.id === 'deepseek-v41-flash');
  assert.ok(newer && older);
  assert.notEqual(newer.source, older.source);
  if (newer.evaluation !== undefined) assert.notEqual(newer.evaluation, older.evaluation);
  if (newer.evaluation === undefined) {
    assert.equal(newer.aaIndex, undefined);
    assert.equal(newer.benchmarkCost, undefined);
  }
});
