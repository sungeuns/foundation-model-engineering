import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { basename } from 'node:path';
import test from 'node:test';
import { socialCards } from '../src/data/social-cards.js';

const route = '/chapter-12/serving-policies-slos-and-fallbacks';

for (const lang of ['en', 'ko']) {
  test(lang + ' streaming figure plots both manuscript traces on one time scale', () => {
    const prefix = lang === 'ko' ? 'src/pages/ko' : 'src/pages';
    const chapter = readFileSync(prefix + route + '.mdx', 'utf8');
    const card = socialCards[route][lang];
    const figure = readFileSync('src/assets/images/chapter-12/' + basename(card.image, '.png') + '.svg', 'utf8');

    const ticks = new Map([...figure.matchAll(/<text x="([\d.]+)"[^>]*>(\d+)<\/text>/g)]
      .map(([, x, ms]) => [Number(ms), Number(x)]));
    const toX = ms => ticks.get(0) + ms * (ticks.get(500) - ticks.get(0)) / 500;
    assert.ok(ticks.get(500) > ticks.get(0));
    for (const [ms, x] of ticks) assert.equal(x, toX(ms));

    const records = [...chapter.matchAll(/^\| ([AB]):[^|]+\| ([\d, ]+) \|/gm)];
    assert.equal(records.length, 2);
    for (const [, id, arrivals] of records) {
      const times = arrivals.split(',').map(Number);
      const marks = figure.match(new RegExp('<g id="arrivals-' + id.toLowerCase() + '"[^>]*>(.*?)</g>', 's'));
      assert.ok(marks);
      const positions = [...marks[1].matchAll(/<line x1="([\d.]+)" x2="([\d.]+)"/g)];
      assert.deepEqual(positions.map(mark => Number(mark[1])), times.map(toX));
      assert.deepEqual(positions.map(mark => Number(mark[2])), times.map(toX));
      const lastGap = times.at(-1) - times.at(-2);
      assert.match(figure, new RegExp('>' + lastGap + '\\s?ms</text>'));
    }
  });
}
