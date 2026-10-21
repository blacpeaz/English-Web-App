// Online backup for Miteny English.
// GET    /api/progress?code=fara-english-2026   -> { updatedAt, data }
// PUT    /api/progress  { code, updatedAt, data } -> { ok, updatedAt }
// DELETE /api/progress?code=...                 -> { ok }  (used when the learner changes their code)
// The recovery code is never stored as-is: the storage key is a SHA-256 hash of it.
// To stop people guessing codes, one network may look up at most 30 unknown codes per day.
import { getStore } from "@netlify/blobs";
import { CODE_RE, keyFor, json } from "../shared/hash.mjs";
export { keyFor };

const MAX_BYTES = 3_000_000;
const MISSES_PER_IP = 30;

const norm = (c) => String(c || "").trim().toLowerCase();

export async function handle(req, store, ip = "unknown", now = new Date()) {
  const day = now.toISOString().slice(0, 10);
  const missKey = async () => `miss/${day}/${await keyFor("ip:" + ip)}`;

  if (req.method === "GET") {
    const code = norm(new URL(req.url).searchParams.get("code"));
    if (!CODE_RE.test(code)) return json({ error: "bad-code" }, 400);
    const mk = await missKey();
    const misses = (await store.get(mk, { type: "json" }))?.n || 0;
    if (misses >= MISSES_PER_IP) return json({ error: "too-many" }, 429);
    const record = await store.get(await keyFor(code), { type: "json" });
    if (!record) {
      await store.setJSON(mk, { n: misses + 1 });
      return json({ error: "not-found" }, 404);
    }
    return json(record);
  }

  if (req.method === "DELETE") {
    const code = norm(new URL(req.url).searchParams.get("code"));
    if (!CODE_RE.test(code)) return json({ error: "bad-code" }, 400);
    await store.delete(await keyFor(code));
    return json({ ok: true });
  }

  if (req.method === "PUT") {
    let body;
    try {
      body = await req.json();
    } catch {
      return json({ error: "bad-json" }, 400);
    }
    const code = norm(body?.code);
    if (!CODE_RE.test(code)) return json({ error: "bad-code" }, 400);
    if (!body.data || typeof body.data !== "object") return json({ error: "no-data" }, 400);
    if (JSON.stringify(body.data).length > MAX_BYTES) return json({ error: "too-large" }, 413);
    const key = await keyFor(code);
    const updatedAt = Number(body.updatedAt) || Date.now();
    const existing = await store.get(key, { type: "json" });
    // Claiming a new code: refuse if someone already uses it.
    if (body.claim && existing) return json({ ok: false, taken: true }, 409);
    // Never let an older copy (e.g. an offline phone) overwrite newer progress.
    if (existing && existing.updatedAt > updatedAt) return json({ ok: false, stale: true, updatedAt: existing.updatedAt }, 409);
    await store.setJSON(key, { updatedAt, data: body.data });
    return json({ ok: true, updatedAt });
  }

  return json({ error: "method-not-allowed" }, 405);
}

export default async (req, context) =>
  handle(
    req,
    getStore({ name: "miteny-progress", consistency: "strong" }),
    context?.ip || req.headers.get("x-nf-client-connection-ip") || "unknown",
  );

export const config = { path: "/api/progress" };
