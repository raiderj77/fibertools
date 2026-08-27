import test from "node:test";
import assert from "node:assert/strict";
import {
  ISSUE_CODES,
  MAX_DESIGNER_ROUNDS,
  VERSION_CHANGE_CODES,
  analyzeDesignerPattern,
  buildDesignerReportModel,
  comparePatternVersions,
  createCorrection,
  createDesignerProject,
  exportIssuesCsv,
  exportProjectJson,
  restoreProjectJson,
  safeCsvCell,
} from "../src/lib/stitchproof-designer.mjs";
import {
  correctEvenPattern,
  duplicateAndMissingPattern,
  previousVersionPattern,
  revisedVersionPattern,
  unsupportedNestedRepeatPattern,
} from "./fixtures/stitchproof-designer-fixtures.mjs";

test("designer analysis preserves the free boundary and handles 20 or 100 deterministic rounds", () => {
  const twenty = analyzeDesignerPattern(correctEvenPattern(20), 1);
  const hundred = analyzeDesignerPattern(correctEvenPattern(100), 1);
  const tooMany = analyzeDesignerPattern(correctEvenPattern(MAX_DESIGNER_ROUNDS + 1), 1);

  assert.equal(twenty.error, null);
  assert.equal(twenty.results.length, 20);
  assert.equal(twenty.summary.passedRounds, 20);
  assert.equal(hundred.error, null);
  assert.equal(hundred.results.length, 100);
  assert.equal(hundred.summary.passedRounds, 100);
  assert.match(tooMany.error, /up to 200 rounds/);
  assert.equal(tooMany.results.length, 0);
});

test("reports duplicate and missing round numbers with structured issue codes", () => {
  const analyzed = analyzeDesignerPattern(duplicateAndMissingPattern, 1);
  const report = buildDesignerReportModel({ analysis: analyzed });
  assert.equal(analyzed.error, null);
  assert.deepEqual(
    [...new Set(analyzed.numberingIssues.map((entry) => entry.code))].sort(),
    [ISSUE_CODES.DUPLICATE_ROUND_NUMBER, ISSUE_CODES.MISSING_ROUND_NUMBER].sort(),
  );
  assert.equal(
    analyzed.numberingIssues.find((entry) => entry.code === ISSUE_CODES.MISSING_ROUND_NUMBER).missingRound,
    2,
  );
  assert.ok(analyzed.results[0].issueCodes.includes(ISSUE_CODES.DUPLICATE_ROUND_NUMBER));
  assert.ok(analyzed.results[2].issueCodes.includes(ISSUE_CODES.MISSING_ROUND_NUMBER));
  assert.equal(report.issueRows.filter((entry) => entry.code === ISSUE_CODES.DUPLICATE_ROUND_NUMBER).length, 1);
  assert.equal(report.issueRows.filter((entry) => entry.code === ISSUE_CODES.MISSING_ROUND_NUMBER).length, 1);
});

test("keeps original parse values immutable while a repeat correction resolves an issue", () => {
  const source = "Round 8: (5 sc, inc) x 5 [42]";
  const correction = createCorrection({ lineIndex: 0, repeatCount: 6, note: "Repeat count corrected from draft." });
  const analyzed = analyzeDesignerPattern(source, 36, [correction]);
  const [result] = analyzed.results;

  assert.equal(result.original.repeatCount, 5);
  assert.equal(result.original.consumed, 30);
  assert.equal(result.original.created, 35);
  assert.equal(result.effective.repeatCount, 6);
  assert.equal(result.effective.consumed, 36);
  assert.equal(result.effective.created, 42);
  assert.equal(result.status, "correct");
  assert.equal(result.correctionEffect, "resolved");
  assert.equal(analyzed.corrections[0].effect, "resolved");
  assert.equal(result.source, source);
  assert.ok(Object.isFrozen(result.original));
  assert.throws(() => {
    result.original.created = 999;
  }, TypeError);
  assert.deepEqual(analyzed.corrections[0].original, result.original);
  assert.deepEqual(analyzed.corrections[0].effective, result.effective);
});

