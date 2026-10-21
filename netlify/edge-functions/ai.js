// AI teacher for Miteny English.
// POST /api/ai  { code, task, params }  ->  a streamed Claude response (server-sent events).
// It runs as an edge function because edge functions can stream for longer than
// normal functions, which stop after about 10 seconds; a full lesson takes longer to write.
// Environment variables (set in Netlify):
//   ANTHROPIC_API_KEY  required
//   AI_MODEL           optional, default claude-sonnet-5-5 (lessons, writing, tests)
//   AI_FAST_MODEL      optional, default claude-haiku-5-5  (quick speaking tips)
//   GEMINI_API_KEY     optional; when set, small jobs (daily words, sentence checks, speaking tips) use
//                      Google Gemini's free tier first and fall back to Claude if Gemini fails
//   GEMINI_MODEL       optional, default gemini-3.8-flash
//   APP_PIN            required; the AI only answers requests that carry this PIN (checked in /api/usage)

const CODE_RE = /^[a-z0-9][a-z0-9-]{5,39}$/;
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
  words: {
    type: "object",
    required: ["words"],
    properties: {
      words: {
        type: "array",
        items: {
          type: "object",
          required: ["en", "say", "pos", "mg", "fr", "def", "examples"],
          properties: { en: S, say: S, pos: S, mg: S, fr: S, def: S, examples: { type: "array", items: S } },
        },
      },
    },
  },
  sentence: {
    type: "object",
    required: ["correct", "uses_word", "corrected", "why", "mg", "better"],
    properties: { correct: { type: "boolean" }, uses_word: { type: "boolean" }, corrected: S, why: S, mg: S, better: S },
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
  if (task === "words") {
    const lv = level(p.level);
    const n = Math.min(14, Math.max(3, parseInt(p.count, 10) || 8));
    return {
      system:
        `You choose vocabulary for the Miteny English app. ${LEARNER}\n` +
        `Give ${n} useful English words or short phrases to learn today, right for CEFR ${CEFR[lv]} (app level ${lv} of 5). ` +
        `Mix everyday words, work words and, from level 3 up, words for opinions, news and ideas; from level 4 up include some phrasal verbs, collocations and idioms. ` +
        `Lean towards the theme of the day but do not use only theme words. Never give a word from the "already_known" list. ` +
        `For each: en = the word or phrase; say = an easy sound guide with the stressed part in CAPITALS (no IPA), with a short note in brackets for silent letters or irregular forms; ` +
        `pos = part of speech (noun, verb, adjective, adverb, phrase, phrasal verb, idiom); mg = correct, natural standard Malagasy (if there is no direct word, a short Malagasy explanation); ` +
        `fr = French; def = a simple English definition; examples = exactly 3 different natural sentences that show how the word is used, each short and right for the level, at least one about daily life in Madagascar.`,
      user: JSON.stringify({ level: lv, count: n, theme: str(p.theme, 60), difficult_words_to_avoid_repeating: list(p.hard, 30, 40), already_known: list(p.known, 500, 40) }),
    };
  }
  if (task === "sentence") {
    const lv = level(p.level);
    return {
      system:
        `You are a kind, precise English teacher. ${LEARNER}\n` +
        `The learner wrote ONE sentence to practise a new word. Judge it for app level ${lv} of 5 (CEFR ${CEFR[lv]}). Return JSON matching the schema:\n` +
        `- uses_word: true if the sentence uses the target word (any correct form, e.g. bought for buy) with the right meaning.\n` +
        `- correct: true only if the sentence is grammatically correct, makes sense, and uses the word correctly. Small capital-letter or full-stop slips alone do not make it wrong.\n` +
        `- corrected: the correct way to write their sentence, with the smallest changes that keep their idea. If it was already correct, repeat it (fixing only capitals or punctuation). If it does not use the word, rewrite their idea so it uses the word correctly.\n` +
        `- why: in simple English, what was wrong and why (one or two short sentences), or what was good if it is correct.\n` +
        `- mg: the same explanation in short, natural Malagasy.\n` +
        `- better: if correct but there is a more natural way a native speaker would say it, give it; otherwise an empty string.\n` +
        `If the text is empty or not English, set correct and uses_word to false and write a simple example sentence with the word in "corrected".`,
      user: JSON.stringify({ word: str(p.word, 60), meaning: str(p.def, 200), learner_sentence: str(p.sentence, 400) }),
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

// "light" tasks are small and cheap; they have their own daily allowance (see usage.mjs).
const LIMITS = {
  lesson: { fast: false, max: 8000 },
  writing: { fast: false, max: 2000 },
  speaking: { fast: true, max: 700, light: true, gemini: true },
  levelup: { fast: false, max: 3500 },
  words: { fast: false, max: 4500, light: true, gemini: true },
  sentence: { fast: false, max: 700, light: true, gemini: true },
};

// ---------- Google Gemini (free tier) for small jobs ----------
// Gemini's schema format: upper-case types and no "additionalProperties".
function geminiSchema(x) {
  if (Array.isArray(x)) return x.map(geminiSchema);
  if (!x || typeof x !== "object") return x;
  const out = {};
  for (const [k, v] of Object.entries(x)) {
    if (k === "additionalProperties") continue;
    out[k] = k === "type" && typeof v === "string" ? v.toUpperCase() : typeof v === "object" ? geminiSchema(v) : v;
  }
  return out;
}

// Returns the parsed JSON, or null if Gemini is not set up, fails, is too slow, or answers badly.
async function askGemini(task, system, user, max) {
  const key = Netlify.env.get("GEMINI_API_KEY");
  if (!key) return null;
  const model = Netlify.env.get("GEMINI_MODEL") || "gemini-3.8-flash";
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 22000);
  try {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: "POST",
      signal: ctrl.signal,
      headers: { "x-goog-api-key": key, "content-type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: "user", parts: [{ text: user }] }],
        generationConfig: { responseMimeType: "application/json", responseSchema: geminiSchema(SCHEMAS[task]), maxOutputTokens: Math.max(2048, max * 2) },
      }),
    });
    if (!r.ok) {
      console.log("Gemini error, using Claude instead:", r.status, (await r.text()).slice(0, 300));
      return null;
    }
    const j = await r.json();
    const cand = j?.candidates?.[0];
    const text = (cand?.content?.parts || []).map((p) => p.text || "").join("");
    if (cand?.finishReason && cand.finishReason !== "STOP") {
      console.log("Gemini stopped early, using Claude instead:", cand.finishReason);
      return null;
    }
    const out = JSON.parse(text);
    const missing = (SCHEMAS[task].required || []).filter((f) => !(f in out));
    if (missing.length) {
      console.log("Gemini answer incomplete, using Claude instead:", missing.join(","));
      return null;
    }
    return out;
  } catch (e) {
    console.log("Gemini failed, using Claude instead:", String(e).slice(0, 200));
    return null;
  } finally {
    clearTimeout(timer);
  }
}

