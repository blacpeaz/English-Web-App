// AI teacher for Miteny English.
// POST /api/ai  { code, task, params }  ->  a streamed Claude response (server-sent events).
// It runs as an edge function because edge functions can stream for longer than
// normal functions, which stop after about 10 seconds; a full lesson takes longer to write.
// Environment variables (set in Netlify):
//   ANTHROPIC_API_KEY  required
//   AI_MODEL           optional, default claude-sonnet-5-5 (lessons, writing, tests)
//   AI_FAST_MODEL      optional, default claude-haiku-5-5  (quick speaking tips)
//   APP_PIN            required; the AI only answers requests that carry this PIN (checked in /api/usage)

const CODE_RE = /^[a-z]+-[a-z]+-[a-z]+-\d{4}$/;
const CEFR = { 1: "A1 (beginner)", 2: "A2 (elementary)", 3: "B1 (intermediate)", 4: "B2 (upper-intermediate)", 5: "C1 (advanced)" };
const TEXT_LEN = { 1: "80-120", 2: "120-180", 3: "180-250", 4: "250-330", 5: "330-420" };

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });
const str = (v, max) => String(v ?? "").slice(0, max);
const list = (v, n, max) => (Array.isArray(v) ? v.slice(0, n).map((x) => str(x, max)) : []);
const level = (v) => Math.min(5, Math.max(1, parseInt(v, 10) || 1));

const LEARNER =
  "The learner is an adult Malagasy speaker who lives and works in Madagascar. Malagasy is their first language and they know some French. " +
  "They read a little English and their pronunciation is weak. The goal is to bring them to an advanced, confident level.";

const S = { type: "string" };
const SCHEMAS = {
  lesson: {
    type: "object",
    required: ["title", "topic", "kind", "lines", "words", "qs", "match", "speak", "writing"],
    properties: {
      title: S,
      topic: S,
      kind: { type: "string", enum: ["Conversation", "Story", "Article", "Reading", "Phone call", "Interview", "Email", "Discussion"] },
      lines: { type: "array", items: { type: "object", required: ["text"], properties: { who: S, text: S } } },
      words: {
        type: "array",
        items: {
          type: "object",
          required: ["key", "en", "say", "mg", "fr", "def", "ex"],
          properties: { key: S, en: S, say: S, mg: S, fr: S, def: S, ex: S },
        },
      },
      qs: {
        type: "array",
        items: {
          type: "object",
          required: ["t", "q", "why", "mg"],
          properties: {
            t: { type: "string", enum: ["mc", "tf"] },
            q: S,
            o: { type: "array", items: S },
            a: { type: "integer" },
            truth: { type: "boolean" },
            why: S,
            mg: S,
          },
        },
      },
      match: { type: "array", items: S },
      speak: { type: "array", items: { type: "object", required: ["t", "tip", "mg"], properties: { t: S, tip: S, mg: S } } },
      writing: { type: "object", required: ["task", "mg"], properties: { task: S, mg: S } },
    },
  },
  writing: {
    type: "object",
    required: ["score", "corrected", "mistakes", "good", "tip", "tip_mg"],
    properties: {
      score: { type: "integer" },
      corrected: S,
      mistakes: {
        type: "array",
        items: { type: "object", required: ["wrong", "right", "why", "mg"], properties: { wrong: S, right: S, why: S, mg: S } },
      },
      good: S,
      tip: S,
      tip_mg: S,
    },
  },
  speaking: {
    type: "object",
    required: ["tips", "cheer"],
    properties: {
      tips: { type: "array", items: { type: "object", required: ["word", "tip", "mg"], properties: { word: S, tip: S, mg: S } } },
      cheer: S,
    },
  },
  levelup: {
    type: "object",
    required: ["items"],
    properties: {
      items: {
        type: "array",
        items: {
          type: "object",
          required: ["s", "q", "o", "a"],
          properties: {
            s: { type: "string", enum: ["vocab", "grammar", "read", "listen"] },
            q: S,
            o: { type: "array", items: S },
            a: { type: "integer" },
            p: S,
            audio: S,
          },
        },
      },
    },
  },
};

