import { findSections, readSectionIndex, searchableText, searchPhrases, termPatterns } from './section-search.js';

export function setupContentsSearch(sidebar: HTMLElement, closeDrawer: () => void) {
  const input = sidebar.querySelector<HTMLInputElement>('#chapterSearch')!;
  const status = sidebar.querySelector<HTMLElement>('#searchStatus')!;
  const panel = sidebar.querySelector<HTMLElement>('#sectionResults')!;
  const list = panel.querySelector('ul')!;
  const contents = sidebar.querySelector<HTMLElement>('#contentsLinks')!;
  const currentChapter = contents.querySelector<HTMLElement>('a[aria-current="page"]');
  const groups = [...sidebar.querySelectorAll<HTMLElement>('.chapter-group')].map(group => ({
    group,
    links: [...group.querySelectorAll<HTMLAnchorElement>('li a')].map(link => ({
      link, text: searchableText(link.dataset.search || ''),
    })),
  }));
  const paths = new Set(groups.flatMap(({ links }) => links.map(({ link }) => link.pathname)));
  const catalogPath = sidebar.querySelector<HTMLAnchorElement>('#labsLink')?.pathname;
  const articlePaths: Set<string> = new Set(JSON.parse(input.dataset.articlePaths || '[]'));
  const lang = document.documentElement.lang;
  const ko = lang === 'ko';
  let index: ReturnType<typeof readSectionIndex> | undefined;
  let loading = false;
  let failed = false;
  let chapterCount = 0;

  function renderSections() {
    const query = input.value.trim();
    list.replaceChildren();
    panel.hidden = true;
    status.hidden = !query;
    if (!query) {
      status.textContent = '';
      return;
    }

    const { total, matches } = findSections(index || [], query);
    if (matches.length) {
      const items = matches.map(match => {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = match.href;
        link.textContent = match.label;
        const chapter = document.createElement('small');
        chapter.textContent = match.chapter;
        link.append(chapter);
        li.append(link);
        return li;
      });
      list.append(...items);
      panel.hidden = false;
    }

    const chapters = ko ? `장 ${chapterCount}개` : `${chapterCount} chapter${chapterCount === 1 ? '' : 's'}`;
    if (loading) status.textContent = ko ? `${chapters} · 절과 글 검색 중…` : `${chapters} · Searching sections and articles…`;
    else if (failed) status.textContent = ko ? `${chapters} · 절과 글 목록을 불러오지 못했습니다. 다시 시도하려면 검색어를 수정하세요.` : `${chapters} · Sections and articles unavailable. Edit the query to retry.`;
    else if (!chapterCount && !total) status.textContent = ko ? '검색 결과가 없습니다.' : 'No matches.';
    else {
      const sections = ko ? `관련 절·글 ${total}개` : `${total} matching ${total === 1 ? 'section or article' : 'sections or articles'}`;
      const capped = total > matches.length ? (ko ? ` (상위 ${matches.length}개 표시)` : ` (showing ${matches.length})`) : '';
      status.textContent = `${chapters} · ${sections}${capped}`;
    }
  }

  async function loadIndex() {
    loading = true;
    failed = false;
    try {
      const response = await fetch(input.dataset.indexUrl!);
      if (!response.ok) throw new Error('Index unavailable');
      index = readSectionIndex(await response.json(), lang, paths, catalogPath, articlePaths);
    } catch {
      failed = true;
    } finally {
      loading = false;
      renderSections(); // The reader may have cleared or changed the query.
    }
  }

  function positionChapterList(query: string) {
    if (query || !currentChapter) {
      contents.scrollTop = 0;
      return;
    }
    const link = currentChapter.getBoundingClientRect();
    const view = contents.getBoundingClientRect();
    contents.scrollTop += link.top - view.top - (contents.clientHeight - link.height) / 2;
  }

  function search() {
    const query = input.value.trim();
    const termSets = termPatterns(searchPhrases(query));
    chapterCount = 0;
    for (const { group, links } of groups) {
      let visible = 0;
      for (const { link, text } of links) {
        const matches = !query || termSets.some(terms => terms.every(term => term.test(text)));
        link.parentElement!.hidden = !matches;
        if (matches) visible++;
      }
      group.hidden = !visible;
      chapterCount += visible;
    }
    if (query && !index && !loading) void loadIndex();
    renderSections();
    positionChapterList(query);
  }

  input.addEventListener('input', search);
  sidebar.querySelector<HTMLElement>('#contentsSearch')!.hidden = false;
  positionChapterList(input.value.trim());
  // Some browsers restore the field on Back, including from their page cache.
  window.addEventListener('pageshow', () => { if (input.value.trim()) search(); });

  list.addEventListener('click', event => {
    if (event.button || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey ||
        !sidebar.classList.contains('open')) return;
    const link = event.target instanceof Element ? event.target.closest('a') : null;
    if (!link || link.pathname !== location.pathname || link.search !== location.search) return;
    const target = document.getElementById(decodeURIComponent(link.hash.slice(1)));
    if (!target) return;
    closeDrawer();
    // Keep native fragment navigation and its history entry, then transfer focus.
    requestAnimationFrame(() => {
      if (!target.hasAttribute('tabindex')) target.tabIndex = -1;
      target.focus({ preventScroll: true });
    });
  });
}
