"""Audit continued pre-training exposure by source (Python 3, standard library).

Run the two chapter examples: python token_exposure.py
Audit one run:                python token_exposure.py visits.csv

Input CSV (UTF-8): one row per visit to a source document. Count the targets
that contributed to next-token loss after shifting, truncation and masking.
If a visit was split across packed blocks, sum its fragments into one row.
Keep a stable document_id across repeat visits. For example:

source,document_id,loss_targets
domain,ticket-17,400
replay,manual-9,4000
domain,ticket-17,200

A zero-target visit counts as a visit. A document counts toward coverage
only if at least one visit contributed targets. IDs are counted within each
source. Each target has equal weight. A blank percentage means the entire
run contributed zero targets. Exact distinct counts use memory proportional
to the number of distinct contributing (source, document_id) pairs.
"""

import argparse
import csv
import sys
from collections import defaultdict
from dataclasses import dataclass, field
from pathlib import Path


@dataclass
class Exposure:
    visits: int = 0
    contributing_ids: set = field(default_factory=set)
    loss_targets: int = 0


def read_visits(stream):
    reader = csv.DictReader(stream, strict=True)
    fields = reader.fieldnames or []
    required = {"source", "document_id", "loss_targets"}
    if not required.issubset(fields) or len(fields) != len(set(fields)):
        raise ValueError("use unique column names including source,document_id,loss_targets")
    for row in reader:
        if None in row or None in row.values():
            raise ValueError(f"line {reader.line_num}: field count differs from header")
        source, doc_id = row["source"].strip(), row["document_id"].strip()
        count = row["loss_targets"].strip()
        if not source or not doc_id or not (count.isascii() and count.isdecimal()):
            raise ValueError(f"line {reader.line_num}: expected source, document ID and a nonnegative target count")
        yield source, doc_id, int(count)


def chapter_visits(domain_passes, replay_documents):
    for _ in range(domain_passes):
        for doc_id in range(80):
            yield "domain", doc_id, 400
    for doc_id in range(replay_documents):
        yield "replay", doc_id, 4_000


def summarize(visits):
    sources = defaultdict(Exposure)
    for source, doc_id, targets in visits:
        counts = sources[source]
        counts.visits += 1
        counts.loss_targets += targets
        if targets:
            counts.contributing_ids.add(doc_id)
    total = sum(counts.loss_targets for counts in sources.values())
    for source, counts in sources.items():
        percent = f"{100 * counts.loss_targets / total:.1f}" if total else ""
        yield source, counts.visits, len(counts.contributing_ids), counts.loss_targets, percent


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("visits", nargs="?", type=Path, help="CSV containing one row per document visit")
    args = parser.parse_args()
    if args.visits:
        try:
            with args.visits.open(encoding="utf-8-sig", newline="") as stream:
                runs = [(args.visits.stem, list(summarize(read_visits(stream))))]
        except (ValueError, OSError, csv.Error) as error:
            parser.exit(2, f"{args.visits}: {error}\n")
    else:
        runs = [("one_pass", summarize(chapter_visits(1, 20))),
                ("repeat_domain", summarize(chapter_visits(2, 12)))]

    writer = csv.writer(sys.stdout, lineterminator="\n")
    writer.writerow(("run", "source", "visits", "contributing_documents", "loss_targets", "target_share_pct"))
    for run, rows in runs:
        for row in rows:
            writer.writerow((run, *row))


if __name__ == "__main__":
    main()
