import test from 'node:test';
import assert from 'node:assert/strict';
import { decisionCases, evaluateDecisionPolicy } from '../src/utils/decision-policy.js';
import { demoNodes, greedyTrace, layerGraph } from '../src/utils/hierarchical-search-demo.js';

test('decision costs count false positives, false negatives and review independently', () => {
  const cases = [{p: .9, y: 0}, {p: .1, y: 1}, {p: .55, y: 1}, {p: .95, y: 1}];
  const actual = evaluateDecisionPolicy(cases, .8, 2, 1, .25);
  assert.equal(actual.accepted, 3);
  assert.equal(actual.reviewed, 1);
  assert.equal(actual.fp, 1);
  assert.equal(actual.fn, 1);
  assert.equal(actual.risk, 2 / 3);
  assert.equal(actual.observedCost, 3.25 / 4);
  assert.ok(Math.abs(actual.expectedCost - .65 / 4) < 1e-12);
});

test('no accepted decisions gives undefined conditional risk, not a fabricated zero', () => {
  const actual = evaluateDecisionPolicy(decisionCases(), 1, 5, 1, .25);
  assert.equal(actual.accepted, 0);
  assert.equal(actual.risk, null);
  assert.equal(actual.observedCost, .25);
  assert.equal(actual.expectedCost, .25);
});

test('label shift preserves predictions and predicted cost while exposing outcome errors', () => {
  const baseline = decisionCases(false), shifted = decisionCases(true);
  assert.deepEqual(baseline.map(x => x.p), shifted.map(x => x.p));
  const a = evaluateDecisionPolicy(baseline, .8, 5, 1, .25);
  const b = evaluateDecisionPolicy(shifted, .8, 5, 1, .25);
  assert.equal(a.expectedCost, b.expectedCost);
  assert.equal(a.coverage, b.coverage);
  assert.notEqual(a.observedCost, b.observedCost);
});

test('hierarchical traversal only follows actual edges or descends at the same node', () => {
  for (const x of [0, 75, 300, 599]) for (const y of [0, 80, 250, 399]) {
    const {steps, exact} = greedyTrace({x,y});
    assert.equal(steps[0].layer, 2);
    assert.equal(steps.at(-1).layer, 0);
    for (let i = 1; i < steps.length; i++) {
      const before = steps[i - 1], after = steps[i];
      if (before.layer !== after.layer) {
        assert.equal(after.layer, before.layer - 1);
        assert.equal(after.node.id, before.node.id);
      } else {
        assert.ok(layerGraph(after.layer).get(before.node.id).has(after.node.id));
        const dist = node => Math.hypot(node.x - x, node.y - y);
        assert.ok(dist(after.node) < dist(before.node));
      }
    }
    const minimum = Math.min(...demoNodes.map(n => Math.hypot(n.x-x,n.y-y)));
    assert.ok(Math.abs(Math.hypot(exact.x-x,exact.y-y) - minimum) < 1e-10);
  }
});

test('n-gram normalization preserves Korean and does not glue words across punctuation', async () => {
  const {ngramOverlap} = await import('../src/utils/ngram-overlap.js');
  assert.equal(ngramOverlap('한글 문장', '한글 문장', 2).jaccard, 1);
  assert.equal(ngramOverlap('alpha,beta', 'alpha beta', 2).jaccard, 1);
  assert.equal(ngramOverlap('', '', 3).jaccard, null);
  assert.equal(ngramOverlap('alpha beta', 'gamma delta', 2).jaccard, 0);
});
