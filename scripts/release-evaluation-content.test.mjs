import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const pair = (slug) => [
  fs.readFileSync(`src/pages/chapter-17/${slug}.mdx`, 'utf8'),
  fs.readFileSync(`src/pages/ko/chapter-17/${slug}.mdx`, 'utf8'),
];

test('release-gate pages define artifact, statistics, rollout, and rollback contracts', () => {
  for (const page of pair('production-evaluation-and-release-gates')) {
    assert.match(page, /immutable artifact bundle|불변 artifact bundle/i);
    assert.match(page, /tokenizer.*chat template.*generation config/is);
    assert.match(page, /paired bootstrap|paired permutation|대응.*bootstrap|대응.*permutation/i);
    assert.match(page, /sample size|표본 크기/i);
    assert.match(page, /p50.*p95.*p99/is);
    assert.match(page, /shadow.*canary.*ramp-up/is);
    assert.match(page, /automatic abort|자동 중단/i);
    assert.match(page, /hysteresis|히스테리시스/i);
    assert.match(page, /last-known-good/i);
    assert.match(page, /stateful.*side effect|상태.*side effect/is);
    assert.match(page, /rollback rehearsal|rollback.*리허설/i);
    assert.match(page, /eval.*maintenance|평가셋.*유지/i);
  }
});

test('contamination pages quarantine evaluation lineage and calibrate thresholds', () => {
  for (const page of pair('contamination-issues')) {
    assert.match(page, /evaluation ID|평가 ID/i);
    assert.match(page, /hash.*semantic neighbor|해시.*semantic neighbor/is);
    assert.match(page, /teacher prompt.*rubric|교사 prompt.*rubric/is);
    assert.match(page, /calibrat.*threshold|threshold.*보정/is);
    assert.match(page, /final rendered.*tokenized|최종.*tokenized/is);
    assert.match(page, /dynamic.*not.*guarantee|동적.*보장하지/is);
    assert.doesNotMatch(page, /ultimate defense/i);
    assert.doesNotMatch(page, /historical leakage irrelevant/i);
  }
});

test('academic benchmark pages have equivalent practical evaluation sections', () => {
  for (const page of pair('academic-benchmarks')) {
    assert.match(page, /Frontier Benchmark Map|프론티어 벤치마크 지도/i);
    assert.match(page, /Multimodal Evaluation|멀티모달 평가/i);
    assert.match(page, /Metric Design|Metric을.*설계/i);
    assert.match(page, /Statistical Comparison|통계.*비교/i);
    assert.match(page, /Practical Benchmark Checklist|실무.*벤치마크.*체크리스트/i);
    assert.match(page, /fixed.*harness|고정.*harness/i);
    assert.match(page, /confidence interval|신뢰구간/i);
  }
});
