"""Measure a sample-rate labeling error on one real recording with Whisper.

English: https://sungeuns.github.io/foundation-model-engineering/chapter-11/audio-and-speech-integration/#whisper-sample-rate
한국어: https://sungeuns.github.io/foundation-model-engineering/ko/chapter-11/audio-and-speech-integration/#whisper-sample-rate

You need Python 3.12, ffmpeg and ffprobe on PATH. In a fresh environment:
    python -m pip install "torch==2.15.0" --index-url https://download.pytorch.org/whl/cpu
    python -m pip install "transformers==5.24.1"
    python whisper_sample_rate.py

The script fetches OpenAI's jfk.flac test fixture and a pinned 151 MB model.
The book does not distribute the recording. Use --show-transcripts to inspect
both complete local decodes on stderr. For offline use, first save the fixture
from AUDIO_URL below as jfk.flac and populate the model cache, then run:
    HF_HUB_OFFLINE=1 python whisper_sample_rate.py --audio jfk.flac

The JSON captures short transcript excerpts and hashes of the full outputs.
"""

# SPDX-License-Identifier: MIT
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
import subprocess
import sys
from pathlib import Path
from urllib.request import urlopen

import numpy as np
import torch
import transformers
from huggingface_hub import hf_hub_download
from transformers import WhisperFeatureExtractor, WhisperForConditionalGeneration, WhisperTokenizer

MODEL = "openai/whisper-tiny.en"
REVISION = "87c7102498dcde7456f24cfd30239ca606ed9063"
WEIGHT_SHA256 = "db59695928ded6043adaef491a53ef4e12da9611184d77c53baa691a60b958ad"
AUDIO_REVISION = "31243bad24cc746f07d4c8bfdd2d974872cb1803"
AUDIO_URL = f"https://raw.githubusercontent.com/openai/whisper/{AUDIO_REVISION}/tests/jfk.flac"
AUDIO_SHA256 = "63a4b1e4c1dc655ac70961ffbf518acd249df237e5a0152faae9a4a836949715"
# OpenAI's tests/test_transcribe.py at AUDIO_REVISION checks these substrings.
FIXTURE_PHRASES = ("my fellow americans", "your country", "do for you")
DECODER = dict(do_sample=False, num_beams=1, return_timestamps=False, max_new_tokens=64)


def mono_waveform(clip, rate):
    pcm = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", "pipe:0", "-map", "0:a:0", "-ac", "1",
         "-ar", str(rate), "-f", "s16le", "pipe:1"],
        input=clip, check=True, stdout=subprocess.PIPE,
    ).stdout
    return np.frombuffer(pcm, dtype="<i2").astype(np.float32) / 32768.0


@torch.inference_mode()
def measure(name, samples, actual_rate, extractor, tokenizer, model, show_transcripts):
    declared_rate = extractor.sampling_rate
    batch = extractor(
        samples, sampling_rate=declared_rate, padding="max_length", truncation=True,
        return_tensors="pt", return_attention_mask=True,
    )
    ids = model.generate(**batch, **DECODER)[0]
    text = tokenizer.decode(ids, skip_special_tokens=True).strip()
    words = text.split()
    if show_transcripts:
        print(f"{name}: {text}", file=sys.stderr)
    return {
        "name": name,
        "waveform_rate_hz": actual_rate,
        "declared_rate_hz": declared_rate,
        "input_samples": len(samples),
        "apparent_seconds_before_truncation": len(samples) / declared_rate,
        "padded_samples": max(0, extractor.n_samples - len(samples)),
        "truncated_samples": max(0, len(samples) - extractor.n_samples),
        "input_features_shape": list(batch.input_features.shape),
        "valid_mel_frames": int(batch.attention_mask.sum()),
        "returned_token_ids_count": ids.numel(),
        "word_count": len(words),
        "first_five_words": " ".join(words[:5]),
        "fixture_phrases_found": [phrase for phrase in FIXTURE_PHRASES if phrase in text.lower()],
        "transcript_sha256": hashlib.sha256(text.encode("utf-8")).hexdigest(),
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--audio", type=Path, help="Local copy of the pinned OpenAI jfk.flac")
    parser.add_argument("--show-transcripts", action="store_true")
    args = parser.parse_args()
    if args.audio:
        clip = args.audio.read_bytes()
    else:
        with urlopen(AUDIO_URL, timeout=30) as response:
            clip = response.read()
    if hashlib.sha256(clip).hexdigest() != AUDIO_SHA256:
        raise ValueError("Audio SHA-256 differs from the pinned OpenAI fixture.")
    metadata = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "a:0", "-show_entries",
         "stream=sample_rate,channels,duration_ts,time_base", "-of", "json", "pipe:0"],
        input=clip, check=True, stdout=subprocess.PIPE,
    ).stdout
    stream = json.loads(metadata)["streams"][0]
    source_rate = int(stream["sample_rate"])

    torch.set_num_threads(1)
    weights = hf_hub_download(MODEL, "model.safetensors", revision=REVISION)
    with open(weights, "rb") as file:
        if hashlib.file_digest(file, "sha256").hexdigest() != WEIGHT_SHA256:
            raise ValueError("Weights SHA-256 differs from the pinned Whisper checkpoint.")
    extractor = WhisperFeatureExtractor.from_pretrained(MODEL, revision=REVISION)
    tokenizer = WhisperTokenizer.from_pretrained(MODEL, revision=REVISION)
    model = WhisperForConditionalGeneration.from_pretrained(
        MODEL, revision=REVISION, dtype=torch.float32, attn_implementation="eager"
    ).cpu().eval()

    cases = []
    for name, rate in [("resampled", extractor.sampling_rate), ("mislabeled", source_rate)]:
        samples = mono_waveform(clip, rate)
        cases.append(measure(name, samples, rate, extractor, tokenizer, model, args.show_transcripts))
    ffmpeg_version = subprocess.check_output(["ffmpeg", "-version"], text=True).splitlines()[0].split()[2]
    print(json.dumps({
        "model": MODEL,
        "revision": REVISION,
        "model_safetensors_sha256": WEIGHT_SHA256,
        "audio": {
            "source": AUDIO_URL, "sha256": AUDIO_SHA256, "sample_rate_hz": source_rate,
            "channels": stream["channels"], "duration_ts": stream["duration_ts"],
            "time_base": stream["time_base"],
        },
        "runtime": {
            "python": platform.python_version(), "torch": torch.__version__,
            "transformers": transformers.__version__, "ffmpeg": ffmpeg_version,
            "device": "cpu", "dtype": "float32", "attention": "eager",
            "threads": torch.get_num_threads(),
        },
        "decoder": DECODER,
        "fixture_phrases": list(FIXTURE_PHRASES),
        "cases": cases,
    }, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
