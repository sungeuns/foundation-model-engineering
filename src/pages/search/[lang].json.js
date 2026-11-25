import { chapterHeadingLabel } from '../../utils/chapter-heading-label.js';
import { chapters } from '../../data/chapters.js';
import { labsTitle } from '../../data/site.js';
import { labFileLabels, teachingLabGroups } from '../../data/teaching-labs.js';
import { kvCalculatorTitle, releaseLabTitle } from '../../data/lab-titles.js';
import modelSnapshot from '../../data/commercial-model-snapshot.json';
import { getBasePath, withPagePath } from '../../utils/paths.js';

const headingLoaders = {
  en: import.meta.glob('../chapter-*/*.mdx', { import: 'getHeadings' }),
  ko: import.meta.glob('../ko/chapter-*/*.mdx', { import: 'getHeadings' }),
};

export function getStaticPaths() {
  return [{ params: { lang: 'en' } }, { params: { lang: 'ko' } }];
}

export async function GET({ params: { lang } }) {
  const basePath = getBasePath();
  const index = await Promise.all(chapters.flatMap(chapter => chapter.subs).map(async sub => {
    const page = lang === 'ko' ? `/ko${sub.path}` : sub.path;
    const getHeadings = await headingLoaders[lang][`..${page}.mdx`]();
    const candidates = getHeadings()
      .filter(({ depth, text }) => (depth === 2 || depth === 3)
        && !/^(quizzes|references|퀴즈|참고\s*문헌)$/iu.test(text.trim()))
      .map(heading => [chapterHeadingLabel(sub.path, heading), heading.slug]);

    if (sub.path === '/chapter-17/commercial-model-benchmarks') {
      candidates.push(...modelSnapshot.models.map(({ model, id }) => [model, `model-${id}`]));
    }
    if (sub.path === '/chapter-12/kv-cache-management') {
      candidates.push([kvCalculatorTitle[lang], 'kv-calculator']);
    }
    if (sub.path === '/chapter-17/experimental-design-and-uncertainty') {
      candidates.push([releaseLabTitle[lang], 'release-lab']);
    }

    const sections = [];
    const indexed = new Set();
    for (const [text, fragment] of candidates) {
      const label = text.replace(/\s+/gu, ' ').trim();
      if (label && fragment && !indexed.has(fragment)) {
        sections.push([label, fragment]);
        indexed.add(fragment);
      }
    }
    return { path: withPagePath(page, basePath), title: sub.title[lang], sections };
  }));
  const catalog = {
    path: withPagePath(lang === 'ko' ? '/ko/labs' : '/labs', basePath),
    title: labsTitle[lang],
    sections: teachingLabGroups.flatMap(group => group.tasks.map(task => {
      const formats = task.files.map(file => labFileLabels[file.kind][lang]);
      return [`${task.title[lang]} · ${formats.join(', ')}`, task.id];
    })),
  };
  return Response.json({ version: 1, lang, chapters: index, catalog });
}
