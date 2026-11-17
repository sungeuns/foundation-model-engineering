import { execFileSync } from 'node:child_process';

// Filesystem mtimes describe checkout time in CI, not content changes. Use full
// Git history, and omit revisions if it is unavailable, shallow, or locally dirty.
export function getContentRevisions(cwd = process.cwd()) {
  const revisions = new Map();
  const git = (...args) => execFileSync('git', args, {
    cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'],
    maxBuffer: 16 * 1024 * 1024,
  }).trim();
  try {
    if (git('rev-parse', '--is-shallow-repository') !== 'false') return revisions;
    const history = git('log', '--topo-order', '--format=REV:%H:%ct', '--name-only', '--', 'src/pages');
    const seen = new Set();
    let revision;
    let order = 0;
    const now = Date.now();
    for (const line of history.split('\n')) {
      if (line.startsWith('REV:')) {
        // Compare instants before deriving a UTC date. A Korean committer's
        // next-day local date is not a future commit relative to UTC.
        const [, commit, seconds] = line.split(':');
        const committedAt = Number(seconds) * 1000;
        revision = Number.isFinite(committedAt) && committedAt <= now
          ? { commit, timestamp: new Date(committedAt).toISOString(), order } : undefined;
        order += 1;
      } else if (line.startsWith('src/pages/') && !seen.has(line)) {
        // The current file's latest revision wins even with skewed commit
        // clocks. Never substitute an older revision for a future-dated edit.
        seen.add(line);
        if (revision) revisions.set(line, revision);
      }
    }
    for (const file of git('diff', 'HEAD', '--name-only', '--', 'src/pages').split('\n')) {
      revisions.delete(file);
    }
  } catch {
    revisions.clear();
  }
  return revisions;
}

// Preserve the sitemap API while RSS retains the full timestamp and identity.
export function getContentDates(cwd = process.cwd()) {
  return new Map([...getContentRevisions(cwd)].map(([file, revision]) => [file, revision.timestamp.slice(0, 10)]));
}
