import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const original = fs.readFileSync(path.join(ROOT, 'public/labs/causal_lab.py'), 'utf8');
const hash = createHash('sha256').update(original).digest('hex');
const books = ['tiny-decoder-lab.ipynb', 'tiny-decoder-lab-ko.ipynb'].map(name =>
  JSON.parse(fs.readFileSync(path.join(ROOT, 'public/labs', name), 'utf8')));

function checkSource(book) {
  const embedded = book.cells.filter(c => c.metadata.fme_role === 'canonical_source');
  assert.equal(embedded.length, 1, 'exactly one authoritative source cell');
  assert.equal(embedded[0].source.join(''), `SOURCE = r'''${original}'''\n`, 'embedded lab drift');
  assert.equal(book.metadata.fme.source_sha256, hash, 'source metadata hash');
  const loader = book.cells.find(c => c.id === 'load-source').source.join('');
  assert.ok(loader.includes(`EXPECTED_SOURCE_SHA256 = "${hash}"`), 'execution hash must match the source');
  assert.ok(loader.indexOf('assert hashlib.sha256') < loader.indexOf('exec_module'), 'verify before import');
}

test('downloadable notebooks embed the exact canonical lab and detect stale source', () => {
  for (const book of books) {
    checkSource(book);
    const stale = structuredClone(book);
    stale.cells.find(c => c.id === 'embedded-source').source[0] += '# changed\n';
    assert.throws(() => checkSource(stale), /embedded lab drift/);
  }
});

test('EN/KO notebooks share all executable steps without saved outputs or execution errors', () => {
  const executable = book => book.cells.filter(c => c.cell_type === 'code').map(c => ({ id: c.id, source: c.source }));
  assert.deepEqual(executable(books[0]), executable(books[1]));
  assert.deepEqual(books.map(b => b.metadata.fme.locale), ['en', 'ko']);
  for (const book of books) {
    assert.equal(new Set(book.cells.map(c => c.id)).size, book.cells.length);
    assert.deepEqual(book.cells.map(c => c.cell_type), books[0].cells.map(c => c.cell_type));
    assert.equal(book.nbformat, 4);
    for (const cell of book.cells) {
      assert.doesNotMatch(cell.source.join(''), /[\x00-\x08\x0b\x0c\x0e-\x1f]/, 'unresolved control-character placeholder');
    }
    for (const cell of book.cells.filter(c => c.cell_type === 'code')) {
      assert.equal(cell.execution_count, null);
      assert.deepEqual(cell.outputs, []);
    }
    // The embedded Python module credits the lesson in its docstring. All
    // executable source and notebook setup cells must still run offline.
    const docstring = original.match(/^"""[\s\S]*?"""/)[0];
    const code = executable(book).map(c => {
      const source = c.source.join('');
      return c.id === 'embedded-source' ? source.replace(docstring, '""') : source;
    }).join('\n');
    assert.doesNotMatch(code, /requests\.|urlopen\(|pip install|torch\.hub|https?:\/\//);
  }
});
