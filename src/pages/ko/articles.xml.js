import * as bucketing from '../../data/articles/length-bucketing.ko.md';
import * as loop from '../../data/articles/loop-cache-storage.ko.md';
import * as speech from '../../data/articles/whisper-sample-rate.ko.md';
import { shortArticlePaths } from '../../data/site.js';
import { selectedArticleFeed } from '../../utils/selected-article-feed.js';

const articles = [
  { source: loop, path: shortArticlePaths.loop },
  { source: bucketing, path: shortArticlePaths.bucketing },
  { source: speech, path: shortArticlePaths.whisper },
];

export function GET({ site }) {
  return selectedArticleFeed({ lang: 'ko', site, articles });
}
