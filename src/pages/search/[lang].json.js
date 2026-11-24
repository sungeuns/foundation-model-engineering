import { chapters } from '../../data/chapters.js';
import modelSnapshot from '../../data/commercial-model-snapshot.json';
import { getBasePath, withPagePath } from '../../utils/paths.js';

const headingLoaders = {
  en: import.meta.glob('../chapter-*/*.mdx', { import: 'getHeadings' }),
  ko: import.meta.glob('../ko/chapter-*/*.mdx', { import: 'getHeadings' }),
};

// Astro flattens KaTeX's MathML, TeX annotation, and visual text together.
// Use the authored math once for these labels and preserve the rendered IDs.
const mathLabels = {
  '/chapter-6/large-scale-training-stability': new Map([
    ['the-zzz-loss', 'The z-loss'],
    ['zzz-loss', 'z-loss'],
  ]),
  '/chapter-7/zero-redundancy-optimizer': new Map([
    ['stage-1-optimizer-state-partitioning-posp_ospos', 'Stage 1: Optimizer State Partitioning (P_{os})'],
    ['stage-2-gradient-partitioning-posgp_osgposg', 'Stage 2: Gradient Partitioning (P_{os+g})'],
    ['stage-3-parameter-partitioning-posgpp_osgpposgp', 'Stage 3: Parameter Partitioning (P_{os+g+p})'],
  ]),
  '/chapter-12/speculative-decoding': new Map([
    ['choosing-the-lookahead-length-kkk', 'Choosing the Lookahead Length K'],
    ['룩어헤드-길이-kkk-선택', '룩어헤드 길이 K 선택'],
  ]),
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
      .map(({ text, slug }) => [mathLabels[sub.path]?.get(slug) ?? text, slug]);

    if (sub.path === '/chapter-17/commercial-model-benchmarks') {
      candidates.push(...modelSnapshot.models.map(({ model, id }) => [model, `model-${id}`]));
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
  return Response.json({ version: 1, lang, chapters: index });
}
