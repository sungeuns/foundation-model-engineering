"""Execute bilingual compression/online-softmax teaching examples on CPU.

Run with Python + PyTorch. No model download, CUDA execution or speed claim.
The comparisons exercise mathematical contracts, not a production compressor.
"""
from pathlib import Path
import re
import torch

PAGES = Path(__file__).resolve().parents[1] / "src/pages"
torch.set_num_threads(1)


def code_blocks(slug):
    return re.findall(r"```python\n(.*?)```", (PAGES / slug).read_text(), re.S)


def execute(code, source):
    namespace = {}
    exec(compile(code, source, "exec"), namespace)
    return namespace


def rejects(function, *args):
    try:
        function(*args)
    except ValueError:
        return
    raise AssertionError("invalid teaching-example input was accepted")


for locale in ("", "ko/"):
    quantization = locale + "chapter-13/quantization-methods.mdx"
    for code in code_blocks(quantization):
        execute(code, quantization)

    # Independently recompute the authored activation-sensitive rounding example.
    w = torch.tensor([0.1, 1.0], dtype=torch.float64)
    x = torch.tensor([100.0, 1.0], dtype=torch.float64)
    rounded = (w * 7).round() / 7
    torch.testing.assert_close(w @ x, torch.tensor(11., dtype=torch.float64))
    torch.testing.assert_close(rounded @ x, torch.tensor(107/7, dtype=torch.float64))
    assert 8_000_000_000 * 4 // 8 + (8_000_000_000 // 128) * 2 == 4_125_000_000
    assert (4 + .5) / 8 == .5625
    assert abs(1 / (.6 / 2 + .4) - 10/7) < 1e-15

    sparsity = locale + "chapter-13/weight-sparsification.mdx"
    prune = execute(code_blocks(sparsity)[0], sparsity)["wanda_2_4_mask"]
    # Existing zeros and ties still retain two positions, not necessarily two values.
    zeros = torch.zeros(2, 8)
    pruned, keep = prune(zeros, torch.ones(3, 8))
    assert torch.equal(pruned, zeros)
    assert torch.equal(keep.reshape(2, 2, 4), torch.tensor([False, False, True, True]).expand(2, 2, 4))
    w = torch.tensor([[.01, .2, .3, 2.]])
    x = torch.tensor([[100., 1., 1., 1.]])
    pruned, _ = prune(w, x)
    torch.testing.assert_close(x @ pruned.T, torch.tensor([[3.]]))
    rejects(prune, torch.ones(2, 6), torch.ones(3, 6))
    rejects(prune, torch.ones(2, 8), torch.ones(0, 8))
    rejects(prune, torch.ones(0, 8), torch.ones(3, 8))
    rejects(prune, torch.ones(2, 8), torch.full((3, 8), float("nan")))

    flash = locale + "chapter-7/flash-attention.mdx"
    blocks = code_blocks(flash)
    online = execute(blocks[0], flash)["online_attention_row"]
    torch.manual_seed(31)
    scores = torch.randn(13, dtype=torch.float64)
    values = torch.randn(13, 7, dtype=torch.float64)
    for offset in (-10_000., 0., 10_000.):
        shifted = scores + offset
        expected = torch.softmax(shifted, 0) @ values
        for tile in (1, 2, 4, 13, 20):
            torch.testing.assert_close(online(shifted, values, tile), expected, rtol=1e-12, atol=1e-12)
        permutation = torch.randperm(len(scores))
        torch.testing.assert_close(online(shifted[permutation], values[permutation], 4), expected, rtol=1e-12, atol=1e-12)
    rejects(online, torch.empty(0, dtype=torch.float64), torch.empty(0, 2, dtype=torch.float64))
    rejects(online, torch.tensor([float("-inf")], dtype=torch.float64), torch.zeros(1, 2, dtype=torch.float64))
    compile(blocks[1], flash + ":CUDA-not-run", "exec")
    assert 2 * 8 * 4096**2 * 4 == 1024**3
    assert 128_000**2 * 2 == 32_768_000_000
    print(f"{locale or 'en/'}: code, storage arithmetic, sparse masks and online-softmax equivalence passed; CUDA compiled only")

for slug in ("chapter-13/quantization-methods.mdx", "chapter-13/weight-sparsification.mdx", "chapter-7/flash-attention.mdx"):
    assert code_blocks(slug) == code_blocks("ko/" + slug), f"bilingual code drift: {slug}"
print("EN/KO executable code blocks are identical")
