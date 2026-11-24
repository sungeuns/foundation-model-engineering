"""Synthetic paired-cluster release exercise. Python 3.10+, standard library only.

Foundation Model Engineering, section 17.7
English: https://sungeuns.github.io/foundation-model-engineering/chapter-17/experimental-design-and-uncertainty/#release-lab
Korean: https://sungeuns.github.io/foundation-model-engineering/ko/chapter-17/experimental-design-and-uncertainty/#release-lab

Run: python paired_release.py --scenario uncertain
No real model scores. Fixed-checkpoint, equally weighted independent clusters.
Percentile bootstrap is an approximation, especially with few clusters.
"""
import argparse
import json
import math
import random
from statistics import mean


def fixture(scenario):
    rows = []
    for slice_name in ("target", "retention"):
        for cluster in range(80):
            # Four authored sibling cases; each cluster is an independent unit.
            effect = (1 if cluster % 5 else -1) if slice_name == "target" else 0
            if scenario == "uncertain" and slice_name == "target":
                effect = 1 if cluster % 5 < 3 else -1
            if scenario == "regression" and slice_name == "retention":
                effect = -1
            for case in range(4):
                champion = 1 if case < 2 else 0
                candidate = int(case < 2 + effect)
                rows.append({"cluster_id": f"{slice_name}-{cluster}", "case_id": case,
                             "slice": slice_name, "champion": champion, "candidate": candidate,
                             "exposed": False})
    # This deliberately perfect exposed result must NEVER enter the estimate.
    rows.append({"cluster_id": "exposed-incident", "case_id": 0, "slice": "target",
                 "champion": 0, "candidate": 1, "exposed": True})
    if scenario == "missing":
        rows[0]["candidate"] = None
    return rows


def quantile(values, p):
    values = sorted(values)
    position = (len(values) - 1) * p
    lo, hi = math.floor(position), math.ceil(position)
    return values[lo] + (position - lo) * (values[hi] - values[lo])


def estimate(rows, seed=23, repetitions=4000):
    groups, seen, exposure = {}, set(), {}
    for row in rows:
        key = (row["cluster_id"], row["case_id"])
        if key in seen:
            raise ValueError("Duplicate case ID")
        seen.add(key)
        cluster = row["cluster_id"]
        if cluster in exposure and exposure[cluster] != row["exposed"]:
            raise ValueError("Exposure must apply to the whole cluster")
        exposure[cluster] = row["exposed"]
        if row["exposed"]:
            continue
        if row["champion"] not in (0, 1) or row["candidate"] not in (0, 1):
            raise ValueError("Missing/invalid paired outcome: resolve before promotion")
        groups.setdefault(cluster, []).append(row["candidate"] - row["champion"])
    if len(groups) < 2:
        raise ValueError("Insufficient independent clusters")
    deltas = [mean(groups[key]) for key in sorted(groups)]
    rng = random.Random(seed)
    bootstrap = [mean(rng.choices(deltas, k=len(deltas))) for _ in range(repetitions)]
    return {"clusters": len(deltas), "delta": mean(deltas),
            "lower_95_one_sided": quantile(bootstrap, 0.05),
            "upper_95_one_sided": quantile(bootstrap, 0.95)}


def packet(rows):
    results = {}
    try:
        # Validate exposure and IDs across slices, not only inside each estimate.
        estimate(rows, repetitions=1)
        for name in ("target", "retention"):
            results[name] = estimate([row for row in rows if row["slice"] == name])
    except ValueError as error:
        return {"decision": "Review", "reason": str(error)}
    thresholds = {"target": 0.05, "retention": -0.02}
    failed = [name for name in thresholds if results[name]["upper_95_one_sided"] < thresholds[name]]
    passed = all(results[name]["lower_95_one_sided"] > thresholds[name] for name in thresholds)
    # A separate illustrative zero-event safety sample: not derived from quality rows.
    upper_risk = 1 - 0.05 ** (1 / 1000)
    decision = "Block" if failed else "Pass" if passed and upper_risk < 0.005 else "Review"
    return {"decision": decision, "quality": results, "thresholds": thresholds,
            "safety": {"independent_trials": 1000, "failures": 0, "upper_risk_95": upper_risk,
                       "maximum_risk": 0.005},
            "scope": "synthetic offline gates only; not authorization to deploy",
            "bootstrap_seed": 23, "bootstrap_repetitions": 4000,
            "weighting": "equal cluster mean; paired candidate minus champion"}


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--scenario", choices=["gain", "uncertain", "regression", "missing"], default="gain")
    args = parser.parse_args()
    print(json.dumps(packet(fixture(args.scenario)), indent=2))
