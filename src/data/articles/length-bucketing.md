---
title: "Why length bucketing cut padding by two-thirds and left peak KV memory unchanged"
chapter: /chapter-12/length-bucketing-lab
firstPublished: "2026-11-25T00:27:23Z"
summary: "Pair six prompts two ways, count the padding and reproduce the peak key/value cache size with a few lines of Python."
tags: [python, machinelearning]
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

This Python calculation reproduces the counts without loading a model. Try changing the 11-token prompt to 12 before running it again.

```python
lengths = [3, 11, 4, 10, 5, 9]
for order in (lengths, sorted(lengths)):
    pairs = zip(order[::2], order[1::2], strict=True)
    slots = [2 * max(pair) for pair in pairs]
    sizes_kib = [45 * count for count in slots]
    print(sum(slots) - sum(order), sum(sizes_kib), max(sizes_kib))
# padding positions, summed KiB, peak KiB
# 18 2700 990
#  6 2160 990
```

## What to measure on your worker

The [CPU experiment](https://sungeuns.github.io/foundation-model-engineering/labs/kv_batch_bucketing.py) counts bytes in the actual tensors. The [recorded run](https://sungeuns.github.io/foundation-model-engineering/labs/2026-11/kv-batch-bucketing.json) includes every pair and each prompt's greedy next-token ID. All six prompts kept the same next-token ID when run alone and under both batching policies.

For a service that waits to find similar-length partners, measure the time spent in the queue as well as peak cache size. For a paged engine, count the live blocks it actually allocates. This experiment used dense batches and measured the KV tensor payload. Process memory, allocator reservations and request latency require their own measurements.

*An AI coding assistant wrote this adaptation from the book's [length-bucketing experiment](https://sungeuns.github.io/foundation-model-engineering/chapter-12/length-bucketing-lab/) and its recorded measurements.*
