import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { socialCards } from '../src/data/social-cards.js';

test('the receipt preview pairs the missing-total input bytes with its recorded reply', () => {
  const report = JSON.parse(readFileSync('public/labs/2026-11/receipt-grounding-cpu.json', 'utf8'));
  const example = report.cases.find(row => row.file === 'receipt-missing.png');
  for (const card of Object.values(socialCards['/articles/receipt-grounding'])) {
    const svg = readFileSync('public' + card.image.replace(/\.png$/, '.svg'), 'utf8');
    const image = svg.match(/<image [^>]*href="data:image\/png;base64,([^"]+)"/);
    assert.ok(image, card.image);
    const png = Buffer.from(image[1], 'base64');
    assert.equal(createHash('sha256').update(png).digest('hex'), example.sha256);
    assert.ok(svg.includes('>MISSING</text>'));
    assert.ok(svg.includes('>' + example.raw_text.trim() + '</text>'));
    assert.ok(card.alt.includes(report.model.split('/').pop()));
  }
});

test('receipt downloads and both answer tables reproduce the recorded run', () => {
  const directory = 'public/labs/2026-11';
  const report = JSON.parse(readFileSync(directory + '/receipt-grounding-cpu.json', 'utf8'));
  const imageDirectory = 'src/assets/images/chapter-11';
  const sum = file => createHash('sha256').update(readFileSync(file)).digest('hex');
  const files = {
    'receipt_grounding.py': sum('public/labs/receipt_grounding.py'),
    'receipt-grounding-cpu.json': sum(directory + '/receipt-grounding-cpu.json'),
    'receipt_quantity_probe.py': sum('src/components/chapter-11/receipt_quantity_probe.py'),
    'receipt-quantity-outputs.json': sum('src/components/chapter-11/receipt-quantity-outputs.json'),
    'receipt_order_probe.py': sum('src/components/chapter-11/receipt_order_probe.py'),
    'receipt-order-outputs.json': sum('src/components/chapter-11/receipt-order-outputs.json'),
    LICENSE: sum('LICENSE'),
  };
  for (const item of report.cases) {
    assert.equal(sum(imageDirectory + '/' + item.file), item.sha256);
    files[item.file] = item.sha256;
  }
  const orderRun = JSON.parse(readFileSync('src/components/chapter-11/receipt-order-outputs.json', 'utf8'));
  assert.equal(orderRun.cases.length, 8);
  for (const row of orderRun.cases) files['order-inputs/' + row.file] = row.sha256;
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
