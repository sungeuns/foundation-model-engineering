"""Test an induction-like attention pattern on disjoint synthetic token sequences.

Python 3.12, Linux x86-64, CPU. Install the tested dependencies:
    python -m pip install torch==2.15.0 --index-url https://download.pytorch.org/whl/cpu
    python -m pip install transformers==5.24.1
    python induction_probe.py

The first run downloads HuggingFaceTB/SmolLM2-135M (about 270 MB of weights).
HF_HUB_OFFLINE=1 reuses the cached revision. Output is JSON. No tokenizer or
natural text is used: each letter in the lesson stands for one random token ID.
English lesson: https://sungeuns.github.io/foundation-model-engineering/chapter-19/mechanistic-interpretability/#induction-probe
한국어 실습: https://sungeuns.github.io/foundation-model-engineering/ko/chapter-19/mechanistic-interpretability/#induction-probe
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

from contextlib import contextmanager, nullcontext
import json
import platform
import random

import torch
import transformers
from transformers import AutoModelForCausalLM


MODEL = "HuggingFaceTB/SmolLM2-135M"
REVISION = "93efa2f097d58c2a74874c7e644dbc9b0cee75a2"
SEED = 319
DEVELOPMENT, HELD_OUT = 16, 32


def prompts(bos, rows, swapped=False, fresh_cue=False):
    """[BOS A B x y C z w A]. A fresh cue D never occurred in this sequence."""
    batch = []
    for a, b, c, x, y, z, w, d in rows:
        if swapped:
            b, c = c, b
        batch.append([bos, a, b, x, y, c, z, w, d if fresh_cue else a])
    return torch.tensor(batch)


def attention_to_successor(model, ids):
    result = model(ids, use_cache=False, output_attentions=True, logits_to_keep=1)
    # Each tensor is [batch, query heads, query positions, key positions].
    return torch.stack([layer[:, :, -1, 2] for layer in result.attentions])


@contextmanager
def zero_final_head(model, layer, head):
    """Zero one query head at one position just before LlamaAttention.o_proj."""
    config = model.config
    start = head * config.head_dim
    calls = 0

    def mask_head(_module, args):
        nonlocal calls
        calls += 1
        (joined,) = args
        assert joined.shape[-1] == config.num_attention_heads * config.head_dim
        edited = joined.clone()
        edited[:, -1, start:start + config.head_dim] = 0
        return (edited,)

    handle = model.model.layers[layer].self_attn.o_proj.register_forward_pre_hook(mask_head)
    try:
        yield
        assert calls == 1, "Expected exactly one forward through the selected projection"
    finally:
        handle.remove()


def candidate_gap(model, ids, rows, ablate):
    context = nullcontext() if ablate is None else zero_final_head(model, *ablate)
    with context:
        logits = model(ids, use_cache=False, logits_to_keep=1).logits[:, -1]
    # log(p(B) / p(C)) equals logit(B) - logit(C), using original labels after swaps.
    examples = torch.arange(len(rows))
    return logits[examples, [r[1] for r in rows]] - logits[examples, [r[2] for r in rows]]


@torch.inference_mode()
def experiment():
    torch.set_num_threads(1)
    model = AutoModelForCausalLM.from_pretrained(
        MODEL, revision=REVISION, dtype=torch.float32, attn_implementation="eager",
    ).eval().cpu()
    bos = model.config.bos_token_id
    population = range(1000, 9000)
    assert bos not in population and population.stop <= model.config.vocab_size
    draws = random.Random(SEED).sample(population, 8 * (DEVELOPMENT + HELD_OUT))
    rows = [draws[i:i + 8] for i in range(0, len(draws), 8)]
    dev, held = rows[:DEVELOPMENT], rows[DEVELOPMENT:]

    def cue_conditions(sample):
        repeated = attention_to_successor(model, prompts(bos, sample))
        fresh = attention_to_successor(model, prompts(bos, sample, fresh_cue=True))
        return repeated, fresh

    repeated, fresh = cue_conditions(dev)
    scores = (repeated - fresh).mean(dim=1)
    layers, heads = scores.shape
    layer, head = divmod(int(scores.argmax()), heads)
    neighbor = (head + 1) % heads
    test_repeated, test_fresh = cue_conditions(held)

    original = prompts(bos, held)
    swapped = prompts(bos, held, swapped=True)
    outcomes = {}
    for name, ablate in (("intact", None), ("selected_zeroed", (layer, head)),
                         ("neighbor_zeroed", (layer, neighbor))):
        original_gap = candidate_gap(model, original, held, ablate)
        swapped_gap = candidate_gap(model, swapped, held, ablate)
        shift = original_gap - swapped_gap
        outcomes[name] = {
            "B_minus_C_original_mean": original_gap.mean().item(),
            "B_minus_C_swapped_mean": swapped_gap.mean().item(),
            "swap_shift_mean": shift.mean().item(),
            "positive_shifts": int((shift > 0).sum()),
            "paired_shifts": shift.tolist(),
        }
    return {
        "model": MODEL, "revision": REVISION, "python": platform.python_version(),
        "torch": str(torch.__version__), "transformers": transformers.__version__,
        "device": "cpu", "dtype": "float32", "threads": 1, "seed": SEED,
        "development_prompts": DEVELOPMENT, "held_out_prompts": HELD_OUT,
        "layers": layers, "query_heads_per_layer": heads,
        "selected_layer": layer, "selected_head": head, "neighbor_head": neighbor,
        "selected_development_attention_difference": scores[layer, head].item(),
        "held_out_mean_attention_to_position_2": {
            "repeated_A": test_repeated[layer, :, head].mean().item(),
            "fresh_D": test_fresh[layer, :, head].mean().item(),
        },
        "held_out_logits": outcomes,
    }


if __name__ == "__main__":
    print(json.dumps(experiment(), indent=2))
