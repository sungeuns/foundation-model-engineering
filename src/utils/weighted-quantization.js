import { quantizeSignedRatio } from './quantization-grid.js';

const weightHundredths = [12, -25, 8, 485, -15];
const activations = [1, 8, 1, 0.1, 2];

export function weightedQuantization(bits, boundHundredths) {
  const limit = 2 ** (bits - 1) - 1;
  const scale = boundHundredths / (100 * limit);
  const rows = weightHundredths.map((units, index) => {
    const weight = units / 100;
    const x = activations[index];
    const { code } = quantizeSignedRatio(units, boundHundredths, limit);
    const reconstructed = (code * boundHundredths) / (100 * limit);
    // Subtract in integer units so a weight exactly on the grid has zero error.
    const error = (code * boundHundredths - units * limit) / (100 * limit);
    return { weight, x, code, reconstructed, contribution: error * x };
  });
  const original = rows.reduce((total, row) => total + row.weight * row.x, 0);
  const output = rows.reduce((total, row) => total + row.reconstructed * row.x, 0);
  return { scale, rows, original, output };
}
