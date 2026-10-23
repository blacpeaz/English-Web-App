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
const TEXT_LEN = { 1: "80-120", 2: "120-180", 3: "220-320", 4: "350-480", 5: "480-650" };
const LISTEN_LEN = { 1: "60-90", 2: "90-140", 3: "160-230", 4: "250-340", 5: "330-450" };

// Question types grow harder with each level (reading lessons and tests).
const QUESTION_MIX = {
  1: "6 questions in this order: 3 comprehension questions about facts in the text (mc), 1 true/false (t=\"tf\", use \"truth\"), then 2 questions on the vocabulary or grammar of the lesson (mc).",
  2: "7 questions in this order: 3 comprehension questions about facts (mc), 1 question asking why something happened (mc), 1 true/false (t=\"tf\", use \"truth\"), then 2 vocabulary or grammar questions (mc).",
  3: "8 questions in this order: 2 detail questions (mc), 2 inference questions (why something happened, what we can guess, what a person probably feels) (mc), 1 vocabulary-in-context question ('In the text, \"...\" means...') (mc), 1 true/false (t=\"tf\", use \"truth\"), then 2 grammar or vocabulary questions, one of them on the grammar focus (mc).",
  4: "9 multiple-choice questions in this order: 1 main idea, 2 details, 2 inference or implied meaning, 1 the writer's attitude, tone or purpose, 1 vocabulary or phrasal verb in context, 1 on the grammar focus, 1 register question ('Which sentence is the most polite / formal way to say...'). No true/false.",
  5: "10 multiple-choice questions in this order: 1 best summary of the text, 1 detail, 2 inference, 1 writer's attitude or tone, 1 purpose of a paragraph or a phrase (e.g. to contrast, to give an example, to persuade), 1 collocation or idiom in context, 1 register ('Which is the most professional wording for an email to a client?'), 2 advanced grammar questions, one on the grammar focus. Wrong options must be plausible, not obviously wrong. No true/false.",
};

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });
const str = (v, max) => String(v ?? "").slice(0, max);
const list = (v, n, max) => (Array.isArray(v) ? v.slice(0, n).map((x) => str(x, max)) : []);
const level = (v) => Math.min(5, Math.max(1, parseInt(v, 10) || 1));

// Extra rules when the lesson also teaches personal finance ("Money & English" course).
const MONEY_RULES = (m, lv) =>
  `\n\nTHIS LESSON ALSO TEACHES PERSONAL FINANCE. The money idea: "${str(m.title, 80)}": ${str(m.idea, 400)}. Inspired by: ${str(m.source, 160)}.\n` +
  `- The main text must teach this idea clearly while staying a good English lesson at the level. Use a story, conversation or short article set mostly in Madagascar, with prices and amounts in ariary (Ar) that are realistic, and everyday situations such as a small shop, a market seller, a salary, a family budget, mobile money or a microfinance loan.\n` +
  `- Mention the book the idea comes from once, by title and author. Explain its ideas in your own words. Do NOT copy or closely paraphrase sentences from books still under copyright (The Psychology of Money, Think and Grow Rich, Rich Dad Poor Dad, The Millionaire Next Door, The Total Money Makeover). Short famous lines from The Richest Man in Babylon (1926, public domain) may be quoted.\n` +
  `- Questions: at least 2 comprehension questions must check understanding of the money idea, and ${lv >= 2 ? "one question must need a small calculation with ariary amounts (e.g. saving 10% of a salary, simple interest)" : "one question may use a very simple ariary amount"}.\n` +
  `- Glossary: include the key money words of the lesson (e.g. income, expenses, savings, interest, debt, budget, profit, asset) with correct Malagasy.\n` +
  `- takeaway: the money lesson in one or two simple English sentences (en) and in Malagasy (mg).\n` +
  `- action: one small, practical thing to do this week (en) and in Malagasy (mg), e.g. "Write down everything you spend for 7 days."\n` +
  `- writing: a reflection task about the learner's own money habits or plans, related to the idea.\n` +
  `- Teach general, careful ideas; no specific investment products, no promises of quick money, and remind that risky offers should be checked with someone trusted.`;

