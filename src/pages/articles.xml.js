import * as bucketing from '../data/articles/length-bucketing.md';
import * as loop from '../data/articles/loop-cache-storage.md';
import * as speech from '../data/articles/whisper-sample-rate.md';
import { shortArticlePaths } from '../data/site.js';
import { selectedArticleFeed } from '../utils/selected-article-feed.js';

const articles = [
  { source: loop, path: shortArticlePaths.loop, keepChapterGuid: true },
  { source: speech, path: shortArticlePaths.whisper, keepChapterGuid: true },
  { source: bucketing, path: shortArticlePaths.bucketing, keepChapterGuid: true },
];

export function GET({ site }) {
  return selectedArticleFeed({ lang: 'en', site, articles });
}
