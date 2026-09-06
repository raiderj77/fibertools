import assert from 'node:assert/strict';
import { buildCastOnPlan } from '../src/lib/cast-on-plan.mjs';
import test from 'node:test';
import { buildC2cPlan } from '../src/lib/c2c-plan.mjs';
import { planSleeveTaper } from '../src/lib/sleeve-plan.mjs';
import { calculateGrannySquarePlan } from '../src/lib/granny-square-plan.mjs';
import { buildCircleRoundPlan } from '../src/lib/circle-round-plan.mjs';
const c2c = { swatchBlocksWide: 5, swatchBlocksTall: 5, swatchWidth: 4, swatchHeight: 4, targetWidth: 40, targetHeight: 40, yarnPerBlock: '', allowancePercent: 0 };
test('cast-on rounds the unrounded count up to the multiple', () => {
  assert.equal(buildCastOnPlan({ desiredWidth: '12.2', gaugeStitches: '4', gaugeInches: '4', stitchMultiple: '6' }).roundedCastOn, 18);
});
test('C2C rejects malformed optional yarn rather than omitting it', () => {
  for (const yarnPerBlock of ['abc', Infinity, NaN, null, true]) assert.equal(buildC2cPlan({ ...c2c, yarnPerBlock }).ok, false);
});
test('sleeve cannot taper to zero cuff stitches', () => {
  assert.equal(planSleeveTaper({ upperArmCircumference: 20, wristCircumference: 1, sleeveLength: 18, cuffLength: 2, stitchesPerInch: 0.1, rowsPerInch: 6 }).status, 'invalid');
});
test('granny exact decimal multiple does not allocate an extra column', () => {
  assert.equal(calculateGrannySquarePlan({ targetWidthInches: 2.1, targetHeightInches: 2.1, squareSizeInches: 0.3, numberOfColors: 1, yarnPerSquareYards: null }).squaresWide, 7);
});
test('circle rejects inherited property names as presets', () => {
  for (const presetKey of ['toString', 'constructor', '__proto__']) assert.equal(buildCircleRoundPlan({ presetKey, rounds: 3 }).ok, false);
});
import fs from 'node:fs';
import { buildSockCircumferencePlan } from '../src/lib/sock-plan.mjs';
test('sock clearing entered ease does not silently select zero ease', () => {
  const source = fs.readFileSync('src/app/sock-calculator/SockCalculatorTool.tsx', 'utf8');
  const expression = source.match(/easePercent: ([^\r\n]+),\r?\n    gaugeStitches:/)[1];
  const convertedEase = new Function('easePercent', `return ${expression}`)('');
  assert.equal(buildSockCircumferencePlan({ footCircumference: 9, gaugeStitches: 32, gaugeSpan: 4, stitchMultiple: 4, easePercent: convertedEase }).ok, false);
});

test('granny dimensions meaningfully above an exact multiple still round up', () => {
  assert.equal(calculateGrannySquarePlan({ targetWidthInches: 2.100001, targetHeightInches: 2.1, squareSizeInches: 0.3, numberOfColors: 1, yarnPerSquareYards: null }).squaresWide, 8);
});
