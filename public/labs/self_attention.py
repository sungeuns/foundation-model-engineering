"""Reproduce the book's four-token attention example on a CPU with PyTorch."""

from math import sqrt

import torch
from torch.nn import functional as F


def attention(q, k, v, allowed=None):
    """One materialized attention matrix; True means a key is visible."""
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
