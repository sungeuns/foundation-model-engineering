import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('the two next-token lessons score observed document transitions, including unseen endings', () => {
  const demonstrations = ['', 'ko/'].map(locale => {
    const file = new URL(`../src/pages/${locale}chapter-1/deep-learning-paradigms.mdx`, import.meta.url);
    return readFileSync(file, 'utf8').match(/```python\n([\s\S]*?)```/)[1];
  });
  assert.equal(demonstrations[0], demonstrations[1]);
  const checks = `
assert train([("a", "b"), ("c", "d")]) == {("a", "b"): 1, ("c", "d"): 1}
assert score(train(reviews), "plot", "weak")[0] == 0.75
assert score(train(reviews), "plot", "absent") == (0, inf)
try:
    score(train(reviews), "unknown", "good")
except ValueError:
    pass
else:
    raise AssertionError("the model cannot score an unseen context")
`;
  const output = execFileSync('python3', ['-c', demonstrations[0] + checks], { encoding: 'utf8' });
  assert.equal(output, '0.25 1.386\n0.40 0.916\n');
});
