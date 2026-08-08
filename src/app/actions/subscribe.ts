"use server";

export async function subscribeToNewsletter(email: string): Promise<{ success: boolean; error?: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(normalizedEmail) || normalizedEmail.length > 254) {
    return { success: false, error: "Enter a valid email address." };
  }

  const apiKey = process.env.BEEHIIV_API_KEY;
  const pubId = process.env.BEEHIIV_PUBLICATION_ID;

  if (!apiKey || !pubId) {
    console.error("Newsletter subscription is not configured.");
    return { success: false, error: "Newsletter signup is temporarily unavailable. Please try again later." };
  }

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
      }
    );

    if (!res.ok) {
      console.error("Newsletter provider rejected a subscription request.", { status: res.status });
      return { success: false, error: "We could not complete the signup. Please check the address and try again." };
    }

    return { success: true };
  } catch {
    console.error("Newsletter provider request failed.");
    return { success: false, error: "Newsletter signup is temporarily unavailable. Please try again later." };
  }
}
