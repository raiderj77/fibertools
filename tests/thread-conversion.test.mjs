import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { THREAD_BATCH_LIMITS,THREAD_CONVERSION_TABLE,THREAD_REFERENCE_METADATA,convertThreadBatch,lookupThreadCode,searchThreadTable } from "../src/lib/thread-conversion.mjs";
test("archived Anchor chart replaces unsupported legacy claims with traceable pairs",()=>{
 assert.equal(THREAD_CONVERSION_TABLE.length,20);
 assert.equal(THREAD_REFERENCE_METADATA.sourceVerified,true);
 assert.equal(THREAD_REFERENCE_METADATA.manufacturerVerified,false);
 assert.match(THREAD_REFERENCE_METADATA.sourceUrl,/quiltersstore/);
 for(const [dmc,anchor] of [["310","403"],["321","47"],["333","110"],["414","235"]])assert.equal(lookupThreadCode("dmc",dmc).entry.anchor,anchor);
 assert.deepEqual(lookupThreadCode("anchor","400").matches.map(r=>r.dmc),["317","413"]);
 assert.ok(THREAD_CONVERSION_TABLE.every(r=>r.cosmo==="" && r.hex===""));
});
test("lookup preserves exact codes and rejects unsupported brand, blank and unknown",()=>{
 assert.equal(lookupThreadCode("cosmo","346a").status,"unknown");
 assert.equal(lookupThreadCode("dmc","31").status,"unknown");
 assert.equal(lookupThreadCode("sulky","1001").status,"invalid");
 assert.equal(lookupThreadCode("dmc","").status,"invalid");
 assert.equal(searchThreadTable("31","dmc",30).length,4);
 const batch=convertThreadBatch({input:"403,400;999 400",sourceBrand:"anchor"});
 assert.deepEqual(batch.results.map(r=>r.lookup.status),["found","ambiguous","unknown","ambiguous"]);
});
test("batch bounds remain enforced before generation",()=>{
 for(const result of [convertThreadBatch({input:"3".repeat(THREAD_BATCH_LIMITS.maximumCharacters+1),sourceBrand:"dmc"}),convertThreadBatch({input:Array(102).fill("310").join(","),sourceBrand:"dmc"}),convertThreadBatch({input:null,sourceBrand:"dmc"})])assert.equal(result.status,"invalid");
 assert.equal(convertThreadBatch({input:"",sourceBrand:"dmc"}).status,"empty");
});
test("public lookup is labeled, source-linked, and explicit about archived subset",()=>{
 const text=fs.readFileSync("src/app/thread-converter/ThreadConverterTool.tsx","utf8");
 assert.match(text,/htmlFor="thread-source-code"/);assert.match(text,/aria-live="polite"/);assert.match(text,/archived Anchor/);assert.match(text,/Cosmo mappings are unavailable/);assert.match(text,/sourceUrl/);
});
