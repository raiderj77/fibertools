import test from 'node:test';
import assert from 'node:assert/strict';
import { THREAD_CONVERSION_TABLE, lookupThreadCode } from '../src/lib/thread-conversion.mjs';
test('legacy invented Cosmo and wrong Anchor mappings cannot escape the source gate',()=>{
 assert.ok(THREAD_CONVERSION_TABLE.every(row=>row.cosmo===''));
 assert.equal(lookupThreadCode('cosmo','346a').status,'unknown');
 assert.equal(lookupThreadCode('dmc','321').entry.anchor,'47');
 assert.equal(lookupThreadCode('dmc','414').entry.anchor,'235');
 assert.equal(lookupThreadCode('dmc','ecru').status,'unknown');
});