test("a manual correction can introduce a new count issue without overwriting the original", () => {
  const source = "Round 8: (5 sc, inc) x 6 [42]";
  const analyzed = analyzeDesignerPattern(source, 36, [createCorrection({ lineIndex: 0, created: 41 })]);
  const [result] = analyzed.results;

  assert.equal(result.original.status, "correct");
  assert.equal(result.original.created, 42);
  assert.equal(result.effective.created, 41);
  assert.equal(result.status, "incorrect");
  assert.equal(result.correctionEffect, "introduced");
  assert.ok(result.issueCodes.includes(ISSUE_CODES.COUNT_MISMATCH));
});

test("anchored corrections stay with their round when another line is inserted", () => {
  const originalText = [
    "Round 1: 6 sc in magic ring [6]",
    "Round 3: (sc, inc) x 3 [9]",
  ].join("\n");
  const original = analyzeDesignerPattern(originalText);
  const target = original.results[1];
  const correction = createCorrection({
    lineIndex: 1,
    targetRoundNumber: target.round,
    targetSource: target.source,
    writtenTotal: 9,
  });
  const revisedText = [
    "Round 1: 6 sc in magic ring [6]",
    "Round 2: 6 sc [6]",
    "Round 3: (sc, inc) x 3 [9]",
  ].join("\n");
  const revised = analyzeDesignerPattern(revisedText, null, [correction]);

  assert.equal(revised.error, null);
  assert.equal(revised.results[1].corrections.length, 0);
  assert.equal(revised.results[2].corrections.length, 1);
  assert.equal(revised.corrections[0].lineIndex, 2);
  assert.equal(revised.corrections[0].targetRoundNumber, 3);
});

test("anchored corrections do not migrate to a replacement round after insertion and renumbering", () => {
  const correction = createCorrection({
    lineIndex: 1,
    targetRoundNumber: 2,
    targetSource: "Round 2: inc x 6 [12]",
    writtenTotal: 12,
  });
  const revised = analyzeDesignerPattern([
    "Round 1: 6 sc in magic ring [6]",
    "Round 2: 6 sc [6]",
    "Round 3: inc x 6 [12]",
  ].join("\n"), null, [correction]);

  assert.equal(revised.error, null);
  assert.equal(revised.results[1].corrections.length, 0);
  assert.equal(revised.results[2].corrections.length, 1);
});

test("anchor fallback retains the written total when distinguishing renumbered lines", () => {
  const correction = createCorrection({
    lineIndex: 0,
    targetRoundNumber: 2,
    targetSource: "Round 2: 6 sc [6]",
    writtenTotal: 6,
  });
  const revised = analyzeDesignerPattern([
    "Round 2: 6 sc [7]",
    "Round 3: 6 sc (6 stitches)!",
  ].join("\n"), 6, [correction]);

  assert.equal(revised.error, null);
  assert.equal(revised.results[0].corrections.length, 0);
  assert.equal(revised.results[1].corrections.length, 1);
});

test("anchor fallback follows one unique instruction body after its total changes", () => {
  const correction = createCorrection({
    lineIndex: 1,
    targetRoundNumber: 2,
    targetSource: "Round 2: (sc, inc) x 3 [9]",
    writtenTotal: 10,
  });
  const revised = analyzeDesignerPattern([
    "Round 1: 6 sc in magic ring [6]",
    "Round 2: 6 sc [6]",
    "Round 3: (sc, inc) x 3 [10]",
  ].join("\n"), null, [correction]);

  assert.equal(revised.error, null);
  assert.equal(revised.results[1].corrections.length, 0);
  assert.equal(revised.results[2].corrections.length, 1);
});

test("project export stores an anchored correction at its resolved line after deletions", () => {
  const correction = createCorrection({
    lineIndex: 2,
    targetRoundNumber: 3,
    targetSource: "Round 3: 12 sc [12]",
    writtenTotal: 12,
  });
  const project = createDesignerProject({
    patternText: "Round 3: 12 sc [12]",
    initialStartingCount: 12,
    corrections: [correction],
  });

  assert.equal(project.corrections[0].lineIndex, 0);
  assert.equal(project.corrections[0].targetRoundNumber, 3);
  assert.doesNotThrow(() => exportProjectJson(project));
});

