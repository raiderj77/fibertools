import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import test from 'node:test';

test('locked security versions remove the vulnerable parser and CLI chain', () => {
  const { packages } = JSON.parse(fs.readFileSync('package-lock.json', 'utf8'));
  const exact = { next: '15.5.27', 'eslint-config-next': '15.5.27', sharp: '0.35.5', 'source-map-js': '1.2.2', 'postcss-selector-parser': '7.1.6' };
  for (const [name, version] of Object.entries(exact)) {
    const entries = Object.entries(packages).filter(([path]) => path.endsWith('/node_modules/' + name) || path === 'node_modules/' + name);
    assert.ok(entries.length > 0, name);
    for (const [, entry] of entries) assert.equal(entry.version, version, name);
  }
  for (const [path, entry] of Object.entries(packages)) {
    assert.doesNotMatch(path, /node_modules\/(?:gray-matter|sprintf-js)$/);
    if (path.endsWith('/js-yaml')) assert.ok(!entry.version.startsWith('3.'), 'no js-yaml 3 CLI chain');
    if (entry.resolved) assert.equal(new URL(entry.resolved).hostname, 'registry.npmjs.org');
  }
});

test('Next resolves the patched Sharp binary and can resize a synthetic image', async () => {
  const require = createRequire(import.meta.url);
  const fromNext = createRequire(require.resolve('next/package.json'));
  const sharp = fromNext('sharp');
  assert.equal(sharp.versions.sharp, '0.35.5');
  assert.equal(sharp.versions.rsvg, '2.63.2');
  const input = await sharp({ create: { width: 2, height: 2, channels: 3, background: { r: 255, g: 0, b: 0 } } }).png().toBuffer();
  const output = await sharp(input).resize(1, 1).png().toBuffer();
  const metadata = await sharp(output).metadata();
  assert.equal(metadata.width, 1);
  assert.equal(metadata.height, 1);
  assert.equal(metadata.format, 'png');
});
