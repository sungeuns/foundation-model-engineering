import test from 'node:test';
import assert from 'node:assert/strict';
import { decisionCases, decisionFloors, evaluateDecisionPolicy } from '../src/utils/decision-policy.js';
import { bottomLayerTrace, demoNodes, detourQuery, directQuery, distance, greedyTrace, layerGraph } from '../src/utils/hierarchical-search-demo.js';

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

test('calibration can worsen at fixed scores and prevalence while observed cost rises', () => {
  const baseline = decisionCases(false);
  const worse = decisionCases(true);
  assert.deepEqual(baseline.map(row => row.p), worse.map(row => row.p));
  for (const [cases, highScorePositives, errorsPerClass, risk, observedCost] of [
    [baseline, 9, 2, .10, .19],
    [worse, 7, 6, .30, .27],
  ]) {
    assert.equal(cases.length, 100);
    assert.equal(cases.filter(row => row.y === 1).length, 50);
    assert.equal(cases.filter(row => row.p === .95 && row.y === 1).length, highScorePositives);
    const result = evaluateDecisionPolicy(cases, .85, 1, 1, .25);
    assert.deepEqual([result.accepted, result.reviewed, result.coverage], [40, 60, .4]);
    assert.deepEqual([result.fp, result.fn, result.risk], [errorsPerClass, errorsPerClass, risk]);
    assert.ok(Math.abs(result.expectedCost - .19) < 1e-12);
    assert.equal(result.observedCost, observedCost);
  }
});

test('curve floors include equality for either answer and match every slider step', () => {
  assert.deepEqual(decisionFloors, [.50, .55, .60, .65, .70, .75, .80, .85, .90, .95, 1]);
  const cases = decisionCases();
  const counts = decisionFloors.map(floor => evaluateDecisionPolicy(cases, floor, 1, 1, .25).accepted);
  assert.deepEqual(counts, [100, 100, 80, 80, 60, 60, 40, 40, 20, 20, 0]);
});

test('ties at the published cost boundary choose positive before applying the floor', () => {
  for (const [p, fpCost, fnCost] of [[.85, 17, 3], [.95, 19, 1]]) {
    const result = evaluateDecisionPolicy([{ p, y: 1 }], p, fpCost, fnCost, .25);
    assert.equal(result.accepted, 1);
    assert.equal(result.observedCost, 0);
  }
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

test('opening a farther neighbor reveals the exact point on the third expansion', () => {
  const { steps, exact } = greedyTrace(detourQuery);
  const entry = steps.find(step => step.layer === 0).node.id;
  assert.equal(entry, 25);
  assert.equal(steps.at(-1).node.id, 25);
  assert.equal(exact.id, 17);
  const rows = bottomLayerTrace(detourQuery, entry, 3);
  assert.deepEqual(rows.map(row => row.expanded), [25, 24, 16]);
  assert.deepEqual(rows.map(row => row.best), [25, 16, 17]);
  assert.deepEqual([25, 24, 16, 17].map(id => distance(demoNodes[id], detourQuery).toFixed(2)), ['97.74', '105.44', '65.73', '9.49']);
  for (const limit of [0, 1, 2]) assert.deepEqual(bottomLayerTrace(detourQuery, entry, limit), rows.slice(0, limit));
});

test('the direct query keeps the same best point and ties expand the smaller ID first', () => {
  const { steps, exact } = greedyTrace(directQuery);
  const entry = steps.find(step => step.layer === 0).node.id;
  assert.equal(entry, 30);
  assert.equal(steps.at(-1).node.id, exact.id);
  assert.deepEqual(bottomLayerTrace(directQuery, entry, 3).map(row => row.best), [30, 30, 30]);
  const tie = { x: 114, y: 76.5 };
  assert.equal(distance(demoNodes[1], tie), distance(demoNodes[9], tie));
  const rows = bottomLayerTrace(tie, 0, 100);
  assert.deepEqual(rows.slice(0, 2).map(row => row.expanded), [0, 1]);
  assert.equal(rows[0].best, 1);
  assert.equal(rows.length, demoNodes.length);
  assert.equal(new Set(rows.map(row => row.expanded)).size, rows.length);
});

test('n-gram normalization preserves Korean and does not glue words across punctuation', async () => {
  const {ngramOverlap} = await import('../src/utils/ngram-overlap.js');
  assert.equal(ngramOverlap('한글 문장', '한글 문장', 2).jaccard, 1);
  assert.equal(ngramOverlap('alpha,beta', 'alpha beta', 2).jaccard, 1);
  assert.equal(ngramOverlap('', '', 3).jaccard, null);
  assert.equal(ngramOverlap('alpha beta', 'gamma delta', 2).jaccard, 0);
});
