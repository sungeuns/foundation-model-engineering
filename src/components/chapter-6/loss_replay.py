"""Reproduce the two traces in section 6.3. Run `python loss_replay.py`.

Tested with PyTorch 2.15.0 on CPU. Each example has one input, one target and
one fixed scalar weight. We measure a gradient but never update the weight.
"""

import csv
import sys

import torch
from torch.nn.functional import cross_entropy


def replay(suspect_feature, suspect_target):
    weight = torch.tensor(2.0, dtype=torch.float64, requires_grad=True)
    rows = []
    for sample in 'ABCDE':
        feature, target = (suspect_feature, suspect_target) if sample == 'C' else (1, 1)
        logits = torch.stack((weight.new_zeros(()), weight * feature)).reshape(1, 2)
        loss = cross_entropy(logits, torch.tensor([target]))
        (gradient,) = torch.autograd.grad(loss, weight)
        gap = (logits[0, 1] - logits[0, 0]).item()
        rows.append((sample, feature, target, gap, loss.item(), gradient.item()))
    return rows


if __name__ == '__main__':
    target_changed = replay(suspect_feature=1, suspect_target=0)
    feature_changed = replay(suspect_feature=-1, suspect_target=1)
    torch.testing.assert_close(
        torch.tensor([row[-2:] for row in target_changed], dtype=torch.float64),
        torch.tensor([row[-2:] for row in feature_changed], dtype=torch.float64),
        rtol=0, atol=1e-12,
    )
    writer = csv.writer(sys.stdout)
    writer.writerow(('replay', 'sample', 'feature', 'target', 'logit_gap', 'nll', 'dw'))
    for name, rows in [('target_changed', target_changed), ('feature_changed', feature_changed)]:
        for row in rows:
            writer.writerow((name, *row))
