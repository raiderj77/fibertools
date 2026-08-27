"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  MAX_DESIGNER_ROUNDS,
  analyzeDesignerPattern,
  buildDesignerReportModel,
  comparePatternVersions,
  createCorrection,
  createDesignerProject,
  exportIssuesCsv,
  exportProjectJson,
  restoreProjectJson,
} from "@/lib/stitchproof-designer.mjs";
import {
  trackStitchProofEvent,
  type StitchProofUnsupportedCategory,
} from "@/lib/stitchproof-analytics";
import { deleteLocalProject, loadLocalProject, saveLocalProject } from "./local-project-store";

type WorkspaceView = "designer" | "compare" | "report";

type MetadataState = {
  title: string;
  designerNickname: string;
  version: string;
  reviewedAt: string;
  sectionLabels: string;
  designerNotes: string;
};

type CorrectionRecord = {
  id: string;
  lineIndex: number;
  targetRoundNumber?: number | null;
  targetSource?: string;
  changes: Record<string, string | number | null>;
  note?: string;
  recordedAt?: string;
  original?: Record<string, unknown> | null;
  effective?: Record<string, unknown> | null;
};

type DesignerRound = {
  key: string;
  index: number;
  round: number;
  source: string;
  status: string;
  startingCount: number | null;
  consumed: number | null;
  created: number | null;
  writtenTotal: number | null;
  repeatCount: number | null;
  classification: string;
  difference: number | null;
  message: string;
  notes: string[];
  original?: Record<string, unknown>;
  effective?: Record<string, unknown>;
  issueCodes?: string[];
};

type DesignerAnalysis = {
  results: DesignerRound[];
  error: string | null;
  numberingIssues: Array<string | Record<string, unknown>>;
  corrections: CorrectionRecord[];
  summary: Record<string, number>;
};

type VersionComparison = {
  error: string | null;
  rounds: Array<{
    key: string;
    round: number;
    occurrence: number;
    status: "added" | "removed" | "changed" | "unchanged";
    changes: string[];
    previous?: DesignerRound | null;
    revised?: DesignerRound | null;
  }>;
  summary: Record<string, number>;
};

type ReportModel = {
  summary: Record<string, number>;
  issueRows?: Array<{
    round: number;
    code: string;
    label: string;
    severity: string;
    message: string;
    instructionExcerpt?: string;
  }>;
  methodology: string | string[];
  limitations: string | string[];
  privacyStatement: string;
  versionSummary?: Record<string, number> | null;
  versionChanges?: Array<{
    round: number;
    occurrence: number;
    status: string;
    changes: string[];
    previousExcerpt?: string | null;
    revisedExcerpt?: string | null;
  }>;
};

const EXAMPLE_PATTERN = [
  "Round 1: 6 sc in magic ring [6]",
  "Round 2: inc x 6 [12]",
  "Round 3: (sc, inc) x 6 [18]",
].join("\n");

const EXAMPLE_REVISION = [
  "Round 1: 6 sc in magic ring [6]",
  "Round 2: inc x 6 [12]",
  "Round 3: (sc, inc) x 6 [18]",
  "Round 4: (2 sc, inc) x 6 [24]",
].join("\n");

const EMPTY_METADATA: MetadataState = {
  title: "",
  designerNickname: "",
  version: "",
  reviewedAt: "",
  sectionLabels: "",
  designerNotes: "",
};

const EMPTY_CORRECTION_FORM = {
  target: "0",
  roundNumber: "",
  startingCount: "",
  writtenTotal: "",
  repeatCount: "",
  consumed: "",
  created: "",
  classification: "",
  note: "",
};

const STATUS_STYLES: Record<string, string> = {
  correct: "border-sage-300 bg-sage-50 dark:border-sage-800 dark:bg-sage-900/30",
  incorrect: "border-rose-300 bg-rose-50 dark:border-rose-800 dark:bg-rose-950/30",
  calculated: "border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30",
  unsupported: "border-bark-300 bg-cream-100 dark:border-bark-600 dark:bg-bark-800",
  unresolved: "border-bark-300 bg-cream-100 dark:border-bark-600 dark:bg-bark-800",
};

const SUMMARY_LABELS: Record<string, string> = {
  totalRounds: "Rounds checked",
  passedRounds: "Passed rounds",
  correct: "Passed rounds",
  mismatches: "Mismatches",
  incorrect: "Mismatches",
  missingTotals: "Missing totals",
  numberingIssues: "Numbering issues",
  unsupported: "Unsupported rounds",
  unresolved: "Unresolved rounds",
  corrections: "Corrections",
  changed: "Rounds changed",
  added: "Rounds added",
  removed: "Rounds removed",
  unchanged: "Rounds unchanged",
  writtenTotalChanged: "Written totals changed",
  calculatedTotalChanged: "Calculated totals changed",
  issuesResolved: "Issues resolved",
  newIssues: "New issues",
};

function lineCount(value: string): number {
  return value.split(/\r?\n/).filter((line) => line.trim()).length;
}

function optionalInteger(value: string): number | undefined {
  if (value.trim() === "") return undefined;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed >= 0 ? parsed : undefined;
}

function startValue(value: string): number | null {
  const parsed = optionalInteger(value);
  return parsed ?? null;
}

