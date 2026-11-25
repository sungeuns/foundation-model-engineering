import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { parseFragment } from 'parse5';

const dist = process.env.SEARCH_DIST_DIR || 'dist';
const base = 'https://sungeuns.github.io/foundation-model-engineering/';
const original = base + 'chapter-12/length-bucketing-lab/';

test('the selected feed imports a complete, runnable article under its original canonical URL', () => {
  const xml = execFileSync('python3', ['-c', `
import json, sys, xml.etree.ElementTree as ET
channel = ET.parse(sys.argv[1]).find('channel')
items = [{child.tag: child.text for child in item} for item in channel.findall('item')]
self_link = channel.find('{http://www.w3.org/2005/Atom}link[@rel="self"]')
print(json.dumps([self_link.attrib['href'], items]))
`, join(dist, 'articles.xml')], { encoding: 'utf8' });
  const [self, items] = JSON.parse(xml);
  assert.equal(self, base + 'articles.xml');
  const item = items.find(post => post.link === original);
  assert.ok(item);
  assert.equal(items.filter(post => post.link === original).length, 1);
  assert.equal(item.guid, original);
  assert.equal(item.pubDate, 'Wed, 25 Nov 2026 00:27:23 GMT');
  const body = item['{http://purl.org/rss/1.0/modules/content/}encoded'];
  assert.ok(body);
  assert.match(body, /AI coding assistant/i);
  assert.doesNotMatch(body, /<script\b|<astro-island\b/i);

  const nodes = [];
  function visit(node) {
    nodes.push(node);
    node.childNodes?.forEach(visit);
  }
  visit(parseFragment(body));
  const links = nodes.filter(node => node.tagName === 'a')
    .map(node => node.attrs.find(attr => attr.name === 'href').value);
  const measurements = 'labs/2026-11/kv-batch-bucketing.json';
  for (const path of ['labs/kv_batch_bucketing.py', measurements, 'chapter-12/length-bucketing-lab/']) {
    assert.ok(links.includes(base + path), path);
    assert.ok(existsSync(join(dist, path)), path);
  }
  for (const url of links) assert.equal(new URL(url).protocol, 'https:');

  const text = node => node.value ?? node.childNodes.map(text).join('');
  const code = nodes.find(node => node.tagName === 'code');
  const output = execFileSync('python3', ['-c', text(code)], { encoding: 'utf8' });
  const receipt = JSON.parse(readFileSync(join(dist, measurements), 'utf8'));
  const expected = [receipt.arrival_order, receipt.length_order].map(run =>
    [run.padding_slots, run.sum_prefill_kv_bytes / 1024, run.largest_batch_prefill_kv_bytes / 1024].join(' '));
  assert.deepEqual(output.trim().split('\n'), expected);
});

test('the English subscription footer offers both the revision feed and the selected full articles', () => {
  const html = readFileSync(join(dist, 'index.html'), 'utf8');
  const footer = html.match(/<footer\b[\s\S]*?<\/footer>/)[0];
  for (const path of ['feed.xml', 'articles.xml']) {
    assert.ok(footer.includes(`href="${new URL(path, base).pathname}"`));
  }
});
