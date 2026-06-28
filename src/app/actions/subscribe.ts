"use server";

export async function subscribeToNewsletter(email: string): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.BEEHIIV_API_KEY;
  const pubId = process.env.BEEHIIV_PUBLICATION_ID;

  if (!apiKey) return { success: false, error: "Config error: missing API key." };
  if (!pubId) return { success: false, error: "Config error: missing publication ID." };

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
          email,
          reactivate_existing: false,
          send_welcome_email: true,
        }),
      }
    );

    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { success: false, error: `beehiiv: ${JSON.stringify(body)}` };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: `Network error: ${String(err)}` };
  }
}
