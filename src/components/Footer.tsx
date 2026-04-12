import Link from "next/link";

export default function Footer() {
  const toolLinks = [
    { href: "/yarn-calculator", label: "Yarn Calculator" },
    { href: "/gauge-calculator", label: "Gauge Calculator" },
    { href: "/needle-converter", label: "Needle Converter" },
    { href: "/blanket-calculator", label: "Blanket Calculator" },
    { href: "/hat-calculator", label: "Hat Calculator" },
    { href: "/stitch-counter", label: "Stitch Counter" },
  ];

  const exploreLinks = [
    { href: "/crochet-tools", label: "Crochet Tools" },
    { href: "/knitting-tools", label: "Knitting Tools" },
    { href: "/weaving-tools", label: "Weaving Tools" },
    { href: "/blog", label: "Blog" },
    { href: "/guides", label: "Guides" },
    { href: "/", label: "All Tools" },
  ];

  const infoLinks = [
    { href: "/about", label: "About" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms" },
    { href: "/contact", label: "Contact" },
    { href: "/accessibility", label: "Accessibility" },
  ];

  const sisterSites = [
    { href: "https://mindchecktools.com", label: "MindCheck Tools" },
    { href: "https://flipmycase.com", label: "FlipMyCase" },
    { href: "https://creatorrevenuecalculator.com", label: "Creator Revenue Calculator" },
    { href: "https://contractextract.com", label: "ContractExtract" },
    { href: "https://medicalbillreader.com", label: "Medical Bill Reader" },
    { href: "https://524tracker.com", label: "524 Tracker" },
  ];

  return (
    <footer className="bg-bark-800 text-cream-100 pt-12 pb-6 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-10">
          {/* Column 1 — Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-2">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" stroke="#FAF6F1" strokeWidth="1.5" />
                <path
                  d="M6 8c2-1 6-1 8 1s3 5 2 7"
                  stroke="#FAF6F1"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M8 6c1 2 1 6-1 8"
                  stroke="#FAF6F1"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <span className="font-display text-cream-100 text-lg">FiberTools</span>
            </Link>
            <p className="text-sm text-cream-400 mt-2 max-w-[180px]">
              Free tools for every fiber crafter
            </p>
          </div>

          {/* Column 2 — Tools */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-cream-400 mb-3">
              Tools
            </h3>
            <ul>
              {toolLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-cream-300 hover:text-amber-400 transition-colors block py-1"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Explore */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-cream-400 mb-3">
              Explore
            </h3>
            <ul>
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-cream-300 hover:text-amber-400 transition-colors block py-1"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Info + Sister Sites */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-cream-400 mb-3">
              Info
            </h3>
            <ul>
              {infoLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-cream-300 hover:text-amber-400 transition-colors block py-1"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="text-xs font-semibold uppercase tracking-widest text-cream-400 mb-3 mt-6">
              Sister Sites
            </h3>
            <ul>
              {sisterSites.map((site) => (
                <li key={site.href}>
                  <a
                    href={site.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-cream-300 hover:text-amber-400 transition-colors block py-1"
                  >
                    {site.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="border-t border-bark-700 mt-2 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-cream-500">
            &copy; {new Date().getFullYear()} FiberTools. All rights reserved.
          </p>
          <p className="text-xs text-cream-500">Crafted with 🧶 for fiber artists everywhere</p>
        </div>
      </div>
    </footer>
  );
}
