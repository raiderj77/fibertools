"use client";

import { useEffect, useRef } from "react";

export type UnitSystem = "imperial" | "metric";

interface UnitToggleProps {
  value: UnitSystem;
  onChange: (unit: UnitSystem) => void;
}

/** Read saved preference on mount, call in any tool that uses units */
export function useSavedUnits(
  setValue: (u: UnitSystem) => void
) {
  const didInitialize = useRef(false);
  useEffect(() => {
    if (didInitialize.current) return;
    didInitialize.current = true;
    try {
      const saved = localStorage.getItem("ft-units") as UnitSystem | null;
      if (saved === "imperial" || saved === "metric") {
        setValue(saved);
      }
    } catch {}
  }, [setValue]);
}

export default function UnitToggle({ value, onChange }: UnitToggleProps) {
  // Persist choice
  const handleChange = (unit: UnitSystem) => {
    onChange(unit);
    try {
      localStorage.setItem("ft-units", unit);
    } catch {}
  };

  return (
    <div className="inline-flex items-center bg-cream-200 dark:bg-bark-700 rounded-xl p-1" role="group" aria-label="Measurement units">
      <button
        type="button"
        onClick={() => handleChange("imperial")}
        aria-pressed={value === "imperial"}
        className={`min-h-12 px-4 py-2.5 sm:py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
          value === "imperial"
            ? "bg-white dark:bg-bark-600 text-bark-800 dark:text-cream-100 shadow-sm"
            : "text-bark-500 dark:text-bark-400 hover:text-bark-700 dark:hover:text-cream-300"
        }`}
      >
        Yards / Inches
      </button>
      <button
        type="button"
        onClick={() => handleChange("metric")}
        aria-pressed={value === "metric"}
        className={`min-h-12 px-4 py-2.5 sm:py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
          value === "metric"
            ? "bg-white dark:bg-bark-600 text-bark-800 dark:text-cream-100 shadow-sm"
            : "text-bark-500 dark:text-bark-400 hover:text-bark-700 dark:hover:text-cream-300"
        }`}
      >
        Meters / cm
      </button>
    </div>
  );
}
