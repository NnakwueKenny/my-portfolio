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

function buildEmailContent({ name, email, subject, message }) {
  const escapedMessage = escapeHtml(message).replaceAll("\n", "<br />");

  return {
    text: [
      "New portfolio contact form submission",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      `Subject: ${subject}`,
      "",
      "Message:",
      message,
    ].join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <h2 style="margin-bottom: 16px;">New portfolio contact form submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapedMessage}</p>
      </div>
    `,
  };
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

  const emailContent = buildEmailContent({ name, email, subject, message });

  try {
    const resendResponse = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        subject: `Portfolio contact: ${subject}`,
        reply_to: email,
        text: emailContent.text,
        html: emailContent.html,
      }),
    });

    if (!resendResponse.ok) {
      const resendError = await resendResponse.text();
      console.error("Resend request failed:", resendError);
      return errorResponse(request, wantsJson, 502, "Unable to send email right now");
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
