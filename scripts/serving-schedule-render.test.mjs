import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { parse } from 'parse5';
import { lastBatchingIteration } from '../src/components/chapter-12/batching-iteration.js';

const output = process.env.SEARCH_DIST_DIR || 'dist';
const attr = (node, key) => node.attrs?.find(pair => pair.name === key)?.value;
const hasClass = (node, name) => (attr(node, 'class') || '').split(' ').includes(name);
const content = node => node.value ?? (node.childNodes || []).map(content).join('');
function elements(node) {
  return [node, ...(node.childNodes || []).flatMap(elements)];
}

for (const language of ['en', 'ko']) {
  test(`the server-rendered ${language} timelines preserve decode order and the KV handoff`, () => {
    for (const lesson of ['continuous-batching', 'long-context-serving']) {
      const file = join(output, language === 'ko' ? 'ko' : '', 'chapter-12', lesson, 'index.html');
      const page = elements(parse(readFileSync(file, 'utf8'), { scriptingEnabled: false }));
      const timeline = elements(page.find(node => hasClass(node, 'scheduling-visualizer')));
      const blocks = timeline.filter(node => hasClass(node, 'block'));
      assert.deepEqual(blocks.map(content), ['P', 'D1', 'D2', 'D3']);
      assert.deepEqual(blocks.map(node => attr(node, 'title')), ['P: 0–60', 'D1: 62–66', 'D2: 68–72', 'D3: 74–78']);
      assert.equal(attr(timeline.find(node => node.tagName === 'fieldset'), 'disabled'), '');
      const fallback = timeline.find(node => node.tagName === 'details');
      assert.ok(fallback);
      assert.match(content(fallback), /P1 \(0–15\).*D1 \(16–20\).*P4 \(63–78\)/s);
      assert.match(content(fallback), /KV \(60–70\).*New \(70–78\)/s);
      if (lesson === 'continuous-batching') {
        const simulation = elements(page.find(node => hasClass(node, 'cb-visualizer-container')));
        const controls = simulation.find(node => hasClass(node, 'cb-controls'));
        assert.equal(controls.tagName, 'fieldset');
        assert.equal(attr(controls, 'disabled'), '');
        assert.deepEqual(elements(controls).filter(node => node.tagName === 'input').map(node => attr(node, 'max')), [String(lastBatchingIteration)]);
        const totals = simulation.filter(node => hasClass(node, 'cb-board-summary'));
        const remaining = language === 'ko' ? '남은 토큰 22개' : 'Tokens left 22';
        assert.deepEqual(totals.map(node => content(node).endsWith(remaining)), [true, true]);
        const targets = content(simulation.find(node => hasClass(node, 'cb-workload')));
        assert.ok(targets.startsWith(language === 'ko' ? '시작 시 요청별 생성 목표' : 'Starting decode targets'));
        assert.match(targets, /A=4 · B=2 · C=6 · D=3 · E=5 · F=2$/);
      }
    }
  });
}

test('the published decode schedulers accept a request stream and require whole decode tokens', () => {
  for (const language of ['', 'ko']) {
    const source = readFileSync(join('src/pages', language, 'chapter-12/continuous-batching.mdx'), 'utf8');
    const code = source.match(/^```python\n([\s\S]*?)\n```$/m)[1];
    execFileSync('python3', ['-I', '-c', code + `
for policy in (True, False):
    assert schedule(iter(requests), continuous=policy) == schedule(requests, continuous=policy)
for rows, slots in [([('A', 1.5)], 3), ([('A', 1)], 2.5), ([('A', 2), ('A', 3)], 1)]:
    try:
        schedule(iter(rows), slots)
    except ValueError:
        pass
    else:
        raise AssertionError((rows, slots))
`], { timeout: 5000 });
  }
});
