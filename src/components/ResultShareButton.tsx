"use client";

import { useState } from "react";
import { buildToolShareUrl } from "@/lib/tool-share.mjs";

interface ResultShareButtonProps {
  toolName: string;
  toolSlug: string;
}

export default function ResultShareButton({ toolName, toolSlug }: ResultShareButtonProps) {
  const [feedback, setFeedback] = useState("Share calculator");

  const copyShareUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setFeedback("Link copied");
      setTimeout(() => setFeedback("Share calculator"), 2000);
    } catch {
      setFeedback("Sharing unavailable");
    }
  };

  const handleShare = async () => {
    const url = buildToolShareUrl(window.location.href, toolSlug);

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${toolName} | FiberTools`,
          text: `Use this free ${toolName} on FiberTools.`,
          url,
        });
        setFeedback("Shared");
        setTimeout(() => setFeedback("Share calculator"), 2000);
        return;
      } catch (error) {
        if (
          error &&
          typeof error === "object" &&
          "name" in error &&
          error.name === "AbortError"
        ) {
          return;
        }
      }
    }

    await copyShareUrl(url);
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="btn-secondary text-sm"
      aria-live="polite"
      aria-label={feedback === "Share calculator" ? `Share ${toolName}` : feedback}
    >
      {feedback}
    </button>
  );
}
