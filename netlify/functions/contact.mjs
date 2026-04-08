import {
  createContactMessage,
  isValidEmail,
  json,
  normalizeField,
  notifyOwnerOfContact,
  redirect,
  sendContactConfirmation,
} from "./lib/site-admin.mjs";

export const config = {
  path: "/api/contact",
};

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

  try {
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

    const messageRecord = await createContactMessage({
      name,
      email,
      subject,
      message,
    });

    try {
      await notifyOwnerOfContact(messageRecord);
    } catch (error) {
      console.error("Owner notification failed:", error);
    }

    try {
      await sendContactConfirmation(messageRecord);
    } catch (error) {
      console.error("Contact confirmation failed:", error);
    }

    if (wantsJson) {
      return json({ ok: true }, { status: 200 });
    }

    return redirect(request, "/contact/success/");
  } catch (error) {
    console.error("Contact function failed:", error);
    return errorResponse(request, wantsJson, 500, "Unable to send message right now");
  }
};
