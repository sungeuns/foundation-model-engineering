"""CPU PyTorch exercises on causal attention and padding a batch of two sequences.

Source: Foundation Model Engineering, §3.1, Self-Attention Mathematics.
English: https://sungeuns.github.io/foundation-model-engineering/chapter-3/self-attention-mathematics/#batched-padding-example
한국어: https://sungeuns.github.io/foundation-model-engineering/ko/chapter-3/self-attention-mathematics/#batched-padding-example
"""

from math import sqrt

import torch
from torch.nn import functional as F


def attention(q, k, v, allowed=None):
    """Materialized scores [..., query, key]; True means visible.

    A 2D mask aligns to [query, key]. For per-example key validity [B, S],
    pass valid[:, None, None, :] for scores shaped [B, H, T, S].
    Use finite inputs; a zero weight times a NaN value can still produce NaN.
    """
    scores = (q @ k.transpose(-2, -1)) / sqrt(q.size(-1))
    if allowed is not None:
        if allowed.dtype != torch.bool:
            raise TypeError("Use a boolean visibility mask")
        allowed = torch.broadcast_to(allowed, scores.shape)
        if not allowed.any(dim=-1).all():
            raise ValueError("Every query must see at least one key")
        scores = scores.masked_fill(~allowed, float("-inf"))
    weights = scores.softmax(dim=-1)
    return weights @ v, weights


def batched_padding_example():
    # Both sequences have two slots. Only B's second slot is padding.
    valid = torch.tensor([[True, True], [True, False]])
    q = torch.zeros(2, 1, 2, 1)
    k = torch.zeros_like(q)
    v = torch.tensor([[1., 3.], [10., 90.]])[:, None, :, None]
    key_mask = valid[:, None, None, :]  # [batch, 1, 1, key]
    expected = torch.tensor([2., 2., 10.])  # A0, A1, B0

    for pad, wrong_b0 in ((90., 50.), (900., 455.)):
        v[1, 0, 1, 0] = pad
        # Diagnostic: [2, 2] also fits [query, key], with different meaning.
        wrong, _ = attention(q, k, v, valid)
        torch.testing.assert_close(wrong[:, 0, :, 0][valid], torch.tensor([2., 1., wrong_b0]))
        torch.testing.assert_close(wrong, F.scaled_dot_product_attention(q, k, v, attn_mask=valid))
        out, _ = attention(q, k, v, key_mask)
        torch.testing.assert_close(out[:, 0, :, 0][valid], expected)
        native = F.scaled_dot_product_attention(q, k, v, attn_mask=key_mask, dropout_p=0.0)
        torch.testing.assert_close(native, out)

    # A NaN pad tests a separate failure: dense matrix multiplication sums 0 * NaN.
    v[1, 0, 1, 0] = float("nan")
    contaminated, _ = attention(q, k, v, key_mask)
    assert contaminated[1, 0, 0, 0].isnan()
    clean_v = v.masked_fill(~valid[:, None, :, None], 0.)
    cleaned, _ = attention(q, k, clean_v, key_mask)
    torch.testing.assert_close(cleaned[:, 0, :, 0][valid], expected)
    print("Valid outputs (A0, A1, B0):", cleaned[:, 0, :, 0][valid].tolist())


if __name__ == "__main__":
    # The, cat, sat, here. Shape: [batch=1, heads=1, tokens=4, features=2].
    q = torch.tensor([[1, 0], [1, 1], [0, 1], [-1, 1]], dtype=torch.float32)[None, None]
    k = torch.tensor([[1, 0], [1, 1], [0, 1], [-1, 0]], dtype=torch.float32)[None, None]
    v = torch.tensor([[1, 0], [0, 2], [2, 1], [-1, 1]], dtype=torch.float32)[None, None]
    causal = torch.ones(4, 4, dtype=torch.bool).tril()

    for label, mask in [("All keys", None), ("Causal", causal)]:
        out, weights = attention(q, k, v, mask)
        expected = F.scaled_dot_product_attention(q, k, v, attn_mask=mask, dropout_p=0.0)
        torch.testing.assert_close(out, expected)
        print(label, "cat weights:", weights[0, 0, 1], "output:", out[0, 0, 1])

    # Change only the future values. Check both positions before that change.
    changed = v.clone()
    changed[:, :, 2:] += 100
    before, _ = attention(q, k, v, causal)
    after, _ = attention(q, k, changed, causal)
    torch.testing.assert_close(before[:, :, :2], after[:, :, :2])

    batched_padding_example()
