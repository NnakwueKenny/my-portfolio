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

/* ---------------------------------------------------------------------------
   Email templates
   Table-based and inline-styled for mail-client support, using the same paper,
   ink, hairline, and blue accent as the portfolio itself.
--------------------------------------------------------------------------- */

const MAIL = {
  page: "#f1eee7",
  card: "#fbfaf7",
  surface: "#ffffff",
  ink: "#191817",
  muted: "#67635f",
  line: "#ddd9d1",
  accent: "#1559c5",
  serif: "Georgia, 'Times New Roman', Times, serif",
  sans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
};

const LABEL_STYLE = `font-family:${MAIL.sans};font-size:11px;font-weight:700;letter-spacing:0.11em;text-transform:uppercase;color:${MAIL.muted};`;
const BODY_STYLE = `font-family:${MAIL.sans};font-size:15px;line-height:1.75;color:${MAIL.ink};`;

function renderEmailShell({ preheader, tag, eyebrow, heading, intro, content, footer }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="x-apple-disable-message-reformatting" />
<meta name="color-scheme" content="light" />
<meta name="supported-color-schemes" content="light" />
<title>${escapeHtml(heading)}</title>
</head>
<body style="margin:0;padding:0;width:100%;background:${MAIL.page};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;mso-hide:all;">${preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${MAIL.page};">
  <tr>
    <td align="center" style="padding:32px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:100%;background:${MAIL.card};border:1px solid ${MAIL.line};border-radius:12px;">

        <tr>
          <td style="padding:22px 32px;border-bottom:1px solid ${MAIL.line};">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="font-family:${MAIL.serif};font-size:17px;font-weight:700;letter-spacing:-0.02em;color:${MAIL.ink};">
                  Kene <span style="color:${MAIL.line};">&middot;</span> <span style="color:${MAIL.accent};">CodeHermit</span>
                </td>
                <td align="right" style="${LABEL_STYLE}">${tag}</td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td style="padding:34px 32px 8px;">
            <div style="${LABEL_STYLE}padding-bottom:14px;">${eyebrow}</div>
            <h1 style="margin:0;font-family:${MAIL.serif};font-size:28px;line-height:1.18;letter-spacing:-0.02em;font-weight:700;color:${MAIL.ink};">${escapeHtml(heading)}</h1>
            ${intro ? `<p style="margin:14px 0 0;font-family:${MAIL.sans};font-size:15px;line-height:1.7;color:${MAIL.muted};">${intro}</p>` : ""}
          </td>
        </tr>

        <tr>
          <td style="padding:26px 32px 34px;">${content}</td>
        </tr>

        <tr>
          <td style="padding:18px 32px 22px;border-top:1px solid ${MAIL.line};font-family:${MAIL.sans};font-size:12px;line-height:1.7;color:${MAIL.muted};">${footer}</td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

/** Label/value rows separated by hairlines, in place of stacked rounded cards. */
function renderDetailRows(rows) {
  const cells = rows
    .map((row, index) => {
      const divider = index === 0 ? "" : `border-top:1px solid ${MAIL.line};`;
      const spacing = index === 0 ? "padding:0 0 13px;" : "padding:13px 0;";
      return `
              <tr>
                <td width="118" valign="top" style="${spacing}${divider}${LABEL_STYLE}line-height:1.6;">${row.label}</td>
                <td valign="top" style="${spacing}${divider}font-family:${MAIL.sans};font-size:15px;line-height:1.6;color:${MAIL.ink};">${row.value}</td>
              </tr>`;
    })
    .join("");

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">${cells}</table>`;
}

/** Quoted content, marked by an accent rule rather than another nested card. */
function renderQuote({ label, title, body }) {
  return `
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
              <tr>
                <td width="3" style="background:${MAIL.accent};"></td>
                <td style="padding:16px 20px;background:${MAIL.surface};border:1px solid ${MAIL.line};border-left:0;">
                  ${label ? `<div style="${LABEL_STYLE}padding-bottom:10px;">${label}</div>` : ""}
                  ${title ? `<div style="font-family:${MAIL.serif};font-size:18px;line-height:1.35;font-weight:700;color:${MAIL.ink};padding-bottom:10px;">${title}</div>` : ""}
                  <div style="${BODY_STYLE}">${body}</div>
                </td>
              </tr>
            </table>`;
}

function renderButton({ href, label }) {
  return `
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="background:${MAIL.ink};border-radius:8px;">
                  <a href="${href}" style="display:inline-block;padding:13px 22px;font-family:${MAIL.sans};font-size:14px;font-weight:700;line-height:1;color:#ffffff;text-decoration:none;">${label}</a>
                </td>
              </tr>
            </table>`;
}

function renderSignOff() {
  return `<p style="margin:24px 0 0;${BODY_STYLE}">Best,<br /><span style="font-family:${MAIL.serif};font-size:17px;font-weight:700;color:${MAIL.ink};">Kenechukwu</span></p>`;
}

export function buildOwnerNotificationEmail(messageRecord) {
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

  const content = `
            ${renderDetailRows([
              { label: "From", value: escapedName },
              {
                label: "Email",
                value: `<a href="mailto:${escapedEmail}" style="color:${MAIL.accent};font-weight:600;text-decoration:none;">${escapedEmail}</a>`,
              },
              { label: "Subject", value: escapedSubject },
              { label: "Received", value: `${submittedAt} UTC` },
            ])}

            <div style="padding:26px 0 0;">
              ${renderQuote({ label: "Message", title: "", body: escapedMessage })}
            </div>

            <div style="padding:26px 0 0;">
              ${renderButton({ href: replyToLink, label: `Reply to ${escapedName}` })}
            </div>`;

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
    html: renderEmailShell({
      preheader: `${escapedName} — ${escapedSubject}`,
      tag: "Contact form",
      eyebrow: "New enquiry",
      heading: messageRecord.subject,
      intro: `${escapedName} reached out through your portfolio contact form.`,
      content,
      footer: "Sent automatically from the contact form on your portfolio.",
    }),
  };
}

export function buildContactConfirmationEmail(messageRecord) {
  const escapedName = escapeHtml(messageRecord.name);
  const escapedSubject = escapeHtml(messageRecord.subject);
  const escapedMessage = escapeHtml(messageRecord.message).replaceAll("\n", "<br />");

  const content = `
            <p style="margin:0 0 18px;${BODY_STYLE}">Hi ${escapedName},</p>
            <p style="margin:0 0 24px;${BODY_STYLE}">Thanks for getting in touch. Your message reached my inbox and I will read it properly and reply as soon as I can.</p>
            ${renderQuote({ label: "What you sent", title: escapedSubject, body: escapedMessage })}
            ${renderSignOff()}`;

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
    html: renderEmailShell({
      preheader: "Your message reached my inbox. I will reply shortly.",
      tag: "Confirmation",
      eyebrow: "Message received",
      heading: "Thanks for reaching out",
      intro: "This is a quick confirmation that your message came through.",
      content,
      footer: "You are receiving this because you used the contact form at codehermit.netlify.app.",
    }),
  };
}

