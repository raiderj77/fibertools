"use client";

import Link from "next/link";
import { useState } from "react";
import { tools } from "@/lib/tools";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleDark = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const readyTools = tools.filter((t) => t.ready);
  const navTools = readyTools.length > 0 ? readyTools : tools.slice(0, 5);

  return (
    <header className="sticky top-0 z-50 bg-cream-50/90 dark:bg-bark-900/90 backdrop-blur-md border-b border-cream-300 dark:border-bark-700 no-print">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl" aria-hidden="true">🧶</span>
            <span className="font-display text-xl font-bold text-bark-800 dark:text-cream-100 group-hover:text-sage-600 dark:group-hover:text-sage-400 transition-colors">
              FiberTools
            </span>
            <span className="hidden sm:inline text-xs font-medium text-bark-400 dark:text-bark-500 bg-cream-200 dark:bg-bark-700 px-2 py-0.5 rounded-full">
              .app
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/${tool.slug}`}
                className="px-3 py-2 text-sm font-medium text-bark-600 dark:text-cream-300 hover:text-sage-600 dark:hover:text-sage-400 hover:bg-sage-50 dark:hover:bg-sage-900/20 rounded-lg transition-colors"
              >
                {tool.shortName}
              </Link>
            ))}
            {tools.length > 5 && (
              <Link
                href="/#all-tools"
                className="px-3 py-2 text-sm font-medium text-sage-600 dark:text-sage-400 hover:bg-sage-50 dark:hover:bg-sage-900/20 rounded-lg transition-colors"
              >
                All Tools →
              </Link>
            )}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Dark mode toggle */}
            <button
              onClick={toggleDark}
              className="p-2 rounded-lg text-bark-500 dark:text-cream-400 hover:bg-cream-200 dark:hover:bg-bark-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </svg>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-bark-500 dark:text-cream-400 hover:bg-cream-200 dark:hover:bg-bark-700 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="md:hidden pb-4 border-t border-cream-200 dark:border-bark-700 pt-3 space-y-1">
            {navTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/${tool.slug}`}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 text-base font-medium text-bark-600 dark:text-cream-300 hover:bg-sage-50 dark:hover:bg-sage-900/20 rounded-lg transition-colors"
              >
                <span>{tool.icon}</span>
                {tool.shortName}
              </Link>
            ))}
            <Link
              href="/#all-tools"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 text-base font-medium text-sage-600 dark:text-sage-400 hover:bg-sage-50 dark:hover:bg-sage-900/20 rounded-lg transition-colors"
            >
              <span>📋</span>
              All Tools
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
