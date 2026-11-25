---
title: "Whisper에서 11초짜리 녹음이 30초가 된 이유"
description: "같은 음을 두 가지 샘플링 속도로 들어 보고, 입력 텐서의 크기만 확인해서는 놓치기 쉬운 Whisper 전사 오류를 재현합니다."
---

44,100 Hz로 재생하면 한 옥타브 차이 나는 두 음이 1초 안에 끝납니다. 16,000 Hz로 재생하면 두 음이 모두 낮아지고, 2초가 지나도 두 번째 음이 들립니다.

두 파일에는 합성한 음의 샘플 44,100개가 똑같이 들어 있습니다. 재생기는 WAV 헤더를 보고 샘플을 1초에 몇 개씩 읽을지 정합니다. 1초에 16,000개를 읽으면 끝까지 정확히 2.75625초가 걸립니다. <a href="https://sungeuns.github.io/foundation-model-engineering/labs/audio/sample-clock-44100.wav" download="sample-clock-44100.wav">44,100 Hz WAV</a>와 <a href="https://sungeuns.github.io/foundation-model-engineering/labs/audio/sample-clock-16000.wav" download="sample-clock-16000.wav">16,000 Hz WAV</a>를 같은 폴더에 내려받은 뒤 Python으로 열면 소리를 담은 PCM 바이트가 같은지 확인할 수 있습니다.

```python
import wave

def samples(path):
    with wave.open(path, "rb") as wav:
        return wav.readframes(wav.getnframes())

assert samples("sample-clock-44100.wav") == samples("sample-clock-16000.wav")
```

## 텐서 크기 검사로는 왜 놓쳤을까?

이번에는 실제 음성을 써 봅시다. 별도의 CPU 실험에서 존 F. 케네디의 취임 연설 중 11초를 Whisper로 전사했습니다. 모노로 합친 뒤 16 kHz로 리샘플링하면 176,000개, 모노로만 합치고 원래 속도를 유지하면 485,100개의 샘플이 생깁니다. 두 번째 배열을 Transformers 특징 추출기에 넘기면서 `sampling_rate=16000`으로 지정하자 녹음 길이가 30.31875초로 계산됐습니다. 추출기는 30초를 기준으로 짧은 입력은 패딩하고 긴 입력은 잘라 냅니다. 그 결과 두 텐서의 크기는 똑같이 `[1, 80, 3000]`이었습니다. 그런데 올바르게 리샘플링한 쪽에서는 Whisper 공식 테스트가 확인하는 세 구절이 모두 나왔고, 잘못 표기한 쪽에서는 한 구절도 나오지 않았습니다.

Whisper의 `whisper.load_audio`로 파일을 열면 리샘플링까지 해 줍니다. 파형 배열을 직접 넘길 때는 패딩 전 샘플 수를 지정한 샘플링 속도로 나눠 보세요. 그렇게 계산한 길이가 원본 녹음 길이와 맞는지 확인할 수 있습니다. 세 구절의 비교 결과는 이 녹음 한 건에 대한 측정입니다. [CPU 실험 재현 코드](https://sungeuns.github.io/foundation-model-engineering/labs/whisper_sample_rate.py)

*이 글은 AI 코딩 도우미가 교재의 [Whisper 실험과 측정 결과](https://sungeuns.github.io/foundation-model-engineering/ko/chapter-11/audio-and-speech-integration/#whisper-sample-rate)를 바탕으로 작성했습니다.*
