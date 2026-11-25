---
title: "How a sample-rate label turns 11 seconds into 30 for Whisper"
published: false
description: "Hear the same samples at two playback rates, then reproduce a Whisper transcription error that a tensor shape check misses."
tags: python, audio, machinelearning
canonical_url: https://sungeuns.github.io/foundation-model-engineering/articles/whisper-sample-rate/
ai_disclosure_level: fully_autonomous
chapter: /chapter-11/audio-and-speech-integration
anchor: whisper-sample-rate
firstPublished: "2026-11-25T02:00:59Z"
---

At 44,100 Hz, two notes an octave apart fit into one second. At 16,000 Hz, both notes sound lower, and the second note is still playing two seconds in.

Both files contain the same 44,100 synthesized samples. The WAV header tells your player how quickly to consume them. At 16,000 samples per second, playback takes exactly 2.75625 seconds. Download the <a href="https://sungeuns.github.io/foundation-model-engineering/labs/audio/sample-clock-44100.wav" download="sample-clock-44100.wav">44,100 Hz WAV</a> and the <a href="https://sungeuns.github.io/foundation-model-engineering/labs/audio/sample-clock-16000.wav" download="sample-clock-16000.wav">16,000 Hz WAV</a> to one directory to compare their PCM audio bytes with Python.

```python
import wave

def samples(path):
    with wave.open(path, "rb") as wav:
        return wav.readframes(wav.getnframes())

assert samples("sample-clock-44100.wav") == samples("sample-clock-16000.wav")
```

## Why the shape check passed

In a separate CPU experiment, Whisper transcribed an 11-second excerpt of John F. Kennedy’s inaugural address. Mixing it to mono and resampling to 16 kHz produced 176,000 samples. Keeping the original rate after the mono mix produced 485,100. Passing that array to the Transformers feature extractor with `sampling_rate=16000` made the excerpt appear 30.31875 seconds long. The extractor padded the shorter input and trimmed the longer one to the same 30-second window. Both produced a feature tensor of shape `[1, 80, 3000]`. The resampled recording yielded all three phrases checked by Whisper’s upstream test. The mislabeled one yielded none.

The resampled transcript began “And so my fellow Americans”. With the wrong rate, it began “Ah, oh, oh, oh, oh,”. The three phrase checks look for lowercase substrings in the decoded text. You can inspect the first five words and matches for each input before downloading a model. [Recorded output (JSON)](https://sungeuns.github.io/foundation-model-engineering/labs/2026-11/whisper-sample-rate.json) · [Scoring code on GitHub](https://github.com/sungeuns/foundation-model-engineering/blob/70f930a14cc225a0a69547514846a14e889c061c/public/labs/whisper_sample_rate.py#L99-L102)

Whisper’s own `whisper.load_audio` resamples a file automatically. When you supply a waveform array yourself, divide its unpadded sample count by the rate you declare and compare that duration with the source. The phrase counts describe this one recording. [Reproduce the CPU run](https://sungeuns.github.io/foundation-model-engineering/labs/whisper_sample_rate.py)

*An AI coding assistant wrote this adaptation from the textbook’s [worked example and measurements](https://sungeuns.github.io/foundation-model-engineering/chapter-11/audio-and-speech-integration/#whisper-sample-rate).*
