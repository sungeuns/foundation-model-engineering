"""CPU teaching lab: causal copying, an attention ablation, and exact resume.

Python 3.12+, PyTorch 2.15 CPU. No downloads, credentials, or external data.
Run: python causal_lab.py --output /tmp/causal-lab --steps 160 --seed 7
Not a language model benchmark or a distributed training implementation.
"""
import argparse
import copy
import hashlib
import json
import math
from pathlib import Path
import random
import time

import torch
from torch import nn
from torch.nn import functional as F


def digest(value):
    return hashlib.sha256(json.dumps(value, sort_keys=True).encode()).hexdigest()


def corpus():
    # Rotations of a motif are one semantic group. Split groups BEFORE expansion.
    rng, groups = random.Random(20261117), set()
    while len(groups) < 160:
        motif = tuple(rng.sample(range(1, 17), 4))
        groups.add(min(motif[i:] + motif[:i] for i in range(4)))
    groups = sorted(groups, key=digest)
    splits = {"train": groups[:128], "validation": groups[128:144], "test": groups[144:]}
    manifest = {"generator": "distinct-4-cycle-v1", "seed": 20261117,
                "tokenizer": "integer-identity-v1; ids 1..16; 0 unused",
                "provenance": "locally generated synthetic symbols; no personal data",
                "filter": "four distinct symbols; canonical cyclic rotation",
                "mixture": {"distinct-4-cycle": 1.0}, "groups": splits}
    tensors = {name: torch.tensor([(m * 5)[:17] for m in motifs])
               for name, motifs in splits.items()}
    return tensors, manifest


class Decoder(nn.Module):
    def __init__(self, attention=True):
        super().__init__()
        self.tokens = nn.Embedding(17, 32)
        self.positions = nn.Embedding(16, 32)
        self.norm1, self.norm2 = nn.LayerNorm(32), nn.LayerNorm(32)
        self.attention = nn.MultiheadAttention(32, 2, dropout=0.0, batch_first=True)
        self.ffn = nn.Sequential(nn.Linear(32, 64), nn.GELU(), nn.Linear(64, 32))
        self.output = nn.Linear(32, 17)
        # MultiheadAttention boolean masks use True for BLOCKED positions.
        mask = torch.triu(torch.ones(16, 16, dtype=torch.bool), diagonal=1)
        if not attention:
            mask = ~torch.eye(16, dtype=torch.bool)  # self-only ablation
        self.register_buffer("mask", mask)

    def forward(self, ids):
        length = ids.shape[1]
        x = self.tokens(ids) + self.positions(torch.arange(length))
        h = self.norm1(x)
        x = x + self.attention(h, h, h, attn_mask=self.mask[:length, :length],
                               need_weights=False)[0]
        x = x + self.ffn(self.norm2(x))
        return self.output(x)


def loss_sum(model, batch):
    logits = model(batch[:, :-1])  # [B, 16, 17]
    # Four observed symbols form the prompt; score only the 13 repeat targets.
    logits, labels = logits[:, 3:], batch[:, 4:]
    return F.cross_entropy(logits.reshape(-1, 17), labels.reshape(-1), reduction="sum"), labels.numel()


@torch.no_grad()
def evaluate(model, batch):
    model.eval()
    total, count = loss_sum(model, batch)
    return float(total / count)


@torch.no_grad()
def generate(model, prompt, continuation=13):
    """Greedy continuation sees its own predictions, never future targets."""
    model.eval()
    sequence = prompt.clone()
    for _ in range(continuation):
        prediction = model(sequence)[:, -1].argmax(dim=-1, keepdim=True)
        sequence = torch.cat([sequence, prediction], dim=1)
    return sequence


def setup(seed, attention=True):
    torch.manual_seed(seed)
    model = Decoder(attention)
    optimizer = torch.optim.AdamW(model.parameters(), lr=0.003, betas=(0.9, 0.95),
                                  eps=1e-8, weight_decay=0.01)
    sampler = torch.Generator().manual_seed(seed + 1000)
    return model, optimizer, sampler


def advance(model, optimizer, sampler, data, start, end, total_steps):
    model.train()
    trace = []
    for step in range(start, end):
        ids = torch.randint(len(data), (16,), generator=sampler)
        # Schedule uses the FINAL planned budget, including before interruption.
        lr = 0.003 * min((step + 1) / 10, 1.0) * (0.1 + 0.9 * (1 + math.cos(math.pi * step / total_steps)) / 2)
        for group in optimizer.param_groups:
            group["lr"] = lr
        optimizer.zero_grad(set_to_none=True)
        total, count = loss_sum(model, data[ids])
        loss = total / count
        if not torch.isfinite(loss):
            raise RuntimeError("Abort: nonfinite loss")
        loss.backward()
        norm = nn.utils.clip_grad_norm_(model.parameters(), 1.0, error_if_nonfinite=True)
        optimizer.step()
        trace.append({"step": step + 1, "loss_nats_per_target": float(loss.detach()),
                      "gradient_norm_before_clip": float(norm), "lr": lr,
                      "batch_ids": ids.tolist(), "target_tokens": count})
    return trace


