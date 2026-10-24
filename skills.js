/* Miteny English: skills practice (grammar path, speaking, role-plays, listening, professional writing,
   level-up checklist, talk-at-work topics). Loaded before the main script in index.html; it only defines
   data and functions, and uses the main script's helpers (S, save, aiCall, say, esc, view, host...) when called. */

/* ================= GRAMMAR PATH (CEFR-based, 12 points per level) ================= */
const GRAMMAR = {
  1: [
    ["be: am, is, are", "positive, negative and questions"],
    ["Present simple", "I work / she works; daily routines and facts"],
    ["Questions and negatives with do/does", "Do you…? She doesn't…"],
    ["There is / there are", "with a, some, any"],
    ["a, an, the", "first mention vs known things"],
    ["Plurals and this/that/these/those", "regular and irregular plurals"],
    ["Possessives", "my, your, his, her, our, their, 's"],
    ["can / can't", "ability and permission"],
    ["Prepositions of time and place", "in, on, at, next to, under"],
    ["Present continuous", "actions happening now"],
    ["have got / have", "possessions and family"],
    ["Imperatives and let's", "instructions and suggestions"],
  ],
  2: [
    ["Past simple: regular verbs", "worked, stayed; spelling and the -ed sound"],
    ["Past simple: irregular verbs and questions", "went, bought; Did you…?"],
    ["Future with going to", "plans and predictions with evidence"],
    ["Future with will", "decisions, offers, promises, predictions"],
    ["Comparatives and superlatives", "cheaper, more expensive, the best"],
    ["Countable and uncountable nouns", "some, any, much, many, a lot of, a few, a little"],
    ["Adverbs of frequency", "always, usually, sometimes, never: word order"],
    ["Present continuous for future plans", "I'm meeting the supplier on Monday"],
    ["must, have to, should", "obligation and advice"],
    ["Past continuous", "I was working when…"],
    ["Object and possessive pronouns", "me, him, them; mine, yours"],
    ["Linking words", "and, but, so, because, then, after that"],
  ],
  3: [
    ["Present perfect vs past simple", "experience and result vs finished time"],
    ["Present perfect with for, since, already, yet, just", "time expressions and word order"],
    ["First conditional", "If it rains, we will…; unless, as soon as"],
    ["Second conditional", "If I had…, I would…; unreal present"],
    ["Passive voice: present and past", "is made, was delivered, by"],
    ["Relative clauses", "who, which, that, where, whose"],
    ["used to", "past habits and states"],
    ["Gerunds and infinitives", "enjoy doing, decide to do, stop doing / stop to do"],
    ["Modals of possibility", "might, may, could, must, can't (present)"],
    ["Reported speech: statements", "He said that…; tense changes"],
    ["Past perfect", "had done; sequence of past events"],
    ["too, enough, so, such", "too expensive, not big enough, so busy, such a good price"],
  ],
  4: [
    ["Third conditional and regrets", "If I had known…, I would have…; wish, if only"],
    ["Mixed conditionals", "If I had studied, I would be…"],
    ["Reported questions and reporting verbs", "asked if…, suggest, deny, promise, warn"],
    ["Passive in all tenses and have something done", "is being checked, has been sent, we had the truck repaired"],
    ["Non-defining relative clauses", "commas, which referring to a whole idea"],
    ["Future continuous and future perfect", "will be working, will have finished"],
    ["Modals of deduction in the past", "must have, might have, can't have"],
    ["Present perfect continuous", "have been waiting; vs present perfect simple"],
    ["Contrast and concession", "although, even though, despite, in spite of, however, whereas"],
    ["Phrasal verbs", "separable and inseparable; common business phrasal verbs"],
    ["Articles in depth", "zero article, the with general vs specific, institutions"],
    ["Formal and polite language", "indirect questions, would you mind, could you possibly"],
  ],
  5: [
    ["Inversion for emphasis", "Not only…, Rarely…, Under no circumstances…, Had I known…"],
    ["Cleft sentences", "What we need is…, It was the price that…"],
    ["Participle clauses", "Having checked the stock, …; Given the delay, …"],
    ["Hedging and softening", "It seems that, tend to, arguably, to some extent"],
    ["Impersonal passive structures", "It is believed that…, X is said to…"],
    ["Nominalisation in formal writing", "decide → the decision to; reduce → a reduction in"],
    ["Subjunctive and formal structures", "I suggest that he be…, It's time we…, were I to…"],
    ["Advanced cohesion", "nevertheless, consequently, in light of, as a result of which"],
    ["Ellipsis and substitution", "so, do so, one, not; avoiding repetition"],
    ["Emphasis", "auxiliary do, intensifiers, fronting"],
    ["Business collocations and fixed expressions", "meet a deadline, raise concerns, in the long run"],
    ["Advanced modal meanings", "would for past habits, needn't have, should for unlikely events"],
  ],
};
const gid = (lv, i) => `g${lv}-${String(i + 1).padStart(2, "0")}`;
const gtopic = (id) => { const m = /^g(\d)-(\d\d)$/.exec(id); if (!m) return null; const g = GRAMMAR[+m[1]][+m[2] - 1]; return g ? { id, lv: +m[1], title: g[0], note: g[1] } : null; };
const gscore = (id) => (S.grammar && S.grammar[id] ? S.grammar[id].score : null);
const gmastered = (id) => (gscore(id) ?? 0) >= 70;
function grammarNext(lv) { lv = lv || S.level || 1; for (let i = 0; i < GRAMMAR[lv].length; i++) { const id = gid(lv, i); if (!gmastered(id)) return gtopic(id); } return null; }
function grammarFocus() { const g = grammarNext(); return g ? g.title : GRAMMAR[S.level || 1][Math.floor(Math.random() * 12)][0]; }

