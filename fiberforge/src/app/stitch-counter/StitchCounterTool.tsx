"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// ── TYPES ─────────────────────────────────────────────────────────

interface Counter {
  id: string;
  name: string;
  count: number;
}

interface Reminder {
  id: string;
  row: number;
  note: string;
}

interface HistoryEntry {
  counterId: string;
  prevValue: number;
  newValue: number;
}

const STORAGE_KEY = "fibertools-stitch-counter";

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

// ── COMPONENT ─────────────────────────────────────────────────────

export default function StitchCounterTool() {
  const [counters, setCounters] = useState<Counter[]>([
    { id: generateId(), name: "Rows", count: 0 },
  ]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [redoStack, setRedoStack] = useState<HistoryEntry[]>([]);
  const [activeReminder, setActiveReminder] = useState<Reminder | null>(null);
  const [milestoneEvery, setMilestoneEvery] = useState(10);
  const [showSettings, setShowSettings] = useState(false);
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [newReminderRow, setNewReminderRow] = useState("");
  const [newReminderNote, setNewReminderNote] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // ── PERSISTENCE ─────────────────────────────────────────────────
  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.counters?.length) setCounters(data.counters);
        if (data.reminders) setReminders(data.reminders);
        if (data.milestoneEvery) setMilestoneEvery(data.milestoneEvery);
      }
    } catch {
      // ignore bad data
    }
  }, []);

  // Save on change
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ counters, reminders, milestoneEvery })
      );
    } catch {
      // storage full, ignore
    }
  }, [counters, reminders, milestoneEvery]);

  // ── FEEDBACK ────────────────────────────────────────────────────
  const doFeedback = useCallback((milestone: boolean) => {
    if (milestone && typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate([100, 50, 100]);
    }
  }, []);

  // ── COUNTER ACTIONS ─────────────────────────────────────────────
  const updateCounter = useCallback(
    (id: string, delta: number) => {
      setCounters((prev) => {
        const counter = prev.find((c) => c.id === id);
        if (!counter) return prev;
        const newValue = Math.max(0, counter.count + delta);

        // History
        setHistory((h) => [...h.slice(-49), { counterId: id, prevValue: counter.count, newValue }]);
        setRedoStack([]);

        // Check reminders (for the first/main counter)
        if (prev[0]?.id === id) {
          const match = reminders.find((r) => r.row === newValue);
          if (match) setActiveReminder(match);
        }

        // Milestone feedback
        if (milestoneEvery > 0 && newValue > 0 && newValue % milestoneEvery === 0) {
          doFeedback(true);
        }

        return prev.map((c) => (c.id === id ? { ...c, count: newValue } : c));
      });
    },
    [reminders, milestoneEvery, doFeedback]
  );

  const undo = useCallback(() => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setCounters((prev) =>
      prev.map((c) => (c.id === last.counterId ? { ...c, count: last.prevValue } : c))
    );
    setHistory((h) => h.slice(0, -1));
    setRedoStack((r) => [...r, last]);
  }, [history]);

  const redo = useCallback(() => {
    if (redoStack.length === 0) return;
    const last = redoStack[redoStack.length - 1];
    setCounters((prev) =>
      prev.map((c) => (c.id === last.counterId ? { ...c, count: last.newValue } : c))
    );
    setRedoStack((r) => r.slice(0, -1));
    setHistory((h) => [...h, last]);
  }, [redoStack]);

  const addCounter = () => {
    if (counters.length >= 6) return;
    setCounters((prev) => [
      ...prev,
      { id: generateId(), name: `Counter ${prev.length + 1}`, count: 0 },
    ]);
  };

  const removeCounter = (id: string) => {
    if (counters.length <= 1) return;
    setCounters((prev) => prev.filter((c) => c.id !== id));
  };

  const renameCounter = (id: string, name: string) => {
    setCounters((prev) => prev.map((c) => (c.id === id ? { ...c, name } : c)));
  };

  const resetAll = () => {
    setCounters((prev) => prev.map((c) => ({ ...c, count: 0 })));
    setHistory([]);
    setRedoStack([]);
  };

  // ── REMINDERS ───────────────────────────────────────────────────
  const addReminder = () => {
    const row = parseInt(newReminderRow);
    if (!row || !newReminderNote.trim()) return;
    setReminders((prev) => [...prev, { id: generateId(), row, note: newReminderNote.trim() }]);
    setNewReminderRow("");
    setNewReminderNote("");
    setShowAddReminder(false);
  };

  const removeReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  // ── FULLSCREEN ──────────────────────────────────────────────────
  const toggleFullscreen = async () => {
    if (!document.fullscreenElement && containerRef.current) {
      await containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  // ── EXPORT ──────────────────────────────────────────────────────
  const exportSession = () => {
    const lines = counters.map((c) => `${c.name}: ${c.count}`);
    if (reminders.length) {
      lines.push("", "Reminders:");
      reminders.forEach((r) => lines.push(`  Row ${r.row}: ${r.note}`));
    }
    navigator.clipboard.writeText(lines.join("\n"));
  };

  return (
    <div
      ref={containerRef}
      className={`space-y-6 ${isFullscreen ? "bg-cream-50 dark:bg-bark-900 p-6 min-h-screen" : ""}`}
    >
      {/* Reminder popup */}
      {activeReminder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setActiveReminder(null)}>
          <div className="bg-white dark:bg-bark-800 rounded-2xl p-6 max-w-sm w-full shadow-xl text-center" onClick={(e) => e.stopPropagation()}>
            <p className="text-3xl mb-2">📌</p>
            <p className="text-lg font-bold text-bark-800 dark:text-cream-100">
              Row {activeReminder.row}
            </p>
            <p className="text-bark-600 dark:text-cream-300 mt-2">{activeReminder.note}</p>
            <button
              type="button"
              onClick={() => setActiveReminder(null)}
              className="btn-primary mt-4 w-full"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={undo} disabled={history.length === 0}
          className="btn-secondary text-sm disabled:opacity-30">
          ↩ Undo
        </button>
        <button type="button" onClick={redo} disabled={redoStack.length === 0}
          className="btn-secondary text-sm disabled:opacity-30">
          ↪ Redo
        </button>
        <button type="button" onClick={exportSession} className="btn-secondary text-sm">
          📋 Copy
        </button>
        <button type="button" onClick={toggleFullscreen} className="btn-secondary text-sm">
          {isFullscreen ? "⊠ Exit" : "⛶ Fullscreen"}
        </button>
        <div className="flex-1" />
        <button type="button" onClick={() => setShowSettings(!showSettings)}
          className="btn-secondary text-sm">
          ⚙️ Settings
        </button>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <div className="p-4 bg-cream-100 dark:bg-bark-800 rounded-xl space-y-4">
          <div className="flex items-center gap-3">
            <label className="text-sm text-bark-600 dark:text-cream-300">Milestone every</label>
            <input
              type="number" value={milestoneEvery}
              onChange={(e) => setMilestoneEvery(Math.max(0, parseInt(e.target.value) || 0))}
              className="input w-20 text-sm" min="0" inputMode="numeric"
            />
            <span className="text-xs text-bark-400 dark:text-bark-500">rows (0 = off). Vibrates on milestone rows.</span>
          </div>

          {/* Reminders */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <p className="text-sm font-medium text-bark-700 dark:text-cream-200">Row Reminders</p>
              <button type="button" onClick={() => setShowAddReminder(true)} className="text-sage-600 dark:text-sage-400 text-sm hover:underline">
                + Add
              </button>
            </div>

            {showAddReminder && (
              <div className="flex gap-2 mb-2">
                <input type="number" value={newReminderRow} onChange={(e) => setNewReminderRow(e.target.value)}
                  placeholder="Row #" className="input w-24 text-sm" min="1" inputMode="numeric" />
                <input type="text" value={newReminderNote} onChange={(e) => setNewReminderNote(e.target.value)}
                  placeholder="Note (e.g., start decreases)" className="input flex-1 text-sm" />
                <button type="button" onClick={addReminder} className="btn-primary text-sm px-3">Add</button>
                <button type="button" onClick={() => setShowAddReminder(false)} className="btn-secondary text-sm px-3">✕</button>
              </div>
            )}

            {reminders.length > 0 ? (
              <div className="space-y-1">
                {reminders.sort((a, b) => a.row - b.row).map((r) => (
                  <div key={r.id} className="flex items-center gap-2 text-sm">
                    <span className="inline-block px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 text-xs font-medium">
                      Row {r.row}
                    </span>
                    <span className="text-bark-600 dark:text-cream-300 flex-1">{r.note}</span>
                    <button type="button" onClick={() => removeReminder(r.id)} className="text-bark-400 hover:text-rose-500 text-xs">✕</button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-bark-400 dark:text-bark-500">No reminders set. Add one to get notified on a specific row.</p>
            )}
          </div>

          <button type="button" onClick={resetAll} className="text-rose-500 text-sm hover:underline">
            Reset all counters to 0
          </button>
        </div>
      )}

      {/* Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {counters.map((counter) => (
          <div
            key={counter.id}
            className="bg-cream-100 dark:bg-bark-800 rounded-2xl border border-cream-200 dark:border-bark-700 p-5 flex flex-col items-center"
          >
            {/* Editable name */}
            <input
              type="text"
              value={counter.name}
              onChange={(e) => renameCounter(counter.id, e.target.value)}
              className="text-center text-sm font-medium text-bark-500 dark:text-bark-400 bg-transparent border-none outline-none focus:text-bark-700 dark:focus:text-cream-200 w-full mb-2"
              maxLength={20}
            />

            {/* Count display */}
            <p className="text-6xl sm:text-7xl font-bold text-bark-800 dark:text-cream-100 font-display tabular-nums select-none mb-4">
              {counter.count}
            </p>

            {/* Main buttons */}
            <div className="flex items-center gap-3 w-full">
              <button
                type="button"
                onClick={() => updateCounter(counter.id, -1)}
                className="flex-1 h-14 sm:h-16 rounded-xl bg-rose-100 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 text-2xl font-bold hover:bg-rose-200 dark:hover:bg-rose-900/30 active:scale-95 transition-all select-none"
              >
                −
              </button>
              <button
                type="button"
                onClick={() => updateCounter(counter.id, 1)}
                className="flex-[2] h-14 sm:h-16 rounded-xl bg-sage-500 dark:bg-sage-600 text-white text-2xl font-bold hover:bg-sage-600 dark:hover:bg-sage-500 active:scale-95 transition-all select-none shadow-sm"
              >
                +
              </button>
            </div>

            {/* Quick add */}
            <div className="flex gap-1.5 mt-3 w-full">
              {[5, 10].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => updateCounter(counter.id, n)}
                  className="flex-1 py-2 text-xs font-medium rounded-lg bg-cream-200 dark:bg-bark-700 text-bark-500 dark:text-bark-400 hover:bg-cream-300 dark:hover:bg-bark-600 active:scale-95 transition-all select-none"
                >
                  +{n}
                </button>
              ))}
              <button
                type="button"
                onClick={() => updateCounter(counter.id, -counter.count)}
                className="flex-1 py-2 text-xs font-medium rounded-lg bg-cream-200 dark:bg-bark-700 text-bark-500 dark:text-bark-400 hover:bg-cream-300 dark:hover:bg-bark-600 active:scale-95 transition-all select-none"
              >
                ↺ 0
              </button>
            </div>

            {/* Remove (if >1 counter) */}
            {counters.length > 1 && (
              <button
                type="button"
                onClick={() => removeCounter(counter.id)}
                className="text-xs text-bark-400 dark:text-bark-500 hover:text-rose-500 mt-3"
              >
                Remove counter
              </button>
            )}
          </div>
        ))}

        {/* Add counter button */}
        {counters.length < 6 && (
          <button
            type="button"
            onClick={addCounter}
            className="rounded-2xl border-2 border-dashed border-cream-300 dark:border-bark-600 p-5 flex flex-col items-center justify-center text-bark-400 dark:text-bark-500 hover:border-sage-300 dark:hover:border-sage-700 hover:text-sage-500 transition-colors min-h-[200px]"
          >
            <span className="text-3xl mb-2">+</span>
            <span className="text-sm font-medium">Add Counter</span>
            <span className="text-xs mt-1">Track repeats, sections, etc.</span>
          </button>
        )}
      </div>

      {/* Upcoming reminders */}
      {reminders.length > 0 && counters[0] && (() => {
        const current = counters[0].count;
        const upcoming = reminders
          .filter((r) => r.row > current)
          .sort((a, b) => a.row - b.row)
          .slice(0, 3);
        if (upcoming.length === 0) return null;
        return (
          <div className="text-sm text-bark-500 dark:text-bark-400 space-y-1">
            <p className="font-medium">📌 Upcoming reminders:</p>
            {upcoming.map((r) => (
              <p key={r.id}>
                Row {r.row} ({r.row - current} to go): {r.note}
              </p>
            ))}
          </div>
        );
      })()}

      {/* Tips */}
      <div className="result-card">
        <h3 className="font-semibold text-bark-700 dark:text-cream-200 mb-2">
          💡 Tips
        </h3>
        <ul className="text-sm text-bark-500 dark:text-bark-400 space-y-1">
          <li><strong>Your counts auto-save</strong> — close the tab, come back later, they&apos;ll still be here.</li>
          <li><strong>Tap the counter name</strong> to rename it (e.g., &ldquo;Cable repeats&rdquo;, &ldquo;Sleeve rows&rdquo;).</li>
          <li><strong>Row reminders</strong> pop up when you reach a specific row — great for decrease schedules or color changes.</li>
          <li><strong>Fullscreen mode</strong> hides browser chrome so you can count without distractions.</li>
        </ul>
      </div>
    </div>
  );
}
