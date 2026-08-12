import { Buffer } from "node:buffer";
import { createHmac, timingSafeEqual } from "node:crypto";

import { neon } from "@netlify/neon";
import nodemailer from "nodemailer";

const ADMIN_COOKIE_NAME = "codehermit_admin";
const SESSION_TTL_SECONDS = 60 * 60 * 24;
const PRIVATE_RESPONSE_HEADERS = {
  "Cache-Control": "no-store",
  "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
};

let sqlClient;
let schemaPromise;
let transporter;

function getEnv(name, fallback) {
  return process.env[name] ?? fallback;
}

function getSql() {
  if (!sqlClient) {
    sqlClient = neon();
  }

  return sqlClient;
}

export function json(body, { status = 200, headers = {} } = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...PRIVATE_RESPONSE_HEADERS,
      "Content-Type": "application/json; charset=utf-8",
      ...headers,
    },
  });
}

export function redirect(request, pathname) {
  return Response.redirect(new URL(pathname, request.url), 303);
}

export function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function normalizeField(source, name) {
  const value = source.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function parseCookies(cookieHeader = "") {
  return cookieHeader
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce((cookies, part) => {
      const separatorIndex = part.indexOf("=");

      if (separatorIndex === -1) {
        return cookies;
      }

      const name = part.slice(0, separatorIndex).trim();
      const value = part.slice(separatorIndex + 1).trim();
      cookies[name] = decodeURIComponent(value);
      return cookies;
    }, {});
}

function serializeCookie(name, value, options = {}) {
  const {
    maxAge = SESSION_TTL_SECONDS,
    path = "/",
    httpOnly = true,
    sameSite = "Strict",
    secure = true,
  } = options;

  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    `Path=${path}`,
    `Max-Age=${maxAge}`,
    `SameSite=${sameSite}`,
    "Priority=High",
  ];

  if (httpOnly) {
    parts.push("HttpOnly");
  }

  if (secure) {
    parts.push("Secure");
  }

  return parts.join("; ");
}

function isLocalRequest(request) {
  const { hostname, protocol } = new URL(request.url);
  return protocol === "http:" || hostname === "localhost" || hostname === "127.0.0.1";
}

function safeEquals(left, right) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

function getSessionSecret() {
  const secret = getEnv("ADMIN_SESSION_SECRET");

  if (!secret) {
    throw new Error("Missing ADMIN_SESSION_SECRET");
  }

  return secret;
}

function signPayload(payload) {
  return createHmac("sha256", getSessionSecret()).update(payload).digest("base64url");
}

function createSessionToken(username) {
  const payload = Buffer.from(
    JSON.stringify({
      username,
      exp: Date.now() + SESSION_TTL_SECONDS * 1000,
    }),
  ).toString("base64url");

  return `${payload}.${signPayload(payload)}`;
}

