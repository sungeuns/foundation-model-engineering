export const textCnnKernel = [[2, 0], [0, 1], [-1, 2]];
export const textCnnBias = -1;

export function textCnnExample(swapped = false) {
  const words = swapped ? 'This movie was good not at all' : 'This movie was not good at all';
  const tokens = words.split(' ').map(word => ({
    word, embedding: [Number(word === 'not'), Number(word === 'good')],
  }));
  const windows = tokens.slice(0, tokens.length - textCnnKernel.length + 1).map((_, start) => {
    const contributions = textCnnKernel.map(([neg, praise], offset) => {
      const [xNeg, xPraise] = tokens[start + offset].embedding;
      return xNeg * neg + xPraise * praise;
    });
    const raw = contributions.reduce((total, value) => total + value, textCnnBias);
    return { start, contributions, raw, activation: Math.max(0, raw) };
  });
  const pooled = Math.max(...windows.map(row => row.activation));
  return { tokens, windows, pooled, winners: windows.filter(row => row.activation === pooled).map(row => row.start) };
}