test("correction history records each sequential before-and-after snapshot", () => {
  const source = "Round 1: 6 sc in magic ring [6]";
  const analyzed = analyzeDesignerPattern(source, null, [
    createCorrection({ lineIndex: 0, created: 5, recordedAt: "first" }),
    createCorrection({ lineIndex: 0, created: 6, recordedAt: "second" }),
  ]);

  assert.equal(analyzed.corrections[0].original.created, 6);
  assert.equal(analyzed.corrections[0].effective.created, 5);
  assert.equal(analyzed.corrections[0].effect, "introduced");
  assert.equal(analyzed.corrections[1].original.created, 5);
  assert.equal(analyzed.corrections[1].effective.created, 6);
  assert.equal(analyzed.corrections[1].effect, "resolved");
});

test("correction history preserves recording order across different lines", () => {
  const analyzed = analyzeDesignerPattern([
    "Round 1: 6 sc in magic ring [6]",
    "Round 2: 6 sc [6]",
  ].join("\n"), null, [
    createCorrection({ id: "first", lineIndex: 1, writtenTotal: 6, recordedAt: "2026-08-26T01:00:00Z" }),
    createCorrection({ id: "second", lineIndex: 0, writtenTotal: 6, recordedAt: "2026-08-26T02:00:00Z" }),
  ]);

  assert.deepEqual(analyzed.corrections.map((correction) => correction.id), ["first", "second"]);
  const project = createDesignerProject({
    patternText: "Round 1: 6 sc in magic ring [6]\nRound 2: 6 sc [6]",
    corrections: analyzed.corrections,
  });
  assert.deepEqual(project.corrections.map((correction) => correction.id), ["first", "second"]);
});

test("a starting-count correction reruns supported parser math", () => {
  const source = [
    "Round 1: 6 sc in magic ring [6]",
    "Round 2: sc in each st around [12]",
  ].join("\n");
  const corrected = analyzeDesignerPattern(source, null, [createCorrection({
    lineIndex: 1,
    startingCount: 12,
  })]);

  assert.equal(corrected.results[1].startingCount, 12);
  assert.equal(corrected.results[1].consumed, 12);
  assert.equal(corrected.results[1].created, 12);
  assert.equal(corrected.results[1].status, "correct");
});

test("an inapplicable repeat correction leaves the round unresolved", () => {
  const analyzed = analyzeDesignerPattern(
    "Round 2: 6 sc [6]",
    6,
    [createCorrection({ lineIndex: 0, repeatCount: 2 })],
  );

  assert.equal(analyzed.results[0].status, "unresolved");
  assert.ok(analyzed.results[0].issueCodes.includes(ISSUE_CODES.INVALID_REPEAT_CORRECTION));
  assert.ok(analyzed.results[0].issueCodes.includes(ISSUE_CODES.UNRESOLVED_ROUND));
  assert.ok(!analyzed.results[0].issueCodes.includes(ISSUE_CODES.UNSUPPORTED_NOTATION));
  assert.equal(analyzed.summary.passedRounds, 0);
  assert.equal(analyzed.summary.unresolvedRounds, 1);
  assert.match(analyzed.results[0].message, /remains unresolved/);
});

test("a later starting-count correction can make an earlier repeat correction valid", () => {
  const analyzed = analyzeDesignerPattern(
    "Round 2: (2 sc, inc) around [8]",
    5,
    [
      createCorrection({ lineIndex: 0, repeatCount: 2 }),
      createCorrection({ lineIndex: 0, startingCount: 6 }),
    ],
  );

  assert.equal(analyzed.corrections[0].effective.status, "unresolved");
  assert.equal(analyzed.corrections[1].effective.status, "correct");
  assert.equal(analyzed.results[0].status, "correct");
  assert.ok(!analyzed.results[0].issueCodes.includes(ISSUE_CODES.INVALID_REPEAT_CORRECTION));
});

