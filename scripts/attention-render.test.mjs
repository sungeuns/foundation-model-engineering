import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { parse } from 'parse5';

const output = process.env.SEARCH_DIST_DIR || 'dist';
const attr = (node, name) => node.attrs?.find(pair => pair.name === name)?.value;
const hasClass = (node, name) => (attr(node, 'class') || '').split(' ').includes(name);
const text = node => node.value ?? (node.childNodes || []).map(text).join('');

function elements(node) {
  return [node, ...(node.childNodes || []).flatMap(elements)];
}

for (const lang of ['en', 'ko']) {
  test(`the ${lang} attention calculator shows a consistent result before hydration`, () => {
    const file = join(output, lang === 'ko' ? 'ko' : '', 'chapter-3/self-attention-mathematics/index.html');
    const page = elements(parse(readFileSync(file, 'utf8'), { scriptingEnabled: false }));
    const calculator = elements(page.find(node => hasClass(node, 'attention-example')));

    const picker = calculator.find(node => hasClass(node, 'attention-token-picker'));
    assert.equal(picker.tagName, 'fieldset');
    assert.equal(attr(picker, 'disabled'), '');
    const tokens = elements(picker).filter(node => node.tagName === 'button');
    assert.equal(tokens.length, 4);
    assert.deepEqual(tokens.filter(node => attr(node, 'aria-pressed') === 'true').map(text), ['catQ2']);

    const inputs = calculator.filter(node => node.tagName === 'input');
    assert.deepEqual(inputs.map(node => attr(node, 'type')), ['range', 'checkbox']);
    assert.ok(inputs.every(node => attr(node, 'disabled') === ''));
    assert.equal(attr(inputs[0], 'value'), '1');
    assert.equal(attr(inputs[1], 'checked'), undefined);
    assert.match(text(calculator.find(node => hasClass(node, 'attention-output'))), /\[0\.645, 1\.241\]/);
    assert.ok(calculator.some(node => node.tagName === 'details'));

    const instructions = calculator.find(node => node.tagName === 'p' && /JavaScript|자바스크립트/.test(text(node)));
    assert.ok(instructions);
    const worksheet = elements(instructions).find(node => node.tagName === 'a');
    assert.ok(attr(worksheet, 'href').endsWith(`/labs/attention-worksheet-${lang}.pdf`));
    assert.match(text(worksheet), lang === 'ko' ? /활동지와 풀이/ : /worksheet and answer key/);
  });
}
