"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  buildColorCombination,
  buildPaletteShareQuery,
  parsePaletteShareQuery,
  COLOR_COMBINATION_MODES,
  COLOR_COMBINATION_PROJECTS,
  COLOR_COMBINATION_YARN_FORMS,
} from "@/lib/color-combinations.mjs";
import { extractPhotoPalette } from "@/lib/photo-palette.mjs";
import useToolCompletion from "@/lib/useToolCompletion";

const PRESET_COLORS = [
  { name: "Denim Blue", hex: "#3B6EA5" },
  { name: "Terracotta", hex: "#C96F53" },
  { name: "Sage", hex: "#7A8B6F" },
  { name: "Mustard", hex: "#D9A441" },
  { name: "Plum", hex: "#7A4E8C" },
  { name: "Blush", hex: "#D98E9B" },
  { name: "Forest", hex: "#2F5D50" },
  { name: "Burgundy", hex: "#7B2D3B" },
  { name: "Teal", hex: "#2E7D7B" },
  { name: "Rust", hex: "#A44A24" },
  { name: "Cream", hex: "#E8DCC8" },
  { name: "Charcoal", hex: "#3B3B3B" },
] as const;

const MODE_KEYS = Object.keys(COLOR_COMBINATION_MODES);
const PROJECT_KEYS = Object.keys(COLOR_COMBINATION_PROJECTS);
const YARN_FORM_KEYS = Object.keys(COLOR_COMBINATION_YARN_FORMS);

const SURPRISE_COLORS = [
  "#B03A2E", "#1F618D", "#117A65", "#7D3C98",
  "#B7950B", "#CA6F1E", "#5D6D7E", "#884EA0",
  "#148F77", "#A93226", "#2E86AB", "#C27BA0",
  "#6C3483", "#7B7D3A", "#9A7B4F", "#345995",
] as const;

