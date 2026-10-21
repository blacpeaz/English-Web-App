// Online backup for Miteny English.
// GET  /api/progress?code=mango-river-lemur-4821  -> { updatedAt, data }
// PUT  /api/progress  { code, updatedAt, data }   -> { ok, updatedAt }
// The recovery code is never stored as-is: the storage key is a SHA-256 hash of it.
import { getStore } from "@netlify/blobs";

const CODE_RE = /^[a-z]+-[a-z]+-[a-z]+-\d{4}$/;
const MAX_BYTES = 300_000;

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

export async function keyFor(code) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("miteny:" + code));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function handle(req, store) {
  if (req.method === "GET") {
    const code = (new URL(req.url).searchParams.get("code") || "").trim().toLowerCase();
    if (!CODE_RE.test(code)) return json({ error: "bad-code" }, 400);
    const record = await store.get(await keyFor(code), { type: "json" });
    if (!record) return json({ error: "not-found" }, 404);
    return json(record);
  }

  if (req.method === "PUT") {
    let body;
    try {
      body = await req.json();
    } catch {
      return json({ error: "bad-json" }, 400);
    }
    const code = String(body?.code || "").trim().toLowerCase();
    if (!CODE_RE.test(code)) return json({ error: "bad-code" }, 400);
    if (!body.data || typeof body.data !== "object") return json({ error: "no-data" }, 400);
    if (JSON.stringify(body.data).length > MAX_BYTES) return json({ error: "too-large" }, 413);
    const key = await keyFor(code);
    const updatedAt = Number(body.updatedAt) || Date.now();
    const existing = await store.get(key, { type: "json" });
    // Never let an older copy (e.g. an offline phone) overwrite newer progress.
    if (existing && existing.updatedAt > updatedAt) return json({ ok: false, stale: true, updatedAt: existing.updatedAt }, 409);
    await store.setJSON(key, { updatedAt, data: body.data });
    return json({ ok: true, updatedAt });
  }

  return json({ error: "method-not-allowed" }, 405);
}

export default async (req) => handle(req, getStore({ name: "miteny-progress", consistency: "strong" }));

export const config = { path: "/api/progress" };
