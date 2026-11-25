---
title: "Why a seventh token left the KV cache with a smaller buffer"
published: false
description: "Trace a 24-layer looped decoder on CPU. After a seventh token, the logical KV payload grew but the buffers behind it shrank."
tags: python, machinelearning, pytorch
canonical_url: https://sungeuns.github.io/foundation-model-engineering/articles/loop-cache-storage/
ai_disclosure_level: fully_autonomous
chapter: /chapter-4/various-llm-architectures
anchor: loop-cache-storage
firstPublished: "2026-11-25T03:26:00Z"
---

Six tokens have passed through a small decoder. Its keys and values occupy 18,432 bytes of backing storage. Send it one more token and the figure drops to 13,824 bytes. Where did 4,608 bytes go?

The clue is a single sliding-window attention layer. Its window covers the current token and three earlier ones. After processing six tokens, the keys it keeps for the next query have shape `[1, 2, 3, 8]` in this experiment. Two heads, three positions and eight FP32 coordinates make 192 bytes. Look underneath that tensor and you find a 384-byte allocation. The last three positions are a view into the original six.

You can reproduce the arithmetic with PyTorch alone. This example follows one key tensor through a decode step.

```python
import torch

kept = torch.zeros(1, 2, 6, 8, dtype=torch.float32)[:, :, -3:, :]
print(kept.nbytes, kept.untyped_storage().nbytes())       # 192 384
next_key = torch.ones(1, 2, 1, 8, dtype=kept.dtype)
kept = torch.cat([kept, next_key], dim=2)[:, :, -3:, :]
print(kept.nbytes, kept.untyped_storage().nbytes())       # 192 256
```

The full experiment uses Hugging Face's `Inkling2LoopTextModel` with 24 layers, of which 20 have a short window. Each of those 20 layers has both a key and a value buffer. Moving from six positions to four in their backing allocations saves `20 × 2 × 128 = 5,120` bytes. The four full-attention layers each add one key and one value, using `4 × 2 × 64 = 512` bytes. Subtract the growth from the savings and you get the missing 4,608 bytes. The sum of the *visible tensor sizes* actually grew from 10.5 to 11 KiB.

What if the middle 12 layers run five times? The same 24 layer objects now receive 72 calls per forward pass. This implementation keeps a separate cache for each pass. After the six-token prefill the KV storage is 54 KiB, and after one more token it is 40.5 KiB. The experiment uses narrow, randomly initialized FP32 weights on CPU. These numbers describe the backing storage reached from the KV tensors and exclude convolution state, allocator reservations and the rest of the process. They cannot predict the memory or answer quality of a trained checkpoint.

Several tensor views can share one allocation. Counting the bytes behind each view would count that allocation more than once. The experiment groups allocations by their storage address and sums each size once. [Inspect the counting code on GitHub](https://github.com/sungeuns/foundation-model-engineering/blob/9c2cdca7b6eb33707aed43535afa0d132eff74db/public/labs/loop_cache.py#L17-L29)

Run the [complete CPU experiment](https://sungeuns.github.io/foundation-model-engineering/labs/loop_cache.py) or inspect [the measured bytes at one, three and five passes](https://sungeuns.github.io/foundation-model-engineering/labs/2026-11/loop-cache.json). The script compares the last hidden state from cached decoding with a fresh run on all seven tokens. The [book section](https://sungeuns.github.io/foundation-model-engineering/chapter-4/various-llm-architectures/#loop-cache-storage) connects the result to two different approaches to layer reuse, including [Z.ai's description of GLM-5.4](https://docs.z.ai/guides/llm/glm-5.4) and the [Thinking Machines Lab research checkpoint](https://thinkingmachines.ai/model-card/tml-d24-varloop-research/).

*An AI coding assistant wrote this article and ran the CPU experiment with PyTorch 2.15.0 and Transformers 5.24.1.*
