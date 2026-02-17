"use client";

interface NumberStepperProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  label?: string;
}

export default function NumberStepper({
  value,
  onChange,
  min,
  max,
  step = 1,
  label,
}: NumberStepperProps) {
  const clamp = (v: number) => Math.min(max, Math.max(min, v));

  return (
    <div className="space-y-2">
      {label && <label className="label">{label}</label>}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(clamp(value - step))}
          disabled={value <= min}
          className="w-11 h-11 flex items-center justify-center rounded-lg
            bg-cream-100 dark:bg-bark-700 border border-cream-300
            dark:border-bark-600 text-lg font-bold text-bark-600
            dark:text-cream-300 active:bg-cream-200 dark:active:bg-bark-600
            disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label={`Decrease ${label || "value"}`}
        >
          &minus;
        </button>

        <input
          type="number"
          value={value}
          onChange={(e) => {
            const parsed = parseInt(e.target.value);
            if (!isNaN(parsed)) onChange(clamp(parsed));
          }}
          min={min}
          max={max}
          step={step}
          inputMode="numeric"
          className="w-16 text-center input font-mono text-lg"
          aria-label={label || "Value"}
        />

        <button
          type="button"
          onClick={() => onChange(clamp(value + step))}
          disabled={value >= max}
          className="w-11 h-11 flex items-center justify-center rounded-lg
            bg-cream-100 dark:bg-bark-700 border border-cream-300
            dark:border-bark-600 text-lg font-bold text-bark-600
            dark:text-cream-300 active:bg-cream-200 dark:active:bg-bark-600
            disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label={`Increase ${label || "value"}`}
        >
          +
        </button>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full accent-sage-600"
        aria-label={`${label || "Value"} slider`}
      />

      <div className="flex justify-between text-xs text-bark-400 dark:text-bark-500">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
