import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const read = (relative) => fs.readFileSync(path.join(ROOT, relative), 'utf8');

function pair(chapter, slug) {
  return [
    read(`src/pages/${chapter}/${slug}.mdx`),
    read(`src/pages/ko/${chapter}/${slug}.mdx`),
  ];
}

test('tensor parallel guidance requires subgroups and autograd-aware mappings', () => {
  const [english, korean] = pair('chapter-7', 'model-and-pipeline-parallelism');
  for (const document of [english, korean]) {
    assert.match(document, /TP (?:process group|프로세스 그룹)/i);
    assert.match(document, /autograd-aware|autograd 인식/i);
    assert.match(document, /bias(?:를)? (?:exactly once|한 번만)/i);
    assert.doesNotMatch(document, /dist\.all_reduce\(z_local/);
  }
});

test('FlashAttention example is causal, low precision, and uses current SDPA selection', () => {
  const [english, korean] = pair('chapter-7', 'flash-attention');
  for (const document of [english, korean]) {
    assert.match(document, /is_causal=True/);
    assert.match(document, /sdpa_kernel/);
    assert.match(document, /SDPBackend\.FLASH_ATTENTION/);
    assert.match(document, /bfloat16|float16/);
    assert.match(document, /padding|패딩/);
    assert.doesNotMatch(document, /torch\.nn\.attention\.sdp_kernel/);
  }
});

test('ZeRO-3 guidance initializes without first materializing the full model', () => {
  const [english, korean] = pair('chapter-7', 'zero-redundancy-optimizer');
  for (const document of [english, korean]) {
    assert.match(document, /zero\.Init/);
    assert.match(document, /(?:Initialization Is Part of the Memory Plan|초기화도 메모리 계획의 일부)/);
    assert.match(document, /causal|인과/);
    assert.doesNotMatch(document, /model = SimpleLLM\(\)/);
  }
});

test('power-law chapter uses correct compute units and uncertainty-aware forecasts', () => {
  const [english, korean] = pair('chapter-8', 'power-law');
  for (const document of [english, korean]) {
    assert.match(document, /1 ExaFLOP = 1,000 PetaFLOPs/);
    assert.match(document, /bootstrap|부트스트랩/i);
    assert.match(document, /leave-largest-out|최대 규모 제외/i);
    assert.doesNotMatch(document, /1e6 PetaFLOPs|100만 PetaFLOPs/);
    assert.doesNotMatch(document, /predict the exact performance|정확한 성능을.*예측/);
    assert.doesNotMatch(document, /perfectly smooth|완벽하게 매끄러운/);
  }
});
