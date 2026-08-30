"use client";

import { useId, useState } from "react";

interface TooltipProps {
  text: string;
}

export default function Tooltip({ text }: TooltipProps) {
  const [show, setShow] = useState(false);
  const tooltipId = useId();

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <button
        type="button"
        className="tooltip-trigger"
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        onClick={() => setShow(!show)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            setShow(false);
          }
        }}
        aria-label={text}
        aria-describedby={show ? tooltipId : undefined}
        aria-expanded={show}
      >
        ?
      </button>
      {show && (
        <span id={tooltipId} role="tooltip" className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 text-xs leading-relaxed text-bark-700 dark:text-cream-200 bg-white dark:bg-bark-700 border border-cream-300 dark:border-bark-600 rounded-xl shadow-lg">
          {text}
          <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-white dark:border-t-bark-700" />
        </span>
      )}
    </span>
  );
}
