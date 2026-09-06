function count(value) {
  return Number.isSafeInteger(value) && value >= 0;
}

function uniqueIds(values) {
  return values.every((value) => value && typeof value.id === "string" && value.id.length > 0 && value.id.length <= 100)
    && new Set(values.map((value) => value.id)).size === values.length;
}

/** Validate saved browser data before it can participate in arithmetic. */
export function parseCounterState(data) {
  if (!data || !Array.isArray(data.counters) || data.counters.length < 1 || data.counters.length > 6
    || !uniqueIds(data.counters)
    || !data.counters.every((item) => typeof item.name === "string" && item.name.length <= 100 && count(item.count))) return null;
  const reminders = data.reminders ?? [];
  if (!Array.isArray(reminders) || reminders.length > 100 || !uniqueIds(reminders)
    || !reminders.every((item) => count(item.row) && item.row > 0 && typeof item.note === "string")) return null;
  const milestoneEvery = data.milestoneEvery ?? 10;
  if (!count(milestoneEvery)) return null;
  return {
    counters: data.counters.map(({ id, name, count }) => ({ id, name, count })),
    reminders: reminders.map(({ id, row, note }) => ({ id, row, note })),
    milestoneEvery,
  };
}

export function nextCounterValue(current, delta) {
  if (!count(current) || !Number.isSafeInteger(delta)) return null;
  const next = Math.max(0, current + delta);
  return count(next) ? next : null;
}
