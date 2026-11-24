"""Trace top-1 expert dispatch and the return trip on two local CPU/Gloo ranks.

Run: torchrun --standalone --nproc-per-node=2 expert_dispatch.py
Tested on Linux with CPU PyTorch 2.15.0. All inputs are defined below.
"""
from datetime import timedelta
import os

import torch
import torch.distributed as dist


class ExpertParallelDispatcher:
    def __init__(self, ep_group, num_total_experts):
        self.ep_group = ep_group
        self.world_size = dist.get_world_size(ep_group)
        self.rank = dist.get_rank(ep_group)
        if num_total_experts <= 0 or num_total_experts % self.world_size:
            raise ValueError("Each rank must own the same positive number of experts.")
        self.local_experts = num_total_experts // self.world_size

    def dispatch(self, hidden_states, expert_indices):
        """Send one state row and one global expert ID per token to its owner."""
        destinations = expert_indices // self.local_experts
        permutation = torch.argsort(destinations, stable=True)

        # Each rank sends a row of the count matrix and receives a column.
        send_counts = torch.bincount(destinations, minlength=self.world_size)
        recv_counts = torch.empty_like(send_counts)
        dist.all_to_all_single(recv_counts, send_counts, group=self.ep_group)
        sends, receives = send_counts.tolist(), recv_counts.tolist()

        received = hidden_states.new_empty((sum(receives), hidden_states.size(1)))
        received_ids = expert_indices.new_empty(sum(receives))
        for output, payload in ((received, hidden_states), (received_ids, expert_indices)):
            dist.all_to_all_single(
                output, payload[permutation], output_split_sizes=receives,
                input_split_sizes=sends, group=self.ep_group,
            )
        return received, received_ids % self.local_experts, receives, permutation, sends

    def combine(self, outputs, receives, permutation, sends):
        """Reverse the splits, then scatter the sorted rows into their source slots."""
        returned = outputs.new_empty((sum(sends), outputs.size(1)))
        dist.all_to_all_single(
            returned, outputs, output_split_sizes=sends, input_split_sizes=receives,
            group=self.ep_group,
        )
        restored = torch.empty_like(returned)
        restored[permutation] = returned
        return restored


def run_case(dispatcher, assignments):
    rank = dispatcher.rank
    expert_ids = torch.tensor(assignments[rank], dtype=torch.long)
    # The first coordinate identifies the source token. A second coordinate
    # checks that we move a whole state row, including when the rank has zero rows.
    tokens = torch.arange(len(expert_ids), dtype=torch.float32) + 100 * rank + 1
    states = torch.stack((tokens, tokens + 0.5), dim=1)
    received, local_ids, receives, permutation, sends = dispatcher.dispatch(states, expert_ids)
    global_ids = rank * dispatcher.local_experts + local_ids

    # Construct the expected arrivals independently from the ownership map.
    expected_arrivals = [
        (100 * source + index + 1, expert)
        for source, experts in enumerate(assignments)
        for index, expert in enumerate(experts)
        if expert // dispatcher.local_experts == rank
    ]
    received_tokens = received[:, 0].int().tolist()
    assert list(zip(received_tokens, global_ids.tolist())) == expected_arrivals
    torch.testing.assert_close(received[:, 1], received[:, 0] + 0.5, rtol=0, atol=0)

    # A distinct offset for each expert makes routing errors visible.
    outputs = received + 1000 * global_ids[:, None]
    restored = dispatcher.combine(outputs, receives, permutation, sends)
    torch.testing.assert_close(restored, states + 1000 * expert_ids[:, None], rtol=0, atol=0)
    return (
        f"rank {rank}: send={sends} receive={receives}\n"
        f"  received tokens={received_tokens} experts={global_ids.tolist()}\n"
        f"  source tokens={tokens.int().tolist()} restored values={restored[:, 0].int().tolist()}"
    )


def main():
    if os.environ.get("WORLD_SIZE") != "2":
        raise SystemExit("Run: torchrun --standalone --nproc-per-node=2 expert_dispatch.py")
    torch.set_num_threads(1)
    dist.init_process_group("gloo", timeout=timedelta(seconds=30))
    try:
        dispatcher = ExpertParallelDispatcher(dist.group.WORLD, num_total_experts=4)
        cases = [
            ("six tokens", ([2, 0, 3, 2], [1, 3])),
            ("rank 0 has no input", ([], [0, 3])),
            ("rank 1 receives no tokens", ([0, 1], [0, 1])),
        ]
        for name, assignments in cases:
            summary = run_case(dispatcher, assignments)
            # Collect the two local reports solely to print them in rank order.
            reports = [None, None] if dispatcher.rank == 0 else None
            dist.gather_object(summary, reports, dst=0)
            if dispatcher.rank == 0:
                print(name, *reports, sep="\n", flush=True)
    finally:
        dist.destroy_process_group()


if __name__ == "__main__":
    main()