test("repeat corrections cannot overflow safe stitch counts", () => {
  const analyzed = analyzeDesignerPattern(
    "Round 1: (sc, inc) x 1 [3]\nRound 2: 1 sc [1]",
    2,
    [createCorrection({ lineIndex: 0, repeatCount: Number.MAX_SAFE_INTEGER })],
  );

  assert.equal(analyzed.results[0].status, "unresolved");
  assert.ok(analyzed.results[0].issueCodes.includes(ISSUE_CODES.INVALID_REPEAT_CORRECTION));
  assert.equal(analyzed.results[1].startingCount, null);
  assert.equal(analyzed.results[1].status, "unresolved");
});

test("a later valid repeat correction supersedes an overflowing repeat value", () => {
  const analyzed = analyzeDesignerPattern(
    "Round 1: (sc, inc) x 1 [3]",
    2,
    [
      createCorrection({ lineIndex: 0, repeatCount: Number.MAX_SAFE_INTEGER }),
      createCorrection({ lineIndex: 0, repeatCount: 1 }),
    ],
  );

  assert.equal(analyzed.corrections[0].effective.status, "unresolved");
  assert.equal(analyzed.corrections[1].effective.status, "correct");
  assert.equal(analyzed.results[0].status, "correct");
  assert.ok(!analyzed.results[0].issueCodes.includes(ISSUE_CODES.INVALID_REPEAT_CORRECTION));
});

test("version comparison deterministically identifies added, removed, and changed rounds", () => {
  const comparison = comparePatternVersions(previousVersionPattern, revisedVersionPattern);
  assert.equal(comparison.error, null);
  assert.equal(comparison.summary.addedRounds, 1);
  assert.equal(comparison.summary.removedRounds, 1);
  assert.equal(comparison.summary.changedRounds, 1);
  assert.equal(comparison.summary.unchangedRounds, 2);

  const added = comparison.rounds.find((round) => round.round === 3);
  const removed = comparison.rounds.find((round) => round.round === 5);
  const changed = comparison.rounds.find((round) => round.round === 4);
  assert.equal(added.status, "added");
  assert.ok(added.changes.includes(VERSION_CHANGE_CODES.MISSING_ROUND_RESOLVED));
  assert.equal(removed.status, "removed");
  assert.equal(changed.status, "changed");
  assert.ok(changed.changes.includes(VERSION_CHANGE_CODES.TEXT_CHANGED));
  assert.ok(changed.changes.includes(VERSION_CHANGE_CODES.CALCULATED_TOTAL_CHANGED));
});

test("version comparison distinguishes written-total changes and resolved or introduced issues", () => {
  const resolved = comparePatternVersions(
    "Round 8: (5 sc, inc) x 6 [40]",
    "Round 8: (5 sc, inc) x 6 [42]",
    36,
  );
  const introduced = comparePatternVersions(
    "Round 8: (5 sc, inc) x 6 [42]",
    "Round 8: (5 sc, inc) x 6 [40]",
    36,
  );

  assert.ok(resolved.rounds[0].changes.includes(VERSION_CHANGE_CODES.WRITTEN_TOTAL_CHANGED));
  assert.ok(resolved.rounds[0].changes.includes(VERSION_CHANGE_CODES.ISSUE_RESOLVED));
  assert.ok(resolved.summary.issuesResolved >= 1);
  assert.ok(introduced.rounds[0].changes.includes(VERSION_CHANGE_CODES.NEW_ISSUE_INTRODUCED));
  assert.ok(introduced.summary.newIssuesIntroduced >= 1);
});

test("version comparison counts explicit numbering fixes as resolved issues", () => {
  const comparison = comparePatternVersions(
    "6 sc in magic ring [6]",
    "Round 1: 6 sc in magic ring [6]",
  );

  assert.equal(comparison.rounds[0].status, "changed");
  assert.ok(comparison.rounds[0].resolvedIssueCodes.includes(ISSUE_CODES.ROUND_NUMBER_INFERRED));
  assert.ok(comparison.rounds[0].changes.includes(VERSION_CHANGE_CODES.ISSUE_RESOLVED));
  assert.equal(comparison.summary.issuesResolved, 1);
});

