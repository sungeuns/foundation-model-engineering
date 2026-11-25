"""Measure how pairing six prompts changes the KV tensor payload after prefill.

English: https://sungeuns.github.io/foundation-model-engineering/chapter-12/length-bucketing-lab/
한국어: https://sungeuns.github.io/foundation-model-engineering/ko/chapter-12/length-bucketing-lab/

Tested on Linux x86-64 with Python 3.12. In a fresh environment:
    python -m pip install "torch==2.15.0" --index-url https://download.pytorch.org/whl/cpu
    python -m pip install "transformers==5.24.1"
    python kv_batch_bucketing.py

The first run downloads the model (about 270 MB of weights) and tokenizer.
To reuse the downloaded revision without a network connection:
    HF_HUB_OFFLINE=1 python kv_batch_bucketing.py

Each schedule runs three dense batches of two, one batch at a time. The script
counts only the stored keys and values after prefill. The sum of three snapshots
and the largest single snapshot answer different questions. The experiment
does not measure peak process memory, memory traffic, throughput or latency.

Model card and weights license:
https://huggingface.co/HuggingFaceTB/SmolLM2-135M/blob/93efa2f097d58c2a74874c7e644dbc9b0cee75a2/README.md
Model configuration:
https://huggingface.co/HuggingFaceTB/SmolLM2-135M/blob/93efa2f097d58c2a74874c7e644dbc9b0cee75a2/config.json
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

import json
import platform

import torch
import transformers
from transformers import AutoModelForCausalLM, AutoTokenizer, DynamicCache


MODEL = "HuggingFaceTB/SmolLM2-135M"
REVISION = "93efa2f097d58c2a74874c7e644dbc9b0cee75a2"
PROMPTS = {
    "A": "The film was",
    "B": "The film starts with two old friends meeting at a station",
    "C": "The plot moves slowly",
    "D": "The film tells a quiet story about three lost friends",
    "E": "The final scene felt rushed",
    "F": "The music brought the two main characters to life",
}


@torch.inference_mode()
def prefill(model, tokenizer, request_ids):
    batch = tokenizer([PROMPTS[name] for name in request_ids], padding=True,
                      add_special_tokens=False, return_tensors="pt")
    mask = batch.attention_mask
    # Count positions within each request, preserving position zero after left padding.
    positions = (mask.cumsum(-1) - 1).clamp_min(0)
    output = model(input_ids=batch.input_ids, attention_mask=mask,
                   position_ids=positions, use_cache=True, logits_to_keep=1)
    config = model.config
    assert isinstance(output.cache, DynamicCache)
    assert len(output.cache.layers) == config.num_hidden_layers
    expected = (len(request_ids), config.num_key_value_heads, mask.shape[1], config.head_dim)
    key_bytes = value_bytes = 0
    for layer in output.cache.layers:
        for tensor in (layer.keys, layer.values):
            assert tensor.shape == expected
            assert tensor.device.type == "cpu" and tensor.dtype == torch.float32
        key_bytes += layer.keys.numel() * layer.keys.element_size()
        value_bytes += layer.values.numel() * layer.values.element_size()
    row = {
        "requests": request_ids,
        "real_lengths": mask.sum(-1).tolist(),
        "padding_slots": (mask == 0).sum().item(),
        "key_bytes": key_bytes,
        "value_bytes": value_bytes,
        "kv_bytes": key_bytes + value_bytes,
        "greedy_next_ids": output.logits[:, -1].argmax(-1).tolist(),
    }
    # No cache is retained across calls. Final logits suffice for the solo comparison.
    return row, output.logits[:, -1].clone()


def schedule(model, tokenizer, order, solos):
    rows = []
    for start in range(0, len(order), 2):
        names = order[start:start + 2]
        row, logits = prefill(model, tokenizer, names)
        for index, name in enumerate(names):
            solo_row, solo_logits = solos[name]
            torch.testing.assert_close(logits[index], solo_logits[0], rtol=1e-4, atol=1e-4)
            assert row["greedy_next_ids"][index] == solo_row["greedy_next_ids"][0]
        rows.append(row)
    return {
        "batches": rows,
        "padding_slots": sum(row["padding_slots"] for row in rows),
        "sum_prefill_kv_bytes": sum(row["kv_bytes"] for row in rows),
        "largest_batch_prefill_kv_bytes": max(row["kv_bytes"] for row in rows),
    }


def main():
    torch.set_num_threads(1)
    tokenizer = AutoTokenizer.from_pretrained(MODEL, revision=REVISION)
    tokenizer.padding_side = "left"
    tokenizer.pad_token = tokenizer.eos_token
    model = AutoModelForCausalLM.from_pretrained(
        MODEL, revision=REVISION, dtype=torch.float32, attn_implementation="eager"
    ).eval().cpu()
    solos = {name: prefill(model, tokenizer, [name]) for name in PROMPTS}
    lengths = {name: row["real_lengths"][0] for name, (row, _) in solos.items()}
    assert list(lengths.values()) == [3, 11, 4, 10, 5, 9]
    arrival = list(PROMPTS)
    by_length = sorted(arrival, key=lengths.__getitem__)
    report = {
        "model": MODEL, "revision": REVISION,
        "python": platform.python_version(), "torch": str(torch.__version__),
        "transformers": transformers.__version__, "machine": platform.machine(),
        "cpu_threads": torch.get_num_threads(), "dtype": str(model.dtype),
        "layers": model.config.num_hidden_layers,
        "kv_heads": model.config.num_key_value_heads,
        "head_dim": model.config.head_dim,
        "solo_requests": {
            name: {"text": PROMPTS[name], "length": lengths[name],
                   "greedy_next_id": row["greedy_next_ids"][0], "kv_bytes": row["kv_bytes"]}
            for name, (row, _) in solos.items()
        },
        "arrival_order": schedule(model, tokenizer, arrival, solos),
        "length_order": schedule(model, tokenizer, by_length, solos),
    }
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
