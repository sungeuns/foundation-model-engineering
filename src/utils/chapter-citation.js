import { authorName, site } from '../data/site.js';

// RIS has one field per line. An anchor with a data URL and download filename
// lets a static chapter deliver its own citation even with JavaScript disabled.
export function chapterCitation({ title, lang, timestamp, canonicalUrl, manuscriptUrl }) {
  const date = timestamp.slice(0, 10);
  const note = lang === 'ko' ? '이 판의 원고' : 'Manuscript for this edition';
  const record = [
    'TY  - CHAP',
    `TI  - ${title.replace(/\s+/gu, ' ').trim()}`,
    `T2  - ${site.titles[lang]}`,
    `AU  - ${authorName.family}, ${authorName.given}`,
    `PY  - ${date.slice(0, 4)}`,
    `DA  - ${date.replaceAll('-', '/')}`,
    `LA  - ${lang}`,
    `UR  - ${canonicalUrl}`,
    `N1  - ${note}: ${manuscriptUrl}`,
    'ER  - ',
    '',
  ].join('\r\n');
  return `data:application/x-research-info-systems;charset=utf-8,${encodeURIComponent(record)}`;
}
