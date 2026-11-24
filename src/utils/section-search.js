// The sidebar supplies the canonical URLs of the current translation.
export function readSectionIndex(data, lang, paths) {
  if (data?.version !== 1 || data.lang !== lang || !Array.isArray(data.chapters)
      || data.chapters.length !== paths.size) throw new Error('Unexpected section index');
  const remaining = new Set(paths);
  const entries = [];
  for (const chapter of data.chapters) {
    if (!chapter || !remaining.delete(chapter.path) || typeof chapter.title !== 'string'
        || !chapter.title.trim() || !Array.isArray(chapter.sections)) throw new Error('Unknown chapter');
    for (const item of chapter.sections) {
      if (!Array.isArray(item) || item.length !== 2 ||
          !item.every(value => typeof value === 'string' && value.trim())) throw new Error('Invalid section');
      const [label, fragment] = item;
      const headingText = normalizeSearchText(label);
      entries.push({
        label,
        chapter: chapter.title,
        href: chapter.path + '#' + encodeURIComponent(fragment),
        headingText,
        // A bare integer may be a quantity (24 GiB). A dotted prefix can
        // be either a section number or a quantity (5.1 versus 1.5 GiB).
        // Use the shortened form for ranking only; always search the full label.
        unnumberedText: headingText.replace(/^(?:\d+(?:\.\d+)*[.)]|\d+(?:\.\d+)+)\s+/, ''),
        chapterText: normalizeSearchText(chapter.title),
      });
    }
  }
  return entries;
}

export function normalizeSearchText(text) {
  // Korean technical prose can attach a noun or particle directly to a Latin
  // acronym. Keep English word boundaries and the original displayed labels.
  return text.normalize('NFKC').toLowerCase()
    .replace(/(\p{Script=Latin})(\p{Script=Hangul})/gu, '$1 $2')
    .replace(/(\p{Script=Hangul})(\p{Script=Latin})/gu, '$1 $2')
    .replace(/[\s_\p{Pd}]+/gu, ' ').trim();
}

export function searchPhrases(query) {
  const phrase = normalizeSearchText(query);
  if (!phrase) return [];
  // The bilingual book uses both spellings. Expand only this complete
  // expression in the query, so other words and the original index stay intact.
  const kvCache = /(^| )kv (?:cache|캐시)(?= |$)/gu;
  const english = phrase.replace(kvCache, '$1kv cache');
  const korean = phrase.replace(kvCache, '$1kv 캐시');
  return english === korean ? [phrase] : [english, korean];
}

export function findSections(entries, query, limit = 10) {
  const phrases = searchPhrases(query);
  if (!phrases.length) return { total: 0, matches: [] };
  const termSets = phrases.map(phrase => phrase.split(' '));
  const matches = [];
  for (const entry of entries) {
    const heading = entry.headingText;
    if (!termSets.some(terms => terms.some(term => heading.includes(term)) &&
        terms.every(term => heading.includes(term) || entry.chapterText.includes(term)))) continue;
    let rank = 3;
    if (phrases.includes(heading) || phrases.includes(entry.unnumberedText)) rank = 0;
    else if (phrases.some(phrase => heading.startsWith(phrase) || entry.unnumberedText.startsWith(phrase))) rank = 1;
    else if (phrases.some(phrase => heading.includes(phrase))) rank = 2;
    matches.push({ entry, rank });
  }
  // Stable sort keeps the book's order among results of the same rank.
  matches.sort((a, b) => a.rank - b.rank);
  return { total: matches.length, matches: matches.slice(0, limit).map(match => match.entry) };
}
