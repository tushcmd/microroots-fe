// Transactional email for lead forms (wholesale, Harvest Club, contact).
//
// Uses Resend's HTTP API when RESEND_API_KEY is set, so there is no extra
// dependency. When no key is configured, sendEmail() reports the message as
// "captured" and the caller can still return success — the lead is logged
// server-side and can be wired to a real provider by adding one env var.

export interface SendEmailInput {
  to: string
  subject: string
  text: string
  /** Optional reply-to address (e.g. the customer's email). */
  replyTo?: string
}

export interface SendEmailResult {
  sent: boolean
  /** "sent" | "captured" | "error" */
  status: "sent" | "captured" | "error"
  providerMessageId?: string
  error?: string
}

function fromAddress(): string {
  return process.env.LEAD_FROM_EMAIL || "MicroRootsKe <onboarding@resend.dev>"
}

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    // No provider configured — keep the lead server-side so nothing is lost.
    console.info("[lead] email not sent (no RESEND_API_KEY); captured:", {
      to: input.to,
      subject: input.subject,
    })
    return { sent: false, status: "captured" }
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress(),
        to: [input.to],
        subject: input.subject,
        text: input.text,
        reply_to: input.replyTo,
      }),
    })

    const body = (await res.json().catch(() => null)) as
      | { id?: string; message?: string }
      | null

    if (!res.ok) {
      const message = body?.message || `Resend responded ${res.status}`
      console.error("[lead] email send failed:", message)
      return { sent: false, status: "error", error: message }
    }

    return { sent: true, status: "sent", providerMessageId: body?.id }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown email error"
    console.error("[lead] email send threw:", message)
    return { sent: false, status: "error", error: message }
  }
}