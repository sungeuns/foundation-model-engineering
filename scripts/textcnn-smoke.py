"""Check the two chapter 2.4 Python examples and browser calculations on CPU."""
import json
from pathlib import Path
import re
import subprocess

import torch

ROOT = Path(__file__).resolve().parents[1]
torch.set_num_threads(1)
js = """
import { textCnnExample } from './src/utils/textcnn.js';
console.log(JSON.stringify([textCnnExample(false), textCnnExample(true)]));
"""
fixtures = json.loads(subprocess.check_output(["node", "--input-type=module", "-e", js], cwd=ROOT))

for locale in ("", "ko/"):
    source = ROOT / "src/pages" / locale / "chapter-2/cnns-for-nlp.mdx"
    examples = re.findall(r"```python\n(.*?)```", source.read_text(), re.S)
    assert len(examples) == 2
    context = {}
    for example in examples:
        exec(compile(example, str(source), "exec"), context)

    for fixture in fixtures:
        sentence = " ".join(token["word"] for token in fixture["tokens"])
        raw, active = context["feature_map"](sentence)
        assert [window["raw"] for window in fixture["windows"]] == raw.tolist()
        assert [window["activation"] for window in fixture["windows"]] == active.tolist()
        assert fixture["pooled"] == active.max().item()
        assert fixture["winners"] == (active == active.max()).nonzero().flatten().tolist()

    model = context["TextCNN"](vocab_size=4, embed_dim=1, num_classes=2).eval()
    with torch.no_grad():
        for parameter in model.parameters():
            parameter.zero_()
        model.embedding.weight[1, 0] = 1
        model.conv1.weight[0, 0].fill_(-1)
        model.conv1.bias[0] = 2
        model.fc.weight[0, 0] = 1
        inputs = torch.tensor([[1, 1, 1, 1, 1, 0, 0, 0]])
        assert model(inputs).tolist() == [[2., 0.]]
        assert model(inputs[:, :7]).tolist() == [[1., 0.]]
        assert model(inputs, [5]).tolist() == model(inputs[:, :5]).tolist() == [[0., 0.]]
        inputs[:, 5:] = 3  # padding embeddings may have any finite values
        model.embedding.weight[3, 0] = -17
        assert model(inputs, [5]).tolist() == [[0., 0.]]

        # Check each branch width on shorter-than-k, exact and mixed lengths.
        torch.manual_seed(13)
        mixed = context["TextCNN"](vocab_size=10, embed_dim=3, num_classes=2).eval()
        data = torch.randint(0, 10, (7, 8))
        lengths = [0, 1, 2, 3, 4, 5, 8]
        batch = mixed(data, lengths)
        for index, length in enumerate(lengths):
            torch.testing.assert_close(batch[index], mixed(data[index:index+1, :length])[0])
            if length < 3:
                torch.testing.assert_close(batch[index], mixed.fc.bias)
        for invalid in ([-1] * 7, [9] * 7, [3], [3.5] * 7):
            try:
                mixed(data, invalid)
            except ValueError:
                continue
            raise AssertionError(f"accepted invalid lengths {invalid}")

    print(f"{locale or 'en/'}: 10 windows, pooling ties, padding, branch widths and lengths passed")
