import { Buffer } from 'node:buffer';

const sourceRate = 44_100;
const bytesPerSample = 2;
const samplesPerNote = sourceRate / 2;
const fadeSamples = Math.round(sourceRate * 0.005);

// Two original half-second sine tones. Each note fades to zero at both edges.
const pcm = Buffer.alloc(sourceRate * bytesPerSample);
for (const [note, frequency] of [441, 882].entries()) {
  for (let i = 0; i < samplesPerNote; i++) {
    const edge = Math.min(i, samplesPerNote - 1 - i, fadeSamples);
    const envelope = (1 - Math.cos(Math.PI * edge / fadeSamples)) / 2;
    const sample = 0.15 * 32_767 * envelope * Math.sin(2 * Math.PI * frequency * i / sourceRate);
    pcm.writeInt16LE(Math.round(sample), (note * samplesPerNote + i) * bytesPerSample);
  }
}

export function getStaticPaths() {
  return ['44100', '16000'].map(rate => ({ params: { rate } }));
}

export function GET({ params }) {
  const rate = Number(params.rate);
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write('WAVEfmt ', 8);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // Integer PCM
  header.writeUInt16LE(1, 22); // Mono
  header.writeUInt32LE(rate, 24);
  header.writeUInt32LE(rate * bytesPerSample, 28);
  header.writeUInt16LE(bytesPerSample, 32);
  header.writeUInt16LE(16, 34);
  header.write('data', 36);
  header.writeUInt32LE(pcm.length, 40);
  return new Response(Buffer.concat([header, pcm]), { headers: { 'Content-Type': 'audio/wav' } });
}
