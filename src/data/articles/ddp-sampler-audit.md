---
title: "Why did 4/5 accuracy become 4/6 on two ranks?"
published: false
description: "Trace five example IDs through PyTorch’s DistributedSampler and DataLoader. One repeated mistake turns 4/5 into 4/6. Dropping a batch loses a different example."
tags: python, pytorch, machinelearning
canonical_url: https://sungeuns.github.io/foundation-model-engineering/articles/ddp-sampler-audit/
ai_disclosure_level: fully_autonomous
chapter: /chapter-7/data-parallelism
anchor: ddp-sampler-audit
firstPublished: "2026-11-25T05:28:12Z"
---

Five validation examples have IDs 0 through 4. The prediction for ID 0 is wrong and the other four are right. Accuracy is **4/5**. Now give the same examples and predictions to a two-rank evaluation loop. Each rank adds up its correct predictions and its number of examples. The combined result is **4/6**. Which example got a second vote?

## Follow the IDs

The CPU experiment runs PyTorch 2.15.0’s real `DistributedSampler` and `DataLoader` for each rank in one process. The answers are fixed on purpose. There is no model to change its prediction. Shuffling is off, and each rank batches two examples at a time. Each pair of brackets below is one batch delivered by the loader.

| Run | Rank 0 batches | Rank 1 batches | Correct / visits |
| --- | --- | --- | --- |
| Single rank, unsharded | `[0,1] [2,3] [4]` | — | 4/5 |
| Two ranks, keep the tails | `[0,2] [4]` | `[1,3] [0]` | 4/6 |
| Drop the sampler tail only | `[0,2]` | `[1,3]` | 3/4 |
| Drop each loader’s last partial batch only | `[0,2]` | `[1,3]` | 3/4 |

Five indices cannot split evenly across two ranks. With `DistributedSampler(drop_last=False)`, PyTorch extends the sequence to `0, 1, 2, 3, 4, 0` for this unshuffled run. Rank 0 takes every other index starting at the first. Rank 1 takes the rest. The extra ID is the one wrong answer. Summing both ranks’ counts gives exactly the accuracy over those six visits. [Sampler implementation from the CPU build](https://github.com/pytorch/pytorch/blob/d0f2af8b66b20da4baa50644c0cd3f887a2eae2e/torch/utils/data/distributed.py#L116-L134) · [PyTorch 2.15 sampler documentation](https://docs.pytorch.org/docs/2.15/data.html#torch.utils.data.distributed.DistributedSampler)

The last two rows reach 3/4 by different routes. With `drop_last=True` on the **sampler**, ID 4 is trimmed before the ranks get their indices. With `drop_last=True` only on the **loader**, the sampler assigns all six visits as before. Each rank then discards its one-example final batch. Rank 0 drops the real ID 4 while rank 1 drops the second copy of ID 0. [PyTorch 2.15 DataLoader documentation](https://docs.pytorch.org/docs/2.15/data.html#torch.utils.data.DataLoader)

## Move the mistake

What if ID 4 were the only mistake? The batches would stay the same. Download the [recorded CPU run (JSON)](https://sungeuns.github.io/foundation-model-engineering/labs/2026-11/ddp-sampler-audit.json), then run this snippet beside it. It uses the standard library and re-scores the IDs that PyTorch actually delivered.

```python
import json
from pathlib import Path

runs = json.loads(Path("ddp-sampler-audit.json").read_text())["runs"]
for name in ("unsharded", "padded", "sampler_drop_last", "loader_drop_last"):
    ids = [i for rank in runs[name]["ranks"] for batch in rank["batches"] for i in batch]
    correct = sum(i != 4 for i in ids)
    print(name, f"{correct}/{len(ids)}")
```

Now the full dataset still scores 4/5. Counting the repeated **correct** answer produces **5/6**. Either drop setting produces **4/4** because the only error never reaches the scorer.

For an accuracy report that gives every example equal weight, keep a stable example ID with its prediction and label. Check that the observed IDs cover exactly the evaluation manifest and that repeated IDs agree before counting one result per ID. This recovers 4/5 in the padded run. Both truncated runs are missing ID 4. To report the full-dataset score from either, evaluate the missing example under the same settings.

To reproduce the original four runs, download the [CPU script](https://sungeuns.github.io/foundation-model-engineering/labs/ddp_sampler_audit.py) and run `python ddp_sampler_audit.py` with PyTorch 2.15.0 installed. The JSON records the indices assigned to each rank as well as the batches actually scored. [Continue to the data-parallelism chapter](https://sungeuns.github.io/foundation-model-engineering/chapter-7/data-parallelism/#ddp-sampler-audit).

*An AI coding assistant ran the CPU experiment and wrote this article.*
