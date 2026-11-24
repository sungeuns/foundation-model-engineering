import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { allFailAtK, passAtK } from '../src/components/chapter-17/pass-at-k.mjs';

test('a rounded pass@k of 100% can still leave an all-failure draw', () => {
  assert.ok(Math.abs(allFailAtK(20, 10, 9) - 10 / 167960) < 1e-17);
  assert.ok(Math.abs(allFailAtK(20, 10, 10) - 1 / 184756) < 1e-18);
  assert.equal(allFailAtK(20, 10, 11), 0);

  // One all-failure subset among C(200,100); the rounded success probability
  // loses that information even before rounding for display.
  const exactSubsets = 90548514656103281165404177077484163874504589675413336841320n;
  const expected = 1 / Number(exactSubsets);
  assert.equal(1 - passAtK(200, 100, 100), 0);
  assert.ok(Math.abs(allFailAtK(200, 100, 100) / expected - 1) < 1e-12);
  assert.equal(allFailAtK(200, 100, 101), 0);
});

for (const lang of ['en', 'ko']) {
  const output = process.env.SEARCH_DIST_DIR || 'dist';
  const page = join(output, lang === 'ko' ? 'ko' : '', 'chapter-17/academic-benchmarks/index.html');
  test(`${lang} pass@k readout preserves nonzero failure odds on first paint`, {
    skip: !existsSync(page) && 'build the book first',
  }, () => {
    const html = readFileSync(page, 'utf8');
    const widget = html.match(/<section class="pass-atk-container"[\s\S]*?<\/section>/)?.[0];
    assert.ok(widget);
    assert.match(widget, /<strong>&gt;99\.9%<\/strong>/);
    assert.match(widget, /<strong>0\.00595%<\/strong>/);
    assert.match(widget, /<desc[^>]*>[^<]*0\.00595%[^<]*<\/desc>/);
  });
}
