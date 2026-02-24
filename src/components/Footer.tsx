import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-cream-50 dark:bg-bark-900 border-t border-cream-200 dark:border-bark-800 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Legal links */}
        <div className="mt-8 pt-6 border-t border-cream-300 dark:border-bark-700 flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/privacy" className="text-xs text-bark-400 dark:text-bark-500 hover:text-sage-600 dark:hover:text-sage-400 transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-xs text-bark-400 dark:text-bark-500 hover:text-sage-600 dark:hover:text-sage-400 transition-colors">
            Terms of Use
          </Link>
          <Link href="/cookies" className="text-xs text-bark-400 dark:text-bark-500 hover:text-sage-600 dark:hover:text-sage-400 transition-colors">
            Cookie Policy
          </Link>
          <Link href="/accessibility" className="text-xs text-bark-400 dark:text-bark-500 hover:text-sage-600 dark:hover:text-sage-400 transition-colors">
            Accessibility
          </Link>
          <Link href="/do-not-sell" className="text-xs text-bark-400 dark:text-bark-500 hover:text-sage-600 dark:hover:text-sage-400 transition-colors">
            Do Not Sell My Info
          </Link>
        </div>

        <div className="mt-10 pt-6 border-t border-cream-300 dark:border-bark-700 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-bark-400 dark:text-bark-500">
            © {new Date().getFullYear()} FiberTools. All tools are free to use.
          </p>
          <p className="text-xs text-bark-400 dark:text-bark-500">
            Made with 🧶 for the fiber arts community
          </p>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-xs text-bark-400 dark:text-bark-500">
            More Free Tools: <a href="https://creatorrevenuecalculator.com" className="hover:text-sage-600 transition-colors">
              Creator Revenue Calculator
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
