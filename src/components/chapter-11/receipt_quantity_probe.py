"""Run beside the files extracted from the receipt-grounding ZIP in section 11.1.

Use the Python packages listed in receipt_grounding.py. This probe prints a JSON
record of the three quantity edits and their model outputs. It writes the images
in a temporary directory so that the original receipts remain available.
"""

# SPDX-License-Identifier: MIT
import json
from pathlib import Path
from tempfile import TemporaryDirectory

from PIL import Image, ImageDraw, ImageFont



def quantity_image(original, paper, pencils):
    edited = original.copy()
    draw = ImageDraw.Draw(edited)
    font = ImageFont.load_default(size=25)
    for top, digit in ((153, paper), (201, pencils)):
        if digit != 1:
            draw.rectangle((375, top, 390, top + 25), fill=original.getpixel((0, 0)))
            draw.text((375, top), str(digit), font=font, fill="#242420")
    return edited


def main():
    from receipt_grounding import run_images

    bundle = Path(__file__).resolve().parent
    cases = [
        ("receipt-a.png", 7, 1),
        ("receipt-b.png", 1, 8),
        ("receipt-missing.png", 7, 8),
    ]
    with TemporaryDirectory() as tmp, Image.open(bundle / "receipt-missing.png") as original:
        directory = Path(tmp)
        for filename, paper, pencils in cases:
            quantity_image(original, paper, pencils).save(directory / filename)
        report = run_images(directory)
    for measured, (filename, paper, pencils) in zip(report["cases"], cases, strict=True):
        assert measured["file"] == filename
        measured.update(paper_packs=paper, pencil_boxes=pencils)
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
