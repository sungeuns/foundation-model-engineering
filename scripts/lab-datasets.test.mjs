import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { parse } from 'parse5';
import { labDatasets } from '../src/data/lab-datasets.js';

const dist = process.env.SEARCH_DIST_DIR || 'dist';
const asset = (id, ext) => join(dist, 'labs/2026-11', id + '.' + ext);
const receipt = id => JSON.parse(readFileSync(asset(id, 'json'), 'utf8'));
const attr = (node, name) => node.attrs?.find(a => a.name === name)?.value;

function find(node, condition) {
  return (condition(node) ? [node] : []).concat((node.childNodes || []).flatMap(child => find(child, condition)));
}
function csvRows(id) {
  return JSON.parse(execFileSync('python3', ['-c',
    'import csv,json,sys\nwith open(sys.argv[1], encoding="utf-8", newline="") as f:\n print(json.dumps(list(csv.DictReader(f))))',
    asset(id, 'csv')], { encoding: 'utf8' }));
}

test('both translations identify the same dataset and link the two download formats described to crawlers', () => {
  for (const [id, lab] of Object.entries(labDatasets)) {
    for (const locale of ['en', 'ko']) {
      const root = parse(readFileSync(join(dist, locale === 'en' ? '' : 'ko', lab.chapter.slice(1), 'index.html'), 'utf8'));
      const canonical = new URL(attr(find(root, n => attr(n, 'rel') === 'canonical')[0], 'href'));
      const base = canonical.href.replace((locale === 'ko' ? '/ko' : '') + lab.chapter + '/', '/');
      const data = find(root, n => attr(n, 'type') === 'application/ld+json')
        .map(n => JSON.parse(n.childNodes[0].value)).filter(item => item['@type'] === 'Dataset');
      assert.equal(data.length, 1);
      const item = data[0];
      assert.equal(item['@id'], base + lab.chapter.slice(1) + '/#' + lab.anchor);
      assert.equal(find(root, n => attr(n, 'id') === lab.anchor).length, 1);
      const box = find(root, n => n.tagName === 'aside' && attr(n, 'aria-label') === item.name)[0];
      assert.ok(box);
      assert.ok(find(box, n => n.nodeName === '#text').some(n => n.value.includes(item.description)));
      assert.ok(item.description.length >= 50 && item.description.length <= 5000);
      assert.notEqual(item.name, item.description);
      const links = find(box, n => n.tagName === 'a').map(n => new URL(attr(n, 'href'), canonical).href);
      const formats = item.distribution.map(d => [d['@type'], d.encodingFormat, d.contentUrl]);
      assert.deepEqual(formats, [['DataDownload', 'text/csv', base + 'labs/2026-11/' + id + '.csv'],
        ['DataDownload', 'application/json', base + 'labs/2026-11/' + id + '.json']]);
      for (const url of [item.license, ...item.distribution.map(d => d.contentUrl)]) assert.ok(links.includes(url));
      assert.ok(find(root, n => n.tagName === 'a' && new URL(attr(n,'href') || '', canonical).href === item.measurementTechnique).length);
    }
  }
});

test('the six CSV batches preserve pairing, padding, tensor byte counts and next token IDs', () => {
  const id = 'kv-batch-bucketing';
  const raw = receipt(id);
  const rows = csvRows(id);
  assert.equal(rows.length, 6);
  for (const policy of ['arrival_order', 'length_order']) {
    const batches = rows.filter(row => row.policy === policy);
    assert.equal(batches.length, raw[policy].batches.length);
    for (const [i, row] of batches.entries()) {
      const batch = raw[policy].batches[i];
      assert.equal(Number(row.batch_number), i + 1);
      assert.deepEqual([row.request_1, row.request_2], batch.requests);
      assert.deepEqual([+row.prompt_tokens_1, +row.prompt_tokens_2], batch.real_lengths);
      assert.deepEqual([+row.next_token_id_1, +row.next_token_id_2], batch.greedy_next_ids);
      for (const key of ['padding_slots','key_bytes','value_bytes','kv_bytes']) assert.equal(+row[key], batch[key]);
    }
  }
});

test('the retrieval CSV preserves all query texts, missing labels, zero scores and ranks from the unrounded calculation', () => {
  const id = 'multilingual-retrieval';
  const raw = receipt(id);
  const rows = csvRows(id);
  assert.equal(rows.length, 32);
  for (const result of raw.results) {
    const scored = rows.filter(row => row.case === result.case && row.language === result.language);
    assert.deepEqual(scored.map(row => row.passage_id).sort(), Object.keys(raw.documents).sort());
    for (const row of scored) {
      const id = row.passage_id;
      assert.equal(row.query, result.query);
      assert.equal(row.passage, raw.documents[id].text);
      assert.equal(row.passage_model_code, raw.documents[id].model_code ?? '');
      assert.equal(row.expected_passage_id, result.relevant ?? '');
      assert.equal(row.bm25, String(result.bm25[id]));
      assert.equal(row.cosine, String(result.cosine[id]));
      assert.equal(+row.e5_rank, result.dense_order.indexOf(id) + 1);
    }
  }
});
