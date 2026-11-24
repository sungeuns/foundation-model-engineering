"""Two decoder queries over three source tokens and one pad. Requires PyTorch.

Foundation Model Engineering, section 4.3
English: https://sungeuns.github.io/foundation-model-engineering/chapter-4/encoder-decoder/#cross-attention-example
Korean: https://sungeuns.github.io/foundation-model-engineering/ko/chapter-4/encoder-decoder/#cross-attention-example
"""

import math

import torch
from torch.nn.functional import scaled_dot_product_attention


def cross_attention(values, mask):
    # Each input has shape (batch=1, heads=1, positions, head_dim=1).
    query = torch.tensor([0.0, math.log(2)]).reshape(1, 1, 2, 1)
    key = torch.tensor([0.0, 1.0, 2.0, 3.0]).reshape(1, 1, 4, 1)
    value = torch.tensor(values).reshape(1, 1, 4, 1)
    return scaled_dot_product_attention(query, key, value, attn_mask=mask).flatten()


if __name__ == "__main__":
    source_mask = torch.tensor([[True, True, True, False]])
    baseline = cross_attention([3.0, 6.0, 12.0, 90.0], source_mask)
    pad_changed = cross_attention([3.0, 6.0, 12.0, 900.0], source_mask)
    fox_changed = cross_attention([3.0, 6.0, 33.0, 90.0], source_mask)
    torch.testing.assert_close(baseline, torch.tensor([7.0, 9.0]))
    torch.testing.assert_close(pad_changed, baseline)
    torch.testing.assert_close(fox_changed - baseline, torch.tensor([7.0, 12.0]))
    print("baseline:", baseline.tolist())
    print("change from raising fox by 21:", (fox_changed - baseline).tolist())
