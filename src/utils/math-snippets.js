// KaTeX draws each formula twice: native MathML for assistive technology
// and positioned HTML glyphs for display. Leave the MathML and prose
// available for snippets without a second, flattened copy of the formula.
export default function rehypeMathSnippets() {
  function visit(node) {
    if (node.tagName === 'span' && node.properties?.className?.includes('katex-html')
        && node.properties.ariaHidden === 'true') {
      node.properties.dataNosnippet = '';
      return;
    }
    for (const child of node.children || []) visit(child);
  }
  return visit;
}
