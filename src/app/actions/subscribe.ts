"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import {
  createAttemptLimiter,
  normalizeNewsletterEmail,
} from "@/lib/newsletter-guardrails.mjs";

const allowIpAttempt = createAttemptLimiter({ limit: 20 });
const allowEmailAttempt = createAttemptLimiter({ limit: 5 });
const GENERIC_ERROR = "Newsletter signup is temporarily unavailable. Please try again later.";

export async function subscribeToNewsletter(email: string): Promise<{ success: boolean; error?: string }> {
  const normalizedEmail = normalizeNewsletterEmail(email);
  if (!normalizedEmail) {
    return { success: false, error: "Please enter a valid email address." };
  }

  const requestHeaders = await headers();
  const forwardedFor = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const ipKey = createHash("sha256").update(`ip:${forwardedFor}`).digest("hex");
  const emailKey = createHash("sha256").update(`email:${normalizedEmail}`).digest("hex");
  if (!allowIpAttempt(ipKey) || !allowEmailAttempt(emailKey)) {
    return { success: false, error: "Too many signup attempts. Please wait a few minutes and try again." };
  }

  const apiKey = process.env.BEEHIIV_API_KEY;
  const pubId = process.env.BEEHIIV_PUBLICATION_ID;

  if (!apiKey || !pubId) return { success: false, error: GENERIC_ERROR };

  try {
    const res = await fetch(
      `https://api.beehiiv.com/v2/publications/${pubId}/subscriptions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: normalizedEmail,
          reactivate_existing: false,
          send_welcome_email: true,
        }),
        signal: AbortSignal.timeout(8000),
      }
    );

    if (!res.ok) {
      return { success: false, error: GENERIC_ERROR };
    }

    return { success: true };
  } catch {
    return { success: false, error: GENERIC_ERROR };
  }
}
