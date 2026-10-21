// Counts AI teacher uses per day, so the AI bill stays small.
// Called by the AI edge function before every AI request.
// AI_DAILY_LIMIT: uses per recovery code per day (default 25)
// AI_GLOBAL_DAILY_LIMIT: uses for the whole app per day (default 80)
import { getStore } from "@netlify/blobs";
import { CODE_RE, keyFor, json } from "../shared/hash.mjs";

export async function handle(req, store, now = new Date()) {
  if (req.method !== "POST") return json({ ok: false, reason: "method-not-allowed" }, 405);
  let body;
  try {
    body = await req.json();
  } catch {
    return json({ ok: false, reason: "bad-json" }, 400);
  }
  const code = String(body?.code || "").trim().toLowerCase();
  if (!CODE_RE.test(code)) return json({ ok: false, reason: "bad-code" }, 400);

  const perCode = Number(process.env.AI_DAILY_LIMIT || 25);
  const global = Number(process.env.AI_GLOBAL_DAILY_LIMIT || 80);
  const day = now.toISOString().slice(0, 10);
  const kCode = `${day}/${await keyFor(code)}`;
  const kAll = `${day}/all`;
  const [mine, all] = await Promise.all([store.get(kCode, { type: "json" }), store.get(kAll, { type: "json" })]);
  const usedMine = mine?.n || 0;
  const usedAll = all?.n || 0;
  if (usedMine >= perCode) return json({ ok: false, reason: "daily-limit", left: 0 });
  if (usedAll >= global) return json({ ok: false, reason: "app-limit", left: 0 });
  await Promise.all([store.setJSON(kCode, { n: usedMine + 1 }), store.setJSON(kAll, { n: usedAll + 1 })]);
  return json({ ok: true, left: perCode - usedMine - 1 });
}

export default async (req) => handle(req, getStore({ name: "miteny-usage", consistency: "strong" }));

export const config = { path: "/api/usage" };
