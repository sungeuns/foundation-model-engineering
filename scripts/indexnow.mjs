import { execFileSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { appendFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { pathToFileURL } from 'node:url';
import { chapters } from '../src/data/chapters.js';
import { servingGuide, shortArticlePaths, site, whisperArticlePath } from '../src/data/site.js';

const base = new URL('/foundation-model-engineering/', site.url);
const endpoint = 'https://api.indexnow.org/indexnow';
const catalogRoutes = ['labs/', 'ko/labs/'];
const article = whisperArticlePath.slice(1) + '/';
const koArticle = 'ko/' + article;
const speechChapter = 'chapter-11/audio-and-speech-integration/';
const batchingRoutes = ['chapter-12/continuous-batching/', 'ko/chapter-12/continuous-batching/'];
const sharedRoutes = new Map([
  ['src/components/chapter-12/ContinuousBatchingVisualizer.tsx', batchingRoutes],
  ['src/components/chapter-12/SchedulingVisualizer.tsx', [
    ...batchingRoutes, 'chapter-12/long-context-serving/', 'ko/chapter-12/long-context-serving/',
  ]],
  ['src/components/chapter-11/SampleRateListening.astro', [article, koArticle, speechChapter, 'ko/' + speechChapter]],
  ['src/components/FeaturedLessons.astro', ['', 'ko/']],
  ['src/components/TeachingLabs.astro', catalogRoutes],
  ['src/data/teaching-labs.js', catalogRoutes],
  ['src/data/lab-datasets.js', catalogRoutes],
  ['src/data/site.js', [...catalogRoutes, '', 'ko/', ...servingGuide.lessons.flatMap(lesson => [
    lesson.slice(1) + '/', 'ko' + lesson + '/',
  ])]],
  // The catalog includes a bundled link whose URL contains the script's hash.
  ['scripts/verify-dp-ddp-gradients.py', catalogRoutes],
]);
const sourceRoutes = new Map([
  ['src/pages/index.astro', ''],
  ['src/pages/ko/index.astro', 'ko/'],
  ['src/pages/labs/index.astro', catalogRoutes[0]],
  ['src/pages/ko/labs/index.astro', catalogRoutes[1]],
]);
for (const path of Object.values(shortArticlePaths)) {
  const slug = path.split('/').at(-1);
  for (const prefix of ['', '/ko']) {
    const url = `${prefix}${path}/`.slice(1);
    const suffix = prefix ? '.ko.md' : '.md';
    sharedRoutes.set(`src/data/articles/${slug}${suffix}`, [url]);
    sourceRoutes.set(`src/pages${prefix}${path}.astro`, url);
  }
}
for (const chapter of chapters) {
  for (const { path } of chapter.subs) {
    for (const prefix of ['', '/ko']) {
      sourceRoutes.set(`src/pages${prefix}${path}.mdx`, `${prefix}${path}/`.slice(1));
    }
  }
}

export function changedRoutes(files) {
  const routes = new Set();
  for (const file of files) {
    if (sharedRoutes.has(file)) {
      for (const route of sharedRoutes.get(file)) routes.add(route);
    } else if (sourceRoutes.has(file)) {
      routes.add(sourceRoutes.get(file));
    }
  }
  return [...routes];
}

function readProof(file) {
  const proof = readFileSync(file, 'utf8');
  if (!/^[0-9a-f]{32}$/.test(proof)) throw new Error('Invalid cached IndexNow verification value');
  // The Pages artifact uploader can print filenames. Keep the public challenge out of job logs.
  console.log(`::add-mask::${proof}`);
  return proof;
}

function prepare(file) {
  if (!existsSync(file)) writeFileSync(file, randomBytes(16).toString('hex'), { mode: 0o600 });
  const proof = readProof(file);
  writeFileSync(join('dist', `${proof}.txt`), proof);

  const before = process.env.PUSH_BEFORE;
  if (process.env.GITHUB_EVENT_NAME !== 'push' || process.env.GITHUB_RUN_ATTEMPT !== '1') return;
  if (!before || /^0+$/.test(before)) return;
  const after = process.env.GITHUB_SHA;
  if (![before, after].every((sha) => /^[0-9a-f]{40}$/.test(sha))) throw new Error('Invalid push range');
  const files = execFileSync('git', [
    'diff', '--no-renames', '--name-only', '--diff-filter=AM', '-z', before, after, '--', 'src/pages', ...sharedRoutes.keys(),
  ], { encoding: 'utf8' }).split('\0');
  const routes = changedRoutes(files);
  if (routes.length) appendFileSync(process.env.GITHUB_OUTPUT, `routes=${JSON.stringify(routes)}\n`);
}

export async function submit(routes, proof, fetchRequest = fetch, pause = delay) {
  const allowed = new Set(sourceRoutes.values());
  if (!routes.length || !routes.every((route) => allowed.has(route))) throw new Error('Unexpected page route');
  const urlList = [...new Set(routes)].map((route) => new URL(route, base).href);
  const keyLocation = new URL(`${proof}.txt`, base).href;

  // A new Pages deployment can take a moment to reach an edge. Retry only the read.
  let verified = false;
  for (const wait of [0, 3_000, 10_000, 20_000]) {
    if (wait) await pause(wait);
    try {
      const response = await fetchRequest(keyLocation, { redirect: 'error', signal: AbortSignal.timeout(10_000) });
      verified = response.ok && (await response.text()) === proof;
      if (verified) break;
    } catch {
      // A transient read failure is handled by the next verification attempt.
    }
  }
  if (!verified) throw new Error('The published IndexNow verification file could not be verified');
  const response = await fetchRequest(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    redirect: 'error',
    signal: AbortSignal.timeout(20_000),
    body: JSON.stringify({ host: base.hostname, key: proof, keyLocation, urlList }),
  });
  return { status: response.status, urlList };
}

async function main() {
  const file = join(process.env.RUNNER_TEMP, 'indexnow-proof');
  if (process.argv[2] === 'prepare') return prepare(file);
  if (process.argv[2] !== 'notify') throw new Error('Expected prepare or notify');
  if (new URL(process.env.PAGES_URL).href.replace(/\/?$/, '/') !== base.href) {
    throw new Error('Unexpected Pages deployment URL');
  }
  const { status, urlList } = await submit(JSON.parse(process.env.CHANGED_ROUTES), readProof(file));
  const result = status === 200 ? 'received' : status === 202 ? 'key validation pending' : 'rejected';
  const receipt = `IndexNow HTTP ${status} (${result}) for ${urlList.length} changed URL(s).`;
  console.log(receipt);
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, [receipt, '', ...urlList.map((url) => `- ${url}`), ''].join('\n'));
  if (![200, 202].includes(status)) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
