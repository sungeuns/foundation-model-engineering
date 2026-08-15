import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PAGES_ROOT = path.join(ROOT, 'src', 'pages');

function chapterPages(root) {
  const pages = [];
  for (const chapter of fs.readdirSync(root, { withFileTypes: true })) {
    if (!chapter.isDirectory() || !/^chapter-\d+$/.test(chapter.name)) continue;
    const chapterDir = path.join(root, chapter.name);
    for (const entry of fs.readdirSync(chapterDir, { withFileTypes: true })) {
      if (entry.isFile() && entry.name.endsWith('.mdx')) {
        pages.push(path.join(chapterDir, entry.name));
      }
    }
  }
  return pages.sort();
}

function relativeSlugs(root, files) {
  return files.map((file) => path.relative(root, file).replaceAll(path.sep, '/'));
}

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function resolveLocalImport(sourceFile, specifier) {
  const base = path.resolve(path.dirname(sourceFile), specifier);
  const candidates = [
    base,
    `${base}.js`,
    `${base}.jsx`,
    `${base}.ts`,
    `${base}.tsx`,
    `${base}.astro`,
    `${base}.png`,
    `${base}.jpg`,
    `${base}.jpeg`,
    `${base}.webp`,
    `${base}.svg`,
    path.join(base, 'index.js'),
    path.join(base, 'index.ts'),
    path.join(base, 'index.tsx'),
  ];
  return candidates.some((candidate) => fs.existsSync(candidate));
}

const englishPages = chapterPages(PAGES_ROOT);
const koreanRoot = path.join(PAGES_ROOT, 'ko');
const koreanPages = chapterPages(koreanRoot);
const allPages = [...englishPages, ...koreanPages];

test('every English page has exactly one Korean peer', () => {
  assert.deepEqual(
    relativeSlugs(PAGES_ROOT, englishPages),
    relativeSlugs(koreanRoot, koreanPages),
  );
});

test('navigation contains every English page exactly once', () => {
  const navigation = read(path.join(ROOT, 'src', 'data', 'chapters.js'));
  const routes = [...navigation.matchAll(/path:\s*"(\/chapter-\d+\/[^"]+)"/g)]
    .map((match) => `${match[1].slice(1)}.mdx`)
    .sort();
  const pages = relativeSlugs(PAGES_ROOT, englishPages);

  assert.equal(new Set(routes).size, routes.length, 'navigation contains duplicate routes');
  assert.deepEqual(routes, pages);
});

test('chapter list contains every numbered navigation item', () => {
  const navigation = read(path.join(ROOT, 'src', 'data', 'chapters.js'));
  const navigationNumbers = [...navigation.matchAll(/\{ id: "(\d+)-(\d+)"/g)]
    .map((match) => `${match[1]}.${match[2]}`)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  const chapterList = read(path.join(ROOT, 'docs', 'chapter_list.md'));
  const documentedNumbers = [...chapterList.matchAll(/^\* \*\*(\d+\.\d+)\s/mg)]
    .map((match) => match[1])
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  assert.deepEqual(documentedNumbers, navigationNumbers);
});

test('MDX frontmatter starts at byte one and uses the expected layout and language', () => {
  for (const file of allPages) {
    const source = read(file);
    const isKorean = file.startsWith(`${koreanRoot}${path.sep}`);
    const expectedLayout = isKorean
      ? 'layout: ../../../layouts/BookLayout.astro'
      : 'layout: ../../layouts/BookLayout.astro';
    const expectedLang = isKorean ? 'ko' : 'en';

    assert.ok(source.startsWith('---\n'), `${file} does not start with frontmatter at byte one`);
    assert.ok(source.includes(expectedLayout), `${file} has the wrong layout`);
    assert.match(source, new RegExp(`^lang:\\s*["']?${expectedLang}["']?\\s*$`, 'm'), `${file} has the wrong lang`);
    assert.match(source, /^---\n[\s\S]*?\ntitle:\s*.+\n[\s\S]*?\n---\n/);
  }
});

test('every page ends with Quizzes then References and has three to six quizzes', () => {
  for (const file of allPages) {
    const source = read(file);
    const quizIndex = source.lastIndexOf('\n## Quizzes\n');
    const referencesIndex = source.lastIndexOf('\n## References\n');
    const quizCount = [...source.matchAll(/<summary>Quiz \d+:/g)].length;

    assert.ok(quizIndex >= 0, `${file} is missing Quizzes`);
    assert.ok(referencesIndex > quizIndex, `${file} does not place References after Quizzes`);
    assert.ok(quizCount >= 3 && quizCount <= 6, `${file} has ${quizCount} quizzes`);
    const referencesBody = source.slice(referencesIndex + '\n## References\n'.length);
    assert.doesNotMatch(referencesBody, /^##\s/m, `${file} has a section after References`);
  }
});

test('citation targets, reference anchors, and local MDX imports resolve', () => {
  for (const file of allPages) {
    const source = read(file);
    const citations = new Set([...source.matchAll(/\[\[(\d+)\]\]\(#ref-\1\)/g)].map((match) => match[1]));
    const anchors = [...source.matchAll(/<a id="ref-(\d+)"><\/a>/g)].map((match) => match[1]);
    const anchorSet = new Set(anchors);

    for (const citation of citations) {
      assert.ok(anchorSet.has(citation), `${file} cites missing ref-${citation}`);
    }
    anchors.forEach((anchor, index) => {
      assert.equal(Number(anchor), index + 1, `${file} has non-sequential reference anchors`);
    });

    for (const match of source.matchAll(/^import\s+.+?\s+from\s+['"](\.[^'"]+)['"];?$/mg)) {
      assert.ok(resolveLocalImport(file, match[1]), `${file} imports missing ${match[1]}`);
    }
  }
});

test('review ledgers that claim full coverage include the current inventory', () => {
  const ledgers = [
    'docs/chapter_review_checklist.md',
    'docs/exhaustive_subchapter_audit.md',
    'docs/editorial_rewrite_worklog.md',
  ];
  const requiredSlugs = relativeSlugs(PAGES_ROOT, englishPages).map((slug) => path.basename(slug, '.mdx'));

  for (const ledger of ledgers) {
    const source = read(path.join(ROOT, ledger));
    for (const slug of requiredSlugs) {
      assert.ok(source.includes(slug), `${ledger} omits ${slug}`);
    }
  }
});

test('AGENTS.md defines operational contracts for training content', () => {
  const agents = read(path.join(ROOT, 'AGENTS.md'));
  const requiredPhrases = [
    'canonical inventory',
    'tokenizer-native chat template',
    'evaluation quarantine',
    'artifact bundle',
    'data cursor',
    'rollback rehearsal',
    'smoke-tested',
    'review ledger',
  ];

  for (const phrase of requiredPhrases) {
    assert.ok(agents.toLowerCase().includes(phrase), `AGENTS.md is missing ${phrase}`);
  }
});
