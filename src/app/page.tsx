import type { Metadata } from "next";
import Link from "next/link";
import { getToolBySlug, buildUrl, getLiveTools } from "@/lib/config";
import { WebAppSchema, FaqSchema, BreadcrumbSchema } from "@/components/seo/schema";
import { RegexTesterTool } from "@/components/tools/regex-tester";
import { AdSlot } from "@/components/ui/ad-slot";

const tool = getToolBySlug("regex-tester")!;
const pageUrl = buildUrl("/regex-tester");

export const metadata: Metadata = {
  title: tool.title,
  description: tool.description,
  alternates: { canonical: pageUrl },
  keywords: [
    "regex tester", "regex tester online", "regular expression tester",
    "regex101 alternative", "regex match tester", "regex replace online",
    "javascript regex tester", "regex pattern tester", "test regular expression",
    "regex debugger online", "regex capture groups", "regex cheat sheet",
    "regex validator", "regex match highlighter", "regex playground",
    "free regex tester", "regex test tool", "regex builder online",
  ],
  openGraph: {
    title: tool.title,
    description: tool.description,
    url: pageUrl,
    type: "website",
  },
};

const faqItems = [
  {
    question: "How does this regex tester work?",
    answer:
      "Type a regular expression pattern and a test string. The tool uses JavaScript's native RegExp engine to find matches in real time. Matches are color-highlighted in the preview, and detailed match information including capture groups, named groups, and positions is displayed below.",
  },
  {
    question: "Which regex flavor does this tool use?",
    answer:
      "This tool uses the JavaScript (ECMAScript) regex engine built into your browser. It supports all modern features including named capture groups (?<name>...), lookbehind assertions (?<=...) and (?<!...), the dotall flag (s), and the Unicode flag (u). The syntax is identical to what you use in JavaScript, TypeScript, and Node.js.",
  },
  {
    question: "What do the regex flags mean?",
    answer:
      "g (Global) finds all matches, not just the first. i (Case Insensitive) matches uppercase and lowercase equally. m (Multiline) makes ^ and $ match the start and end of each line, not just the whole string. s (Dotall) makes the dot (.) match newline characters. u (Unicode) enables full Unicode matching and makes quantifiers work correctly with emoji and multi-byte characters.",
  },
  {
    question: "How does the replace mode work?",
    answer:
      "Enable Replace Mode and type a replacement string. The tool applies JavaScript's String.replace() with your regex and replacement. You can use $1, $2, etc. for numbered capture groups, $<name> for named groups, $& for the full match, $` for text before the match, and $' for text after. With the global flag, all matches are replaced.",
  },
  {
    question: "What are capture groups?",
    answer:
      "Capture groups are parts of a regex enclosed in parentheses. In the pattern (\\d{3})-(\\d{4}), group 1 captures three digits and group 2 captures four. Named capture groups like (?<area>\\d{3}) let you reference matches by name. The match details panel shows all captured groups for every match.",
  },
  {
    question: "Can I use this regex in my code?",
    answer:
      "Yes. Click Copy Regex to copy the pattern in /pattern/flags format. Since this tool uses JavaScript's regex engine, the pattern works directly in JavaScript, TypeScript, and Node.js. Most patterns also work in Python, Java, Go, and other languages, though some features like lookbehind length limits may differ.",
  },
  {
    question: "What are the preset patterns for?",
    answer:
      "Presets load commonly needed regex patterns with one click — email addresses, URLs, IP addresses, hex colors, dates, phone numbers, HTML tags, and word boundaries. They are a fast starting point. Click a preset, then modify it for your specific use case.",
  },
  {
    question: "How do I match across multiple lines?",
    answer:
      "Enable the m (Multiline) flag to make ^ and $ match line boundaries. Enable the s (Dotall) flag if you need the dot (.) to match newline characters. For example, with both flags, the pattern ^.+$ will match each line individually.",
  },
  {
    question: "Why does my regex cause the page to freeze?",
    answer:
      "Some regex patterns can cause catastrophic backtracking — for example, (a+)+ matched against a long string of a's followed by a non-matching character. If your pattern seems slow, try making quantifiers possessive or atomic, use specific character classes instead of dots, and avoid nested quantifiers.",
  },
  {
    question: "Is my data sent to a server?",
    answer:
      "No. Everything runs entirely in your browser using JavaScript's built-in RegExp. Your patterns and test strings never leave your device. The tool works offline as a PWA — no server, no tracking, no data collection.",
  },
  {
    question: "How does this compare to regex101?",
    answer:
      "Both use real regex engines for accurate results. This tool is faster to load, works offline as a PWA, has a cleaner interface with fewer distractions, and includes one-click presets for common patterns. For most JavaScript regex work, it is everything you need without the overhead.",
  },
  {
    question: "Can I click reference items to insert them?",
    answer:
      "Yes. Open the Quick Reference panel and click any pattern token to append it to your regex pattern. This is useful when you forget the exact syntax for lookahead assertions, character classes, or quantifiers.",
  },
];