/* ================= SPEAKING ================= */
const SPEAK_Q = {
  1: ["What is your name, and where do you live?", "Tell me about your family.", "What do you do every morning before work?", "What is your favourite food? Why do you like it?", "Describe your workplace.", "What do you do at the weekend?", "What do you usually buy at the market?", "How do you go to work?", "What do you like about your job?", "Describe your house."],
  2: ["Tell me about your last holiday.", "What did you do yesterday after work?", "Describe a person you admire, and say why.", "What are your plans for next weekend?", "Compare your town now with ten years ago.", "What is a good customer? Give an example.", "How do you try to save money?", "What would you like to learn this year, and why?", "Tell me about a problem you had at work and what you did.", "Describe your best friend."],
  3: ["Is it better to work for a big company or a small business? Why?", "Describe a time you had to deal with a difficult customer.", "What are the advantages and disadvantages of mobile money?", "How has technology changed work in Madagascar?", "What would you do if you won ten million ariary?", "Explain how your company gets products from abroad to customers.", "What makes a good manager? Give examples.", "Talk about a goal you have for the next five years and your plan to reach it.", "Why is English useful for your job?", "Describe a mistake you made and what you learned from it.", "How can a small shop attract more customers?", "Should people borrow money to start a business? Why or why not?"],
  4: ["Some people say money cannot buy happiness. To what extent do you agree?", "Explain a process at your workplace and how it could be improved.", "Your supplier wants to raise prices by 20%. How would you respond?", "What are the biggest challenges for small businesses in Madagascar, and how could they be solved?", "Describe a difficult decision you made at work: the options, and why you chose one.", "Should companies let staff work from home? Discuss both sides.", "How should a company deal with a team member who is often late?", "Is it better to save or to invest? Explain with examples.", "What would you change if you managed your company for a year?", "How do imports of second-hand goods affect local businesses?"],
  5: ["Present your team's results for the last quarter and your plan for the next one.", "A key client is unhappy and may leave. What would you say to keep them?", "Argue for or against: 'Companies should spend more on training than on advertising.'", "Explain a complex problem at work to someone who knows nothing about it, and propose a solution.", "How should Madagascar develop its economy over the next twenty years? Give a reasoned view.", "Describe a leader you admire and analyse what makes them effective.", "Convince your manager to invest in a new stock-management system.", "What are the risks of growing a business too fast? Use examples.", "How do you handle pressure and tight deadlines? Give a detailed example.", "Evaluate the advantages and drawbacks of buying stock on credit."],
};
const ROLEPLAYS = {
  1: [
    { id: "r1a", title: "At the market", role: "a friendly fruit seller at Analakely market", learnerRole: "a customer", scenario: "The customer wants to buy fruit and rice and asks about prices.", goal: "the customer buys two items and pays" },
    { id: "r1b", title: "A new colleague", role: "a new colleague on their first day", learnerRole: "a worker who welcomes them", scenario: "Two colleagues meet for the first time at work.", goal: "both people know each other's name, job and where they live" },
    { id: "r1c", title: "Asking the way", role: "a person in the street in Antananarivo", learnerRole: "someone looking for the bank", scenario: "The learner asks how to get to the nearest bank.", goal: "the learner understands the directions" },
  ],
  2: [
    { id: "r2a", title: "At a restaurant", role: "a waiter in a restaurant", learnerRole: "a customer", scenario: "The customer orders lunch, asks about a dish and asks for the bill.", goal: "the customer orders and pays" },
    { id: "r2b", title: "Changing an appointment", role: "a clinic receptionist on the phone", learnerRole: "a patient", scenario: "The patient calls to move an appointment to another day.", goal: "a new day and time are agreed" },
    { id: "r2c", title: "A customer in the shop", role: "a customer looking for a jacket in a second-hand clothes shop", learnerRole: "the shop assistant", scenario: "The customer wants a jacket in a certain size and colour and asks for a discount.", goal: "the customer decides to buy or not" },
  ],
  3: [
    { id: "r3a", title: "A late delivery", role: "an annoyed customer whose order is three days late", learnerRole: "a customer service worker at a distribution company", scenario: "The customer calls to complain about a late delivery of furniture.", goal: "the customer is calm and a new delivery date is agreed" },
    { id: "r3b", title: "Booking transport", role: "a transport company employee", learnerRole: "a company worker who needs to send 40 bales of clothes to Mahajanga", scenario: "The learner books a truck and asks about price, date and insurance.", goal: "the transport is booked with a price and date" },
    { id: "r3c", title: "Asking for a day off", role: "the learner's manager, friendly but busy", learnerRole: "an employee", scenario: "The employee asks for a day off next week and explains why.", goal: "the manager agrees on a plan for the day off" },
    { id: "r3d", title: "A missing package", role: "a supplier's sales assistant in China, speaking English", learnerRole: "a buyer in Madagascar", scenario: "One package from the last shipment is missing.", goal: "the supplier agrees to check and to send it or give a refund" },
  ],
  4: [
    { id: "r4a", title: "Job interview", role: "an HR manager interviewing for an assistant manager job at a distribution company", learnerRole: "the candidate", scenario: "A real job interview with questions about experience, strengths, weaknesses and a difficult situation.", goal: "the interviewer has asked about five questions and closes the interview" },
    { id: "r4b", title: "Negotiating a price", role: "a supplier who does not want to give a discount easily", learnerRole: "a buyer who wants 10% off for a bigger order", scenario: "A price negotiation for a large order of used appliances.", goal: "both agree on a price and payment terms, or agree to talk again" },
    { id: "r4c", title: "Explaining a mistake", role: "the learner's manager, serious but fair", learnerRole: "an employee who sent the wrong products to a client", scenario: "The employee explains what went wrong and proposes how to fix it.", goal: "the manager accepts a plan to fix the problem" },
    { id: "r4d", title: "Planning a stock count", role: "a colleague in a team meeting who has different ideas", learnerRole: "the person leading the meeting", scenario: "The team plans a full stock count of the warehouse next weekend.", goal: "the date, tasks and responsibilities are agreed" },
  ],
  5: [
    { id: "r5a", title: "Presenting to the director", role: "a demanding company director who asks challenging questions", learnerRole: "a manager presenting quarterly results", scenario: "The learner presents sales results, explains a drop in one product line and proposes actions.", goal: "the director has questioned the numbers and accepts or rejects the plan" },
    { id: "r5b", title: "Contract negotiation", role: "an export manager from a Korean supplier", learnerRole: "the buyer from a Malagasy import company", scenario: "Negotiating a one-year contract: prices, payment terms, delivery times and penalties for delays.", goal: "the main terms are agreed or the remaining issues are clear" },
    { id: "r5c", title: "Keeping a key client", role: "an angry key client who is thinking of leaving after repeated late deliveries", learnerRole: "the account manager", scenario: "The learner must keep the client with a convincing plan and the right tone.", goal: "the client agrees to stay for a trial period, or clearly refuses" },
    { id: "r5d", title: "Senior job interview", role: "a panel interviewer for an operations manager position", learnerRole: "the candidate", scenario: "A senior interview with situational and strategic questions.", goal: "about five demanding questions have been asked and answered" },
    { id: "r5e", title: "Settling a disagreement", role: "two team members (you speak for both, one at a time) who disagree about a new process", learnerRole: "the manager leading the meeting", scenario: "The learner must listen, summarise both views and reach a decision.", goal: "a decision is made that both can accept" },
  ],
};

/* ================= LISTENING ================= */
const LISTEN_KINDS = {
  1: ["short conversation", "voicemail message", "shop announcement"],
  2: ["phone call", "conversation between friends", "radio advertisement", "instructions from a manager"],
  3: ["radio interview", "workplace conversation", "short news report", "podcast about money"],
  4: ["business meeting", "radio discussion with two opinions", "customer service call", "short talk by an expert"],
  5: ["panel discussion", "business news analysis", "negotiation", "talk about the economy"],
};

/* ================= WRITING ================= */
const WRITE_TASKS = {
  1: [
    { id: "w1a", genre: "Message", title: "Invite a friend", task: "Write a message to a friend. Invite them to lunch on Saturday. Say where and what time.", words: "30-50" },
    { id: "w1b", genre: "Note", title: "Back at 3 pm", task: "Write a short note to a colleague: you are going to the bank and you will be back at 3 pm. Ask them to answer the phone.", words: "25-40" },
    { id: "w1c", genre: "Description", title: "My working day", task: "Write about your daily routine at work.", words: "40-60" },
    { id: "w1d", genre: "Description", title: "My home", task: "Describe your house or your neighbourhood.", words: "40-60" },
    { id: "w1e", genre: "Message", title: "What we need", task: "Write a message to your manager. Say which products are finished in the shop and what you need.", words: "30-50" },
  ],
  2: [
    { id: "w2a", genre: "Email", title: "Change shifts", task: "Email a colleague. Ask if they can change shifts with you on Friday and give a reason.", words: "60-90" },
    { id: "w2b", genre: "Story", title: "A good day", task: "Write about a good day you had last month. What happened?", words: "80-110" },
    { id: "w2c", genre: "Message", title: "Thank a customer", task: "Thank a customer for buying from your shop and tell them about new products next week.", words: "60-90" },
    { id: "w2d", genre: "Email", title: "Reply to an invitation", task: "Reply to a wedding invitation. Say you can come and ask about the time, place and dress code.", words: "50-80" },
    { id: "w2e", genre: "Instructions", title: "Opening the shop", task: "Explain to a new worker how to open the shop in the morning, step by step.", words: "70-100" },
    { id: "w2f", genre: "Description", title: "My week's spending", task: "Write about how you spend your money in a normal week, and one thing you want to change.", words: "70-100" },
  ],
  3: [
    { id: "w3a", genre: "Email: request", title: "Prices and delivery", task: "Email a supplier in China. Ask for prices and delivery times for 200 bales of second-hand clothes, and ask about payment.", words: "120-160" },
    { id: "w3b", genre: "Email: complaint", title: "Damaged products", task: "Some products you received were damaged. Write to the supplier, explain the problem clearly and ask for a solution.", words: "120-160" },
    { id: "w3c", genre: "Opinion", title: "Bank or mobile money?", task: "Is it better to keep savings in a bank or with mobile money? Give your opinion with reasons and examples.", words: "150-200" },
    { id: "w3d", genre: "Short report", title: "Last week's sales", task: "Write a short report for your manager about last week's sales: what sold well, what did not, and why.", words: "150-200" },
    { id: "w3e", genre: "Email: customer", title: "A late delivery", task: "A customer writes that their delivery is late. Reply politely, explain the reason and give a new date.", words: "100-140" },
    { id: "w3f", genre: "Story", title: "A problem I solved", task: "Write about a problem you solved at work: what happened, what you did and the result.", words: "150-200" },
    { id: "w3g", genre: "Formal letter", title: "Savings account", task: "Write to a bank to ask for information about a savings account: interest, fees and how to open one.", words: "100-140" },
  ],
  4: [
    { id: "w4a", genre: "Formal complaint", title: "Lost shipment", task: "A transport company lost part of your shipment. Write a formal complaint with the facts and ask for compensation.", words: "180-240" },
    { id: "w4b", genre: "Report", title: "Reducing warehouse costs", task: "Write a report on how to reduce costs in the warehouse. Use headings and give three recommendations.", words: "220-280" },
    { id: "w4c", genre: "Proposal", title: "A new product line", task: "Propose a new product line for the shop to your manager: why, the costs and the expected profit.", words: "220-280" },
    { id: "w4d", genre: "Essay", title: "Online or in a shop?", task: "Write a for-and-against essay: selling online vs selling in a shop for a small business in Antananarivo.", words: "220-280" },
    { id: "w4e", genre: "Cover letter", title: "Assistant manager", task: "Write a cover letter applying for a job as an assistant manager at a distribution company.", words: "200-260" },
    { id: "w4f", genre: "Meeting summary", title: "Team meeting", task: "Write a summary of a team meeting: the decisions, who will do what, and the deadlines.", words: "160-220" },
    { id: "w4g", genre: "Negotiation email", title: "Better terms", task: "Ask a supplier for a 10% discount for a bigger order and better payment terms. Be polite but firm.", words: "160-220" },
  ],
  5: [
    { id: "w5a", genre: "Business proposal", title: "A second warehouse", task: "Propose opening a second warehouse in Toamasina: the market, costs, risks and your recommendation.", words: "300-400" },
    { id: "w5b", genre: "Analytical report", title: "Why sales fell", task: "Sales fell by 15% this quarter. Analyse the possible causes and recommend actions.", words: "300-400" },
    { id: "w5c", genre: "Persuasive article", title: "Keep proper accounts", task: "Write an article for a business magazine: why every small business in Madagascar should keep proper accounts.", words: "300-380" },
    { id: "w5d", genre: "Executive summary", title: "Importing from Korea", task: "Write an executive summary of a project to import more furniture from Korea, for busy directors.", words: "180-250" },
    { id: "w5e", genre: "Client email", title: "An angry client", task: "Reply to an angry client who threatens to stop working with you after repeated late deliveries.", words: "220-300" },
    { id: "w5f", genre: "Company policy", title: "Cash and mobile money", task: "Write a short company policy on how staff must handle cash and mobile money payments.", words: "250-350" },
    { id: "w5g", genre: "Performance review", title: "A team member", task: "Write a balanced performance review for a team member: strengths, areas to improve and goals.", words: "250-350" },
  ],
};

