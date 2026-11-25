"""Audit which examples reach a distributed evaluation metric.

In a fresh CPU environment:
    python -m pip install torch==2.15.0 --index-url https://download.pytorch.org/whl/cpu
    python ddp_sampler_audit.py

The five predictions are fixed. This measures PyTorch's sampler and loader
with both rank assignments in one process on CPU. No model or network needed.
"""

# SPDX-License-Identifier: MIT
from collections import Counter
import json
import platform

import torch
from torch.utils.data import DataLoader, DistributedSampler, TensorDataset


def score(rows):
    return {"correct": sum(label == prediction for _, label, prediction in rows),
            "total": len(rows)}


def summarize(visits, expected_labels):
    """Count every visit, then score each ID once only if coverage is complete."""
    seen = {}
    counts = Counter()
    for sample_id, label, prediction in visits:
        if sample_id not in expected_labels or label != expected_labels[sample_id]:
            raise ValueError(f"Unexpected sample ID or label: {sample_id}, {label}")
        if sample_id in seen and seen[sample_id] != (label, prediction):
            raise ValueError(f"Conflicting results for repeated ID {sample_id}")
        seen[sample_id] = (label, prediction)
        counts[sample_id] += 1

    missing = sorted(expected_labels.keys() - seen.keys())
    unique_rows = [(sample_id, label, pred) for sample_id, (label, pred) in seen.items()]
    return {
        "visit_score": score(visits),
        "missing_ids": missing,
        "repeated_ids": sorted(sample_id for sample_id, count in counts.items() if count > 1),
        "full_dataset_score": None if missing else score(unique_rows),
    }


def run(dataset, expected_labels, replicas, sampler_drop_last, loader_drop_last):
    ranks = []
    visits = []
    for rank in range(replicas):
        sampler = None
        if replicas > 1:
            sampler = DistributedSampler(dataset, num_replicas=replicas, rank=rank,
                                         shuffle=False, drop_last=sampler_drop_last)
        loader = DataLoader(dataset, batch_size=2, sampler=sampler,
                            num_workers=0, drop_last=loader_drop_last)
        # With shuffling off, listing these assignments and iterating the loader
        # produce the same sampler sequence. The loader may discard its tail.
        assigned = list(loader.sampler)
        batches = []
        rank_visits = []
        for sample_ids, labels, predictions in loader:
            batches.append(sample_ids.tolist())
            rank_visits.extend(zip(sample_ids.tolist(), labels.tolist(), predictions.tolist()))
        ranks.append({"rank": rank, "sampler_ids": assigned, "batches": batches,
                      "visit_score": score(rank_visits)})
        visits.extend(rank_visits)
    return {
        "replicas": replicas,
        "sampler": "SequentialSampler" if replicas == 1 else "DistributedSampler",
        "sampler_drop_last": sampler_drop_last,
        "loader_drop_last": loader_drop_last,
        "ranks": ranks,
        **summarize(visits, expected_labels),
    }


def main():
    labels = [0, 1, 0, 1, 0]
    predictions = [1, 1, 0, 1, 0]
    ids = list(range(len(labels)))
    dataset = TensorDataset(torch.tensor(ids), torch.tensor(labels), torch.tensor(predictions))
    expected_labels = dict(zip(ids, labels))
    result = {
        "python": platform.python_version(), "torch": torch.__version__,
        "torch_git_revision": torch.version.git_version,
        "device": "cpu", "processes": 1, "num_workers": 0,
        "batch_size_per_rank": 2, "shuffle": False,
        "sample_ids": ids, "labels": labels, "predictions": predictions,
        "runs": {
            "unsharded": run(dataset, expected_labels, 1, None, False),
            "padded": run(dataset, expected_labels, 2, False, False),
            "sampler_drop_last": run(dataset, expected_labels, 2, True, False),
            "loader_drop_last": run(dataset, expected_labels, 2, False, True),
        },
    }
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
