import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { parse } from 'parse5';

const output = process.env.SEARCH_DIST_DIR || 'dist';
const attr = (node, name) => node?.attrs?.find(attribute => attribute.name === name)?.value;

for (const lang of ['en', 'ko']) {
  test(`${lang} math retains its accessible TeX and excludes the duplicate drawing from snippets`, {
    skip: !existsSync(output) && 'Build the site to check the rendered math.',
  }, () => {
    let inline = 0;
    let display = 0;
    function visit(node) {
      if (attr(node, 'class') === 'katex') {
        const accessible = node.childNodes.find(child => attr(child, 'class') === 'katex-mathml');
        const drawing = node.childNodes.find(child => attr(child, 'class') === 'katex-html');
        assert.ok(accessible && drawing, 'both KaTeX representations are present');
        assert.equal(attr(node, 'data-nosnippet'), undefined);
        assert.equal(attr(accessible, 'data-nosnippet'), undefined);
        const math = accessible.childNodes.find(child => child.tagName === 'math');
        const semantics = math?.childNodes.find(child => child.tagName === 'semantics');
        const tex = semantics?.childNodes.find(child => child.tagName === 'annotation');
        assert.equal(attr(tex, 'encoding'), 'application/x-tex');
        assert.ok(tex.childNodes.some(child => child.value?.trim()), 'copyable TeX');
        assert.equal(attr(drawing, 'aria-hidden'), 'true');
        assert.equal(attr(drawing, 'data-nosnippet'), '');
        assert.ok(drawing.childNodes.length > 0, 'visible glyphs remain in the page');
        if (attr(node.parentNode, 'class') === 'katex-display') display++;
        else inline++;
        return;
      }
      for (const child of node.childNodes || []) visit(child);
    }
    for (const route of ['chapter-3/self-attention-mathematics', 'chapter-6/optimization-mechanics']) {
      const file = join(output, lang === 'ko' ? 'ko' : '', route, 'index.html');
      visit(parse(readFileSync(file, 'utf8')));
    }
    assert.ok(inline > 0 && display > 0, 'exercise both inline and display formulas');
  });
}
