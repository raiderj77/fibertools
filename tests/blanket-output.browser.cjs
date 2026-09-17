// Run against a local production build: node tests/blanket-output.browser.cjs
// Uses the existing workstation QA runtime; adds no application dependency.
const fs=require('node:fs'),assert=require('node:assert/strict');
const{chromium}=require(process.env.PLAYWRIGHT_MODULE || require('node:path').join(require('node:os').homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
(async()=>{const b=await chromium.launch({channel:'chrome',headless:true});try{
const context=await b.newContext({viewport:{width:390,height:844}});
await context.addInitScript(()=>{Object.defineProperty(navigator,'clipboard',{value:{writeText:async text=>{window.__copied=text}}});window.print=()=>{window.__printed=true};});
const p=await context.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto((process.env.BLANKET_TEST_BASE || 'http://localhost:4031')+'/blanket-calculator');await p.waitForTimeout(500);
assert.equal(await p.locator('meta[name=\"dateModified\"]').getAttribute('content'),'2026-09-16');assert.equal(await p.locator('time[datetime=\"2026-09-16\"]').count(),1);
await p.getByLabel('Custom',{exact:true}).check();
async function fill(values){for(const[id,v]of Object.entries(values))await p.locator('#'+id).fill(String(v));await p.waitForTimeout(60)}
const requests=[];p.on('request',r=>requests.push({method:r.method(),url:r.url(),data:r.postData()}));
const storageBefore=await p.evaluate(()=>Object.keys(localStorage).sort());
await fill({'blanket-custom-width':40,'blanket-custom-length':60,'blanket-gauge-stitches':16,'blanket-gauge-rows':20,'blanket-gauge-over':4,'blanket-stitch-multiple':6,'blanket-multiple-extra':2});
const output=p.getByTestId('blanket-project-output');const text=()=>output.innerText();
assert.match(await text(),/Nearest compatible; 158 stitches; 300 rows/);assert.match(await text(),/39.5 × 60 in/);assert.match(await text(),/narrower than requested/);assert.match(await text(),/Yarn estimate not calculated/);
assert.equal(await p.getByRole('radio').count(),2);
await p.getByRole('radio',{name:'Meets or exceeds target',exact:true}).focus();await p.keyboard.press('Space');
assert.match(await text(),/Meets or exceeds target; 164 stitches; 300 rows/);assert.match(await text(),/approximately 41 × 60 in/);assert.match(await text(),/Yarn-estimate size basis: 40 × 60 in/);
await p.getByRole('button',{name:'📋 Copy',exact:true}).click();assert.equal(await p.evaluate(()=>window.__copied),(await text()).replace(/^Selected project output\s*/,''));
await p.getByRole('button',{name:'🖨️ Print',exact:true}).click();assert.equal(await p.evaluate(()=>window.__printed),true);
await p.emulateMedia({media:'print'});assert.equal(await p.getByRole('radio').first().isVisible(),false);assert.ok(await output.isVisible());assert.match(await text(),/164 stitches/);await p.screenshot({path:'blanket-print.png',fullPage:true});await p.emulateMedia({media:'screen'});
await fill({'blanket-custom-width':41});assert.equal(await p.getByRole('radio').count(),0);
await fill({'blanket-custom-width':40});assert.ok(await p.getByRole('radio',{name:'Nearest compatible (default)',exact:true}).isChecked());assert.match(await text(),/158 stitches/);
await fill({'blanket-custom-width':40.5});assert.equal(await p.getByRole('radio').count(),0);assert.doesNotMatch(await text(),/Warning:/);
await fill({'blanket-custom-width':41.05});assert.equal(await p.getByRole('radio').count(),2);await p.getByRole('radio',{name:'Meets or exceeds target',exact:true}).check();assert.match(await text(),/170 stitches/);
await fill({'blanket-custom-width':40,'blanket-swatch-width':4,'blanket-swatch-height':4,'blanket-swatch-grams':10});
assert.match(await text(),/3630 yd; 1650 g; 17 whole skeins/);await p.getByRole('radio',{name:'Meets or exceeds target',exact:true}).check();assert.match(await text(),/3630 yd; 1650 g; 17 whole skeins/);
await p.locator('#blanket-yarn-weight').selectOption('dk');assert.ok(await p.getByRole('radio',{name:'Nearest compatible (default)',exact:true}).isChecked());assert.match(await text(),/3630 yd; 1650 g; 17 whole skeins/);
assert.deepEqual(await p.evaluate(()=>Object.keys(localStorage).sort()),storageBefore);
await p.getByRole('button',{name:'Meters / cm',exact:true}).click();assert.match(await text(),/158 stitches; 300 rows/);assert.match(await text(),/100.33 × 152.4 cm/);await p.getByRole('radio',{name:'Meets or exceeds target',exact:true}).check();assert.match(await text(),/104.14 × 152.4 cm/);
await fill({'blanket-stitch-multiple':''});assert.equal(await output.count(),0);await p.getByRole('alert').filter({hasText:'extras require a multiple'}).waitFor();
await fill({'blanket-multiple-extra':''});assert.match(await text(),/160 stitches/);
await fill({'blanket-gauge-stitches':0});assert.equal(await output.count(),0);
assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
assert.equal(errors.length,0);
assert.deepEqual(requests.filter(r=>r.method!=='GET'),[],'no input-triggered sends');
assert.ok(requests.every(r=>!r.url.includes('41.05')&&!r.url.includes('gaugeStitches')&&!r.data));
await p.reload();await p.waitForTimeout(300);assert.equal(await p.getByRole('radio').count(),0);
fs.writeFileSync('blanket-browser-evidence.json',JSON.stringify({base:process.env.BLANKET_TEST_BASE || 'http://localhost:4031',passed:true,checks:['primary/alternative','dedup/exact/above','fractional ceiling','keyboard','copy selected','print selected','A-B-A reset','yarn unchanged','unit equivalents','orphan/zero validation','mobile','no input POST/storage preference','reload'],requests:requests.map(r=>({method:r.method,origin:new URL(r.url).origin})),pageErrors:errors},null,2));console.log('Blanket browser acceptance checks passed.');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
