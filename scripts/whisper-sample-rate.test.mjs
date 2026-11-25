import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const scriptPath = 'labs/whisper_sample_rate.py';
const jsonPath = 'labs/2026-11/whisper-sample-rate.json';
const run = JSON.parse(read('public/' + jsonPath));

test('sample counts explain both equal feature shapes and distinct valid-frame counts', () => {
  const { duration_ts, time_base, sample_rate_hz, channels } = run.audio;
  const [numerator, denominator] = time_base.split('/').map(Number);
  const seconds = duration_ts * numerator / denominator;
  assert.equal(seconds, 11);
  assert.equal(sample_rate_hz, 44100);
  assert.equal(channels, 2);

  assert.deepEqual(run.cases.map(c => c.name), ['resampled', 'mislabeled']);
  assert.deepEqual(run.cases.map(c => c.waveform_rate_hz), [16000, sample_rate_hz]);
  for (const c of run.cases) {
    const window = 30 * c.declared_rate_hz;
    assert.equal(c.declared_rate_hz, 16000);
    assert.equal(c.input_samples, seconds * c.waveform_rate_hz);
    assert.equal(c.apparent_seconds_before_truncation, c.input_samples / c.declared_rate_hz);
    assert.equal(c.padded_samples, Math.max(0, window - c.input_samples));
    assert.equal(c.truncated_samples, Math.max(0, c.input_samples - window));
    assert.deepEqual(c.input_features_shape, [1, 80, 3000]);
    assert.equal(c.valid_mel_frames, Math.ceil((c.input_samples - c.truncated_samples) / 160));
  }
});

test('the pinned recording and published decoding checks match both editions', () => {
  const source = read('public/' + scriptPath);
  for (const id of [run.revision, run.audio.sha256, run.model_safetensors_sha256]) assert.ok(source.includes(id));
  assert.ok(run.audio.source.endsWith('/tests/jfk.flac'));
  assert.deepEqual(run.decoder, { do_sample: false, num_beams: 1, return_timestamps: false, max_new_tokens: 64 });
  const [correct, wrong] = run.cases;
  assert.deepEqual(correct.fixture_phrases_found, run.fixture_phrases);
  assert.equal(run.fixture_phrases.length, 3);
  assert.deepEqual(wrong.fixture_phrases_found, []);
  assert.deepEqual(run.cases.map(c => c.word_count), [22, 32]);

  for (const locale of ['', 'ko/']) {
    const page = read('src/pages/' + locale + 'chapter-11/audio-and-speech-integration.mdx');
    for (const s of [scriptPath, jsonPath, 'id="whisper-sample-rate"', '30.31875',
      correct.first_five_words, wrong.first_five_words]) assert.ok(page.includes(s), s);
    assert.ok(source.includes('/' + locale + 'chapter-11/audio-and-speech-integration/#whisper-sample-rate'));
  }
});
