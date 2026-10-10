import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import test from 'node:test';
import postcss from 'postcss';
import tailwind from 'tailwindcss';
import nested from 'postcss-nested';

test('patched selectors preserve the baseline Tailwind and nested CSS output', async () => {
  const input = '@tailwind utilities;\n.card { & > .child, &:hover { color: red; } @media (min-width: 40rem) { & .nested { display: grid; } } }';
  const config = {
    content: [{ raw: 'hover:bg-red-500 md:grid-cols-2 [&>a]:underline group-hover:opacity-50 dark:text-white w-[calc(100%-1rem)]', extension: 'html' }],
    darkMode: 'class', corePlugins: { preflight: false },
  };
  const result = await postcss([tailwind(config), nested()]).process(input, { from: undefined });
  // Captured with unchanged main's Tailwind 3.4.19 / selector-parser 6.1.4.
  assert.equal(createHash('sha256').update(result.css).digest('hex'), 'e160822170962519207682f882f236aaa2d26c6329f69974c83d5f7c808143f3');
  assert.deepEqual(result.warnings(), []);
});

test('both actual CSS consumers resolve the patched selector parser', () => {
  const require = createRequire(import.meta.url);
  for (const consumer of ['tailwindcss', 'postcss-nested']) {
    const fromConsumer = createRequire(require.resolve(`${consumer}/package.json`));
    assert.equal(fromConsumer('postcss-selector-parser/package.json').version, '7.1.6');
  }
});