export default function RegexTesterPage() {
  const tools = getLiveTools();

  return (
    <>
      <WebAppSchema
        name="Free Regex Tester — Test Regular Expressions Online"
        description={tool.description}
        url={pageUrl}
      />
      <FaqSchema items={faqItems} />
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Regex Tester", href: "/regex-tester" },
        ]}
      />

      <div className="mx-auto max-w-6xl px-4 py-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Free Regex Tester — Match, Replace &amp; Debug Regular Expressions Online
        </h1>
        <p className="mt-2 text-sm text-neutral-400">
          Test regular expressions with real-time match highlighting, capture group
          display, replace mode, and flag toggles. Built-in presets for emails, URLs,
          IPs, and more. Quick reference sidebar for instant syntax lookup. Uses
          JavaScript&apos;s native RegExp engine — what you see here is exactly what
          runs in your code. Free, no signup, works offline.
        </p>

        <div className="mt-4">
          <RegexTesterTool />
        </div>

        <AdSlot slot="after-tool" page="regex-tester" />

        {/* Feature grid */}
        <section className="mt-10">
          <h2 className="text-lg sm:text-xl font-semibold">
            Everything You Need to Build &amp; Test Regex Patterns
          </h2>
          <p className="mt-2 text-sm text-neutral-400">
            A complete regex development environment in your browser — no installs, no
            accounts, no distractions.
          </p>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { emoji: "🎯", title: "Real-Time Matching", desc: "Matches highlight instantly as you type your pattern or test string. Color-coded highlighting makes overlapping matches easy to distinguish." },
              { emoji: "🔤", title: "Flag Toggles", desc: "Toggle Global, Case Insensitive, Multiline, Dotall, and Unicode flags with one click. See how each flag changes your matches immediately." },
              { emoji: "📦", title: "Capture Groups", desc: "View all capture groups — numbered and named — for every match. See group indices, values, and positions in the detail panel." },
              { emoji: "🔄", title: "Replace Mode", desc: "Test regex replacements with $1, $2, $<name> backreferences. See the full replaced output in real time." },
              { emoji: "📋", title: "One-Click Presets", desc: "Load common patterns instantly: email, URL, IPv4, hex color, date, phone number, HTML tags, and word boundaries." },
              { emoji: "📖", title: "Quick Reference", desc: "Clickable cheat sheet for character classes, anchors, quantifiers, and groups. Click any token to insert it into your pattern." },
            ].map((f) => (
              <div key={f.title} className="rounded-xl border border-white/10 bg-neutral-900 p-4">
                <div className="text-lg mb-1">{f.emoji}</div>
                <h3 className="text-sm font-semibold">{f.title}</h3>
                <p className="mt-1 text-xs text-neutral-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-lg sm:text-xl font-semibold">
            How to Use the Regex Tester
          </h2>
          <div className="mt-3 text-sm text-neutral-400 space-y-2">
            <p>
              <strong className="text-neutral-200">1. Enter your pattern.</strong> Type a regex
              in the pattern field. The delimiters / / are shown automatically — just type the
              pattern itself. Use a preset to start quickly.
            </p>
            <p>
              <strong className="text-neutral-200">2. Set your flags.</strong> Click the flag
              buttons to enable Global (g), Case Insensitive (i), Multiline (m), Dotall (s),
              or Unicode (u). Most patterns use at least the Global flag.
            </p>
            <p>
              <strong className="text-neutral-200">3. Add test text.</strong> Paste or type
              your test string. Matches highlight in the preview area above the input. Match
              count and positions appear in the detail panel.
            </p>
            <p>
              <strong className="text-neutral-200">4. Inspect matches.</strong> The Match Details
              section shows every match with its index, length, captured groups, and named groups.
              Color coding matches the highlighted text.
            </p>
            <p>
              <strong className="text-neutral-200">5. Test replacements.</strong> Toggle Replace
              Mode, enter a replacement string, and see the output. Use $1, $2 for groups and $&amp;
              for the full match.
            </p>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-lg sm:text-xl font-semibold">
            Common Regex Use Cases
          </h2>
          <div className="mt-3 text-sm text-neutral-400 space-y-2">
            <p>
              <strong className="text-neutral-200">Form validation:</strong> Test email, phone,
              URL, and date patterns before adding them to your form validation code. See edge
              cases that break your pattern.
            </p>
            <p>
              <strong className="text-neutral-200">Log parsing:</strong> Extract timestamps,
              error codes, IP addresses, and user agents from log lines. Use capture groups to
              isolate the fields you need.
            </p>
            <p>
              <strong className="text-neutral-200">Find and replace:</strong> Test complex
              search-and-replace operations before running them on production data. Verify
              backreferences work correctly.
            </p>
            <p>
              <strong className="text-neutral-200">Data extraction:</strong> Build patterns to
              pull structured data from HTML, CSV, or unstructured text. Test against sample
              data to ensure complete coverage.
            </p>
            <p>
              <strong className="text-neutral-200">Learning regex:</strong> Use the quick reference
              and presets to explore how different regex constructs work. Modify presets to
              understand each part of the pattern.
            </p>
          </div>
        </section>

        <AdSlot slot="mid-content" page="regex-tester" />

        <section className="mt-10">
          <h2 className="text-lg sm:text-xl font-semibold">
            Frequently Asked Questions
          </h2>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            {faqItems.map((faq) => (
              <div key={faq.question} className="rounded-xl border border-white/10 bg-neutral-900 p-4">
                <h3 className="text-sm font-semibold">{faq.question}</h3>
                <p className="mt-2 text-sm text-neutral-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <AdSlot slot="before-footer" page="regex-tester" />

        <section className="mt-10">
          <h2 className="text-lg sm:text-xl font-semibold">More Free Developer Tools</h2>
          <p className="mt-2 text-sm text-neutral-400">
            Test regex here, then encode strings, format JSON, compare text, generate
            passwords, and more with our other free tools.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {tools.map((t) => (
              <Link key={t.slug} href={t.slug === "" ? "/" : `/${t.slug}`} className="rounded-xl border border-white/10 px-3 py-2 text-sm hover:bg-white/5 transition-colors">
                {t.emoji} {t.name}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
