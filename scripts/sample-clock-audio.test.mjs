import assert from 'node:assert/strict';
import { Buffer } from 'node:buffer';
import test from 'node:test';
import { GET, getStaticPaths } from '../src/pages/labs/audio/sample-clock-[rate].wav.js';

test('both WAVs have a valid mono PCM header and share every sample byte', async () => {
  const paths = getStaticPaths();
  assert.deepEqual(paths.map(({ params }) => params.rate), ['44100', '16000']);
  const files = [];
  for (const { params } of paths) {
    const response = GET({ params });
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('Content-Type'), 'audio/wav');
    const wav = Buffer.from(await response.arrayBuffer());
    assert.equal(wav.toString('ascii', 0, 4), 'RIFF');
    assert.equal(wav.readUInt32LE(4), wav.length - 8);
    assert.equal(wav.toString('ascii', 8, 16), 'WAVEfmt ');
    assert.equal(wav.readUInt32LE(16), 16);
    assert.equal(wav.readUInt16LE(20), 1);
    assert.equal(wav.readUInt16LE(22), 1);
    assert.equal(wav.readUInt32LE(24), Number(params.rate));
    assert.equal(wav.readUInt32LE(28), Number(params.rate) * 2);
    assert.equal(wav.readUInt16LE(32), 2);
    assert.equal(wav.readUInt16LE(34), 16);
    assert.equal(wav.toString('ascii', 36, 40), 'data');
    assert.equal(wav.readUInt32LE(40), 44_100 * 2);
    assert.equal(wav.length - 44, wav.readUInt32LE(40));
    files.push(wav);
  }
  assert.deepEqual(files[0].subarray(0, 24), files[1].subarray(0, 24));
  assert.deepEqual(files[0].subarray(32), files[1].subarray(32));
});

test('a reader hears two pitches at each clock rate and silence at note boundaries', async () => {
  for (const { params } of getStaticPaths()) {
    const wav = Buffer.from(await GET({ params }).arrayBuffer());
    const rate = wav.readUInt32LE(24);
    const sample = index => wav.readInt16LE(44 + 2 * index);
    const frameCount = wav.readUInt32LE(40) / wav.readUInt16LE(32);
    assert.equal(frameCount / rate, rate === 44_100 ? 1 : 2.75625);
    const half = frameCount / 2;
    const pitches = [];
    for (const offset of [0, half]) {
      assert.equal(sample(offset), 0);
      assert.equal(sample(offset + half - 1), 0);
      for (const i of [offset + 1, offset + 2, offset + half - 2]) assert.ok(Math.abs(sample(i)) <= 1);

      // Count periods in the constant-amplitude middle of the note.
      const start = offset + 1000;
      const length = 20_000;
      let risingCrossings = 0;
      let peak = 0;
      for (let i = start; i < start + length; i++) {
        const amplitude = sample(i);
        if (amplitude > 0 && sample(i - 1) <= 0) risingCrossings++;
        peak = Math.max(peak, Math.abs(amplitude));
      }
      assert.ok(peak > 4600 && peak < 5000);
      pitches.push(risingCrossings * rate / length);
    }
    assert.deepEqual(pitches, rate === 44_100 ? [441, 882] : [160, 320]);
  }
});
