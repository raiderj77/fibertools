"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { tools } from "@/lib/tools";

export default function Header() {
  const [darkMode, setDarkMode] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDark = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setToolsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const readyTools = tools.filter((t) => t.ready);
  const tier1 = readyTools.filter((t) => t.tier === 1);
  const tier2 = readyTools.filter((t) => t.tier === 2);
  const tier3 = readyTools.filter((t) => t.tier === 3);

  return (
    <header className="sticky top-0 z-50 bg-cream-50/95 dark:bg-bark-900/95 backdrop-blur-md border-b border-cream-300 dark:border-bark-700 no-print">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group" onClick={() => { setToolsOpen(false); setMobileOpen(false); }}>
            <span className="w-7 h-7 bg-sage-500 rounded-md flex items-center justify-center text-white text-sm font-bold">F</span>
            <span className="font-display text-lg font-bold text-bark-800 dark:text-cream-100 group-hover:text-sage-600 dark:group-hover:text-sage-400 transition-colors">
              FiberTools
            </span>
          </Link>

          {/* Center nav */}
          <nav className="hidden md:flex items-center gap-1">
            {/* Tools dropdown */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setToolsOpen(!toolsOpen)}
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  toolsOpen
                    ? "bg-sage-100 dark:bg-sage-900/30 text-sage-700 dark:text-sage-300"
                    : "bg-cream-200 dark:bg-bark-700 text-bark-700 dark:text-cream-200 hover:bg-cream-300 dark:hover:bg-bark-600"
                }`}
              >
                <span>🧶</span>
                Tools
                <svg className={`w-3.5 h-3.5 transition-transform ${toolsOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>

              {/* Dropdown */}
              {toolsOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[540px] bg-white dark:bg-bark-800 rounded-2xl shadow-xl shadow-bark-900/10 dark:shadow-bark-900/40 border border-cream-300 dark:border-bark-600 p-5 grid grid-cols-2 gap-x-6 gap-y-1">
                  {/* Column 1 */}
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-bark-400 dark:text-bark-500 mb-2 px-2">Essential</p>
                    {tier1.map((tool) => (
                      <Link
                        key={tool.slug}
                        href={`/${tool.slug}`}
                        onClick={() => setToolsOpen(false)}
                        className="flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm text-bark-600 dark:text-cream-300 hover:bg-sage-50 dark:hover:bg-sage-900/20 hover:text-sage-700 dark:hover:text-sage-300 transition-colors"
                      >
                        <span className="text-base">{tool.icon}</span>
                        {tool.shortName}
                      </Link>
                    ))}
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-bark-400 dark:text-bark-500 mb-2 mt-4 px-2">More Calculators</p>
                    {tier2.map((tool) => (
                      <Link
                        key={tool.slug}
                        href={`/${tool.slug}`}
                        onClick={() => setToolsOpen(false)}
                        className="flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm text-bark-600 dark:text-cream-300 hover:bg-sage-50 dark:hover:bg-sage-900/20 hover:text-sage-700 dark:hover:text-sage-300 transition-colors"
                      >
                        <span className="text-base">{tool.icon}</span>
                        {tool.shortName}
                      </Link>
                    ))}
                  </div>

                  {/* Column 2 */}
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-bark-400 dark:text-bark-500 mb-2 px-2">Specialty</p>
                    {tier3.map((tool) => (
                      <Link
                        key={tool.slug}
                        href={`/${tool.slug}`}
                        onClick={() => setToolsOpen(false)}
                        className="flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm text-bark-600 dark:text-cream-300 hover:bg-sage-50 dark:hover:bg-sage-900/20 hover:text-sage-700 dark:hover:text-sage-300 transition-colors"
                      >
                        <span className="text-base">{tool.icon}</span>
                        {tool.shortName}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link href="/#all-tools" className="px-4 py-2 text-sm font-medium text-bark-600 dark:text-cream-300 hover:text-sage-600 dark:hover:text-sage-400 transition-colors">
              Guides
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
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
          <nav className="md:hidden pb-4 border-t border-cream-200 dark:border-bark-700 pt-3 space-y-1 max-h-[70vh] overflow-y-auto">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-bark-400 dark:text-bark-500 px-3 mb-1">Essential</p>
            {tier1.map((tool) => (
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
            <p className="text-[11px] font-semibold uppercase tracking-wider text-bark-400 dark:text-bark-500 px-3 mb-1 mt-3">More Calculators</p>
            {tier2.map((tool) => (
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
            <p className="text-[11px] font-semibold uppercase tracking-wider text-bark-400 dark:text-bark-500 px-3 mb-1 mt-3">Specialty</p>
            {tier3.map((tool) => (
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
          </nav>
        )}
      </div>
    </header>
  );
}
