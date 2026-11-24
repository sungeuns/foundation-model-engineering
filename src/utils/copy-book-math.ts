import { katexReplaceWithTex } from 'katex/contrib/copy-tex/katex2tex.ts';

function formulaAt(node: Node) {
  const element = node instanceof Element ? node : node.parentElement;
  return element?.closest('.katex-display') ?? element?.closest('.katex');
}

export function copyBookMath(event: ClipboardEvent) {
  const selection = window.getSelection();
  if (event.defaultPrevented || !event.clipboardData || !selection ||
      selection.isCollapsed || selection.rangeCount !== 1) return;
  if (document.activeElement?.closest('input, textarea, [contenteditable]:not([contenteditable="false"])')) return;
  const range = selection.getRangeAt(0).cloneRange();
  const main = document.querySelector('main');
  if (!main?.contains(range.commonAncestorContainer)) return;

  // A drag can begin inside a rendered glyph. Keep its complete TeX and the
  // display wrapper in the copied fragment, without changing the reader's selection.
  const first = formulaAt(range.startContainer);
  const last = formulaAt(range.endContainer);
  if (first) range.setStartBefore(first);
  if (last) range.setEndAfter(last);
  const fragment = range.cloneContents();
  if (!fragment.querySelector('.katex-mathml annotation[encoding="application/x-tex"]')) return;

  // Rich editors may not load the book's KaTeX stylesheet. A standalone
  // MathML tree carries the structure and TeX annotation without a second drawing.
  const html = document.createElement('div');
  html.append(fragment.cloneNode(true));
  for (const math of html.querySelectorAll('.katex-mathml > math')) {
    formulaAt(math)?.replaceWith(math);
  }
  for (const link of html.querySelectorAll<HTMLAnchorElement>('a[href]')) link.href = link.href;
  for (const image of html.querySelectorAll<HTMLImageElement>('img[src]')) image.src = image.src;
  event.clipboardData.setData('text/html', html.innerHTML);

  fragment.querySelectorAll('script, style, noscript, [hidden], .section-permalink, details:not([open]) > :not(summary)')
    .forEach(node => node.remove());
  fragment.querySelectorAll('br').forEach(node => node.replaceWith('\n'));
  fragment.querySelectorAll('th:not(:last-child), td:not(:last-child)').forEach(node => node.append('\t'));
  // A fragment can start or end midway through a paragraph, and adjacent
  // blocks need not have a whitespace text node between them in generated HTML.
  for (const block of fragment.querySelectorAll(
    'p, h1, h2, h3, h4, h5, h6, pre, li, blockquote, figure, table, thead, tbody, tr, .katex-display'
  )) {
    const before = block.previousSibling, after = block.nextSibling;
    if (before && !before.textContent?.endsWith('\n')) block.before('\n');
    if (after && !after.textContent?.startsWith('\n')) block.after('\n');
  }
  event.clipboardData.setData('text/plain', katexReplaceWithTex(fragment).textContent ?? '');
  event.preventDefault();
}
