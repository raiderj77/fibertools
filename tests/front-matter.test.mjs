import assert from 'node:assert/strict';
import test from 'node:test';
import { parseFrontMatter } from '../src/lib/front-matter.mjs';

test('parses the quoted strings, arrays, nested FAQ objects and booleans used by content', () => {
  const { data, content } = parseFrontMatter('---\ntitle: "A title: with punctuation"\ndate: "2026-10-10"\nkeywords: [yarn, "two words"]\nfaq:\n  - question: "How?"\n    answer: "Measure first."\nrelated:\n  - /yarn-calculator\nfeatured: false\nMeta Title: A heading\n---\n# Body\n---\nUnchanged body.\n');
  assert.deepEqual(data, { title: 'A title: with punctuation', date: '2026-10-10', keywords: ['yarn', 'two words'], faq: [{ question: 'How?', answer: 'Measure first.' }], related: ['/yarn-calculator'], featured: false, 'Meta Title': 'A heading' });
  assert.equal(content, '# Body\n---\nUnchanged body.\n');
});

test('preserves multiline scalars, comments, unicode and empty front matter', () => {
  const parsed = parseFrontMatter('---\ntitle: "Café 🧶" # comment\ndescription: |-\n  First line.\n  Second line.\nsummary: >-\n  Folded\n  words.\n---\nBody');
  assert.deepEqual(parsed.data, { title: 'Café 🧶', description: 'First line.\nSecond line.', summary: 'Folded words.' });
  assert.deepEqual(parseFrontMatter('---\n# empty\n---\nBody'), { data: {}, content: 'Body' });
});

test('preserves dates, numeric values, null and aliases without code execution', () => {
  const parsed = parseFrontMatter('---\ndate: 2026-10-10\ncount: 12\nratio: 1.5\nmissing: null\nbase: &base\n  enabled: true\ncopy: *base\n---\n');
  assert.equal(parsed.data.date.toISOString(), '2026-10-10T00:00:00.000Z');
  assert.equal(parsed.data.count, 12);
  assert.equal(parsed.data.ratio, 1.5);
  assert.equal(parsed.data.missing, null);
  assert.deepEqual(parsed.data.copy, { enabled: true });
});

test('handles BOM, CRLF and missing front matter without changing body bytes', () => {
  assert.deepEqual(parseFrontMatter('\uFEFF---\r\ntitle: Example\r\n---\r\nBody\r\n'), { data: { title: 'Example' }, content: 'Body\r\n' });
  assert.deepEqual(parseFrontMatter('# Heading\r\nBody'), { data: {}, content: '# Heading\r\nBody' });
  assert.deepEqual(parseFrontMatter('---\n---'), { data: {}, content: '' });
});

for (const input of ['---\ntitle: missing close', '---\ntitle: [broken\n---\nBody', '---\ntitle: first\ntitle: second\n---\n', '---\n- list\n---\n', '---\nplain scalar\n---\n', '---js\n({ title: process.exit() })\n---\n', '---\nfn: !!js/function "function () {}"\n---\n']) {
  test(`rejects malformed or unsupported front matter ${JSON.stringify(input)}`, () => assert.throws(() => parseFrontMatter(input)));
}
