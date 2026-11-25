"""Run from the extracted receipt-grounding ZIP, using its pinned CPU packages.

Measure both possible item orders on each of the four receipts with no total.
Each swapped input moves the existing row pixels, including the quantity and
unit, without drawing new text. The JSON records the PNG hashes and raw outputs.
"""

# SPDX-License-Identifier: MIT
import json
from pathlib import Path
from tempfile import TemporaryDirectory

from PIL import Image

from receipt_quantity_probe import quantity_image


def swap_rows(image):
    # Each full-width, 48-pixel band encloses one item and its quantity.
    top = (0, 145, image.width, 193)
    bottom = (0, 193, image.width, 241)
    swapped = image.copy()
    swapped.paste(image.crop(bottom), top)
    swapped.paste(image.crop(top), bottom)
    return swapped


def write_inputs(blank_image, output_directory):
    """Save all eight PNGs and return (filename, paper packs, pencil boxes, order)."""
    labels = []
    for paper, pencils in [(1, 1), (7, 1), (1, 8), (7, 8)]:
        original = quantity_image(blank_image, paper, pencils)
        for order, image in [("paper-first", original), ("pencils-first", swap_rows(original))]:
            name = f"paper-{paper}-pencils-{pencils}-{order}.png"
            image.save(output_directory / name)
            labels.append((name, paper, pencils, order))
    return labels


def main():
    from receipt_grounding import run_images

    bundle = Path(__file__).resolve().parent
    with TemporaryDirectory() as tmp, Image.open(bundle / "receipt-missing.png") as blank:
        directory = Path(tmp)
        labels = write_inputs(blank, directory)
        report = run_images(directory, [entry[0] for entry in labels])
    for row, (name, paper, pencils, order) in zip(report["cases"], labels, strict=True):
        assert row["file"] == name
        row.update(paper_packs=paper, pencil_boxes=pencils, row_order=order)
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
