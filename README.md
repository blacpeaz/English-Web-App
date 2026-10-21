# Miteny English

A mobile web app that teaches English to a Malagasy speaker, from beginner to advanced.

## What it does (step 1)

- **Level test**: 19 questions on vocabulary, grammar, reading, listening and speaking. Sets the starting level and the areas to focus on.
- **Lessons** (Levels 1–2, mixed topics): read and listen, tap words for Malagasy / French / sound guide, new words, questions with explanations, pronunciation practice.
- **Pronunciation check**: uses the browser's speech recognition (best in Chrome on Android; needs internet and microphone permission). Words turn green (clear) or red (practise again).
- **Difficult words** list for review.
- **Progress** saves automatically on the phone and backs up online (Netlify Function + Netlify Blobs).
- **Recovery code** (e.g. `mango-river-lemur-4821`): shown once to write down; type it on a new phone to restore everything. No login needed. Only a hash of the code is stored on the server.
- **Level-up tests** for Levels 1 and 2: unlock after finishing the level's lessons with a 70%+ average; 8/10 to move up.

## Files

- `index.html` — the whole app (HTML, CSS and JavaScript in one file)
- `manifest.webmanifest`, `icon.svg` — lets the app be added to the phone's home screen
- `netlify/functions/progress.mjs` — online backup API at `/api/progress`
- `package.json` — the storage library used by the backup function
- `netlify.toml` — Netlify settings (no build step)

## Coming next

- Step 3: AI teacher (new lessons, writing and speaking feedback), Levels 3–5

Malagasy translations should be checked by a native speaker.
