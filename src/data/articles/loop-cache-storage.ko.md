---
title: "일곱 번째 토큰을 넣자 KV 캐시에서 4,608바이트가 줄었다"
description: "24층 디코더에서 토큰 하나를 더 처리하자 KV 텐서 크기는 늘고 그 뒤의 메모리 버퍼는 줄었습니다. PyTorch 코드로 어느 층에서 차이가 났는지 추적합니다."
tags: python, machinelearning, pytorch
chapter: /ko/chapter-4/various-llm-architectures
anchor: loop-cache-storage
firstPublished: "2026-11-25T04:07:00Z"
---

작은 디코더에 여섯 토큰을 넣었을 때 키·값 캐시가 가리키는 메모리 버퍼를 모두 합하면 18,432바이트였습니다. 토큰을 하나 더 넣자 13,824바이트가 됐습니다. 사라진 4,608바이트는 어디에 있었을까요?

먼저 슬라이딩 윈도 어텐션 한 층만 봅시다. 이 층의 윈도에는 현재 토큰과 이전 세 토큰이 들어갑니다. 여섯 토큰을 처리한 뒤 다음 질의를 위해 남겨 둔 키의 모양은 `[1, 2, 3, 8]`입니다. 헤드 2개 × 위치 3개 × 좌표 8개 × FP32의 4바이트를 곱하면 192바이트입니다. 그런데 이 텐서가 가리키는 버퍼는 384바이트입니다. 여섯 위치를 저장한 버퍼에서 마지막 세 위치만 잘라 참조하고 있기 때문입니다.

PyTorch로 이 층의 키 하나를 따라가 봅시다.

```python
import torch

kept = torch.zeros(1, 2, 6, 8, dtype=torch.float32)[:, :, -3:, :]
print(kept.nbytes, kept.untyped_storage().nbytes())       # 192 384
next_key = torch.ones(1, 2, 1, 8, dtype=kept.dtype)
kept = torch.cat([kept, next_key], dim=2)[:, :, -3:, :]
print(kept.nbytes, kept.untyped_storage().nbytes())       # 192 256
```

`torch.cat`이 이어 붙이는 것은 남겨 둔 세 위치와 새 위치 하나입니다. 다시 마지막 세 위치를 잘라 내면 보이는 텐서는 여전히 192바이트입니다. 이번에 그 뒤에 남은 버퍼에는 네 위치만 들어가므로 크기가 256바이트로 줄었습니다.

전체 실험에서는 Hugging Face의 `Inkling2LoopTextModel`을 사용합니다. 24층 중 20층이 짧은 윈도를 쓰고, 각 층에는 키 버퍼와 값 버퍼가 하나씩 있습니다. 이 20층에서 줄어든 크기는 20 × 2 × 128 = 5,120바이트입니다. 나머지 네 층은 모든 위치를 읽으므로 키와 값에 한 위치씩 늘어 4 × 2 × 64 = 512바이트를 더 씁니다. 두 수의 차이가 4,608바이트입니다. 반면 각 텐서에서 보이는 원소의 바이트 수를 합하면 10.5 KiB에서 11 KiB로 늘었습니다.

가운데 12층을 다섯 번 통과하게 해 보세요. 24개 층 객체가 한 번의 순전파에서 총 72회 호출되고, 이 구현은 각 통과에 별개 캐시를 둡니다. 여섯 토큰 직후 버퍼 합계는 54 KiB, 일곱 번째 토큰 직후에는 40.5 KiB였습니다. CPU에서 임의 초기화한 작은 FP32 모델의 측정값입니다. 합성곱 상태, 할당기의 예약 메모리, 프로세스의 나머지 메모리는 이 합계에서 제외했습니다.

여러 텐서가 같은 버퍼를 가리킬 수 있습니다. 실험 코드는 버퍼 주소로 묶어 한 번씩만 합산하고, 캐시를 사용한 마지막 은닉 상태가 일곱 토큰을 처음부터 실행한 결과와 일치하는지도 확인합니다. [버퍼를 세는 코드](https://github.com/sungeuns/foundation-model-engineering/blob/9c2cdca7b6eb33707aed43535afa0d132eff74db/public/labs/loop_cache.py#L17-L29) · [전체 CPU 실험](https://sungeuns.github.io/foundation-model-engineering/labs/loop_cache.py) · [1회·3회·5회 통과 측정값](https://sungeuns.github.io/foundation-model-engineering/labs/2026-11/loop-cache.json)

훈련된 체크포인트에 얼마나 많은 메모리가 필요하고 답변 품질이 어떤지는 별도의 실험이 필요합니다. 교재에서는 어떤 모델의 층 반복 방식이 어디까지 공개됐는지도 다룹니다. [교재의 층 반복 실험](https://sungeuns.github.io/foundation-model-engineering/ko/chapter-4/various-llm-architectures/#loop-cache-storage) · [Z.ai GLM-5.4 문서](https://docs.z.ai/guides/llm/glm-5.4) · [Thinking Machines Lab 모델 카드](https://thinkingmachines.ai/model-card/tml-d24-varloop-research/)

*AI 코딩 도우미가 PyTorch 2.15.0과 Transformers 5.24.1에서 CPU 실험을 실행하고 이 글을 작성했습니다.*