function readSessionToken(token) {
  if (!token || !token.includes(".")) {
    return null;
  }

  const [payload, signature] = token.split(".");
  const expectedSignature = signPayload(payload);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));

    if (!data?.username || !data?.exp || data.exp < Date.now()) {
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

export function getAuthenticatedAdmin(request) {
  const cookies = parseCookies(request.headers.get("cookie"));
  const session = readSessionToken(cookies[ADMIN_COOKIE_NAME]);
  return session?.username ?? null;
}

export function requireAuthenticatedAdmin(request) {
  const username = getAuthenticatedAdmin(request);

  if (!username) {
    return {
      ok: false,
      response: json({ ok: false, error: "Unauthorized" }, { status: 401 }),
    };
  }

  return { ok: true, username };
}

export function verifyAdminCredentials(username, password) {
  const expectedUsername = getEnv("ADMIN_USERNAME");
  const expectedPassword = getEnv("ADMIN_PASSWORD");

  if (!expectedUsername || !expectedPassword) {
    throw new Error("Missing ADMIN_USERNAME or ADMIN_PASSWORD");
  }

  return safeEquals(username, expectedUsername) && safeEquals(password, expectedPassword);
}

export function createLoginResponse(request, username) {
  const secure = !isLocalRequest(request);
  const sessionToken = createSessionToken(username);

  return json(
    { ok: true, authenticated: true, username },
    {
      headers: {
        "Set-Cookie": serializeCookie(ADMIN_COOKIE_NAME, sessionToken, { secure }),
      },
    },
  );
}

export function createLogoutResponse(request) {
  const secure = !isLocalRequest(request);

  return json(
    { ok: true, authenticated: false },
    {
      headers: {
        "Set-Cookie": serializeCookie(ADMIN_COOKIE_NAME, "", {
          maxAge: 0,
          secure,
        }),
      },
    },
  );
}

export function isAllowedOrigin(request) {
  const origin = request.headers.get("origin");

  if (!origin) {
    return true;
  }

  return origin === new URL(request.url).origin;
}

function normalizeMessageRow(row) {
  return {
    ...row,
    created_at: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
    updated_at: row.updated_at instanceof Date ? row.updated_at.toISOString() : row.updated_at,
    last_replied_at:
      row.last_replied_at instanceof Date ? row.last_replied_at.toISOString() : row.last_replied_at,
  };
}

function normalizeReplyRow(row) {
  return {
    ...row,
    created_at: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
  };
}

export async function ensureSchema() {
  if (!schemaPromise) {
    schemaPromise = (async () => {
      const sql = getSql();

      await sql`
        CREATE TABLE IF NOT EXISTS contact_messages (
          id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          subject TEXT NOT NULL,
          message_body TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'new',
          source TEXT NOT NULL DEFAULT 'portfolio',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          last_replied_at TIMESTAMPTZ
        )
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS contact_message_replies (
          id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
          message_id INTEGER NOT NULL REFERENCES contact_messages(id) ON DELETE CASCADE,
          subject TEXT NOT NULL,
          body TEXT NOT NULL,
          sent_to TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;

      await sql`
        CREATE INDEX IF NOT EXISTS contact_messages_created_at_idx
        ON contact_messages (created_at DESC)
      `;

      await sql`
        CREATE INDEX IF NOT EXISTS contact_message_replies_message_id_idx
        ON contact_message_replies (message_id, created_at ASC)
      `;
    })();
  }

  return schemaPromise;
}

export async function createContactMessage({ name, email, subject, message }) {
  await ensureSchema();
  const sql = getSql();

  const [row] = await sql`
    INSERT INTO contact_messages (name, email, subject, message_body)
    VALUES (${name}, ${email}, ${subject}, ${message})
    RETURNING
      id,
      name,
      email,
      subject,
      message_body AS message,
      status,
      source,
      created_at,
      updated_at,
      last_replied_at
  `;

  return normalizeMessageRow(row);
}

export async function listContactMessages() {
  await ensureSchema();
  const sql = getSql();

  const messages = await sql`
    SELECT
      id,
      name,
      email,
      subject,
      message_body AS message,
      status,
      source,
      created_at,
      updated_at,
      last_replied_at
    FROM contact_messages
    ORDER BY created_at DESC
    LIMIT 100
  `;

  const replies = await sql`
    SELECT
      id,
      message_id,
      subject,
      body,
      sent_to,
      created_at
    FROM contact_message_replies
    ORDER BY created_at ASC
  `;

  const repliesByMessageId = replies.reduce((map, replyRow) => {
    const reply = normalizeReplyRow(replyRow);
    const existingReplies = map.get(reply.message_id) ?? [];
    existingReplies.push(reply);
    map.set(reply.message_id, existingReplies);
    return map;
  }, new Map());

  return messages.map((row) => {
    const message = normalizeMessageRow(row);
    return {
      ...message,
      replies: repliesByMessageId.get(message.id) ?? [],
    };
  });
}

export async function getContactMessageById(messageId) {
  await ensureSchema();
  const sql = getSql();

  const [row] = await sql`
    SELECT
      id,
      name,
      email,
      subject,
      message_body AS message,
      status,
      source,
      created_at,
      updated_at,
      last_replied_at
    FROM contact_messages
    WHERE id = ${messageId}
    LIMIT 1
  `;

  return row ? normalizeMessageRow(row) : null;
}

export async function storeContactReply({ messageId, subject, body, sentTo }) {
  await ensureSchema();
  const sql = getSql();

  const [replyRow] = await sql`
    INSERT INTO contact_message_replies (message_id, subject, body, sent_to)
    VALUES (${messageId}, ${subject}, ${body}, ${sentTo})
    RETURNING
      id,
      message_id,
      subject,
      body,
      sent_to,
      created_at
  `;

  await sql`
    UPDATE contact_messages
    SET
      status = 'replied',
      updated_at = NOW(),
      last_replied_at = NOW()
    WHERE id = ${messageId}
  `;

  return normalizeReplyRow(replyRow);
}

function getMailConfig() {
  const user = getEnv("SMTP_USER");
  const pass = getEnv("SMTP_PASS");

  if (!user || !pass) {
    throw new Error("Missing SMTP_USER or SMTP_PASS");
  }

  return {
    host: getEnv("SMTP_HOST", "smtp.gmail.com"),
    port: Number(getEnv("SMTP_PORT", "465")),
    secure: getEnv("SMTP_SECURE", "true") !== "false",
    user,
    pass,
  };
}

function getTransporter() {
  if (!transporter) {
    const config = getMailConfig();

    transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.user,
        pass: config.pass,
      },
    });
  }

  return transporter;
}

export function getOwnerInboxEmail() {
  return getEnv("CONTACT_EMAIL_TO") ?? getEnv("SMTP_USER");
}

export function getFromAddress() {
  return getEnv("CONTACT_EMAIL_FROM") ?? getEnv("SMTP_USER");
}

async function sendMail(payload) {
  const mailer = getTransporter();
  return mailer.sendMail({
    from: getFromAddress(),
    ...payload,
  });
}

function buildOwnerNotificationEmail(messageRecord) {
  const submittedAt = new Date(messageRecord.created_at).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  });
  const escapedName = escapeHtml(messageRecord.name);
  const escapedEmail = escapeHtml(messageRecord.email);
  const escapedSubject = escapeHtml(messageRecord.subject);
  const escapedMessage = escapeHtml(messageRecord.message).replaceAll("\n", "<br />");
  const replyToLink = `mailto:${encodeURIComponent(messageRecord.email)}?subject=${encodeURIComponent(`Re: ${messageRecord.subject}`)}`;

  return {
    subject: `Portfolio contact: ${messageRecord.subject}`,
    text: [
      "New portfolio inquiry",
      "",
      `Name: ${messageRecord.name}`,
      `Email: ${messageRecord.email}`,
      `Subject: ${messageRecord.subject}`,
      `Received: ${submittedAt} UTC`,
      "",
      "Message:",
      messageRecord.message,
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

function buildContactConfirmationEmail(messageRecord) {
  const escapedName = escapeHtml(messageRecord.name);
  const escapedSubject = escapeHtml(messageRecord.subject);
  const escapedMessage = escapeHtml(messageRecord.message).replaceAll("\n", "<br />");

  return {
    subject: "I received your message",
    text: [
      `Hi ${messageRecord.name},`,
      "",
      "Thanks for reaching out through my portfolio.",
      "I've received your message and I'll get back to you as soon as I can.",
      "",
      `Subject: ${messageRecord.subject}`,
      "",
      "Your message:",
      messageRecord.message,
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

function buildReplyEmail({ messageRecord, subject, body }) {
  const escapedName = escapeHtml(messageRecord.name);
  const escapedSubject = escapeHtml(subject);
  const escapedBody = escapeHtml(body).replaceAll("\n", "<br />");
  const escapedOriginalSubject = escapeHtml(messageRecord.subject);
  const escapedOriginalMessage = escapeHtml(messageRecord.message).replaceAll("\n", "<br />");

  return {
    subject,
    text: [
      `Hi ${messageRecord.name},`,
      "",
      body,
      "",
      `Original subject: ${messageRecord.subject}`,
      "",
      "Best,",
      "Kenechukwu",
    ].join("\n"),
    html: `
      <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
        A reply from Code Hermit regarding your message: ${escapedOriginalSubject}
      </div>
      <div style="margin:0;padding:32px 16px;background:#f3f6f8;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
        <div style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #d9e2e8;border-radius:24px;overflow:hidden;box-shadow:0 18px 45px rgba(15,23,42,0.08);">
          <div style="padding:28px 32px;background:linear-gradient(135deg,#081c15 0%,#0f3d2e 100%);">
            <div style="display:inline-block;padding:6px 12px;border-radius:999px;background:rgba(21,255,147,0.14);border:1px solid rgba(21,255,147,0.28);color:#9fffd0;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">
              Code Hermit
            </div>
            <h1 style="margin:18px 0 8px;color:#f8fffb;font-size:28px;line-height:1.2;font-weight:800;">
              ${escapedSubject}
            </h1>
            <p style="margin:0;color:#c8f8e3;font-size:15px;line-height:1.7;">
              A response to the message you sent through my portfolio.
            </p>
          </div>

          <div style="padding:28px 32px 18px;">
            <p style="margin:0 0 18px;color:#334155;font-size:16px;line-height:1.8;">
              Hi ${escapedName},
            </p>
            <div style="padding:22px;background:#ffffff;border:1px solid #e2e8f0;border-radius:20px;color:#334155;font-size:16px;line-height:1.9;">
              ${escapedBody}
            </div>

            <div style="margin-top:24px;padding:20px 22px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:20px;">
              <div style="margin-bottom:8px;color:#64748b;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">
                Original message
              </div>
              <div style="margin-bottom:12px;color:#0f172a;font-size:18px;font-weight:700;line-height:1.5;">
                ${escapedOriginalSubject}
              </div>
              <div style="color:#475569;font-size:15px;line-height:1.8;">
                ${escapedOriginalMessage}
              </div>
            </div>

            <p style="margin:22px 0 0;color:#334155;font-size:16px;line-height:1.8;">
              Best,<br />
              <span style="color:#0f172a;font-weight:700;">Kenechukwu</span>
            </p>
          </div>

          <div style="padding:18px 32px 28px;color:#64748b;font-size:13px;line-height:1.7;text-align:center;">
            Sent from the Code Hermit private inbox.
          </div>
        </div>
      </div>
    `,
  };
}

export async function notifyOwnerOfContact(messageRecord) {
  const email = buildOwnerNotificationEmail(messageRecord);

  return sendMail({
    to: getOwnerInboxEmail(),
    subject: email.subject,
    text: email.text,
    html: email.html,
    replyTo: messageRecord.email,
  });
}

export async function sendContactConfirmation(messageRecord) {
  const email = buildContactConfirmationEmail(messageRecord);

  return sendMail({
    to: messageRecord.email,
    subject: email.subject,
    text: email.text,
    html: email.html,
    replyTo: getOwnerInboxEmail(),
  });
}

export async function sendDashboardReplyEmail({ messageRecord, subject, body }) {
  const email = buildReplyEmail({ messageRecord, subject, body });

  return sendMail({
    to: messageRecord.email,
    subject: email.subject,
    text: email.text,
    html: email.html,
    replyTo: getOwnerInboxEmail(),
  });
}
