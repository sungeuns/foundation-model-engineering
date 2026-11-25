"""Count layer calls and KV storage in a randomly initialized Inkling2Loop text model.

Tested on CPU with Python 3.12, torch==2.15.0 and transformers==5.24.1.
Install the two packages, then run `python loop_cache.py` offline.
    python -m pip install 'torch==2.15.0' 'transformers==5.24.1'
The weights are random. The experiment measures KV tensors, not language quality.
"""

import json
from collections import Counter

import torch
import transformers
from transformers import Inkling2LoopTextConfig, Inkling2LoopTextModel


def measure_kv(cache):
    tensors = [tensor for layer in cache.layers for tensor in (layer.keys, layer.values)]
    storage_bytes = {}
    for tensor in tensors:
        storage = tensor.untyped_storage()
        storage_bytes[storage.data_ptr()] = storage.nbytes()
    sliding_key = cache.layers[0].keys
    return {
        "slots": len(cache.layers),
        "first_sliding_key_bytes": [sliding_key.nbytes, sliding_key.untyped_storage().nbytes()],
        "logical_bytes": sum(tensor.nbytes for tensor in tensors),
        "backing_bytes": sum(storage_bytes.values()),
    }


@torch.inference_mode()
def run():
    torch.manual_seed(7)
    torch.set_num_threads(1)
    config = Inkling2LoopTextConfig(
        num_hidden_layers=24, loop_layer_index_start=6, loop_layer_index_end=18,
        layer_types=["hybrid" if i % 6 == 5 else "hybrid_sliding" for i in range(24)],
        vocab_size=32, unpadded_vocab_size=32, eos_token_id=2, hidden_size=32,
        num_attention_heads=4, num_key_value_heads=2, head_dim=8,
        swa_num_attention_heads=4, swa_num_key_value_heads=2, swa_head_dim=8,
        sliding_window_size=4, d_rel=4, rel_extent=16, moe_intermediate_size=16,
        n_routed_experts=2, num_experts_per_tok=1, loop_gate_rank=4,
        attn_implementation="eager",
    )
    model = Inkling2LoopTextModel(config).float().eval()
    calls = Counter()

    def count_call(module, inputs, output):
        calls[module] += 1

    for layer in model.layers:
        layer.register_forward_hook(count_call)
    rows = []
    tokens = torch.tensor([[1, 3, 5, 7, 9, 11, 13]])
    for passes in (1, 3, 5):
        model.config.loop_num_passes = passes
        calls.clear()
        prefix = model(input_ids=tokens[:, :-1], use_cache=True)
        row = {
            "passes": passes,
            "distinct_layers": len(calls),
            "prefill_layer_calls": calls.total(),
            "prefill": measure_kv(prefix.cache),
        }
        decoded = model(input_ids=tokens[:, -1:], cache=prefix.cache, use_cache=True)
        row["after_one_token"] = measure_kv(decoded.cache)
        full = model(input_ids=tokens, use_cache=False)
        torch.testing.assert_close(
            decoded.last_hidden_state[:, -1], full.last_hidden_state[:, -1], rtol=1e-4, atol=1e-5
        )
        rows.append(row)
    return {
        "torch": torch.__version__,
        "transformers": transformers.__version__,
        "device": "cpu",
        "dtype": "float32",
        "parameter_count": sum(p.numel() for p in model.parameters()),
        "runs": rows,
    }


if __name__ == "__main__":
    print(json.dumps(run(), indent=2))
