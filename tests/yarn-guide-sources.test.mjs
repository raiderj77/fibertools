import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
const read = (slug) => readFileSync(new URL(`../src/app/${slug}/page.tsx`, import.meta.url), 'utf8');
const beginners = read('best-yarn-for-beginners');
const blankets = read('best-yarn-for-blankets');
const row = (source, name) => [...source.matchAll(/<tr\b[\s\S]*?<\/tr>/g)].map(m => m[0]).find(r => r.includes(name));
test('Comfy Cotton is a correctly sourced historical reference, not a buying row', () => {
  assert.equal(row(beginners, 'Comfy Cotton Blend'), undefined);
  assert.match(beginners, /discontinued/);
  assert.match(beginners, /Light \(3\), 50% cotton \/ 50% polyester/);
  assert.match(beginners, /https:\/\/www.lionbrand.com\/products\/comfy-cotton-blend-yarn/);
  assert.doesNotMatch(beginners, /amazonSearchUrl\("lion brand comfy cotton blend"\)/);
});
test('blanket variants retain official category and color qualifications', () => {
  assert.match(row(blankets, 'Bernat Blanket Extra'), /Jumbo \(7\)/);
  assert.doesNotMatch(row(blankets, 'Bernat Blanket Extra'), /Super Bulky \(6\)/);
  assert.match(row(blankets, 'Lion Brand Wool-Ease Thick &amp; Quick'), /Super Bulky \(6\)/);
  assert.match(row(blankets, 'Lion Brand Wool-Ease Thick &amp; Quick'), /most colors/);
  assert.doesNotMatch(blankets, /Best Worsted Weight Blanket Yarns|Lion Brand Thick & Quick|amazonSearchUrl\("lion brand thick quick"\)/);
  assert.match(blankets, /https:\/\/www.yarnspirations.com\/products\/bernat-blanket-extra-yarn-300g-10-5oz/);
  assert.match(blankets, /https:\/\/www.lionbrand.com\/products\/wool-ease-thick-and-quick-yarn/);
});
test('both guides explain evidence limits and hypothetical whole-skein quantities', () => {
  for (const source of [beginners, blankets]) {
    assert.match(source, /not hands-on testing or a ranked comparison/);
    assert.match(source, /Hypothetical/);
    assert.match(source, /unused/);
    assert.match(source, /separate swatch/i);
    assert.ok(source.indexOf('<strong>Paid links:</strong>') < source.indexOf('<a href={amazon'));
    assert.doesNotMatch(source, /Best Beginner Yarn Picks|Best Chunky Blanket Yarns|Cozy & Durable|Practical Picks/);
  }
  assert.match(beginners, /2 × 200 = 400/);
  assert.match(beginners, /400 − 350 = 50/);
  assert.match(blankets, /6 × 220 = 1,320/);
  assert.match(blankets, /1,320 − 1,250 = 70/);
});
import { existsSync } from 'node:fs';
const clean = (s) => s.replace(/<[^>]*>/g, '').replace(/<!--.*?-->/g, '').replace(/&amp;/g, '&').replace(/&#x27;|&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();
for (const slug of ['best-yarn-for-beginners', 'best-yarn-for-blankets']) {
  test(`${slug} rendered metadata, article and visible FAQ agree`, (t) => {
    const path = new URL(`../.next/server/app/${slug}.html`, import.meta.url);
    if (!existsSync(path)) {
      if (process.env.REQUIRE_BUILD_OUTPUT === '1') assert.fail('Required built guide is missing');
      return t.skip('Run after build for rendered output validation');
    }
    const html = readFileSync(path, 'utf8');
    const schemas = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(m => JSON.parse(m[1]));
    const article = schemas.find(s => s['@type'] === 'Article');
    const faq = schemas.find(s => s['@type'] === 'FAQPage');
    assert.equal(clean(html.match(/<h1[^>]*>(.*?)<\/h1>/s)[1]), article.headline);
    assert.equal(clean(html.match(/<title>(.*?)<\/title>/s)[1]), article.headline);
    for (const key of ['description', 'og:description', 'twitter:description']) {
      const meta = html.match(new RegExp(`<meta (?:name|property)="${key}" content="([^"]*)"`));
      assert.equal(clean(meta[1]), article.description);
    }
    assert.equal(article.dateModified, '2026-10-14');
    const details = [...html.matchAll(/<details\b[^>]*>(.*?)<\/details>/gs)];
    assert.equal(details.length, faq.mainEntity.length);
    for (const [i, detail] of details.entries()) {
      assert.equal(clean(detail[1].match(/<summary[^>]*>(.*?)<\/summary>/s)[1]), faq.mainEntity[i].name);
      assert.equal(clean(detail[1].match(/<p[^>]*>(.*?)<\/p>/s)[1]), faq.mainEntity[i].acceptedAnswer.text);
    }
    assert.ok(html.includes(`href="https://fibertools.app/${slug}"`));
    assert.doesNotMatch(html, /"@type":"(?:Product|Review|AggregateRating)"/);
  });
}
test('machine-readable guide listings match selection guidance', () => {
  const llms = readFileSync(new URL('../public/llms.txt', import.meta.url), 'utf8');
  assert.match(llms, /\[Yarn for Beginners: A Selection Guide\]\(https:\/\/fibertools.app\/best-yarn-for-beginners\)/);
  assert.match(llms, /\[Yarn for Blankets: A Selection Guide\]\(https:\/\/fibertools.app\/best-yarn-for-blankets\)/);
  assert.doesNotMatch(llms, /Soft, washable, budget-friendly yarn picks/);
});