test("version summary counts one shared duplicate-number diagnostic once", () => {
  const comparison = comparePatternVersions(
    "Round 1: 6 sc in magic ring [6]\nRound 2: 6 sc [6]",
    "Round 1: 6 sc in magic ring [6]\nRound 1: 6 sc [6]",
  );

  assert.equal(comparison.revisedAnalysis.numberingIssues.filter(
    (entry) => entry.code === ISSUE_CODES.DUPLICATE_ROUND_NUMBER,
  ).length, 1);
  assert.equal(comparison.summary.newIssuesIntroduced, 1);
});

test("version summary counts a filled missing round once despite duplicate additions", () => {
  const comparison = comparePatternVersions(
    "Round 1: 6 sc in magic ring [6]\nRound 3: 8 sc in magic ring [8]",
    "Round 1: 6 sc in magic ring [6]\nRound 2: 7 sc in magic ring [7]\nRound 2: 9 sc in magic ring [9]\nRound 3: 8 sc in magic ring [8]",
  );

  assert.equal(comparison.summary.missingRoundsAdded, 1);
  assert.equal(comparison.summary.issuesResolved, 1);
});

test("duplicate-round reordering is a semantic no-op", () => {
  const first = "Round 1: 6 sc in magic ring [6]";
  const second = "Round 1: 8 sc in magic ring [7]";
  const comparison = comparePatternVersions(`${first}\n${second}`, `${second}\n${first}`);

  assert.equal(comparison.summary.changedRounds, 0);
  assert.equal(comparison.summary.unchangedRounds, 2);
  assert.equal(comparison.summary.issuesResolved, 0);
  assert.equal(comparison.summary.newIssuesIntroduced, 0);
});

test("adding a duplicate aligns the unchanged occurrence by intrinsic math", () => {
  const comparison = comparePatternVersions(
    "Round 1: 8 sc in magic ring [8]",
    "Round 1: 6 sc in magic ring [6]\nRound 1: 8 sc in magic ring [8]",
  );
  const added = comparison.rounds.find((round) => round.status === "added");
  const retained = comparison.rounds.find((round) => round.previous?.source.includes("8 sc"));

  assert.match(added.revised.source, /6 sc/);
  assert.match(retained.revised.source, /8 sc/);
  assert.ok(!retained.changes.includes(VERSION_CHANGE_CODES.TEXT_CHANGED));
  assert.ok(!retained.changes.includes(VERSION_CHANGE_CODES.CALCULATED_TOTAL_CHANGED));
});

test("duplicate alignment prefers the same normalized instruction before position", () => {
  const addedBefore = comparePatternVersions(
    "Round 1: 6 sc [6]",
    "Round 1: inc x 6 [12]\nRound 1: 6 sc [6]",
    6,
  );
  const retained = addedBefore.rounds.find((round) => round.previous?.normalizedInstruction === "6 sc");
  const added = addedBefore.rounds.find((round) => round.status === "added");

  assert.equal(retained.revised.normalizedInstruction, "6 sc");
  assert.equal(added.revised.normalizedInstruction, "inc x 6");

  const reorderedTotals = comparePatternVersions(
    "Round 1: 6 sc in magic ring [6]\nRound 1: 8 sc in magic ring [8]",
    "Round 1: 8 sc in magic ring [7]\nRound 1: 6 sc in magic ring [5]",
  );
  assert.ok(reorderedTotals.rounds.every((round) => !round.changes.includes(VERSION_CHANGE_CODES.TEXT_CHANGED)));
  assert.ok(reorderedTotals.rounds.every((round) => !round.changes.includes(VERSION_CHANGE_CODES.CALCULATED_TOTAL_CHANGED)));
  assert.equal(reorderedTotals.summary.writtenTotalChangedRounds, 2);
});

test("removing a problematic round reports the removed issue symmetrically", () => {
  const comparison = comparePatternVersions(
    "Round 1: 8 sc in magic ring [7]\nRound 2: 6 sc in magic ring [6]",
    "Round 2: 6 sc in magic ring [6]",
  );
  const removed = comparison.rounds.find((round) => round.status === "removed");

  assert.ok(removed.resolvedIssueCodes.includes(ISSUE_CODES.COUNT_MISMATCH));
  assert.ok(removed.changes.includes(VERSION_CHANGE_CODES.ISSUE_RESOLVED));
  assert.equal(comparison.summary.issuesResolved, 1);
});

