"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { trackDesignerPreflightEvent } from "@/lib/designer-preflight-analytics";

const REQUEST_KEY = "fibertools_preflight_request_id";

type FormErrors = Record<string, string>;

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? <p id={id} className="mt-1 text-sm text-red-700 dark:text-red-300">{message}</p> : null;
}
function requestId(): string {
  const existing = sessionStorage.getItem(REQUEST_KEY);
  if (existing) return existing;
  const created = crypto.randomUUID();
  sessionStorage.setItem(REQUEST_KEY, created);
  return created;
}

export default function DesignerPreflightForm() {
  const [errors, setErrors] = useState<FormErrors>({});
  const [generalError, setGeneralError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    trackDesignerPreflightEvent("designer_preflight_page_viewed");
  }, []);

  function markStarted() {
    if (started.current) return;
    started.current = true;
    trackDesignerPreflightEvent("designer_preflight_submission_started");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});
    setGeneralError("");
    setSubmitting(true);

    const form = new FormData(event.currentTarget);
    const payload = {
      requestId: requestId(),
      name: form.get("name"),
      email: form.get("email"),
      patternTitle: form.get("patternTitle"),
      terminology: form.get("terminology"),
      skillLevel: form.get("skillLevel"),
      patternType: form.get("patternType"),
      comments: form.get("comments"),
      secureShareUrl: form.get("secureShareUrl"),
      scopeAgreed: form.get("scopeAgreed") === "on",
      website: form.get("website"),
    };

    try {
      const response = await fetch("/api/designer-preflight/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { checkoutUrl?: string; error?: string; errors?: FormErrors };
      if (!response.ok || !result.checkoutUrl) {
        setErrors(result.errors || {});
        setGeneralError(result.error || "The submission could not be started. Your card was not charged.");
        setSubmitting(false);
        document.getElementById("preflight-error-summary")?.focus();
        return;
      }

      trackDesignerPreflightEvent("designer_preflight_submission_completed");
      trackDesignerPreflightEvent("designer_preflight_checkout_started");
      window.location.assign(result.checkoutUrl);
    } catch {
      setGeneralError("Checkout could not be reached. Your card was not charged. Please try again.");
      setSubmitting(false);
      document.getElementById("preflight-error-summary")?.focus();
    }
  }

  const describedBy = (field: string, helper?: string) =>
    [helper, errors[field] ? `${field}-error` : ""].filter(Boolean).join(" ") || undefined;

  return (
    <form onSubmit={handleSubmit} onFocus={markStarted} noValidate className="mt-6 space-y-5">
      {generalError ? (
        <div
          id="preflight-error-summary"
          role="alert"
          tabIndex={-1}
          className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800 outline-none focus:ring-2 focus:ring-red-500 dark:border-red-800 dark:bg-red-950/30 dark:text-red-200"
        >
          <p className="font-semibold">Please review the submission.</p>
          <p className="mt-1">{generalError}</p>
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="label">Name</label>
          <input id="name" name="name" autoComplete="name" required maxLength={100} className="input" aria-invalid={Boolean(errors.name)} aria-describedby={describedBy("name")} />
          <FieldError id="name-error" message={errors.name} />
        </div>
        <div>
          <label htmlFor="email" className="label">Email for the report</label>
          <input id="email" name="email" type="email" autoComplete="email" required maxLength={254} className="input" aria-invalid={Boolean(errors.email)} aria-describedby={describedBy("email")} />
          <FieldError id="email-error" message={errors.email} />
        </div>
      </div>

      <div>
        <label htmlFor="patternTitle" className="label">Pattern title</label>
        <input id="patternTitle" name="patternTitle" required maxLength={160} className="input" aria-invalid={Boolean(errors.patternTitle)} aria-describedby={describedBy("patternTitle")} />
        <FieldError id="patternTitle-error" message={errors.patternTitle} />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label htmlFor="terminology" className="label">Crochet terminology</label>
          <select id="terminology" name="terminology" defaultValue="" required className="select" aria-invalid={Boolean(errors.terminology)} aria-describedby={describedBy("terminology")}>
            <option value="" disabled>Choose one</option>
            <option value="us">US</option><option value="uk">UK</option><option value="mixed">Mixed</option><option value="unsure">Unsure</option>
          </select>
          <FieldError id="terminology-error" message={errors.terminology} />
        </div>
        <div>
          <label htmlFor="skillLevel" className="label">Intended skill level</label>
          <select id="skillLevel" name="skillLevel" defaultValue="" required className="select" aria-invalid={Boolean(errors.skillLevel)} aria-describedby={describedBy("skillLevel")}>
            <option value="" disabled>Choose one</option>
            <option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option><option value="all-levels">All levels</option>
          </select>
          <FieldError id="skillLevel-error" message={errors.skillLevel} />
        </div>
        <div>
          <label htmlFor="patternType" className="label">Pattern type</label>
          <select id="patternType" name="patternType" defaultValue="" required className="select" aria-invalid={Boolean(errors.patternType)} aria-describedby={describedBy("patternType")}>
            <option value="" disabled>Choose one</option>
            <option value="amigurumi">Amigurumi</option><option value="accessory">Accessory</option><option value="garment">Garment</option><option value="home-decor">Home decor</option><option value="blanket">Blanket</option><option value="other">Other</option>
          </select>
          <FieldError id="patternType-error" message={errors.patternType} />
        </div>
      </div>

      <div>
        <label htmlFor="secureShareUrl" className="label">Private pattern share link</label>
        <p id="share-link-help" className="mb-2 text-sm leading-relaxed text-bark-500 dark:text-bark-400">
          Use an HTTPS Google Drive, Dropbox, or OneDrive link. Give <strong>jason@fibertools.app</strong> permission to view it. Do not make the pattern public.
        </p>
        <input id="secureShareUrl" name="secureShareUrl" type="url" inputMode="url" placeholder="https://drive.google.com/..." required className="input" aria-invalid={Boolean(errors.secureShareUrl)} aria-describedby={describedBy("secureShareUrl", "share-link-help")} />
        <FieldError id="secureShareUrl-error" message={errors.secureShareUrl} />
      </div>

      <div>
        <label htmlFor="comments" className="label">Optional comments</label>
        <textarea id="comments" name="comments" rows={4} maxLength={1000} className="input min-h-28 resize-y" aria-invalid={Boolean(errors.comments)} aria-describedby={describedBy("comments", "comments-help")} />
        <p id="comments-help" className="mt-1 text-xs text-bark-500 dark:text-bark-400">Mention the section you are most worried about. Do not paste the pattern here.</p>
        <FieldError id="comments-error" message={errors.comments} />
      </div>

      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="rounded-xl border border-cream-300 bg-cream-100 p-4 dark:border-bark-700 dark:bg-bark-800">
        <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-bark-700 dark:text-cream-300">
          <input name="scopeAgreed" type="checkbox" required className="mt-1 h-5 w-5 shrink-0 accent-sage-600" aria-invalid={Boolean(errors.scopeAgreed)} aria-describedby={describedBy("scopeAgreed", "scope-summary")} />
          <span id="scope-summary">
            I agree to the $9 pilot scope, the <Link href="/privacy" className="text-sage-600 underline">Privacy Policy</Link>, and the <Link href="/terms#designer-pattern-preflight" className="text-sage-600 underline">pilot terms</Link>. I understand this is a manual preflight, not professional tech editing or a guarantee that the pattern is error-free.
          </span>
        </label>
        <FieldError id="scopeAgreed-error" message={errors.scopeAgreed} />
      </div>

      <button type="submit" disabled={submitting} className="btn-primary w-full sm:w-auto" aria-describedby="payment-note">
        {submitting ? "Opening secure checkout…" : "Continue to Stripe — $9"}
      </button>
      <p id="payment-note" className="text-xs leading-relaxed text-bark-500 dark:text-bark-400">
        Payment is handled by Stripe. Your pattern link is not sent to Stripe. If checkout fails, your card is not charged.
      </p>
    </form>
  );
}