// Structured outputs need "additionalProperties: false" on every object in the schema.
function strict(schema) {
  if (Array.isArray(schema)) return schema.map(strict);
  if (!schema || typeof schema !== "object") return schema;
  const out = {};
  for (const [k, v] of Object.entries(schema)) out[k] = typeof v === "object" ? strict(v) : v;
  if (out.type === "object") out.additionalProperties = false;
  return out;
}

function build(task, p) {
  if (task === "lesson") {
    const lv = level(p.level);
    return {
      system:
        `You are an expert English teacher who writes lessons for the Miteny English app. ${LEARNER}\n\n` +
        `Write ONE complete lesson at CEFR ${CEFR[lv]} (app level ${lv} of 5) and return it as JSON matching the schema.\n` +
        `Rules:\n` +
        `- Main text: ${TEXT_LEN[lv]} words, natural and interesting, on the given topic. Use the given kind (conversation lines have a speaker name in "who"; other kinds leave "who" empty and use one paragraph per line). Settings and names can be Malagasy or international; mix them.\n` +
        `- Grammar and vocabulary must fit the level. Weave in practice of the learner's weak points and difficult words when natural.\n` +
        `- words: 8-12 useful words or phrases from the text that are new at this level. key = lowercase letters only, unique. say = an easy sound guide with the stressed part in CAPITALS (no IPA), plus a short note in brackets when a letter is silent or the past form is irregular. mg = correct, natural standard Malagasy; if there is no direct word, give a short Malagasy explanation. fr = French. def = a simple English definition. ex = a new short example sentence.\n` +
        `- In the text, mark every glossary word where it appears as [[word]], or [[shown form|key]] when the form differs from the key (e.g. [[bought|buy]]). Mark each key at least once. Do not mark anything else.\n` +
        `- qs: 6-8 questions in this order: 3 comprehension questions (mc), 1 true/false (t="tf", use "truth"), then 2-3 questions on the grammar or vocabulary of the lesson (mc). mc questions have 3-4 options in "o" and the 0-based index of the correct one in "a". "why" explains the answer in simple English; "mg" is a short Malagasy hint.\n` +
        `- match: 4 glossary keys for a matching exercise.\n` +
        `- speak: 3 sentences from the text (short enough to say in one breath at this level). Each tip targets a real problem for Malagasy speakers: adding a vowel after final consonants, the letter o read as "ou", TH, silent letters (h in hour, l in would/should), -ed endings, word stress, long vs short vowels. mg = the tip in short Malagasy.\n` +
        `- writing: a short writing task (${lv <= 2 ? "3-5 sentences" : lv === 3 ? "5-8 sentences" : "a paragraph of 80-150 words"}) connected to the lesson, plus the task in Malagasy (mg).\n` +
        `- No politics, religion or upsetting content.`,
      user: JSON.stringify({
        level: lv,
        topic: str(p.topic, 60),
        kind: str(p.kind, 30),
        weak_areas: list(p.focus, 5, 20),
        difficult_words: list(p.hardWords, 20, 30),
        recent_writing_mistakes: list(p.mistakes, 15, 120),
        hard_sounds: list(p.sounds, 15, 30),
        do_not_repeat_titles: list(p.avoid, 40, 80),
      }),
    };
  }
  if (task === "writing") {
    const lv = level(p.level);
    return {
      system:
        `You are a kind, precise English teacher. ${LEARNER}\n` +
        `Check the learner's writing for the task. Judge it for app level ${lv} of 5 (CEFR ${CEFR[lv]}). Return JSON matching the schema:\n` +
        `- score 0-100 (how well it does the task and how accurate it is for this level; be encouraging but honest).\n` +
        `- corrected: their text with the smallest changes needed to be correct and natural.\n` +
        `- mistakes: up to 6 of the most important mistakes, each with the wrong part, the right version, why in simple English, and a short Malagasy explanation (mg).\n` +
        `- good: one sentence on what they did well. tip: one thing to practise next, in simple English; tip_mg: the same in Malagasy.\n` +
        `If the text is empty, off-topic or not in English, give a low score and explain kindly in "tip".`,
      user: JSON.stringify({ task: str(p.task, 400), lesson: str(p.lesson, 80), learner_text: str(p.answer, 2000) }),
    };
  }
  if (task === "speaking") {
    return {
      system:
        `You are a pronunciation coach. ${LEARNER}\n` +
        `Speech recognition heard the learner say a sentence. Some words were not recognised. Give up to 3 short, practical tips for the missed words ` +
        `(how to place the mouth or tongue, which part to stress, which letter is silent, not adding a vowel at the end). Use a simple sound guide with CAPITALS for stress, no IPA. ` +
        `mg = the tip in short Malagasy. cheer = one short encouraging sentence.`,
      user: JSON.stringify({ sentence: str(p.sentence, 240), heard: str(p.heard, 240), missed_words: list(p.missed, 15, 30) }),
    };
  }
  if (task === "levelup") {
    const lv = Math.min(4, level(p.level));
    return {
      system:
        `You write fair English level tests. ${LEARNER}\n` +
        `Write a 10-question level-up test that checks whether the learner has mastered CEFR ${CEFR[lv]} and is ready for ${CEFR[lv + 1]}. ` +
        `Exactly: 3 vocabulary (s="vocab"), 3 grammar (s="grammar"), 2 reading (s="read") about the same passage "p" of ${TEXT_LEN[lv]} words (repeat "p" in both), ` +
        `2 listening (s="listen") where "audio" is a sentence the app will read aloud and "q" asks about it. Every question has 4 options in "o" and the 0-based correct index in "a". ` +
        `Only one option may be correct. Vary the position of the correct answer.`,
      user: JSON.stringify({ level: lv, difficult_words: list(p.hardWords, 20, 30) }),
    };
  }
  return null;
}

