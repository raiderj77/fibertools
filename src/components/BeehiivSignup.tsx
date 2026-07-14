"use client";
import { useState } from "react";
import { subscribeToNewsletter } from "@/app/actions/subscribe";

export default function BeehiivSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    const result = await subscribeToNewsletter(email);
    if (result.success) {
      setStatus("success");
      setEmail("");
    } else {
      setStatus("error");
      setErrorMsg(result.error ?? "Something went wrong.");
    }
  };

  if (status === "success") {
    return (
      <div className="text-center py-2" role="status">
        <p className="text-bark-700 dark:text-cream-200 font-medium">
          🎉 You&rsquo;re in! Check your email for the Survival Kit.
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
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
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
    </div>
  );
}