// Send a finished answer in the same streaming format the app reads from Claude.
function asStream(obj, left) {
  const ev = (o) => `event: ${o.type}\ndata: ${JSON.stringify(o)}\n\n`;
  const body =
    ev({ type: "message_start" }) +
    ev({ type: "content_block_delta", index: 0, delta: { type: "text_delta", text: JSON.stringify(obj) } }) +
    ev({ type: "message_delta", delta: { stop_reason: "end_turn" } }) +
    ev({ type: "message_stop" });
  return new Response(body, {
    headers: { "content-type": "text/event-stream", "cache-control": "no-store", "x-ai-left": String(left ?? ""), "x-ai-provider": "gemini" },
  });
}

export default async (req, context) => {
  const key = Netlify.env.get("ANTHROPIC_API_KEY");
  if (!key && !Netlify.env.get("GEMINI_API_KEY")) return json({ error: "no-key" }, 503);

  let body;
  try {
    const text = await req.text();
    if (text.length > 40000) return json({ error: "too-large" }, 413);
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
      body: JSON.stringify({ code, ip: context?.ip || "", kind: spec.light ? "light" : "main" }),
    });
    const uj = await u.json();
    if (!uj.ok) return json({ error: uj.reason || "limit" }, uj.reason === "bad-pin" ? 401 : 429);
    left = uj.left;
  } catch {
    return json({ error: "usage-check-failed" }, 503);
  }

  const { system, user } = build(body.task, body.params || {});

  if (spec.gemini) {
    const free = await askGemini(body.task, system, user, spec.max);
    if (free) {
      console.log(`Answered by Gemini: ${body.task}`);
      return asStream(free, left);
    }
  }
  if (!key) return json({ error: "ai-busy" }, 502);

  console.log(`Answered by Claude: ${body.task}`);
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
    headers: { "content-type": "text/event-stream", "cache-control": "no-store", "x-ai-left": String(left ?? ""), "x-ai-provider": "claude" },
  });
};

export const config = { path: "/api/ai", method: "POST" };