test("version comparison does not label changed math context as unchanged", () => {
  const comparison = comparePatternVersions(
    "Round 1: 6 sc in magic ring [6]\nRound 2: 2 sc [2]",
    "Round 1: 8 sc in magic ring [8]\nRound 2: 2 sc [2]",
  );
  const secondRound = comparison.rounds.find((round) => round.round === 2);

  assert.equal(secondRound.status, "changed");
  assert.ok(secondRound.changes.includes(VERSION_CHANGE_CODES.STARTING_COUNT_CHANGED));
  assert.equal(comparison.summary.startingCountChangedRounds, 1);
});

test("version comparison detects a changed repeat count through normalized text and math", () => {
  const comparison = comparePatternVersions(
    "Round 8: (5 sc, inc) x 5 [35]",
    "Round 8: (5 sc, inc) x 6 [42]",
    36,
  );

  assert.equal(comparison.rounds[0].status, "changed");
  assert.ok(comparison.rounds[0].changes.includes(VERSION_CHANGE_CODES.TEXT_CHANGED));
  assert.ok(comparison.rounds[0].changes.includes(VERSION_CHANGE_CODES.WRITTEN_TOTAL_CHANGED));
  assert.ok(comparison.rounds[0].changes.includes(VERSION_CHANGE_CODES.CALCULATED_TOTAL_CHANGED));
});

test("unsupported nested repeats remain explicit instead of being guessed", () => {
  const analyzed = analyzeDesignerPattern(unsupportedNestedRepeatPattern);
  assert.equal(analyzed.error, null);
  assert.equal(analyzed.results[1].status, "unsupported");
  assert.ok(analyzed.results[1].issueCodes.includes(ISSUE_CODES.UNSUPPORTED_NOTATION));
  assert.equal(analyzed.results[1].created, null);
});

test("supported notation without count context is unresolved, not unsupported notation", () => {
  const analyzed = analyzeDesignerPattern("Round 8: 6 sc [6]");
  const report = buildDesignerReportModel({ analysis: analyzed });

  assert.equal(analyzed.error, null);
  assert.equal(analyzed.results[0].status, "unresolved");
  assert.ok(analyzed.results[0].issueCodes.includes(ISSUE_CODES.UNRESOLVED_ROUND));
  assert.ok(!analyzed.results[0].issueCodes.includes(ISSUE_CODES.UNSUPPORTED_NOTATION));
  assert.equal(analyzed.summary.unsupportedNotation, 0);
  assert.equal(analyzed.summary.unresolvedRounds, 1);
  assert.match(report.issueRows[0].message, /Enter the stitch count/);
  assert.doesNotMatch(report.issueRows[0].message, /notation.*does not support/i);
});

test("a user-marked manual-review round is unresolved, not unsupported notation", () => {
  const analyzed = analyzeDesignerPattern(
    "Round 1: 6 sc in magic ring [6]",
    null,
    [createCorrection({ lineIndex: 0, classification: "manual-review" })],
  );

  assert.equal(analyzed.results[0].status, "unresolved");
  assert.match(analyzed.results[0].message, /marked for manual review by the user/);
  assert.ok(analyzed.results[0].issueCodes.includes(ISSUE_CODES.UNRESOLVED_ROUND));
  assert.ok(!analyzed.results[0].issueCodes.includes(ISSUE_CODES.UNSUPPORTED_NOTATION));
  assert.equal(analyzed.summary.unsupportedNotation, 0);
  assert.equal(analyzed.summary.unresolvedRounds, 1);
});

test("unsafe explicit round numbers fail the designer analysis without a fabricated identity", () => {
  const analyzed = analyzeDesignerPattern([
    "Round 1: 1 sc in magic ring [1]",
    "Round 9007199254740993: 1 sc [1]",
  ].join("\n"));

  assert.match(analyzed.error, /Line 2: Round number is outside the supported whole-number range/);
  assert.equal(analyzed.results.length, 0);
  assert.equal(analyzed.numberingIssues.length, 0);
});