export default function ColorCombinationTool({ embedded = false }: { embedded?: boolean }) {
  const [baseColor, setBaseColor] = useState<string>("#3B6EA5");
  const [mode, setMode] = useState("standard");
  const [project, setProject] = useState("blanket");
  const [colorCount, setColorCount] = useState(4);
  const [yarnForm, setYarnForm] = useState("solids");
  const [photoColors, setPhotoColors] = useState<Array<{ hex: string; sharePercent: number }> | null>(null);
  const [photoMessage, setPhotoMessage] = useState("");
  const [actionStatus, setActionStatus] = useState("");

  const preview = useMemo(
    () => buildColorCombination({ baseColor, mode, project, colorCount, yarnForm }),
    [baseColor, mode, project, colorCount, yarnForm],
  );
  const result = "palette" in preview ? preview : null;

  useToolCompletion("color-combination-generator", result, !embedded && Boolean(result));

  const appliedShareRef = useRef(false);
  useEffect(() => {
    if (embedded || appliedShareRef.current) return;
    appliedShareRef.current = true;
    const shared = parsePaletteShareQuery(window.location.search);
    if (shared.baseColor) setBaseColor(shared.baseColor);
    if (shared.mode) setMode(shared.mode);
    if (shared.project) setProject(shared.project);
    if (shared.colorCount) setColorCount(shared.colorCount);
    if (shared.yarnForm) setYarnForm(shared.yarnForm);
  }, [embedded]);

  function surprise() {
    const choices = SURPRISE_COLORS.filter((hex) => hex !== baseColor);
    setBaseColor(choices[Math.floor(Math.random() * choices.length)]);
  }

  async function copyText(text: string, doneMessage: string) {
    try {
      await navigator.clipboard.writeText(text);
      setActionStatus(doneMessage);
    } catch {
      setActionStatus("Copy is unavailable in this browser.");
    }
  }

  function shareUrl() {
    const query = buildPaletteShareQuery({ baseColor, mode, project, colorCount, yarnForm });
    return `https://fibertools.app/color-combination-generator${query ? `?${query}` : ""}`;
  }

  function copyPalette() {
    if (!result) return;
    const lines = [
      `${result.modeLabel} palette for a ${result.projectLabel.toLowerCase()} (FiberTools Color Combination Generator)`,
      ...result.palette.map(
        (color) => `${color.role}: ${color.name} ${color.hex}, about ${color.sharePercent}%`,
      ),
      result.lowContrastPairs.length > 0
        ? `Value check: ${result.lowContrastPairs.map((pair) => pair.message).join(" ")}`
        : "Value check: no pair falls below the 1.30:1 low-contrast warning line.",
      shareUrl(),
    ];
    void copyText(lines.join("\n"), "Palette copied.");
  }

  async function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setPhotoMessage("Reading the colors in your photo...");
    try {
      const bitmap = await createImageBitmap(file);
      const scale = Math.min(1, 200 / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) throw new Error("Canvas is unavailable.");
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      const extracted = extractPhotoPalette(
        context.getImageData(0, 0, canvas.width, canvas.height).data,
        { maxColors: 5 },
      );
      if (!extracted.ok) {
        setPhotoColors(null);
        setPhotoMessage(extracted.error);
        return;
      }
      setPhotoColors(extracted.colors);
      setPhotoMessage(
        "Colors found in your photo. Tap one to build a palette around it. The photo stayed on your device.",
      );
    } catch {
      setPhotoColors(null);
      setPhotoMessage("That photo could not be read. Try a JPG or PNG photo.");
    }
  }

  return (
    <div className="space-y-7">
      <div className="rounded-xl border border-sage-200 bg-sage-50/60 p-4 text-sm text-bark-700 dark:border-sage-800 dark:bg-sage-950/20 dark:text-cream-300">
        <p className="font-semibold text-bark-800 dark:text-cream-100">Start with one color you already like</p>
        <p className="mt-1">
          Pick a main color, choose how brave the combination should feel, and the generator builds the
          companion colors with plain-language roles and shares. Screen colors vary by yarn, dye lot, fiber,
          and light, so compare the physical yarn before buying a full project quantity.
        </p>
      </div>

      <section aria-labelledby="combo-main-color-heading">
        <h2 id="combo-main-color-heading" className="label mb-0">Main color</h2>
        <p className="mt-1 text-xs text-bark-500 dark:text-bark-400">
          Choose a preset or use the color field to match a yarn you already own as closely as you can.
        </p>
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
          {PRESET_COLORS.map((preset) => (
            <button
              key={preset.hex}
              type="button"
              onClick={() => setBaseColor(preset.hex)}
              aria-pressed={baseColor === preset.hex}
              aria-label={`Use ${preset.name} ${preset.hex} as the main color`}
              className="rounded-lg border border-cream-300 p-2 text-left hover:border-sage-400 dark:border-bark-600"
            >
              <span
                aria-hidden="true"
                className="block h-9 rounded-md border border-black/10"
                style={{ backgroundColor: preset.hex }}
              />
              <span className="mt-2 block text-xs font-medium text-bark-700 dark:text-cream-200">{preset.name}</span>
              <span className="block text-[11px] text-bark-400">{preset.hex}</span>
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-end gap-4">
          <div>
            <label htmlFor="combo-base-color" className="label">Custom main color</label>
            <input
              id="combo-base-color"
              type="color"
              value={baseColor}
              onChange={(event) => setBaseColor(event.target.value.toUpperCase())}
              className="h-12 w-16 cursor-pointer rounded-lg border-2 border-cream-300 p-1 dark:border-bark-600"
            />
          </div>
          <p className="pb-2 text-sm text-bark-600 dark:text-bark-300">
            Current main color: <strong>{baseColor}</strong>
          </p>
        </div>
        <div className="mt-3">
          <button type="button" onClick={surprise} className="btn-secondary min-h-11 text-sm">
            Surprise me with a different main color
          </button>
        </div>
      </section>

      <section aria-labelledby="combo-photo-heading" className="rounded-xl border border-cream-300 p-4 dark:border-bark-600">
        <h3 id="combo-photo-heading" className="label mb-0">Start from a photo</h3>
        <p className="mt-1 text-xs text-bark-500 dark:text-bark-400">
          Use a photo of yarn you own, a finished blanket, or a picture you love. The main colors are read
          on your device. Nothing is uploaded.
        </p>
        <div className="mt-3">
          <label htmlFor="combo-photo" className="label">Photo of your yarn or inspiration</label>
          <input
            id="combo-photo"
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="block w-full text-sm text-bark-600 file:mr-3 file:min-h-11 file:cursor-pointer file:rounded-lg file:border file:border-cream-300 file:bg-white file:px-4 file:text-sm file:font-medium dark:text-bark-300 dark:file:border-bark-600 dark:file:bg-bark-800"
          />
        </div>
        {photoMessage ? (
          <p className="mt-2 text-sm text-bark-600 dark:text-bark-300" role="status">{photoMessage}</p>
        ) : null}
        {photoColors ? (
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
            {photoColors.map((color) => (
              <button
                key={color.hex}
                type="button"
                onClick={() => setBaseColor(color.hex)}
                aria-pressed={baseColor === color.hex}
                aria-label={`Use photo color ${color.hex} as the main color`}
                className="rounded-lg border border-cream-300 p-2 text-left hover:border-sage-400 dark:border-bark-600"
              >
                <span
                  aria-hidden="true"
                  className="block h-9 rounded-md border border-black/10"
                  style={{ backgroundColor: color.hex }}
                />
                <span className="mt-2 block text-xs font-medium text-bark-700 dark:text-cream-200">{color.hex}</span>
                <span className="block text-[11px] text-bark-400">About {color.sharePercent}% of the photo</span>
              </button>
            ))}
          </div>
        ) : null}
      </section>

      <fieldset>
        <legend className="label">How brave should the combination feel?</legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {MODE_KEYS.map((key) => {
            const details = COLOR_COMBINATION_MODES[key as keyof typeof COLOR_COMBINATION_MODES];
            return (
              <label
                key={key}
                htmlFor={`combo-mode-${key}`}
                className="flex cursor-pointer gap-3 rounded-lg border border-cream-300 p-3 dark:border-bark-600"
              >
                <input
                  id={`combo-mode-${key}`}
                  name="combo-mode"
                  type="radio"
                  value={key}
                  checked={mode === key}
                  onChange={(event) => setMode(event.target.value)}
                  className="mt-1 h-5 w-5 shrink-0"
                />
                <span>
                  <span className="block text-sm font-semibold text-bark-800 dark:text-cream-100">{details.label}</span>
                  <span className="mt-1 block text-xs leading-relaxed text-bark-500 dark:text-bark-400">{details.description}</span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="combo-project" className="label">Project type</label>
          <select
            id="combo-project"
            value={project}
            onChange={(event) => setProject(event.target.value)}
            className="select"
          >
            {PROJECT_KEYS.map((key) => (
              <option key={key} value={key}>
                {COLOR_COMBINATION_PROJECTS[key as keyof typeof COLOR_COMBINATION_PROJECTS]}
              </option>
            ))}
          </select>
        </div>

        <fieldset>
          <legend className="label">Number of colors</legend>
          <div className="flex gap-2">
            {[3, 4, 5].map((count) => (
              <label
                key={count}
                htmlFor={`combo-count-${count}`}
                className="flex min-h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-cream-300 px-3 dark:border-bark-600"
              >
                <input
                  id={`combo-count-${count}`}
                  name="combo-color-count"
                  type="radio"
                  value={count}
                  checked={colorCount === count}
                  onChange={() => setColorCount(count)}
                  className="h-5 w-5"
                />
                <span className="text-sm font-medium">{count}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="combo-yarn-form" className="label">Yarn or fabric mix</label>
          <select
            id="combo-yarn-form"
            value={yarnForm}
            onChange={(event) => setYarnForm(event.target.value)}
            className="select"
          >
            {YARN_FORM_KEYS.map((key) => (
              <option key={key} value={key}>
                {COLOR_COMBINATION_YARN_FORMS[key as keyof typeof COLOR_COMBINATION_YARN_FORMS]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!result ? (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/20 dark:text-red-300">
          {"error" in preview ? preview.error : "Choose supported palette options."}
        </p>
      ) : null}

      {result ? (
        <div className="space-y-7" aria-live="polite">
          <section aria-labelledby="combo-palette-heading" className="result-card">
            <h3 id="combo-palette-heading" className="text-lg font-display font-bold text-sage-700 dark:text-sage-300">
              {result.modeLabel} palette for a {result.projectLabel.toLowerCase()}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-bark-600 dark:text-bark-300">{result.modeDescription}</p>
            <p className="mt-2 text-sm text-bark-600 dark:text-bark-300">
              <strong>Best for:</strong> {result.bestFor}. <strong>Not for:</strong> {result.notFor}.
            </p>

            {!embedded ? (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button type="button" onClick={copyPalette} className="btn-secondary min-h-11 text-sm">
                  Copy palette
                </button>
                <button
                  type="button"
                  onClick={() => void copyText(shareUrl(), "Palette link copied.")}
                  className="btn-secondary min-h-11 text-sm"
                >
                  Copy palette link
                </button>
                <span aria-live="polite" className="text-sm text-bark-500 dark:text-bark-400">{actionStatus}</span>
              </div>
            ) : null}

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {result.palette.map((color) => (
                <article key={color.role} className="overflow-hidden rounded-xl border border-cream-300 dark:border-bark-600">
                  <div
                    aria-hidden="true"
                    className="h-24 border-b border-black/10"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className="space-y-1 p-4">
                    <h4 className="font-semibold text-bark-800 dark:text-cream-100">{color.role}: {color.name}</h4>
                    <p className="text-sm text-bark-600 dark:text-bark-300">{color.hex}</p>
                    <p className="text-sm text-bark-600 dark:text-bark-300">Use about {color.sharePercent}% of the color area.</p>
                    <p className="text-sm text-bark-600 dark:text-bark-300">
                      Value: {color.valueLabel}. Contrast with main: {color.contrastWithMain.toFixed(2)}:1.
                    </p>
                    <p className="text-xs text-bark-400">
                      HSL {color.hsl.h}°, {color.hsl.s}%, {color.hsl.l}%
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section aria-labelledby="combo-grayscale-heading">
            <h3 id="combo-grayscale-heading" className="label">Grayscale value check</h3>
            <p className="mt-1 text-sm text-bark-600 dark:text-bark-300">
              This strip removes hue and keeps relative lightness. If two blocks look nearly the same here,
              those colors can blend in stripes, motifs, and colorwork even when the yarn colors look different.
            </p>
            <div
              className="mt-3 flex overflow-hidden rounded-xl border border-cream-300 dark:border-bark-600"
              role="img"
              aria-label={`Grayscale values in palette order: ${result.palette.map((color) => `${color.role} ${color.valueLabel}`).join(", ")}`}
            >
              {result.palette.map((color) => (
                <div
                  key={color.role}
                  aria-hidden="true"
                  className="flex h-16 flex-1 items-end justify-center pb-2 text-[11px] font-semibold"
                  style={{
                    backgroundColor: color.grayscaleHex,
                    color: color.valueLabel === "Light" ? "#3f3428" : "#fff8ec",
                  }}
                >
                  {color.role}
                </div>
              ))}
            </div>
            <ul className="mt-3 grid grid-cols-1 gap-2 text-sm text-bark-600 dark:text-bark-300 sm:grid-cols-2">
              {result.palette.map((color) => (
                <li key={color.role}>
                  <strong>{color.role}</strong>: {color.valueLabel}, grayscale {color.grayscaleHex}
                </li>
              ))}
            </ul>

            {result.lowContrastPairs.length > 0 ? (
              <div className="mt-4 rounded-lg border border-amber-300 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/20" role="note">
                <h4 className="font-semibold text-amber-900 dark:text-amber-200">Check these pairs in a swatch</h4>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-amber-900 dark:text-amber-100">
                  {result.lowContrastPairs.map((pair) => (
                    <li key={`${pair.firstRole}-${pair.secondRole}`}>{pair.message}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="mt-4 rounded-lg bg-sage-50 p-3 text-sm text-sage-800 dark:bg-sage-950/20 dark:text-sage-200">
                No pair in this palette falls below the 1.30:1 low-contrast warning line used by this tool. A physical
                swatch still matters because fiber, stitch texture, and light change what you see.
              </p>
            )}
          </section>

          <section aria-labelledby="combo-stripe-heading">
            <h3 id="combo-stripe-heading" className="label">Simple 20-block stripe cycle</h3>
            <p className="mt-1 text-sm text-bark-600 dark:text-bark-300">
              Use this as a starting rhythm for stripes or square rounds. The block counts follow the palette shares.
            </p>
            <div
              className="mt-3 flex h-14 overflow-hidden rounded-xl border border-cream-300 dark:border-bark-600"
              role="img"
              aria-label={`Stripe cycle: ${result.stripeSequence.map((entry) => `${entry.role} ${entry.blocks} blocks`).join(", ")}`}
            >
              {result.stripeSequence.map((entry) => (
                <div
                  key={entry.role}
                  aria-hidden="true"
                  style={{ backgroundColor: entry.hex, flexGrow: entry.blocks }}
                  className="min-w-3"
                />
              ))}
            </div>
            <details className="mt-3 rounded-lg border border-cream-300 p-3 text-sm dark:border-bark-600">
              <summary className="cursor-pointer font-medium text-bark-700 dark:text-cream-300">
                Text version of the stripe cycle
              </summary>
              <ul className="mt-3 space-y-1 text-bark-600 dark:text-bark-300">
                {result.stripeSequence.map((entry) => (
                  <li key={entry.role}><strong>{entry.role}</strong>: {entry.blocks} of 20 blocks, {entry.hex}</li>
                ))}
              </ul>
            </details>
          </section>

          <section className="grid grid-cols-1 gap-4 lg:grid-cols-2" aria-label="Palette guidance">
            <div className="result-card">
              <h3 className="mb-2 font-semibold text-bark-700 dark:text-cream-200">How to use this palette</h3>
              <p className="text-sm leading-relaxed text-bark-600 dark:text-bark-300">{result.projectGuidance}</p>
              <p className="mt-3 text-sm leading-relaxed text-bark-600 dark:text-bark-300">{result.yarnGuidance}</p>
            </div>
            <div className="result-card">
              <h3 className="mb-2 font-semibold text-bark-700 dark:text-cream-200">What to avoid</h3>
              <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-bark-600 dark:text-bark-300">
                {result.avoid.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
