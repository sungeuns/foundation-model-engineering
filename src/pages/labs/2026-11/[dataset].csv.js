import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { labDatasets } from '../../../data/lab-datasets.js';

export function getStaticPaths() {
  return Object.keys(labDatasets).map(dataset => ({ params: { dataset } }));
}

function batchRows(record) {
  return ['arrival_order', 'length_order'].flatMap(policy =>
    record[policy].batches.map((batch, i) => ({
      policy, batch_number: i + 1, request_1: batch.requests[0], request_2: batch.requests[1],
      prompt_tokens_1: batch.real_lengths[0], prompt_tokens_2: batch.real_lengths[1],
      padding_slots: batch.padding_slots, key_bytes: batch.key_bytes,
      value_bytes: batch.value_bytes, kv_bytes: batch.kv_bytes,
      next_token_id_1: batch.greedy_next_ids[0], next_token_id_2: batch.greedy_next_ids[1],
    })));
}

function retrievalRows(record) {
  return record.results.flatMap(result => {
    const ranks = new Map(result.dense_order.map((id, index) => [id, index + 1]));
    return Object.entries(record.documents).map(([id, passage]) => ({
      case: result.case, language: result.language, query: result.query,
      passage_id: id, passage: passage.text, passage_model_code: passage.model_code,
      expected_passage_id: result.relevant, bm25: result.bm25[id], cosine: result.cosine[id],
      e5_rank: ranks.get(id),
    }));
  });
}

function csvCell(value) {
  if (value == null) return '';
  const text = String(value);
  return /[",\r\n]/.test(text) ? '"' + text.replaceAll('"', '""') + '"' : text;
}

export async function GET({ params: { dataset } }) {
  const file = resolve('public/labs/2026-11', dataset + '.json');
  const record = JSON.parse(await readFile(file, 'utf8'));
  const exporters = { 'kv-batch-bucketing': batchRows, 'multilingual-retrieval': retrievalRows };
  const rows = exporters[dataset](record);
  const columns = Object.keys(rows[0]);
  const lines = [columns.join(','), ...rows.map(row => columns.map(key => csvCell(row[key])).join(','))];
  return new Response(lines.join('\r\n') + '\r\n', { headers: { 'Content-Type': 'text/csv; charset=utf-8' } });
}