test("unsafe numeric inputs remain unresolved and huge numbering gaps are aggregated", () => {
  const unsafe = analyzeDesignerPattern(
    "Round 1: 9007199254740993 sc in magic ring [9007199254740993]",
  );
  const hugeGap = analyzeDesignerPattern([
    "Round 1: 1 sc in magic ring [1]",
    "Round 1000000000: 1 sc [1]",
  ].join("\n"));

  assert.equal(unsafe.results[0].status, "unresolved");
  assert.equal(unsafe.summary.unsupportedNotation, 0);
  assert.equal(unsafe.summary.unresolvedRounds, 1);
  assert.match(unsafe.results[0].message, /supported whole-number range/);
  assert.equal(hugeGap.numberingIssues.filter((entry) => entry.code === ISSUE_CODES.MISSING_ROUND_NUMBER).length, 1);
  assert.equal(hugeGap.numberingIssues.find((entry) => entry.code === ISSUE_CODES.MISSING_ROUND_NUMBER).missingRoundCount, 999999998);
  assert.throws(
    () => createCorrection({ lineIndex: 0, created: Number.MAX_SAFE_INTEGER + 1 }),
    /non-negative integer/,
  );
});

test("unsupported math makes dependent rounds unresolved until a correction restores the count chain", () => {
  const source = [
    "Round 1: 6 sc in magic ring [6]",
    "Round 2: popcorn in each stitch [6]",
    "Round 3: (sc, inc) x 3 [9]",
  ].join("\n");
  const unresolved = analyzeDesignerPattern(source);
  assert.equal(unresolved.results[1].status, "unsupported");
  assert.equal(unresolved.results[2].startingCount, null);
  assert.equal(unresolved.results[2].status, "unresolved");
  assert.ok(!unresolved.results[2].issueCodes.includes(ISSUE_CODES.UNSUPPORTED_NOTATION));

  const corrected = analyzeDesignerPattern(source, null, [createCorrection({
    lineIndex: 1,
    startingCount: 6,
    consumed: 6,
    created: 6,
    classification: "supported",
  })]);
  assert.equal(corrected.results[1].status, "correct");
  assert.equal(corrected.results[2].startingCount, 6);
  assert.equal(corrected.results[2].status, "correct");
});

test("version summaries count both newly unsupported and newly context-unresolved rounds", () => {
  const previous = [
    "Round 1: 6 sc in magic ring [6]",
    "Round 2: 6 sc [6]",
    "Round 3: 6 sc [6]",
  ].join("\n");
  const revised = [
    "Round 1: 6 sc in magic ring [6]",
    "Round 2: popcorn in each stitch [6]",
    "Round 3: 6 sc [6]",
  ].join("\n");
  const comparison = comparePatternVersions(previous, revised);

  assert.equal(comparison.revisedAnalysis.results[1].status, "unsupported");
  assert.equal(comparison.revisedAnalysis.results[2].status, "unresolved");
  assert.equal(comparison.summary.newUnresolvedInstructions, 2);
});

test("version comparison labels unsupported notation in one or both versions", () => {
  const supported = "Round 4: 18 sc [18]";
  const unsupported = "Round 4: popcorn in each st [18]";
  const oneVersion = comparePatternVersions(supported, unsupported, 18);
  const bothVersions = comparePatternVersions(unsupported, unsupported, 18);

  assert.ok(oneVersion.rounds[0].changes.includes(VERSION_CHANGE_CODES.UNSUPPORTED_REVISED));
  assert.equal(oneVersion.summary.newUnresolvedInstructions, 1);
  assert.ok(bothVersions.rounds[0].changes.includes(VERSION_CHANGE_CODES.UNSUPPORTED_BOTH));
  assert.equal(bothVersions.rounds[0].status, "unchanged");
});

