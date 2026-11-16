"""Meaningful numerical checks for the downloadable teaching labs."""
import importlib.util
from pathlib import Path
import tempfile
import unittest
import sys
sys.dont_write_bytecode = True

ROOT = Path(__file__).resolve().parents[1]


def load(name):
    spec = importlib.util.spec_from_file_location(name, ROOT / "public/labs" / f"{name}.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


paired = load("paired_release")
causal = load("causal_lab")
torch = causal.torch


class ExpertiseLabs(unittest.TestCase):
    def test_decisions(self):
        for scenario, expected in [("gain", "Pass"), ("uncertain", "Review"),
                                   ("regression", "Block"), ("missing", "Review")]:
            self.assertEqual(paired.packet(paired.fixture(scenario))["decision"], expected)

    def test_clusters_do_not_gain_precision_by_copying_siblings(self):
        rows = [r for r in paired.fixture("gain") if r["slice"] == "target"]
        replicated = [dict(row, case_id=row["case_id"] + copy * 10)
                      for copy in range(5) for row in rows]
        self.assertEqual(paired.estimate(rows), paired.estimate(replicated))
        self.assertEqual(paired.estimate(rows), paired.estimate([r for r in rows if not r["exposed"]]))
        with self.assertRaises(ValueError):
            paired.estimate(rows + [rows[0]])

    def test_exposure_is_cluster_wide(self):
        rows = paired.fixture("gain")
        rows.append(dict(rows[0], case_id=99, exposed=True, slice="retention"))
        self.assertEqual(paired.packet(rows)["decision"], "Review")

    def test_unequal_token_gradient_and_update(self):
        # Two simulated ranks have 2 and 7 valid scalar regression targets.
        targets = torch.arange(9, dtype=torch.float64)
        def gradient(kind):
            weight = torch.tensor(0.5, dtype=torch.float64, requires_grad=True)
            losses = (weight - targets).square()
            if kind == "reference":
                objective = losses.mean()
            elif kind == "wrong":
                objective = (losses[:2].mean() + losses[2:].mean()) / 2
            else:
                # Average of per-rank gradients of R*S_r/N.
                objective = (2 * losses[:2].sum() / 9 + 2 * losses[2:].sum() / 9) / 2
            objective.backward()
            return weight.grad.clone(), weight.detach() - 0.01 * weight.grad
        reference, correct, wrong = map(gradient, ("reference", "correct", "wrong"))
        for a, b in zip(reference, correct):
            torch.testing.assert_close(a, b, rtol=0, atol=1e-14)
        self.assertGreater(abs(float(reference[0] - wrong[0])), 1)

    def test_causal_learning_resume_and_corruption(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory)
            result = causal.run(path)
            self.assertTrue(result["exact_resume"])
            self.assertTrue(result["causal_invariance"])
            self.assertLess(result["test_nats"], result["self_only_test_nats"])
            _, manifest = causal.corpus()
            groups = [set(map(tuple, group)) for group in manifest["groups"].values()]
            self.assertFalse(groups[0] & groups[1] or groups[0] & groups[2] or groups[1] & groups[2])
            checkpoint = path / "checkpoint.pt"
            checkpoint.write_bytes(checkpoint.read_bytes() + b"corrupt")
            with self.assertRaisesRegex(ValueError, "corrupt"):
                causal.load_checkpoint(checkpoint, result["config"], manifest)


if __name__ == "__main__":
    unittest.main()
