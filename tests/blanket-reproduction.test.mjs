import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { buildToolShareUrl } from '../src/lib/tool-share.mjs';

const source = fs.readFileSync('src/app/blanket-calculator/BlanketCalculatorTool.tsx', 'utf8');

test('weighed-swatch example discloses hypothetical inputs and separates allowance', () => {
  assert.match(source, /Hypothetical yarn example/);
  assert.match(source, /6 by 6 inches weighs 12 grams/);
  assert.match(source, /1,000 g before allowance/);
  assert.match(source, /1,100 g, 2,420 yards and 11 whole skeins/);
  assert.match(source, /not a measured project or a guarantee/);
});

test('copied output includes current swatch and label inputs', () => {
  assert.match(source, /Swatch: \$\{swatchWidth\} x \$\{swatchHeight\}/);
  assert.match(source, /Yarn label: \$\{skeinYards\}/);
  assert.match(source, /\$\{skeinGrams\} g per skein/);
});

test('share URL strips synthetic reproduction values and fragments', () => {
  const url = new URL(buildToolShareUrl('https://fibertools.app/blanket-calculator?swatchGrams=12&privateNote=synthetic#50x60', 'blanket-calculator'));
  assert.equal(url.pathname, '/blanket-calculator');
  assert.equal(url.hash, '');
  assert.deepEqual([...url.searchParams.keys()].sort(), ['utm_campaign','utm_content','utm_medium','utm_source']);
  assert.equal(url.searchParams.get('utm_content'), 'blanket-calculator');
});
