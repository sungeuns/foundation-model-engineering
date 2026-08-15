import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const englishPath = path.join(ROOT, 'src/pages/chapter-8/continued-pretraining-and-domain-adaptation.mdx');
const koreanPath = path.join(ROOT, 'src/pages/ko/chapter-8/continued-pretraining-and-domain-adaptation.mdx');

function readRequired(file) {
  assert.ok(fs.existsSync(file), `${file} does not exist`);
  return fs.readFileSync(file, 'utf8');
}

test('continued pre-training has matching English and Korean practitioner pages', () => {
  const english = readRequired(englishPath);
  const korean = readRequired(koreanPath);

  const englishRoles = [
    'Decision Gate: CPT, RAG, or SFT?',
    'DAPT, TAPT, and Continual Pre-training',
    'Choose the Starting Checkpoint',
    'Build the Data Mixture',
    'Tokenizer and Vocabulary Decisions',
    'Pilot Before Scaling',
    'Checkpoint and Exact Continuation Contract',
    'Evaluation and Release Gates',
    'Failure Modes and Runbook',
  ];
  const koreanRoles = [
    '의사결정 게이트: CPT, RAG, SFT 중 무엇을 선택할까?',
    'DAPT, TAPT, 지속 사전 학습의 구분',
    '시작 체크포인트 선택',
    '데이터 혼합 설계',
    '토크나이저와 어휘집 결정',
    '확장 전 파일럿',
    '체크포인트와 정확한 재개 계약',
    '평가와 릴리스 게이트',
    '실패 모드와 대응 절차',
  ];

  for (const role of englishRoles) assert.ok(english.includes(role), `English page is missing ${role}`);
  for (const role of koreanRoles) assert.ok(korean.includes(role), `Korean page is missing ${role}`);
  assert.equal((english.match(/<summary>Quiz \d+:/g) ?? []).length, 5);
  assert.equal((korean.match(/<summary>Quiz \d+:/g) ?? []).length, 5);
});

test('continued pre-training is registered and Chapter 9 cross-links instead of duplicating it', () => {
  const navigation = fs.readFileSync(path.join(ROOT, 'src/data/chapters.js'), 'utf8');
  const chapterList = fs.readFileSync(path.join(ROOT, 'docs/chapter_list.md'), 'utf8');
  const englishSynthetic = fs.readFileSync(path.join(ROOT, 'src/pages/chapter-9/synthetic-instructions-and-self-instruct.mdx'), 'utf8');
  const koreanSynthetic = fs.readFileSync(path.join(ROOT, 'src/pages/ko/chapter-9/synthetic-instructions-and-self-instruct.mdx'), 'utf8');
  const route = '/chapter-8/continued-pretraining-and-domain-adaptation';

  assert.ok(navigation.includes(route));
  assert.ok(chapterList.includes('8.5 Continued Pre-training & Domain Adaptation'));
  assert.ok(englishSynthetic.includes(route));
  assert.ok(koreanSynthetic.includes(`/ko${route}`));
  assert.doesNotMatch(englishSynthetic, /Enterprise Platforms.*OpenAI.*Anthropic.*Google/s);
  assert.doesNotMatch(koreanSynthetic, /엔터프라이즈 플랫폼.*OpenAI.*Anthropic.*Google/s);
});
