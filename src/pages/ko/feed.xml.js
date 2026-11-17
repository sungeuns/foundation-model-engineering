import { chapterFeed } from '../../utils/chapter-feed.js';
import { getContentRevisions } from '../../utils/content-dates.js';
import { getBasePath } from '../../utils/paths.js';

export function GET({ site }) {
  return new Response(chapterFeed({
    lang: 'ko', basePath: getBasePath(), origin: site, revisions: getContentRevisions(),
  }), { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
