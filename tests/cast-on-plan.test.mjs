import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { buildCastOnPlan } from '../src/lib/cast-on-plan.mjs';
const valid = { desiredWidth: '50', gaugeStitches: '18', gaugeInches: '4', stitchMultiple: '' };
test('cast-on uses nearest stitch without a multiple, upward rounding with one, and actual width', () => {
  assert.deepEqual(buildCastOnPlan(valid), { ok: true, stsPerInch: 4.5, rawCastOn: 225, roundedCastOn: 225, hasMultiple: false, actualWidth: 50 });
  assert.equal(buildCastOnPlan({ ...valid, stitchMultiple: '6' }).roundedCastOn, 228);
  assert.equal(buildCastOnPlan({ ...valid, desiredWidth: '1', gaugeStitches: '10' }).roundedCastOn, 3);
  assert.equal(buildCastOnPlan({ desiredWidth: '2.1', gaugeStitches: '1', gaugeInches: '0.3', stitchMultiple: '7' }).roundedCastOn, 7);
});
test('cast-on rejects malformed, empty, fractional multiple, zero-result and extreme inputs', () => {
  for (const field of ['desiredWidth', 'gaugeStitches', 'gaugeInches']) {
    for (const value of ['', ' ', '2oops', 0, -1, NaN, Infinity, null, true]) {
      assert.equal(buildCastOnPlan({ ...valid, [field]: value }).ok, false, `${field}: ${value}`);
    }
  }
  for (const stitchMultiple of ['2.5', '-1', '0', '1001', 'x', Infinity, null]) assert.equal(buildCastOnPlan({ ...valid, stitchMultiple }).ok, false);
  assert.equal(buildCastOnPlan({ ...valid, desiredWidth: 0.001 }).ok, false);
  assert.equal(buildCastOnPlan({ ...valid, desiredWidth: 1001 }).ok, false);
  assert.equal(buildCastOnPlan({ ...valid, gaugeStitches: 1001 }).ok, false);
  assert.equal(buildCastOnPlan({ ...valid, gaugeInches: 101 }).ok, false);
  assert.equal(buildCastOnPlan({ ...valid, gaugeInches: 0.00001 }).ok, false);
});
test('cast-on ceil count is sufficient and minimal for positive repeat sizes', () => {
  for (let tenth = 1; tenth <= 1000; tenth += 1) for (let multiple = 1; multiple <= 24; multiple += 1) {
    const result = buildCastOnPlan({ desiredWidth: tenth / 10, gaugeStitches: 4, gaugeInches: 4, stitchMultiple: multiple });
    assert.equal(result.ok, true);
    assert.equal(result.roundedCastOn % multiple, 0);
    assert.ok(result.roundedCastOn + 1e-10 >= tenth / 10);
    assert.ok(result.roundedCastOn - multiple < tenth / 10);
    assert.equal(result.actualWidth, result.roundedCastOn);
  }
});
test('cast-on UI uses helper, labels inputs, announces errors and labels its width as modeled', () => {
  const source = fs.readFileSync('src/app/cast-on-calculator/CastOnCalculatorTool.tsx', 'utf8');
  assert.match(source, /buildCastOnPlan/);
  assert.doesNotMatch(source, /parseInt\(|parseFloat\(/);
  assert.match(source, /role="alert"/);
  assert.match(source, /Modeled width at rounded count/);
  for (const id of ['cast-on-width', 'cast-on-gauge', 'cast-on-span', 'cast-on-multiple']) {
    assert.ok(source.includes(`htmlFor="${id}"`));
    assert.ok(source.includes(`id="${id}"`));
  }
});