def save_checkpoint(path, model, optimizer, sampler, step, config, manifest):
    state = {"model": model.state_dict(), "optimizer": optimizer.state_dict(),
             "torch_rng": torch.get_rng_state(), "sampler_rng": sampler.get_state(),
             "step": step, "target_tokens": step * 16 * 13,
             "data_cursor": "replacement sampler RNG plus global step",
             "config": config, "manifest_hash": digest(manifest),
             "config_hash": digest(config), "scheduler": "formula in advance; step/steps",
             "precision": "CPU float32; no scaler; world size 1"}
    temporary = path.with_suffix(".tmp")
    torch.save(state, temporary)
    temporary.replace(path)
    marker = path.with_suffix(".sha256")
    marker.write_text(hashlib.sha256(path.read_bytes()).hexdigest())


def load_checkpoint(path, config, manifest):
    actual = hashlib.sha256(path.read_bytes()).hexdigest()
    if actual != path.with_suffix(".sha256").read_text():
        raise ValueError("Incomplete or corrupt checkpoint")
    state = torch.load(path, weights_only=True)
    if state["config_hash"] != digest(config) or state["manifest_hash"] != digest(manifest):
        raise ValueError("Configuration or corpus changed")
    model, optimizer, sampler = setup(config["seed"])
    model.load_state_dict(state["model"])
    optimizer.load_state_dict(state["optimizer"])
    sampler.set_state(state["sampler_rng"])
    torch.set_rng_state(state["torch_rng"])
    return model, optimizer, sampler, state["step"]


def run(output, steps=160, seed=7):
    if steps < 20:
        raise ValueError("Use at least 20 steps; learning quality is budget-dependent")
    output.mkdir(parents=True, exist_ok=True)
    torch.set_num_threads(1)
    torch.use_deterministic_algorithms(True)
    data, manifest = corpus()
    config = {"steps": steps, "seed": seed, "batch": 16, "width": 32, "heads": 2,
              "layers": 1, "dtype": "float32", "device": "cpu",
              "code_hash": hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
              "torch_version": str(torch.__version__)}
    (output / "manifest.json").write_text(json.dumps(manifest, indent=2))
    model, optimizer, sampler = setup(seed)
    changed = data["train"][:2, :-1].clone()
    original = model(changed).detach()
    changed[:, 8:] = 1
    assert torch.equal(original[:, :8], model(changed).detach()[:, :8]), "Future leakage"
    initial = evaluate(model, data["validation"])
    start_time = time.perf_counter()
    first = advance(model, optimizer, sampler, data["train"], 0, steps // 2, steps)
    checkpoint = output / "checkpoint.pt"
    save_checkpoint(checkpoint, model, optimizer, sampler, steps // 2, config, manifest)
    tail = advance(model, optimizer, sampler, data["train"], steps // 2, steps, steps)
    expected = copy.deepcopy(model.state_dict())
    resumed, resumed_optimizer, resumed_sampler, cursor = load_checkpoint(checkpoint, config, manifest)
    replay = advance(resumed, resumed_optimizer, resumed_sampler, data["train"], cursor, steps, steps)
    assert tail == replay, "Resume changed batches, loss, or gradients"
    assert all(torch.equal(value, resumed.state_dict()[key]) for key, value in expected.items())
    elapsed = time.perf_counter() - start_time
    ablated, ablated_optimizer, ablated_sampler = setup(seed, attention=False)
    advance(ablated, ablated_optimizer, ablated_sampler, data["train"], 0, steps, steps)
    generated = generate(model, data["test"][:, :4])
    correct = generated[:, 4:] == data["test"][:, 4:]
    result = {"config": config, "parameters": sum(p.numel() for p in model.parameters()),
              "initial_validation_nats": initial,
              "validation_nats": evaluate(model, data["validation"]),
              "test_nats": evaluate(model, data["test"]),
              "self_only_test_nats": evaluate(ablated, data["test"]),
              "greedy_test_token_accuracy": float(correct.float().mean()),
              "greedy_test_sequence_accuracy": float(correct.all(dim=1).float().mean()),
              "example": {"prompt": data["test"][0, :4].tolist(),
                          "generated": generated[0, 4:].tolist(),
                          "expected": data["test"][0, 4:].tolist()},
              "exact_resume": True, "causal_invariance": True,
              "train_and_replay_seconds": elapsed,
              "train_and_replay_target_tokens_per_second": (steps + steps - steps // 2) * 208 / elapsed,
              "nonfinite_count": 0, "mfu": None}
    (output / "trace.json").write_text(json.dumps(first + tail, indent=2))
    (output / "result.json").write_text(json.dumps(result, indent=2))
    return result


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--steps", type=int, default=160)
    parser.add_argument("--seed", type=int, default=7)
    args = parser.parse_args()
    print(json.dumps(run(args.output, args.steps, args.seed), indent=2))
