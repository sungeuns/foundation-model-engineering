export const GiB = 2 ** 30;

// All three entries must describe the same memory pool. Keep a deficit signed
// so the UI can distinguish exhausted KV space from fixed costs that do not fit.
export function availableBytes(entries) {
  const parts = entries.map(entry => {
    if (String(entry).trim() === '') return NaN;
    const value = Number(entry);
    return value >= 0 ? Math.round(value * GiB) : NaN;
  });
  if (!parts.every(Number.isSafeInteger)) return null;
  const [total, weights, reserve] = parts;
  const remaining = total - weights - reserve;
  return Number.isSafeInteger(remaining) ? remaining : null;
}

export function kvCapacity({ batch, sequence, generated, layers, heads, dimension, precision }, budget) {
  const bytesPerToken = 2 * layers * heads * dimension * precision;
  const atLength = tokens => {
    const perSequence = tokens * bytesPerToken;
    const requested = batch * perSequence;
    return {
      tokens, perSequence, requested,
      capacity: budget === null ? null : Math.floor(Math.max(0, budget) / perSequence),
      balance: budget === null ? null : budget - requested,
    };
  };
  return { prompt: atLength(sequence), peak: atLength(sequence + generated) };
}
