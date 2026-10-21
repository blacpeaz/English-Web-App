export const CODE_RE = /^[a-z]+-[a-z]+-[a-z]+-\d{4}$/;

// The recovery code is never stored as-is: storage keys use a SHA-256 hash of it.
export async function keyFor(code) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("miteny:" + code));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export const json = (body, status = 200, extra = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store", ...extra },
  });
