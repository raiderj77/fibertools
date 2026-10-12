// Local-only QA with the existing workstation runtime; no application dependency.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || path.join(require('node:os').homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const base = process.env.BLANKET_TEST_BASE || 'http://127.0.0.1:4032';
assert.ok(['localhost', '127.0.0.1'].includes(new URL(base).hostname), 'QA must use a local server');
const evidence = process.env.BLANKET_EVIDENCE_DIR || path.resolve('../fibertools-blanket-evidence');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    await context.addInitScript(() => {
      Object.defineProperty(navigator, 'globalPrivacyControl', { get: () => true });
      Object.defineProperty(navigator, 'clipboard', { value: { writeText: async text => { window.__copied = text; } } });
      Object.defineProperty(navigator, 'share', { value: undefined });
    });
    await context.route('**/*', route => new URL(route.request().url()).origin === new URL(base).origin && route.request().method() === 'GET' ? route.continue() : route.abort());
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(base + '/blanket-calculator', { waitUntil: 'networkidle' });
    const storageBefore = await page.evaluate(() => ({ ...localStorage }));
    const requests = [];
    page.on('request', request => requests.push({ method: request.method(), url: request.url(), data: request.postData() }));
    const fill = async values => { for (const [id, value] of Object.entries(values)) await page.locator('#blanket-' + id).fill(String(value)); };
    const output = page.getByTestId('blanket-project-output');
    const copy = async () => {
      await page.getByRole('button', { name: /Copy$/, exact: false }).focus();
      await page.keyboard.press('Enter');
      await page.getByRole('status').filter({ hasText: 'Project output copied.' }).waitFor();
      const copied = await page.evaluate(() => window.__copied);
      assert.equal(copied, await output.locator('p').innerText());
      return copied;
    };
    assert.ok(await page.getByRole('complementary', { name: 'Hypothetical yarn example' }).isVisible());
    await fill({ 'swatch-width': 6, 'swatch-height': 6, 'swatch-grams': 12, 'skein-length': 220, 'skein-grams': 100 });
    let copied = await copy();
    assert.match(copied, /Swatch: 6 x 6 in; 12 g used/);
    assert.match(copied, /Yarn label: 220 yd; 100 g per skein/);
    assert.match(copied, /2420 yd; 1100 g; 11 whole skeins; includes 10% planning allowance/);
    assert.match(copied, /Base size: 50 × 60 in/);
    assert.match(copied, /Added overhang: 0 in; pillow tuck: none/);
    fs.mkdirSync(evidence, { recursive: true });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: path.join(evidence, 'blanket-mobile-example.png'), fullPage: true });
    await page.getByRole('complementary', { name: 'Hypothetical yarn example' }).screenshot({ path: path.join(evidence, 'blanket-mobile-example-detail.png') });
    await output.screenshot({ path: path.join(evidence, 'blanket-mobile-output-detail.png') });
    for (const width of [320, 390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `reflow at ${width}px`);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: path.join(evidence, 'blanket-desktop-example.png'), fullPage: true });
    await fill({ 'swatch-grams': 24 });
    copied = await copy();
    assert.match(copied, /Swatch: 6 x 6 in; 24 g used/);
    assert.match(copied, /4840 yd; 2200 g; 22 whole skeins/);
    await fill({ 'swatch-width': 12, 'swatch-height': 8, 'skein-length': 300, 'skein-grams': 150 });
    copied = await copy();
    assert.match(copied, /Swatch: 12 x 8 in; 24 g used/);
    assert.match(copied, /Yarn label: 300 yd; 150 g per skein/);
    assert.match(copied, /1650 yd; 825 g; 6 whole skeins/);
    await page.getByLabel('Custom', { exact: true }).check();
    await fill({ 'custom-width': '50.00001', 'custom-length': 70, overhang: 2 });
    await page.getByLabel(/Pillow tuck/).check();
    copied = await copy();
    assert.match(copied, /Entered custom size: 50.00001 x 70 in/);
    assert.match(copied, /Added overhang: 2 in; pillow tuck: 20 in/);
    assert.match(copied, /Calculated target: 54 × 92 in/);
    await page.getByRole('button', { name: 'Meters / cm', exact: true }).click();
    copied = await copy();
    assert.match(copied, /Swatch: 30.48 x 20.32 cm; 24 g used/);
    assert.match(copied, /Yarn label: 274.32 m; 150 g per skein/);
    assert.match(copied, /Added overhang: 5.08 cm; pillow tuck: 50.8 cm/);
    await page.getByRole('button', { name: 'Share Blanket Calculator', exact: true }).click();
    const shared = new URL(await page.evaluate(() => window.__copied));
    assert.deepEqual([...shared.searchParams.keys()].sort(), ['utm_campaign', 'utm_content', 'utm_medium', 'utm_source']);
    assert.equal(shared.hash, '');
    assert.equal(shared.pathname, '/blanket-calculator');
    await fill({ 'swatch-grams': '' });
    assert.equal(await output.count(), 0);
    assert.equal(await page.getByRole('button', { name: /Copy$/ }).count(), 0);
    assert.ok(await page.getByRole('alert').filter({ hasText: 'Check the dimensions' }).isVisible());
    assert.deepEqual(await page.evaluate(() => ({ ...localStorage })), { ...storageBefore, 'ft-units': 'metric' }, 'only the existing unit preference may change');
    assert.deepEqual(requests.filter(request => request.method !== 'GET' || request.data), []);
    assert.ok(requests.every(request => !/swatch|50\.00001|274\.32/.test(request.url)), 'no input values in requests');
    assert.deepEqual(errors, []);
    const result = { passed: true, synthetic: true, checks: ['example math against rendered results', 'keyboard copy', 'all swatch/label edits', 'custom size/overhang/tuck', 'unit conversion', 'invalid group hides copy', 'share URL minimization', 'no new storage or input sends', '320/390/1440px reflow'], pageErrors: errors };
    fs.writeFileSync(path.join(evidence, 'browser-results.json'), JSON.stringify(result, null, 2));
    console.log(JSON.stringify(result));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
