import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read = (path) => fs.readFileSync(path, 'utf8');
const pairs = {
  sft: [read('src/pages/chapter-9/sft-fundamentals.mdx'), read('src/pages/ko/chapter-9/sft-fundamentals.mdx')],
  peft: [read('src/pages/chapter-9/parameter-efficient-fine-tuning-peft.mdx'), read('src/pages/ko/chapter-9/parameter-efficient-fine-tuning-peft.mdx')],
  data: [read('src/pages/chapter-9/dataset-quality-vs-quantity.mdx'), read('src/pages/ko/chapter-9/dataset-quality-vs-quantity.mdx')],
  synthetic: [read('src/pages/chapter-9/synthetic-instructions-and-self-instruct.mdx'), read('src/pages/ko/chapter-9/synthetic-instructions-and-self-instruct.mdx')]
};

test('SFT pages define tokenizer-native, assistant-only, packing-safe semantics', () => {
  for (const page of pairs.sft) {
    assert.match(page, /apply_chat_template/);
    assert.match(page, /add_generation_prompt/);
    assert.match(page, /attention_mask/);
    assert.match(page, /-100/);
    assert.match(page, /EOS/);
    assert.match(page, /pack/i);
    assert.match(page, /train.serv|학습.*서빙/i);
    assert.doesNotMatch(page, /prompt-masking saves \$75\\%\$|75\\%.*activation gradient memory/i);
  }
});

test('PEFT pages define QLoRA memory and versioned deployment contracts', () => {
  for (const page of pairs.peft) {
    assert.match(page, /QLoRA/);
    assert.match(page, /NF4/);
    assert.match(page, /double quantization|이중 양자화/i);
    assert.match(page, /compute dtype|연산 dtype/i);
    assert.match(page, /gradient checkpoint/i);
    assert.match(page, /base.*tokenizer.*template.*adapter|베이스.*토크나이저.*템플릿.*어댑터/is);
    assert.match(page, /idempotent|멱등/i);
    assert.doesNotMatch(page, /production-grade PyTorch implementation/i);
  }
});

test('data-quality pages use manifests, quarantine, grouped splits, and calibrated judges', () => {
  for (const page of pairs.data) {
    assert.match(page, /immutable manifest|불변 매니페스트/i);
    assert.match(page, /evaluation quarantine|평가 격리/i);
    assert.match(page, /semantic cluster|의미.*클러스터/i);
    assert.match(page, /calibrat|보정/i);
    assert.match(page, /human audit|사람.*감사/i);
    assert.doesNotMatch(page, /strictly inverted scaling law|strictly dominate/i);
    assert.doesNotMatch(page, /~25% Duplication|100% Duplication/i);
  }
});

test('synthetic-data pages use native templates, stop boundaries, and full lineage', () => {
  for (const page of pairs.synthetic) {
    assert.match(page, /apply_chat_template/);
    assert.match(page, /stop token|중단 토큰/i);
    assert.match(page, /teacher.*prompt.*seed.*decod|교사.*프롬프트.*시드.*디코딩/is);
    assert.match(page, /benchmark contamination|벤치마크 오염/i);
    assert.match(page, /rejection reason|거부 사유/i);
    assert.match(page, /human gold|사람.*골드/i);
    assert.doesNotMatch(page, /era of purely human-annotated SFT datasets is over/i);
    assert.doesNotMatch(page, /REWARD_THRESHOLD = 2\.5/);
  }
});
