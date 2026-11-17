import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { getContentDates, getContentRevisions } from '../src/utils/content-dates.js';

test('content dates compare commit instants across timezone boundaries and omit dirty files', () => {
  const cwd = mkdtempSync(join(tmpdir(), 'fme-content-dates-'));
  const git = (...args) => execFileSync('git', args, { cwd, stdio: 'pipe' });
  try {
    git('init');
    git('config', 'user.name', 'Content Date Test');
    git('config', 'user.email', 'test@example.invalid');
    mkdirSync(join(cwd, 'src/pages'), { recursive: true });
    writeFileSync(join(cwd, 'src/pages/example.mdx'), 'First version\n');
    git('add', '.');
    const instant = new Date(Date.now() - 60_000);
    // Choose a valid timezone that puts the same instant on another date,
    // regardless of the time of day at which CI happens to run.
    const offset = instant.getUTCHours() >= 10 ? 14 : -12;
    const local = new Date(instant.getTime() + offset * 3_600_000).toISOString().slice(0, 19);
    const commitDate = `${local}${offset > 0 ? '+14:00' : '-12:00'}`;
    execFileSync('git', ['commit', '-m', 'Fixture'], {
      cwd, stdio: 'pipe', env: { ...process.env, GIT_AUTHOR_DATE: commitDate, GIT_COMMITTER_DATE: commitDate },
    });
    const expected = instant.toISOString().slice(0, 10);
    assert.notEqual(local.slice(0, 10), expected);
    assert.equal(getContentDates(cwd).get('src/pages/example.mdx'), expected);
    assert.equal(getContentRevisions(cwd).get('src/pages/example.mdx').commit, git('rev-parse', 'HEAD').toString().trim());
    assert.equal(getContentRevisions(cwd).get('src/pages/example.mdx').timestamp, new Date(commitDate).toISOString());
    writeFileSync(join(cwd, 'src/pages/example.mdx'), 'Uncommitted version\n');
    assert.equal(getContentDates(cwd).has('src/pages/example.mdx'), false);
    assert.equal(getContentRevisions(cwd).has('src/pages/example.mdx'), false);
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});

test('latest revision identity survives skewed clocks, while future and shallow history are omitted', () => {
  const cwd = mkdtempSync(join(tmpdir(), 'fme-content-revisions-'));
  const git = (...args) => execFileSync('git', args, { cwd, stdio: 'pipe' }).toString().trim();
  const source = 'src/pages/example.mdx';
  const commit = (text, timestamp) => {
    writeFileSync(join(cwd, source), text);
    git('add', '.');
    execFileSync('git', ['commit', '-m', text], {
      cwd, stdio: 'pipe', env: { ...process.env, GIT_AUTHOR_DATE: timestamp, GIT_COMMITTER_DATE: timestamp },
    });
    return git('rev-parse', 'HEAD');
  };
  try {
    git('init');
    git('config', 'user.name', 'Content Revision Test');
    git('config', 'user.email', 'test@example.invalid');
    mkdirSync(join(cwd, 'src/pages'), { recursive: true });
    commit('First', '2020-01-02T12:00:00Z');
    const second = commit('Second, earlier clock', '2020-01-01T12:00:00Z');
    assert.equal(getContentRevisions(cwd).get(source).commit, second);
    assert.equal(getContentDates(cwd).get(source), '2020-01-01');
    const future = commit('Future-dated current content', new Date(Date.now() + 86_400_000).toISOString());
    assert.equal(getContentRevisions(cwd).has(source), false, 'do not attach an old revision to current future-dated content');
    assert.equal(getContentDates(cwd).has(source), false);
    git('reset', '--hard', second); // Only this disposable fixture is reset.
    writeFileSync(join(cwd, '.git/shallow'), `${second}\n`);
    assert.equal(git('rev-parse', '--is-shallow-repository'), 'true');
    assert.equal(getContentRevisions(cwd).size, 0);
    assert.equal(getContentDates(cwd).size, 0);
    assert.notEqual(future, second);
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});