const LIMITS = { lesson: { fast: false, max: 8000 }, writing: { fast: false, max: 2000 }, speaking: { fast: true, max: 700 }, levelup: { fast: false, max: 3500 } };

export default async (req, context) => {
  const key = Netlify.env.get("ANTHROPIC_API_KEY");
  if (!key) return json({ error: "no-key" }, 503);

  let body;
  try {
    const text = await req.text();
    if (text.length > 16000) return json({ error: "too-large" }, 413);
    body = JSON.parse(text);
  } catch {
    return json({ error: "bad-json" }, 400);
  }
  const spec = LIMITS[body?.task];
  if (!spec) return json({ error: "bad-task" }, 400);
  const code = str(body.code, 60).toLowerCase();
  if (!CODE_RE.test(code)) return json({ error: "bad-code" }, 400);

  // Daily limit check (counted in the usage function, which stores counts in Netlify Blobs).
  let left = null;
  try {
    const u = await fetch(new URL("/api/usage", req.url), {
      method: "POST",
      headers: { "content-type": "application/json", "x-app-pin": str(req.headers.get("x-app-pin"), 64) },
      body: JSON.stringify({ code, ip: context?.ip || "" }),
    });
    const uj = await u.json();
    if (!uj.ok) return json({ error: uj.reason || "limit" }, uj.reason === "bad-pin" ? 401 : 429);
    left = uj.left;
  } catch {
    return json({ error: "usage-check-failed" }, 503);
  }

  const { system, user } = build(body.task, body.params || {});
  const model = spec.fast ? Netlify.env.get("AI_FAST_MODEL") || "claude-haiku-5-5" : Netlify.env.get("AI_MODEL") || "claude-sonnet-5-5";

  const upstream = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({
      model,
      max_tokens: spec.max,
      system,
      messages: [{ role: "user", content: user }],
      output_config: { format: { type: "json_schema", schema: strict(SCHEMAS[body.task]) } },
      stream: true,
    }),
  });
  if (!upstream.ok) {
    const detail = await upstream.text();
    console.log("Anthropic error", upstream.status, detail.slice(0, 600));
    return json({ error: upstream.status === 401 ? "bad-key" : upstream.status === 529 || upstream.status === 429 ? "ai-busy" : "ai-error" }, 502);
  }
  return new Response(upstream.body, {
    headers: { "content-type": "text/event-stream", "cache-control": "no-store", "x-ai-left": String(left ?? "") },
  });
};

export const config = { path: "/api/ai", method: "POST" };
