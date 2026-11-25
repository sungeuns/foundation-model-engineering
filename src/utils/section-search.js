// The sidebar supplies the canonical URLs of the current translation.
export function readSectionIndex(data, lang, paths, catalogPath, articlePaths = new Set()) {
  if (data?.version !== 1 || data.lang !== lang || !Array.isArray(data.chapters)
      || data.chapters.length !== paths.size) throw new Error('Unexpected section index');
  const remaining = new Set(paths);
  const pages = [...data.chapters];
  if (catalogPath && data.catalog) {
    if (data.catalog.path !== catalogPath || remaining.has(catalogPath)) throw new Error('Unexpected labs URL');
    pages.push(data.catalog);
    remaining.add(catalogPath);
  }
  const entries = [];
  for (const chapter of pages) {
    if (!chapter || !remaining.delete(chapter.path) || typeof chapter.title !== 'string'
        || !chapter.title.trim() || !Array.isArray(chapter.sections)) throw new Error('Unknown chapter');
    const chapterText = searchableText(chapter.title);
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
        topicText: searchableText(label),
        // A bare integer may be a quantity (24 GiB). A dotted prefix can
        // be either a section number or a quantity (5.1 versus 1.5 GiB).
        // Use the shortened form for ranking only; always search the full label.
        unnumberedText: headingText.replace(/^(?:\d+(?:\.\d+)*[.)]|\d+(?:\.\d+)+)\s+/, ''),
        chapterText,
      });
    }
  }
  // A previously cached index may not contain articles. Likewise, an older
  // page can receive a newer index; only offer article URLs that its HTML knows.
  if (data.articles !== undefined && articlePaths.size) {
    if (!Array.isArray(data.articles)) throw new Error('Invalid articles');
    const seen = new Set();
    for (const article of data.articles) {
      if (!article || ![article.title, article.description, article.path].every(
        value => typeof value === 'string' && value.trim())) throw new Error('Invalid article');
      if (!articlePaths.has(article.path) || seen.has(article.path)) continue;
      seen.add(article.path);
      const title = normalizeSearchText(article.title);
      entries.push({
        label: article.title,
        chapter: lang === 'ko' ? '짧은 글' : 'Short article',
        href: article.path + '#main-content',
        headingText: title,
        unnumberedText: title,
        chapterText: '',
        topicText: searchableText(article.title + ' ' + article.description),
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
    .replace(/[\s_\p{Pd}]+/gu, ' ')
    .replace(/\bpre(?=train)/gu, 'pre ')
    .replace(/도메인적응/gu, '도메인 적응').trim();
}

// Keep the original spelling for "GraphRAG" and expose the component words
// for people who search for "RAG". Both forms lead to the same displayed link.
export function searchableText(text) {
  const normalized = normalizeSearchText(text);
  const expanded = text.replace(/(\p{Ll}|\p{N})(\p{Lu})/gu, '$1 $2')
    .replace(/(\p{Lu})(\p{Lu}\p{Ll})/gu, '$1 $2');
  return text === expanded ? normalized : normalized + ' ' + normalizeSearchText(expanded);
}

export function searchPhrases(query) {
  const phrase = normalizeSearchText(query);
  if (!phrase) return [];
  // The bilingual book uses both spellings. Expand only this complete
  // expression in the query, so other words and the original index stay intact.
  const kvCache = /(^| )kv (?:cache|캐시)(?= |$)/gu;
  const translations = new Set([phrase.replace(kvCache, '$1kv cache'), phrase.replace(kvCache, '$1kv 캐시')]);
  for (const variant of [...translations]) {
    translations.add(variant.replace(/(kv (?:cache|캐시)) calculator(?= |$)/gu, '$1 계산기'));
    translations.add(variant.replace(/(kv (?:cache|캐시)) 계산기(?= |$)/gu, '$1 calculator'));
  }
  return [...translations];
}

export function termPatterns(phrases) {
  return phrases.map(phrase => phrase.split(' ').map(term => {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // "rag" can start a word or compound part, but not the middle of "storage".
    // Hangul keeps substring matching so a noun can include a prefix or particle.
    const boundary = /^\p{Script=Latin}/u.test(term) ? '(?:^|[^\\p{Script=Latin}])' : '';
    return new RegExp(boundary + escaped, 'u');
  }));
}

export function findSections(entries, query, limit = 10) {
  const phrases = searchPhrases(query);
  if (!phrases.length) return { total: 0, matches: [] };
  const termSets = termPatterns(phrases);
  const matches = [];
  for (const entry of entries) {
    const heading = entry.headingText;
    if (!termSets.some(terms => terms.some(term => term.test(entry.topicText)) &&
        terms.every(term => term.test(entry.topicText) || term.test(entry.chapterText)))) continue;
    let rank = 3;
    if (phrases.includes(heading) || phrases.includes(entry.unnumberedText)) rank = 0;
    else if (phrases.some(phrase => heading.startsWith(phrase) || entry.unnumberedText.startsWith(phrase))) rank = 1;
    else if (phrases.some(phrase => heading.includes(phrase))) rank = 2;
    const chapterMatch = termSets.some(terms => terms.every(term => term.test(entry.chapterText)));
    matches.push({ entry, rank, chapterMatch });
  }
  // Break heading ties in favor of a lesson devoted to the topic, then use book order.
  matches.sort((a, b) => a.rank - b.rank || Number(b.chapterMatch) - Number(a.chapterMatch));
  return { total: matches.length, matches: matches.slice(0, limit).map(match => match.entry) };
}
