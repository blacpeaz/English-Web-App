// Emails the learner their recovery code (sent with Brevo).
// POST /api/email { action: "save", code, email }  -> links the email to the code and sends the code
// POST /api/email { action: "forgot", email }      -> sends the code linked to that email (same answer either way)
// Environment variables (set in Netlify):
//   BREVO_API_KEY    required; from app.brevo.com > SMTP & API > API keys
//   EMAIL_FROM       required; a sender email address verified in Brevo (e.g. your Gmail)
//   EMAIL_FROM_NAME  optional, default "Miteny English"
//   APP_URL          optional, default https://miteny-english.netlify.app
// Limits stop the form from being used to send spam: 5 emails per network and 3 per address per day.
import { getStore } from "@netlify/blobs";
import { CODE_RE, keyFor, json } from "../shared/hash.mjs";

const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,190}\.[a-z]{2,}$/i;
const PER_IP = 5;
const PER_EMAIL = 3;

export function message(code, appUrl) {
  const subject = "Your Miteny English recovery code";
  const text =
    `Your recovery code is: ${code}\n\n` +
    `Keep this email. If you change or lose your phone, open ${appUrl}, tap "Restore my progress" and type this code.\n\n` +
    `Kaody famerenana: ${code}. Tehirizo ity mailaka ity. Raha very na miova ny findainao, sokafy ${appUrl}, tsindrio "Restore my progress" ary soraty ity kaody ity.`;
  const html = `<div style="font-family:Arial,sans-serif;font-size:16px;line-height:1.5;color:#132219;max-width:520px">
  <h2 style="margin:0 0 12px">Your recovery code</h2>
  <p style="font-family:Consolas,monospace;font-size:22px;background:#FBEFCF;border:1px dashed #D9A21B;border-radius:8px;padding:12px;text-align:center;margin:0 0 16px">${code}</p>
  <p>Keep this email. If you change or lose your phone, open <a href="${appUrl}">${appUrl}</a>, tap <b>Restore my progress</b> and type this code.</p>
  <p style="color:#56685C;font-style:italic">Tehirizo ity mailaka ity. Raha very na miova ny findainao, sokafy ny app, tsindrio "Restore my progress" ary soraty ity kaody ity.</p></div>`;
  return { subject, text, html };
}

async function send(env, to, code) {
  const key = env.BREVO_API_KEY, from = env.EMAIL_FROM;
  if (!key || !from) return { ok: false, reason: "not-set-up" };
  const m = message(code, env.APP_URL || "https://miteny-english.netlify.app");
  const r = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": key, "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: { name: env.EMAIL_FROM_NAME || "Miteny English", email: from },
      to: [{ email: to }],
      subject: m.subject,
      htmlContent: m.html,
      textContent: m.text,
    }),
  });
  if (!r.ok) {
    console.log("Brevo error", r.status, (await r.text()).slice(0, 300));
    return { ok: false, reason: "send-failed" };
  }
  return { ok: true };
}

// Returns true if this network and this address may still receive an email today (and counts it).
async function allow(store, ip, email, now) {
  const day = now.toISOString().slice(0, 10);
  const kIp = `limit/${day}/${await keyFor("ip:" + ip)}`, kEm = `limit/${day}/${await keyFor("em:" + email)}`;
  const [a, b] = await Promise.all([store.get(kIp, { type: "json" }), store.get(kEm, { type: "json" })]);
  if ((a?.n || 0) >= PER_IP || (b?.n || 0) >= PER_EMAIL) return false;
  await Promise.all([store.setJSON(kIp, { n: (a?.n || 0) + 1 }), store.setJSON(kEm, { n: (b?.n || 0) + 1 })]);
  return true;
}

export async function handle(req, stores, env = process.env, ip = "unknown", now = new Date()) {
  if (req.method !== "POST") return json({ ok: false, reason: "method-not-allowed" }, 405);
  let body;
  try {
    body = await req.json();
  } catch {
    return json({ ok: false, reason: "bad-json" }, 400);
  }
  const email = String(body?.email || "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) return json({ ok: false, reason: "bad-email" }, 400);
  const emailKey = `email/${await keyFor("email:" + email)}`;

  if (body.action === "save") {
    const code = String(body?.code || "").trim().toLowerCase();
    if (!CODE_RE.test(code)) return json({ ok: false, reason: "bad-code" }, 400);
    // Only codes that already have a backup can be linked, so the form cannot be used for anything else.
    const backup = await stores.progress.get(await keyFor(code), { type: "json" });
    if (!backup) return json({ ok: false, reason: "no-backup" }, 404);
    if (!(await allow(stores.email, ip, email, now))) return json({ ok: false, reason: "too-many" }, 429);
    const sent = await send(env, email, code);
    if (!sent.ok) return json({ ok: false, reason: sent.reason }, 502);
    await stores.email.setJSON(emailKey, { code, at: now.toISOString() });
    return json({ ok: true });
  }

  if (body.action === "forgot") {
    const rec = await stores.email.get(emailKey, { type: "json" });
    // Same answer whether or not the address is known, so nobody can test which emails are used.
    if (rec && rec.code && (await allow(stores.email, ip, email, now))) {
      const sent = await send(env, email, rec.code);
      if (!sent.ok && sent.reason === "not-set-up") return json({ ok: false, reason: "not-set-up" }, 502);
    }
    return json({ ok: true });
  }

  return json({ ok: false, reason: "bad-action" }, 400);
}

export default async (req, context) =>
  handle(
    req,
    { email: getStore({ name: "miteny-email", consistency: "strong" }), progress: getStore({ name: "miteny-progress", consistency: "strong" }) },
    process.env,
    context?.ip || req.headers.get("x-nf-client-connection-ip") || "unknown",
  );

export const config = { path: "/api/email" };
