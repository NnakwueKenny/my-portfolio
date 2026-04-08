export const config = {
  path: "/api/contact",
};

const RESEND_API_URL = "https://api.resend.com/emails";

function getEnv(name) {
  return globalThis.Netlify?.env.get(name) ?? process.env[name];
}

function json(body, init = {}) {
  return new Response(JSON.stringify(body), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...init.headers,
    },
    ...init,
  });
}

function redirect(request, pathname) {
  return Response.redirect(new URL(pathname, request.url), 303);
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function normalizeField(formData, name) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function buildOwnerEmailContent({ name, email, subject, message }) {
  const submittedAt = new Date().toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  });
  const escapedName = escapeHtml(name);
  const escapedEmail = escapeHtml(email);
  const escapedSubject = escapeHtml(subject);
  const escapedMessage = escapeHtml(message).replaceAll("\n", "<br />");
  const replyToLink = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(`Re: ${subject}`)}`;

  return {
    text: [
      "New portfolio inquiry",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      `Subject: ${subject}`,
      `Received: ${submittedAt} UTC`,
      "",
      "Message:",
      message,
    ].join("\n"),
    html: `
      <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
        New portfolio inquiry from ${escapedName}: ${escapedSubject}
      </div>
      <div style="margin:0;padding:32px 16px;background:#f3f6f8;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
        <div style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #d9e2e8;border-radius:24px;overflow:hidden;box-shadow:0 18px 45px rgba(15,23,42,0.08);">
          <div style="padding:28px 32px;background:linear-gradient(135deg,#081c15 0%,#0f3d2e 100%);">
            <div style="display:inline-block;padding:6px 12px;border-radius:999px;background:rgba(21,255,147,0.14);border:1px solid rgba(21,255,147,0.28);color:#9fffd0;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">
              Code Hermit
            </div>
            <h1 style="margin:18px 0 8px;color:#f8fffb;font-size:28px;line-height:1.2;font-weight:800;">
              New portfolio inquiry
            </h1>
            <p style="margin:0;color:#c8f8e3;font-size:15px;line-height:1.7;">
              Someone just reached out through your portfolio contact form.
            </p>
          </div>

          <div style="padding:28px 32px 10px;">
            <div style="margin-bottom:18px;padding:18px 20px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:18px;">
              <div style="margin-bottom:8px;color:#64748b;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">
                Subject
              </div>
              <div style="color:#0f172a;font-size:22px;line-height:1.4;font-weight:700;">
                ${escapedSubject}
              </div>
            </div>

            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:separate;border-spacing:0 12px;">
              <tr>
                <td width="50%" valign="top" style="padding-right:8px;">
                  <div style="height:100%;padding:18px 20px;background:#ffffff;border:1px solid #e2e8f0;border-radius:18px;">
                    <div style="margin-bottom:8px;color:#64748b;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">
                      From
                    </div>
                    <div style="color:#0f172a;font-size:18px;line-height:1.5;font-weight:700;">
                      ${escapedName}
                    </div>
                  </div>
                </td>
                <td width="50%" valign="top" style="padding-left:8px;">
                  <div style="height:100%;padding:18px 20px;background:#ffffff;border:1px solid #e2e8f0;border-radius:18px;">
                    <div style="margin-bottom:8px;color:#64748b;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">
                      Reply to
                    </div>
                    <a href="mailto:${escapedEmail}" style="color:#0f766e;font-size:16px;line-height:1.5;font-weight:700;text-decoration:none;">
                      ${escapedEmail}
                    </a>
                  </div>
                </td>
              </tr>
            </table>

            <div style="margin:12px 0 0;padding:18px 20px;background:#ffffff;border:1px solid #e2e8f0;border-radius:18px;">
              <div style="margin-bottom:8px;color:#64748b;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">
                Received
              </div>
              <div style="color:#334155;font-size:15px;line-height:1.6;">
                ${submittedAt} UTC
              </div>
            </div>

            <div style="margin:20px 0 0;padding:24px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:20px;">
              <div style="margin-bottom:12px;color:#64748b;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">
                Message
              </div>
              <div style="color:#0f172a;font-size:16px;line-height:1.8;">
                ${escapedMessage}
              </div>
            </div>

            <div style="padding:28px 0 10px;text-align:center;">
              <a
                href="${replyToLink}"
                style="display:inline-block;padding:14px 24px;background:#0f766e;border-radius:999px;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;"
              >
                Reply to ${escapedName}
              </a>
            </div>
          </div>

          <div style="padding:18px 32px 28px;color:#64748b;font-size:13px;line-height:1.7;text-align:center;">
            Sent from your portfolio contact form.
          </div>
        </div>
      </div>
    `,
  };
}

function buildConfirmationEmailContent({ name, subject, message }) {
  const escapedName = escapeHtml(name);
  const escapedSubject = escapeHtml(subject);
  const escapedMessage = escapeHtml(message).replaceAll("\n", "<br />");

  return {
    text: [
      `Hi ${name},`,
      "",
      "Thanks for reaching out through my portfolio.",
      "I've received your message and I'll get back to you as soon as I can.",
      "",
      `Subject: ${subject}`,
      "",
      "Your message:",
      message,
      "",
      "Best,",
      "Kenechukwu",
    ].join("\n"),
    html: `
      <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
        Thanks for reaching out. Your message has been received.
      </div>
      <div style="margin:0;padding:32px 16px;background:#f3f6f8;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
        <div style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #d9e2e8;border-radius:24px;overflow:hidden;box-shadow:0 18px 45px rgba(15,23,42,0.08);">
          <div style="padding:28px 32px;background:linear-gradient(135deg,#081c15 0%,#0f3d2e 100%);">
            <div style="display:inline-block;padding:6px 12px;border-radius:999px;background:rgba(21,255,147,0.14);border:1px solid rgba(21,255,147,0.28);color:#9fffd0;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">
              Code Hermit
            </div>
            <h1 style="margin:18px 0 8px;color:#f8fffb;font-size:28px;line-height:1.2;font-weight:800;">
              Thanks for reaching out
            </h1>
            <p style="margin:0;color:#c8f8e3;font-size:15px;line-height:1.7;">
              Your message came through successfully. I'll review it and reply as soon as I can.
            </p>
          </div>

          <div style="padding:28px 32px 12px;">
            <p style="margin:0 0 18px;color:#334155;font-size:16px;line-height:1.8;">
              Hi ${escapedName},
            </p>
            <p style="margin:0 0 18px;color:#334155;font-size:16px;line-height:1.8;">
              Thanks for contacting me through my portfolio. This is a quick confirmation that I received your message and it is now in my inbox.
            </p>

            <div style="padding:20px 22px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:20px;">
              <div style="margin-bottom:8px;color:#64748b;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">
                Your subject
              </div>
              <div style="margin-bottom:18px;color:#0f172a;font-size:20px;line-height:1.5;font-weight:700;">
                ${escapedSubject}
              </div>
              <div style="margin-bottom:8px;color:#64748b;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">
                Your message
              </div>
              <div style="color:#334155;font-size:15px;line-height:1.8;">
                ${escapedMessage}
              </div>
            </div>

            <p style="margin:22px 0 0;color:#334155;font-size:16px;line-height:1.8;">
              Best,<br />
              <span style="color:#0f172a;font-weight:700;">Kenechukwu</span>
            </p>
          </div>

          <div style="padding:18px 32px 28px;color:#64748b;font-size:13px;line-height:1.7;text-align:center;">
            This is an automatic confirmation from the Code Hermit portfolio contact form.
          </div>
        </div>
      </div>
    `,
  };
}

async function sendResendEmail(apiKey, payload) {
  const resendResponse = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!resendResponse.ok) {
    const resendError = await resendResponse.text();
    throw new Error(resendError || "Unknown Resend error");
  }

  return resendResponse;
}

function errorResponse(request, wantsJson, status, message) {
  if (wantsJson) {
    return json({ ok: false, error: message }, { status });
  }

  return redirect(request, "/contact/?error=true");
}

export default async (request) => {
  const wantsJson = request.headers.get("accept")?.includes("application/json");

  if (request.method !== "POST") {
    return errorResponse(request, wantsJson, 405, "Method not allowed");
  }

  const formData = await request.formData();

  if (normalizeField(formData, "bot-field")) {
    if (wantsJson) {
      return json({ ok: true }, { status: 200 });
    }

    return redirect(request, "/contact/success/");
  }

  const name = normalizeField(formData, "name");
  const email = normalizeField(formData, "email");
  const subject = normalizeField(formData, "subject");
  const message = normalizeField(formData, "message");

  if (!name || !email || !subject || !message) {
    return errorResponse(request, wantsJson, 400, "All fields are required");
  }

  if (!isValidEmail(email)) {
    return errorResponse(request, wantsJson, 400, "Please enter a valid email address");
  }

  const apiKey = getEnv("RESEND_API_KEY");
  const toEmail = getEnv("CONTACT_EMAIL_TO");
  const fromEmail = getEnv("CONTACT_EMAIL_FROM");

  if (!apiKey || !toEmail || !fromEmail) {
    console.error("Missing required email environment variables");
    return errorResponse(request, wantsJson, 500, "Email service is not configured");
  }

  const ownerEmailContent = buildOwnerEmailContent({ name, email, subject, message });
  const confirmationEmailContent = buildConfirmationEmailContent({ name, subject, message });

  try {
    await sendResendEmail(apiKey, {
      from: fromEmail,
      to: [toEmail],
      subject: `Portfolio contact: ${subject}`,
      reply_to: email,
      text: ownerEmailContent.text,
      html: ownerEmailContent.html,
    });

    try {
      await sendResendEmail(apiKey, {
        from: fromEmail,
        to: [email],
        subject: "I received your message",
        reply_to: toEmail,
        text: confirmationEmailContent.text,
        html: confirmationEmailContent.html,
      });
    } catch (confirmationError) {
      console.error("Confirmation email failed:", confirmationError);
    }

    if (wantsJson) {
      return json({ ok: true }, { status: 200 });
    }

    return redirect(request, "/contact/success/");
  } catch (error) {
    console.error("Contact function failed:", error);
    return errorResponse(request, wantsJson, 500, "Unable to send email right now");
  }
};
