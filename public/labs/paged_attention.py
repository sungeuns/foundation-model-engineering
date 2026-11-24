"""Trace one decode query through a KV block table. Run with CPU PyTorch.

Foundation Model Engineering, section 12.2
English: https://sungeuns.github.io/foundation-model-engineering/chapter-12/paged-attention-vllm/#paged-kv-addresses
Korean: https://sungeuns.github.io/foundation-model-engineering/ko/chapter-12/paged-attention-vllm/#paged-kv-addresses
"""
import torch
from torch.nn.functional import scaled_dot_product_attention


def gather_kv(pool, block_table, length):
    """pool: [blocks, slots, 2 (K and V), heads, head_dim]. One nonempty request."""
    block_count, block_size = pool.shape[:2]
    if length < 1:
        raise ValueError("the query needs at least one valid key")
    needed = (length + block_size - 1) // block_size
    if len(block_table) < needed:
        raise ValueError(f"{length} tokens need {needed} block entries")
    active = block_table[:needed]  # unused capacity in a wider table is allowed
    if any(type(b) is not int or not 0 <= b < block_count for b in active):
        raise ValueError("active table entry is not a valid physical block ID")

    positions = torch.arange(length, device=pool.device)
    blocks = torch.tensor(active, device=pool.device)[positions // block_size]
    rows = pool[blocks, positions % block_size]
    keys, values = rows.unbind(dim=1)
    # [length, heads, head_dim] -> [1, heads, length, head_dim]
    return keys.transpose(0, 1).unsqueeze(0), values.transpose(0, 1).unsqueeze(0)


def main():
    # Same initial mapping as request A in the diagram. Block 1 is not ours.
    pool = torch.zeros(3, 4, 2, 1, 1, dtype=torch.float64)
    pool[:, :, 1, 0, 0] = torch.tensor([
        [1, 2, 3, 4], [900, 900, 900, 900], [101, 700, 700, 700]
    ])
    query = torch.zeros(1, 1, 1, 1, dtype=pool.dtype)
    table = [0, 2]
    keys, values = gather_kv(pool, table, 5)
    dense_values = torch.tensor([1, 2, 3, 4, 101], dtype=pool.dtype).view(1, 1, 5, 1)
    torch.testing.assert_close(values, dense_values)  # checks logical token order
    dense = scaled_dot_product_attention(query, torch.zeros_like(dense_values), dense_values)
    paged = scaled_dot_product_attention(query, keys, values)
    torch.testing.assert_close(paged, dense)
    assert abs(paged.item() - 22.2) < 1e-10

    # These three tail slots and the unused table suffix do not belong to the prefix.
    pool[2, 1:, 1] = 9999
    keys, values = gather_kv(pool, table + [-1], 5)
    torch.testing.assert_close(scaled_dot_product_attention(query, keys, values), dense)
    for invalid in ([0], [0, -1], [0, 3]):
        try:
            gather_kv(pool, invalid, 5)
        except ValueError:
            continue
        raise AssertionError(f"accepted invalid active block table {invalid}")
    print(f"Five logical values: {dense_values.flatten().tolist()}")
    print(f"Dense and paged result: {paged.item():.1f}")


if __name__ == "__main__":
    main()
