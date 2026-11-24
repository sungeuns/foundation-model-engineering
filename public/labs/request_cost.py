"""Uncached Standard text requests, USD. Rates checked 2026-11-24.

https://developers.openai.com/api/docs/models/gpt-6.2-sol
https://developers.openai.com/api/docs/models/gpt-6.2-astra
"""

from decimal import Decimal


RATES_PER_MILLION = {
    "gpt-6.2-sol": (Decimal("2"), Decimal("10")),
    "gpt-6.2-astra": (Decimal("8"), Decimal("40")),
}


def text_request_usd(model, input_tokens, billed_output_tokens):
    """Price one request. Output includes billed reasoning tokens."""
    if any(type(n) is not int or n < 0 for n in (input_tokens, billed_output_tokens)):
        raise ValueError("Token counts must be nonnegative integers")
    if input_tokens > 922_000 or billed_output_tokens > 128_000:
        raise ValueError("Token count exceeds this model's documented limit")
    input_rate, output_rate = RATES_PER_MILLION[model]
    if input_tokens > 272_000:
        input_rate *= 2
        output_rate *= Decimal("1.5")
    return (input_tokens * input_rate + billed_output_tokens * output_rate) / 1_000_000


if __name__ == "__main__":
    model = "gpt-6.2-sol"
    for input_lengths in [(272_000, 272_000), (271_999, 272_001)]:
        costs = [text_request_usd(model, length, 10_000) for length in input_lengths]
        print(f"{input_lengths}: ${costs[0]:.6f} + ${costs[1]:.6f} = ${sum(costs):.6f}")
