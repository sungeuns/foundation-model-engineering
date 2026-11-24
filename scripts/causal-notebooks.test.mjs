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

test('the recorded November runs retain the released source and independently measured outputs', () => {
  const labs = path.join(ROOT, 'public/labs');
  const seed7 = JSON.parse(fs.readFileSync(path.join(labs, 'verified-seed-7.json')));
  // Digests of the two starter assets published in the 2026-11-labs release.
  const inputs = {
    en: '7b1b566af2a034b17c27066465fa46373c073c9110208d13101704fd231bac66',
    ko: 'abcb60809f0769605bfc16fc5c02f70b55d2440588e4c3bd5b4e934e1aff64da',
  };
  for (const [lang, digest] of Object.entries(inputs)) {
    const name = 'tiny-decoder-worked-' + lang + '.ipynb';
    const book = JSON.parse(fs.readFileSync(path.join(labs, '2026-11', name)));
    const code = book.cells.filter(c => c.cell_type === 'code');
    assert.equal(code.length, 10);
    assert.deepEqual(code.map(c => c.execution_count), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    for (const cell of code) {
      for (const item of cell.outputs) {
        if (item.output_type === 'stream') assert.equal(item.name, 'stdout');
        else {
          assert.equal(item.output_type, 'execute_result');
          assert.deepEqual(Object.keys(item.data), ['text/plain']);
        }
      }
    }
    assert.equal(book.metadata.fme.locale, lang);
    assert.equal(book.metadata.fme.recorded_run.input_notebook_sha256, digest);
    assert.equal(book.metadata.fme.recorded_run.device, 'cpu');
    const embedded = code.find(c => c.id === 'embedded-source').source.join('');
    const [, source] = embedded.match(/^SOURCE = r'''([\s\S]+)'''\n?$/);
    assert.equal(createHash('sha256').update(source).digest('hex'), seed7.config.code_hash);
    const output = id => code.find(c => c.id === id).outputs
      .filter(o => o.output_type === 'stream').map(o => o.text.join('')).join('');
    assert.match(output('validity-gates'), /'causal_invariance': True, 'exact_resume': True/);
    assert.match(output('break-checkpoint'), /'corruption_rejected': True/);
    const measured = JSON.parse(output('compare-results').match(/^\{[\s\S]+?\n\}/)[0]);
    for (const key of ['test_nats', 'self_only_test_nats', 'greedy_test_token_accuracy']) {
      assert.equal(measured[key], seed7[key]);
    }
    const route = lang === 'ko' ? 'src/pages/ko' : 'src/pages';
    const preview = 'https://nbviewer.org/urls/sungeuns.github.io/foundation-model-engineering/labs/2026-11/' + name;
    assert.ok(fs.readFileSync(path.join(ROOT, route, 'chapter-7/tiny-decoder-lab.mdx'), 'utf8').includes(preview));
  }
});
