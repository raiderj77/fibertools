"use client";

const INTEREST_OPTIONS = [
  {
    key: "complete_audit",
    title: "Complete pattern audit",
    description: "Check every supported section and receive a prioritized list of possible errors.",
  },
  {
    key: "saved_projects",
    title: "Saved private projects",
    description: "Keep patterns and revisions together instead of starting over each visit.",
  },
  {
    key: "downloadable_report",
    title: "Downloadable audit report",
    description: "Share a clear math and notation report with a designer, tester, or customer.",
  },
] as const;

function buildInterestEmail(title: string) {
  const subject = `StitchProof request: ${title}`;
  const body = [
    "Hi FiberTools,",
    "",
    `I used the free StitchProof checker and I am interested in: ${title}.`,
    "",
    "The pattern problem I most need help with is:",
    "",
    "Would I consider paying for this? Yes / Maybe / No",
    "",
    "Please do not paste pattern text unless you created it or have permission to share it.",
  ].join("\n");

  return `mailto:hello@fibertools.app?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export default function StitchProofInterestCard() {
  function trackInterest(interestType: (typeof INTEREST_OPTIONS)[number]["key"]) {
    if (typeof window.gtag === "function") {
      window.gtag("event", "stitchproof_interest_click", {
        interest_type: interestType,
        page_path: "/amigurumi-pattern-checker",
      });
    }
  }

  return (
    <section className="mt-10 rounded-2xl border border-plum-200 bg-plum-50 p-5 dark:border-plum-800 dark:bg-plum-950/30 sm:p-6">
      <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
        Would a complete pattern audit help?
      </h2>
      <p className="mt-2 text-[15px] leading-relaxed text-bark-600 dark:text-bark-400">
        StitchProof will only expand if real makers ask for it. Choose the one capability that would solve the
        most important problem for you. Your email app will open with a short request you can edit before sending.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {INTEREST_OPTIONS.map((option) => (
          <a
            key={option.key}
            href={buildInterestEmail(option.title)}
            onClick={() => trackInterest(option.key)}
            className="rounded-xl border border-plum-200 bg-white p-4 transition hover:border-plum-400 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-plum-500 dark:border-plum-700 dark:bg-bark-800"
          >
            <span className="block font-semibold text-plum-700 dark:text-plum-300">{option.title}</span>
            <span className="mt-1 block text-sm leading-relaxed text-bark-500 dark:text-bark-400">
              {option.description}
            </span>
          </a>
        ))}
      </div>

      <p className="mt-4 text-xs leading-relaxed text-bark-500 dark:text-bark-400">
        FiberTools does not require an account for this feedback. We receive only the email you choose to send.
        A click is directional interest; only a sent request counts toward the product decision.
      </p>
    </section>
  );
}
