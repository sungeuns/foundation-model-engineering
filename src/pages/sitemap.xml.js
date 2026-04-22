import { chapters } from '../data/chapters.js';
import { site } from '../data/site.js';
import { getBasePath, withBasePath } from '../utils/paths.js';

const lastmod = '2026-04-20';
const pages = [
  '/',
  '/ko',
  ...chapters.flatMap((chapter) =>
    chapter.subs.flatMap((sub) => [
      sub.path,
      `/ko${sub.path}`,
    ])
  ),
];

const escapeXml = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

export function GET({ site: astroSite }) {
  const origin = astroSite || site.url;
  const basePath = getBasePath();
  const urls = pages
    .map((path) => {
      const loc = new URL(withBasePath(path, basePath), origin).toString();
      return [
        '  <url>',
        `    <loc>${escapeXml(loc)}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        '  </url>',
      ].join('\n');
    })
    .join('\n');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
      },
    }
  );
}
