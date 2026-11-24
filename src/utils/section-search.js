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
      entries.push({
        label,
        chapter: chapter.title,
        href: chapter.path + '#' + encodeURIComponent(fragment),
        headingText: normalize(label).replace(/^\d+(?:\.\d+)*[.)]?\s+/, ''),
        chapterText: normalize(chapter.title),
      });
    }
  }
  return entries;
}

function normalize(text) {
  return text.normalize('NFKC').toLowerCase().replace(/[\s_\p{Pd}]+/gu, ' ').trim();
}

export function findSections(entries, query, limit = 10) {
  const phrase = normalize(query);
  if (!phrase) return { total: 0, matches: [] };
  const terms = phrase.split(' ');
  const matches = [];
  for (const entry of entries) {
    const heading = entry.headingText;
    if (!terms.some(term => heading.includes(term)) ||
        !terms.every(term => heading.includes(term) || entry.chapterText.includes(term))) continue;
    let rank = 3;
    if (heading === phrase) rank = 0;
    else if (heading.startsWith(phrase)) rank = 1;
    else if (heading.includes(phrase)) rank = 2;
    matches.push({ entry, rank });
  }
  // Stable sort keeps the book's order among results of the same rank.
  matches.sort((a, b) => a.rank - b.rank);
  return { total: matches.length, matches: matches.slice(0, limit).map(match => match.entry) };
}
