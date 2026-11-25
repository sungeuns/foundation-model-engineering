import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import test from 'node:test';
import { parse } from 'parse5';
import { labFileLabels, teachingLabGroups } from '../src/data/teaching-labs.js';
import { GET as measurements } from '../src/pages/labs/2026-11/[dataset].csv.js';
import { localeHref } from '../src/utils/locale-fragments.js';

const dist = process.env.SEARCH_DIST_DIR || 'dist';
const attr = (node, name) => node.attrs?.find(item => item.name === name)?.value;
const text = node => node.value ?? (node.childNodes || []).map(text).join('');
const byId = (nodes, id) => nodes.filter(node => attr(node, 'id') === id);
const pages = new Map();

function descendants(node) {
  return [node, ...(node.childNodes || []).flatMap(descendants)];
}

function page(route) {
  if (!pages.has(route)) {
    const html = readFileSync(join(dist, route, 'index.html'), 'utf8');
    pages.set(route, descendants(parse(html)));
  }
  return pages.get(route);
}

for (const lang of ['en', 'ko']) {
  test(`the ${lang} lab catalogue preserves deep links and serves each advertised download`, async () => {
    const prefix = lang === 'ko' ? 'ko/' : '';
    const otherPrefix = lang === 'ko' ? '' : 'ko/';
    const route = prefix + 'labs/';
    const hub = page(route);
    const canonical = new URL(attr(hub.find(node => attr(node, 'rel') === 'canonical'), 'href'));
    assert.ok(canonical.pathname.endsWith('/' + route));
    const base = canonical.pathname.slice(0, -route.length);
    const switcher = byId(hub, 'localeLink')[0];
    const fragments = JSON.parse(attr(switcher, 'data-shared-fragments'));
    const otherRoute = otherPrefix + 'labs/';
    assert.equal(attr(switcher, 'href'), base + otherRoute);

    for (const group of teachingLabGroups) {
      const [heading] = byId(hub, group.id);
      assert.equal(heading.tagName, 'h2');
      assert.equal(text(heading), group.title[lang]);
      assert.equal(attr(heading.parentNode, 'aria-labelledby'), group.id);
      for (const id of [group.id, ...group.tasks.map(task => task.id)]) {
        assert.equal(byId(hub, id).length, 1, id);
        assert.equal(byId(page(otherRoute), id).length, 1, id);
        assert.equal(localeHref(attr(switcher, 'href'), '#' + id, fragments), base + otherRoute + '#' + id);
      }

      for (const task of group.tasks) {
        const [row] = byId(hub, task.id);
        const links = descendants(row).filter(node => node.tagName === 'a');
        const chapter = prefix + task.chapter.slice(1) + '/';
        assert.equal(text(links[0]), task.title[lang]);
        assert.equal(attr(links[0], 'href'), base + chapter + '#' + task.anchor);
        assert.equal(byId(page(chapter), task.anchor).length, 1, chapter + '#' + task.anchor);
        assert.equal(links.length, task.files.length + 1);

        for (const [index, file] of task.files.entries()) {
          const link = links[index + 1];
          const source = typeof file.path === 'string' ? file.path : file.path[lang];
          const href = attr(link, 'href');
          assert.ok(href.startsWith(base), href);
          if (source.startsWith('/labs/')) assert.equal(href, base + source.slice(1));
          assert.equal(attr(link, 'download'), basename(source));
          assert.equal(text(link), labFileLabels[file.kind][lang]);
          assert.ok(attr(link, 'aria-label').includes(task.title[lang]));

          const bytes = readFileSync(join(dist, href.slice(base.length)));
          assert.ok(bytes.length > 0, href);
          if (file.kind === 'csv') {
            const csv = await measurements({ params: { dataset: basename(source, '.csv') } });
            assert.equal(bytes.toString('utf8'), await csv.text());
          } else {
            const sourceRoot = source.startsWith('/labs/') ? 'public' : '.';
            assert.deepEqual(bytes, readFileSync(join(sourceRoot, source)), href);
          }
        }
      }
    }
  });
}
