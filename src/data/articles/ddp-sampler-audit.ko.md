---
title: "평가 예제는 다섯 개인데 왜 여섯 번 채점했을까?"
description: "PyTorch의 DistributedSampler와 DataLoader가 각 랭크에 보낸 ID를 따라갑니다. 오답 하나를 두 번 세면 4/5가 4/6이 되고, 마지막 배치를 버리면 다른 예제가 빠집니다."
tags: python, pytorch, machinelearning
chapter: /ko/chapter-7/data-parallelism
anchor: ddp-sampler-audit
firstPublished: "2026-11-25T05:28:12Z"
---

평가 예제 다섯 개에 0번부터 4번까지 번호를 붙였습니다. 0번만 틀렸으니 정답은 **5개 중 4개** 입니다. 같은 예제와 같은 예측을 두 랭크로 나눠 채점합니다. 각 랭크가 맞힌 수와 채점한 수를 더했더니 **6개 중 4개** 가 맞았습니다. 어느 예제를 두 번 셌을까요?

## 번호를 따라가 보자

CPU에서 PyTorch 2.15.0의 실제 `DistributedSampler`와 `DataLoader`를 실행했습니다. 두 랭크에 해당하는 로더를 한 프로세스에서 차례로 돌렸습니다. 채점 대상이 바뀌는지만 보려고 예측은 미리 고정했고 모델도 호출하지 않았습니다. 예제를 섞지 않고 랭크마다 두 개씩 묶었습니다. 표의 대괄호 하나가 로더가 넘겨준 배치 하나입니다.

| 설정 | 랭크 0의 배치 | 랭크 1의 배치 | 정답 수 / 채점 횟수 |
| --- | --- | --- | --- |
| 한 랭크에서 전체 평가 | `[0,1] [2,3] [4]` | — | 4/5 |
| 두 랭크에서 마지막 배치까지 평가 | `[0,2] [4]` | `[1,3] [0]` | 4/6 |
| 샘플러에서만 나머지 버림 | `[0,2]` | `[1,3]` | 3/4 |
| 로더에서만 미완성 배치 버림 | `[0,2]` | `[1,3]` | 3/4 |

예제 다섯 개는 두 랭크에 같은 수로 나눠 줄 수 없습니다. 이번처럼 순서를 섞지 않고 `DistributedSampler(drop_last=False)`를 쓰면 PyTorch가 맨 앞의 0번을 뒤에 붙여 `0, 1, 2, 3, 4, 0`을 만듭니다. 랭크 0은 첫 번째부터 한 칸씩 건너뛰며 가져가고, 랭크 1은 나머지를 가져갑니다. 하필 두 번 들어간 0번이 유일한 오답이어서 여섯 번의 채점 가운데 정답은 네 번입니다. [실행에 사용한 샘플러 구현](https://github.com/pytorch/pytorch/blob/d0f2af8b66b20da4baa50644c0cd3f887a2eae2e/torch/utils/data/distributed.py#L116-L134) · [PyTorch 2.15 샘플러 문서](https://docs.pytorch.org/docs/2.15/data.html#torch.utils.data.distributed.DistributedSampler)

마지막 두 행은 모두 3/4이지만 예제가 빠진 시점이 다릅니다. **샘플러** 에서만 `drop_last=True`로 지정하면 랭크별 번호를 나눠 주기 전에 끝의 4번을 잘라 냅니다. **로더** 에서만 같은 옵션을 켜면 샘플러는 앞에서처럼 여섯 자리를 배정합니다. 그다음 두 로더가 각자 한 개만 남은 마지막 배치를 버립니다. 이때 랭크 0에서는 4번이 빠지고 랭크 1에서는 두 번째 0번이 빠집니다. [PyTorch 2.15 DataLoader 문서](https://docs.pytorch.org/docs/2.15/data.html#torch.utils.data.DataLoader)

## 이번에는 4번만 틀렸다면?

예측을 바꿔도 로더가 내보내는 배치는 그대로입니다. [CPU 실행 기록(JSON)](https://sungeuns.github.io/foundation-model-engineering/labs/2026-11/ddp-sampler-audit.json)을 내려받고 같은 디렉터리에서 아래 코드를 실행해 보세요. 파이썬 표준 라이브러리로 PyTorch가 실제로 내보낸 번호들을 다시 채점합니다.

```python
import json
from pathlib import Path

runs = json.loads(Path("ddp-sampler-audit.json").read_text())["runs"]
for name in ("unsharded", "padded", "sampler_drop_last", "loader_drop_last"):
    ids = [i for rank in runs[name]["ranks"] for batch in rank["batches"] for i in batch]
    correct = sum(i != 4 for i in ids)
    print(name, f"{correct}/{len(ids)}")
```

이번에도 다섯 개를 모두 한 번씩 채점한 정확도는 4/5입니다. 그런데 0번은 이제 **정답** 이므로 두 번 세면 **5/6** 입니다. 마지막 표본이나 배치를 버리는 두 설정은 모두 **4/4** 이 됩니다. 유일한 오답인 4번이 채점까지 도달하지 못했기 때문입니다.

예제마다 같은 비중을 주는 정확도를 계산하려면 예측값과 정답에 예제 ID를 함께 남기세요. 실제로 채점한 ID의 집합이 평가 목록과 정확히 일치하는지, 같은 ID의 예측과 정답이 매번 일치하는지 확인한 뒤 ID당 한 번씩 셉니다. 그러면 0번이 중복됐던 실행에서 4/5를 복원할 수 있습니다. 4번이 빠진 두 실행으로 전체 정확도를 보고하려면 같은 조건에서 4번도 평가해야 합니다.

원래 실험을 재현하려면 [CPU 실행 코드](https://sungeuns.github.io/foundation-model-engineering/labs/ddp_sampler_audit.py)를 받고 PyTorch 2.15.0이 설치된 환경에서 `python ddp_sampler_audit.py`를 실행하세요. 출력 JSON에는 샘플러가 배정한 번호와 로더가 실제로 내보낸 배치가 함께 들어 있습니다. [데이터 병렬화 본문에서 이어 읽기](https://sungeuns.github.io/foundation-model-engineering/ko/chapter-7/data-parallelism/#ddp-sampler-audit).

*AI 코딩 도우미가 CPU 실험을 실행하고 결과를 바탕으로 이 글을 썼습니다.*
