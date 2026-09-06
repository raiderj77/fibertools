import test from "node:test";
import assert from "node:assert/strict";
import { parseCounterState, nextCounterValue } from "../src/lib/stitch-counter-state.mjs";

test("restores only bounded, typed counter records", () => {
  const valid = { counters: [{ id: "one", name: "Rows", count: 12 }], reminders: [], milestoneEvery: 0 };
  assert.deepEqual(parseCounterState(valid), valid);
  for (const count of ["12", -1, 1.5, null, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
    assert.equal(parseCounterState({ ...valid, counters: [{ ...valid.counters[0], count }] }), null);
  }
  assert.equal(parseCounterState({ ...valid, counters: [...valid.counters, ...valid.counters] }), null);
  assert.equal(parseCounterState({ ...valid, reminders: [{ id: "r", row: 1.5, note: "Test" }] }), null);
});

test("counter arithmetic remains integral at its boundary", () => {
  assert.equal(nextCounterValue(12, 5), 17);
  assert.equal(nextCounterValue(0, -1), 0);
  assert.equal(nextCounterValue(Number.MAX_SAFE_INTEGER, 1), null);
  assert.equal(nextCounterValue("12", 1), null);
});

test("legacy long reminder text does not discard valid saved counters", () => {
  const data = { counters: [{id:"a",name:"Rows",count:42}], reminders:[{id:"r",row:45,note:"x".repeat(1001)}],milestoneEvery:1000 };
  assert.deepEqual(parseCounterState(data), data);
});
