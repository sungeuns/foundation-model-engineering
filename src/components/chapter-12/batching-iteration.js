// Shared links refer to the chapter's fixed six-request, eleven-iteration trace.
export const lastBatchingIteration = 11;

export function readBatchingIteration(search) {
  const values = new URLSearchParams(search).getAll('iteration');
  if (values.length !== 1 || !/^(0|[1-9]\d*)$/.test(values[0])) return null;
  const iteration = Number(values[0]);
  return iteration <= lastBatchingIteration ? iteration : null;
}
