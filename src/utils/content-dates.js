import { execFileSync } from 'node:child_process';

// Filesystem mtimes describe checkout time in CI, not content changes. Use full
// Git history, and omit dates if it is unavailable, shallow, or locally dirty.
export function getContentDates(cwd = process.cwd()) {
  const dates = new Map();
  const git = (...args) => execFileSync('git', args, {
    cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'],
    maxBuffer: 16 * 1024 * 1024,
  }).trim();
  try {
    if (git('rev-parse', '--is-shallow-repository') !== 'false') return dates;
    const history = git('log', '--format=DATE:%cs', '--name-only', '--', 'src/pages');
    let date;
    const today = new Date().toISOString().slice(0, 10);
    for (const line of history.split('\n')) {
      if (line.startsWith('DATE:')) {
        date = line.slice(5);
      } else if (line.startsWith('src/pages/') && date && date <= today) {
        // Use the newest calendar date even if commit clocks are out of order.
        if (!dates.has(line) || dates.get(line) < date) dates.set(line, date);
      }
    }
    for (const file of git('diff', 'HEAD', '--name-only', '--', 'src/pages').split('\n')) {
      dates.delete(file);
    }
  } catch {
    dates.clear();
  }
  return dates;
}
