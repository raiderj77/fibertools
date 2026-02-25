"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-cream-50 dark:bg-bark-900 border-t border-cream-200 dark:border-bark-800">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold text-bark-800 dark:text-cream-100 mb-4">
              About FiberTools
            </h3>
            <p className="text-sm text-bark-600 dark:text-bark-400 mb-4">
              Free, open-source tools for fiber artists. Calculate yarn needs, 
              convert measurements, and plan projects with precision.
            </p>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-sm text-bark-500 dark:text-bark-400">
                  ✅ No account required
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-bark-500 dark:text-bark-400">
                  ✅ Mobile-first design
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-bark-500 dark:text-bark-400">
                  ✅ All tools are free
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-bark-800 dark:text-cream-100 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/yarn-calculator" className="text-sm text-bark-600 dark:text-bark-400 hover:text-sage-600 dark:hover:text-sage-400 transition-colors">
                  Yarn Calculator
                </Link>
              </li>
              <li>
                <Link href="/gauge-calculator" className="text-sm text-bark-600 dark:text-bark-400 hover:text-sage-600 dark:hover:text-sage-400 transition-colors">
                  Gauge Calculator
                </Link>
              </li>
              <li>
                <Link href="/yarn-weight-chart" className="text-sm text-bark-600 dark:text-bark-400 hover:text-sage-600 dark:hover:text-sage-400 transition-colors">
                  Yarn Weight Chart
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-bark-600 dark:text-bark-400 hover:text-sage-600 dark:hover:text-sage-400 transition-colors">
                  Blog & Guides
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-lg font-semibold text-bark-800 dark:text-cream-100 mb-4">
              Legal
            </h3>
            <div className="space-y-2">
              <Link href="/privacy" className="block text-sm text-bark-600 dark:text-bark-400 hover:text-sage-600 dark:hover:text-sage-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="block text-sm text-bark-600 dark:text-bark-400 hover:text-sage-600 dark:hover:text-sage-400 transition-colors">
                Terms of Use
              </Link>
              <Link href="/cookies" className="block text-sm text-bark-600 dark:text-bark-400 hover:text-sage-600 dark:hover:text-sage-400 transition-colors">
                Cookie Policy
              </Link>
              <Link href="/accessibility" className="block text-sm text-bark-600 dark:text-bark-400 hover:text-sage-600 dark:hover:text-sage-400 transition-colors">
                Accessibility
              </Link>
              <Link href="/do-not-sell" className="block text-sm text-bark-600 dark:text-bark-400 hover:text-sage-600 dark:hover:text-sage-400 transition-colors">
                Do Not Sell My Info
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-cream-300 dark:border-bark-700 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-bark-400 dark:text-bark-500">
            © {new Date().getFullYear()} FiberTools. All tools are free to use.
          </p>
          <p className="text-xs text-bark-400 dark:text-bark-500">
            Made with 🧶 for the fiber arts community
          </p>
        </div>

        {/* Cross-promotion */}
        <div className="mt-4 text-center">
          <p className="text-xs text-bark-400 dark:text-bark-500">
            More Free Tools:{" "}
            <a 
              href="https://creatorrevenuecalculator.com" 
              className="hover:text-sage-600 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Creator Revenue Calculator
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}