# Miteny English

A mobile web app that teaches English to a Malagasy speaker, from beginner to advanced.

## What it does (step 1)

- **Level test**: 19 questions on vocabulary, grammar, reading, listening and speaking, picked from a larger bank (easy, medium and hard in each part). Each retake gives questions not asked before, and the answers are in a new order. Sets the starting level and the areas to focus on.
- **Lessons** (Levels 1–2, mixed topics): read and listen, tap words for Malagasy / French / sound guide, new words, questions with explanations, pronunciation practice.
- **Pronunciation check**: uses the browser's speech recognition (best in Chrome on Android; needs internet and microphone permission). Words turn green (clear) or red (practise again).
- **Difficult words** list for review.
- **Progress** saves automatically on the phone and backs up online (Netlify Function + Netlify Blobs).
- **Recovery code** (e.g. `mango-river-lemur-4821`): shown once to write down; type it on a new phone to restore everything. No login needed. Only a hash of the code is stored on the server.
- **Level-up tests** for Levels 1 and 2: unlock after finishing the level's lessons with a 70%+ average; 8/10 to move up. Each attempt picks new questions from a bank, with the answers shuffled.

- **AI teacher** (Claude): writes new lessons on demand for any level (1–5), mixing topics and targeting the learner's difficult words, writing mistakes and hard sounds; corrects writing with explanations in English and Malagasy; gives pronunciation tips for missed words; writes level-up tests for Levels 3–4. Lessons it writes are saved on the phone and backed up.
- **Voice settings**: choose any English voice on the phone, plus voice height (pitch) and speed.

- **Daily words**: each day the AI teacher picks 4–10 new words for the learner's level (Malagasy, French, sound guide, 3 examples). The learner studies them as flashcards, then writes their own sentence with each word and taps **Check**; if it is wrong, the app shows the correct way to write it with an explanation in English and Malagasy (up to 3 tries per word). Learned words come back for review after 1, 2, 4, 7, 15 and 30 days. Works without AI too, using words from the lessons.
- **Own recovery code**: the learner can replace the random code with one they choose (6–40 letters, numbers or hyphens). The app refuses codes someone else already uses. One network can try at most 30 unknown codes a day, so codes cannot be guessed by trying many.

## Setup (Netlify environment variables)

| Variable | Needed | What it does |
|---|---|---|
| `ANTHROPIC_API_KEY` | yes | Key from console.anthropic.com for the AI teacher |
| `APP_PIN` | yes | Access PIN for the AI teacher (6+ characters). The learner types it once per phone. Wrong PINs are locked out after 10 tries per day. |
| `AI_MODEL` | no | Default `claude-sonnet-5-5` (lessons, writing, tests) |
| `AI_FAST_MODEL` | no | Default `claude-haiku-5-5` (speaking tips) |
| `AI_DAILY_LIMIT` | no | AI uses per learner per day (default 25) |
| `AI_GLOBAL_DAILY_LIMIT` | no | AI uses for the whole app per day (default 30) |
| `GEMINI_API_KEY` | no | Free Google Gemini key (aistudio.google.com). When set, daily words, sentence checks and speaking tips use Gemini first and fall back to Claude if it fails |
| `GEMINI_MODEL` | no | Default `gemini-3.8-flash` |
| `AI_LIGHT_DAILY_LIMIT` | no | Small checks (one sentence, speaking tips) per learner per day (default 60) |
| `AI_LIGHT_GLOBAL_DAILY_LIMIT` | no | Small checks for the whole app per day (default 100) |

## Files

- `index.html` — the whole app (HTML, CSS and JavaScript in one file)
- `manifest.webmanifest`, `icon.svg` — lets the app be added to the phone's home screen
- `netlify/functions/progress.mjs` — online backup API at `/api/progress`
- `netlify/edge-functions/ai.js` — AI teacher at `/api/ai` (streams Claude's answer; edge functions allow longer answers than normal functions)
- `netlify/functions/usage.mjs` — daily AI limit counter at `/api/usage`
- `netlify/shared/hash.mjs` — shared helpers
- `package.json` — the storage library used by the backup function
- `netlify.toml` — Netlify settings (no build step)


Malagasy translations should be checked by a native speaker.
