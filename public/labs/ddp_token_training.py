"""A synthetic token classifier for the DDP exercise in section 7.1.

CPU: torchrun --standalone --nproc-per-node=2 ddp_token_training.py
GPU: add --cuda and start one process per available GPU.
Requires PyTorch. Generates its own data; no downloads.
"""
import argparse
import os

import torch
import torch.distributed as dist
from torch import nn
from torch.nn.parallel import DistributedDataParallel
from torch.utils.data import DataLoader, DistributedSampler, TensorDataset


def train(device):
    torch.manual_seed(7)
    model = nn.Sequential(nn.Embedding(256, 64), nn.Linear(64, 128),
                          nn.GELU(), nn.Linear(128, 256)).to(device)
    replicas = DistributedDataParallel(
        model, device_ids=[device.index] if device.type == "cuda" else None,
        gradient_as_bucket_view=True,
    )
    generator = torch.Generator().manual_seed(42)
    inputs = torch.randint(256, (1024, 32), generator=generator)
    data = TensorDataset(inputs, (inputs + 1) % 256)
    sampler = DistributedSampler(data, shuffle=True)
    loader = DataLoader(data, sampler=sampler, batch_size=8)
    optimizer = torch.optim.AdamW(replicas.parameters(), lr=1e-4)
    criterion = nn.CrossEntropyLoss(reduction="sum")

    for epoch in range(3):
        sampler.set_epoch(epoch)
        totals = torch.zeros(2, device=device, dtype=torch.float64)
        for tokens, targets in loader:
            tokens, targets = tokens.to(device), targets.to(device)
            optimizer.zero_grad(set_to_none=True)
            logits = replicas(tokens)
            loss_sum = criterion(logits.flatten(0, 1), targets.flatten())
            # The sampler gives every rank equally many fixed-length rows here.
            (loss_sum / targets.numel()).backward()
            optimizer.step()
            totals[0] += loss_sum.detach().double()
            totals[1] += targets.numel()

        # Losses stay local in DDP. Aggregate token loss and visits separately.
        dist.all_reduce(totals)
        if dist.get_rank() == 0:
            loss, visits = totals.tolist()
            print(f"epoch={epoch} token_visits={int(visits)} loss_per_token={loss/visits:.6f}",
                  flush=True)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--cuda", action="store_true")
    use_cuda = parser.parse_args().cuda
    device = torch.device("cpu")
    if use_cuda:
        device = torch.device("cuda", int(os.environ["LOCAL_RANK"]))
        torch.cuda.set_device(device)
    dist.init_process_group(backend="nccl" if use_cuda else "gloo")
    try:
        train(device)
    finally:
        dist.destroy_process_group()
