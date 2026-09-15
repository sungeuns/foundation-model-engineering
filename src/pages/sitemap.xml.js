import { chapters } from '../data/chapters.js';
import { site } from '../data/site.js';
import { getBasePath, withBasePath } from '../utils/paths.js';
import { getContentDates } from '../utils/content-dates.js';

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

const toAbsoluteUrl = (path, basePath, origin) => {
  const url = new URL(withBasePath(path, basePath), origin);
  if (!url.pathname.endsWith('/')) {
    url.pathname = `${url.pathname}/`;
  }
  return url.toString();
};

export function GET({ site: astroSite }) {
  const contentDates = getContentDates();
  const origin = astroSite || site.url;
  const basePath = getBasePath();
  const urls = pages
    .map((path) => {
      const loc = toAbsoluteUrl(path, basePath, origin);
      const source = path === '/' ? 'src/pages/index.astro'
        : path === '/ko' ? 'src/pages/ko/index.astro'
        : `src/pages${path}.mdx`;
      const lastmod = contentDates.get(source);
      return [
        '  <url>',
        `    <loc>${escapeXml(loc)}</loc>`,
        ...(lastmod ? [`    <lastmod>${lastmod}</lastmod>`] : []),
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
