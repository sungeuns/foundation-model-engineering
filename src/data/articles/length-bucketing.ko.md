---
title: "패딩을 3분의 1로 줄였는데 왜 피크 KV 캐시는 그대로일까?"
description: "CPU에서 같은 여섯 프롬프트를 두 가지 순서로 처리했습니다. 패딩은 18칸에서 6칸으로 줄었지만 가장 큰 배치는 두 번 다 990 KiB였습니다."
tags: python, machinelearning
chapter: /ko/chapter-12/length-bucketing-lab
firstPublished: "2026-11-25T04:07:00Z"
---

길이가 3, 11, 4, 10, 5, 9토큰인 요청 여섯 개가 차례로 들어왔습니다. 한 번에 두 요청씩 처리하는 서버에서 길이가 비슷한 요청끼리 묶으면 KV 캐시를 얼마나 아낄 수 있을까요?

SmolLM2-135M을 CPU에서 실행해 보니 패딩이 총 18칸에서 6칸으로 줄었습니다. 그런데 가장 큰 배치의 KV 캐시는 두 번 다 990 KiB였습니다. 길이가 11인 요청의 짝을 따라가면 이유가 보입니다.

## 누가 11토큰짜리 요청과 한 배치에 들어갈까?

도착순으로 묶으면 첫 짝의 길이는 3과 11입니다. 첫 요청 왼쪽을 패딩해 두 행의 너비를 11로 맞춥니다. 22칸 중 실제 토큰은 14개입니다. 어텐션 마스크가 패딩 8칸을 가려도 밀집 키·값 텐서에는 22칸이 모두 들어갑니다.

길이순으로 묶으면 11토큰짜리 요청의 짝이 10토큰짜리로 바뀝니다. 실제 토큰은 21개, 패딩은 한 칸입니다. 두 행의 너비는 여전히 11이고, 캐시는 여전히 22칸입니다.

이 모델의 FP32 키·값 캐시는 한 칸당 45 KiB입니다. 키와 값 2개 × 30층 × KV 헤드 3개 × 헤드 차원 64 × 4바이트가 46,080바이트입니다. 두 배치 모두 22 × 45 = 990 KiB를 차지합니다.

## 합계가 줄어도 최댓값은 같을 수 있다

프롬프트를 읽은 직후 캐시 크기를 측정하고, 다음 두 요청을 처리하기 전에 이전 캐시를 해제했습니다.

| 짝짓기 | 실행 순서대로 본 캐시 크기 | 세 배치의 합 | 피크 |
| --- | --- | --- | --- |
| 도착순 | 990, 900, 810 KiB | 2,700 KiB | 990 KiB |
| 길이순 | 360, 810, 990 KiB | 2,160 KiB | 990 KiB |

합계의 차이인 540 KiB는 줄어든 패딩 12칸 × 45 KiB입니다. 이 합계에는 서로 다른 세 시점의 값이 들어갑니다. 한 시점에 얼마까지 캐시를 보관해야 하는지는 가장 큰 배치 하나가 결정합니다.

아래 계산은 모델 없이 Python 3.10 이상에서 실행할 수 있습니다. 11을 12로 바꾸면 두 방식의 피크가 얼마가 될지 먼저 예상해 보세요.

```python
lengths = [3, 11, 4, 10, 5, 9]
for order in (lengths, sorted(lengths)):
    pairs = zip(order[::2], order[1::2], strict=True)
    slots = [2 * max(pair) for pair in pairs]
    sizes_kib = [45 * count for count in slots]
    print(sum(slots) - sum(order), sum(sizes_kib), max(sizes_kib))
# 패딩 칸 수, 캐시 합계(KiB), 피크(KiB)
# 18 2700 990
#  6 2160 990
```

## 내 서버라면 무엇을 잴까?

CPU 실험은 실제 텐서의 바이트 수를 셉니다. 여섯 요청 모두 단독 실행, 도착순 배치, 길이순 배치에서 다음 토큰 ID가 같았습니다. 코드에서는 각 프롬프트의 마지막 로짓도 절대·상대 허용 오차 `1e-4`로 비교합니다. [실험 코드 내려받기](https://sungeuns.github.io/foundation-model-engineering/labs/kv_batch_bucketing.py) · [배치별 측정값과 토큰 ID](https://sungeuns.github.io/foundation-model-engineering/labs/2026-11/kv-batch-bucketing.json) · [GitHub에서 비교 코드 읽기](https://github.com/sungeuns/foundation-model-engineering/blob/d4d45703a0941543c63afc406bcaf21e0b99a036/public/labs/kv_batch_bucketing.py#L100-L109)

실제 서비스가 길이 비슷한 요청을 기다린다면 대기열에서 보낸 시간도 재야 합니다. 페이지 단위로 캐시를 할당하는 엔진이라면 동시에 사용 중인 블록 수를 세어 보세요. 이 실험에서 잰 것은 밀집 배치가 보관한 KV 텐서의 크기입니다. 지연 시간, 프로세스 메모리, 할당기가 예약한 메모리는 별도로 측정해야 합니다.

*이 글은 AI 코딩 도우미가 교재의 [길이별 배치 실험](https://sungeuns.github.io/foundation-model-engineering/ko/chapter-12/length-bucketing-lab/)과 실제 측정값을 바탕으로 작성했습니다.*
