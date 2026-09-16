import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import ts from 'typescript';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import html from 'remark-html';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
const require=createRequire(import.meta.url);
function load(file,mocks={}) {const exports={};vm.runInNewContext(ts.transpileModule(readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText,{exports,require:name=>mocks[name]??require(name)});return exports;}
const registry=load('src/lib/guides.ts');
const component=load('src/app/guides/[slug]/page.tsx',{'next/link':({children,...props})=>React.createElement('a',props,children),'next/image':({unoptimized,...props})=>React.createElement('img',props),'next/navigation':{notFound(){throw new Error('not found')}},'@/lib/guides':registry,'@/lib/tools':{getToolBySlug:()=>null},remark:{remark},'remark-gfm':remarkGfm,'remark-html':html});
const expectations={
 'blanket-yarn-guide':['4,125','19 skeins','Check how sensitive'],
 'cast-on-methods-guide':['10.67','18 stitches','Choose the method'],
 'yarn-stash-management-guide':['92.4','84.5','Keep an identifiable stash record'],
 'knitting-gauge-guide':['32 inches','17.14','250 stitches'],
};
for(const [slug,needles] of Object.entries(expectations))test(`${slug}: full rendered article, image, sources and truthful identity`,async()=>{
 const guide=registry.getGuideBySlug(slug);const rendered=renderToStaticMarkup(await component.default({params:Promise.resolve({slug})}));
 const metadata=await component.generateMetadata({params:Promise.resolve({slug})});
 assert.equal(metadata.alternates.canonical,`/guides/${slug}`);assert.equal(metadata.openGraph.publishedTime,guide.date);assert.equal(metadata.openGraph.modifiedTime,'2026-09-16');
 assert.ok(guide.sections.length>=6);for(const needle of needles)assert.ok(rendered.includes(needle),needle);
 assert.equal((rendered.match(/<h1\b/g)||[]).length,1);assert.ok(rendered.includes('AI-assisted explanation'));assert.ok(!rendered.includes('Human editorial approval is pending'));assert.ok(!rendered.includes('By <strong class="text-bark-600 dark:text-cream-400">Jason Ramirez'));
 const image=guide.sections.find(s=>s.image)?.image;assert.ok(image);for(const ext of ['src','preview'])assert.ok(existsSync('public'+image[ext]));assert.ok(rendered.includes(`alt="${image.alt.replace(/&/g,'&amp;').replace(/"/g,'&quot;')}"`));assert.ok(rendered.includes(`src="${image.src}"`));assert.ok(rendered.includes('<figcaption'));assert.ok(rendered.includes('<table>'));assert.ok(rendered.includes('https://media.craftyarncouncil.com/read_instructions.html')||rendered.includes('https://www.craftyarncouncil.com/standards/yarn-weight-system'));
 assert.ok(rendered.includes('"dateModified":"2026-09-16"'));assert.ok(rendered.includes(`"datePublished":"${guide.date}"`));assert.equal(metadata.openGraph.images,undefined);assert.ok(!rendered.includes(`"image":["https://fibertools.app${image.preview}`));assert.ok(!rendered.includes('!['));assert.ok(!rendered.includes('**'));
});
test('four narrowly scoped article update approvals do not lift freeze or authorize new routes',()=>{
 const manifest=JSON.parse(readFileSync('config/publication-approval-manifest.json','utf8'));assert.equal(manifest.freeze.status,'ACTIVE');assert.equal(manifest.freeze.ownerDecision,null);
 const approvals=manifest.approvals.filter(a=>a.contentType==='ARTICLE');assert.deepEqual(approvals.map(a=>a.route).sort(),Object.keys(expectations).map(s=>'/guides/'+s).sort());for(const a of approvals){assert.equal(a.ownerApprovalDate,'2026-09-16');assert.equal(a.reviewOrExpirationDate,'2026-11-20');assert.equal(a.indexingApproved,true);assert.match(a.approvalReference,/double check/);}
 assert.equal(registry.guides.length,23);assert.match(readFileSync('src/lib/blog-markdown.ts','utf8'),/APPROVED_BLOG_SLUGS = new Set<string>\(\)/);
});
