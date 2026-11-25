import * as bucketing from '../data/articles/length-bucketing.md';
import * as loop from '../data/articles/loop-cache-storage.md';
import * as speech from '../data/articles/whisper-sample-rate.md';
import { site as book, whisperArticlePath } from '../data/site.js';
import { chapterFeedHub, escapeXml } from '../utils/chapter-feed.js';
import { getBasePath, withBasePath, withPagePath } from '../utils/paths.js';

// Only full-length adaptations explicitly selected for syndication belong here.
const articles = [{ source: loop }, { source: speech, path: whisperArticlePath }, { source: bucketing }];

export async function GET({ site = book.url }) {
  const base = getBasePath();
  const home = new URL(withPagePath('/', base), site);
  const self = new URL(withBasePath('/articles.xml', base), site);
  const items = await Promise.all(articles.map(async ({ source, path }) => {
    const { title, chapter, anchor, firstPublished, description, tags } = source.frontmatter;
    // Keep the original item identity when an adaptation gets its own reading page.
    const original = new URL(withPagePath(chapter, base), site);
    if (anchor) original.hash = anchor;
    const link = path ? new URL(withPagePath(path, base), site) : original;
    const html = await source.compiledContent();
    return `    <item>
      <title>${escapeXml(title)}</title>
      <link>${escapeXml(link.href)}</link>
      <guid isPermaLink="true">${escapeXml(original.href)}</guid>
      <pubDate>${new Date(firstPublished).toUTCString()}</pubDate>
      <description>${escapeXml(description)}</description>
      ${tags.split(',').map(tag => `<category>${escapeXml(tag.trim())}</category>`).join('\n      ')}
      <content:encoded>${escapeXml(html)}</content:encoded>
    </item>`;
  }));
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Foundation Model Engineering — Selected articles</title>
    <link>${escapeXml(home.href)}</link>
    <description>Standalone articles from Foundation Model Engineering, with worked examples and reproducible experiments.</description>
    <language>en</language>
    <atom:link href="${escapeXml(self.href)}" rel="self" type="application/rss+xml" />
    <atom:link href="${escapeXml(chapterFeedHub)}" rel="hub" />
${items.join('\n')}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
