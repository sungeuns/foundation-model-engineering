import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const pair = (slug) => [
  fs.readFileSync(`src/pages/chapter-10/${slug}.mdx`, 'utf8'),
  fs.readFileSync(`src/pages/ko/chapter-10/${slug}.mdx`, 'utf8'),
];

test('DPO pages define pair construction, tokenization, reference, and monitoring contracts', () => {
  for (const page of pair('dpo')) {
    assert.match(page, /apply_chat_template/);
    assert.match(page, /same prompt|동일한 prompt/i);
    assert.match(page, /completion.*mask|completion.*마스크/is);
    assert.match(page, /EOS/);
    assert.match(page, /sum.*mean|합.*평균/is);
    assert.match(page, /reference.*hash|reference.*해시/is);
    assert.match(page, /beta.*sweep|β.*sweep|β.*탐색/is);
    assert.match(page, /cluster.*split|클러스터.*분할/is);
    assert.match(page, /implicit reward margin|암묵.*reward margin/i);
  }
});

test('KTO pages describe a policy-reference KL reference point without the false shortcut', () => {
  for (const page of pair('kto-and-ipo')) {
    assert.match(page, /KL reference point|KL 기준점/i);
    assert.match(page, /policy.*reference.*log-ratio|policy.*reference.*로그 비율/is);
    assert.match(page, /unmatched|별도.*batch|불일치.*batch/is);
    assert.doesNotMatch(page, /z_0\s*=\s*rewards\.detach\(\)\.mean\(\)/);
    assert.doesNotMatch(page, /gradients cancel.*refuse to update|gradient.*상쇄.*업데이트를 거부/is);
  }
});

test('PPO pages teach the canonical LLM loop before emerging variants', () => {
  for (const page of pair('ppo-proximal-policy-optimization')) {
    assert.match(page, /reward model|보상 모델/i);
    assert.match(page, /value head|value 헤드/i);
    assert.match(page, /GAE/);
    assert.match(page, /per-token KL|토큰별 KL/i);
    assert.match(page, /response mask|응답 마스크/i);
    assert.match(page, /advantage whitening|advantage.*whitening|어드밴티지.*정규화/i);
    assert.match(page, /policy lag|정책 지연/i);
    assert.match(page, /emerging|신흥|초기 연구/i);
    assert.doesNotMatch(page, /Modern SOTA PPO|최신 SOTA PPO/i);
  }
});

test('feedback pages address exposure bias, annotation quality, privacy, and leakage', () => {
  for (const page of pair('human-feedback-loop')) {
    assert.match(page, /propensity/i);
    assert.match(page, /randomized A\/B|무작위 A\/B/i);
    assert.match(page, /tie|동점/i);
    assert.match(page, /abstain|판단 보류/i);
    assert.match(page, /inter-annotator|annotator agreement|평가자.*일치/i);
    assert.match(page, /PII/);
    assert.match(page, /sibling.*holdout|형제.*holdout/i);
    assert.match(page, /selection bias|선택 편향/i);
  }
});

test('alignment-tax pages qualify calibration claims and align gradient vectors safely', () => {
  for (const page of pair('alignment-tax')) {
    assert.match(page, /observed|관찰/i);
    assert.match(page, /not.*universal|보편.*아닙|보편적이지/i);
    assert.match(page, /None.*zero|None.*0/is);
    assert.match(page, /same parameter|동일한 parameter/i);
    assert.doesNotMatch(page, /Base models are naturally well-calibrated/i);
    assert.doesNotMatch(page, /RLHF completely destroyed calibration/i);
  }
});
