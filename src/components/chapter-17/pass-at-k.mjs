// P(all fail) for a uniformly drawn size-k subset of n samples, c of which pass.
export function allFailAtK(n, c, k) {
  if (!Number.isInteger(n) || !Number.isInteger(c) || !Number.isInteger(k) || n < 1 || c < 0 || c > n || k < 1 || k > n) throw new RangeError('Require 0 <= c <= n and 1 <= k <= n, with integer counts.');
  if (k > n - c) return 0;
  let allFail = 1;
  for (let i = 0; i < k; i++) allFail *= (n - c - i) / (n - i);
  return allFail;
}

export function passAtK(n, c, k) {
  return 1 - allFailAtK(n, c, k);
}
