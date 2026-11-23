import { execFileSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { appendFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { pathToFileURL } from 'node:url';
import { chapters } from '../src/data/chapters.js';
import { site } from '../src/data/site.js';

const base = new URL('/foundation-model-engineering/', site.url);
const endpoint = 'https://api.indexnow.org/indexnow';
const sourceRoutes = new Map([
  ['src/pages/index.astro', ''],
  ['src/pages/ko/index.astro', 'ko/'],
]);
for (const chapter of chapters) {
  for (const { path } of chapter.subs) {
    for (const prefix of ['', '/ko']) {
      sourceRoutes.set(`src/pages${prefix}${path}.mdx`, `${prefix}${path}/`.slice(1));
    }
  }
}

export function changedRoutes(files) {
  return [...new Set(files.filter((file) => sourceRoutes.has(file)).map((file) => sourceRoutes.get(file)))];
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
    'diff', '--no-renames', '--name-only', '--diff-filter=AM', '-z', before, after, '--', 'src/pages',
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
