// Probability of at least one passing sample in a size-k subset of n samples.
export function passAtK(n, c, k) {
  if (!Number.isInteger(n) || !Number.isInteger(c) || !Number.isInteger(k) || n < 1 || c < 0 || c > n || k < 1 || k > n) throw new RangeError('Require 0 <= c <= n and 1 <= k <= n, with integer counts.');
  if (n - c < k) return 1;
  let allFail = 1;
  for (let i = 0; i < k; i++) allFail *= (n - c - i) / (n - i);
  return 1 - allFail;
}
