"""Follow one token from its Q/K/V projections through its first attention layer.

Run with Python 3.12, torch==2.15.0 and transformers==5.24.1 (CPU).
The first run downloads the pinned SmolLM2-135M base checkpoint and tokenizer.
After caching them, set HF_HUB_OFFLINE=1 to run the same experiment offline.
"""
import json

import torch
import transformers
from transformers import AutoModel, AutoTokenizer


MODEL = "HuggingFaceTB/SmolLM2-135M"
REVISION = "93efa2f097d58c2a74874c7e644dbc9b0cee75a2"
PROMPTS = ["red cat", "blue cat", "red dog"]


@torch.inference_mode()
def experiment():
    torch.set_num_threads(1)
    tokenizer = AutoTokenizer.from_pretrained(MODEL, revision=REVISION)
    model = AutoModel.from_pretrained(MODEL, revision=REVISION, attn_implementation="eager",
                                      dtype=torch.float32).eval().cpu()
    tokens = tokenizer(PROMPTS, return_tensors="pt", add_special_tokens=False)["input_ids"]
    assert tokens.shape == (3, 2)
    assert tokens[0, 1] == tokens[1, 1] and tokens[0, 0] != tokens[1, 0]
    assert tokens[0, 0] == tokens[2, 0] and tokens[0, 1] != tokens[2, 1]
    captures = {}

    def capture(name):
        def remember(_module, _inputs, output):
            captures[name] = output.detach()
        return remember

    handles = []
    for layer, projection in [(0, "q_proj"), (0, "k_proj"), (0, "v_proj"), (0, "o_proj"), (1, "q_proj")]:
        module = getattr(model.layers[layer].self_attn, projection)
        handles.append(module.register_forward_hook(capture(f"layer{layer}.{projection}")))
    try:
        output = model(tokens, output_attentions=True, use_cache=False)
    finally:
        for handle in handles:
            handle.remove()

    def difference(left, right, position):
        return {name: (values[left, position] - values[right, position]).abs().max().item()
                for name, values in captures.items()}

    final_cat = difference(0, 1, 1)
    first_red = difference(0, 2, 0)
    assert all(final_cat[f"layer0.{p}_proj"] == 0 for p in "qkv")
    assert final_cat["layer0.o_proj"] > 0 and final_cat["layer1.q_proj"] > 0
    assert all(value == 0 for value in first_red.values())
    return {
        "model": MODEL, "revision": REVISION, "torch": torch.__version__,
        "transformers": transformers.__version__, "device": "cpu", "dtype": "float32",
        "prompts": PROMPTS, "token_ids": tokens.tolist(),
        "max_abs_delta_at_cat_after_changing_prefix": final_cat,
        "max_abs_delta_at_red_after_changing_suffix": first_red,
        "layer0_head0_final_query_weights": output.attentions[0][:, 0, -1, :].tolist(),
    }


if __name__ == "__main__":
    print(json.dumps(experiment(), indent=2))
