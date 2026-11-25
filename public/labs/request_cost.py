"""Standard text requests with optional prompt caching, USD. Rates checked 2026-11-25.

Foundation Model Engineering, section 17.6
English: https://sungeuns.github.io/foundation-model-engineering/chapter-17/commercial-model-benchmarks/#long-context-cost
Korean: https://sungeuns.github.io/foundation-model-engineering/ko/chapter-17/commercial-model-benchmarks/#long-context-cost

https://developers.openai.com/api/docs/models/gpt-6.2-sol
https://developers.openai.com/api/docs/models/gpt-6.2-astra
https://developers.openai.com/api/docs/guides/background
https://developers.openai.com/api/docs/guides/prompt-caching
https://developers.openai.com/api/docs/pricing
"""

from decimal import Decimal


RATES_PER_MILLION = {
    "gpt-6.2-sol": (Decimal("2"), Decimal("10")),
    "gpt-6.2-astra": (Decimal("8"), Decimal("40")),
}


def text_request_usd(
    model, input_tokens, billed_output_tokens, *,
    cached_tokens=0, write_30m_tokens=0, write_12h_tokens=0,
):
    """Input includes reads and writes. Output includes billed reasoning tokens."""
    counts = (input_tokens, billed_output_tokens, cached_tokens, write_30m_tokens, write_12h_tokens)
    if any(type(n) is not int or n < 0 for n in counts):
        raise ValueError("Token counts must be nonnegative integers")
    ordinary_tokens = input_tokens - cached_tokens - write_30m_tokens - write_12h_tokens
    if ordinary_tokens < 0:
        raise ValueError("Cache reads and writes cannot exceed total input tokens")
    if input_tokens > 922_000 or billed_output_tokens > 128_000:
        raise ValueError("Token count exceeds this model's documented limit")
    input_rate, output_rate = RATES_PER_MILLION[model]
    if input_tokens > 272_000:
        input_rate *= 2
        output_rate *= Decimal("1.5")
    weighted_input = (
        ordinary_tokens
        + cached_tokens * Decimal("0.05")
        + write_30m_tokens * Decimal("1.25")
        + write_12h_tokens * Decimal("2.5")
    )
    return (weighted_input * input_rate + billed_output_tokens * output_rate) / 1_000_000


if __name__ == "__main__":
    model = "gpt-6.2-sol"
    for input_lengths in [(272_000, 272_000), (271_999, 272_001)]:
        costs = [text_request_usd(model, length, 10_000) for length in input_lengths]
        print(f"{input_lengths}: ${costs[0]:.6f} + ${costs[1]:.6f} = ${sum(costs):.6f}")

    # A separate short-context job, with the same billed tokens in each window.
    standard = text_request_usd(model, 50_000, 2_000)
    for window, multiplier in [("soonest", "1"), ("2h", "0.70"), ("8h", "0.60")]:
        print(f"{window}: ${standard * Decimal(multiplier):.3f}")

    # A distinct 1,000-token ticket follows the same 40,000-token policy each time.
    uncached = text_request_usd(model, 41_000, 500)
    first = text_request_usd(model, 41_000, 500, write_12h_tokens=40_000)
    hit = text_request_usd(model, 41_000, 500, cached_tokens=40_000)
    for tickets in (1, 2, 3):
        cached_total = first + (tickets - 1) * hit
        print(f"{tickets} ticket(s): ordinary ${tickets * uncached:.3f}, 12h cache ${cached_total:.3f}")
