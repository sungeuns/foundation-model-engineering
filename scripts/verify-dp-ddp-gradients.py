"""Verify the §7.1 gathered loss and masked DDP updates on CPU with PyTorch 2.15.

Run: python verify-dp-ddp-gradients.py
The gathered-output check uses autograd on one CPU. The distributed check uses
two real local CPU processes with Gloo. No model or dataset download is needed.

English: https://sungeuns.github.io/foundation-model-engineering/chapter-7/data-parallelism/#ddp-valid-targets
한국어: https://sungeuns.github.io/foundation-model-engineering/ko/chapter-7/data-parallelism/#ddp-valid-targets
"""

import tempfile
from pathlib import Path

import torch
import torch.distributed as dist
import torch.multiprocessing as mp
from torch import nn
from torch.nn.parallel import DistributedDataParallel


def check_gathered_loss():
    weight = torch.tensor(1.0, requires_grad=True, dtype=torch.float64)
    first, second = weight.clone(), weight.clone()
    first.retain_grad()
    second.retain_grad()
    predictions = torch.stack([first, second])
    targets = torch.tensor([0.0, 4.0], dtype=weight.dtype)
    ((predictions - targets).square() / 2).mean().backward()
    result = (first.grad.item(), second.grad.item(), weight.grad.item())
    assert result == (0.5, -1.5, -1.0), result
    print(f"Gathered mean: contributions={result[:2]}, gradient={result[2]}", flush=True)


def unsharded_step(targets, valid):
    weight = nn.Parameter(torch.tensor(1.0, dtype=targets.dtype))
    if not valid.any():
        return None, weight.item()
    optimizer = torch.optim.SGD([weight], lr=0.5)
    loss = (weight - targets[valid]).square().mean() / 2
    loss.backward()
    optimizer.step()
    return weight.grad.item(), weight.item()


def ddp_step(net, targets, valid, total, *, rank_mean):
    # Each comparison starts at the same weight with a fresh SGD optimizer.
    weight = net.module.weight
    with torch.no_grad():
        weight.fill_(1.0)
    optimizer = torch.optim.SGD(net.parameters(), lr=0.5)
    optimizer.zero_grad(set_to_none=True)
    if total == 0:
        return None, weight.item()  # All ranks skip before the DDP forward.

    predictions = net(torch.ones_like(targets))
    losses = (predictions - targets).square() / 2
    local_sum = losses[valid].sum()  # Differentiable zero when this rank has no targets.
    if rank_mean:
        # Deliberately flawed baseline: give an empty rank a zero contribution.
        loss = local_sum / max(1, valid.sum().item())
    else:
        loss = local_sum * dist.get_world_size() / total
    loss.backward()
    optimizer.step()
    return weight.grad.item(), weight.item()


def check_rank(rank, rendezvous_file):
    dist.init_process_group("gloo", init_method=rendezvous_file, rank=rank, world_size=2)
    try:
        targets = torch.tensor([[0., 0., 0.], [4., 4., 4.]], dtype=torch.float64)
        net = DistributedDataParallel(nn.Linear(1, 1, bias=False, dtype=targets.dtype))
        for counts, expected_local in [((1, 1), -1.), ((1, 3), -1.),
                                       ((0, 3), -1.5), ((0, 0), None)]:
            valid = torch.arange(3) < torch.tensor(counts).reshape(2, 1)
            local_targets = targets[rank].reshape(3, 1)
            local_valid = valid[rank].reshape(3, 1)
            count = local_valid.sum()
            dist.all_reduce(count)
            total = count.item()
            local = ddp_step(net, local_targets, local_valid, total, rank_mean=True)
            token = ddp_step(net, local_targets, local_valid, total, rank_mean=False)
            reference = unsharded_step(targets, valid)
            assert token == reference, (rank, counts, token, reference)
            expected_weight = 1.0 if expected_local is None else 1.0 - 0.5 * expected_local
            assert local == (expected_local, expected_weight), (rank, counts, local)
            if rank == 0:
                print(f"Valid targets {counts}, (gradient, weight): "
                      f"rank mean={local}, token mean={token}, unsharded={reference}", flush=True)
    finally:
        dist.destroy_process_group()


if __name__ == "__main__":
    check_gathered_loss()
    with tempfile.TemporaryDirectory() as folder:
        rendezvous = (Path(folder) / "rendezvous").as_uri()
        mp.spawn(check_rank, args=(rendezvous,), nprocs=2, join=True)
