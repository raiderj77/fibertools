"use client";
import { useState } from "react";

export default function BeehiivSignup() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = `https://fibertools.beehiiv.com/subscribe${email ? `?email=${encodeURIComponent(email)}` : ""}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className="flex-1 px-4 py-3 rounded-lg border border-cream-300 dark:border-bark-600 bg-white dark:bg-bark-900 text-bark-700 dark:text-cream-200 placeholder-bark-400 focus:outline-none focus:ring-2 focus:ring-plum-400 text-sm"
      />
      <button
        type="submit"
        className="px-6 py-3 bg-plum-500 hover:bg-plum-600 text-white font-semibold rounded-lg transition-colors whitespace-nowrap text-sm"
      >
        Get the Kit →
      </button>
    </form>
  );
}
