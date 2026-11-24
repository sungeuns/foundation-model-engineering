# The model fits in memory. Why does the next request fail?

Unsubmitted editorial draft adapted from the book's KV cache lesson with AI assistance. It includes a hypothetical capacity calculation and a measured CPU experiment. Before external publication, the author should review the argument and the destination's current rules.

A model loads successfully. A few requests run. Then a longer conversation arrives and memory runs out.

The weights did not grow. The attention state did.

During autoregressive decoding, each layer keeps keys and values for earlier tokens. The next token attends to that state instead of recomputing the old projections. This saves work, but it makes memory depend on live traffic—not just the checkpoint size.

## Count the state before choosing a concurrency limit

For a conventional dense KV cache, the payload in bytes is:

```text
2 × concurrent sequences × cached tokens per sequence
  × layers × KV heads × head dimension × bytes per value
```

The factor two is for keys and values. Query heads are not necessarily KV heads: grouped-query attention shares keys and values across groups of query heads.

Consider a hypothetical model with 80 layers, 8 KV heads, 128 values per head, and two bytes per value. This is an illustrative geometry, not a specification of a named checkpoint.

```python
layers, kv_heads, head_dim, bytes_per_value = 80, 8, 128, 2
bytes_per_token = 2 * layers * kv_heads * head_dim * bytes_per_value
GiB = 2**30

prompt_tokens = 8192
max_new_tokens = 2048
cache_budget = 24 * GiB

prompt_payload = prompt_tokens * bytes_per_token
peak_payload = (prompt_tokens + max_new_tokens) * bytes_per_token

assert prompt_payload / GiB == 2.5
assert peak_payload / GiB == 3.125
print(cache_budget // prompt_payload)  # 9 requests at prompt length
print(cache_budget // peak_payload)    # 7 requests at maximum live length
```

Assume the serving pool has 24 GiB left **for KV payload**, after separately reserving weights, activations, workspaces, allocation overhead, and a safety margin. Nine prompts consume 22.5 GiB. But if all nine produce their allowed continuations, they need 28.125 GiB.

The admission check passed. The continuation budget did not.

A dynamic scheduler can admit more work than a conservative maximum-length reservation, but it needs an explicit response when demand grows: queue, preempt, recompute, or enforce an output limit. Those choices change latency and sometimes user-visible behavior. A payload calculation alone does not predict measured GPU concurrency.

## What does one short prompt cost beside a long one?

A CPU experiment with SmolLM2-135M counted the elements in every layer’s FP32 key and value tensors. One cached position per request took 45 KiB. Two prompts contained 3 and 11 tokens. Run separately, their caches totaled 630 KiB after prefill. Put them in one left-padded batch and the tensors held 22 positions instead of 14, using 990 KiB. The mask kept the short request from attending to its eight padding positions. Those positions still occupied **360 KiB**.

After four more tokens were fed to each request, the totals reached 1,350 KiB batched and 990 KiB separate. With two 3-token prompts, both layouts started at 270 KiB and ended at 630 KiB. Both routes chose the same next tokens in these runs. If you budget for mixed-length traffic, check how your serving backend stores masked positions. This experiment measures the KV tensors only. [Reproduce the batch-padding measurement](https://sungeuns.github.io/foundation-model-engineering/chapter-12/kv-cache-management/#kv-batch-padding).

## Three tempting fixes that answer different questions

**Use fewer KV heads.** Holding the other dimensions fixed, payload scales linearly with KV heads. Moving from eight to one gives an eightfold reduction in this part of the state. You cannot generally change a trained checkpoint's head structure as a serving flag; model design, training, and quality evaluation matter. See the [GQA paper](https://arxiv.org/abs/2305.13245).

**Use paged allocation.** Paging reduces wasted allocation and enables sharing in supported situations. It does not make the actual keys and values disappear. If the useful live payload alone exceeds the budget, eliminating fragmentation cannot solve that. See the [PagedAttention paper](https://arxiv.org/abs/2309.06180).

**Use lower precision.** Reducing storage from two bytes to one halves raw payload. That is a capacity result, not proof of twice the throughput. Scales, conversion work, backend support, and quality changes still need measurement.

## Measure the failure you are trying to prevent

Track live allocated cache, request lengths, allocation failures, preemption, and latency under a realistic mix of prompt and output lengths. Report time to first token separately from inter-token latency. Test the same workload and quality target before and after a change.

For multiple devices, apply the actual sharding and replication layout. For variable-length requests, count allocated tokens per sequence rather than multiplying every request by an average that hides the long tail.

The practical question is: **how much attention state can be live at the same time, and what happens when that budget is exhausted?**

Source lesson and interactive calculator: [KV cache management](https://sungeuns.github.io/foundation-model-engineering/chapter-12/kv-cache-management/). The book is an independent, AI-assisted open-source project maintained by Seongeun So.
