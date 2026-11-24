"""Render the three controlled inputs used in §11.1 with Pillow 13.0.0.

Run from a checkout with `python scripts/generate-receipt-fixtures.py`.
Pass --bundle to package the originals with their verified CPU run.
All text is authored for this example. Pillow supplies the font.
"""

import argparse
from hashlib import sha256
import json
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile, ZipInfo

from PIL import Image, ImageDraw, ImageFont


PROJECT = Path(__file__).resolve().parents[1]
DESTINATION = PROJECT / "src/assets/images/chapter-11"
LABS = PROJECT / "public/labs"


def receipt(total):
    image = Image.new("RGB", (512, 384), "#fbfaf5")
    draw = ImageDraw.Draw(image)
    ink = "#242420"

    def line(x, y, text, size):
        draw.text((x, y), text, font=ImageFont.load_default(size=size), fill=ink)

    line(36, 26, "Field Stationery", 37)
    line(37, 83, "Sales receipt", 22)
    draw.line((36, 129, 476, 129), fill=ink, width=2)
    line(36, 153, "Drawing paper", 25)
    line(375, 153, "1 pack", 25)
    line(36, 201, "Pencils", 25)
    line(375, 201, "1 box", 25)
    draw.line((36, 264, 476, 264), fill=ink, width=2)
    if total is not None:
        line(36, 282, f"Total {total}", 42)
    return image


def build_bundle(images):
    record = LABS / "2026-11/receipt-grounding-cpu.json"
    cases = json.loads(record.read_text())["cases"]
    recorded = {case["file"]: case["sha256"] for case in cases}
    current = {image.name: sha256(image.read_bytes()).hexdigest() for image in images}
    if current != recorded:
        raise ValueError("The published run must correspond to these exact PNGs.")

    files = [*images, LABS / "receipt_grounding.py", record, PROJECT / "LICENSE"]
    with ZipFile(record.with_name("receipt-grounding.zip"), "w") as archive:
        for path in files:
            entry = ZipInfo(path.name, date_time=(2026, 11, 25, 0, 0, 0))
            entry.external_attr = 0o100644 << 16
            archive.writestr(entry, path.read_bytes(), compress_type=ZIP_DEFLATED)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--bundle", action="store_true")
    args = parser.parse_args()
    images = []
    for filename, total in [("receipt-a", "31.50"), ("receipt-b", "42.00"), ("receipt-missing", None)]:
        path = DESTINATION / f"{filename}.png"
        receipt(total).save(path)
        images.append(path)
    if args.bundle:
        build_bundle(images)
