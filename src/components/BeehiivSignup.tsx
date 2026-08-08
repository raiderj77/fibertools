"use client";
import { useState } from "react";
import Link from "next/link";
import { subscribeToNewsletter } from "@/app/actions/subscribe";

type SignupSource = "home_survival_kit" | "newsletter_page";

function recordSignupSuccess(source: SignupSource) {
  const analyticsWindow = window as typeof window & {
    gtag?: (...args: unknown[]) => void;
  };
  analyticsWindow.gtag?.("event", "newsletter_signup_success", {
    signup_source: source,
  });
}

export default function BeehiivSignup({ source = "home_survival_kit" }: { source?: SignupSource }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    const result = await subscribeToNewsletter(email);
    if (result.success) {
      recordSignupSuccess(source);
      setStatus("success");
      setEmail("");
    } else {
      setStatus("error");
      setErrorMsg(result.error ?? "Something went wrong.");
    }
  };

  if (status === "success") {
    return (
      <div className="text-center py-2 space-y-4" role="status">
        <p className="text-bark-700 dark:text-cream-200 font-medium">
          🎉 You&rsquo;re in! Your Survival Kit is ready now.
        </p>
        <a
          href="/survival-kit.pdf"
          download="Yarn-Crafters-Survival-Kit.pdf"
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-plum-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-plum-600"
        >
          Download the free PDF
        </a>
        <p className="text-xs text-bark-500 dark:text-bark-400">
          We&rsquo;ll also send Swatch Signal by email. You can unsubscribe in any issue.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-3 max-w-md w-full mx-auto"
      >
        <label htmlFor={`newsletter-email-${source}`} className="sr-only">
          Email address
        </label>
        <input
          id={`newsletter-email-${source}`}
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          autoComplete="email"
          aria-describedby={`newsletter-terms-${source}`}
          disabled={status === "loading"}
          className="flex-1 px-4 py-3 rounded-lg border border-cream-300 dark:border-bark-600 bg-white dark:bg-bark-900 text-bark-700 dark:text-cream-200 placeholder-bark-400 focus:outline-none focus:ring-2 focus:ring-plum-400 text-sm"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-6 py-3 bg-plum-500 hover:bg-plum-600 disabled:opacity-60 text-white font-semibold rounded-lg transition-colors whitespace-nowrap text-sm"
        >
          {status === "loading" ? "Subscribing…" : "Get the Kit →"}
        </button>
      </form>
      {status === "error" && (
        <p className="text-red-500 text-xs" role="alert">{errorMsg}</p>
      )}
      <p id={`newsletter-terms-${source}`} className="max-w-xl text-center text-xs text-bark-500 dark:text-bark-400">
        Free. One practical note most weeks. No affiliate links in the email. Unsubscribe anytime.{" "}
        <Link href="/privacy" className="underline hover:text-plum-500">Privacy details</Link>
      </p>
    </div>
  );
}
