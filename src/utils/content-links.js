import { chapters } from '../data/chapters.js';
import { shortArticlePaths } from '../data/site.js';

export function articleRoutes(lang) {
  return Object.values(shortArticlePaths).map(route => lang === 'ko' ? '/ko' + route : route);
}

export const bookPageRoutes = new Set(['/', '/ko', '/labs', '/ko/labs', ...articleRoutes('en'), ...articleRoutes('ko'), ...chapters.flatMap(chapter =>
  chapter.subs.flatMap(sub => [sub.path, `/ko${sub.path}`]))]);

// Only rewrite known book pages. Preserve assets, external links, query strings,
// fragments and unknown paths so a typo remains visible to the link audit.
export function canonicalContentHref(href, base = '/') {
  if (typeof href !== 'string' || !/^\/(?!\/)/.test(href)) return href;
  const prefix = base.replace(/\/+$/, '');
  const [, path, suffix] = href.match(/^([^?#]*)(.*)$/);
  let route = path;
  if (prefix && (path === prefix || path.startsWith(`${prefix}/`))) {
    route = path.slice(prefix.length) || '/';
  }
  route = route.replace(/\/+$/, '') || '/';
  if (!bookPageRoutes.has(route)) return href;
  return `${prefix}${route === '/' ? '' : route}/${suffix}`;
}

export default function rehypeContentLinks({ base = '/' } = {}) {
  return tree => {
    const visit = node => {
      if (node.type === 'element' && node.tagName === 'a' && node.properties) {
        node.properties.href = canonicalContentHref(node.properties.href, base);
      }
      if (['mdxJsxFlowElement', 'mdxJsxTextElement'].includes(node.type) && node.name === 'a') {
        for (const attribute of node.attributes || []) {
          if (attribute.name === 'href' && typeof attribute.value === 'string') {
            attribute.value = canonicalContentHref(attribute.value, base);
          }
        }
      }
      for (const child of node.children || []) visit(child);
    };
    visit(tree);
  };
}
