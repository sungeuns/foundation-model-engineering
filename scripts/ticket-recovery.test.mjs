import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const route = 'chapter-16/agent-reliability-recovery-and-guardrails.mdx';

test('both published ticket examples recover one receipt and reject a reused key with a different intent', () => {
  for (const prefix of ['', 'ko/']) {
    const page = readFileSync(new URL('../src/pages/' + prefix + route, import.meta.url), 'utf8');
    const code = page.split('<a id="lost-ticket-receipt"></a>')[1].match(/```python\n([\s\S]*?)\n```/)[1];
    const check = `
with TemporaryDirectory() as folder:
    store = Path(folder) / "tickets.db"
    receipt = create_ticket(store, "r1", "Original subject")
    try:
        create_ticket(store, "r1", "Changed subject")
    except ValueError:
        pass
    else:
        raise AssertionError("reused key accepted a different subject")
    assert create_ticket(store, "r1", "Original subject") == receipt
    with closing(sqlite3.connect(store)) as db:
        assert db.execute("SELECT id, subject FROM ticket").fetchall() == [(receipt, "Original subject")]
`;
    assert.equal(execFileSync('python3', ['-c', code + '\n' + check], { encoding: 'utf8' }), '1\n2\n');
  }
});
