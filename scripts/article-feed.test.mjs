import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { load } from 'js-yaml';
import { parseFragment } from 'parse5';
import { chapterFeedHub } from '../src/utils/chapter-feed.js';

const dist = process.env.SEARCH_DIST_DIR || 'dist';
const base = 'https://sungeuns.github.io/foundation-model-engineering/';
const original = base + 'chapter-12/length-bucketing-lab/';

test('the article source can be pasted whole into the DEV Basic Markdown editor', () => {
  const source = readFileSync(new URL('../src/data/articles/length-bucketing.md', import.meta.url), 'utf8');
  // Forem Basic reads one leading YAML block. A table separator belongs to the body.
  const [, yaml, body] = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  const fields = load(yaml);
  assert.equal(fields.published, false);
  assert.equal(fields.canonical_url, original);
  assert.equal(fields.ai_disclosure_level, 'fully_autonomous');
  assert.deepEqual(fields.tags.split(',').map(tag => tag.trim()), ['python', 'machinelearning']);
  assert.match(fields.title, /length bucketing/i);
  assert.match(fields.description, /peak key\/value cache/i);
  assert.match(body.trimStart(), /^Six prompts/);
  assert.match(body, /^\| --- \| --- \| --- \| --- \|$/m);
  assert.match(body, /^```python$/m);
  assert.match(body.trimEnd(), /An AI coding assistant wrote this adaptation[^\n]+\*$/);
});

test('the selected feed imports a complete, runnable article under its original canonical URL', () => {
  const xml = execFileSync('python3', ['-c', `
import json, sys, xml.etree.ElementTree as ET
channel = ET.parse(sys.argv[1]).find('channel')
items = [{child.tag: child.text for child in item} for item in channel.findall('item')]
self_link = channel.find('{http://www.w3.org/2005/Atom}link[@rel="self"]')
hubs = channel.findall('{http://www.w3.org/2005/Atom}link[@rel="hub"]')
print(json.dumps([self_link.attrib['href'], [hub.attrib['href'] for hub in hubs], items]))
`, join(dist, 'articles.xml')], { encoding: 'utf8' });
  const [self, hubs, items] = JSON.parse(xml);
  assert.equal(self, base + 'articles.xml');
  assert.deepEqual(hubs, [chapterFeedHub]);
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

test('readers can discover each edition’s feeds from the homepage or an article', () => {
  for (const prefix of ['', 'ko/']) {
    for (const page of ['index.html', 'chapter-12/length-bucketing-lab/index.html']) {
      const html = readFileSync(join(dist, prefix, page), 'utf8');
      const head = html.match(/<head\b[\s\S]*?<\/head>/)[0];
      const feeds = [...head.matchAll(/<link\b[^>]*>/g)]
        .map(([tag]) => Object.fromEntries(parseFragment(tag).childNodes[0].attrs.map(a => [a.name, a.value])))
        .filter(link => link.rel === 'alternate' && link.type === 'application/rss+xml');
      const paths = prefix ? ['ko/feed.xml'] : ['feed.xml', 'articles.xml'];
      assert.deepEqual(feeds.map(link => new URL(link.href, base).href), paths.map(path => base + path));
      assert.equal(new Set(feeds.map(link => link.title)).size, feeds.length);
      const footer = html.match(/<footer\b[\s\S]*?<\/footer>/)[0];
      for (const path of paths) assert.ok(footer.includes(`href="${new URL(path, base).pathname}"`));
    }
  }
});