export function buildReplyEmail({ messageRecord, subject, body }) {
  const escapedBody = escapeHtml(body).replaceAll("\n", "<br />");
  const escapedOriginalSubject = escapeHtml(messageRecord.subject);
  const escapedOriginalMessage = escapeHtml(messageRecord.message).replaceAll("\n", "<br />");

  /* The reply body is written by hand in the dashboard and carries its own
     greeting, so the template must not add a second one. */
  const content = `
            <div style="${BODY_STYLE}">${escapedBody}</div>
            ${renderSignOff()}

            <div style="padding:30px 0 0;">
              <div style="${LABEL_STYLE}padding-bottom:12px;border-top:1px solid ${MAIL.line};padding-top:22px;">In reply to</div>
              <div style="font-family:${MAIL.serif};font-size:16px;font-weight:700;line-height:1.4;color:${MAIL.ink};padding-bottom:8px;">${escapedOriginalSubject}</div>
              <div style="font-family:${MAIL.sans};font-size:14px;line-height:1.7;color:${MAIL.muted};">${escapedOriginalMessage}</div>
            </div>`;

  return {
    subject,
    text: [
      body,
      "",
      "Best,",
      "Kenechukwu",
      "",
      `In reply to: ${messageRecord.subject}`,
    ].join("\n"),
    html: renderEmailShell({
      preheader: `A reply about: ${escapedOriginalSubject}`,
      tag: "Reply",
      eyebrow: "From Kene",
      heading: subject,
      intro: "",
      content,
      footer: "Replying directly to this email reaches me.",
    }),
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