// Which words to teach at each level: aim at the top of the learner's level and the next one up.
const WORD_BAND = {
  1: "everyday A1-A2 words beyond the very first basics (e.g. borrow, kitchen, angry, cheap, early, receipt).",
  2: "A2-B1 words (e.g. reliable, deliver, complain, deadline, customer, improve, take care of).",
  3: "B1-B2 words, collocations and phrasal verbs (e.g. negotiate, shortage, persuade, figure out, in charge of, make a profit, sustainable, reluctant). Avoid A1-A2 words such as buy, happy, work, deliver or customer.",
  4: "B2-C1 words, phrasal verbs, collocations and idioms (e.g. outweigh, setback, come up with, feasible, take for granted, cut corners, in the long run). Avoid anything at B1 or below.",
  5: "C1-C2 words and expressions (e.g. mitigate, nuance, inadvertently, by and large, scrutinise, a double-edged sword, to be at odds with). Avoid anything at B2 or below.",
};

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
      takeaway: { type: "object", required: ["en", "mg"], properties: { en: S, mg: S } },
      source_note: S,
      action: { type: "object", required: ["en", "mg"], properties: { en: S, mg: S } },
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
  grammar: {
    type: "object",
    required: ["title", "summary_en", "summary_mg", "rules", "examples", "mistakes", "exercises", "produce"],
    properties: {
      title: S,
      summary_en: S,
      summary_mg: S,
      rules: { type: "array", items: { type: "object", required: ["rule", "example"], properties: { rule: S, example: S } } },
      examples: { type: "array", items: { type: "object", required: ["en", "note"], properties: { en: S, note: S } } },
      mistakes: { type: "array", items: { type: "object", required: ["wrong", "right", "why", "mg"], properties: { wrong: S, right: S, why: S, mg: S } } },
      exercises: {
        type: "array",
        items: {
          type: "object",
          required: ["t", "q", "why", "mg"],
          properties: { t: { type: "string", enum: ["mc", "gap", "fix"] }, q: S, o: { type: "array", items: S }, a: { type: "integer" }, answers: { type: "array", items: S }, why: S, mg: S },
        },
      },
      produce: { type: "object", required: ["task", "mg"], properties: { task: S, mg: S } },
    },
  },
  speakfb: {
    type: "object",
    required: ["score", "rubric", "corrected", "model", "mistakes", "good", "tip", "tip_mg", "follow_up"],
    properties: {
      score: { type: "integer" },
      rubric: {
        type: "object",
        required: ["task", "grammar", "vocabulary", "fluency"],
        properties: { task: { type: "integer" }, grammar: { type: "integer" }, vocabulary: { type: "integer" }, fluency: { type: "integer" } },
      },
      corrected: S,
      model: S,
      mistakes: { type: "array", items: { type: "object", required: ["wrong", "right", "why", "mg"], properties: { wrong: S, right: S, why: S, mg: S } } },
      good: S,
      tip: S,
      tip_mg: S,
      follow_up: S,
    },
  },
  roleplay: {
    type: "object",
    required: ["reply", "correction", "end"],
    properties: {
      reply: S,
      correction: { type: "object", required: ["needed", "better", "why", "mg"], properties: { needed: { type: "boolean" }, better: S, why: S, mg: S } },
      end: { type: "boolean" },
    },
  },
  listening: {
    type: "object",
    required: ["title", "kind", "speakers", "lines", "qs", "dictation", "words"],
    properties: {
      title: S,
      kind: S,
      speakers: { type: "array", items: { type: "object", required: ["name", "voice"], properties: { name: S, voice: { type: "string", enum: ["female", "male"] } } } },
      lines: { type: "array", items: { type: "object", required: ["who", "text"], properties: { who: S, text: S } } },
      qs: {
        type: "array",
        items: {
          type: "object",
          required: ["type", "q", "o", "a", "why", "mg"],
          properties: { type: { type: "string", enum: ["gist", "detail", "inference", "attitude", "purpose"] }, q: S, o: { type: "array", items: S }, a: { type: "integer" }, why: S, mg: S },
        },
      },
      dictation: { type: "array", items: S },
      words: { type: "array", items: { type: "object", required: ["en", "mg", "def"], properties: { en: S, mg: S, def: S } } },
    },
  },
  writepro: {
    type: "object",
    required: ["score", "rubric", "corrected", "mistakes", "model", "good", "tips", "tip_mg"],
    properties: {
      score: { type: "integer" },
      rubric: {
        type: "object",
        required: ["task", "organisation", "grammar", "vocabulary", "tone"],
        properties: { task: { type: "integer" }, organisation: { type: "integer" }, grammar: { type: "integer" }, vocabulary: { type: "integer" }, tone: { type: "integer" } },
      },
      corrected: S,
      mistakes: { type: "array", items: { type: "object", required: ["wrong", "right", "why", "mg"], properties: { wrong: S, right: S, why: S, mg: S } } },
      model: S,
      good: S,
      tips: { type: "array", items: S },
      tip_mg: S,
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

// Every Malagasy explanation also gets a French version (Malagasy from the AI is sometimes imperfect).
// mg -> fr, tip_mg -> tip_fr, summary_mg -> summary_fr. Objects that already have "fr" (word glossaries) are left alone.
function addFrench(x) {
  if (Array.isArray(x)) return x.forEach(addFrench);
  if (!x || typeof x !== "object") return;
  if (x.type === "object" && x.properties) {
    for (const [mg, fr] of [["mg", "fr"], ["tip_mg", "tip_fr"], ["summary_mg", "summary_fr"]]) {
      if (x.properties[mg] && !x.properties[fr]) {
        x.properties[fr] = { type: "string" };
        if (Array.isArray(x.required) && x.required.includes(mg)) x.required.push(fr);
      }
    }
  }
  Object.values(x).forEach(addFrench);
}
addFrench(SCHEMAS);
const FR_NOTE =
  "\n\nLANGUAGE OF EXPLANATIONS: every Malagasy field (mg, tip_mg, summary_mg) has a French partner field (fr, tip_fr, summary_fr). " +
  "Write the same explanation in both. Write the Malagasy in short, simple, standard Malagasy that you are sure is correct; " +
  "the French must be clear and correct, because the learner relies on it when the Malagasy is unclear.";

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
  const r = buildBase(task, p);
  if (r) r.system += FR_NOTE;
  return r;
}

function buildBase(task, p) {
  if (task === "lesson") {
    const lv = level(p.level);
    return {
      system:
        `You are an expert English teacher who writes lessons for the Miteny English app. ${LEARNER}\n\n` +
        `Write ONE complete lesson at CEFR ${CEFR[lv]} (app level ${lv} of 5) and return it as JSON matching the schema.\n` +
        `Rules:\n` +
        `- Main text: ${TEXT_LEN[lv]} words, natural and interesting, on the given topic. Use the given kind (conversation lines have a speaker name in "who"; other kinds leave "who" empty and use one paragraph per line). Settings and names can be Malagasy or international; mix them.\n` +
        `- Grammar and vocabulary must fit the level. Weave in practice of the learner's weak points and difficult words when natural.\n` +
        (p.grammar ? `- Grammar focus: "${str(p.grammar, 80)}". Use this structure naturally several times in the text, and test it in one question.\n` : "") +
        (p.news ? `- This lesson is based on a real news story from this week. Use ONLY these facts, keep them accurate, write the story in your own words at the level, and start the text with the date and the source name. No political opinions. source_note: the source names and date.\nNEWS FACTS:\n${str(p.news, 3000)}\n` : "") +
        `- words: 8-12 useful words or phrases from the text that are new at this level. key = lowercase letters only, unique. say = an easy sound guide with the stressed part in CAPITALS (no IPA), plus a short note in brackets when a letter is silent or the past form is irregular. mg = correct, natural standard Malagasy; if there is no direct word, give a short Malagasy explanation. fr = French. def = a simple English definition. ex = a new short example sentence.\n` +
        `- In the text, mark every glossary word where it appears as [[word]], or [[shown form|key]] when the form differs from the key (e.g. [[bought|buy]]). Mark each key at least once. Do not mark anything else.\n` +
        `- qs: ${QUESTION_MIX[lv]} mc questions have ${lv >= 4 ? "4" : "3-4"} options in "o" and the 0-based index of the correct one in "a"; vary the position of the correct answer. "why" explains the answer in simple English (point to the part of the text); "mg" is a short Malagasy hint.\n` +
        `- match: 4 glossary keys for a matching exercise.\n` +
        `- speak: 3 sentences from the text (short enough to say in one breath at this level). Each tip targets a real problem for Malagasy speakers: adding a vowel after final consonants, the letter o read as "ou", TH, silent letters (h in hour, l in would/should), -ed endings, word stress, long vs short vowels. mg = the tip in short Malagasy.\n` +
        `- writing: a writing task connected to the lesson (${lv <= 2 ? "3-5 sentences" : lv === 3 ? "a paragraph of 100-150 words" : lv === 4 ? "150-220 words, e.g. an email, an opinion or a short report" : "200-300 words in a professional genre: report, proposal, formal email or argued opinion"}), plus the task in Malagasy (mg).\n` +
        `- No politics, religion or upsetting content.` +
        (p.money ? MONEY_RULES(p.money, lv) : ""),
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
      user: JSON.stringify({ task: str(p.task, 400), lesson: str(p.lesson, 80), learner_text: str(p.answer, 4000) }),
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
        `Give ${n} English words or short phrases to learn today. The learner is at CEFR ${CEFR[lv]} (app level ${lv} of 5) and wants to grow towards advanced, ` +
        `so choose words the learner most likely does NOT know yet: ${WORD_BAND[lv]} The examples only show the level; do not simply reuse them. ` +
        `Never give basic words below that band. Mix nouns, verbs, adjectives and useful phrases; mix daily life, work and ideas. ` +
        `Lean towards the theme of the day but do not use only theme words. Never give a word from the "already_known" list. ` +
        `For each: en = the word or phrase; say = an easy sound guide with the stressed part in CAPITALS (no IPA), with a short note in brackets for silent letters or irregular forms; ` +
        `pos = part of speech (noun, verb, adjective, adverb, phrase, phrasal verb, idiom); mg = correct, natural standard Malagasy (if there is no direct word, a short Malagasy explanation); ` +
        `fr = French; def = a simple English definition; examples = exactly 3 different natural sentences that show how the word is used, each short and right for the level, at least one about daily life in Madagascar.`,
      user: JSON.stringify({ level: lv, count: n, theme: str(p.theme, 60), difficult_words_to_avoid_repeating: list(p.hard, 30, 40), already_known: list(p.known, 500, 40) }),
    };
  }
  if (task === "sentence" && p.grammar) {
    const lv = level(p.level);
    return {
      system:
        `You are a kind, precise English grammar teacher. ${LEARNER}\n` +
        `The learner wrote ONE sentence to practise a grammar point. Judge it for app level ${lv} of 5 (CEFR ${CEFR[lv]}). Return JSON matching the schema:\n` +
        `- uses_word: true if the sentence uses the target grammar structure.\n` +
        `- correct: true only if the sentence is grammatically correct, makes sense, and uses the structure correctly. Small capital-letter or full-stop slips alone do not make it wrong.\n` +
        `- corrected: the correct way to write their sentence with the structure, with the smallest changes that keep their idea.\n` +
        `- why: in simple English, what was wrong and why, or what was good.\n- mg: the same in short, natural Malagasy.\n- better: a more natural version if there is one, else an empty string.`,
      user: JSON.stringify({ grammar_point: str(p.grammar, 100), task: str(p.task, 300), learner_sentence: str(p.sentence, 400) }),
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
    const lv = level(p.level);
    const final = lv >= 5;
    const goal = final ? "has reached a professional, C1+ level of English and can use it confidently at work" : `has mastered CEFR ${CEFR[lv]} and is ready for ${CEFR[lv + 1]}`;
    return {
      system:
        `You write fair, demanding English tests. ${LEARNER}\n` +
        `Write a ${final ? 15 : 12}-question ${final ? "final professional English" : "level-up"} test that checks whether the learner ${goal}. ` +
        `Exactly: ${final ? 4 : 3} vocabulary/collocation (s="vocab"), ${final ? 4 : 4} grammar (s="grammar", taken from the grammar list given), ${final ? 4 : 3} reading (s="read") about the same passage "p" of ${TEXT_LEN[lv]} words (repeat "p" in each), ` +
        `${final ? 3 : 2} listening (s="listen") where "audio" is one or two natural sentences the app will read aloud and "q" asks about them. ` +
        `Reading questions must include inference and the writer's attitude or purpose${lv >= 4 ? ", and one register question" : ""}; listening questions must include one inference. ` +
        `Every question has 4 options in "o" and the 0-based correct index in "a". Only one option may be correct, wrong options must be plausible, and the correct position must vary.`,
      user: JSON.stringify({ level: lv, grammar_of_this_level: list(p.grammar, 14, 80), difficult_words: list(p.hardWords, 20, 30) }),
    };
  }
  if (task === "grammar") {
    const lv = level(p.level);
    return {
      system:
        `You are an expert English grammar teacher. ${LEARNER}\n` +
        `Write ONE grammar lesson on the given grammar point for CEFR ${CEFR[lv]} (app level ${lv} of 5). Return JSON matching the schema:\n` +
        `- summary_en: 2-4 short, simple sentences explaining when and why we use it. summary_mg: the same explanation in clear, natural Malagasy (compare with Malagasy or French when it helps).\n` +
        `- rules: 3-5 form rules, each with a short example (e.g. rule "He/She/It + verb + -s", example "She works in Toamasina.").\n` +
        `- examples: 5 natural example sentences from daily life and work in Madagascar, each with a short note on the form.\n` +
        `- mistakes: 3-4 typical mistakes Malagasy or French speakers make with this point, with the right version, why, and mg.\n` +
        `- exercises: exactly 10, in this order: 4 multiple choice (t="mc", "q" with a blank ___ or a question, 3-4 options in "o", correct 0-based index in "a"), ` +
        `3 gap fills (t="gap", "q" is a sentence with ONE ___ and the base word in brackets if needed, "answers" lists every acceptable answer, short), ` +
        `3 corrections (t="fix", "q" is a sentence with one mistake, "answers" lists the corrected full sentence and any other acceptable corrected versions). ` +
        `Exercises get a little harder as they go; use real-life contexts. "why" explains the answer; "mg" is a short Malagasy hint.\n` +
        `- produce: a task asking the learner to write 2 sentences of their own using this grammar point about their life or work, plus the task in Malagasy (mg).`,
      user: JSON.stringify({ level: lv, grammar_point: str(p.title, 100), notes: str(p.note, 300), learner_recent_mistakes: list(p.mistakes, 10, 120) }),
    };
  }
  if (task === "speakfb") {
    const lv = level(p.level);
    return {
      system:
        `You are an experienced English speaking examiner and coach. ${LEARNER}\n` +
        `The learner answered a speaking question aloud; speech recognition turned it into text (so ignore missing punctuation and capital letters, and small recognition errors that are clearly not the learner's fault). ` +
        `Judge it like a speaking exam at CEFR ${CEFR[lv]}, with the goal of reaching a professional level. Return JSON matching the schema:\n` +
        `- rubric: each 0-5: task (did they answer the question fully, with reasons and examples), grammar (range and accuracy), vocabulary (range and precision), fluency (length, linking words, organisation). ` +
        `For level ${lv}, a good answer is about ${[0, 20, 35, 60, 90, 120][lv]}+ words. score: 0-100 overall.\n` +
        `- corrected: what they said, corrected, keeping their ideas and words where possible.\n` +
        `- model: a strong natural answer to the same question at ${lv < 5 ? "the next level up" : "a professional level"}, using their ideas where possible, ${[0, 40, 60, 90, 120, 150][lv]}-${[0, 60, 90, 130, 170, 200][lv]} words.\n` +
        `- mistakes: up to 6 of the most important, with wrong, right, why (simple English) and mg (Malagasy).\n` +
        `- good: one sentence on what was good. tip: the one thing to work on next (e.g. give a reason and an example, use linking words, use past tenses correctly); tip_mg in Malagasy.\n` +
        `- follow_up: one natural follow-up question an examiner or a manager would ask next.`,
      user: JSON.stringify({ question: str(p.question, 300), learner_answer: str(p.answer, 3000), seconds_spoken: parseInt(p.seconds, 10) || 0 }),
    };
  }
  if (task === "roleplay") {
    const lv = level(p.level);
    return {
      system:
        `You are acting in an English speaking role-play for a learner. ${LEARNER}\n` +
        `Scenario: ${str(p.scenario, 400)}\nYou play: ${str(p.role, 120)}. The learner plays: ${str(p.learnerRole, 120)}.\n` +
        `Stay in character. Speak naturally for CEFR ${CEFR[lv]}: ${lv <= 2 ? "short, clear sentences and simple words" : lv === 3 ? "natural sentences, everyday expressions" : "natural, realistic speech, including polite indirect language and some idioms"}. ` +
        `Keep each reply to 1-3 sentences and usually end with a question or something the learner must respond to, so the conversation moves towards the goal: ${str(p.goal, 200)}.\n` +
        `correction: look at the learner's LAST message only. needed = true if it has a grammar or word mistake or sounds unnatural or impolite for the situation; then better = a corrected natural version, why = short simple reason, mg = short Malagasy. If it was fine, needed = false and better, why and mg are empty strings. ` +
        `The learner's words come from speech recognition, so ignore punctuation and capital letters.\n` +
        `end: true when the goal is reached or after about 8 exchanges; then make your reply a natural closing line.\n` +
        `If there is no learner message yet, start the conversation in character with your first line, and set needed to false.`,
      user: JSON.stringify({ conversation_so_far: Array.isArray(p.history) ? p.history.slice(-16).map((t) => ({ who: t.who === "me" ? "learner" : "you", text: str(t.text, 600) })) : [] }),
    };
  }
  if (task === "listening") {
    const lv = level(p.level);
    return {
      system:
        `You write listening exercises for English learners. ${LEARNER}\n` +
        `Write ONE listening script at CEFR ${CEFR[lv]}, ${LISTEN_LEN[lv]} words, of the given kind and topic, to be read aloud by text-to-speech. Return JSON matching the schema:\n` +
        `- speakers: 1-3 people with a name and a voice (female or male). lines: who speaks and what they say; natural spoken English${lv >= 3 ? " with fillers like 'well', 'actually', 'I mean', contractions and some idioms" : ""}. For a monologue or announcement use one speaker.\n` +
        `- qs: ${lv <= 2 ? "5 questions: 1 gist, 3 detail, 1 inference" : lv === 3 ? "6 questions: 1 gist, 3 detail, 2 inference" : "7 questions: 1 gist, 2 detail, 2 inference, 1 attitude (how a speaker feels or what they think), 1 purpose (why a speaker says something)"}; ` +
        `each with 3-4 options in "o" (4 from level 3) and the 0-based correct index in "a"; answers must only be possible by listening, and the correct position must vary. why = which part of the script gives the answer; mg = short Malagasy hint.\n` +
        `- dictation: 3 sentences copied exactly from the script, ${lv <= 2 ? "6-9" : lv === 3 ? "9-13" : "12-18"} words each, useful for practising listening carefully.\n` +
        `- words: 4-6 useful words from the script with Malagasy (mg) and a simple definition.\n- No politics, religion or upsetting content.`,
      user: JSON.stringify({ level: lv, topic: str(p.topic, 80), kind: str(p.kind, 60) }),
    };
  }
  if (task === "writepro") {
    const lv = level(p.level);
    return {
      system:
        `You are an experienced English writing examiner and business-writing coach. ${LEARNER}\n` +
        `Mark the learner's text for the task like a writing exam at CEFR ${CEFR[lv]}, with the goal of professional English. Return JSON matching the schema:\n` +
        `- rubric, each 0-5: task (does it do everything the task asks, right length), organisation (paragraphs, logical order, linking), grammar (range and accuracy), vocabulary (range, precision, collocations), tone (right formality and politeness for the reader). score 0-100.\n` +
        `- corrected: their text with every error corrected, keeping their ideas and structure.\n` +
        `- mistakes: up to 8 of the most important, with wrong, right, why (simple English) and mg (Malagasy).\n` +
        `- model: a strong model answer to the same task at ${lv < 5 ? "the next level up" : "a professional level"}, using their ideas where possible, the right length and layout (greeting and sign-off for emails, headings for reports).\n` +
        `- good: one sentence on what was good. tips: 2-3 short, specific tips (e.g. useful phrases for this kind of text). tip_mg: the most important tip in Malagasy.`,
      user: JSON.stringify({ genre: str(p.genre, 60), task: str(p.task, 600), word_range: str(p.words, 30), learner_text: str(p.answer, 6000) }),
    };
  }
  return null;
}

// "light" tasks are small and cheap; they have their own daily allowance (see usage.mjs).
const LIMITS = {
  lesson: { fast: false, max: 11000 },
  grammar: { fast: false, max: 7500 },
  speakfb: { fast: false, max: 3000, light: true },
  roleplay: { fast: true, max: 1000, light: true, gemini: true },
  listening: { fast: false, max: 6000 },
  writepro: { fast: false, max: 6000 },
  writing: { fast: false, max: 4000 },
  speaking: { fast: true, max: 900, light: true, gemini: true },
  levelup: { fast: false, max: 7000 },
  words: { fast: false, max: 4500, light: true, gemini: true },
  sentence: { fast: false, max: 900, light: true, gemini: true },
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
// Tries the main free model, then the lighter Flash-Lite model (often free when Flash is busy).
async function askGemini(task, system, user, max) {
  const key = Netlify.env.get("GEMINI_API_KEY");
  if (!key) return null;
  const models = [Netlify.env.get("GEMINI_MODEL") || "gemini-3.8-flash", Netlify.env.get("GEMINI_LITE_MODEL") || "gemini-3.5-flash-lite"];
  const waits = [14000, 10000];
  for (let i = 0; i < models.length; i++) {
    const out = await askGeminiModel(models[i], waits[i], key, task, system, user, max);
    if (out) return out;
  }
  return null;
}

async function askGeminiModel(model, wait, key, task, system, user, max) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), wait);
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
      console.log(`Gemini ${model} error:`, r.status, (await r.text()).slice(0, 300));
      return null;
    }
    const j = await r.json();
    const cand = j?.candidates?.[0];
    const text = (cand?.content?.parts || []).map((p) => p.text || "").join("");
    if (cand?.finishReason && cand.finishReason !== "STOP") {
      console.log(`Gemini ${model} stopped early:`, cand.finishReason);
      return null;
    }
    const out = JSON.parse(text);
    const missing = (SCHEMAS[task].required || []).filter((f) => !(f in out));
    if (missing.length) {
      console.log(`Gemini ${model} answer incomplete:`, missing.join(","));
      return null;
    }
    return out;
  } catch (e) {
    console.log(`Gemini ${model} failed:`, String(e).slice(0, 200));
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

  const params = body.params || {};
  if (body.task === "lesson" && params.news && key) return newsLesson(key, params, spec, left);
  const { system, user } = build(body.task, params);

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

// News lessons: (1) Claude searches this week's news and writes a short factual brief,
// (2) the lesson is written from that brief and streamed to the app.
// The response starts at once and sends small "ping" lines while searching, so the connection stays open.
function newsLesson(key, params, spec, left) {
  const enc = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const ping = setInterval(() => controller.enqueue(enc.encode(": ping\n\n")), 4000);
      let brief = "";
      try {
        const r = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
          body: JSON.stringify({
            model: Netlify.env.get("AI_MODEL") || "claude-sonnet-5-5",
            max_tokens: 1500,
            tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 3 }],
            system:
              "You find news for English learners in Madagascar. Search the web for news from the last 7 days. Choose ONE interesting, non-political, not violent story " +
              "about business, technology, science, health, environment, sport, culture, Africa or Madagascar, preferring " + str(params.newsTopic || "any of these", 60) + ". " +
              "Then write a short factual brief in plain English: headline, date, 6-10 key facts with numbers, and the source names. No opinions.",
            messages: [{ role: "user", content: "Find this week's story and write the brief." }],
          }),
        });
        if (r.ok) {
          const j = await r.json();
          brief = (j.content || []).filter((b) => b.type === "text").map((b) => b.text).join("").trim();
        } else console.log("News search failed", r.status, (await r.text()).slice(0, 300));
      } catch (e) {
        console.log("News search error", String(e).slice(0, 200));
      }
      clearInterval(ping);
      const p2 = { ...params, news: brief || "", topic: brief ? "This week's news" : params.topic || "Technology" };
      if (!brief) delete p2.news;
      const { system, user } = build("lesson", p2);
      try {
        const up = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
          body: JSON.stringify({
            model: Netlify.env.get("AI_MODEL") || "claude-sonnet-5-5",
            max_tokens: spec.max,
            system,
            messages: [{ role: "user", content: user }],
            output_config: { format: { type: "json_schema", schema: strict(SCHEMAS.lesson) } },
            stream: true,
          }),
        });
        if (!up.ok) {
          console.log("Anthropic error (news lesson)", up.status, (await up.text()).slice(0, 400));
          controller.enqueue(enc.encode(`data: ${JSON.stringify({ type: "error", error: { type: up.status === 529 ? "overloaded_error" : "api_error" } })}\n\n`));
        } else {
          const rd = up.body.getReader();
          for (;;) {
            const { done, value } = await rd.read();
            if (done) break;
            controller.enqueue(value);
          }
        }
      } catch (e) {
        controller.enqueue(enc.encode(`data: ${JSON.stringify({ type: "error", error: { type: "api_error" } })}\n\n`));
      }
      console.log(`Answered by Claude: news lesson (${brief ? "with news" : "news search failed, normal lesson"})`);
      controller.close();
    },
  });
  return new Response(stream, {
    headers: { "content-type": "text/event-stream", "cache-control": "no-store", "x-ai-left": String(left ?? ""), "x-ai-provider": "claude" },
  });
}

export const config = { path: "/api/ai", method: "POST" };