test("report excerpts are opt-in and default messages do not echo unsupported instructions", () => {
  const source = "=HYPERLINK(\"https://example.invalid\")";
  const analysis = analyzeDesignerPattern(source, 1);
  const privateByDefault = buildDesignerReportModel({
    metadata: { patternTitle: "QA sample", patternVersion: "v2", designerNotes: source },
    analysis,
  });
  const withExcerpt = buildDesignerReportModel({
    metadata: { patternTitle: "QA sample", patternVersion: "v2" },
    analysis,
    includeExcerpts: true,
  });

  assert.equal(privateByDefault.includeInstructionExcerpts, false);
  assert.doesNotMatch(JSON.stringify(privateByDefault), /HYPERLINK/);
  assert.equal(withExcerpt.includeInstructionExcerpts, true);
  assert.match(JSON.stringify(withExcerpt), /HYPERLINK/);
});

test("CSV issue export neutralizes spreadsheet formulas, including opted-in excerpts", () => {
  const source = "=HYPERLINK(\"https://example.invalid\")";
  const analysis = analyzeDesignerPattern(source, 1);
  const csv = exportIssuesCsv({ analysis, includeExcerpts: true });
  const csvWithoutExcerpts = exportIssuesCsv({ analysis });
  const stringFalseConsent = exportIssuesCsv({ analysis, includeExcerpts: "false" });

  assert.match(csv, /Instruction excerpt/);
  assert.match(csv, /"'=HYPERLINK/);
  assert.doesNotMatch(csvWithoutExcerpts, /HYPERLINK/);
  assert.doesNotMatch(stringFalseConsent, /Instruction excerpt|HYPERLINK/);
  assert.throws(
    () => exportIssuesCsv({
      issueRows: [{ instructionExcerpt: "SECRET" }],
      includeInstructionExcerpts: "false",
    }),
    /Paste at least one pattern round/,
  );
  assert.equal(safeCsvCell("  +SUM(1,1)"), '"\'  +SUM(1,1)"');
  assert.equal(safeCsvCell("ordinary"), '"ordinary"');
});

test("JSON project backup and restore round-trip only the validated local source model", () => {
  const project = createDesignerProject({
    projectId: "private-sample",
    metadata: {
      patternTitle: "Fox sample",
      designerNickname: "Local designer",
      patternVersion: "2.0",
      reviewDate: "2026-08-26",
      sectionLabels: ["Head", "Body"],
      designerNotes: "Stored only in this explicit backup.",
    },
    patternText: "Round 1: 6 sc in magic ring [6]\nRound 2: inc x 6 [12]",
    corrections: [createCorrection({ lineIndex: 1, writtenTotal: 12, recordedAt: "2026-08-26" })],
    previousVersion: {
      metadata: { patternVersion: "1.0" },
      patternText: "Round 1: 6 sc in magic ring [6]",
      corrections: [],
    },
    revisedVersion: "Round 1: 6 sc in magic ring [6]\nRound 2: inc x 6 [12]",
    includeExcerpts: true,
  });
  const serialized = exportProjectJson(project);
  const restored = restoreProjectJson(serialized);

  assert.deepEqual(restored, project);
  assert.ok(Object.isFrozen(restored));
  assert.ok(Object.isFrozen(restored.metadata));
  assert.equal(restored.revisedVersion, project.revisedVersion);
  assert.match(serialized, /Fox sample/);
  assert.throws(() => restoreProjectJson('{"schema":"wrong","schemaVersion":1}'), /unsupported schema/);
});

test("JSON restore requires literal excerpt consent and a typed starting count", () => {
  const base = createDesignerProject({
    patternText: "Round 1: 6 sc in magic ring [6]",
    includeExcerpts: false,
  });
  const stringConsent = JSON.stringify({
    ...base,
    preferences: { includeInstructionExcerpts: "false" },
  });
  const numericConsent = JSON.stringify({
    ...base,
    preferences: { includeInstructionExcerpts: 1 },
  });
  const topLevelConsent = JSON.stringify({
    ...base,
    includeExcerpts: "false",
  });
  const stringStartingCount = JSON.stringify({
    ...base,
    initialStartingCount: "12",
  });

  assert.throws(() => restoreProjectJson(stringConsent), /must be a boolean/);
  assert.throws(() => restoreProjectJson(numericConsent), /must be a boolean/);
  assert.throws(() => restoreProjectJson(topLevelConsent), /must store excerpt consent in preferences/);
  assert.throws(() => restoreProjectJson(stringStartingCount), /must be null or a non-negative integer/);
});
