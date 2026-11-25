"""Verify the §7.1 reductions on CPU with PyTorch 2.15.

Run: python verify-dp-ddp-gradients.py
The gathered-output check uses autograd on one CPU. The distributed check uses
two real local CPU processes with Gloo. No model or dataset download is needed.
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


def check_rank(rank, rendezvous_file):
    dist.init_process_group("gloo", init_method=rendezvous_file, rank=rank, world_size=2)
    try:
        for shards, expected in [(([0.0], [4.0]), -1.0), (([0.0], [4.0] * 3), -2.0)]:
            targets = torch.tensor(shards[rank], dtype=torch.float64).reshape(-1, 1)
            model = nn.Linear(1, 1, bias=False, dtype=torch.float64)
            with torch.no_grad():
                model.weight.fill_(1.0)
            net = DistributedDataParallel(model)
            optimizer = torch.optim.SGD(net.parameters(), lr=0.5)

            count = torch.tensor(targets.numel(), dtype=torch.int64)
            dist.all_reduce(count)
            predictions = net(torch.ones_like(targets))
            local_sum = ((predictions - targets).square() / 2).sum()
            (local_sum * dist.get_world_size() / count.item()).backward()
            gradient = model.weight.grad.item()
            assert gradient == expected, (rank, gradient, expected)
            optimizer.step()
            weight = model.weight.item()
            assert weight == 1.0 - 0.5 * expected
            if rank == 0:
                print(f"DDP: {count.item()} examples, gradient={gradient}, weight={weight}", flush=True)
    finally:
        dist.destroy_process_group()


if __name__ == "__main__":
    check_gathered_loss()
    with tempfile.TemporaryDirectory() as folder:
        rendezvous = (Path(folder) / "rendezvous").as_uri()
        mp.spawn(check_rank, args=(rendezvous,), nprocs=2, join=True)
