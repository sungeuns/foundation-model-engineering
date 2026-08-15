import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function page(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

function assertRoles(document, roles, label) {
  for (const role of roles) {
    assert.ok(document.includes(role), `${label} is missing ${role}`);
  }
}

test('data engineering pages define reproducible data and resume contracts', () => {
  const english = page('src/pages/chapter-6/data-engineering-at-scale.mdx');
  const korean = page('src/pages/ko/chapter-6/data-engineering-at-scale.mdx');

  assertRoles(english, [
    'Dataset Manifest and Evaluation Quarantine',
    'Deterministic Sharding and Resume Contract',
    'Data Loader Acceptance Test',
  ], 'English data engineering page');
  assertRoles(korean, [
    '데이터셋 매니페스트와 평가 격리',
    '결정적 샤딩과 재개 계약',
    '데이터 로더 수용 시험',
  ], 'Korean data engineering page');

  for (const document of [english, korean]) {
    assert.doesNotMatch(document, /class DurableTensorStreamer/);
    assert.doesNotMatch(document, /virtually infinite|사실상 무한한/);
    assert.doesNotMatch(document, /SOTA 2026/);
    assert.doesNotMatch(document, /630-Line|630줄|630-line/);
  }
});

test('tokenization pages define an acceptance and compatibility contract', () => {
  const english = page('src/pages/chapter-6/tokenization-science.mdx');
  const korean = page('src/pages/ko/chapter-6/tokenization-science.mdx');

  assertRoles(english, [
    'Tokenizer Acceptance Test',
    'Checkpoint Compatibility Contract',
    'byte fallback',
    'evaluation quarantine',
  ], 'English tokenization page');
  assertRoles(korean, [
    '토크나이저 수용 시험',
    '체크포인트 호환성 계약',
    '바이트 폴백',
    '평가 격리',
  ], 'Korean tokenization page');
});

test('stability pages teach evidence-preserving loss-spike triage', () => {
  const english = page('src/pages/chapter-6/large-scale-training-stability.mdx');
  const korean = page('src/pages/ko/chapter-6/large-scale-training-stability.mdx');

  assertRoles(english, [
    'Loss-Spike Triage Runbook',
    'Checkpoint and Recovery Signals',
    'cross_entropy',
    'ignore_index',
  ], 'English stability page');
  assertRoles(korean, [
    '손실 급등 대응 절차',
    '체크포인트와 복구 신호',
    'cross_entropy',
    'ignore_index',
  ], 'Korean stability page');

  for (const document of [english, korean]) {
    assert.doesNotMatch(document, /reset(?:ting)? (?:the )?Adam moments|Adam 모멘트(?:를)? (?:초기화|리셋)/i);
  }
});
