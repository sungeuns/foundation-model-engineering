"""Measure the KV tensor payload of a dense batch and two independent requests.

English lesson: https://sungeuns.github.io/foundation-model-engineering/chapter-12/kv-cache-management/#kv-batch-padding
한국어 실습: https://sungeuns.github.io/foundation-model-engineering/ko/chapter-12/kv-cache-management/#kv-batch-padding

Tested with Python 3.12 on Linux x86-64. In a fresh environment:
    python -m pip install "torch==2.15.0" --index-url https://download.pytorch.org/whl/cpu
    python -m pip install "transformers==5.24.1"
    python kv_batch_padding.py

The first run downloads the pinned tokenizer and model (about 270 MB of model
weights). Later runs can use the same local cache with networking disabled:
    HF_HUB_OFFLINE=1 python kv_batch_padding.py

The unequal-length prompts and pinned model follow the book's SmolLM2 notebook:
https://github.com/sungeuns/cookbook/blob/4640bbf5e5275380cf6a665e049378db30ae6d29/notebooks/en/measure_kv_cache_payload.ipynb
This script independently advances and compares three caches. It counts the
contents of key/value tensors, excluding attention masks, weights, allocator
overhead and temporary buffers. It does not measure throughput or latency.
The checkpoint is distributed separately under its model card's terms:
https://huggingface.co/HuggingFaceTB/SmolLM2-135M/blob/93efa2f097d58c2a74874c7e644dbc9b0cee75a2/README.md
"""

# SPDX-License-Identifier: MIT
# Copyright (c) 2026 Seongeun So
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.

from dataclasses import dataclass
import json
import platform

import torch
import transformers
from transformers import AutoModelForCausalLM, AutoTokenizer, DynamicCache


MODEL = "HuggingFaceTB/SmolLM2-135M"
REVISION = "93efa2f097d58c2a74874c7e644dbc9b0cee75a2"
APPENDS = 4


def logical_positions(mask):
    # Real tokens receive 0, 1, ... within each request, even after left padding.
    return (mask.cumsum(dim=-1) - 1).clamp_min(0)


@dataclass
class GenerationState:
    ids: torch.Tensor
    mask: torch.Tensor
    cache: DynamicCache
    logits: torch.Tensor  # [requests, vocabulary], at the last real token


def evaluate(model, ids, mask, cache=None):
    # Prefill consumes every column. On a decode step only the last token is new.
    tokens = ids if cache is None else ids[:, -1:]
    positions = logical_positions(mask)[:, -tokens.shape[1]:]
    output = model(input_ids=tokens, attention_mask=mask, position_ids=positions,
                   cache=cache, use_cache=True, logits_to_keep=1)
    assert isinstance(output.cache, DynamicCache)
    return GenerationState(ids, mask, output.cache, output.logits[:, -1])


def append_greedy_token(model, state):
    token = state.logits.argmax(dim=-1, keepdim=True)
    ids = torch.cat((state.ids, token), dim=1)
    mask = torch.cat((state.mask, torch.ones_like(token)), dim=1)
    return evaluate(model, ids, mask, state.cache)


def payload(state, config):
    requests, slots = state.mask.shape
    key_bytes = value_bytes = 0
    assert len(state.cache.layers) == config.num_hidden_layers
    for layer in state.cache.layers:
        for tensor in (layer.keys, layer.values):
            assert tensor.shape == (requests, config.num_key_value_heads, slots, config.head_dim)
            assert tensor.device.type == "cpu" and tensor.dtype == torch.float32
        key_bytes += layer.keys.numel() * layer.keys.element_size()
        value_bytes += layer.values.numel() * layer.values.element_size()
    return key_bytes, value_bytes


def compare_request(batch, index, solo):
    valid = batch.mask[index].bool()
    assert torch.equal(batch.ids[index, valid], solo.ids[0])
    assert torch.equal(logical_positions(batch.mask)[index, valid], logical_positions(solo.mask)[0])
    logits = batch.logits[index]
    torch.testing.assert_close(logits, solo.logits[0], atol=1e-4, rtol=1e-4)
    assert logits.argmax().item() == solo.logits[0].argmax().item()
    max_kv_diff = 0.0
    for dense_layer, solo_layer in zip(batch.cache.layers, solo.cache.layers, strict=True):
        for dense_tensor, solo_tensor in ((dense_layer.keys, solo_layer.keys),
                                          (dense_layer.values, solo_layer.values)):
            # Compare only real positions on the time axis. Payload still counts padding.
            actual = dense_tensor[index, :, valid, :]
            torch.testing.assert_close(actual, solo_tensor[0], atol=1e-4, rtol=1e-4)
            max_kv_diff = max(max_kv_diff, (actual - solo_tensor[0]).abs().max().item())
    return (logits - solo.logits[0]).abs().max().item(), max_kv_diff


@torch.inference_mode()
def measure(model, tokenizer, prompts):
    grouped = tokenizer(prompts, padding=True, return_tensors="pt")
    batch = evaluate(model, grouped.input_ids, grouped.attention_mask)
    solos = []
    for prompt in prompts:
        single = tokenizer(prompt, return_tensors="pt")
        solos.append(evaluate(model, single.input_ids, single.attention_mask))
    lengths = [state.ids.shape[1] for state in solos]
    cfg = model.config
    element_bytes = batch.cache.layers[0].keys.element_size()
    bytes_per_position = 2 * cfg.num_hidden_layers * cfg.num_key_value_heads * cfg.head_dim * element_bytes
    padding_slots = len(prompts) * max(lengths) - sum(lengths)

    rows = []
    for step in range(APPENDS + 1):  # Check after prefill and after each of four appends.
        dense_key, dense_value = payload(batch, cfg)
        solo_bytes = [sum(payload(state, cfg)) for state in solos]
        observed_padding = dense_key + dense_value - sum(solo_bytes)
        assert observed_padding == padding_slots * bytes_per_position
        comparisons = [compare_request(batch, i, state) for i, state in enumerate(solos)]
        rows.append({
            "step": step, "dense_key": dense_key, "dense_value": dense_value,
            "solo_total": solo_bytes, "padding_bytes": observed_padding,
            "next_ids": batch.logits.argmax(-1).tolist(),
            "max_logit_diff": max(score for score, _ in comparisons),
            "max_valid_kv_diff": max(delta for _, delta in comparisons),
        })
        if step < APPENDS:
            batch = append_greedy_token(model, batch)
            solos = [append_greedy_token(model, state) for state in solos]
    return {"prompts": prompts, "lengths": lengths, "bytes_per_position": bytes_per_position, "rows": rows}


if __name__ == "__main__":
    torch.set_num_threads(1)
    tokenizer = AutoTokenizer.from_pretrained(MODEL, revision=REVISION)
    tokenizer.padding_side = "left"
    tokenizer.pad_token = tokenizer.eos_token
    model = AutoModelForCausalLM.from_pretrained(
        MODEL, revision=REVISION, dtype=torch.float32, attn_implementation="eager"
    ).eval().cpu()
    report = {
        "model": MODEL, "revision": REVISION, "torch": str(torch.__version__),
        "transformers": transformers.__version__, "python": platform.python_version(),
        "machine": platform.machine(), "threads": torch.get_num_threads(),
        "layers": model.config.num_hidden_layers, "kv_heads": model.config.num_key_value_heads,
        "head_dim": model.config.head_dim,
        "unequal_lengths": measure(model, tokenizer, ["Water boils at", "When a kettle of water starts to boil, the steam"]),
        "equal_lengths": measure(model, tokenizer, ["Water boils at", "Snow melts at"]),
    }
    print(json.dumps(report, indent=2))
