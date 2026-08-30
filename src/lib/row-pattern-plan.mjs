export const MAX_ROW_PLANNER_SECTIONS = 12;
export const MAX_ROW_REPEAT = 1000;
export const MAX_TARGET_SECTION_ROWS = 100000;
export const MAX_TOTAL_PLANNER_ROWS = 1000000;
export const MAX_ROW_SECTION_NAME_LENGTH = 80;

function failure(reason, error) {
  return { ok: false, reason, error };
}

export function buildRowPatternPlan(sections) {
  if (!Array.isArray(sections) || sections.length < 1 || sections.length > MAX_ROW_PLANNER_SECTIONS) {
    return failure(
      "invalid-sections",
      `Enter from 1 through ${MAX_ROW_PLANNER_SECTIONS} sections.`,
    );
  }

  const ids = new Set();
  const plannedSections = [];
  let totalTargetRows = 0;
  let totalActualRows = 0;

  for (const section of sections) {
    const id = Number(section?.id);
    const rowRepeat = Number(section?.rowRepeat);
    const targetRows = Number(section?.targetRows);
    const stitch = typeof section?.stitch === "string" ? section.stitch.trim() : "";

    if (!Number.isSafeInteger(id) || id < 1 || ids.has(id)) {
      return failure("invalid-section-id", "Every section must have a unique internal identifier.");
    }
    ids.add(id);
    if (stitch.length > MAX_ROW_SECTION_NAME_LENGTH) {
      return failure(
        "invalid-section-name",
        `Section names must be no more than ${MAX_ROW_SECTION_NAME_LENGTH} characters.`,
      );
    }
    if (!Number.isSafeInteger(rowRepeat) || rowRepeat < 1 || rowRepeat > MAX_ROW_REPEAT) {
      return failure("invalid-row-repeat", `Row repeats must be whole numbers from 1 through ${MAX_ROW_REPEAT}.`);
    }
    if (!Number.isSafeInteger(targetRows) || targetRows < 1 || targetRows > MAX_TARGET_SECTION_ROWS) {
      return failure(
        "invalid-target-rows",
        `Target rows must be whole numbers from 1 through ${MAX_TARGET_SECTION_ROWS.toLocaleString()}.`,
      );
    }

    const fullRepeats = Math.max(1, Math.ceil(targetRows / rowRepeat));
    const actualRows = fullRepeats * rowRepeat;
    if (!Number.isSafeInteger(actualRows)) {
      return failure("unsafe-section", "A section produces an unsafe row count.");
    }

    totalTargetRows += targetRows;
    totalActualRows += actualRows;
    if (
      !Number.isSafeInteger(totalTargetRows)
      || !Number.isSafeInteger(totalActualRows)
      || totalActualRows > MAX_TOTAL_PLANNER_ROWS
    ) {
      return failure(
        "unsafe-total",
        `The complete plan must be no more than ${MAX_TOTAL_PLANNER_ROWS.toLocaleString()} rows.`,
      );
    }

    plannedSections.push({
      id,
      stitch,
      rowRepeat,
      targetRows,
      fullRepeats,
      actualRows,
      addedRows: actualRows - targetRows,
    });
  }

  return {
    ok: true,
    sections: plannedSections,
    totalTargetRows,
    totalActualRows,
  };
}
