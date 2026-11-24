"""Trace reduce-scatter and all-gather with four CPU PyTorch workers.

Foundation Model Engineering, section 7.2
Tested on Linux with CPU PyTorch 2.15.0 and Gloo.
Run: torchrun --standalone --nproc-per-node=4 zero_shards.py
English: https://sungeuns.github.io/foundation-model-engineering/chapter-7/zero-redundancy-optimizer/#zero-shard-ownership
한국어: https://sungeuns.github.io/foundation-model-engineering/ko/chapter-7/zero-redundancy-optimizer/#zero-shard-ownership
"""
import torch
import torch.distributed as dist


def trace():
    rank = dist.get_rank()
    workers = dist.get_world_size()
    if workers != 4:
        raise ValueError("Use four workers for the eight-weight example.")

    # Rank r contributes (r + 1) * sum(w**2) / 2 to the mean objective.
    weights = torch.arange(1, 9, dtype=torch.float32, requires_grad=True)
    local_loss = (rank + 1) * weights.square().sum() / 2
    gradient, = torch.autograd.grad(local_loss, weights)

    mean_shard = torch.empty(2, dtype=weights.dtype)
    dist.reduce_scatter_tensor(mean_shard, gradient, op=dist.ReduceOp.SUM)
    mean_shard.div_(workers)
    owned_weights = weights.detach().chunk(workers)[rank]
    updated_shard = owned_weights - 0.1 * mean_shard

    reconstructed = torch.empty_like(weights)
    dist.all_gather_into_tensor(reconstructed, updated_shard)
    # Mean of the four coefficients is 2.5. Compare with an unsharded SGD step.
    expected = weights.detach() - 0.1 * (2.5 * weights.detach())
    torch.testing.assert_close(reconstructed, expected)
    if rank == 2:
        print(f"rank 2 mean gradient: {mean_shard.tolist()}")
        print(f"rank 2 updated weights: {updated_shard.tolist()}")
        print(f"gathered weights: {reconstructed.tolist()}")


if __name__ == "__main__":
    dist.init_process_group("gloo")
    try:
        trace()
    finally:
        dist.destroy_process_group()
