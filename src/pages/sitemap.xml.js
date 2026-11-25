import { chapters } from '../data/chapters.js';
import { site } from '../data/site.js';
import { getBasePath, withBasePath } from '../utils/paths.js';
import { getContentDates } from '../utils/content-dates.js';

const pages = [
  { path: '/', source: 'src/pages/index.astro' },
  { path: '/ko', source: 'src/pages/ko/index.astro' },
  // The catalog combines page, component and data sources. The page-only
  // revision map cannot establish a reliable last-modified date for it.
  { path: '/labs' },
  { path: '/ko/labs' },
  ...chapters.flatMap((chapter) =>
    chapter.subs.flatMap((sub) => [
      { path: sub.path, source: `src/pages${sub.path}.mdx` },
      { path: `/ko${sub.path}`, source: `src/pages/ko${sub.path}.mdx` },
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
    .map(({ path, source }) => {
      const loc = toAbsoluteUrl(path, basePath, origin);
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
