"""Exercise the book's unchanged top-1 transport example on two CPU/Gloo ranks.

Run with PyTorch installed: python scripts/expert-dispatch-smoke.py
No weights, datasets, or credentials are used. This is not a GPU benchmark,
training/autograd test, top-k policy, or distributed fault-recovery test.
"""
from datetime import timedelta
from pathlib import Path
import re
import tempfile

import torch
import torch.distributed as dist
import torch.multiprocessing as mp

ROOT = Path(__file__).resolve().parents[1]
CASES = [([2, 0, 3, 2], [1, 3]), ([], [0, 3]), ([0, 1], [0, 1])]


def worker(rank, rendezvous):
    torch.set_num_threads(1)
    dist.init_process_group(
        "gloo", init_method=f"file://{rendezvous}", rank=rank,
        world_size=2, timeout=timedelta(seconds=30),
    )
    try:
        for locale in ["", "ko/"]:
            page = ROOT / f"src/pages/{locale}chapter-5/expert-parallelism.mdx"
            code = re.findall(r"```python\n(.*?)```", page.read_text(), re.S)[0]
            ns = {}
            exec(compile(code, str(page), "exec"), ns)
            dispatcher = ns["ExpertParallelDispatcher"](dist.group.WORLD, 4)
            for assignments in CASES:
                ids = torch.tensor(assignments[rank], dtype=torch.long)
                tokens = torch.arange(len(ids), dtype=torch.float32) + rank * 100 + 1
                states = torch.stack((tokens, tokens + 0.5), dim=1)
                received, local_ids, recv_counts, permutation, send_counts = dispatcher.dispatch(states, ids)
                expected = {}
                for source, expert_ids in enumerate(assignments):
                    for index, expert in enumerate(expert_ids):
                        if expert // 2 == rank:
                            expected[source * 100 + index + 1] = expert % 2
                assert received.shape == (len(expected), 2)
                assert sum(recv_counts) == len(expected)
                assert sum(send_counts) == len(ids)
                assert set(received[:, 0].tolist()) == set(expected)
                for state, local_id in zip(received, local_ids):
                    assert state[1] == state[0] + 0.5
                    assert local_id.item() == expected[state[0].item()]

                # A deterministic stand-in for each expert. Mirror the payload
                # exchange to verify source association and inverse ordering.
                transformed = received * 2 + local_ids[:, None]
                returned_sorted = torch.empty_like(states)
                dist.all_to_all_single(
                    returned_sorted, transformed,
                    output_split_sizes=send_counts, input_split_sizes=recv_counts,
                )
                restored = torch.empty_like(states)
                restored[permutation] = returned_sorted
                torch.testing.assert_close(restored, states * 2 + (ids % 2)[:, None])
        if rank == 0:
            print("EN/KO: two-rank dispatch, IDs, uneven/zero splits, inverse association passed")
    finally:
        dist.destroy_process_group()


if __name__ == "__main__":
    with tempfile.TemporaryDirectory(prefix="fme-ep-smoke-") as tmp:
        mp.spawn(worker, args=(str(Path(tmp) / "rendezvous"),), nprocs=2, join=True)
