// Guards the AI teacher: checks the access PIN and counts AI uses per day,
// so only people with the PIN can use the AI and the bill stays small.
// Called by the AI edge function before every AI request.
// APP_PIN: the access PIN (required; the AI stays locked until it is set)
// AI_DAILY_LIMIT: uses per recovery code per day (default 25)
// AI_GLOBAL_DAILY_LIMIT: uses for the whole app per day (default 30)
import { getStore } from "@netlify/blobs";
import { CODE_RE, keyFor, json } from "../shared/hash.mjs";

const FAILS_PER_IP = 10; // wrong PINs allowed per device/network per day
const FAILS_TOTAL = 50; // wrong PINs allowed for the whole app per day

function sameText(a, b) {
  // Compare without stopping early, so timing does not leak how much of the PIN was right.
  const x = new TextEncoder().encode(a);
  const y = new TextEncoder().encode(b);
  let diff = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) diff |= (x[i] || 0) ^ (y[i] || 0);
  return diff === 0;
}

export async function handle(req, store, env = process.env, now = new Date()) {
  if (req.method !== "POST") return json({ ok: false, reason: "method-not-allowed" }, 405);
  let body;
  try {
    body = await req.json();
  } catch {
    return json({ ok: false, reason: "bad-json" }, 400);
  }

  const expected = String(env.APP_PIN || "").trim();
  if (!expected) return json({ ok: false, reason: "pin-not-set" });

  const day = now.toISOString().slice(0, 10);
  const ip = String(body?.ip || req.headers.get("x-nf-client-connection-ip") || "unknown").slice(0, 64);
  const kIpFail = `${day}/pinfail/${await keyFor("ip:" + ip)}`;
  const kAllFail = `${day}/pinfail/all`;
  const [ipFail, allFail] = await Promise.all([store.get(kIpFail, { type: "json" }), store.get(kAllFail, { type: "json" })]);
  const nIp = ipFail?.n || 0;
  const nAll = allFail?.n || 0;
  if (nIp >= FAILS_PER_IP || nAll >= FAILS_TOTAL) return json({ ok: false, reason: "locked" });

  const given = String(req.headers.get("x-app-pin") || "").trim();
  if (!sameText(given, expected)) {
    await Promise.all([store.setJSON(kIpFail, { n: nIp + 1 }), store.setJSON(kAllFail, { n: nAll + 1 })]);
    return json({ ok: false, reason: "bad-pin" });
  }

  const code = String(body?.code || "").trim().toLowerCase();
  if (!CODE_RE.test(code)) return json({ ok: false, reason: "bad-code" }, 400);

  const perCode = Number(env.AI_DAILY_LIMIT || 25);
  const global = Number(env.AI_GLOBAL_DAILY_LIMIT || 30);
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
