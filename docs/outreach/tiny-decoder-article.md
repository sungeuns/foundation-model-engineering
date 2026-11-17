# Can your decoder see the future? A CPU experiment

Status: AI-assisted editorial draft, not submitted. Based on the book's executable synthetic copying lab. Local Linux/Jupyter execution was verified on 2026-11-18; hosted Colab execution was not verified. This is a proposed standalone article, not an empirical claim about a production model.

A decoder predicts the next token. During training, however, the input tensor already contains later tokens. The attention mask is what keeps those answers out of reach.

That gives us a useful test before discussing loss curves: change the future input tokens and ask whether an earlier prediction changes.

## Predict the result before running

The [CPU notebook](https://colab.research.google.com/github/sungeuns/foundation-model-engineering/blob/main/public/labs/tiny-decoder-lab.ipynb) trains a one-layer, 10,161-parameter decoder on a small copying task. A sequence repeats four distinct symbols, such as `3, 8, 2, 11`. The model sees the first four and learns to continue the pattern. These are generated symbols, not natural-language data.

There is no model download or API key. The notebook embeds the complete lab source and runs with CPU PyTorch. Colab requires Google sign-in; you can also [download it for local Jupyter](https://sungeuns.github.io/foundation-model-engineering/labs/tiny-decoder-lab.ipynb). The [experiment guide](https://sungeuns.github.io/foundation-model-engineering/chapter-7/tiny-decoder-lab/) gives dependencies and the exact training contract.

Make three predictions:

1. With a causal mask, will replacing future symbols change earlier logits?
2. If attention can see only the current position, can it still copy as well?
3. If training stops halfway, will restoring a checkpoint reproduce the remaining updates exactly in this fixed CPU setup?

The notebook runs these checks. It also deliberately removes the causal mask from a separate, untrained probe. Earlier logits then change when future inputs change. That demonstrates an invalid information path; it does not measure a trained unmasked model's score.

## Remove one capability, keep the budget

The copying comparison changes only which positions attention can access. Initialization, parameters, sampling, optimizer and update count stay the same. The self-only version still has embeddings, position information and nonlinear layers.

In the recorded seed-7 run, held-out loss was about **0.0508 nats per target** with causal attention and **2.7042** with self-only attention. A uniform prediction over the 16 valid symbols has loss `ln(16) ≈ 2.773`.

This is evidence that earlier context helps on this synthetic task. It does not establish how a particular head represents copying, or how a language model will perform. There are only 16 held-out sequences. Greedy generation got 15 completely right; reporting token accuracy alone would hide the failed sequence.

## Treat replay as another experiment

Saving weights is not enough to reproduce training. This lab also records optimizer state, random-number-generator state, the sampler position, step count, and hashes binding the data and configuration. It checks checkpoint integrity, resumes, and compares the remaining updates.

The notebook corrupts a **copy** of the checkpoint to confirm that the loader rejects it, then restores the intact artifact. Exact replay here is a test of one local CPU execution contract. It is not evidence of distributed fault tolerance or identical results across PyTorch versions.

Run the notebook, save its result packet, and explain one result that differed from your prediction. The [full lesson](https://sungeuns.github.io/foundation-model-engineering/chapter-7/tiny-decoder-lab/) connects the checks to masking, data splits and recovery. The [source repository](https://github.com/sungeuns/foundation-model-engineering) includes an equivalent Korean notebook and is open to concrete corrections.

Foundation Model Engineering is an independent, AI-assisted open-source textbook maintained by Seongeun So.
