// The numerator and bound use the same integer units (e.g. hundredths).
// Comparing remainders keeps an authored decimal midpoint an exact tie.
export function quantizeSignedRatio(inputUnits, boundUnits, limit) {
  const numerator = Math.abs(inputUnits) * limit;
  const lower = Math.floor(numerator / boundUnits);
  const twiceRemainder = 2 * (numerator % boundUnits);
  const tied = twiceRemainder === boundUnits;
  const roundUp = twiceRemainder > boundUnits || (tied && lower % 2 === 1);
  const magnitude = lower + Number(roundUp);
  const rounded = magnitude === 0 ? 0 : Math.sign(inputUnits) * magnitude;
  const code = Math.max(-limit, Math.min(limit, rounded));
  return {
    rounded, code, clamped: code !== rounded,
    // Only adjacent codes with different reconstructions create a jump.
    atJump: tied && lower < limit,
  };
}

const weightsInHundredths = [-200, -125, -75, 0, 25, 125, 160, 200];

export function quantizationGrid(bits, boundTenths) {
  const limit = 2 ** (bits - 1) - 1;
  const boundHundredths = 10 * boundTenths;
  const scale = boundHundredths / (100 * limit);
  const rows = weightsInHundredths.map(weight => {
    const quantized = quantizeSignedRatio(weight, boundHundredths, limit);
    return { ...quantized, input: weight / 100, reconstructed: quantized.code * scale };
  });
  const mse = rows.reduce((sum, row) => sum + (row.input - row.reconstructed) ** 2, 0) / rows.length;
  return { limit, scale, rows, mse };
}
