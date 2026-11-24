"""Change one future value and check whether it reaches an earlier SDPA row.

Foundation Model Engineering, section 4.4
English: https://sungeuns.github.io/foundation-model-engineering/chapter-4/hybrid-prefix-lm/#prefix-mask-test
Korean: https://sungeuns.github.io/foundation-model-engineering/ko/chapter-4/hybrid-prefix-lm/#prefix-mask-test
"""

import torch
from torch.nn.functional import scaled_dot_product_attention

prefix_len, length = 3, 7
position = torch.arange(length)
query_pos, key_pos = position[:, None], position[None, :]
allowed = (key_pos < prefix_len) | (key_pos <= query_pos)

# [batch, heads, positions, features]. Zero logits give visible keys equal weight.
q = k = torch.zeros(1, 1, length, 1)
values = torch.arange(1, length + 1, dtype=q.dtype).view_as(q)


def attend(v, mask):
    return scaled_dot_product_attention(q, k, v, attn_mask=mask, dropout_p=0.0).flatten()


# Increase T2 from 5 to 105. Can T1 see the change?
t1, t2 = 3, 4
changed = values.clone()
changed[0, 0, t2, 0] += 100
output = attend(values, allowed)
new_output = attend(changed, allowed)
torch.testing.assert_close(output, torch.tensor([2., 2., 2., 2.5, 3., 3.5, 4.]))
torch.testing.assert_close(new_output[:t2], output[:t2])
assert new_output[t2] > output[t2]
print(f"Boolean mask, T1: {output[t1]:.1f} -> {new_output[t1]:.1f}")

# SDPA adds float masks to the logits. Adding 0 leaves future keys in the softmax.
float_mask = allowed.float()
before = attend(values, float_mask)[t1]
after = attend(changed, float_mask)[t1]
torch.testing.assert_close(
    torch.stack([before, after]), torch.tensor([3.257, 10.465]), atol=0.001, rtol=0
)
print(f"Float 0/1 mask, T1: {before:.3f} -> {after:.3f}")