function downloadText(filename: string, contents: string, type: string) {
  const blob = new Blob([contents], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function safeFilename(value: string): string {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return normalized || "stitchproof-designer-project";
}

function displayValue(value: unknown): string {
  if (value == null || value === "") return "—";
  if (Array.isArray(value)) return value.map(displayValue).join(", ");
  if (typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .map(([key, item]) => `${SUMMARY_LABELS[key] ?? key}: ${displayValue(item)}`)
      .join("; ");
  }
  return String(value);
}

function formatSummaryKey(key: string): string {
  if (SUMMARY_LABELS[key]) return SUMMARY_LABELS[key];
  return key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/_/g, " ").replace(/^./, (letter) => letter.toUpperCase());
}

function asList(value: string | string[]): string[] {
  return Array.isArray(value) ? value : [value];
}

function normalizedMetadata(metadata: MetadataState) {
  return {
    patternTitle: metadata.title,
    designerNickname: metadata.designerNickname,
    patternVersion: metadata.version,
    reviewDate: metadata.reviewedAt,
    sectionLabels: metadata.sectionLabels.split(",").map((label) => label.trim()).filter(Boolean),
    designerNotes: metadata.designerNotes,
  };
}

function localFingerprint(value: string): string {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(36);
}

export default function StitchProofDesignerWorkspace() {
  const [view, setView] = useState<WorkspaceView>("designer");
  const [focusRequest, setFocusRequest] = useState<WorkspaceView | null>(null);
  const [metadata, setMetadata] = useState<MetadataState>(EMPTY_METADATA);
  const [patternText, setPatternText] = useState(EXAMPLE_PATTERN);
  const [initialStartingCount, setInitialStartingCount] = useState("");
  const [corrections, setCorrections] = useState<CorrectionRecord[]>([]);
  const [correctionForm, setCorrectionForm] = useState(EMPTY_CORRECTION_FORM);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [previousVersion, setPreviousVersion] = useState(EXAMPLE_PATTERN);
  const [revisedVersion, setRevisedVersion] = useState(EXAMPLE_REVISION);
  const [comparison, setComparison] = useState<VersionComparison | null>(null);
  const [includeExcerpts, setIncludeExcerpts] = useState(false);
  const [localSavingEnabled, setLocalSavingEnabled] = useState(false);
  const [workspaceDirty, setWorkspaceDirty] = useState(false);
  const [storageMessage, setStorageMessage] = useState("");
  const [exportMessage, setExportMessage] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [feedbackCategory, setFeedbackCategory] = useState<StitchProofUnsupportedCategory | "">("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [paidInterestMessage, setPaidInterestMessage] = useState("");
  const restoreInputRef = useRef<HTMLInputElement>(null);
  const reportGenerationRef = useRef(0);
  const lastTrackedReportGenerationRef = useRef(0);
  const lastReviewedFingerprintRef = useRef("");
  const lastTrackedComparisonRef = useRef("");
  const paidInterestSubmittedRef = useRef(false);

  const analysis = useMemo(
    () => analyzeDesignerPattern(patternText, startValue(initialStartingCount), corrections) as DesignerAnalysis,
    [patternText, initialStartingCount, corrections],
  );
  const comparisonMatchesDesigner = Boolean(
    comparison && revisedVersion.trim() === patternText.trim(),
  );

  const report = useMemo(
    () => {
      if (analysis.error) {
        return {
          summary: analysis.summary,
          methodology: ["Supported amigurumi round notation is evaluated with deterministic stitch-consumption and stitch-creation rules."],
          limitations: [analysis.error, "Unsupported notation is left unresolved rather than guessed."],
          privacyStatement: "Pattern analysis and report generation run in this browser. FiberTools does not receive or store the pattern text.",
        } as ReportModel;
      }
      return buildDesignerReportModel({
        metadata: normalizedMetadata(metadata),
        patternText,
        initialStartingCount: startValue(initialStartingCount),
        analysis,
        corrections,
        comparison: comparisonMatchesDesigner ? comparison : null,
        includeExcerpts,
      }) as ReportModel;
    },
    [metadata, patternText, initialStartingCount, analysis, corrections, comparison, comparisonMatchesDesigner, includeExcerpts],
  );

  useEffect(() => {
    trackStitchProofEvent("designer_mode_opened");
    const requestedView = window.location.hash.slice(1);
    if (requestedView === "compare") {
      setFocusRequest("compare");
      setView("compare");
    } else if (requestedView === "report") {
      setFocusRequest("designer");
      setFormMessage("Review a pattern successfully before opening its report.");
      window.history.replaceState(null, "", "#designer");
      setView("designer");
    }
  }, []);

  useEffect(() => {
    if (focusRequest !== view) return;
    const heading = document.getElementById(`${view}-heading`);
    if (!heading) return;
    setFocusRequest(null);
    window.requestAnimationFrame(() => {
      heading.scrollIntoView({ behavior: "smooth", block: "start" });
      heading.focus({ preventScroll: true });
    });
  }, [view, focusRequest, hasReviewed]);

  function changeView(nextView: WorkspaceView) {
    const allowedView = nextView === "report" && (!hasReviewed || analysis.error)
      ? "designer"
      : nextView;
    if (allowedView !== nextView) {
      setFormMessage("Review a pattern successfully before opening its report.");
    }
    setFocusRequest(allowedView);
    setView(allowedView);
    window.history.replaceState(null, "", `#${allowedView}`);
    if (nextView === "report"
      && hasReviewed
      && !analysis.error
      && reportGenerationRef.current > lastTrackedReportGenerationRef.current) {
      trackStitchProofEvent("report_previewed");
      lastTrackedReportGenerationRef.current = reportGenerationRef.current;
    }
  }

  function updateMetadata(field: keyof MetadataState, value: string) {
    setMetadata((current) => ({ ...current, [field]: value }));
    setWorkspaceDirty(true);
  }

  function reportFingerprint(correctionRecords: CorrectionRecord[]) {
    return localFingerprint(JSON.stringify({
      patternText,
      initialStartingCount,
      corrections: correctionRecords.map(({ id, lineIndex, targetRoundNumber, targetSource, changes }) => ({
        id,
        lineIndex,
        targetRoundNumber,
        targetSource,
        changes,
      })),
    }));
  }

  function buildCurrentProject() {
    return createDesignerProject({
      metadata: normalizedMetadata(metadata),
      patternText,
      initialStartingCount: startValue(initialStartingCount),
      corrections,
      previousVersion: {
        patternText: previousVersion,
        initialStartingCount: startValue(initialStartingCount),
        metadata: {},
        corrections: [],
      },
      revisedVersion,
      includeExcerpts,
    });
  }

  function reviewPattern(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setHasReviewed(true);
    const fingerprint = reportFingerprint(corrections);
    if (!analysis.error && fingerprint !== lastReviewedFingerprintRef.current) {
      reportGenerationRef.current += 1;
      lastReviewedFingerprintRef.current = fingerprint;
    }
    setFormMessage(analysis.error ?? "Review updated in this browser.");
  }

  function recordCorrection(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const targetLineIndex = Number(correctionForm.target);
    const targetResult = analysis.results[targetLineIndex];
    if (!targetResult) {
      setFormMessage("Choose a pattern round before recording the correction.");
      return;
    }
    const changes = {
      roundNumber: optionalInteger(correctionForm.roundNumber),
      startingCount: optionalInteger(correctionForm.startingCount),
      writtenTotal: optionalInteger(correctionForm.writtenTotal),
      repeatCount: optionalInteger(correctionForm.repeatCount),
      consumed: optionalInteger(correctionForm.consumed),
      created: optionalInteger(correctionForm.created),
      classification: correctionForm.classification || undefined,
    };
    const suppliedChanges = Object.fromEntries(Object.entries(changes).filter(([, value]) => value !== undefined));
    const values = {
      lineIndex: targetLineIndex,
      targetRoundNumber: targetResult.round,
      targetSource: targetResult.source,
      ...suppliedChanges,
      note: correctionForm.note.trim() || undefined,
      recordedAt: new Date().toISOString(),
    };
    if (Object.keys(suppliedChanges).length === 0) {
      setFormMessage("Enter at least one corrected value before recording the correction.");
      return;
    }

    try {
      const correction = createCorrection(values) as CorrectionRecord;
      const nextCorrections = [...corrections, correction];
      setCorrections(nextCorrections);
      setWorkspaceDirty(true);
      setCorrectionForm((current) => ({ ...EMPTY_CORRECTION_FORM, target: current.target }));
      setHasReviewed(true);
      const fingerprint = reportFingerprint(nextCorrections);
      if (fingerprint !== lastReviewedFingerprintRef.current) {
        reportGenerationRef.current += 1;
        lastReviewedFingerprintRef.current = fingerprint;
      }
      setFormMessage("Correction recorded. The affected calculation has been rerun locally.");
      trackStitchProofEvent("correction_recorded");
    } catch (error) {
      setFormMessage(error instanceof Error ? error.message : "The correction could not be recorded.");
    }
  }

  function removeCorrection(id: string) {
    const nextCorrections = corrections.filter((correction) => correction.id !== id);
    setCorrections(nextCorrections);
    setWorkspaceDirty(true);
    const fingerprint = reportFingerprint(nextCorrections);
    if (fingerprint !== lastReviewedFingerprintRef.current) {
      reportGenerationRef.current += 1;
      lastReviewedFingerprintRef.current = fingerprint;
    }
    setFormMessage("Correction removed and calculations rerun.");
  }

  function compareVersions(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const comparisonFingerprint = localFingerprint(
      `${previousVersion}\u0000${revisedVersion}\u0000${initialStartingCount}`,
    );
    const isNewComparison = comparisonFingerprint !== lastTrackedComparisonRef.current;
    if (isNewComparison) trackStitchProofEvent("version_comparison_started");
    const nextComparison = comparePatternVersions(
      previousVersion,
      revisedVersion,
      startValue(initialStartingCount),
    ) as VersionComparison;
    setComparison(nextComparison);
    if (!nextComparison.error && isNewComparison) {
      trackStitchProofEvent("version_comparison_completed");
      lastTrackedComparisonRef.current = comparisonFingerprint;
    }
  }

  function downloadCsv() {
    try {
      const csv = exportIssuesCsv({
        analysis,
        metadata: normalizedMetadata(metadata),
        patternText,
        initialStartingCount: startValue(initialStartingCount),
        corrections,
        includeExcerpts,
      });
      downloadText(`${safeFilename(metadata.title)}-issues.csv`, csv, "text/csv;charset=utf-8");
      const message = "Issue CSV created locally. No pattern data was uploaded.";
      setExportMessage(message);
      setStorageMessage(message);
      trackStitchProofEvent("csv_downloaded");
    } catch (error) {
      const message = error instanceof Error ? error.message : "The CSV could not be created.";
      setExportMessage(message);
      setStorageMessage(message);
    }
  }

  function downloadJson() {
    try {
      downloadText(
        `${safeFilename(metadata.title)}-backup.json`,
        exportProjectJson(buildCurrentProject()),
        "application/json;charset=utf-8",
      );
      const message = "JSON backup created locally. Keep it somewhere private.";
      setExportMessage(message);
      setStorageMessage(message);
      trackStitchProofEvent("json_backup_downloaded");
    } catch (error) {
      const message = error instanceof Error ? error.message : "The JSON backup could not be created.";
      setExportMessage(message);
      setStorageMessage(message);
    }
  }

  function applyRestoredProject(value: unknown) {
    if (!value || typeof value !== "object") throw new Error("This is not a StitchProof project backup.");
    const restored = restoreProjectJson(JSON.stringify(value)) as {
      metadata?: Partial<MetadataState> & {
        patternTitle?: string;
        patternVersion?: string;
        reviewDate?: string;
        sectionLabels?: string[];
      };
      patternText?: string;
      initialStartingCount?: number | null;
      corrections?: CorrectionRecord[];
      previousVersion?: string | { patternText?: string } | null;
      revisedVersion?: string | null;
      preferences?: { includeInstructionExcerpts?: boolean };
    };

    setMetadata({
      title: restored.metadata?.patternTitle ?? restored.metadata?.title ?? "",
      designerNickname: restored.metadata?.designerNickname ?? "",
      version: restored.metadata?.patternVersion ?? restored.metadata?.version ?? "",
      reviewedAt: restored.metadata?.reviewDate ?? restored.metadata?.reviewedAt ?? "",
      sectionLabels: Array.isArray(restored.metadata?.sectionLabels)
        ? restored.metadata.sectionLabels.join(", ")
        : String(restored.metadata?.sectionLabels ?? "").replace(/\r?\n/g, ", "),
      designerNotes: restored.metadata?.designerNotes ?? "",
    });
    setPatternText(restored.patternText ?? "");
    setInitialStartingCount(restored.initialStartingCount == null ? "" : String(restored.initialStartingCount));
    setCorrections(Array.isArray(restored.corrections) ? restored.corrections : []);
    setPreviousVersion(
      typeof restored.previousVersion === "string"
        ? restored.previousVersion
        : restored.previousVersion?.patternText ?? "",
    );
    setRevisedVersion(restored.revisedVersion ?? "");
    setIncludeExcerpts(restored.preferences?.includeInstructionExcerpts === true);
    setHasReviewed(true);
    setComparison(null);
    setWorkspaceDirty(false);
    lastReviewedFingerprintRef.current = "";
    lastTrackedReportGenerationRef.current = reportGenerationRef.current;
  }

  async function saveProjectOnDevice() {
    if (!localSavingEnabled) {
      setStorageMessage("Choose the browser-local saving option before saving on this device.");
      return;
    }
    try {
      const project = buildCurrentProject();
      const existing = await loadLocalProject();
      if (existing
        && localFingerprint(JSON.stringify(existing)) !== localFingerprint(JSON.stringify(project))
        && !window.confirm("Replace the existing saved StitchProof project on this device? Download a JSON backup first if you may need it.")) {
        setStorageMessage("Save canceled. The existing local project was not replaced.");
        return;
      }
      await saveLocalProject(project);
      setWorkspaceDirty(false);
      setStorageMessage("Project saved only in this browser on this device.");
    } catch (error) {
      setStorageMessage(error instanceof Error ? error.message : "The project could not be saved locally.");
    }
  }

  async function restoreProjectFromDevice() {
    if (!localSavingEnabled) {
      setStorageMessage("Choose the browser-local saving option before restoring from this device.");
      return;
    }
    if (workspaceDirty
      && !window.confirm("Restore the saved project and replace the unsaved workspace? Download a JSON backup first if you may need the current work.")) {
      setStorageMessage("Restore canceled. The current workspace was not changed.");
      return;
    }
    try {
      const restored = await loadLocalProject();
      if (!restored) {
        setStorageMessage("No saved StitchProof project was found in this browser.");
        return;
      }
      applyRestoredProject(restored);
      setStorageMessage("The project was restored from this browser.");
    } catch (error) {
      setStorageMessage(error instanceof Error ? error.message : "The local project could not be restored.");
    }
  }

  async function deleteProjectFromDevice() {
    if (!localSavingEnabled) {
      setStorageMessage("Enable browser-local saving before deleting a saved project.");
      return;
    }
    if (!window.confirm("Permanently delete the saved StitchProof project from this browser? Download a JSON backup first if you may need it.")) {
      setStorageMessage("Delete canceled. The saved project remains on this device.");
      return;
    }
    try {
      await deleteLocalProject();
      setStorageMessage("The saved project was deleted from this browser.");
    } catch (error) {
      setStorageMessage(error instanceof Error ? error.message : "The local project could not be deleted.");
    }
  }

  async function restoreJsonBackup(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      if (file.size > 2_000_000) {
        setStorageMessage("That JSON backup is larger than the supported 2 MB limit and was not read.");
        return;
      }
      if (workspaceDirty
        && !window.confirm("Restore this JSON backup and replace the unsaved workspace? Download the current project first if you may need it.")) {
        setStorageMessage("JSON restore canceled. The current workspace was not changed.");
        return;
      }
      const restored = restoreProjectJson(await file.text());
      applyRestoredProject(restored);
      setStorageMessage("JSON backup restored locally. Nothing was uploaded.");
    } catch (error) {
      setStorageMessage(error instanceof Error ? error.message : "That JSON backup could not be restored.");
    } finally {
      event.target.value = "";
    }
  }

  function printReport() {
    document.body.classList.add("stitchproof-printing-report");
    const cleanup = () => document.body.classList.remove("stitchproof-printing-report");
    window.addEventListener("afterprint", cleanup, { once: true });
    window.print();
    window.setTimeout(cleanup, 1_000);
  }

  function submitUnsupportedFeedback(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!feedbackCategory) {
      setFeedbackMessage("Choose one notation category first.");
      return;
    }
    const sent = trackStitchProofEvent("unsupported_result_shown", feedbackCategory);
    setFeedbackMessage(
      sent
        ? "Category feedback sent. No pattern text or stitch values were included."
        : "No feedback was sent. Privacy controls or analytics consent may be blocking analytics.",
    );
  }

  function submitPaidReportInterest() {
    if (paidInterestSubmittedRef.current) return;
    const sent = trackStitchProofEvent("paid_report_interest_submitted");
    if (sent) paidInterestSubmittedRef.current = true;
    setPaidInterestMessage(
      sent
        ? "$9 report interest recorded through consented analytics. No email, pattern text, or stitch values were sent."
        : "Interest was not recorded because analytics consent or privacy controls are blocking analytics.",
    );
  }

  const summaryEntries = Object.entries(report.summary ?? analysis.summary).filter(([, value]) => Number.isFinite(value));
  const hydratedCorrections = analysis.corrections ?? corrections;

  return (
    <div className="mt-8">
      <nav className="no-print grid gap-2 rounded-2xl border border-bark-200 bg-white p-2 shadow-sm dark:border-bark-700 dark:bg-bark-800 sm:grid-cols-3" aria-label="Designer workspace views">
        {(["designer", "compare", "report"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => changeView(item)}
            aria-pressed={view === item}
            className={`min-h-12 rounded-xl px-4 py-2 text-sm font-semibold capitalize focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 ${
              view === item
                ? "bg-sage-600 text-white"
                : "text-bark-600 hover:bg-cream-100 dark:text-cream-300 dark:hover:bg-bark-700"
            }`}
          >
            {item}
          </button>
        ))}
      </nav>

      <div role="note" className="no-print mt-5 rounded-xl border border-sage-200 bg-sage-50 p-4 text-sm leading-relaxed text-bark-700 dark:border-sage-800 dark:bg-sage-900/20 dark:text-cream-300">
        <strong>Private by design:</strong> pattern text, titles, names, notes, corrections, and stitch values stay
        in this browser. FiberTools does not upload them or include them in analytics. Nothing is saved unless
        you explicitly choose browser-local saving or download a backup.
      </div>

      {view === "designer" ? (
        <div id="designer" className="no-print mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(22rem,0.8fr)]">
          <div className="space-y-6">
            <form onSubmit={reviewPattern} className="rounded-2xl border border-bark-200 bg-white p-5 shadow-sm dark:border-bark-700 dark:bg-bark-800 sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 id="designer-heading" tabIndex={-1} className="scroll-mt-24 text-2xl font-bold text-bark-800 outline-none dark:text-cream-100">Designer pattern</h2>
                  <p className="mt-2 text-sm text-bark-500 dark:text-bark-400">
                    Enter up to {MAX_DESIGNER_ROUNDS} amigurumi rounds. The original text is never changed by a correction.
                  </p>
                </div>
                  <span className="rounded-full bg-plum-100 px-3 py-1.5 text-xs font-semibold text-plum-700 dark:bg-plum-900/40 dark:text-plum-300">
                  {lineCount(patternText)}/{MAX_DESIGNER_ROUNDS} rounds
                </span>
              </div>

              <fieldset className="mt-6 grid gap-4 sm:grid-cols-2">
                <legend className="sr-only">Pattern metadata</legend>
                <label className="text-sm font-semibold text-bark-700 dark:text-cream-200">
                  Pattern title
                  <input value={metadata.title} onChange={(event) => updateMetadata("title", event.target.value)} maxLength={120} className="mt-2 min-h-12 w-full rounded-xl border border-bark-300 bg-cream-50 px-4 font-normal text-bark-800 focus:border-sage-500 focus:outline-none focus:ring-2 focus:ring-sage-200 dark:border-bark-600 dark:bg-bark-900 dark:text-cream-100" />
                </label>
                <label className="text-sm font-semibold text-bark-700 dark:text-cream-200">
                  Designer nickname
                  <input value={metadata.designerNickname} onChange={(event) => updateMetadata("designerNickname", event.target.value)} maxLength={80} autoComplete="off" className="mt-2 min-h-12 w-full rounded-xl border border-bark-300 bg-cream-50 px-4 font-normal text-bark-800 focus:border-sage-500 focus:outline-none focus:ring-2 focus:ring-sage-200 dark:border-bark-600 dark:bg-bark-900 dark:text-cream-100" />
                </label>
                <label className="text-sm font-semibold text-bark-700 dark:text-cream-200">
                  Pattern version
                  <input value={metadata.version} onChange={(event) => updateMetadata("version", event.target.value)} maxLength={40} placeholder="For example, 1.2" className="mt-2 min-h-12 w-full rounded-xl border border-bark-300 bg-cream-50 px-4 font-normal text-bark-800 focus:border-sage-500 focus:outline-none focus:ring-2 focus:ring-sage-200 dark:border-bark-600 dark:bg-bark-900 dark:text-cream-100" />
                </label>
                <label className="text-sm font-semibold text-bark-700 dark:text-cream-200">
                  Date reviewed
                  <input type="date" value={metadata.reviewedAt} onChange={(event) => updateMetadata("reviewedAt", event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-bark-300 bg-cream-50 px-4 font-normal text-bark-800 focus:border-sage-500 focus:outline-none focus:ring-2 focus:ring-sage-200 dark:border-bark-600 dark:bg-bark-900 dark:text-cream-100" />
                </label>
                <label className="text-sm font-semibold text-bark-700 dark:text-cream-200 sm:col-span-2">
                  Optional section labels
                  <input value={metadata.sectionLabels} onChange={(event) => updateMetadata("sectionLabels", event.target.value)} maxLength={240} placeholder="For example: Head, Body, Arms" className="mt-2 min-h-12 w-full rounded-xl border border-bark-300 bg-cream-50 px-4 font-normal text-bark-800 focus:border-sage-500 focus:outline-none focus:ring-2 focus:ring-sage-200 dark:border-bark-600 dark:bg-bark-900 dark:text-cream-100" />
                </label>
                <label className="text-sm font-semibold text-bark-700 dark:text-cream-200 sm:col-span-2">
                  Designer notes
                  <textarea value={metadata.designerNotes} onChange={(event) => updateMetadata("designerNotes", event.target.value)} rows={3} maxLength={2_000} className="mt-2 w-full rounded-xl border border-bark-300 bg-cream-50 px-4 py-3 font-normal text-bark-800 focus:border-sage-500 focus:outline-none focus:ring-2 focus:ring-sage-200 dark:border-bark-600 dark:bg-bark-900 dark:text-cream-100" />
                </label>
              </fieldset>

              <label className="mt-5 block text-sm font-semibold text-bark-700 dark:text-cream-200">
                Stitches available before the first pasted round
                <input type="number" inputMode="numeric" min="0" step="1" value={initialStartingCount} onChange={(event) => { setInitialStartingCount(event.target.value); setHasReviewed(false); setComparison(null); setWorkspaceDirty(true); }} placeholder="Leave blank for a magic-ring first round" className="mt-2 min-h-12 w-full rounded-xl border border-bark-300 bg-cream-50 px-4 font-normal text-bark-800 focus:border-sage-500 focus:outline-none focus:ring-2 focus:ring-sage-200 dark:border-bark-600 dark:bg-bark-900 dark:text-cream-100" />
              </label>

              <label className="mt-5 block text-sm font-semibold text-bark-700 dark:text-cream-200">
                Pattern rounds
                <textarea value={patternText} onChange={(event) => { setPatternText(event.target.value); setHasReviewed(false); setWorkspaceDirty(true); }} rows={14} spellCheck={false} className="mt-2 w-full rounded-xl border border-bark-300 bg-cream-50 px-4 py-3 font-mono text-sm leading-7 text-bark-800 focus:border-sage-500 focus:outline-none focus:ring-2 focus:ring-sage-200 dark:border-bark-600 dark:bg-bark-900 dark:text-cream-100" aria-describedby="designer-pattern-help" />
              </label>
              <p id="designer-pattern-help" className="mt-2 text-xs leading-relaxed text-bark-500 dark:text-bark-400">
                Use US crochet terminology and one round per line. Unsupported notation is labeled for human review instead of guessed.
              </p>

              <button type="submit" className="btn-primary mt-5 min-h-12 w-full sm:w-auto">
                Review pattern locally
              </button>
            </form>

            <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">
              {hasReviewed
                ? analysis.error ?? `Review complete: ${analysis.summary.totalRounds ?? 0} rounds checked, ${analysis.summary.unresolvedRounds ?? 0} unresolved.`
                : ""}
            </p>
            {hasReviewed ? (
              <section aria-labelledby="designer-results-heading" className="space-y-4">
                <h2 id="designer-results-heading" className="text-2xl font-bold text-bark-800 dark:text-cream-100">Round review</h2>
                {analysis.error ? (
                  <p role="alert" className="rounded-xl border border-rose-300 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-800 dark:bg-rose-950/30 dark:text-rose-200">{analysis.error}</p>
                ) : (
                  <>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      {Object.entries(analysis.summary).map(([key, value]) => (
                        <div key={key} className="rounded-xl border border-bark-200 bg-white p-4 dark:border-bark-700 dark:bg-bark-800">
                          <p className="text-xs text-bark-500">{formatSummaryKey(key)}</p>
                          <p className="mt-1 text-2xl font-bold text-bark-800 dark:text-cream-100">{value}</p>
                        </div>
                      ))}
                    </div>
                    {analysis.numberingIssues.length > 0 ? (
                      <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm dark:border-amber-800 dark:bg-amber-950/30">
                        <h3 className="font-semibold text-bark-800 dark:text-cream-100">Round-number findings</h3>
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-bark-600 dark:text-bark-400">
                          {analysis.numberingIssues.map((issue, index) => <li key={index}>{displayValue(issue)}</li>)}
                        </ul>
                      </div>
                    ) : null}
                    {analysis.results.map((result) => (
                      <article key={result.key} className={`rounded-xl border p-4 sm:p-5 ${STATUS_STYLES[result.status] ?? STATUS_STYLES.unresolved}`}>
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-bark-500">Round {result.round} · line {result.index + 1}</p>
                            <p className="mt-1 break-words font-mono text-sm text-bark-800 dark:text-cream-100">{result.source}</p>
                          </div>
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-bold capitalize text-bark-700 shadow-sm dark:bg-bark-900 dark:text-cream-200">{result.status}</span>
                        </div>
                        <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                          <div><dt className="text-xs text-bark-500">Starting count</dt><dd className="font-bold text-bark-800 dark:text-cream-100">{displayValue(result.startingCount)}</dd></div>
                          <div><dt className="text-xs text-bark-500">Consumed</dt><dd className="font-bold text-bark-800 dark:text-cream-100">{displayValue(result.consumed)}</dd></div>
                          <div><dt className="text-xs text-bark-500">Calculated total</dt><dd className="font-bold text-bark-800 dark:text-cream-100">{displayValue(result.created)}</dd></div>
                          <div><dt className="text-xs text-bark-500">Written total</dt><dd className="font-bold text-bark-800 dark:text-cream-100">{displayValue(result.writtenTotal)}</dd></div>
                        </dl>
                        <p className="mt-3 text-sm leading-relaxed text-bark-700 dark:text-cream-200">{result.message}</p>
                        {result.issueCodes?.length ? <p className="mt-2 text-xs text-bark-500 dark:text-bark-400">Finding categories: {result.issueCodes.join(", ")}</p> : null}
                      </article>
                    ))}
                  </>
                )}
              </section>
            ) : null}
          </div>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-plum-200 bg-plum-50 p-5 dark:border-plum-800 dark:bg-plum-900/20 sm:p-6" aria-labelledby="correction-heading">
              <h2 id="correction-heading" className="text-xl font-bold text-bark-800 dark:text-cream-100">Record a correction</h2>
              <p className="mt-2 text-sm leading-relaxed text-bark-600 dark:text-bark-400">Corrections override parsed values for recalculation while preserving the original pasted line and original parsed values.</p>
              <form onSubmit={recordCorrection} className="mt-5 space-y-4">
                <label className="block text-sm font-semibold text-bark-700 dark:text-cream-200">
                  Pattern line
                  <select value={correctionForm.target} onChange={(event) => setCorrectionForm((current) => ({ ...current, target: event.target.value }))} className="mt-2 min-h-12 w-full rounded-xl border border-bark-300 bg-white px-3 font-normal dark:border-bark-600 dark:bg-bark-900">
                    {analysis.results.map((result) => <option key={result.key} value={result.index}>Line {result.index + 1}: Round {result.round}</option>)}
                  </select>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {([
                    ["roundNumber", "Round number"],
                    ["startingCount", "Starting count"],
                    ["writtenTotal", "Written total"],
                    ["repeatCount", "Parsed repeats"],
                    ["consumed", "Consumed"],
                    ["created", "Created"],
                  ] as const).map(([field, label]) => (
                    <label key={field} className="text-xs font-semibold text-bark-600 dark:text-bark-400">
                      {label}
                      <input type="number" inputMode="numeric" min={field === "roundNumber" || field === "repeatCount" ? 1 : 0} step="1" value={correctionForm[field]} onChange={(event) => setCorrectionForm((current) => ({ ...current, [field]: event.target.value }))} className="mt-1 min-h-11 w-full rounded-lg border border-bark-300 bg-white px-3 text-sm font-normal text-bark-800 dark:border-bark-600 dark:bg-bark-900 dark:text-cream-100" />
                    </label>
                  ))}
                </div>
                <label className="block text-sm font-semibold text-bark-700 dark:text-cream-200">
                  Instruction classification
                  <select value={correctionForm.classification} onChange={(event) => setCorrectionForm((current) => ({ ...current, classification: event.target.value }))} className="mt-2 min-h-12 w-full rounded-xl border border-bark-300 bg-white px-3 font-normal dark:border-bark-600 dark:bg-bark-900">
                    <option value="">No correction</option>
                    <option value="supported">Supported instruction</option>
                    <option value="unsupported">Unsupported notation</option>
                    <option value="setup">Setup instruction</option>
                    <option value="manual-review">Manual review required</option>
                  </select>
                </label>
                <label className="block text-sm font-semibold text-bark-700 dark:text-cream-200">
                  Correction note (optional)
                  <textarea value={correctionForm.note} onChange={(event) => setCorrectionForm((current) => ({ ...current, note: event.target.value }))} rows={2} maxLength={500} className="mt-2 w-full rounded-xl border border-bark-300 bg-white px-3 py-2 font-normal dark:border-bark-600 dark:bg-bark-900" />
                </label>
                <button type="submit" className="btn-primary min-h-12 w-full">Record and recalculate</button>
              </form>
              {formMessage ? <p role="status" className="mt-4 text-sm text-bark-600 dark:text-bark-400">{formMessage}</p> : null}
            </section>

            <section className="rounded-2xl border border-bark-200 bg-white p-5 dark:border-bark-700 dark:bg-bark-800 sm:p-6" aria-labelledby="correction-history-heading">
              <h2 id="correction-history-heading" className="text-xl font-bold text-bark-800 dark:text-cream-100">Correction history</h2>
              {hydratedCorrections.length === 0 ? (
                <p className="mt-3 text-sm text-bark-500 dark:text-bark-400">No corrections recorded. History remains in memory unless you explicitly save or export the project.</p>
              ) : (
                <ol className="mt-4 space-y-3">
                  {hydratedCorrections.map((correction, index) => (
                    <li key={`${correction.id}-${index}`} className="rounded-xl border border-bark-200 p-4 dark:border-bark-700">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-semibold text-bark-700 dark:text-cream-200">Line {correction.lineIndex + 1}</p>
                        <button type="button" onClick={() => removeCorrection(correction.id)} aria-label={`Remove correction ${index + 1} for line ${correction.lineIndex + 1}: ${Object.keys(correction.changes).join(", ")}`} className="min-h-11 rounded-lg px-3 text-xs font-semibold text-rose-700 underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 dark:text-rose-300">Remove</button>
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-bark-500 dark:text-bark-400"><strong>Changed:</strong> {displayValue(correction.changes)}</p>
                      <p className="mt-1 text-xs leading-relaxed text-bark-500 dark:text-bark-400"><strong>Before this correction:</strong> {displayValue(correction.original)}</p>
                      <p className="mt-1 text-xs leading-relaxed text-bark-500 dark:text-bark-400"><strong>After this correction:</strong> {displayValue(correction.effective)}</p>
                      {correction.note ? <p className="mt-1 text-xs leading-relaxed text-bark-500 dark:text-bark-400"><strong>Note:</strong> {correction.note}</p> : null}
                    </li>
                  ))}
                </ol>
              )}
            </section>

            <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-800 dark:bg-amber-950/20 sm:p-6" aria-labelledby="unsupported-feedback-heading">
              <h2 id="unsupported-feedback-heading" className="text-xl font-bold text-bark-800 dark:text-cream-100">What notation should StitchProof support next?</h2>
              <p className="mt-2 text-sm leading-relaxed text-bark-600 dark:text-bark-400">Optional: send one broad category only. Do not paste an instruction or any pattern text. Analytics consent and privacy controls still apply.</p>
              <form onSubmit={submitUnsupportedFeedback} className="mt-4 space-y-3">
                <label className="block text-sm font-semibold text-bark-700 dark:text-cream-200">
                  Unsupported notation category
                  <select value={feedbackCategory} onChange={(event) => setFeedbackCategory(event.target.value as StitchProofUnsupportedCategory | "")} className="mt-2 min-h-12 w-full rounded-xl border border-bark-300 bg-white px-3 font-normal dark:border-bark-600 dark:bg-bark-900">
                    <option value="">Choose a category</option>
                    <option value="nested_repeat">Nested repeat</option>
                    <option value="bobble_popcorn">Bobble or popcorn stitch</option>
                    <option value="custom_stitch">Custom stitch</option>
                    <option value="color_change">Color change</option>
                    <option value="loop_variation">Back-loop or front-loop variation</option>
                    <option value="chain_count_rule">Chain-count rule</option>
                    <option value="row_worked_flat">Row worked flat</option>
                    <option value="other">Other</option>
                  </select>
                </label>
                <button type="submit" className="btn-secondary min-h-11 w-full">Send category feedback</button>
              </form>
              {feedbackMessage ? <p role="status" className="mt-3 text-sm text-bark-600 dark:text-bark-400">{feedbackMessage}</p> : null}
            </section>

            <LocalProjectControls
              enabled={localSavingEnabled}
              dirty={workspaceDirty}
              setEnabled={setLocalSavingEnabled}
              message={storageMessage}
              onSave={saveProjectOnDevice}
              onRestore={restoreProjectFromDevice}
              onDelete={deleteProjectFromDevice}
              onDownloadJson={downloadJson}
              restoreInputRef={restoreInputRef}
              onRestoreJson={restoreJsonBackup}
            />
          </aside>
        </div>
      ) : null}

      {view === "compare" ? (
        <section id="compare" className="no-print mt-6 scroll-mt-24" aria-labelledby="compare-heading">
          <div className="rounded-2xl border border-bark-200 bg-white p-5 shadow-sm dark:border-bark-700 dark:bg-bark-800 sm:p-7">
            <h2 id="compare-heading" tabIndex={-1} className="scroll-mt-24 text-2xl font-bold text-bark-800 outline-none dark:text-cream-100">Compare pattern versions</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-bark-500 dark:text-bark-400">Comparison uses normalized text and the same deterministic round-math engine. It does not use a language model or upload either version.</p>
            <form onSubmit={compareVersions} className="mt-6">
              <div className="grid gap-5 lg:grid-cols-2">
                <label className="text-sm font-semibold text-bark-700 dark:text-cream-200">
                  Previous pattern version
                  <textarea value={previousVersion} onChange={(event) => { setPreviousVersion(event.target.value); setComparison(null); setWorkspaceDirty(true); }} rows={15} spellCheck={false} className="mt-2 w-full rounded-xl border border-bark-300 bg-cream-50 px-4 py-3 font-mono text-sm leading-7 text-bark-800 focus:border-sage-500 focus:outline-none focus:ring-2 focus:ring-sage-200 dark:border-bark-600 dark:bg-bark-900 dark:text-cream-100" />
                </label>
                <label className="text-sm font-semibold text-bark-700 dark:text-cream-200">
                  Revised pattern version
                  <textarea value={revisedVersion} onChange={(event) => { setRevisedVersion(event.target.value); setComparison(null); setWorkspaceDirty(true); }} rows={15} spellCheck={false} className="mt-2 w-full rounded-xl border border-bark-300 bg-cream-50 px-4 py-3 font-mono text-sm leading-7 text-bark-800 focus:border-sage-500 focus:outline-none focus:ring-2 focus:ring-sage-200 dark:border-bark-600 dark:bg-bark-900 dark:text-cream-100" />
                </label>
              </div>
              <button type="submit" className="btn-primary mt-5 min-h-12">Compare revisions locally</button>
            </form>
            <p className="mt-4 text-xs leading-relaxed text-bark-500 dark:text-bark-400">Version changes are included in the Designer QA Report only when the Revised pattern version exactly matches the reviewed Designer pattern.</p>
          </div>

          <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">
            {comparison
              ? comparison.error ?? `Comparison complete: ${comparison.summary.roundsChanged ?? 0} rounds changed and ${comparison.summary.unchangedRounds ?? 0} unchanged.`
              : ""}
          </p>
          {comparison ? (
            <div className="mt-6 space-y-5">
              {comparison.error ? (
                <p role="alert" className="rounded-xl border border-rose-300 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-800 dark:bg-rose-950/30 dark:text-rose-200">{comparison.error}</p>
              ) : (
                <>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Version comparison summary">
                    {Object.entries(comparison.summary).map(([key, value]) => (
                      <div key={key} className="rounded-xl border border-bark-200 bg-white p-4 dark:border-bark-700 dark:bg-bark-800">
                        <p className="text-xs text-bark-500">{formatSummaryKey(key)}</p>
                        <p className="mt-1 text-2xl font-bold text-bark-800 dark:text-cream-100">{value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    {comparison.rounds.map((round) => (
                      <article key={round.key} className="rounded-xl border border-bark-200 bg-white p-4 dark:border-bark-700 dark:bg-bark-800 sm:p-5">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <h3 className="font-bold text-bark-800 dark:text-cream-100">Round {round.round}{round.occurrence > 1 ? `, occurrence ${round.occurrence}` : ""}</h3>
                          <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${round.status === "unchanged" ? "bg-bark-100 text-bark-700" : "bg-plum-100 text-plum-700"}`}>{round.status}</span>
                        </div>
                        {round.changes.length ? <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-bark-600 dark:text-bark-400">{round.changes.map((change) => <li key={change}>{formatSummaryKey(change)}</li>)}</ul> : <p className="mt-3 text-sm text-bark-500">No normalized text or supported-math change.</p>}
                      </article>
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : null}
        </section>
      ) : null}

      {view === "report" && hasReviewed && !analysis.error ? (
        <section id="report" className="mt-6 scroll-mt-24">
          <div className="no-print mb-5 flex flex-wrap items-center gap-3">
            <button type="button" onClick={printReport} className="btn-primary min-h-12">Print or save as PDF</button>
            <button type="button" onClick={downloadCsv} className="btn-secondary min-h-12">Download issue CSV</button>
            <button type="button" onClick={downloadJson} className="btn-secondary min-h-12">Download JSON backup</button>
          </div>
          {exportMessage ? <p role="status" className="no-print mb-5 text-sm text-bark-600 dark:text-bark-400">{exportMessage}</p> : null}

          <label className="no-print mb-5 flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm leading-relaxed text-bark-700 dark:border-amber-800 dark:bg-amber-950/20 dark:text-cream-300">
            <input type="checkbox" checked={includeExcerpts} onChange={(event) => { setIncludeExcerpts(event.target.checked); setWorkspaceDirty(true); }} className="mt-1 h-5 w-5 rounded border-bark-300 text-sage-600 focus:ring-sage-500" />
            <span><strong>Include instruction excerpts in the report and CSV.</strong> Off by default. Turn this on only if you want parts of your pattern included in those local outputs. JSON backup always contains the full project text.</span>
          </label>

          <article id="stitchproof-report" className="rounded-2xl border border-bark-200 bg-white p-5 text-bark-800 shadow-sm dark:border-bark-700 dark:bg-bark-800 dark:text-cream-100 sm:p-8" aria-labelledby="report-heading">
            <header className="border-b-2 border-bark-800 pb-5 dark:border-cream-200">
              <p className="text-sm font-semibold uppercase tracking-widest text-plum-600 dark:text-plum-300">Private Designer QA Report</p>
              <h2 id="report-heading" tabIndex={-1} className="mt-2 scroll-mt-24 text-3xl font-bold outline-none">{metadata.title || "Untitled amigurumi pattern"}</h2>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                <div><dt className="text-bark-500">Designer</dt><dd className="font-semibold">{metadata.designerNickname || "Not provided"}</dd></div>
                <div><dt className="text-bark-500">Version</dt><dd className="font-semibold">{metadata.version || "Not provided"}</dd></div>
                <div><dt className="text-bark-500">Review date</dt><dd className="font-semibold">{metadata.reviewedAt || "Not provided"}</dd></div>
              </dl>
            </header>

            <section className="mt-7">
              <h3 className="text-xl font-bold">Review summary</h3>
              <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {summaryEntries.map(([key, value]) => (
                  <div key={key} className="rounded-lg border border-bark-200 p-3 dark:border-bark-600">
                    <dt className="text-xs text-bark-500">{formatSummaryKey(key)}</dt>
                    <dd className="mt-1 text-xl font-bold">{value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="mt-7">
              <h3 className="text-xl font-bold">Round findings</h3>
              <p className="mt-2 text-sm text-bark-600 dark:text-bark-400">Math results are shown here; numbering and other issue details are listed separately below.</p>
              {analysis.results.length ? (
                <div className="mt-4 overflow-x-auto" tabIndex={0} aria-label="Designer report round findings">
                  <table className="w-full min-w-[44rem] border-collapse text-left text-sm">
                    <thead><tr className="border-b border-bark-300"><th className="p-2">Round</th><th className="p-2">Result</th><th className="p-2">Calculated</th><th className="p-2">Written</th><th className="p-2">Finding</th>{includeExcerpts ? <th className="p-2">Instruction excerpt</th> : null}</tr></thead>
                    <tbody>{analysis.results.map((result) => <tr key={result.key} className="border-b border-bark-100 align-top dark:border-bark-700"><td className="p-2 font-semibold">{result.round}</td><td className="p-2 capitalize">{result.status}</td><td className="p-2">{displayValue(result.created)}</td><td className="p-2">{displayValue(result.writtenTotal)}</td><td className="p-2">{result.message}</td>{includeExcerpts ? <td className="p-2 font-mono text-xs">{result.source}</td> : null}</tr>)}</tbody>
                  </table>
                </div>
              ) : <p className="mt-3 text-sm text-bark-500">No rounds have been entered.</p>}
            </section>

            <section className="mt-7">
              <h3 className="text-xl font-bold">Issue details</h3>
              {report.issueRows?.length ? (
                <ul className="mt-3 space-y-3">
                  {report.issueRows.map((issue, index) => (
                    <li key={`${issue.code}-${issue.round}-${index}`} className="rounded-lg border border-bark-200 p-3 text-sm dark:border-bark-600">
                      <p className="font-semibold">Round {issue.round}: {issue.label}</p>
                      <p className="mt-1 text-bark-600 dark:text-bark-400">{issue.message}</p>
                      {issue.instructionExcerpt ? <p className="mt-2 break-words font-mono text-xs">{issue.instructionExcerpt}</p> : null}
                    </li>
                  ))}
                </ul>
              ) : <p className="mt-3 text-sm text-bark-500">No deterministic issue details were recorded.</p>}
            </section>

            <section className="mt-7">
              <h3 className="text-xl font-bold">User corrections</h3>
              {hydratedCorrections.length ? (
                <ol className="mt-3 space-y-3">{hydratedCorrections.map((correction, index) => <li key={`${correction.id}-report-${index}`} className="rounded-lg border border-bark-200 p-3 text-sm dark:border-bark-600"><strong>Line {correction.lineIndex + 1}:</strong> {displayValue(correction.changes)}<br /><span className="text-bark-500">Before this correction: {displayValue(correction.original)} · After this correction: {displayValue(correction.effective)}</span></li>)}</ol>
              ) : <p className="mt-3 text-sm text-bark-500">No user corrections recorded.</p>}
            </section>

            {comparison && !comparison.error && comparisonMatchesDesigner ? (
              <section className="mt-7">
                <h3 className="text-xl font-bold">Version changes</h3>
                <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">{Object.entries(report.versionSummary ?? {}).map(([key, value]) => <div key={key} className="rounded-lg border border-bark-200 p-3 dark:border-bark-600"><dt className="text-xs text-bark-500">{formatSummaryKey(key)}</dt><dd className="mt-1 text-lg font-bold">{value}</dd></div>)}</dl>
                {report.versionChanges?.length ? (
                  <ol className="mt-4 space-y-3">
                    {report.versionChanges.map((change, index) => (
                      <li key={`report-version-${change.round}-${change.occurrence}-${index}`} className="rounded-lg border border-bark-200 p-3 text-sm dark:border-bark-600">
                        <p className="font-semibold">Round {change.round}{change.occurrence > 1 ? `, occurrence ${change.occurrence}` : ""}: {formatSummaryKey(change.status)}</p>
                        <p className="mt-1 text-bark-600 dark:text-bark-400">{change.changes.length ? change.changes.map(formatSummaryKey).join(", ") : "No normalized text or supported-math change."}</p>
                        {includeExcerpts && (change.previousExcerpt || change.revisedExcerpt) ? (
                          <div className="mt-2 space-y-1 break-words font-mono text-xs">
                            {change.previousExcerpt ? <p>Previous: {change.previousExcerpt}</p> : null}
                            {change.revisedExcerpt ? <p>Revised: {change.revisedExcerpt}</p> : null}
                          </div>
                        ) : null}
                      </li>
                    ))}
                  </ol>
                ) : <p className="mt-3 text-sm text-bark-500">No per-round version changes were recorded.</p>}
              </section>
            ) : null}
            {comparison && !comparison.error && !comparisonMatchesDesigner ? (
              <p className="mt-7 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-bark-700 dark:border-amber-800 dark:bg-amber-950/20 dark:text-cream-300">Version changes are excluded because the separate Revised comparison input does not exactly match this reviewed Designer pattern.</p>
            ) : null}

            <section className="mt-7 grid gap-6 border-t border-bark-200 pt-6 dark:border-bark-600 lg:grid-cols-2">
              <div><h3 className="text-lg font-bold">Methodology</h3><ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed text-bark-600 dark:text-bark-400">{asList(report.methodology).map((item) => <li key={item}>{item}</li>)}</ul></div>
              <div><h3 className="text-lg font-bold">Limitations</h3><ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed text-bark-600 dark:text-bark-400">{asList(report.limitations).map((item) => <li key={item}>{item}</li>)}</ul></div>
            </section>
            <p className="mt-6 rounded-lg bg-sage-50 p-4 text-sm leading-relaxed text-bark-700 dark:bg-sage-900/20 dark:text-cream-300">{report.privacyStatement}</p>
            <p className="mt-4 text-xs leading-relaxed text-bark-500">This deterministic report is a planning aid. It does not certify that a pattern is perfect, error-free, human-written, safe, or ready to publish. Physical pattern testing and human editorial review remain necessary.</p>
          </article>

          <div className="no-print mt-6 grid gap-5 lg:grid-cols-2">
            <section className="rounded-2xl border border-plum-200 bg-plum-50 p-5 dark:border-plum-800 dark:bg-plum-900/20 sm:p-6">
              <p className="text-sm font-semibold uppercase tracking-wider text-plum-600 dark:text-plum-300">Founding-access validation</p>
              <h2 className="mt-2 text-xl font-bold text-bark-800 dark:text-cream-100">Designer Report — proposed $9 one-time</h2>
              <p className="mt-2 text-sm leading-relaxed text-bark-600 dark:text-bark-400">Checkout is not open, no payment is being collected, and access is not guaranteed. You can record a privacy-minimized $9 interest event through consented analytics without sending an email, pattern text, or stitch values.</p>
              <button type="button" onClick={submitPaidReportInterest} disabled={paidInterestSubmittedRef.current} className="btn-primary mt-4 min-h-12 disabled:cursor-not-allowed disabled:opacity-60">{paidInterestSubmittedRef.current ? "Interest recorded" : "Count my $9 report interest"}</button>
              {paidInterestMessage ? <p role="status" className="mt-3 text-sm text-bark-600 dark:text-bark-400">{paidInterestMessage}</p> : null}
              <p className="mt-4 text-xs leading-relaxed text-bark-500 dark:text-bark-400">This consent-gated analytics signal does not reserve access. For a reply, email without attaching or pasting your pattern.</p>
              <a href="mailto:hello@fibertools.app?subject=StitchProof%20founding-access%20request&body=I%20would%20like%20to%20hear%20when%20the%20%249%20StitchProof%20Designer%20Report%20is%20available.%0A%0APlease%20do%20not%20include%20pattern%20text%20in%20this%20email." className="btn-secondary mt-3 inline-flex min-h-12 items-center justify-center">Email a founding-access request</a>
            </section>
            <section className="rounded-2xl border border-sage-200 bg-sage-50 p-5 dark:border-sage-800 dark:bg-sage-900/20 sm:p-6">
              <p className="text-sm font-semibold uppercase tracking-wider text-sage-700 dark:text-sage-300">Separate human service</p>
              <h2 className="mt-2 text-xl font-bold text-bark-800 dark:text-cream-100">Need a person to review unresolved instructions?</h2>
              <p className="mt-2 text-sm leading-relaxed text-bark-600 dark:text-bark-400">The $39 Designer Pattern Preflight pilot is a separate bounded manual review. It is not part of the $9 report and does not certify or replace professional tech editing or pattern testing.</p>
              <Link href="/designer-pattern-preflight" onClick={() => trackStitchProofEvent("manual_preflight_clicked")} className="btn-secondary mt-4 inline-flex min-h-12 items-center justify-center">See the $39 manual preflight</Link>
            </section>
          </div>
        </section>
      ) : null}
    </div>
  );
}

type LocalProjectControlsProps = {
  enabled: boolean;
  dirty: boolean;
  setEnabled: (enabled: boolean) => void;
  message: string;
  onSave: () => void;
  onRestore: () => void;
  onDelete: () => void;
  onDownloadJson: () => void;
  restoreInputRef: React.RefObject<HTMLInputElement | null>;
  onRestoreJson: (event: ChangeEvent<HTMLInputElement>) => void;
};

function LocalProjectControls({ enabled, dirty, setEnabled, message, onSave, onRestore, onDelete, onDownloadJson, restoreInputRef, onRestoreJson }: LocalProjectControlsProps) {
  return (
    <section className="rounded-2xl border border-sage-200 bg-sage-50 p-5 dark:border-sage-800 dark:bg-sage-900/20 sm:p-6" aria-labelledby="local-project-heading">
      <h2 id="local-project-heading" className="text-xl font-bold text-bark-800 dark:text-cream-100">Local project controls</h2>
      <p className="mt-2 text-sm leading-relaxed text-bark-600 dark:text-bark-400">Saving is off by default. A saved project exists only in this browser on this device. Clearing browser data removes it, and other devices cannot access it.</p>
      <p className="mt-2 text-xs font-semibold text-bark-600 dark:text-bark-400">Changes since page load or the last local save or restore: {dirty ? "not saved on this device" : "none detected"}.</p>
      <label className="mt-4 flex items-start gap-3 text-sm font-semibold text-bark-700 dark:text-cream-200">
        <input type="checkbox" checked={enabled} onChange={(event) => setEnabled(event.target.checked)} className="mt-1 h-5 w-5 rounded border-bark-300 text-sage-600 focus:ring-sage-500" />
        Enable browser-local saving on this device
      </label>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <button type="button" onClick={onSave} disabled={!enabled} className="btn-primary min-h-11 disabled:cursor-not-allowed disabled:opacity-50">Save on this device</button>
        <button type="button" onClick={onRestore} disabled={!enabled} className="btn-secondary min-h-11 disabled:cursor-not-allowed disabled:opacity-50">Restore from device</button>
        <button type="button" onClick={onDelete} disabled={!enabled} className="min-h-11 rounded-lg border border-rose-300 px-3 py-2 text-sm font-semibold text-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-rose-800 dark:text-rose-300">Delete local project</button>
        <button type="button" onClick={onDownloadJson} className="btn-secondary min-h-11">Download JSON backup</button>
        <button type="button" onClick={() => restoreInputRef.current?.click()} className="btn-secondary min-h-11 sm:col-span-2">Restore JSON backup</button>
        <input ref={restoreInputRef} type="file" accept="application/json,.json" onChange={onRestoreJson} tabIndex={-1} className="hidden" aria-hidden="true" />
      </div>
      <p className="mt-3 text-xs leading-relaxed text-bark-500 dark:text-bark-400">JSON backup files contain the full pattern, metadata, notes, and corrections. Keep them somewhere private. Restore reads the selected file in this browser; it is not uploaded.</p>
      {message ? <p role="status" className="mt-3 text-sm text-bark-600 dark:text-bark-400">{message}</p> : null}
    </section>
  );
}
