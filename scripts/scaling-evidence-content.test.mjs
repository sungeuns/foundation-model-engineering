import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relative) => fs.readFileSync(path.join(ROOT, relative), 'utf8');
const pair = (slug) => [
  read(`src/pages/chapter-8/${slug}.mdx`),
  read(`src/pages/ko/chapter-8/${slug}.mdx`),
];

test('over-training guidance uses checkpoint probes instead of universal token ratios', () => {
  const [english, korean] = pair('over-training-vs-optimal-training');
  assert.match(english, /Checkpoint Selection Protocol/);
  assert.match(korean, /체크포인트 선택 프로토콜/);
  for (const document of [english, korean]) {
    assert.match(document, /fixed held-out|고정 홀드아웃/i);
    assert.match(document, /standardized SFT probe|표준화된 SFT 프로브/i);
    assert.match(document, /confidence interval|신뢰 구간/i);
    assert.doesNotMatch(document, /100\s*:\s*1\s*(?:to|에서)\s*~?400\s*:\s*1|>\s*1000\s*:\s*1/);
    assert.doesNotMatch(document, /val_targets\s*=\s*torch\.randint/);
  }
});

test('transfer and grokking claims state scope limits and safe stopping criteria', () => {
  const [english, korean] = pair('transfer-learning-and-generalization');
  assert.match(english, /Scope Limits and Stopping Criteria/);
  assert.match(korean, /적용 범위와 중단 기준/);
  for (const document of [english, korean]) {
    assert.match(document, /fixed held-out|고정 홀드아웃/i);
    assert.doesNotMatch(document, /consistently outperforms|일관되게.*능가/i);
    assert.doesNotMatch(document, /This proves that generalization|일반화.*증명/i);
    assert.doesNotMatch(document, /continue training\. Generalization|계속 학습.*일반화/i);
  }
});

test('power-law framing remains empirical and conditional', () => {
  for (const document of pair('power-law')) {
    assert.match(document, /conditional|조건부/i);
    assert.doesNotMatch(document, /governed by strict, predictable|엄격하고 예측 가능한.*지배/i);
  }
});
