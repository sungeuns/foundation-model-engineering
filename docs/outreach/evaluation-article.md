# Your LLM judge changed its mind when the answers changed places

Status: editorial draft, not submitted. AI-assisted adaptation of the book's LLM-as-a-judge lesson. The example is deliberately small and does not establish how often a particular judge exhibits position bias.

You compare two answers, A and B. The judge prefers the first answer. You swap their positions. It prefers the first answer again.

Counting those as two independent votes obscures the problem. They are two presentations of the same pair, and after mapping the positions back to answer identities, the judgments disagree.

## Keep answer identity separate from display position

For one evaluation unit, preserve the original candidates and run both orders:

| Presentation | Judge chooses | Original identity |
| --- | --- | --- |
| A, then B | First | A |
| B, then A | First | B |

The result is order-sensitive. It is not evidence that both answers won.

A simple predeclared policy can call this unit inconclusive and route it for human review. That sacrifices automatic coverage to avoid presenting inconsistent evidence as a clean preference. Another policy might use scores or repeated sampling, but it must specify how uncertainty and correlations are handled before looking at the results.

The denominator matters. If you exclude inconclusive pairs and report the win rate on the rest, also report how many pairs were excluded and why. A judge that agrees with humans on ten easy questions but abstains on ninety difficult ones is a different system from one that handles all one hundred.

## A position check does not make the judge correct

A judge can be stable across orders and still reward verbosity, miss a technical mistake, or prefer its own model family's style. Use an independently labeled calibration set, inspect disagreement by domain and response length, and fix the rubric and model version for the comparison.

Retain the exact prompt, candidate identities, presentation order, judge output, parsing failures, and adjudication. Missing or malformed judgments must not silently become losses or zero scores.

The [MT-Bench and Chatbot Arena paper](https://arxiv.org/abs/2306.05685) studies LLM judging and its biases. The book's [LLM-as-a-judge lesson](https://sungeuns.github.io/foundation-model-engineering/chapter-17/llm-as-a-judge/) includes an executable order-mapping example and connects it to calibration and release decisions.

The source book is an independent, AI-assisted open-source project maintained by Seongeun So.
