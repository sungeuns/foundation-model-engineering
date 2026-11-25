"""Compare BM25 and a pretrained multilingual encoder on four English passages.

English: https://sungeuns.github.io/foundation-model-engineering/chapter-14/lexical-to-semantic-search/#multilingual-retrieval-check
한국어: https://sungeuns.github.io/foundation-model-engineering/ko/chapter-14/lexical-to-semantic-search/#multilingual-retrieval-check

Tested on Linux x86-64 with Python 3.12. In a fresh environment:
    python -m pip install "torch==2.15.0" --index-url https://download.pytorch.org/whl/cpu
    python -m pip install "transformers==5.24.1"
    python multilingual_retrieval.py

The first run downloads the pinned model (471 MB of weights) and tokenizer.
Subsequent runs can reuse the cache without network access:
    HF_HUB_OFFLINE=1 python multilingual_retrieval.py

The four passages and eight queries were written for this comparison. All
product codes and service procedures are fictional. A model-specific request
requires a passage for that exact model. Two cases have no relevant passage.
This MIT-licensed checkpoint was released separately by its authors:
https://huggingface.co/intfloat/multilingual-e5-small/blob/614241f622f53c4eeff9890bdc4f31cfecc418b3/README.md
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

import json
import math
import platform
import re
import unicodedata
from collections import Counter

import torch
import transformers
from transformers import AutoModel, AutoTokenizer

MODEL = "intfloat/multilingual-e5-small"
REVISION = "614241f622f53c4eeff9890bdc4f31cfecc418b3"
K1, B = 1.2, 0.75
TOKEN = re.compile(r"[^\W_]+(?:-[^\W_]+)*")
MODEL_CODE = re.compile(r"(?<![\w-])XJ-[0-9]+-[A-Z](?![\w-])", re.ASCII | re.I)

# Search only the passage text. The catalog field is reserved for filtering.
DOCUMENTS = {
    "A": {
        "model_code": "XJ-992-B",
        "text": "The battery in model XJ-992-B is sealed inside the housing. "
                "Send the device to a service center for replacement.",
    },
    "B": {
        "model_code": "XJ-992-D",
        "text": "To replace the battery in model XJ-992-D, slide the rear cover open "
                "and insert a new battery.",
    },
    "C": {
        "model_code": None,
        "text": "To repair a punctured bicycle inner tube, find the hole, dry the area, "
                "and apply a patch before reinflating.",
    },
    "D": {
        "model_code": None,
        "text": "To download a receipt for an old purchase, open order history, "
                "select the order, and save the PDF.",
    },
}
# Gold labels are declared before retrieval. Each model-specific request names
# just one code. None means no passage provides an applicable procedure.
CASES = [
    ("bicycle", "en", "My bike tire keeps losing air. How do I fix the leak?", "C"),
    ("bicycle", "ko", "자전거 타이어에서 자꾸 바람이 빠져요. 어떻게 고치죠?", "C"),
    ("receipt", "en", "Where can I get a copy of the bill for something I bought last month?", "D"),
    ("receipt", "ko", "지난달에 산 물건의 영수증을 다시 받고 싶어요.", "D"),
    ("known-model", "en", "How do I replace the battery in XJ-992-B?", "A"),
    ("known-model", "ko", "XJ-992-B 배터리를 직접 교체해도 되나요?", "A"),
    ("absent-model", "en", "How do I replace the battery in XJ-992-Q?", None),
    ("absent-model", "ko", "XJ-992-Q 배터리를 직접 교체해도 되나요?", None),
]


def terms(text):
    return TOKEN.findall(unicodedata.normalize("NFKC", text).lower())


def bm25(query, documents):
    count = len(documents)
    lengths = {key: counter.total() for key, counter in documents.items()}
    avg_length = sum(lengths.values()) / count
    scores = dict.fromkeys(documents, 0.0)
    for term in sorted(set(terms(query))):
        df = sum(term in counter for counter in documents.values())
        idf = math.log1p((count - df + 0.5) / (df + 0.5))
        for key, counter in documents.items():
            frequency = counter[term]
            normalization = 1 - B + B * lengths[key] / avg_length
            scores[key] += idf * frequency * (K1 + 1) / (frequency + K1 * normalization)
    return scores


@torch.inference_mode()
def encode(inputs, tokenizer, model):
    batch = tokenizer(inputs, padding=True, truncation=True, max_length=512, return_tensors="pt")
    mask = batch.attention_mask
    hidden = model(**batch).last_hidden_state.masked_fill(~mask[..., None].bool(), 0.0)
    pooled = hidden.sum(1) / mask.sum(1, keepdim=True)
    return torch.nn.functional.normalize(pooled, p=2, dim=1)


def main():
    torch.set_num_threads(1)
    tokenizer = AutoTokenizer.from_pretrained(MODEL, revision=REVISION)
    model = AutoModel.from_pretrained(
        MODEL, revision=REVISION, dtype=torch.float32, attn_implementation="eager"
    ).cpu().eval()

    passages = ["passage: " + doc["text"] for doc in DOCUMENTS.values()]
    queries = ["query: " + query for _, _, query, _ in CASES]
    passage_vectors = encode(passages, tokenizer, model)
    query_vectors = encode(queries, tokenizer, model)
    similarities = query_vectors @ passage_vectors.T
    counters = {key: Counter(terms(doc["text"])) for key, doc in DOCUMENTS.items()}

    results = []
    for index, (case, language, query, gold) in enumerate(CASES):
        lexical = bm25(query, counters)
        highest = max(lexical.values())
        # Empty means no term overlap. Preserve any ties above zero.
        lexical_top = [key for key, score in lexical.items() if score == highest and score > 0]
        cosine = dict(zip(DOCUMENTS, similarities[index].tolist(), strict=True))
        dense_order = sorted(cosine, key=cosine.__getitem__, reverse=True)
        code = MODEL_CODE.search(query)
        eligible = dense_order
        if code:
            eligible = [key for key in dense_order if DOCUMENTS[key]["model_code"] == code[0].upper()]
        # Rank at full precision, round only for the published score tables.
        results.append({
            "case": case,
            "language": language,
            "query": query,
            "relevant": gold,
            "bm25": {key: round(score, 6) for key, score in lexical.items()},
            "bm25_top": lexical_top,
            "cosine": {key: round(score, 6) for key, score in cosine.items()},
            "dense_order": dense_order,
            "code_filtered_top": eligible[:1],
        })

    print(json.dumps({
        "model": MODEL,
        "revision": REVISION,
        "python": platform.python_version(),
        "torch": torch.__version__,
        "transformers": transformers.__version__,
        "threads": torch.get_num_threads(),
        "embedding_dimension": passage_vectors.shape[1],
        "bm25_k1": K1,
        "bm25_b": B,
        "documents": DOCUMENTS,
        "results": results,
    }, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
