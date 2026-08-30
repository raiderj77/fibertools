import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function read(relativePath) {
  return readFile(new URL(relativePath, root), "utf8");
}

test("public LLM indexes do not advertise generic-fallback blog URLs", async () => {
  const [shortIndex, fullIndex] = await Promise.all([
    read("public/llms.txt"),
    read("public/llms-full.txt"),
  ]);

  for (const [name, content] of [["llms.txt", shortIndex], ["llms-full.txt", fullIndex]]) {
    assert.doesNotMatch(
      content,
      /https:\/\/fibertools\.app\/blog\//,
      `${name} must list maintained destinations instead of URLs that fall through to /guides`
    );
  }
});

test("tool pages use the maintained FiberTools counter instead of the unavailable external CTA", async () => {
  const layout = await read("src/components/ToolLayout.tsx");

  assert.doesNotMatch(layout, /mycrochetkit/i);
  assert.match(layout, /href="\/stitch-counter"/);
  assert.match(layout, /Open stitch counter/);
});
