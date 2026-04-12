"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navLinks = [
    { href: "/crochet-tools", label: "Crochet Tools" },
    { href: "/knitting-tools", label: "Knitting Tools" },
    { href: "/weaving-tools", label: "Weaving Tools" },
    { href: "/blog", label: "Blog" },
    { href: "/guides", label: "Guides" },
  ];

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-cream-300 no-print"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2"
            onClick={() => setMobileOpen(false)}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" stroke="#7C5A6D" strokeWidth="1.5" />
              <path
                d="M6 8c2-1 6-1 8 1s3 5 2 7"
                stroke="#7C5A6D"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M8 6c1 2 1 6-1 8"
                stroke="#7C5A6D"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <span className="font-display text-xl text-bark-800 font-normal">
              FiberTools
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-bark-600 hover:text-plum-500 transition-colors px-3 py-2"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center">
            <Link
              href="/#all-tools"
              className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-1.5 rounded-full transition-colors"
            >
              All Tools
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-bark-700 hover:bg-cream-200 transition-colors"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <nav
            className="md:hidden bg-white shadow-lg border-t border-cream-200"
            aria-label="Mobile navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block py-3 px-6 text-sm font-medium text-bark-600 hover:text-plum-500 border-b border-cream-200 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="px-6 py-4">
              <Link
                href="/#all-tools"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2.5 rounded-full transition-colors"
              >
                All Tools
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
