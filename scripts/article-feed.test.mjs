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

function readSelectedFeed() {
  const xml = execFileSync('python3', ['-c', `
import json, sys, xml.etree.ElementTree as ET
channel = ET.parse(sys.argv[1]).find('channel')
items = [{child.tag: child.text for child in item} for item in channel.findall('item')]
self_link = channel.find('{http://www.w3.org/2005/Atom}link[@rel="self"]')
hubs = channel.findall('{http://www.w3.org/2005/Atom}link[@rel="hub"]')
print(json.dumps([self_link.attrib['href'], [hub.attrib['href'] for hub in hubs], items]))
`, join(dist, 'articles.xml')], { encoding: 'utf8' });
  return JSON.parse(xml);
}

test('the selected feed imports a complete, runnable article under its original canonical URL', () => {
  const [self, hubs, items] = readSelectedFeed();
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

test('the listening feed links to the standalone article and preserves its original GUID', () => {
  const chapter = 'chapter-11/audio-and-speech-integration/';
  const guid = base + chapter + '#whisper-sample-rate';
  const article = base + 'articles/whisper-sample-rate/';
  const source = readFileSync('src/data/articles/whisper-sample-rate.md', 'utf8');
  const meta = load(source.match(/^---\n([\s\S]*?)\n---\n/)[1]);
  assert.equal(meta.canonical_url, article);
  assert.equal(meta.published, false);
  assert.equal(meta.ai_disclosure_level, 'fully_autonomous');
  const [, , items] = readSelectedFeed();
  const item = items.find(post => post.link === article);
  assert.equal(item?.guid, guid);
  assert.equal(item.pubDate, new Date(meta.firstPublished).toUTCString());
  assert.equal(new Set(items.map(post => post.guid)).size, items.length);
  const chapterHtml = readFileSync(join(dist, chapter, 'index.html'), 'utf8');
  assert.ok(chapterHtml.includes('id="whisper-sample-rate"'));
  const body = item['{http://purl.org/rss/1.0/modules/content/}encoded'];
  assert.ok(body.includes('href="' + guid + '"'));
  for (const rate of [44100, 16000]) {
    const path = 'labs/audio/sample-clock-' + rate + '.wav';
    assert.ok(body.includes('href="' + base + path + '"'));
    assert.equal(readFileSync(join(dist, path)).readUInt32LE(24), rate);
  }
  const [, checkPcm] = source.match(/^```python\n([\s\S]*?)\n```$/m);
  execFileSync('python3', ['-c', checkPcm], { cwd: join(dist, 'labs/audio') });
});

test('both editions of the listening article can be read and played without JavaScript', () => {
  const nodes = root => [root, ...(root.childNodes ?? []).flatMap(nodes)];
  const attr = (node, name) => node.attrs?.find(a => a.name === name)?.value;
  const text = node => node.value ?? (node.childNodes ?? []).map(text).join('');
  for (const [lang, prefix, suffix] of [['en', '', ''], ['ko', 'ko/', '.ko']]) {
    const source = readFileSync('src/data/articles/whisper-sample-rate' + suffix + '.md', 'utf8');
    const metadata = load(source.match(/^---\n([\s\S]*?)\n---\n/)[1]);
    const html = readFileSync(join(dist, prefix, 'articles/whisper-sample-rate/index.html'), 'utf8');
    const all = nodes(parseFragment(html));
    const main = nodes(all.find(node => node.tagName === 'main'));
    assert.deepEqual(main.filter(node => /^h[1-6]$/.test(node.tagName)).map(node => node.tagName), ['h1', 'h2', 'h2']);
    assert.equal(text(main.find(node => node.tagName === 'h1')), metadata.title);
    const players = main.filter(node => node.tagName === 'audio');
    assert.equal(players.length, 2);
    const sourceLinks = main.filter(node => node.tagName === 'a').map(node => attr(node, 'href'));
    for (const [index, rate] of [44100, 16000].entries()) {
      const file = base + 'labs/audio/sample-clock-' + rate + '.wav';
      assert.equal(new URL(attr(players[index], 'src'), base).href, file);
      assert.equal(attr(players[index], 'preload'), 'none');
      assert.equal(attr(players[index], 'autoplay'), undefined);
      assert.equal(attr(players[index], 'controls'), '');
      const downloads = main.filter(node => node.tagName === 'a' && new URL(attr(node, 'href'), base).href === file);
      assert.equal(downloads.length, 1);
      assert.equal(attr(downloads[0], 'download'), 'sample-clock-' + rate + '.wav');
    }
    assert.ok(sourceLinks.includes(base + prefix + 'chapter-11/audio-and-speech-integration/#whisper-sample-rate'), lang);
    assert.ok(text(main.find(node => node.tagName === 'pre')).includes('assert samples('));
    assert.ok(text(main[0]).includes('30.31875'));
    assert.ok(text(main[0]).includes('[1, 80, 3000]'));
  }
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

test('the loop-cache article preserves the measured bytes and points to the bilingual CPU exercise', () => {
  const chapter = 'chapter-4/various-llm-architectures/';
  const record = JSON.parse(readFileSync(join(dist, 'labs/2026-11/loop-cache.json'), 'utf8'));
  const source = readFileSync('src/data/articles/loop-cache-storage.md', 'utf8');
  const [, snippet] = source.match(/^```python\n([\s\S]+?)\n```/m);
  const articleUrl = base + chapter + '#loop-cache-storage';
  const [, , items] = readSelectedFeed();
  const matches = items.filter(item => item.link === articleUrl);
  assert.equal(matches.length, 1);
  assert.equal(matches[0].guid, articleUrl);
  const body = matches[0]['{http://purl.org/rss/1.0/modules/content/}encoded'];
  const first = record.runs.find(row => row.passes === 1);
  const savings = first.prefill.backing_bytes - first.after_one_token.backing_bytes;
  assert.ok(body.includes(savings.toLocaleString('en-US')));
  assert.ok(first.after_one_token.logical_bytes > first.prefill.logical_bytes);
  assert.ok(body.includes(base + 'labs/loop_cache.py'));
  assert.ok(body.includes(base + 'labs/2026-11/loop-cache.json'));
  for (const prefix of ['', 'ko/']) {
    const lesson = readFileSync(`src/pages/${prefix}${chapter.slice(0, -1)}.mdx`, 'utf8');
    assert.ok(lesson.includes('```python\n' + snippet + '\n```'));
    for (const row of record.runs) {
      assert.equal(row.distinct_layers, 24);
      const cells = [row.passes, row.prefill_layer_calls,
        ...[row.prefill.logical_bytes, row.prefill.backing_bytes, row.after_one_token.backing_bytes]
          .map(bytes => `${bytes / 1024} KiB`)];
      assert.ok(lesson.includes('| ' + cells.join(' | ') + ' |'));
    }
    assert.ok(readFileSync(join(dist, prefix, chapter, 'index.html'), 'utf8').includes('id="loop-cache-storage"'));
  }
});
