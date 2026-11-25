"""Check a rotary position shift on CPU, using one fixed two-token prompt.

Run with Python 3.12, torch==2.15.0 and transformers==5.24.1. The first run
downloads the pinned SmolLM2-135M base model and tokenizer. Once cached, run
HF_HUB_OFFLINE=1 python rope_position_ids.py to repeat without a network.
"""
import json

import torch
import transformers
from transformers import AutoModel, AutoTokenizer


MODEL = "HuggingFaceTB/SmolLM2-135M"
REVISION = "93efa2f097d58c2a74874c7e644dbc9b0cee75a2"


@torch.inference_mode()
def measure():
    torch.set_num_threads(1)
    tokenizer = AutoTokenizer.from_pretrained(MODEL, revision=REVISION)
    model = AutoModel.from_pretrained(
        MODEL, revision=REVISION, attn_implementation="eager", dtype=torch.float32,
    ).eval().cpu()
    tokens = tokenizer("red cat", add_special_tokens=False, return_tensors="pt")["input_ids"]
    assert tokens.tolist() == [[455, 2644]]

    # Supplying the same mask in both arms avoids interpreting repeating position
    # IDs as packed sequence boundaries. The decoder still applies its causal mask.
    visible = torch.ones_like(tokens)

    def previous_key_weight(positions):
        out = model(tokens, position_ids=positions, attention_mask=visible,
                    use_cache=False, output_attentions=True)
        # At layer 0, head 0, the second token can read either token. No padding.
        return out.attentions[0][0, 0, 1, 0].item()

    rows = []
    for start in range(248, 265):
        intended = torch.tensor([[start, start + 1]], dtype=torch.int64)
        rounded = intended.to(torch.bfloat16).to(torch.int64)
        rows.append({
            "positions": intended[0].tolist(),
            "rounded_positions": rounded[0].tolist(),
            "integer_weight": previous_key_weight(intended),
            "rounded_weight": previous_key_weight(rounded),
        })
    # Translation with intact IDs keeps the first-layer score within FP32 error.
    baseline = rows[0]["integer_weight"]
    assert all(abs(row["integer_weight"] - baseline) < 1e-5 for row in rows)
    assert all(row["integer_weight"] == row["rounded_weight"] for row in rows
               if row["positions"] == row["rounded_positions"])
    assert all(0 < row["rounded_weight"] < 1 for row in rows)
    for start, gap in [(255, 1), (256, 0), (257, 2)]:
        row = next(row for row in rows if row["positions"][0] == start)
        first, second = row["rounded_positions"]
        assert second - first == gap
        if gap != 1:
            assert abs(row["rounded_weight"] - row["integer_weight"]) > 0.01

    return {
        "model": MODEL, "revision": REVISION, "prompt": "red cat",
        "token_ids": tokens[0].tolist(), "layer": 0, "head": 0,
        "query_token_index": 1, "key_token_index": 0,
        "device": "cpu", "model_dtype": "float32", "attention": "eager",
        "torch": str(torch.__version__), "transformers": transformers.__version__,
        "rows": rows,
    }


if __name__ == "__main__":
    print(json.dumps(measure(), indent=2))
