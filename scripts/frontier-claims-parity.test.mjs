import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(path, 'utf8');

test('commercial video pages separate public facts from undisclosed internals', async () => {
  const [en, ko] = await Promise.all([
    read('src/pages/chapter-11/commercial-video-models.mdx'),
    read('src/pages/ko/chapter-11/commercial-video-models.mdx'),
  ]);

  assert.match(en, /As of August 16, 2026/);
  assert.match(ko, /2026년 8월 16일 기준/);
  assert.match(en, /undisclosed/i);
  assert.match(ko, /공개되지 않/);
  for (const page of [en, ko]) {
    assert.doesNotMatch(page, /Latent Consistency/i);
    assert.doesNotMatch(page, /rigid identity embedding/i);
    assert.doesNotMatch(page, /joint audio-visual unified encoder/i);
  }
});

test('world-model pages have equivalent evidence and engineering sections', async () => {
  const [en, ko] = await Promise.all([
    read('src/pages/chapter-20/path-to-agi-and-world-models.mdx'),
    read('src/pages/ko/chapter-20/path-to-agi-and-world-models.mdx'),
  ]);

  for (const heading of ['Capability Axes', 'Engineering View', 'Evidence Boundaries', 'Engineering Roadmap']) {
    assert.match(en, new RegExp(`## .*${heading}`));
  }
  for (const heading of ['역량 축', '엔지니어링 관점', '근거 경계', '엔지니어링 로드맵']) {
    assert.match(ko, new RegExp(`## .*${heading}`));
  }
  assert.equal((en.match(/<summary>Quiz /g) ?? []).length, 5);
  assert.equal((ko.match(/<summary>Quiz /g) ?? []).length, 5);
});

test('reviewed pages do not contain duplicate numbered H2 sections', async () => {
  const ko = await read('src/pages/ko/chapter-13/knowledge-distillation.mdx');
  const numbers = [...ko.matchAll(/^## (\d+)\./gm)].map((match) => match[1]);
  assert.equal(new Set(numbers).size, numbers.length);
});

test('commercial benchmark is explicitly a historical snapshot', async () => {
  const [en, ko] = await Promise.all([
    read('src/pages/chapter-17/commercial-model-benchmarks.mdx'),
    read('src/pages/ko/chapter-17/commercial-model-benchmarks.mdx'),
  ]);
  assert.match(en, /historical snapshot/i);
  assert.match(ko, /과거 스냅샷/);
  assert.match(en, /must be reverified/i);
  assert.match(ko, /다시 검증/);
});
