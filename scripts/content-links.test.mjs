import assert from 'node:assert/strict';
import test from 'node:test';
import rehypeContentLinks, { canonicalContentHref } from '../src/utils/content-links.js';
import { withBasePath, withPagePath } from '../src/utils/paths.js';

test('navigation uses trailing slashes without changing asset URLs', () => {
  for (const base of ['/', '/foundation-model-engineering']) {
    const prefix = base === '/' ? '' : base;
    assert.equal(withPagePath('/', base), `${prefix}/`);
    assert.equal(withPagePath('/ko/', base), `${prefix}/ko/`);
    assert.equal(withBasePath('/social/cover-ko.png', base), `${prefix}/social/cover-ko.png`);
  }
});

test('book links are base-aware, canonical, and idempotent', () => {
  for (const base of ['/', '/foundation-model-engineering/', '/preview']) {
    const prefix = base.replace(/\/+$/, '');
    for (const route of ['/', '/ko', '/chapter-17/contamination-issues', '/ko/chapter-17/contamination-issues']) {
      const canonical = `${prefix}${route === '/' ? '' : route}/`;
      assert.equal(canonicalContentHref(route, base), canonical);
      assert.equal(canonicalContentHref(`${route}?source=book#ref-1`, base), `${canonical}?source=book#ref-1`);
      assert.equal(canonicalContentHref(canonical, base), canonical);
    }
    for (const href of ['#ref-1', 'https://example.com/', '//example.com/', '/image.png', '/not-a-book-page', 'mailto:hello@example.com']) {
      assert.equal(canonicalContentHref(href, base), href);
    }
  }
});

test('HTML and literal MDX links are transformed without touching expressions', () => {
  const expression = { type: 'mdxJsxAttributeValueExpression', value: 'dynamicHref' };
  const tree = { children: [
    { type: 'element', tagName: 'a', properties: { href: '/ko' } },
    { type: 'mdxJsxTextElement', name: 'a', attributes: [{ name: 'href', value: '/ko' }] },
    { type: 'mdxJsxFlowElement', name: 'a', attributes: [{ name: 'href', value: expression }] },
  ] };
  rehypeContentLinks({ base: '/book/' })(tree);
  assert.equal(tree.children[0].properties.href, '/book/ko/');
  assert.equal(tree.children[1].attributes[0].value, '/book/ko/');
  assert.equal(tree.children[2].attributes[0].value, expression);
});
