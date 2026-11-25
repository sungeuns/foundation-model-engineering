import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('receipt downloads and both answer tables reproduce the recorded run', () => {
  const directory = 'public/labs/2026-11';
  const report = JSON.parse(readFileSync(directory + '/receipt-grounding-cpu.json', 'utf8'));
  const imageDirectory = 'src/assets/images/chapter-11';
  const sum = file => createHash('sha256').update(readFileSync(file)).digest('hex');
  const files = {
    'receipt_grounding.py': sum('public/labs/receipt_grounding.py'),
    'receipt-grounding-cpu.json': sum(directory + '/receipt-grounding-cpu.json'),
    LICENSE: sum('LICENSE'),
  };
  for (const item of report.cases) {
    assert.equal(sum(imageDirectory + '/' + item.file), item.sha256);
    files[item.file] = item.sha256;
  }
  const inspectZip = [
    'import hashlib, json, sys, zipfile',
    'with zipfile.ZipFile(sys.argv[1]) as archive:',
    '    print(json.dumps({name: hashlib.sha256(archive.read(name)).hexdigest() for name in archive.namelist()}))',
  ].join('\n');
  const python = process.platform === 'win32' ? 'python' : 'python3';
  const archive = execFileSync(python, ['-c', inspectZip, directory + '/receipt-grounding.zip']);
  assert.deepEqual(JSON.parse(archive), files);

  for (const lang of ['', 'ko/']) {
    const text = readFileSync('src/pages/' + lang + 'chapter-11/vision-language-bridges.mdx', 'utf8');
    for (const item of report.cases) {
      const row = text.split('\n').find(line => line.startsWith('|') && line.includes('download="' + item.file + '"'));
      assert.ok(row, item.file);
      assert.ok(row.endsWith('| `' + item.raw_text.trim() + '` |'), row);
    }
  }
});

test('both editions report the same four measured responses to quantity edits', () => {
  const load = path => JSON.parse(readFileSync(path, 'utf8'));
  const { cases: originals, ...baseline } = load('public/labs/2026-11/receipt-grounding-cpu.json');
  const { cases: edits, ...settings } = load('src/components/chapter-11/receipt-quantity-outputs.json');
  assert.deepEqual(settings, baseline);
  const missing = originals.find(item => item.file === 'receipt-missing.png');
  const cases = [{ ...missing, paper_packs: 1, pencil_boxes: 1 }, ...edits];
  const answers = new Map(cases.map(item => [`${item.paper_packs},${item.pencil_boxes}`, item.raw_text.trim()]));
  assert.deepEqual([...answers.keys()].sort(), ['1,1', '1,8', '7,1', '7,8']);
  assert.equal(new Set(cases.map(item => item.sha256)).size, 4);

  for (const lang of ['', 'ko/']) {
    const mdx = readFileSync('src/pages/' + lang + 'chapter-11/vision-language-bridges.mdx', 'utf8');
    const rows = mdx.split('\n').filter(line => line.startsWith('| `') && line.includes(' pack`'));
    const expected = [1, 7].map(paper => [paper + ' pack', answers.get(paper + ',1'), answers.get(paper + ',8')]);
    assert.deepEqual(rows.map(row => [...row.matchAll(/`([^`]+)`/g)].map(match => match[1])), expected);
  }
});