/* ================= TALK AT WORK (daily topic to discuss in English with the manager) ================= */
const TALK = {
  1: ["What did you eat for breakfast?", "How did you come to work today?", "What is your favourite day of the week? Why?", "What do you need for the shop today?", "What is the weather like?", "What do you do after work?", "Who is in your family?"],
  2: ["What did you do last weekend?", "What are your plans for this weekend?", "Which product sold best this week?", "What was difficult at work yesterday?", "Describe a customer you helped today.", "What would you like to buy this year?", "How do you save money?"],
  3: ["What could we do better in the warehouse?", "Tell me about a customer problem and how you solved it.", "If you had more time at work, what would you do?", "What have you learned this week?", "Which supplier is the most reliable and why?", "What do you think about our prices compared to other shops?", "What is your plan for this month?"],
  4: ["What should our priorities be this month, and why?", "Explain a problem from today and two possible solutions.", "Summarise this week's sales and what they tell us.", "How could we reduce our costs without losing customers?", "What would you say to a client who wants a big discount?", "What did you learn from your last money lesson?", "What risks do you see for the business this year?"],
  5: ["Brief me on this week's results in two minutes.", "Make a case for one investment the business should make.", "How would you handle our most difficult client?", "What would you change in our processes, and how would you measure success?", "Compare two suppliers and recommend one.", "What is your view on growing the business next year?", "Present one idea to increase profit, with numbers."],
};
const LEVEL_KINDS = { 3: ["Conversation", "Story", "Article", "Interview", "Email exchange", "Report", "Opinion article"], 4: ["Article", "Interview", "Report", "Opinion article", "Meeting", "Email exchange", "Case study", "Discussion"], 5: ["Article", "Report", "Opinion article", "Case study", "Meeting", "Interview", "Discussion", "Speech"] };

