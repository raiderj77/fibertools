"use client";

export type UnitSystem = "imperial" | "metric";

interface UnitToggleProps {
  value: UnitSystem;
  onChange: (unit: UnitSystem) => void;
}

export default function UnitToggle({ value, onChange }: UnitToggleProps) {
  return (
    <div className="inline-flex items-center bg-cream-200 dark:bg-bark-700 rounded-xl p-1">
      <button
        type="button"
        onClick={() => onChange("imperial")}
        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
          value === "imperial"
            ? "bg-white dark:bg-bark-600 text-bark-800 dark:text-cream-100 shadow-sm"
            : "text-bark-500 dark:text-bark-400 hover:text-bark-700 dark:hover:text-cream-300"
        }`}
      >
        Yards / Inches
      </button>
      <button
        type="button"
        onClick={() => onChange("metric")}
        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
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
