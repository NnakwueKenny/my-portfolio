import {
  createLoginResponse,
  createLogoutResponse,
  ensureSchema,
  getAuthenticatedAdmin,
  getContactMessageById,
  isAllowedOrigin,
  json,
  listContactMessages,
  requireAuthenticatedAdmin,
  sendDashboardReplyEmail,
  storeContactReply,
  verifyAdminCredentials,
} from "./lib/site-admin.mjs";

export const config = {
  path: [
    "/api/admin/login",
    "/api/admin/logout",
    "/api/admin/session",
    "/api/admin/messages",
    "/api/admin/reply",
  ],
};

function getPathname(request) {
  return new URL(request.url).pathname;
}

async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export default async (request) => {
  const pathname = getPathname(request);

  try {
    if (pathname === "/api/admin/session" && request.method === "GET") {
      const username = getAuthenticatedAdmin(request);
      return json({
        ok: true,
        authenticated: Boolean(username),
        username,
      });
    }

    if (pathname === "/api/admin/login" && request.method === "POST") {
      if (!isAllowedOrigin(request)) {
        return json({ ok: false, error: "Invalid origin" }, { status: 403 });
      }

      const payload = await readJson(request);
      const username = typeof payload?.username === "string" ? payload.username.trim() : "";
      const password = typeof payload?.password === "string" ? payload.password : "";

      if (!username || !password) {
        return json({ ok: false, error: "Username and password are required" }, { status: 400 });
      }

      let authenticated = false;

      try {
        authenticated = verifyAdminCredentials(username, password);
      } catch (error) {
        console.error("Admin login configuration error:", error);
        return json({ ok: false, error: "Admin login is not configured" }, { status: 500 });
      }

      if (!authenticated) {
        return json({ ok: false, error: "Invalid username or password" }, { status: 401 });
      }

      return createLoginResponse(request, username);
    }

    if (pathname === "/api/admin/logout" && request.method === "POST") {
      return createLogoutResponse(request);
    }

    const auth = requireAuthenticatedAdmin(request);

    if (!auth.ok) {
      return auth.response;
    }

    if (pathname === "/api/admin/messages" && request.method === "GET") {
      await ensureSchema();
      const messages = await listContactMessages();
      return json({ ok: true, messages });
    }

    if (pathname === "/api/admin/reply" && request.method === "POST") {
      if (!isAllowedOrigin(request)) {
        return json({ ok: false, error: "Invalid origin" }, { status: 403 });
      }

      const payload = await readJson(request);
      const messageId = Number(payload?.messageId);
      const body = typeof payload?.body === "string" ? payload.body.trim() : "";
      const subjectInput = typeof payload?.subject === "string" ? payload.subject.trim() : "";

      if (!Number.isInteger(messageId) || messageId <= 0 || !body) {
        return json({ ok: false, error: "A message and reply body are required" }, { status: 400 });
      }

      const messageRecord = await getContactMessageById(messageId);

      if (!messageRecord) {
        return json({ ok: false, error: "Message not found" }, { status: 404 });
      }

      const subject = subjectInput || `Re: ${messageRecord.subject}`;

      await sendDashboardReplyEmail({
        messageRecord,
        subject,
        body,
      });

      const reply = await storeContactReply({
        messageId,
        subject,
        body,
        sentTo: messageRecord.email,
      });

      return json({ ok: true, reply });
    }

    return json({ ok: false, error: "Not found" }, { status: 404 });
  } catch (error) {
    console.error("Admin API failed:", error);
    return json({ ok: false, error: "Unexpected server error" }, { status: 500 });
  }
};
