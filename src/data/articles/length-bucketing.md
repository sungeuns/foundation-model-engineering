---
title: "Why length bucketing cut padding by two-thirds and left peak KV memory unchanged"
published: false
description: "Pair six prompts two ways, count the padding and reproduce the peak key/value cache size with a few lines of Python."
tags: python, machinelearning
canonical_url: https://sungeuns.github.io/foundation-model-engineering/articles/length-bucketing/
ai_disclosure_level: fully_autonomous
chapter: /chapter-12/length-bucketing-lab
firstPublished: "2026-11-25T00:27:23Z"
---

Six prompts arrive with lengths of 3, 11, 4, 10, 5 and 9 tokens. An inference worker reads them two at a time. If it groups prompts of similar length, how much less memory will its largest key/value (KV) cache need?

In a CPU experiment with SmolLM2-135M, padding fell from 18 positions to 6. The largest cache held **990 KiB** either way. To see where the saving went, follow the 11-token prompt.

## The longest prompt picks the width

In arrival order, the first pair has lengths 3 and 11. Left-padding the short prompt gives a rectangle 2 rows tall and 11 positions wide. Fourteen of its 22 positions contain real tokens. The attention mask hides the eight padding positions, but the dense key and value tensors still have room for all 22.

Now sort the prompts. The 11-token prompt gets a 10-token partner. Twenty-one positions hold real tokens, and one holds padding. The rectangle still has 22 positions.

In this model, keeping the keys and values for one position in FP32 costs 45 KiB. Multiply 2 tensors × 30 layers × 3 KV heads × 64 values per head × 4 bytes to get 46,080 bytes. Both pairs therefore use 22 × 45 = 990 KiB.

## A sum and a peak answer different questions

The experiment released each pair's cache before running the next pair. These were the measured cache sizes immediately after the model finished reading each pair of prompts.

| Pairing | Cache sizes in execution order | Sum | Peak |
| --- | --- | --- | --- |
| Arrival order | 990, 900, 810 KiB | 2,700 KiB | 990 KiB |
| Sorted by length | 360, 810, 990 KiB | 2,160 KiB | 990 KiB |

The 540 KiB difference in the sums corresponds exactly to twelve saved padding positions. Those sums span three moments in time. To find out how much KV data was live at once, take the maximum.

This Python calculation runs without a model. Try the original six lengths, then remove the final 9 and run it again. The last batch can contain a single request.

```python
lengths = [3, 11, 4, 10, 5, 9]
for order in (lengths, sorted(lengths)):
    batches = [order[start:start + 2] for start in range(0, len(order), 2)]
    slots = [len(batch) * max(batch) for batch in batches]
    sizes_kib = [45 * count for count in slots]
    print(sum(slots) - sum(order), sum(sizes_kib), max(sizes_kib))
# padding positions, summed KiB, peak KiB
# 18 2700 990
#  6 2160 990
```

With five requests, the arrival-order batches hold 990, 900 and 225 KiB. Sorted batches hold 360, 900 and 495 KiB. The longest prompt now runs alone and needs only 11 × 45 = 495 KiB. The preceding pair of lengths 5 and 10 sets the peak at **900 KiB**, down from 990. Counting the actual key and value tensors on CPU for these five prompts reproduced all six batch sizes.

## What to measure on your worker

The [CPU experiment](https://sungeuns.github.io/foundation-model-engineering/labs/kv_batch_bucketing.py) counts bytes in the actual tensors. The [recorded run](https://sungeuns.github.io/foundation-model-engineering/labs/2026-11/kv-batch-bucketing.json) includes every pair and each prompt's greedy next-token ID. All six prompts kept the same next-token ID when run alone and under both batching policies. For each prompt the script also checked the full vector of next-token logits against its solo run, with absolute and relative tolerances of `1e-4`. [Inspect the comparison on GitHub](https://github.com/sungeuns/foundation-model-engineering/blob/d4d45703a0941543c63afc406bcaf21e0b99a036/public/labs/kv_batch_bucketing.py#L100-L109)

For a service that waits to find similar-length partners, measure the time spent in the queue as well as peak cache size. For a paged engine, count the live blocks it actually allocates. This experiment used dense batches and measured the KV tensor payload. Process memory, allocator reservations and request latency require their own measurements.

## Run the measurement on your CPU

These commands were tested with Python 3.12 and curl on Linux x86-64. The first model run downloads about 269 MB of public SmolLM2 weights plus the tokenizer files. To try the arithmetic without that download, run the short Python example above.

```sh
python3.12 -m venv .venv
. .venv/bin/activate
python -m pip install --index-url https://download.pytorch.org/whl/cpu torch==2.15.0
python -m pip install transformers==5.24.1
curl -fLo kv_batch_bucketing.py \
  https://raw.githubusercontent.com/sungeuns/foundation-model-engineering/d4d45703a0941543c63afc406bcaf21e0b99a036/public/labs/kv_batch_bucketing.py
python kv_batch_bucketing.py > bucketing-run.json
```

The JSON report contains token IDs and measurements for the six original prompts. Look for `largest_batch_prefill_kv_bytes` under both policies. Each should read 1,013,760 bytes, or 990 KiB. Once the model files are cached, `HF_HUB_OFFLINE=1 python kv_batch_bucketing.py` reruns the experiment offline in that environment.

*An AI coding assistant wrote this adaptation from the book's [length-bucketing experiment](https://sungeuns.github.io/foundation-model-engineering/chapter-12/length-bucketing-lab/) and its recorded measurements.*
