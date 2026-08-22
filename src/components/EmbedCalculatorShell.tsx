import type { ReactNode } from "react";

interface EmbedCalculatorShellProps {
  name: string;
  description: string;
  fullCalculatorPath: string;
  children: ReactNode;
}

export default function EmbedCalculatorShell({
  name,
  description,
  fullCalculatorPath,
  children,
}: EmbedCalculatorShellProps) {
  return (
    <div className="mx-auto w-full max-w-4xl px-3 py-4 sm:px-5 sm:py-6">
      <div className="mb-6 flex flex-col gap-3 border-b border-cream-300 pb-4 sm:flex-row sm:items-start sm:justify-between dark:border-bark-700">
        <div>
          <a
            href="https://fibertools.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 font-display text-lg text-sage-700 underline-offset-4 hover:underline dark:text-sage-300"
          >
            <span aria-hidden="true">🧶</span>
            FiberTools
          </a>
          <h1 className="mt-1 font-display text-2xl text-bark-800 dark:text-cream-100">{name}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-bark-500 dark:text-bark-400">
            {description}
          </p>
        </div>
        <a
          href={`https://fibertools.app${fullCalculatorPath}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary min-h-11 shrink-0 text-sm"
        >
          Open full calculator
        </a>
      </div>
      {children}
    </div>
  );
}
