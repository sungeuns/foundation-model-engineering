import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const pair = (slug) => [
  fs.readFileSync(`src/pages/chapter-17/${slug}.mdx`, 'utf8'),
  fs.readFileSync(`src/pages/ko/chapter-17/${slug}.mdx`, 'utf8'),
];

test('release-gate pages define artifact, statistics, rollout, and rollback contracts', () => {
  const [en, ko] = pair('production-evaluation-and-release-gates');
  const criteria = [
    [/immutable artifact bundle/i, /불변 아티팩트 묶음/],
    [/tokenizer.*chat template.*generation config/is, /토크나이저.*대화 템플릿.*생성 설정/s],
    [/paired bootstrap|paired permutation/i, /대응 부트스트랩|대응 순열 검정/],
    [/sample size/i, /표본 크기/],
    [/p50.*p95.*p99/is, /p50.*p95.*p99/s],
    [/shadow.*canary.*ramp-up/is, /섀도 테스트.*카나리 배포.*점진적 확대/s],
    [/automatic abort/i, /자동 중단/],
    [/hysteresis/i, /히스테리시스/],
    [/last-known-good/i, /마지막으로 정상 동작을 확인한 버전 전체/],
    [/stateful.*side effect/is, /도구 호출로 이미 바뀐 외부 상태/],
    [/rollback rehearsal/i, /복구 훈련/],
    [/eval.*maintenance/is, /평가셋 유지보수/],
  ];
  for (const [englishTerm, koreanTerm] of criteria) {
    assert.match(en, englishTerm);
    assert.match(ko, koreanTerm);
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