/* ================= SHARED HELPERS ================= */
const SK = { g: null, sp: null, rp: null, ls: null, wr: null, rec: null };
function skPush(kind, score, extra) {
  S.sk = S.sk || {};
  S.sk[kind] = S.sk[kind] || [];
  S.sk[kind].push(Object.assign({ lv: S.level || 1, s: Math.round(score), at: today() }, extra || {}));
  if (S.sk[kind].length > 300) S.sk[kind] = S.sk[kind].slice(-300);
  markDay();
  save();
}
function skAt(kinds, lv) { lv = lv || S.level || 1; return [].concat(...kinds.map((k) => ((S.sk || {})[k] || []).filter((x) => x.lv === lv))); }
const skAvg = (a) => (a.length ? Math.round(a.reduce((x, y) => x + y.s, 0) / a.length) : 0);
function skTop(title, back) { return `<div class="top"><button class="x" data-act="${back || "home"}" aria-label="Back">${ICON.x}</button><p class="kicker" style="margin:0">${esc(title)}</p></div>`; }
const wc = (t) => (String(t).trim().match(/\S+/g) || []).length;
function normAns(x) {
  return String(x || "").toLowerCase().replace(/[’`]/g, "'").replace(/won't/g, "will not").replace(/can't/g, "can not").replace(/cannot/g, "can not")
    .replace(/n't/g, " not").replace(/'m\b/g, " am").replace(/'re\b/g, " are").replace(/'ll\b/g, " will").replace(/'ve\b/g, " have")
    .replace(/[.!?,;:"]/g, " ").replace(/\s+/g, " ").trim();
}
function rubricBars(r, labels) {
  return `<div class="rub">${labels.map(([k, lab]) => { const v = Math.max(0, Math.min(5, parseInt(r && r[k], 10) || 0)); return `<span>${lab}</span><div class="meter"><i class="${v < 3 ? "low" : ""}" style="width:${v * 20}%"></i></div><b>${v}/5</b>`; }).join("")}</div>`;
}
function mistakesHTML(ms) { return (ms || []).slice(0, 8).map((m) => `<div class="mist"><span><s>${esc(m.wrong)}</s> → <b>${esc(m.right)}</b></span><span>${esc(m.why)}</span><span class="mg">${esc(m.mg)}</span>${frs(m.fr)}</div>`).join(""); }

/* ================= HOME: TILES, TALK CARD, CHECKLIST ================= */
function skillsTiles() {
  if (!S.placement) return "";
  const lv = S.level || 1, gn = grammarNext(lv), gdone = GRAMMAR[lv].filter((g, i) => gmastered(gid(lv, i))).length;
  const sp = skAt(["speak", "role"]), li = skAt(["listen"]), wr = skAt(["write"]);
  const tile = (act, name, mg, line, sub) => `<button class="tile" data-act="${act}"><b>${name}</b><span class="mg" style="margin:0">${mg}</span><span class="tline">${line}</span><small>${sub}</small></button>`;
  return `<section class="stack tight"><p class="kicker">Practise your skills · Fanazarana</p><div class="tiles">
    ${tile("sk-grammar", "Grammar", "Fitsipi-pitenenana", gn ? esc(gn.title) : "All Level " + lv + " topics done", `${gdone}/12 mastered at Level ${lv}`)}
    ${tile("sk-speak", "Speaking", "Fitenenana", "Answer questions, role-plays", `${sp.length} at this level${sp.length ? " · avg " + skAvg(sp) + "%" : ""}`)}
    ${tile("sk-listen", "Listening", "Fihainoana", "Hear first, then read", `${li.length} at this level${li.length ? " · avg " + skAvg(li) + "%" : ""}`)}
    ${tile("sk-write", "Writing", "Fanoratana", "Emails, reports, essays", `${wr.length} at this level${wr.length ? " · avg " + skAvg(wr) + "%" : ""}`)}
  </div></section>`;
}
function talkCard() {
  if (!S.placement) return "";
  const lv = S.level || 1, list = TALK[lv], d = Math.floor(Date.now() / 86400000), q = list[d % list.length], done = (S.talks || []).includes(today());
  return `<section class="panel stack tight"><p class="kicker">Talk in English at work today</p><h3>“${esc(q)}”</h3>
   <p class="muted" style="font-size:.9rem">Ask or answer this with your manager, in English only. Give a reason and an example.<span class="mg">Resaho amin'ny teny anglisy amin'ny mpitantana anao ity fanontaniana ity.</span></p>
   ${done ? '<span class="chip ok" style="align-self:flex-start">Done today ✓</span>' : '<button class="btn ghost" data-act="sk-talked" style="align-self:flex-start">We talked about it</button>'}</section>`;
}
/* Level-up needs all four skills and the grammar of the level (from Level 3 up). */
function levelChecklist(lv) {
  lv = lv || S.level || 1;
  const les = ALL().filter((l) => l.level === lv && S.lessons[l.id]), lesAvg = les.length ? Math.round(les.reduce((a, l) => a + S.lessons[l.id].q, 0) / les.length) : 0;
  const g = GRAMMAR[lv].filter((x, i) => gmastered(gid(lv, i))).length;
  const sp = skAt(["speak", "role"], lv), li = skAt(["listen"], lv), wr = skAt(["write"], lv);
  const items = [
    { label: "Reading lessons", have: les.length, need: 4, avg: lesAvg, min: 70 },
    { label: "Grammar topics mastered", have: g, need: 10 },
    { label: "Speaking sessions", have: sp.length, need: 4, avg: skAvg(sp), min: 60 },
    { label: "Listening lessons", have: li.length, need: 3, avg: skAvg(li), min: 60 },
    { label: "Writing tasks", have: wr.length, need: 3, avg: skAvg(wr), min: 60 },
  ];
  items.forEach((it) => { it.ok = it.have >= it.need && (it.min ? it.avg >= it.min : true); });
  return { items, ready: items.every((it) => it.ok) };
}
function checklistHTML(c) {
  return `<div class="checks">${c.items.map((it) => `<div class="chk${it.ok ? " ok" : ""}"><span>${it.ok ? "✓" : "○"}</span><span>${it.label}</span><b>${Math.min(it.have, it.need)}/${it.need}${it.min ? ` · ${it.have ? "avg " + it.avg + "%" : "no score yet"}` : " · 70% each"}</b></div>`).join("")}</div>
   <p class="muted" style="font-size:.82rem">Average needed: 70% for reading lessons, 60% for speaking, listening and writing. A grammar topic counts when you score 70% or more on it.<span class="mg">Ny salanisa ilaina: 70% amin'ny famakiana, 60% amin'ny fitenenana, fihainoana ary fanoratana. Isaina ny lohahevitra fitsipi-pitenenana rehefa mahazo 70% farafahakeliny.</span></p>`;
}

/* ================= GRAMMAR SCREENS ================= */
function grammarHome(showLv) {
  window.scrollTo(0, 0);
  const lv = S.level || 1, sel = showLv || lv;
  const rows = GRAMMAR[sel].map((g, i) => { const id = gid(sel, i), sc = gscore(id); return `<button class="les${gmastered(id) ? " done" : ""}" data-act="sk-gopen" data-id="${id}"><span class="n">${gmastered(id) ? "✓" : i + 1}</span><span class="t"><b>${esc(g[0])}</b><small>${esc(g[1])}</small></span>${sc !== null ? `<span class="s">${sc}%</span>` : ""}</button>`; }).join("");
  view.innerHTML = skTop("Grammar path · Fitsipi-pitenenana") + `<div class="stack">
   <div><h1>Level ${sel} grammar</h1><p class="muted">${sel === lv ? "Master 10 of these 12 topics (70% or more) to unlock your level-up test." : "Review topics from another level."}<span class="mg">Fehezo ny lohahevitra 10 amin'ireo 12 ireo.</span></p></div>
   <div class="stack tight"><p class="kicker">Level</p><div class="lvchips">${[1, 2, 3, 4, 5].map((n) => `<button class="btn toggle" data-act="sk-glevel" data-lv="${n}" aria-pressed="${n === sel}" aria-label="Level ${n}">${n}</button>`).join("")}</div></div>
   <div class="stack tight">${rows}</div></div>`;
}
async function openGrammar(id) {
  const t = gtopic(id); if (!t) return;
  S.gcache = S.gcache || {};
  let c = S.gcache[id];
  if (!c) {
    showLoading(`Preparing: ${t.title}`, "Manomana ny lesona momba ny fitsipi-pitenenana ny mpampianatra AI.", 6000);
    try {
      const r = await aiCall("grammar", { level: t.lv, title: t.title, note: t.note, mistakes: (S.mistakes || []).slice(0, 10) }, loadingProgress);
      const ex = (r.exercises || []).filter((e) => e.q && (e.t === "mc" ? Array.isArray(e.o) && e.o.length >= 2 && Number.isInteger(e.a) && e.a >= 0 && e.a < e.o.length : Array.isArray(e.answers) && e.answers.length));
      if (ex.length < 6) throw new AIError("default");
      c = { title: String(r.title || t.title), en: String(r.summary_en || ""), mg: String(r.summary_mg || ""), fr: String(r.summary_fr || ""), rules: (r.rules || []).slice(0, 6), examples: (r.examples || []).slice(0, 6), mistakes: (r.mistakes || []).slice(0, 5), ex, produce: r.produce || { task: "Write 2 sentences using this grammar.", mg: "" } };
      S.gcache[id] = c; save();
    } catch (e) { return aiFailed(e); }
  }
  SK.g = { id, t, c, step: 0, i: 0, right: 0, answered: false, pick: null, typed: "", sent: [{}, {}] };
  renderGrammar();
}
function renderGrammar() {
  window.scrollTo(0, 0); if (TTS) speechSynthesis.cancel();
  const g = SK.g, c = g.c, steps = ["Learn", "Practise", "Use it", "Finish"];
  let h = `<div class="top"><button class="x" data-act="sk-grammar" aria-label="Back">${ICON.x}</button><div class="steps">${steps.map((s, i) => `<span class="${i < g.step ? "done" : i === g.step ? "now" : ""}">${s}</span>`).join("")}</div></div>`;
  if (g.step === 0) {
    h += `<div class="stack"><div><p class="kicker">Level ${g.t.lv} grammar</p><h1 style="margin-top:6px">${esc(c.title)}</h1></div>
     <section class="panel stack tight"><p>${esc(c.en)}</p><span class="mg">${esc(c.mg)}</span>${frs(c.fr)}</section>
     <section class="stack tight"><p class="kicker">How to make it</p>${c.rules.map((r) => `<div class="rule"><b>${esc(r.rule)}</b><span>${esc(r.example)}</span></div>`).join("")}</section>
     <section class="stack tight"><p class="kicker">Examples · Ohatra</p><ul class="exs">${c.examples.map((x, i) => `<li><button class="say" data-act="sk-gsay" data-i="${i}" aria-label="Listen">${ICON.spk}</button><span>${esc(x.en)}<span class="mg">${esc(x.note)}</span></span></li>`).join("")}</ul></section>
     ${c.mistakes.length ? `<section class="stack tight"><p class="kicker">Common mistakes · Fahadisoana mahazatra</p>${mistakesHTML(c.mistakes)}</section>` : ""}
     <button class="btn primary" data-act="sk-gnext">Practise · Hanazatra (${c.ex.length} exercises)</button></div>`;
  } else if (g.step === 1) {
    const e = c.ex[g.i], n = c.ex.length;
    h += `<div class="stack"><div class="row" style="justify-content:space-between"><p class="kicker">Exercise ${g.i + 1} of ${n} · ${e.t === "mc" ? "Choose" : e.t === "gap" ? "Fill the gap" : "Correct the mistake"}</p><span class="muted" style="font-size:.85rem">${g.right} correct</span></div>
     <h2>${esc(e.q)}</h2>`;
    if (e.t === "mc") {
      h += `<div class="opts">${e.o.map((o, i) => { let cl = ""; if (g.answered) { if (i === e.a) cl = " right"; else if (i === g.pick) cl = " wrong"; } return `<button class="opt${cl}" data-act="sk-gmc" data-i="${i}" ${g.answered ? "disabled" : ""}>${esc(o)}</button>`; }).join("")}</div>`;
    } else {
      h += `<label for="gAns" class="muted" style="font-size:.9rem">${e.t === "gap" ? "Type the missing word(s)" : "Write the correct sentence"}</label>
       <${e.t === "fix" ? "textarea" : "input"} id="gAns" class="${e.t === "fix" ? "textarea" : "input"}" ${e.t === "fix" ? 'style="min-height:80px"' : ""} autocomplete="off" autocapitalize="off" spellcheck="false" ${g.answered ? "readonly" : ""}>${e.t === "fix" ? esc(g.typed || e.q) : ""}${e.t === "fix" ? "</textarea>" : ""}
       ${g.answered ? "" : '<button class="btn primary" data-act="sk-gtype">Check · Hamarino</button>'}`;
    }
    if (g.answered) {
      h += `<div class="fb ${g.ok ? "ok" : "no"}"><b>${g.ok ? "Correct!" : "Not quite."}</b>${!g.ok && e.t !== "mc" ? `<p><b>Answer:</b> ${esc(e.answers[0])}</p>` : ""}<p>${esc(e.why)}<span class="mg">${esc(e.mg)}</span>${frs(e.fr)}</p></div>
       <button class="btn primary" data-act="sk-gex">${g.i === n - 1 ? "Next: use it" : "Next exercise"}</button>`;
    }
    h += `</div>`;
  } else if (g.step === 2) {
    h += `<div class="stack"><div><p class="kicker">Use it · Ampiasao</p><h2>${esc(c.produce.task)}</h2><span class="mg">${esc(c.produce.mg)}</span>${frs(c.produce.fr)}</div>
     ${[0, 1].map((k) => { const st = g.sent[k]; return `<section class="panel stack tight"><label for="gS${k}"><b>Sentence ${k + 1}</b></label>
       <textarea id="gS${k}" class="textarea" style="min-height:70px" ${st.res ? "readonly" : ""}>${esc(st.text || "")}</textarea>
       <div aria-live="polite">${st.res ? (st.res.correct ? `<div class="fb ok"><b>Correct!</b><p>${esc(st.res.why)}<span class="mg">${esc(st.res.mg)}</span>${frs(st.res.fr)}</p></div>` : `<div class="fb no"><b>Not quite</b><p>${esc(st.res.why)}<span class="mg">${esc(st.res.mg)}</span>${frs(st.res.fr)}</p></div><p class="corr">${esc(st.res.corrected)}</p>`) : st.err ? `<p class="muted">${esc(st.err)}</p>` : ""}</div>
       ${st.res ? "" : `<button class="btn" data-act="sk-gcheck" data-k="${k}">${st.err ? "Check again" : "Check"}</button>`}</section>`; }).join("")}
     <button class="btn primary" data-act="sk-gnext">Finish · Vita</button></div>`;
  } else {
    const exScore = g.right / c.ex.length, useOk = g.sent.filter((x) => x.res && x.res.correct).length, used = g.sent.filter((x) => x.res).length;
    const score = Math.round(100 * (used ? exScore * 0.8 + (useOk / 2) * 0.2 : exScore));
    if (!g.saved) { S.grammar = S.grammar || {}; const prev = S.grammar[g.id]; S.grammar[g.id] = { score: Math.max(score, prev ? prev.score : 0), at: today(), tries: (prev ? prev.tries : 0) + 1 }; markDay(); save(); g.saved = true; }
    h += `<div class="stack" style="text-align:center;align-items:center"><p class="kicker">${esc(c.title)}</p><span class="score-ring">${score}%</span>
     <h2>${score >= 70 ? "Mastered ✓" : "Not mastered yet"}</h2><p class="muted">${g.right}/${c.ex.length} exercises · ${useOk}/2 own sentences correct${score < 70 ? ". Read the rules again and repeat to reach 70%." : ""}<span class="mg">${score >= 70 ? "Voafehy!" : "Avereno mba hahatratra 70%."}</span></p></div>
     <div class="stack" style="margin-top:18px">${(() => { const nx = grammarNext(g.t.lv); return nx ? `<button class="btn primary" data-act="sk-gopen" data-id="${nx.id}">Next topic: ${esc(nx.title)}</button>` : ""; })()}
     <button class="btn" data-act="sk-grammar" style="width:100%;min-height:50px">Back to the grammar path</button></div>`;
  }
  view.innerHTML = h;
}
async function grammarCheckSentence(k) {
  const g = SK.g, st = g.sent[k], box = document.getElementById("gS" + k), text = box.value.trim();
  st.text = box.value;
  if (wc(text) < 3) { st.err = "Write a full sentence first."; return renderGrammar(); }
  try {
    const r = await aiCall("sentence", { level: g.t.lv, grammar: g.c.title, task: g.c.produce.task, sentence: text });
    st.res = { correct: !!r.correct, corrected: String(r.corrected || ""), why: String(r.why || ""), mg: String(r.mg || ""), fr: String(r.fr || "") }; st.err = null;
    if (!st.res.correct && st.res.corrected) S.mistakes = [`${text} → ${st.res.corrected}`, ...(S.mistakes || [])].slice(0, 20);
  } catch (e) { st.err = aiMsg(e)[0] + " Your sentence is kept; try again."; }
  renderGrammar();
}

/* ================= SPEECH CAPTURE (long answers) ================= */
function canListen() { return !!(window.SpeechRecognition || window.webkitSpeechRecognition); }
function startCapture(onText, onStop) {
  const SRc = window.SpeechRecognition || window.webkitSpeechRecognition;
  const r = new SRc(); r.lang = "en-US"; r.continuous = true; r.interimResults = true;
  const cap = { r, finals: "", stopped: false, started: Date.now(), err: null };
  r.onresult = (e) => { let interim = ""; for (let i = e.resultIndex; i < e.results.length; i++) { const t = e.results[i][0].transcript; if (e.results[i].isFinal) cap.finals += t.trim() + " "; else interim += t; } onText(cap.finals, interim); };
  r.onerror = (e) => { if (["not-allowed", "service-not-allowed", "audio-capture"].includes(e.error)) { cap.err = "mic"; cap.stopped = true; } };
  // Phones stop listening after a short silence; start again until the learner taps Stop.
  r.onend = () => { if (!cap.stopped) { try { r.start(); return; } catch (x) {} } onStop(cap); };
  try { r.start(); } catch (x) { cap.stopped = true; cap.err = "start"; onStop(cap); }
  SK.rec = cap; return cap;
}
function stopCapture() { const c = SK.rec; if (!c) return; c.stopped = true; try { c.r.stop(); } catch (x) {} }
function captureBlock(id, placeholder) {
  return `<div class="stack tight">${canListen() ? `<button class="btn big mic" data-act="sk-rec" data-for="${id}">${ICON.mic} Record my answer</button><p class="muted" style="font-size:.85rem;text-align:center">Tap, speak, then tap again to stop. You can fix words it heard wrong.</p>` : `<p class="inst">This browser cannot hear you. Use Chrome on an Android phone, or type what you would say.</p>`}
   <textarea id="${id}" class="textarea" style="min-height:120px" placeholder="${esc(placeholder)}"></textarea><p class="muted" id="${id}Live" style="font-size:.85rem"></p></div>`;
}
function toggleRecord(btn) {
  const id = btn.dataset.for, box = document.getElementById(id), live = document.getElementById(id + "Live");
  if (SK.rec && !SK.rec.stopped) { stopCapture(); return; }
  const before = box.value.trim() ? box.value.trim() + " " : "";
  btn.classList.add("on"); btn.innerHTML = ICON.mic + " Listening… tap to stop";
  const timer = setInterval(() => { if (SK.rec && !SK.rec.stopped && live) live.textContent = `Recording · ${Math.round((Date.now() - SK.rec.started) / 1000)} s`; }, 1000);
  startCapture((fin, interim) => { box.value = before + fin + interim; }, (cap) => {
    clearInterval(timer); btn.classList.remove("on"); btn.innerHTML = ICON.mic + " Record more";
    box.value = (before + cap.finals).trim();
    SK.seconds = (SK.seconds || 0) + Math.round((Date.now() - cap.started) / 1000);
    if (live) live.textContent = cap.err === "mic" ? "The microphone is blocked. Allow it in Chrome, or type your answer." : `${wc(box.value)} words · ${SK.seconds} s`;
  });
}

/* ================= SPEAKING SCREENS ================= */
function speakHome() {
  window.scrollTo(0, 0); stopCapture();
  const lv = S.level || 1, done = new Set(((S.sk || {}).speak || []).map((x) => x.q));
  const qs = SPEAK_Q[lv].map((q, i) => `<button class="les${done.has(q) ? " done" : ""}" data-act="sk-sq" data-i="${i}"><span class="n">${done.has(q) ? "✓" : i + 1}</span><span class="t"><b>${esc(q)}</b></span></button>`).join("");
  const rps = (ROLEPLAYS[lv] || []).map((r) => { const n = ((S.sk || {}).role || []).filter((x) => x.id === r.id).length; return `<button class="les${n ? " done" : ""}" data-act="sk-rp" data-id="${r.id}"><span class="n">${n ? "✓" : "▶"}</span><span class="t"><b>${esc(r.title)}</b><small>You are ${esc(r.learnerRole)}</small></span></button>`; }).join("");
  view.innerHTML = skTop("Speaking · Fitenenana") + `<div class="stack">
   <div><h1>Speak in your own words</h1><p class="muted">Answer a question aloud, or have a conversation with the AI teacher. You get feedback on grammar, words and how well you answered.<span class="mg">Valio amin'ny feonao ny fanontaniana, na miresaha amin'ny mpampianatra AI.</span></p></div>
   <section class="stack tight"><p class="kicker">Role-plays · Lalao an-tsehatra</p>${rps}</section>
   <section class="stack tight"><p class="kicker">Answer a question · Valio ny fanontaniana</p>${qs}</section></div>`;
}
function openSpeakQ(q) {
  SK.sp = { q, fb: null }; SK.seconds = 0; window.scrollTo(0, 0);
  const lv = S.level || 1, target = [0, 20, 35, 60, 90, 120][lv];
  view.innerHTML = skTop("Speaking · Answer a question", "sk-speak") + `<div class="stack">
   <div class="row" style="flex-wrap:nowrap;align-items:flex-start"><h2 style="flex:1">${esc(q)}</h2><button class="say" data-act="sk-sayq" aria-label="Listen">${ICON.spk}</button></div>
   <p class="inst">Think for a few seconds. Then speak for about ${target >= 90 ? "1–2 minutes" : target >= 60 ? "1 minute" : "30 seconds"} (${target}+ words). Give reasons and examples.<span class="mg">Eritrereto aloha, dia miteny. Omeo antony sy ohatra.</span></p>
   ${captureBlock("spAns", "Your answer appears here…")}
   <button class="btn primary" data-act="sk-spfb">Get feedback · Hijery ny valiny</button><div id="spRes" aria-live="polite"></div></div>`;
  say(q, false);
}
async function speakFeedback() {
  stopCapture();
  const box = document.getElementById("spAns"), text = box.value.trim(), res = document.getElementById("spRes");
  if (wc(text) < 5) { res.innerHTML = '<p class="muted">Say (or type) a little more first.</p>'; return; }
  const btn = view.querySelector('[data-act="sk-spfb"]'); btn.disabled = true; btn.textContent = "The teacher is listening…";
  try {
    const r = await aiCall("speakfb", { level: S.level || 1, question: SK.sp.q, answer: text, seconds: SK.seconds || 0 });
    const score = Math.max(0, Math.min(100, parseInt(r.score, 10) || 0));
    skPush("speak", score, { q: SK.sp.q });
    (r.mistakes || []).slice(0, 4).forEach((m) => { S.mistakes = [`${m.wrong} → ${m.right}`, ...(S.mistakes || [])].slice(0, 20); });
    SK.sp.fb = r; save();
    view.innerHTML = skTop("Speaking · Feedback", "sk-speak") + `<div class="stack">
     <div style="text-align:center"><span class="score-ring">${score}%</span><p class="muted">${wc(text)} words${SK.seconds ? ` · ${SK.seconds} s` : ""}</p></div>
     ${rubricBars(r.rubric, [["task", "Answer"], ["grammar", "Grammar"], ["vocabulary", "Vocabulary"], ["fluency", "Fluency"]])}
     <div class="fb ok"><b>Good</b><p>${esc(r.good)}</p></div>
     <p class="kicker">What you said, corrected</p><div class="row" style="flex-wrap:nowrap;align-items:flex-start"><p class="corr" style="flex:1;min-width:0">${esc(r.corrected)}</p><button class="say" data-act="sk-saytext" data-t="corrected" aria-label="Listen">${ICON.spk}</button></div>
     ${(r.mistakes || []).length ? `<p class="kicker">Mistakes to learn from</p>${mistakesHTML(r.mistakes)}` : ""}
     <p class="kicker">A stronger answer · Valiny tsara kokoa</p><div class="row" style="flex-wrap:nowrap;align-items:flex-start"><p class="corr" style="flex:1;min-width:0;background:var(--gold-soft)">${esc(r.model)}</p><button class="say" data-act="sk-saytext" data-t="model" aria-label="Listen">${ICON.spk}</button></div>
     <p class="tip">${esc(r.tip)}<span class="mg">${esc(r.tip_mg)}</span>${frs(r.tip_fr)}</p>
     ${r.follow_up ? `<button class="btn primary" data-act="sk-follow">Answer the follow-up: “${esc(r.follow_up)}”</button>` : ""}
     <button class="btn" data-act="sk-speak" style="width:100%;min-height:50px">Back to speaking</button></div>`;
    window.scrollTo(0, 0);
  } catch (e) { const m = aiMsg(e); res.innerHTML = `<p class="muted">${esc(m[0])} Your answer is kept; tap again when ready.<span class="mg">${esc(m[1])}</span></p>`; btn.disabled = false; btn.textContent = "Get feedback · Hijery ny valiny"; }
}

/* Role-play */
function openRoleplay(id) {
  const lv = S.level || 1, r = (ROLEPLAYS[lv] || []).concat(...Object.values(ROLEPLAYS)).find((x) => x.id === id); if (!r) return;
  SK.rp = { r, history: [], corrections: [], ended: false, busy: false };
  window.scrollTo(0, 0);
  view.innerHTML = skTop("Role-play · " + r.title, "sk-speak") + `<div class="stack">
   <h1>${esc(r.title)}</h1>
   <section class="panel stack tight"><p><b>The situation:</b> ${esc(r.scenario)}</p><p><b>You are:</b> ${esc(r.learnerRole)}</p><p><b>The teacher plays:</b> ${esc(r.role)}</p><p><b>Your goal:</b> ${esc(r.goal)}</p></section>
   <p class="muted" style="font-size:.9rem">Speak (or type) your answers. After each answer you see a better way to say it if needed.<span class="mg">Miteny na manorata. Aseho anao ny fomba tsara kokoa raha ilaina.</span></p>
   <button class="btn primary" data-act="sk-rpstart">Start the conversation · Atombohy</button></div>`;
}
function renderRoleplay() {
  const rp = SK.rp;
  const bubbles = rp.history.map((t, i) => {
    const c = t.who === "me" ? rp.corrections[i] : null;
    return `<div class="bubble ${t.who === "me" ? "me" : "ai"}"><span>${esc(t.text)}</span>${t.who === "ai" ? `<button class="say" data-act="sk-rpsay" data-i="${i}" aria-label="Listen">${ICON.spk}</button>` : ""}</div>${c ? `<div class="bfix"><b>Better:</b> ${esc(c.better)}<span>${esc(c.why)}</span><span class="mg">${esc(c.mg)}</span>${frs(c.fr)}</div>` : ""}`;
  }).join("");
  view.innerHTML = skTop("Role-play · " + rp.r.title, "sk-speak") + `<div class="stack"><div class="chat">${bubbles}${rp.busy ? '<div class="bubble ai"><span class="dots"><i></i><i></i><i></i></span></div>' : ""}</div>
   ${rp.ended ? `<button class="btn primary" data-act="sk-rpend">See my results</button>` : rp.busy ? "" : `${captureBlock("rpAns", "Your reply…")}<button class="btn primary" data-act="sk-rpsend">Send · Alefa</button><button class="link" data-act="sk-rpend" style="align-self:center">Finish the conversation</button>`}
   <div id="rpErr" aria-live="polite"></div></div>`;
  const last = view.querySelector(".chat"); if (last && last.lastElementChild && last.lastElementChild.scrollIntoView) last.lastElementChild.scrollIntoView({ block: "end" });
}
async function roleplayTurn(text) {
  const rp = SK.rp; stopCapture();
  if (text) rp.history.push({ who: "me", text });
  rp.busy = true; renderRoleplay();
  try {
    const r = await aiCall("roleplay", { level: S.level || 1, scenario: rp.r.scenario, role: rp.r.role, learnerRole: rp.r.learnerRole, goal: rp.r.goal, history: rp.history });
    if (text && r.correction && r.correction.needed && r.correction.better) rp.corrections[rp.history.length - 1] = { better: String(r.correction.better), why: String(r.correction.why || ""), mg: String(r.correction.mg || ""), fr: String(r.correction.fr || "") };
    rp.history.push({ who: "ai", text: String(r.reply || "…") });
    rp.ended = !!r.end || rp.history.filter((t) => t.who === "me").length >= 10;
    rp.busy = false; renderRoleplay(); say(String(r.reply || ""), false);
  } catch (e) {
    rp.busy = false; if (text) rp.history.pop(); renderRoleplay();
    const box = document.getElementById("rpAns"); if (box && text) box.value = text;
    const m = aiMsg(e); const err = document.getElementById("rpErr"); if (err) err.innerHTML = `<p class="muted">${esc(m[0])} Your reply is kept; tap Send again.<span class="mg">${esc(m[1])}</span></p>`;
  }
}
function roleplayEnd() {
  const rp = SK.rp; stopCapture();
  const mine = rp.history.map((t, i) => ({ t, i })).filter((x) => x.t.who === "me");
  const fixes = mine.filter((x) => rp.corrections[x.i]);
  const score = mine.length ? Math.round(100 * (mine.length - fixes.length) / mine.length) : 0;
  if (mine.length >= 3 && !rp.saved) { skPush("role", score, { id: rp.r.id }); rp.saved = true; }
  window.scrollTo(0, 0);
  view.innerHTML = skTop("Role-play · Results", "sk-speak") + `<div class="stack">
   <div style="text-align:center"><span class="score-ring">${score}%</span><p class="muted">${mine.length} replies · ${fixes.length} to improve${mine.length < 3 ? " · say at least 3 things to count this role-play" : ""}</p></div>
   ${fixes.length ? `<p class="kicker">Learn these better ways to say it</p>${fixes.map((x) => `<div class="mist"><span><s>${esc(x.t.text)}</s></span><span><b>${esc(rp.corrections[x.i].better)}</b></span><span>${esc(rp.corrections[x.i].why)}</span><span class="mg">${esc(rp.corrections[x.i].mg)}</span>${frs(rp.corrections[x.i].fr)}</div>`).join("")}` : '<div class="fb ok"><b>Excellent!</b><p>No corrections needed. Try a harder role-play.</p></div>'}
   <button class="btn primary" data-act="sk-rp" data-id="${rp.r.id}">Try again · Andramo indray</button><button class="btn" data-act="sk-speak" style="width:100%;min-height:50px">Back to speaking</button></div>`;
}

/* ================= LISTENING SCREENS ================= */
const MALE = /\bmale\b|david|daniel|alex|fred|george|james|mark|guy|ryan|thomas|arthur|oliver|aaron|google uk english male/i;
function voiceFor(kind) {
  const vs = enVoices(); const pref = kind === "male" ? vs.filter((v) => MALE.test(v.name) && !/female/i.test(v.name)) : vs.filter((v) => SOFT.test(v.name));
  return pref.find((v) => VOICE && v.lang === VOICE.lang) || pref[0] || VOICE || null;
}
function listenRate() { const lv = S.level || 1; return SK.ls && SK.ls.slow ? 0.72 : [0, 0.85, 0.9, 0.95, 1, 1.05][lv]; }
function playScript(lines, onDone) {
  if (!TTS) return;
  const ls = SK.ls, spk = {}; (ls.data.speakers || []).forEach((s) => { spk[s.name] = s.voice; });
  speakQueue(lines.map((l, i) => Object.assign(() => {
    const u = new SpeechSynthesisUtterance(l.text); const kind = spk[l.who] || "female"; const v = voiceFor(kind);
    if (v) { u.voice = v; u.lang = v.lang; } else u.lang = "en-GB";
    u.rate = listenRate(); u.pitch = v && VOICE && v.voiceURI !== VOICE.voiceURI ? 1 : kind === "male" ? 0.8 : 1.2;
    if (i === lines.length - 1 && onDone) u.onend = onDone;
    return u;
  }, { len: l.text.length })));
}
function listenHome() {
  window.scrollTo(0, 0);
  const lv = S.level || 1, past = ((S.sk || {}).listen || []).slice(-6).reverse();
  view.innerHTML = skTop("Listening · Fihainoana") + `<div class="stack">
   <div><h1>Listen first, read later</h1><p class="muted">You hear a conversation or talk without the text. Answer the questions, then read the text and write a short dictation.<span class="mg">Henoy aloha tsy misy soratra, valio ny fanontaniana, avy eo vakio.</span></p></div>
   <div class="stack tight"><p class="kicker">Choose a type</p>${LISTEN_KINDS[lv].map((k, i) => `<button class="les" data-act="sk-lnew" data-i="${i}"><span class="n">▶</span><span class="t"><b>${esc(k[0].toUpperCase() + k.slice(1))}</b><small>A new one at Level ${lv}</small></span></button>`).join("")}</div>
   ${past.length ? `<section class="stack tight"><p class="kicker">Recent results</p>${past.map((x) => `<div class="wrow" style="grid-template-columns:1fr auto"><span>${esc(x.title || "Listening")}</span><b>${x.s}%</b></div>`).join("")}</section>` : ""}</div>`;
}
async function newListening(i) {
  const lv = S.level || 1, kind = LISTEN_KINDS[lv][i] || LISTEN_KINDS[lv][0], topic = TOPICS[Math.floor(Math.random() * TOPICS.length)];
  showLoading(`Preparing a ${kind}`, "Manomana fihainoana ho anao ny mpampianatra AI.", 5000);
  try {
    const r = await aiCall("listening", { level: lv, kind, topic }, loadingProgress);
    const lines = (r.lines || []).filter((l) => l.text), qs = (r.qs || []).filter((q) => Array.isArray(q.o) && q.o.length >= 2 && Number.isInteger(q.a) && q.a >= 0 && q.a < q.o.length);
    if (!lines.length || qs.length < 3) throw new AIError("default");
    SK.ls = { data: Object.assign(r, { lines, qs }), step: 0, plays: 0, qi: 0, right: 0, answered: false, dict: [], di: 0, slow: false };
    renderListen();
  } catch (e) { aiFailed(e); }
}
function renderListen() {
  window.scrollTo(0, 0);
  const ls = SK.ls, d = ls.data, steps = ["Listen", "Answer", "Read", "Dictation", "Finish"];
  let h = `<div class="top"><button class="x" data-act="sk-listen" aria-label="Back">${ICON.x}</button><div class="steps">${steps.map((s, i) => `<span class="${i < ls.step ? "done" : i === ls.step ? "now" : ""}">${s}</span>`).join("")}</div></div>`;
  const playRow = `<div class="row"><button class="btn big" data-act="sk-lplay">${ICON.spk} ${ls.plays ? "Play again" : "Play"}</button><button class="btn toggle" data-act="sk-lslow" aria-pressed="${ls.slow}">Slower</button><span class="muted" style="font-size:.85rem">Played ${ls.plays}×</span></div>`;
  if (ls.step === 0) {
    h += `<div class="stack"><div><p class="kicker">${esc(d.kind || "Listening")}</p><h1 style="margin-top:6px">${esc(d.title)}</h1></div>
     <p class="inst">First read the questions. Then press Play and listen. The text is hidden. Try to understand with 2 plays or fewer.<span class="mg">Vakio aloha ny fanontaniana, dia henoy. Miafina ny soratra.</span></p>
     ${playRow}
     <section class="stack tight"><p class="kicker">The questions</p><ol style="margin:0;padding-left:20px;display:flex;flex-direction:column;gap:6px">${d.qs.map((q) => `<li>${esc(q.q)}</li>`).join("")}</ol></section>
     <button class="btn primary" data-act="sk-lnext">I'm ready to answer</button></div>`;
  } else if (ls.step === 1) {
    const q = d.qs[ls.qi], n = d.qs.length;
    h += `<div class="stack"><div class="row" style="justify-content:space-between"><p class="kicker">Question ${ls.qi + 1} of ${n} · ${esc(q.type || "")}</p><span class="muted" style="font-size:.85rem">${ls.right} correct</span></div>${playRow}
     <h2>${esc(q.q)}</h2><div class="opts">${q.o.map((o, i) => { let c = ""; if (ls.answered) { if (i === q.a) c = " right"; else if (i === ls.pick) c = " wrong"; } return `<button class="opt${c}" data-act="sk-lans" data-i="${i}" ${ls.answered ? "disabled" : ""}>${esc(o)}</button>`; }).join("")}</div>
     ${ls.answered ? `<div class="fb ${ls.pick === q.a ? "ok" : "no"}"><b>${ls.pick === q.a ? "Correct!" : "Not quite."}</b><p>${esc(q.why)}<span class="mg">${esc(q.mg)}</span>${frs(q.fr)}</p></div><button class="btn primary" data-act="sk-lq">${ls.qi === n - 1 ? "Next: read the text" : "Next question"}</button>` : ""}</div>`;
  } else if (ls.step === 2) {
    h += `<div class="stack"><p class="kicker">Now read what you heard · Vakio izay henonao</p><div class="row"><button class="btn" data-act="sk-lplay">${ICON.spk} Listen while reading</button></div>
     <div class="passage">${d.lines.map((l) => `<div class="line" style="grid-template-columns:1fr"><div class="txt">${l.who ? `<span class="who">${esc(l.who)}</span>` : ""}${esc(l.text)}</div></div>`).join("")}</div>
     ${(d.words || []).length ? `<section class="stack tight"><p class="kicker">Useful words</p>${d.words.map((w) => `<div class="wrow" style="grid-template-columns:1fr"><span><b>${esc(w.en)}</b> · ${esc(w.mg)}<span class="mg" style="font-style:normal">${esc(w.def)}</span></span></div>`).join("")}</section>` : ""}
     <button class="btn primary" data-act="sk-lnext">Next: dictation · Diktao</button></div>`;
  } else if (ls.step === 3) {
    const sents = (d.dictation || []).filter(Boolean).slice(0, 3); if (!sents.length) { ls.step = 4; return renderListen(); }
    const s = sents[ls.di], res = ls.dict[ls.di];
    h += `<div class="stack"><p class="kicker">Dictation ${ls.di + 1} of ${sents.length} · Diktao</p><p class="inst">Listen and write exactly what you hear.<span class="mg">Henoy ary soraty tsara izay henonao.</span></p>
     <div class="row"><button class="btn big" data-act="sk-dplay">${ICON.spk} Play</button><button class="btn" data-act="sk-dslow">Slow</button></div>
     <textarea id="dictBox" class="textarea" style="min-height:80px" autocapitalize="sentences" ${res ? "readonly" : ""}>${esc(res ? res.text : "")}</textarea>
     ${res ? `<p class="spk-text" style="font-size:1.05rem">${s.split(/\s+/).map((w, i) => `<span class="${res.ok[i] ? "ok" : "bad"}">${esc(w)}</span>`).join(" ")}</p><p class="muted">${res.score}% of the words correct</p><button class="btn primary" data-act="sk-dnext">${ls.di === sents.length - 1 ? "Finish" : "Next sentence"}</button>` : `<button class="btn primary" data-act="sk-dcheck">Check · Hamarino</button>`}</div>`;
  } else {
    const qScore = ls.right / d.qs.length, dv = ls.dict.filter(Boolean), dScore = dv.length ? dv.reduce((a, x) => a + x.score, 0) / dv.length / 100 : qScore;
    const score = Math.round(100 * (qScore * 0.7 + dScore * 0.3));
    if (!ls.saved) { skPush("listen", score, { title: d.title }); ls.saved = true; }
    h += `<div class="stack" style="text-align:center;align-items:center"><p class="kicker">${esc(d.title)}</p><span class="score-ring">${score}%</span><h2>${score >= 80 ? "Great listening!" : score >= 60 ? "Good work" : "Keep practising"}</h2>
     <p class="muted">${ls.right}/${d.qs.length} questions · dictation ${Math.round(dScore * 100)}% · played ${ls.plays}×</p></div>
     <div class="stack" style="margin-top:18px"><button class="btn primary" data-act="sk-listen">Another listening</button><button class="btn" data-act="home" style="width:100%;min-height:50px">Back to my course</button></div>`;
  }
  view.innerHTML = h;
}

/* ================= WRITING SCREENS ================= */
function writeHome(showLv) {
  window.scrollTo(0, 0);
  const lv = S.level || 1, sel = showLv || lv, hist = (S.sk || {}).write || [];
  view.innerHTML = skTop("Writing · Fanoratana") + `<div class="stack">
   <div><h1>Write like a professional</h1><p class="muted">Real tasks from work and life. The AI teacher marks task, organisation, grammar, vocabulary and tone, shows every correction and a model answer.<span class="mg">Asa fanoratana tena izy. Hamarinin'ny mpampianatra AI ary hasehony ny ohatra tsara.</span></p></div>
   <div class="stack tight"><p class="kicker">Level</p><div class="lvchips">${[1, 2, 3, 4, 5].map((n) => `<button class="btn toggle" data-act="sk-wlevel" data-lv="${n}" aria-pressed="${n === sel}" aria-label="Level ${n}">${n}</button>`).join("")}</div></div>
   <div class="stack tight">${WRITE_TASKS[sel].map((t) => { const best = hist.filter((x) => x.id === t.id).reduce((a, x) => Math.max(a, x.s), -1); return `<button class="les${best >= 0 ? " done" : ""}" data-act="sk-wopen" data-id="${t.id}"><span class="n">${best >= 0 ? "✓" : "✎"}</span><span class="t"><b>${esc(t.title)}</b><small>${esc(t.genre)} · ${t.words} words</small></span>${best >= 0 ? `<span class="s">${best}%</span>` : ""}</button>`; }).join("")}</div></div>`;
}
function findTask(id) { for (const lv of [1, 2, 3, 4, 5]) { const t = WRITE_TASKS[lv].find((x) => x.id === id); if (t) return Object.assign({ lv }, t); } return null; }
function openWriteTask(id, keep) {
  const t = findTask(id); if (!t) return;
  if (!keep) SK.wr = { t, text: (S.wdrafts || {})[id] || "", fb: null };
  window.scrollTo(0, 0);
  const w = SK.wr;
  view.innerHTML = skTop("Writing · " + t.genre, "sk-write") + `<div class="stack">
   <div><p class="kicker">Level ${t.lv} · ${esc(t.genre)}</p><h1 style="margin-top:6px">${esc(t.title)}</h1></div>
   <section class="panel stack tight"><p>${esc(t.task)}</p><p class="muted" style="font-size:.9rem">Length: ${t.words} words. Plan first: who is the reader, what do they need, which tone?</p></section>
   <textarea id="wrBox" class="textarea" style="min-height:260px" placeholder="Write here…">${esc(w.text)}</textarea>
   <p class="muted" id="wrCount" style="font-size:.85rem">${wc(w.text)} words</p>
   <button class="btn primary" data-act="sk-wsubmit">${w.fb ? "Submit my new version" : "Submit for marking · Alefa"}</button><div id="wrRes" aria-live="polite"></div></div>`;
}
async function submitWriting() {
  const w = SK.wr, box = document.getElementById("wrBox"), text = box.value.trim(), res = document.getElementById("wrRes");
  w.text = box.value;
  if (wc(text) < 15) { res.innerHTML = '<p class="muted">Write a bit more first.</p>'; return; }
  const btn = view.querySelector('[data-act="sk-wsubmit"]'); btn.disabled = true; btn.textContent = "The teacher is marking…";
  try {
    const r = await aiCall("writepro", { level: w.t.lv, genre: w.t.genre, task: w.t.task, words: w.t.words, answer: text }, loadingProgress);
    const score = Math.max(0, Math.min(100, parseInt(r.score, 10) || 0));
    skPush("write", score, { id: w.t.id }); w.fb = r;
    S.wdrafts = S.wdrafts || {}; delete S.wdrafts[w.t.id];
    (r.mistakes || []).slice(0, 4).forEach((m) => { S.mistakes = [`${m.wrong} → ${m.right}`, ...(S.mistakes || [])].slice(0, 20); });
    save(); window.scrollTo(0, 0);
    view.innerHTML = skTop("Writing · Feedback", "sk-write") + `<div class="stack">
     <div style="text-align:center"><span class="score-ring">${score}%</span><p class="muted">${esc(w.t.title)} · ${wc(text)} words (target ${w.t.words})</p></div>
     ${rubricBars(r.rubric, [["task", "Task"], ["organisation", "Organisation"], ["grammar", "Grammar"], ["vocabulary", "Vocabulary"], ["tone", "Tone"]])}
     <div class="fb ok"><b>Good</b><p>${esc(r.good)}</p></div>
     ${(r.mistakes || []).length ? `<p class="kicker">Mistakes to learn from</p>${mistakesHTML(r.mistakes)}` : ""}
     <details class="panel"><summary style="cursor:pointer;font-weight:700">Your text, corrected</summary><p class="corr" style="margin-top:10px">${esc(r.corrected)}</p></details>
     <details class="panel" open><summary style="cursor:pointer;font-weight:700">Model answer · Ohatra tsara</summary><p class="corr" style="margin-top:10px;background:var(--gold-soft)">${esc(r.model)}</p></details>
     <section class="stack tight"><p class="kicker">Tips</p>${(r.tips || []).map((t) => `<p class="tip">${esc(t)}</p>`).join("")}<span class="mg">${esc(r.tip_mg)}</span>${frs(r.tip_fr)}</section>
     <button class="btn primary" data-act="sk-wrewrite">Rewrite and submit again</button><button class="btn" data-act="sk-write" style="width:100%;min-height:50px">Back to writing</button></div>`;
  } catch (e) { const m = aiMsg(e); res.innerHTML = `<p class="muted">${esc(m[0])} Your text is saved; try again.<span class="mg">${esc(m[1])}</span></p>`; S.wdrafts = S.wdrafts || {}; S.wdrafts[w.t.id] = w.text; save(); btn.disabled = false; btn.textContent = "Submit for marking · Alefa"; }
}

/* ================= EVENTS ================= */
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-act]"); if (!b) return; const a = b.dataset.act; if (!a.startsWith("sk-")) return;
  switch (a) {
    case "sk-talked": S.talks = [...new Set([...(S.talks || []), today()])].slice(-60); markDay(); save(); home(); break;
    case "sk-grammar": grammarHome(); break;
    case "sk-glevel": grammarHome(+b.dataset.lv); break;
    case "sk-gopen": openGrammar(b.dataset.id); break;
    case "sk-gsay": say(SK.g.c.examples[+b.dataset.i].en); break;
    case "sk-gnext": SK.g.step++; renderGrammar(); break;
    case "sk-gmc": { const g = SK.g, ex = g.c.ex[g.i]; if (g.answered) break; g.pick = +b.dataset.i; g.answered = true; g.ok = g.pick === ex.a; if (g.ok) g.right++; renderGrammar(); break; }
    case "sk-gtype": { const g = SK.g, ex = g.c.ex[g.i], v = document.getElementById("gAns").value; if (!v.trim()) break; g.typed = v; g.answered = true; g.ok = ex.answers.some((x) => normAns(x) === normAns(v)); if (g.ok) g.right++; renderGrammar(); const box = document.getElementById("gAns"); if (box && ex.t === "gap") box.value = v; break; }
    case "sk-gex": { const g = SK.g; g.answered = false; g.pick = null; g.typed = ""; g.i++; if (g.i >= g.c.ex.length) g.step = 2; renderGrammar(); break; }
    case "sk-gcheck": grammarCheckSentence(+b.dataset.k); break;
    case "sk-speak": speakHome(); break;
    case "sk-sq": openSpeakQ(SPEAK_Q[S.level || 1][+b.dataset.i]); break;
    case "sk-sayq": say(SK.sp.q, false); break;
    case "sk-rec": toggleRecord(b); break;
    case "sk-spfb": speakFeedback(); break;
    case "sk-saytext": say(SK.sp.fb[b.dataset.t], false); break;
    case "sk-follow": openSpeakQ(SK.sp.fb.follow_up); break;
    case "sk-rp": openRoleplay(b.dataset.id); break;
    case "sk-rpstart": roleplayTurn(null); break;
    case "sk-rpsend": { const box = document.getElementById("rpAns"), t = box.value.trim(); if (!t) break; roleplayTurn(t); break; }
    case "sk-rpsay": say(SK.rp.history[+b.dataset.i].text, false); break;
    case "sk-rpend": roleplayEnd(); break;
    case "sk-listen": if (TTS) speechSynthesis.cancel(); listenHome(); break;
    case "sk-lnew": newListening(+b.dataset.i); break;
    case "sk-lplay": SK.ls.plays++; { const pc = view.querySelector(".row .muted"); if (pc) pc.textContent = `Played ${SK.ls.plays}×`; } playScript(SK.ls.data.lines); break;
    case "sk-lslow": SK.ls.slow = !SK.ls.slow; b.setAttribute("aria-pressed", SK.ls.slow); break;
    case "sk-lnext": if (TTS) speechSynthesis.cancel(); SK.ls.step++; renderListen(); break;
    case "sk-lans": { const ls = SK.ls, q = ls.data.qs[ls.qi]; if (ls.answered) break; ls.pick = +b.dataset.i; ls.answered = true; if (ls.pick === q.a) ls.right++; renderListen(); break; }
    case "sk-lq": { const ls = SK.ls; ls.answered = false; ls.pick = null; ls.qi++; if (ls.qi >= ls.data.qs.length) ls.step = 2; renderListen(); break; }
    case "sk-dplay": case "sk-dslow": { const ls = SK.ls, s = ls.data.dictation[ls.di]; if (!TTS || !s) break; speakQueue([() => { const u = new SpeechSynthesisUtterance(s); if (VOICE) { u.voice = VOICE; u.lang = VOICE.lang; } u.rate = a === "sk-dslow" ? 0.65 : listenRate(); u.pitch = S.pitch || 1.15; return u; }]); break; }
    case "sk-dcheck": { const ls = SK.ls, s = ls.data.dictation[ls.di], v = document.getElementById("dictBox").value; if (!v.trim()) break; const c = compare(s, v); ls.dict[ls.di] = { text: v, ok: c.ok, score: Math.round(c.score * 100) }; renderListen(); break; }
    case "sk-dnext": { const ls = SK.ls; ls.di++; if (ls.di >= Math.min(3, (ls.data.dictation || []).filter(Boolean).length)) ls.step = 4; renderListen(); break; }
    case "sk-write": writeHome(); break;
    case "sk-wlevel": writeHome(+b.dataset.lv); break;
    case "sk-wopen": openWriteTask(b.dataset.id); break;
    case "sk-wsubmit": submitWriting(); break;
    case "sk-wrewrite": openWriteTask(SK.wr.t.id, true); break;
  }
});
document.addEventListener("input", (e) => {
  if (e.target.id === "wrBox" && SK.wr) { SK.wr.text = e.target.value; const c = document.getElementById("wrCount"); if (c) c.textContent = `${wc(e.target.value)} words`; S.wdrafts = S.wdrafts || {}; S.wdrafts[SK.wr.t.id] = e.target.value; persistLocal(); }
});
