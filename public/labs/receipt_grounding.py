"""Read a printed Total line with a fixed CPU vision-language model.

English lesson https://sungeuns.github.io/foundation-model-engineering/chapter-11/vision-language-bridges/#receipt-grounding
한국어 실습 https://sungeuns.github.io/foundation-model-engineering/ko/chapter-11/vision-language-bridges/#receipt-grounding

Download and extract the three receipt PNGs linked from the lesson. In a fresh
Python 3.12 environment on Linux x86-64, run the following from the folder
containing receipt-a.png, receipt-b.png and receipt-missing.png:

    python -m pip install "torch==2.15.0" --index-url https://download.pytorch.org/whl/cpu
    python -m pip install "transformers==5.24.1" "pillow==13.0.0"
    python receipt_grounding.py . > measured.json

The first run downloads the pinned processor, tokenizer and 513 MB of model
weights. Only RGB pixels and the shared text prompt are passed to the model.
The JSON preserves leading whitespace in the decoded responses and records the
generated token IDs, including the end-of-utterance token.

The Hugging Face Smol Models Research team published the checkpoint under
Apache 2.0. The license below covers this exercise's Python code.
https://huggingface.co/HuggingFaceTB/SmolVLM-256M-Instruct/blob/d039ab0d4b9311b617e8ffec1d06c8464364aeb3/README.md
"""

# SPDX-License-Identifier: MIT
# MIT License
#
# Copyright (c) 2026 Seongeun So
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.

import argparse
import hashlib
import json
import platform
from pathlib import Path

import PIL
import torch
import transformers
from PIL import Image
from transformers import AutoModelForImageTextToText, AutoProcessor

MODEL = "HuggingFaceTB/SmolVLM-256M-Instruct"
REVISION = "d039ab0d4b9311b617e8ffec1d06c8464364aeb3"
PROMPT = ("Read the printed Total line. Copy that line exactly. "
          "If the Total line is missing, answer MISSING.")
FILES = ("receipt-a.png", "receipt-b.png", "receipt-missing.png")


def run_images(directory, filenames=FILES):
    """Evaluate a sequence of PNGs using the recorded processor and decoding settings."""
    torch.set_num_threads(2)
    if torch.get_num_interop_threads() != 1:
        torch.set_num_interop_threads(1)
    torch.manual_seed(0)
    processor = AutoProcessor.from_pretrained(
        MODEL, revision=REVISION, token=False, backend="pil",
    )
    model = AutoModelForImageTextToText.from_pretrained(
        MODEL, revision=REVISION, token=False, dtype=torch.float32,
        attn_implementation="eager", use_safetensors=True,
    ).to("cpu").eval()
    messages = [{
        "role": "user",
        "content": [{"type": "image"}, {"type": "text", "text": PROMPT}],
    }]
    formatted = processor.apply_chat_template(
        messages, tokenize=False, add_generation_prompt=True,
    )
    result = {
        "model": MODEL,
        "revision": REVISION,
        "formatted_prompt": formatted,
        "python": platform.python_version(),
        "torch": torch.__version__,
        "transformers": transformers.__version__,
        "pillow": PIL.__version__,
        "device": "cpu",
        "dtype": "float32",
        "num_threads": torch.get_num_threads(),
        "interop_threads": torch.get_num_interop_threads(),
        "attention_implementation": "eager",
        "processor": type(processor.image_processor).__name__,
        "preprocessing": processor.image_processor.to_dict(),
        "image_tokens_per_view": processor.image_seq_len,
        "do_sample": False,
        "num_beams": 1,
        "max_new_tokens": 32,
        "cases": [],
    }
    for name in filenames:
        path = directory / name
        with Image.open(path) as image:
            inputs = processor(text=formatted, images=[image.convert("RGB")], return_tensors="pt")
        with torch.inference_mode():
            output = model.generate(**inputs, do_sample=False, num_beams=1, max_new_tokens=32)
        token_count = inputs["input_ids"].shape[1]
        tokens = output[0, token_count:]
        image_tokens = inputs["input_ids"] == model.config.image_token_id
        case = {
            "file": name,
            "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
            "pixel_values_shape": list(inputs["pixel_values"].shape),
            "prompt_tokens": token_count,
            "image_tokens": image_tokens.sum().item(),
            "generated_ids": tokens.tolist(),
            "raw_text": processor.decode(
                tokens, skip_special_tokens=True, clean_up_tokenization_spaces=False,
            ),
            "including_special_tokens": processor.decode(
                tokens, skip_special_tokens=False, clean_up_tokenization_spaces=False,
            ),
        }
        result["cases"].append(case)
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("images", type=Path)
    args = parser.parse_args()
    print(json.dumps(run_images(args.images), ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
