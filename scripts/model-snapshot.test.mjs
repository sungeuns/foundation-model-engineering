import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const snapshot = JSON.parse(readFileSync('src/data/commercial-model-snapshot.json', 'utf8'));

test('the cache cost example prices each input token once and uses total input for the long rate', () => {
  const check = `
from decimal import Decimal
from request_cost import text_request_usd

model = "gpt-6.2-sol"
cache = dict(cached_tokens=200_000, write_30m_tokens=50_000, write_12h_tokens=20_000)
# 2,000 ordinary and 270,000 cached or written tokens, plus 2,000 output tokens.
assert text_request_usd(model, 272_000, 2_000, **cache) == Decimal("0.269")
assert text_request_usd(model, 272_001, 2_000, **cache) == Decimal("0.528004")
try:
    text_request_usd(model, 269_999, 2_000, **cache)
except ValueError:
    pass
else:
    raise AssertionError("Cache counts cannot exceed total input")
`;
  execFileSync('python3', ['-B', '-c', check], { cwd: 'public/labs' });
});

test('model profiles preserve dates, provenance, and finite optional measurements', () => {
  assert.match(snapshot.asOf, /^\d{4}-\d{2}-\d{2}$/);
  assert.match(snapshot.evaluationAsOf, /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(new Set(snapshot.models.map(row => row.id)).size, snapshot.models.length);
  for (const row of snapshot.models) {
    assert.ok(row.release <= snapshot.asOf, `${row.model}: future milestone`);
    assert.ok(Number.isFinite(Date.parse(row.release)), row.model);
    for (const key of ['company', 'model', 'access', 'accessKo', 'note', 'noteKo', 'setting']) {
      assert.ok(typeof row[key] === 'string' && row[key].length > 0, `${row.model}: missing ${key}`);
    }
    assert.ok(new URL(row.source).protocol === 'https:');
    assert.equal(row.verifiedAt, snapshot.asOf, `${row.model}: primary facts not checked for this snapshot`);
    if (row.priceValidThrough) {
      assert.ok(row.priceValidThrough >= snapshot.asOf, `${row.model}: expired token-price assumption`);
    }
    for (const key of ['aaIndex', 'benchmarkCost', 'benchmarkMinutes', 'contextK', 'inputPrice', 'outputPrice']) {
      if (row[key] !== undefined) assert.ok(Number.isFinite(row[key]) && row[key] >= 0, `${row.model}: invalid ${key}`);
    }
    if (row.aaIndex !== undefined || row.benchmarkCost !== undefined || row.benchmarkMinutes !== undefined) {
      assert.ok(row.evaluation?.startsWith('https://artificialanalysis.ai/'), `${row.model}: evaluation provenance`);
      assert.equal(row.evaluationMethodology, snapshot.methodology, `${row.model}: mixed evaluation versions`);
      assert.equal(row.evaluationCheckedAt, snapshot.evaluationAsOf);
      assert.equal(row.evaluationVerifiedAt, snapshot.evaluationAsOf, `${row.model}: stale evaluation snapshot`);
      assert.ok(row.evaluationProfile?.length > 0, `${row.model}: exact evaluated profile missing`);
      assert.ok(Number.isFinite(row.aaIndex), `${row.model}: task measurement without a matched index`);
    } else {
      assert.equal(row.evaluationMethodology, undefined, `${row.model}: unverified profile claims a methodology`);
      assert.equal(row.evaluationVerifiedAt, undefined, `${row.model}: missing result marked verified`);
    }
    assert.equal(row.inputPrice === undefined, row.outputPrice === undefined, `${row.model}: incomplete price mix`);
  }
});

test('both language tables match the plotted source record without filling missing measurements', () => {
  for (const lang of ['en', 'ko']) {
    const prefix = lang === 'en' ? 'src/pages' : 'src/pages/ko';
    const source = readFileSync(`${prefix}/chapter-17/commercial-model-benchmarks.mdx`, 'utf8');
    assert.ok(source.includes(snapshot.asOf));
    assert.ok(source.includes(snapshot.evaluationAsOf));
    const rows = source.split('\n').filter(line => line.startsWith('| ')).map(line => line.split('|').slice(1, -1).map(x => x.trim()));
    for (const model of snapshot.models) {
      const anchor = `model-${model.id}`;
      const matches = rows.filter(row => row[0] === `<a id="${anchor}" href="#${anchor}">${model.model}</a>`);
      assert.equal(matches.length, 1, `${lang}: ${model.model}`);
      const row = matches[0];
      const missing = lang === 'en' ? 'not reported' : '미공개';
      assert.equal(row[1], model.release, model.model);
      assert.equal(row[2], lang === 'en' ? model.access : model.accessKo, model.model);
      assert.equal(row[4], model.aaIndex === undefined ? missing : String(model.aaIndex), model.model);
      assert.equal(row[5], model.benchmarkCost === undefined ? missing : model.benchmarkCost.toFixed(2), model.model);
      assert.equal(row[6], model.benchmarkMinutes === undefined ? missing : model.benchmarkMinutes.toFixed(1), model.model);
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

test('GPT-6.2 launch access and benchmark profiles refer to the right products', () => {
  const launch = 'https://openai.com/index/introducing-gpt-6-2-astra-sol/';
  for (const id of ['gpt-62-astra', 'gpt-62-sol']) {
    const row = snapshot.models.find(model => model.id === id);
    assert.equal(row.specification, launch);
    for (const surface of ['API', 'ChatGPT Work', 'Codex']) {
      assert.ok(row.access.includes(surface), `${id}: ${surface} in English`);
      assert.ok(row.accessKo.includes(surface), `${id}: ${surface} in Korean`);
    }
    assert.equal(row.evaluationProfile, `${row.model} (Max)`);
  }
});

test('the bilingual GPT-6.2 request examples send the same case with each endpoint’s effort field', () => {
  for (const prefix of ['', 'ko/']) {
    const source = readFileSync(`src/pages/${prefix}chapter-17/commercial-model-benchmarks.mdx`, 'utf8');
    const example = source.split('<a id="gpt-62-api-requests"></a>')[1].split('\n### ')[0];
    const blocks = [...example.matchAll(/^```json\n([\s\S]*?)\n```$/gm)].map(match => JSON.parse(match[1]));
    assert.equal(blocks.length, 2);
    const [chat, responses] = blocks;
    assert.equal(chat.model, 'gpt-6.2-sol');
    assert.equal(responses.model, chat.model);
    assert.deepEqual(chat.messages, [{ role: 'user', content: responses.input }]);
    assert.ok(responses.input.includes('XQ-17'));
    assert.equal(chat.reasoning_effort, 'medium');
    assert.deepEqual(responses.reasoning, { effort: chat.reasoning_effort });
    for (const [body, unsupported] of [[chat, 'reasoning'], [responses, 'reasoning_effort']]) {
      for (const key of [unsupported, 'temperature', 'top_p', 'top_logprobs', 'logprobs']) {
        assert.ok(!Object.hasOwn(body, key), key);
      }
    }
    assert.ok(!responses.include?.includes('message.output_text.logprobs'));
  }
});
