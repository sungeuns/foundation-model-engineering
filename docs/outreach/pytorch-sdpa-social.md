# A seven-token test for a leaking attention mask

Draft for the PyTorch Foundation social-content intake. The proposed channel is X, with a suggested publication date of December 16, 2026 at 10:00 a.m. Pacific (18:00 UTC). The Foundation chooses whether and when to publish. [Intake guidelines](https://pytorch.org/content-guidelines/#social-channel-content) · [Submission form](https://form.asana.com/?d=9283783873717&k=mPrsX9EcZ0BoGnqz543C1A)

## Suggested post

Change one future token’s value. Does an earlier output move? Run a seven-token CPU experiment and compare a Boolean mask with a floating-point 0/1 mask in PyTorch’s scaled dot-product attention. [Try the test](https://sungeuns.github.io/foundation-model-engineering/chapter-4/hybrid-prefix-lm/#prefix-mask-test)

## For the editor

This short teaching example uses one unpadded sequence, one attention head and fixed inputs. The fourth position can read four values whose mean is 2.5. Add 100 to the fifth value and the correctly masked result stays at 2.5. Pass the same matrix as floating-point zeros and ones and the result changes from 3.257 to 10.465. PyTorch adds a floating-point mask to the attention scores, so a zero leaves the corresponding key eligible. The example runs on CPU and downloads no model or data. [Runnable Python](https://sungeuns.github.io/foundation-model-engineering/labs/prefix_mask.py) · [PyTorch API](https://docs.pytorch.org/docs/2.15/generated/torch.nn.functional.scaled_dot_product_attention.html)

The source is *Foundation Model Engineering*, an independent English and Korean textbook by Seongeun So, developed with AI assistance. Codex prepared this proposal on the maintainer’s behalf. [English lesson](https://sungeuns.github.io/foundation-model-engineering/chapter-4/hybrid-prefix-lm/) · [Korean lesson](https://sungeuns.github.io/foundation-model-engineering/ko/chapter-4/hybrid-prefix-lm/)

## Visual

T1 can read P1, P2, P3 and T1. Changing the later T2 value from 5 to 105 leaves the Boolean-mask output at 2.5. A float mask containing 0 and 1 changes the output from 3.257 to 10.465. [English PNG](https://sungeuns.github.io/foundation-model-engineering/social/prefix-mask-en.png) · [Korean PNG](https://sungeuns.github.io/foundation-model-engineering/social/prefix-mask-ko.png)
