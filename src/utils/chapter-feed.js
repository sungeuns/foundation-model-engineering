import { chapters } from '../data/chapters.js';
import { searchDescriptions } from '../data/search-descriptions.js';
import { site } from '../data/site.js';
import { withBasePath, withPagePath } from './paths.js';

const escapeXml = value => String(value)
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;').replaceAll("'", '&apos;');

// An update feed, not a publication-date claim. Only committed MDX edits with
// known revisions enter the feed; a checkout or rebuild never creates an update.
export function chapterFeed({ lang, basePath, origin = site.url, revisions }) {
  const isKo = lang === 'ko';
  const home = new URL(withPagePath(isKo ? '/ko' : '/', basePath), origin).href;
  const feed = new URL(withBasePath(isKo ? '/ko/feed.xml' : '/feed.xml', basePath), origin).href;
  const title = `${site.titles[lang]} — ${isKo ? '최근 수정한 장' : 'Recently edited chapters'}`;
  const description = isKo
    ? '최근 수정한 20개 장을 확인하세요. 날짜는 원고의 Git 수정 기록을 기준으로 하며, 최초 발행일이나 전체 내용의 재검증을 뜻하지 않습니다.'
    : 'Follow the 20 most recently edited chapters. Dates come from committed manuscript edits, not first publication or a claim that every detail was reverified.';
  const entries = chapters.flatMap(chapter => chapter.subs).map((sub, order) => {
    const path = isKo ? `/ko${sub.path}` : sub.path;
    return { sub, path, order, revision: revisions.get(`src/pages${path}.mdx`) };
  }).filter(entry => entry.revision)
    .sort((a, b) => b.revision.timestamp.localeCompare(a.revision.timestamp)
      || a.revision.order - b.revision.order || a.order - b.order)
    .slice(0, 20);
  const items = entries.map(({ sub, path, revision }) => {
    const url = new URL(withPagePath(path, basePath), origin).href;
    const updated = revision.timestamp.replace('T', ' ').replace('.000Z', ' UTC');
    const summary = `${isKo ? '원고 수정' : 'Manuscript edited'}: ${updated}. ${searchDescriptions[sub.path][lang]}`;
    return `    <item>
      <title>${escapeXml(sub.title[lang])}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="false">${escapeXml(`${url}#revision-${revision.commit}`)}</guid>
      <description>${escapeXml(summary)}</description>
      <pubDate>${new Date(revision.timestamp).toUTCString()}</pubDate>
    </item>`;
  }).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${escapeXml(home)}</link>
    <description>${escapeXml(description)}</description>
    <language>${lang}</language>
    <atom:link href="${escapeXml(feed)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;
}
