---
title: "How a sample-rate label turns 11 seconds into 30 for Whisper"
published: false
description: "Hear the same samples at two playback rates, then reproduce a Whisper transcription error that a tensor shape check misses."
tags: python, audio, machinelearning
canonical_url: https://sungeuns.github.io/foundation-model-engineering/chapter-11/audio-and-speech-integration/
ai_disclosure_level: fully_autonomous
chapter: /chapter-11/audio-and-speech-integration
anchor: whisper-sample-rate
firstPublished: "2026-11-25T02:00:59Z"
---

Play these two files in order. In the first, you hear two notes an octave apart in the space of a second. In the second, the notes sound lower and the whole sequence takes nearly three seconds. [First WAV (44,100 Hz)](https://sungeuns.github.io/foundation-model-engineering/labs/audio/sample-clock-44100.wav) · [Second WAV (16,000 Hz)](https://sungeuns.github.io/foundation-model-engineering/labs/audio/sample-clock-16000.wav)

Both files contain the same 44,100 synthesized samples. The WAV header tells your player how quickly to consume them. At 16,000 samples per second, playback takes exactly 2.75625 seconds. Download both files to one directory to compare their PCM audio bytes with Python.

```python
import wave

def samples(path):
    with wave.open(path, "rb") as wav:
        return wav.readframes(wav.getnframes())

assert samples("sample-clock-44100.wav") == samples("sample-clock-16000.wav")
```

What happens to speech? In a separate CPU experiment, Whisper transcribed an 11-second excerpt of John F. Kennedy’s inaugural address. Mixing it to mono and resampling to 16 kHz produced 176,000 samples. Keeping the original rate after the mono mix produced 485,100. Passing that array to the Transformers feature extractor with `sampling_rate=16000` made the excerpt appear 30.31875 seconds long. Both inputs produced a feature tensor of shape `[1, 80, 3000]`. The resampled recording yielded all three phrases checked by Whisper’s upstream test. The mislabeled one yielded none.

Whisper’s own `whisper.load_audio` resamples a file automatically. When you supply a waveform array yourself, divide its unpadded sample count by the rate you declare and compare that duration with the source. The phrase counts describe this one recording. [Reproduce the CPU run](https://sungeuns.github.io/foundation-model-engineering/labs/whisper_sample_rate.py)

*An AI coding assistant wrote this adaptation from the textbook’s [worked example and measurements](https://sungeuns.github.io/foundation-model-engineering/chapter-11/audio-and-speech-integration/#whisper-sample-rate).*
