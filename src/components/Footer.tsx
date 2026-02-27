import Link from "next/link";
import { tools } from "@/lib/tools";

export default function Footer() {
  const popularTools = tools.filter((t) => t.tier === 1 && t.ready).slice(0, 5);
  const moreTools = tools.filter((t) => t.tier === 2 && t.ready).slice(0, 5);

  return (
    <footer className="bg-cream-100 dark:bg-bark-900 border-t border-cream-300 dark:border-bark-700 no-print">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 group mb-3">
              <span className="w-7 h-7 bg-sage-500 rounded-md flex items-center justify-center text-white text-sm font-bold">F</span>
              <span className="font-display text-lg font-bold text-bark-800 dark:text-cream-100">FiberTools</span>
            </Link>
            <p className="text-sm text-bark-500 dark:text-bark-400 leading-relaxed">
              Free calculators and references for knitting, crochet, weaving, spinning, and embroidery. No login required.
            </p>
            <ul className="mt-4 space-y-1.5">
              <li className="flex items-center gap-2 text-sm text-bark-500 dark:text-bark-400"><span>📴</span> Works offline</li>
              <li className="flex items-center gap-2 text-sm text-bark-500 dark:text-bark-400"><span>🔒</span> 100% private</li>
              <li className="flex items-center gap-2 text-sm text-bark-500 dark:text-bark-400"><span>🆓</span> No account required</li>
              <li className="flex items-center gap-2 text-sm text-bark-500 dark:text-bark-400"><span>📱</span> Mobile-first design</li>
            </ul>
          </div>
          {/* Popular Tools */}
          <div>
            <h3 className="text-sm font-semibold text-bark-700 dark:text-cream-200 mb-3">Popular Tools</h3>
            <ul className="space-y-2">
              {popularTools.map((tool) => (
                <li key={tool.slug}>
                  <Link href={`/${tool.slug}`} className="text-sm text-bark-500 dark:text-bark-400 hover:text-sage-600 dark:hover:text-sage-400 transition-colors">
                    {tool.icon} {tool.shortName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* More Tools */}
          <div>
            <h3 className="text-sm font-semibold text-bark-700 dark:text-cream-200 mb-3">More Tools</h3>
            <ul className="space-y-2">
              {moreTools.map((tool) => (
                <li key={tool.slug}>
                  <Link href={`/${tool.slug}`} className="text-sm text-bark-500 dark:text-bark-400 hover:text-sage-600 dark:hover:text-sage-400 transition-colors">
                    {tool.icon} {tool.shortName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-bark-700 dark:text-cream-200 mb-3">Resources</h3>
            <ul className="space-y-2">
              <li><Link href="/blog" className="text-sm text-bark-500 dark:text-bark-400 hover:text-sage-600 dark:hover:text-sage-400 transition-colors">Guides & Tutorials</Link></li>
              <li><a href="https://mycrochetkit.com" target="_blank" rel="noopener noreferrer" className="text-sm text-bark-500 dark:text-bark-400 hover:text-sage-600 dark:hover:text-sage-400 transition-colors">MyCrochetKit App</a></li>
            </ul>
          </div>
        </div>
        {/* Legal links */}
        <div className="mt-8 pt-6 border-t border-cream-300 dark:border-bark-700 flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/privacy" className="text-xs text-bark-400 dark:text-bark-500 hover:text-sage-600 dark:hover:text-sage-400 transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="text-xs text-bark-400 dark:text-bark-500 hover:text-sage-600 dark:hover:text-sage-400 transition-colors">Terms of Use</Link>
          <Link href="/cookies" className="text-xs text-bark-400 dark:text-bark-500 hover:text-sage-600 dark:hover:text-sage-400 transition-colors">Cookie Policy</Link>
          <Link href="/accessibility" className="text-xs text-bark-400 dark:text-bark-500 hover:text-sage-600 dark:hover:text-sage-400 transition-colors">Accessibility</Link>
          <Link href="/do-not-sell" className="text-xs text-bark-400 dark:text-bark-500 hover:text-sage-600 dark:hover:text-sage-400 transition-colors">Do Not Sell My Info</Link>
        </div>
        {/* Copyright */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-bark-400 dark:text-bark-500">© {new Date().getFullYear()} FiberTools. All tools are free to use.</p>
          <p className="text-xs text-bark-400 dark:text-bark-500">Made with 🧶 for the fiber arts community</p>
        </div>
        {/* Sister sites */}
        <div className="mt-4 text-center">
          <p className="text-xs text-bark-400 dark:text-bark-500">
            More Free Tools:{" "}
            <a href="https://creatorrevenuecalculator.com" className="hover:text-sage-600 dark:hover:text-sage-400 transition-colors">Creator Revenue Calculator</a>
            {" · "}
            <a href="https://mindchecktools.com" className="hover:text-sage-600 dark:hover:text-sage-400 transition-colors">MindCheck Tools</a>
            {" · "}
            <a href="https://flipmycase.com" className="hover:text-sage-600 dark:hover:text-sage-400 transition-colors">FlipMyCase</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
