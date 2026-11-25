import { site as book } from '../data/site.js';
import { chapterFeedHub, escapeXml } from './chapter-feed.js';
import { getBasePath, withBasePath, withPagePath } from './paths.js';

export async function selectedArticleFeed({ lang, site = book.url, articles }) {
  const ko = lang === 'ko';
  const prefix = ko ? '/ko' : '';
  const base = getBasePath();
  const home = new URL(withPagePath(prefix || '/', base), site);
  const self = new URL(withBasePath(prefix + '/articles.xml', base), site);
  const items = await Promise.all(articles.map(async ({ source, path, keepChapterGuid }) => {
    const { title, chapter, anchor, firstPublished, description, tags } = source.frontmatter;
    const link = new URL(withPagePath(prefix + path, base), site);
    // Early English items circulated with chapter GUIDs; feed readers use them
    // to recognize updates. Each new item can use its standalone page as its ID.
    const guid = keepChapterGuid ? new URL(withPagePath(chapter, base), site) : link;
    if (keepChapterGuid && anchor) guid.hash = anchor;
    const html = await source.compiledContent();
    return `    <item>
      <title>${escapeXml(title)}</title>
      <link>${escapeXml(link.href)}</link>
      <guid isPermaLink="true">${escapeXml(guid.href)}</guid>
      <pubDate>${new Date(firstPublished).toUTCString()}</pubDate>
      <description>${escapeXml(description)}</description>
      ${tags.split(',').map(tag => `<category>${escapeXml(tag.trim())}</category>`).join('\n      ')}
      <content:encoded>${escapeXml(html)}</content:encoded>
    </item>`;
  }));
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${ko ? '파운데이션 모델 엔지니어링 — 짧은 기술 글' : 'Foundation Model Engineering — Selected articles'}</title>
    <link>${escapeXml(home.href)}</link>
    <description>${ko ? '파운데이션 모델 엔지니어링 실험을 코드와 측정값으로 풀어 쓴 한국어 글입니다.' : 'Standalone articles from Foundation Model Engineering, with worked examples and reproducible experiments.'}</description>
    <language>${lang}</language>
    <atom:link href="${escapeXml(self.href)}" rel="self" type="application/rss+xml" />
    <atom:link href="${escapeXml(chapterFeedHub)}" rel="hub" />
${items.join('\n')}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
