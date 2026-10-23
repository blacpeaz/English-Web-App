/* Miteny English: Sentence Builder. 16 units that teach how English sentences are built, from
   word order to clear professional sentences, aimed at the mistakes Malagasy speakers make.
   All exercises are checked on the phone (no AI cost). Only the optional "Your turn" sentence at
   the end of a unit is checked by the AI teacher (3 tries). Loaded before the main script. */

const SB_UNITS = [
  { id: "sb01", stage: 1, title: "Who + does + what", pattern: "WHO + DOES + WHAT",
    en: "In English the person or thing doing the action comes first, then the verb, then the object. Malagasy starts with the verb (Mamaky boky i Fara); English starts with the person (Fara reads a book).",
    mg: "Amin'ny teny anglisy, ny mpanao no voalohany, arahin'ny matoanteny, avy eo ny fameno. Ny teny malagasy manomboka amin'ny matoanteny (Mamaky boky i Fara), fa ny teny anglisy manomboka amin'ny mpanao (Fara reads a book).",
    examples: ["Fara reads a book.", "The driver loads the truck.", "My manager checks the stock."],
    ex: [
      { t: "order", a: "The driver delivers the boxes." },
      { t: "order", a: "My sister sells clothes." },
      { t: "fix", q: "Sells clothes my mother.", a: ["My mother sells clothes."] },
      { t: "fix", q: "Checks the stock the manager every Monday.", a: ["The manager checks the stock every Monday.", "Every Monday the manager checks the stock.", "Every Monday, the manager checks the stock."] },
      { t: "mc", q: "Which sentence is correct?", o: ["Eat rice we every day.", "We eat rice every day.", "Rice we eat every day."], a: 1 },
      { t: "order", a: "The customer pays the bill." },
    ],
    task: "Write a sentence about your work: who + does what + what." },
  { id: "sb02", stage: 1, title: "Describing words come first", pattern: "a / the + ADJECTIVE + NOUN",
    en: "The describing word (adjective) comes before the noun: a big house, a new phone. In Malagasy it comes after (trano lehibe). Adjectives never take -s: two big houses, not two bigs houses.",
    mg: "Ny mpamaritra dia mialoha ny anarana: a big house. Amin'ny teny malagasy kosa dia aorian'ny anarana (trano lehibe). Tsy ampiana -s mihitsy ny mpamaritra.",
    examples: ["We sell cheap clothes.", "She has a new phone.", "They live in a small house."],
    ex: [
      { t: "order", a: "We have a big warehouse." },
      { t: "fix", q: "I bought a shirt blue.", a: ["I bought a blue shirt."] },
      { t: "fix", q: "They sell news phones.", a: ["They sell new phones."] },
      { t: "mc", q: "Choose the correct one.", o: ["a car red", "a red car", "red a car"], a: 1 },
      { t: "order", a: "She wears a beautiful dress." },
      { t: "fix", q: "This is a problem big for the company.", a: ["This is a big problem for the company."] },
    ],
    task: "Describe something in your shop or office using two describing words." },
  { id: "sb03", stage: 1, title: "a, an, the and plurals", pattern: "a/an + one new thing · the + known thing · noun + s",
    en: "Use a or an for one thing you mention for the first time (a customer). Use the for something we both know (the customer from this morning). For more than one, add -s: one box, two boxes. Malagasy nouns do not change; English nouns do.",
    mg: "Ampiasao ny a/an ho an'ny zavatra iray voalaza voalohany. Ampiasao ny the ho an'ny zavatra efa fantatra. Raha maro dia ampiana -s: one box, two boxes. Tsy miova ny anarana malagasy, fa miova ny anarana anglisy.",
    examples: ["I have a meeting today. The meeting is at ten.", "We need three trucks.", "He is an accountant."],
    ex: [
      { t: "mc", q: "She is ___ engineer.", o: ["a", "an", "the"], a: 1 },
      { t: "fix", q: "We sold five bale yesterday.", a: ["We sold five bales yesterday."] },
      { t: "fix", q: "She is good teacher.", a: ["She is a good teacher."] },
      { t: "mc", q: "I bought a phone. ___ phone is very fast.", o: ["A", "The", "An"], a: 1 },
      { t: "fix", q: "There are many customer in the shop.", a: ["There are many customers in the shop."] },
      { t: "order", a: "The boxes are in the warehouse." },
    ],
    task: "Write two sentences: first mention something with a or an, then talk about it again with the." },
  { id: "sb04", stage: 1, title: "Where and when go at the end", pattern: "WHO + DOES + WHAT + WHERE + WHEN",
    en: "The usual order is: who + verb + what + where + when. Fara sells clothes at the market every Saturday. You can also put the time first, with a comma: Every Saturday, Fara sells clothes at the market.",
    mg: "Ny filaharana mahazatra: iza + matoanteny + inona + aiza + rahoviana. Azo apetraka eo am-piandohana koa ny fotoana, misy faingo aorian'izany.",
    examples: ["We unload the truck at the warehouse every morning.", "She met the supplier in Toamasina last week."],
    ex: [
      { t: "order", a: "We open the shop at eight o'clock." },
      { t: "order", a: "The truck arrived at the warehouse yesterday.", alt: ["Yesterday the truck arrived at the warehouse."] },
      { t: "fix", q: "I every day work in the office.", a: ["I work in the office every day.", "Every day I work in the office.", "Every day, I work in the office."] },
      { t: "fix", q: "She in Antananarivo lives.", a: ["She lives in Antananarivo."] },
      { t: "mc", q: "Choose the best order.", o: ["We last month in Mahajanga a new shop opened.", "We opened a new shop in Mahajanga last month.", "We opened last month a new shop in Mahajanga."], a: 1 },
      { t: "order", a: "They deliver the furniture to customers on Fridays." },
    ],
    task: "Write what you do at work, where you do it and when." },
  { id: "sb05", stage: 1, title: "Yes/no questions: do, does, did", pattern: "DO / DOES / DID + WHO + VERB …?",
    en: "To ask a yes/no question, put Do or Does (present) or Did (past) before the person: Do you work today? Does she sell shoes? Did the truck arrive? After does and did, the verb has no -s and no -ed.",
    mg: "Mba hanontaniana, apetraho eo aloha ny Do na Does (ankehitriny) na Did (lasa): Do you work today? Aorian'ny does sy did dia tsy misy -s na -ed ny matoanteny.",
    examples: ["Do you like your job?", "Does the bank open on Saturday?", "Did you call the supplier?"],
    ex: [
      { t: "order", a: "Does the shop open on Sunday?" },
      { t: "fix", q: "You like coffee?", a: ["Do you like coffee?"] },
      { t: "fix", q: "Does she works here?", a: ["Does she work here?"] },
      { t: "fix", q: "Did you called the driver?", a: ["Did you call the driver?"] },
      { t: "mc", q: "___ your brother live in Toamasina?", o: ["Do", "Does", "Is"], a: 1 },
      { t: "order", a: "Did the customer pay yesterday?" },
    ],
    task: "Write two questions you could ask a new colleague." },
  { id: "sb06", stage: 1, title: "Saying no: don't, doesn't, didn't", pattern: "WHO + DON'T / DOESN'T / DIDN'T + VERB",
    en: "To say no, put don't, doesn't or didn't before the verb: I don't work on Sunday. She doesn't eat meat. They didn't come. Use only one 'no' word, and after doesn't or didn't the verb has no -s or -ed.",
    mg: "Mba handavana, apetraho ny don't, doesn't na didn't eo alohan'ny matoanteny. Teny fandavana iray ihany no ampiasaina. Aorian'ny doesn't sy didn't, tsy misy -s na -ed ny matoanteny.",
    examples: ["I don't understand the question.", "The machine doesn't work.", "We didn't receive the payment."],
    ex: [
      { t: "order", a: "The machine doesn't work today." },
      { t: "fix", q: "She don't like tea.", a: ["She doesn't like tea."] },
      { t: "fix", q: "We didn't received the money.", a: ["We didn't receive the money."] },
      { t: "fix", q: "I no understand.", a: ["I don't understand."] },
      { t: "mc", q: "He ___ have a car.", o: ["don't", "doesn't", "isn't"], a: 1 },
      { t: "fix", q: "They don't never come late.", a: ["They never come late.", "They don't ever come late."] },
    ],
    task: "Write two things you don't do at work, and one thing you didn't do yesterday." },
  { id: "sb07", stage: 1, title: "Questions with where, what, why", pattern: "WHERE / WHAT / WHY + DO / IS + WHO …?",
    en: "With a question word, the order is question word + do/does/did + person + verb (Where do you live?) or question word + be + person (Where is the manager?). Don't keep the normal order: not 'Where you live?'.",
    mg: "Raha misy teny fanontaniana: teny fanontaniana + do/does/did + iza + matoanteny (Where do you live?), na teny fanontaniana + be + iza (Where is the manager?).",
    examples: ["What time does the shop close?", "Where is the invoice?", "Why did the price go up?"],
    ex: [
      { t: "order", a: "What time does the truck arrive?" },
      { t: "fix", q: "Where you work?", a: ["Where do you work?"] },
      { t: "fix", q: "Why the price is so high?", a: ["Why is the price so high?"] },
      { t: "order", a: "Where are the new boxes?" },
      { t: "mc", q: "How much ___ these shoes cost?", o: ["is", "do", "does"], a: 1 },
      { t: "fix", q: "When you finished the report?", a: ["When did you finish the report?"] },
    ],
    task: "Write three questions to ask a supplier about an order." },
  { id: "sb08", stage: 2, title: "Every sentence needs a subject: it, there", pattern: "IT IS … · THERE IS / THERE ARE …",
    en: "An English sentence always needs a subject. For weather, time and distance use It: It is raining. It is five o'clock. To say something exists use There is / There are: There are many customers today. Malagasy often has no subject here, so learners write 'Is raining' or 'Have many customers'.",
    mg: "Ny fehezanteny anglisy dia tsy maintsy manana mpanao. Ampiasao ny It ho an'ny toetr'andro, ora sy halavirana (It is raining), ary ny There is / There are raha milaza hoe 'misy' (There are many customers).",
    examples: ["It is cold this morning.", "There is a problem with the truck.", "It takes two hours to get there."],
    ex: [
      { t: "fix", q: "Is very hot today.", a: ["It is very hot today."] },
      { t: "fix", q: "Have many customers in the shop.", a: ["There are many customers in the shop."] },
      { t: "mc", q: "___ is a meeting at three o'clock.", o: ["It", "There", "They"], a: 1 },
      { t: "fix", q: "Is far from here.", a: ["It is far from here."] },
      { t: "order", a: "There are three trucks in the yard." },
      { t: "mc", q: "___ is raining, so the market is quiet.", o: ["There", "It", "This"], a: 1 },
    ],
    task: "Describe today: the weather, and what there is at your workplace." },
  { id: "sb09", stage: 2, title: "always, usually, never", pattern: "WHO + ALWAYS + VERB · WHO + IS + ALWAYS …",
    en: "Words like always, usually, often, sometimes and never go before the main verb (I always check the stock) but after am, is or are (She is never late).",
    mg: "Ny teny toy ny always, usually, often, sometimes ary never dia mialoha ny matoanteny fototra (I always check the stock), fa aorian'ny am, is, are (She is never late).",
    examples: ["We usually start at seven.", "He is always polite to customers.", "I never forget my keys."],
    ex: [
      { t: "order", a: "We usually close at six." },
      { t: "fix", q: "I go always to the market on Saturday.", a: ["I always go to the market on Saturday."] },
      { t: "fix", q: "She always is on time.", a: ["She is always on time."] },
      { t: "order", a: "The supplier never answers the phone." },
      { t: "mc", q: "Choose the correct sentence.", o: ["They come often late.", "They often come late.", "Often they late come."], a: 1 },
      { t: "fix", q: "Sometimes he forget his phone.", a: ["Sometimes he forgets his phone.", "He sometimes forgets his phone."] },
    ],
    task: "Write about your habits using always, usually and never." },
  { id: "sb10", stage: 2, title: "Joining ideas: and, but, so", pattern: "SENTENCE + , and / , but / , so + SENTENCE",
    en: "Use and to add, but to show a difference and so to show a result. Put a comma before but and so when they join two full sentences: The price is good, but the quality is low. It was late, so we closed the shop.",
    mg: "And: manampy. But: mampiseho fahasamihafana. So: mampiseho vokatra. Asio faingo alohan'ny but sy so rehefa mampitohy fehezanteny roa feno.",
    examples: ["The shop is small, but it is busy.", "The truck broke down, so the delivery was late."],
    ex: [
      { t: "combine", q: ["The price is good.", "The quality is low."], use: "but", a: ["The price is good, but the quality is low."] },
      { t: "combine", q: ["It was raining.", "We stayed inside."], use: "so", a: ["It was raining, so we stayed inside."] },
      { t: "combine", q: ["I cleaned the shop.", "I counted the money."], use: "and", a: ["I cleaned the shop and counted the money.", "I cleaned the shop and I counted the money."] },
      { t: "mc", q: "The bus was full, ___ I took a taxi.", o: ["but", "so", "and"], a: 1 },
      { t: "mc", q: "She works hard, ___ her salary is low.", o: ["so", "but", "because"], a: 1 },
      { t: "order", a: "We were tired, so we went home." },
    ],
    task: "Write two sentences about your week, one with but and one with so." },
  { id: "sb11", stage: 2, title: "Reasons and times: because, when", pattern: "SENTENCE + because / when + SENTENCE · When …, SENTENCE",
    en: "Because gives a reason; when gives a time. The because/when part can come second (I was late because the bus was full) or first, followed by a comma (When the truck arrives, call me). After when, use the present for the future: When I finish, I will call you.",
    mg: "Because: antony. When: fotoana. Raha eo am-piandohana ny ampahany misy when na because, asio faingo aorian'izany. Aorian'ny when, ankehitriny no ampiasaina na dia ho avy aza: When I finish, I will call you.",
    examples: ["She was happy because sales were good.", "When the client calls, tell him I am in a meeting."],
    ex: [
      { t: "combine", q: ["I was late.", "The bus was full."], use: "because", a: ["I was late because the bus was full."] },
      { t: "combine", q: ["The truck arrives.", "Please call me."], use: "When (at the start)", a: ["When the truck arrives, please call me."] },
      { t: "fix", q: "Because I was sick. I stayed home.", a: ["Because I was sick, I stayed home.", "I stayed home because I was sick."] },
      { t: "order", a: "I called him when I arrived." },
      { t: "mc", q: "We closed early ___ there were no customers.", o: ["when", "because", "but"], a: 1 },
      { t: "fix", q: "When I will finish, I will tell you.", a: ["When I finish, I will tell you."] },
    ],
    task: "Write one sentence with because and one with when about your work." },
  { id: "sb12", stage: 2, title: "Adding details: who, which, that", pattern: "NOUN + WHO / WHICH / THAT + …",
    en: "Use who for people and which or that for things, to add information about a noun: The man who called is our supplier. The bales that arrived yesterday are wet. This turns two short sentences into one. Don't add he/she/it again after who or which.",
    mg: "Who ho an'ny olona, which na that ho an'ny zavatra, mba hanampiana fanazavana momba ny anarana: The man who called is our supplier. Aza averina ny he/she/it aorian'ny who na which.",
    examples: ["The man who drives our truck is very careful.", "The phone that I bought is broken."],
    ex: [
      { t: "combine", q: ["The man called this morning.", "He is our supplier."], use: "who", a: ["The man who called this morning is our supplier."] },
      { t: "combine", q: ["The bales arrived yesterday.", "They are wet."], use: "that or which", a: ["The bales that arrived yesterday are wet.", "The bales which arrived yesterday are wet."] },
      { t: "mc", q: "The customer ___ complained came back today.", o: ["which", "who", "where"], a: 1 },
      { t: "fix", q: "The truck who broke down is old.", a: ["The truck which broke down is old.", "The truck that broke down is old."] },
      { t: "order", a: "The shop that sells phones is closed." },
      { t: "fix", q: "The woman who she works at the bank is my cousin.", a: ["The woman who works at the bank is my cousin."] },
    ],
    task: "Describe a person and a thing at your work, using who and which or that." },
  { id: "sb13", stage: 3, title: "Contrast: although, however, whereas", pattern: "Although …, … · … . However, …",
    en: "Although joins two ideas in one sentence: Although the price is high, customers buy it. However starts a new sentence and is followed by a comma: The price is high. However, customers buy it. Whereas compares two things. Never use although and but together.",
    mg: "Although: mampitohy hevitra roa ao anatin'ny fehezanteny iray. However: manomboka fehezanteny vaovao, arahina faingo. Whereas: mampitaha zavatra roa. Aza ampiarahina mihitsy ny although sy but.",
    examples: ["Although it was late, the team kept working.", "The shop was busy in the morning. However, the afternoon was quiet."],
    ex: [
      { t: "combine", q: ["The price is high.", "Customers buy it."], use: "Although", a: ["Although the price is high, customers buy it.", "Customers buy it although the price is high."] },
      { t: "fix", q: "Although it was raining, but we went to the market.", a: ["Although it was raining, we went to the market.", "It was raining, but we went to the market."] },
      { t: "mc", q: "Sales were good in May. ___, June was slow.", o: ["Although", "However", "Because"], a: 1 },
      { t: "combine", q: ["Sales were good in May.", "June was slow."], use: "However (two sentences)", a: ["Sales were good in May. However, June was slow."] },
      { t: "mc", q: "Toamasina is hot and humid, ___ Antsirabe is cool.", o: ["however", "whereas", "although"], a: 1 },
      { t: "fix", q: "However the delivery was late, the client was happy.", a: ["Although the delivery was late, the client was happy."] },
    ],
    task: "Compare two suppliers or two products using although, however or whereas." },
  { id: "sb14", stage: 3, title: "If-sentences", pattern: "If + present, will … · If + past, would …",
    en: "For a real possibility: If + present, will + verb (If it rains, we will close early). For an imaginary situation: If + past, would + verb (If I had more money, I would open a second shop). Never use will or would in the if-part.",
    mg: "Raha zavatra mety hitranga: If + ankehitriny, will + matoanteny. Raha zavatra tsy tena izy: If + lasa, would + matoanteny. Aza asiana will na would ao amin'ny ampahany misy if.",
    examples: ["If the truck is late, I will call you.", "If I were the manager, I would change the schedule."],
    ex: [
      { t: "fix", q: "If it will rain, we will close early.", a: ["If it rains, we will close early."] },
      { t: "order", a: "If you pay today, you will get a discount." },
      { t: "mc", q: "If I ___ more money, I would open a second shop.", o: ["have", "had", "will have"], a: 1 },
      { t: "fix", q: "If I would know the answer, I would tell you.", a: ["If I knew the answer, I would tell you."] },
      { t: "combine", q: ["You order 100 bales.", "We will give you 5% off."], use: "If", a: ["If you order 100 bales, we will give you 5% off.", "We will give you 5% off if you order 100 bales."] },
      { t: "mc", q: "If the client calls, ___ him I am in a meeting.", o: ["tell", "told", "would tell"], a: 0 },
    ],
    task: "Write one real and one imaginary if-sentence about your work or business." },
  { id: "sb15", stage: 3, title: "Polite questions: Could you tell me…", pattern: "Could you tell me / Do you know + WHERE + WHO + VERB?",
    en: "In polite questions that start with Could you tell me or Do you know, the second part keeps the normal order (person before verb) and has no do/does/did: Where is the bank? → Could you tell me where the bank is? When did it arrive? → Do you know when it arrived?",
    mg: "Amin'ny fanontaniana am-panajana manomboka amin'ny Could you tell me na Do you know, ny ampahany faharoa dia manaraka ny filaharana mahazatra (iza + matoanteny) ary tsy misy do/does/did: Could you tell me where the bank is?",
    examples: ["Could you tell me where the warehouse is?", "Do you know when the shipment will arrive?"],
    ex: [
      { t: "fix", q: "Could you tell me where is the bank?", a: ["Could you tell me where the bank is?"] },
      { t: "fix", q: "Do you know when did the truck arrive?", a: ["Do you know when the truck arrived?"] },
      { t: "order", a: "Could you tell me how much it costs?" },
      { t: "mc", q: "Do you know what time ___?", o: ["does the shop close", "the shop closes", "closes the shop"], a: 1 },
      { t: "combine", q: ["Where is the invoice?"], use: "Could you tell me …", a: ["Could you tell me where the invoice is?"] },
      { t: "combine", q: ["Why was the order cancelled?"], use: "I would like to know …", a: ["I would like to know why the order was cancelled."] },
    ],
    task: "Write two polite questions to a client or supplier, starting with Could you tell me or Do you know." },
  { id: "sb16", stage: 3, title: "Clear sentences, no run-ons", pattern: "Idea. Linking word, idea. · Idea, and / but / so idea.",
    en: "A comma alone cannot join two full sentences. Use a full stop, or a joining word (and, but, so, because, which). Keep one main idea per sentence, and link your sentences with First, Then, After that, Finally, As a result.",
    mg: "Tsy ampy ny faingo irery hampitohizana fehezanteny roa feno. Ampiasao ny teboka, na teny mampitohy (and, but, so, because, which). Hevitra iray isaky ny fehezanteny, ary ampitohizo amin'ny First, Then, Finally, As a result.",
    examples: ["The rain was heavy, so the market closed early.", "First, we check the bales. Then, we weigh them. Finally, we store them."],
    ex: [
      { t: "fix", q: "The truck arrived late, we unloaded it at night.", a: ["The truck arrived late, so we unloaded it at night.", "The truck arrived late. We unloaded it at night.", "The truck arrived late, and we unloaded it at night."] },
      { t: "fix", q: "I called the supplier, he did not answer.", a: ["I called the supplier, but he did not answer.", "I called the supplier. He did not answer."] },
      { t: "mc", q: "Which is the clearest?", o: ["We checked the stock it was low we ordered more.", "We checked the stock. It was low, so we ordered more.", "We checked the stock, it was low, we ordered more."], a: 1 },
      { t: "order", a: "First, we check the bales." },
      { t: "mc", q: "Sales went down. ___, we lowered our prices.", o: ["As a result", "Because", "Although"], a: 0 },
      { t: "fix", q: "We went to the bank, it was closed.", a: ["We went to the bank, but it was closed.", "We went to the bank. It was closed."] },
    ],
    task: "In 3 or 4 clear sentences, describe how you receive a new shipment. Use First, Then and Finally." },
];
const SB_STAGES = { 1: "Basics · Fototra", 2: "Building up · Fanitarana", 3: "Professional · Matihanina" };
const SB_NAMES = /^(I|Fara|Toamasina|Antananarivo|Mahajanga|Antsirabe|Sunday|Monday|Saturday|Fridays)$/;
/* From Level 3, every unit uses the harder set (its own progress, saved as unit id + "h"). */
function sbHardOn() { return (S.level || 1) >= 3; }
function sbKey(id) { return sbHardOn() && SB_HARD[id] ? id + "h" : id; }
function sbUnit(id) { const base = SB_UNITS.find((x) => x.id === id); if (!base) return null; return sbHardOn() && SB_HARD[id] ? Object.assign({}, base, SB_HARD[id], { hard: true }) : base; }
const sbScore = (id) => { const k = sbKey(id); return S.sb && S.sb[k] ? S.sb[k].score : null; };
const sbDone = (id) => (sbScore(id) ?? 0) >= 70;
const sbNext = () => SB_UNITS.find((u) => !sbDone(u.id)) || null;
let SB = null;

function sbChips(answer) {
  const end = (answer.match(/[.?!]$/) || [""])[0];
  const words = answer.replace(/[.?!]$/, "").split(/\s+/);
  if (!SB_NAMES.test(words[0].replace(/[^A-Za-z]/g, ""))) words[0] = words[0].charAt(0).toLowerCase() + words[0].slice(1);
  let order = shuffle(words.map((w, i) => i));
  if (order.every((x, i) => x === i) && words.length > 1) order = order.slice(1).concat(order[0]);
  return { words, order, end };
}
function sbCard() {
  if (!S.placement) return "";
  const done = SB_UNITS.filter((u) => sbDone(u.id)).length, nx = sbNext();
  return `<section class="panel stack tight" style="border-color:var(--green)"><p class="kicker">Sentence Builder · Fanorenana fehezanteny</p>
   <h3>${nx ? `Unit ${SB_UNITS.indexOf(nx) + 1}: ${esc(nx.title)}` : "All 16 units done ✓"}</h3>
   <p class="muted" style="font-size:.92rem">Learn how English sentences are built, step by step: word order, questions, joining ideas, clear professional sentences. ${done}/16 done${sbHardOn() ? " · harder Level 3+ set" : ""}.<span class="mg">Ianaro ny fanorenana fehezanteny anglisy, dingana tsikelikely.</span></p>
   ${nx ? `<button class="btn primary" data-act="sb-open" data-id="${nx.id}">${sbScore(nx.id) !== null ? "Try again" : "Start"}</button>` : ""}
   <button class="link" data-act="sb-home" style="align-self:flex-start">See all units</button></section>`;
}
function sbHome() {
  window.scrollTo(0, 0);
  let h = "";
  [1, 2, 3].forEach((st) => {
    h += `<section class="stack tight"><p class="kicker">${SB_STAGES[st]}</p>${SB_UNITS.filter((u) => u.stage === st).map((u) => { const i = SB_UNITS.indexOf(u), sc = sbScore(u.id); return `<button class="les${sbDone(u.id) ? " done" : ""}" data-act="sb-open" data-id="${u.id}"><span class="n">${sbDone(u.id) ? "✓" : i + 1}</span><span class="t"><b>${esc(u.title)}</b><small>${esc(u.pattern)}</small></span>${sc !== null ? `<span class="s">${sc}%</span>` : ""}</button>`; }).join("")}</section>`;
  });
  view.innerHTML = `<div class="top"><button class="x" data-act="home" aria-label="Back">${ICON.x}</button><p class="kicker" style="margin:0">Sentence Builder</p></div><div class="stack">
   <div><h1>Sentence Builder</h1><p class="muted">16 short units. Each one teaches one way English sentences are built, then you practise it. 70% = done.${sbHardOn() ? " You are on the harder Level 3+ set: longer sentences, two mistakes to fix, three sentences to join, and Malagasy to English." : ""}<span class="mg">Singa 16. Samy mampianatra fomba iray hanorenana fehezanteny izy, avy eo manao fanazarana ianao.</span></p></div>${h}</div>`;
}
function sbOpen(id) {
  const u = sbUnit(id); if (!u) return;
  SB = { u, key: sbKey(id), step: 0, i: 0, right: 0, answered: false, ok: false, typed: "", chips: null, built: [], own: { text: "", res: null, err: null, tries: 0 } };
  sbRender();
}
function sbExerciseHTML(e) {
  if (e.t === "mc") {
    return `<h2>${esc(e.q)}</h2><div class="opts">${e.o.map((o, i) => { let c = ""; if (SB.answered) { if (i === e.a) c = " right"; else if (i === SB.pick) c = " wrong"; } return `<button class="opt${c}" data-act="sb-mc" data-i="${i}" ${SB.answered ? "disabled" : ""}>${esc(o)}</button>`; }).join("")}</div>`;
  }
  if (e.t === "order") {
    if (!SB.chips) SB.chips = sbChips(e.a);
    const c = SB.chips, used = new Set(SB.built);
    return `${e.mg ? `<h2>Say it in English: put the words in order.</h2><p class="wrongbox" style="border-color:var(--gold);background:var(--gold-soft);font-style:italic">${esc(e.mg)}</p><span class="mg">Adikao amin'ny teny anglisy: alaharo ireo teny ireo.</span>` : `<h2>Put the words in the right order.</h2><span class="mg">Alaharo tsara ireo teny ireo.</span>`}
     <div class="answerline" aria-label="Your sentence">${SB.built.map((wi, p) => `<button class="wchip on" data-act="sb-unpick" data-p="${p}" ${SB.answered ? "disabled" : ""}>${esc(c.words[wi])}</button>`).join("")}${SB.built.length ? `<span class="endmark">${esc(c.end)}</span>` : '<span class="muted" style="font-size:.9rem">Tap the words below</span>'}</div>
     <div class="wpool">${c.order.map((wi) => `<button class="wchip" data-act="sb-pick" data-w="${wi}" ${used.has(wi) || SB.answered ? "disabled" : ""}>${esc(c.words[wi])}</button>`).join("")}</div>
     ${SB.answered ? "" : `<div class="row"><button class="btn primary" data-act="sb-checkorder" ${SB.built.length === c.words.length ? "" : "disabled"} style="flex:1">Check · Hamarino</button><button class="btn ghost" data-act="sb-reset">Start again</button></div>`}`;
  }
  const lead = e.t === "fix" ? `<h2>Correct this sentence.</h2><span class="mg">Ahitsio ity fehezanteny ity.</span><p class="wrongbox">${esc(e.q)}</p>`
    : `<h2>${e.q.length === 1 ? "Rewrite politely" : e.q.length === 3 ? "Join these three sentences" : "Join into one sentence"} using <b>${esc(e.use)}</b>.</h2><span class="mg">Ataovy fehezanteny iray.</span>${e.q.map((x) => `<p class="wrongbox" style="border-color:var(--line);background:var(--surface)">${esc(x)}</p>`).join("")}`;
  return `${lead}<textarea id="sbAns" class="textarea" style="min-height:80px" autocapitalize="sentences" ${SB.answered ? "readonly" : ""} placeholder="Write the sentence…">${esc(SB.typed)}</textarea>
   ${SB.answered ? "" : '<button class="btn primary" data-act="sb-checktype">Check · Hamarino</button>'}`;
}
function sbRender() {
  window.scrollTo(0, 0); if (TTS) speechSynthesis.cancel();
  const u = SB.u, steps = ["Learn", "Practise", "Your turn", "Finish"];
  let h = `<div class="top"><button class="x" data-act="sb-home" aria-label="Back">${ICON.x}</button><div class="steps">${steps.map((s, i) => `<span class="${i < SB.step ? "done" : i === SB.step ? "now" : ""}">${s}</span>`).join("")}</div></div>`;
  if (SB.step === 0) {
    h += `<div class="stack"><div><p class="kicker">Unit ${SB_UNITS.findIndex((x) => x.id === u.id) + 1} of 16 · ${SB_STAGES[u.stage]}${u.hard ? " · Level 3+" : ""}</p><h1 style="margin-top:6px">${esc(u.title)}</h1></div>
     <p class="pattern">${esc(u.pattern)}</p>
     <section class="panel stack tight"><p>${esc(u.en)}</p><span class="mg">${esc(u.mg)}</span></section>
     ${u.plus ? `<section class="panel stack tight" style="border-color:var(--gold)"><p class="kicker">At your level · Amin'ny haavonao</p><p>${esc(u.plus)}</p><span class="mg">${esc(u.plusMg)}</span></section>` : ""}
     <section class="stack tight"><p class="kicker">Examples · Ohatra</p><ul class="exs">${u.examples.map((x, i) => `<li><button class="say" data-act="sb-say" data-i="${i}" aria-label="Listen">${ICON.spk}</button><span>${esc(x)}</span></li>`).join("")}</ul></section>
     <button class="btn primary" data-act="sb-next">Practise · Hanazatra (${u.ex.length} exercises)</button></div>`;
  } else if (SB.step === 1) {
    const e = u.ex[SB.i], n = u.ex.length;
    h += `<div class="stack"><div class="row" style="justify-content:space-between"><p class="kicker">Exercise ${SB.i + 1} of ${n}</p><span class="muted" style="font-size:.85rem">${SB.right} correct</span></div>${sbExerciseHTML(e)}`;
    if (SB.answered) {
      const model = e.t === "mc" ? null : e.t === "order" ? e.a : e.a[0];
      h += `<div class="fb ${SB.ok ? "ok" : "no"}"><b>${SB.ok ? "Correct! · Marina!" : "Not quite · Tsy dia marina"}</b>${model && !SB.ok ? `<p><b>Correct:</b> ${esc(model)}</p>` : ""}${model && SB.ok && SB.self ? "<p>Counted as correct.</p>" : ""}</div>
       ${!SB.ok && (e.t === "fix" || e.t === "combine") ? `<button class="link" data-act="sb-self" style="align-self:flex-start">My answer means the same and is correct, count it</button>` : ""}
       ${model ? `<div class="row"><button class="iconbtn" data-act="sb-saymodel">${ICON.spk} Listen to the correct sentence</button></div>` : ""}
       <button class="btn primary" data-act="sb-ex">${SB.i === n - 1 ? "Next: your turn" : "Next exercise"}</button>`;
    }
    h += `</div>`;
  } else if (SB.step === 2) {
    const o = SB.own, canTry = !o.res || (!o.res.correct && o.tries < 3);
    h += `<div class="stack"><div><p class="kicker">Your turn · Anjaranao</p><h2>${esc(u.task)}</h2></div><p class="pattern">${esc(u.pattern)}</p>
     <textarea id="sbOwn" class="textarea" style="min-height:96px" ${o.res ? "readonly" : ""} placeholder="Write here…">${esc(o.text)}</textarea>
     <div aria-live="polite">${o.res ? (o.res.correct ? `<div class="fb ok"><b>Correct! · Marina!</b><p>${esc(o.res.why)}<span class="mg">${esc(o.res.mg)}</span></p></div>` : `<div class="fb no"><b>Not quite</b><p>${esc(o.res.why)}<span class="mg">${esc(o.res.mg)}</span></p></div><p class="corr">${esc(o.res.corrected)}</p>`) : o.err ? `<p class="muted">${esc(o.err)}</p>` : ""}</div>
     ${!o.res ? `<button class="btn primary" data-act="sb-own">${o.err ? "Check again" : "Check with the teacher"}${o.tries ? ` · try ${o.tries + 1} of 3` : ""}</button>` : canTry ? `<button class="btn primary" data-act="sb-owntry">Try again · try ${o.tries + 1} of 3</button>` : ""}
     <button class="${o.res && (o.res.correct || o.tries >= 3) ? "btn primary" : "link"}" data-act="sb-next" ${o.res && (o.res.correct || o.tries >= 3) ? "" : 'style="align-self:center"'}>${o.res ? "Finish · Vita" : "Skip and finish"}</button></div>`;
  } else {
    const score = Math.round(100 * SB.right / u.ex.length);
    if (!SB.saved) { S.sb = S.sb || {}; const prev = S.sb[SB.key]; S.sb[SB.key] = { score: Math.max(score, prev ? prev.score : 0), at: today(), tries: (prev ? prev.tries : 0) + 1 }; markDay(); save(); SB.saved = true; }
    const nx = sbNext();
    h += `<div class="stack" style="text-align:center;align-items:center"><p class="kicker">${esc(u.title)}</p><span class="score-ring">${score}%</span><h2>${score >= 70 ? "Unit done ✓" : "Not done yet"}</h2>
     <p class="muted">${SB.right}/${u.ex.length} exercises correct${score < 70 ? ". Read the explanation again and repeat to reach 70%." : ""}<span class="mg">${score >= 70 ? "Vita!" : "Avereno mba hahatratra 70%."}</span></p></div>
     <div class="stack" style="margin-top:18px">${nx ? `<button class="btn primary" data-act="sb-open" data-id="${nx.id}">${nx.id === u.id ? "Repeat this unit" : `Next: ${esc(nx.title)}`}</button>` : ""}
     <button class="btn" data-act="sb-home" style="width:100%;min-height:50px">All units</button></div>`;
  }
  view.innerHTML = h;
}
function sbAnswerCheck(text, answers) { const t = normAns(text); return answers.some((a) => normAns(a) === t); }
async function sbOwnCheck() {
  const o = SB.own, box = document.getElementById("sbOwn"), text = box.value.trim(); o.text = box.value;
  if (text.split(/\s+/).length < 3) { o.err = "Write a full sentence first."; return sbRender(); }
  try {
    const r = await aiCall("sentence", { level: S.level || 1, grammar: SB.u.title + " (" + SB.u.pattern + ")", task: SB.u.task, sentence: text });
    o.tries++; o.err = null; o.res = { correct: !!r.correct, corrected: String(r.corrected || ""), why: String(r.why || ""), mg: String(r.mg || "") };
    if (!o.res.correct && o.res.corrected) S.mistakes = [`${text} → ${o.res.corrected}`, ...(S.mistakes || [])].slice(0, 20);
    save();
  } catch (e) { o.err = aiMsg(e)[0] + " Your sentence is kept."; }
  sbRender();
}
document.addEventListener("click", (ev) => {
  const b = ev.target.closest("[data-act]"); if (!b) return; const a = b.dataset.act; if (!a.startsWith("sb-")) return;
  const e = SB && SB.u.ex[SB.i];
  switch (a) {
    case "sb-home": sbHome(); break;
    case "sb-open": sbOpen(b.dataset.id); break;
    case "sb-say": say(SB.u.examples[+b.dataset.i]); break;
    case "sb-next": SB.step++; sbRender(); break;
    case "sb-mc": if (SB.answered) break; SB.pick = +b.dataset.i; SB.answered = true; SB.ok = SB.pick === e.a; if (SB.ok) SB.right++; sbRender(); break;
    case "sb-pick": if (SB.answered) break; SB.built.push(+b.dataset.w); sbRender(); break;
    case "sb-unpick": if (SB.answered) break; SB.built.splice(+b.dataset.p, 1); sbRender(); break;
    case "sb-reset": SB.built = []; sbRender(); break;
    case "sb-checkorder": { const c = SB.chips, s = SB.built.map((i) => c.words[i]).join(" ") + c.end; SB.answered = true; SB.ok = sbAnswerCheck(s, [e.a, ...(e.alt || [])]); if (SB.ok) SB.right++; sbRender(); break; }
    case "sb-checktype": { const v = document.getElementById("sbAns").value; if (!v.trim()) break; SB.typed = v; SB.answered = true; SB.ok = sbAnswerCheck(v, e.a); if (SB.ok) SB.right++; sbRender(); break; }
    case "sb-self": if (!SB.ok) { SB.ok = true; SB.self = true; SB.right++; sbRender(); } break;
    case "sb-saymodel": say(e.t === "order" ? e.a : e.a[0], false); break;
    case "sb-ex": SB.answered = false; SB.ok = false; SB.self = false; SB.pick = null; SB.typed = ""; SB.chips = null; SB.built = []; SB.i++; if (SB.i >= SB.u.ex.length) SB.step = 2; sbRender(); break;
    case "sb-own": sbOwnCheck(); break;
    case "sb-owntry": SB.own.res = null; sbRender(); break;
  }
});
document.addEventListener("input", (ev) => { if (ev.target.id === "sbAns" && SB) SB.typed = ev.target.value; if (ev.target.id === "sbOwn" && SB) SB.own.text = ev.target.value; });

/* ================= HARDER SET (Level 3 and up) =================
   Same 16 units, with an extra point for intermediate learners, 8 harder exercises
   (longer sentences, two mistakes, three sentences to join, Malagasy → English word order)
   and a longer final task. Progress is kept separately (unit id + "h"). */
const SB_HARD = {
  sb01: { plus: "At your level, subjects and objects get longer, but the order stays the same. The whole subject group comes first: The new driver from Toamasina | delivered | forty bales | to our warehouse | yesterday.",
    plusMg: "Na lava aza ny mpanao sy ny fameno, tsy miova ny filaharana: ny vondron'ny mpanao manontolo no voalohany.",
    ex: [
      { t: "order", a: "The new driver from Toamasina delivered forty bales to our warehouse yesterday.", alt: ["Yesterday the new driver from Toamasina delivered forty bales to our warehouse."] },
      { t: "order", a: "Every Monday, our manager checks the stock and sends a report to the director.", alt: ["Our manager checks the stock every Monday and sends a report to the director."] },
      { t: "fix", q: "Arrived yesterday the containers from Korea at the port.", a: ["The containers from Korea arrived at the port yesterday.", "Yesterday the containers from Korea arrived at the port.", "Yesterday, the containers from Korea arrived at the port."] },
      { t: "fix", q: "Very important is this order for our company.", a: ["This order is very important for our company."] },
      { t: "mc", q: "Which sentence is correct?", o: ["Need the customers their furniture before Friday.", "The customers need their furniture before Friday.", "The customers their furniture need before Friday.", "Their furniture the customers need before Friday."], a: 1 },
      { t: "order", mg: "Mamaky ny tatitra isa-maraina ny talen'ny orinasa.", a: "The company director reads the report every morning.", alt: ["Every morning the company director reads the report."] },
      { t: "fix", q: "Sold our shop last month more than two hundred jackets.", a: ["Our shop sold more than two hundred jackets last month.", "Last month our shop sold more than two hundred jackets.", "Last month, our shop sold more than two hundred jackets."] },
      { t: "order", mg: "Mividy entana amin'ny mpamatsy any Korea izahay.", a: "We buy goods from a supplier in Korea." },
    ],
    task: "Write two sentences about your company's work. Each one must have who + does what + what + where or when." },
  sb02: { plus: "With several describing words, the usual order is opinion – size – age – colour – material + noun: a nice big old red wooden table. A noun used as a describing word stays singular: a shoe shop, a two-hour meeting, a ten-kilo bag.",
    plusMg: "Raha maro ny mpamaritra: hevitra – habe – taona – loko – akora + anarana. Ny anarana ampiasaina ho mpamaritra dia tsy asiana -s: a shoe shop, a two-hour meeting.",
    ex: [
      { t: "order", a: "We sold three large wooden tables to a new customer." },
      { t: "fix", q: "We need two trucks bigs for the deliveries news.", a: ["We need two big trucks for the new deliveries."] },
      { t: "fix", q: "We had a two-hours meeting with the supplier.", a: ["We had a two-hour meeting with the supplier."] },
      { t: "mc", q: "Choose the natural order.", o: ["a cotton white new shirt", "a new white cotton shirt", "a white new cotton shirt", "a cotton new white shirt"], a: 1 },
      { t: "fix", q: "She works in a shop of shoes in Analakely.", a: ["She works in a shoe shop in Analakely."] },
      { t: "order", mg: "Nividy fiara kely mena izy.", a: "She bought a small red car." },
      { t: "fix", q: "The customers was very happies with the cheaps prices.", a: ["The customers were very happy with the cheap prices."] },
      { t: "mc", q: "Which is correct?", o: ["a ten-kilos bag", "a ten-kilo bag", "a ten kilos's bag", "a bag ten-kilo"], a: 1 },
    ],
    task: "Describe a product you sell in two sentences, using at least three describing words in the right order." },
  sb03: { plus: "Some nouns have no plural and no a/an: information, advice, furniture, equipment, money, luggage. Use some, much or a lot of with them. For things in general, use no article: Life is expensive. Rice is our main food.",
    plusMg: "Misy anarana tsy asiana -s ary tsy asiana a/an: information, advice, furniture, equipment, money. Ampiasao ny some, much, a lot of. Ho an'ny zavatra amin'ny ankapobeny, tsy misy article: Life is expensive.",
    ex: [
      { t: "fix", q: "Can you give me an advice about the furnitures?", a: ["Can you give me some advice about the furniture?", "Can you give me advice about the furniture?", "Can you give me a piece of advice about the furniture?"] },
      { t: "mc", q: "We don't have ___ information about the new supplier.", o: ["many", "much", "a", "an"], a: 1 },
      { t: "fix", q: "The life is expensive in Antananarivo.", a: ["Life is expensive in Antananarivo."] },
      { t: "fix", q: "We received new equipments yesterday.", a: ["We received new equipment yesterday."] },
      { t: "mc", q: "___ customers who complained yesterday came back today.", o: ["A", "The", "(nothing)"], a: 1 },
      { t: "fix", q: "She is engineer and her husband is a accountant.", a: ["She is an engineer and her husband is an accountant.", "She is an engineer, and her husband is an accountant."] },
      { t: "order", a: "The money that we received last week is in the bank." },
      { t: "mc", q: "Which sentence is correct?", o: ["The rice is the most important food in Madagascar.", "Rice is the most important food in Madagascar.", "A rice is the most important food in Madagascar."], a: 1 },
    ],
    task: "Write two sentences about your work using these words correctly: information, money, the, a or an." },
  sb04: { plus: "The full order is who + does + what + how + where + when. Words saying how (well, quickly, carefully) go after the object, never between the verb and the object: He speaks English very well, not He speaks very well English.",
    plusMg: "Ny filaharana feno: iza + manao + inona + ahoana + aiza + rahoviana. Ny teny milaza ny fomba (well, quickly) dia aorian'ny fameno: He speaks English very well.",
    ex: [
      { t: "order", a: "The workers loaded the truck quickly at the warehouse this morning.", alt: ["This morning the workers loaded the truck quickly at the warehouse.", "The workers quickly loaded the truck at the warehouse this morning."] },
      { t: "fix", q: "We every year in December our prices increase.", a: ["We increase our prices every year in December.", "Every year in December, we increase our prices.", "Every year in December we increase our prices."] },
      { t: "fix", q: "He speaks very well English.", a: ["He speaks English very well."] },
      { t: "mc", q: "Choose the best sentence.", o: ["I yesterday met the supplier at the airport.", "I met yesterday the supplier at the airport.", "I met the supplier at the airport yesterday.", "At the airport I met yesterday the supplier."], a: 2 },
      { t: "order", mg: "Nandoa ny faktiora tany amin'ny banky omaly hariva aho.", a: "I paid the invoice at the bank yesterday evening." },
      { t: "fix", q: "They carefully at the port checked the containers.", a: ["They checked the containers carefully at the port.", "They carefully checked the containers at the port."] },
      { t: "order", a: "Our team usually works very hard at the end of the month." },
      { t: "fix", q: "She drives every day her car to work.", a: ["She drives her car to work every day.", "Every day she drives her car to work.", "Every day, she drives her car to work."] },
    ],
    task: "Write two sentences about your week: who + does what + how + where + when." },
  sb05: { plus: "When the sentence has have, be, can, will or should, move that word before the person to make a question: Have you finished? Can she come? Is the shop open? Never add do to these: not Does she can come?",
    plusMg: "Raha misy have, be, can, will na should, afindrao eo alohan'ny mpanao io teny io: Have you finished? Can she come? Aza ampiana do: tsy hoe Does she can come?",
    ex: [
      { t: "fix", q: "You have finished the report?", a: ["Have you finished the report?"] },
      { t: "fix", q: "Does the supplier can deliver on Monday?", a: ["Can the supplier deliver on Monday?"] },
      { t: "fix", q: "Are you agree with the new prices?", a: ["Do you agree with the new prices?"] },
      { t: "order", a: "Have the new bales from Korea arrived yet?" },
      { t: "mc", q: "___ they working on the order right now?", o: ["Do", "Are", "Have", "Does"], a: 1 },
      { t: "fix", q: "Did the driver arrived on time this morning?", a: ["Did the driver arrive on time this morning?"] },
      { t: "order", mg: "Efa nandoa ny vola ve ny mpanjifa?", a: "Has the customer paid the money?" },
      { t: "mc", q: "Which question is correct?", o: ["Should we to call the client?", "Do we should call the client?", "Should we call the client?", "We should call the client?"], a: 2 },
    ],
    task: "Write three yes/no questions for a supplier, starting with Have, Can and Did." },
  sb06: { plus: "Use only one negative word in a sentence: I didn't see anything or I saw nothing, never I didn't see nothing. With the present perfect, use not … yet: The truck hasn't arrived yet. After can't, won't and didn't, use the plain verb.",
    plusMg: "Teny fandavana iray ihany isaky ny fehezanteny: I didn't see anything na I saw nothing. Amin'ny present perfect: hasn't … yet. Aorian'ny can't, won't, didn't: matoanteny tsotra.",
    ex: [
      { t: "fix", q: "I haven't never seen this product.", a: ["I have never seen this product.", "I haven't ever seen this product."] },
      { t: "fix", q: "Nobody don't want to work on Sunday.", a: ["Nobody wants to work on Sunday."] },
      { t: "fix", q: "We didn't sold nothing yesterday.", a: ["We didn't sell anything yesterday.", "We sold nothing yesterday."] },
      { t: "mc", q: "The supplier ___ replied to my email yet.", o: ["didn't", "hasn't", "doesn't", "isn't"], a: 1 },
      { t: "fix", q: "She can't to come tomorrow.", a: ["She can't come tomorrow."] },
      { t: "order", a: "We won't receive the new stock until next month." },
      { t: "fix", q: "There isn't no money in the cash box.", a: ["There isn't any money in the cash box.", "There is no money in the cash box."] },
      { t: "order", mg: "Tsy mbola tonga ny kamiao.", a: "The truck hasn't arrived yet." },
    ],
    task: "Write three sentences about problems at work: one with hasn't … yet, one with didn't and one with won't." },
  sb07: { plus: "When the question word is the subject, there is no do/does/did: Who called you? (someone called you). But: Who did you call? (you called someone). A preposition goes at the end: Who did you speak to? What is it for?",
    plusMg: "Raha ny teny fanontaniana no mpanao, tsy misy do/does/did: Who called you? Fa: Who did you call? Ny mpampitohy (to, for, with) dia eo amin'ny farany: Who did you speak to?",
    ex: [
      { t: "fix", q: "Who did call you this morning?", a: ["Who called you this morning?"] },
      { t: "fix", q: "What means this word?", a: ["What does this word mean?"] },
      { t: "order", a: "Who did you speak to at the bank?" },
      { t: "mc", q: "How long ___ for this company?", o: ["are you working", "have you worked", "you have worked", "do you work"], a: 1 },
      { t: "fix", q: "Why you didn't call the client?", a: ["Why didn't you call the client?"] },
      { t: "fix", q: "How much cost these shoes?", a: ["How much do these shoes cost?", "How much are these shoes?"] },
      { t: "mc", q: "Which question asks who did the calling?", o: ["Who did the manager call?", "Who called the manager?", "Who the manager called?"], a: 1 },
      { t: "order", mg: "Rahoviana no halefa ny entana?", a: "When will the goods be sent?" },
    ],
    task: "Write three questions you could ask a client: one with Who, one with How long and one with Why." },
  sb08: { plus: "Also useful at your level: It is + adjective + to … (It is important to check every bale), There has been / There will be for the past and future, and It takes + time + to … (It takes three days to get there).",
    plusMg: "Ampiasaina koa: It is important to …; There has been / There will be (lasa sy ho avy); It takes + fotoana + to … (It takes three days to get there).",
    ex: [
      { t: "fix", q: "Is important to check every bale.", a: ["It is important to check every bale."] },
      { t: "fix", q: "Will be a meeting tomorrow at nine.", a: ["There will be a meeting tomorrow at nine."] },
      { t: "fix", q: "Takes three days to get the goods from the port.", a: ["It takes three days to get the goods from the port."] },
      { t: "mc", q: "___ been a problem with the delivery.", o: ["It has", "There has", "There have", "It have"], a: 1 },
      { t: "order", a: "It is not easy to find a reliable supplier." },
      { t: "fix", q: "Have been many problems with this machine since January.", a: ["There have been many problems with this machine since January."] },
      { t: "mc", q: "___ too late to call the bank now.", o: ["There is", "It is", "Is", "It has"], a: 1 },
      { t: "order", mg: "Sarotra ny mahita mpiasa mahay.", a: "It is difficult to find skilled workers." },
    ],
    task: "Write two sentences about your workplace: one starting with It is important to … and one with There has been or There will be." },
  sb09: { plus: "With helper verbs (have, be, can, will), the frequency word goes after the first helper: I have always lived here. She is still working. We can never find it. Already goes before the main verb: She has already finished.",
    plusMg: "Raha misy matoanteny mpanampy (have, be, can), aorian'ny mpanampy voalohany ny teny toy ny always, still, never: I have always lived here. She is still working.",
    ex: [
      { t: "fix", q: "We have always to check the stock.", a: ["We always have to check the stock."] },
      { t: "fix", q: "She has finished already the report.", a: ["She has already finished the report."] },
      { t: "fix", q: "He can't never come on time.", a: ["He can never come on time.", "He can't ever come on time."] },
      { t: "order", a: "The supplier has never sent us the wrong products." },
      { t: "mc", q: "We ___ go to the bank on Sundays.", o: ["hardly ever", "hardly never", "ever hardly", "never hardly"], a: 0 },
      { t: "fix", q: "I still am waiting for the payment.", a: ["I am still waiting for the payment."] },
      { t: "fix", q: "Usually is the warehouse busy on Mondays.", a: ["The warehouse is usually busy on Mondays.", "Usually the warehouse is busy on Mondays.", "Usually, the warehouse is busy on Mondays."] },
      { t: "order", a: "Our customers don't usually pay by card." },
    ],
    task: "Write about your work habits in two or three sentences, using always, still and hardly ever." },
  sb10: { plus: "Don't chain many so's and don't start sentences with And. Join two ideas well, then start a new sentence. In formal writing, use therefore or as a result instead of so.",
    plusMg: "Aza ampiasaina imbetsaka ny so, ary aza manomboka fehezanteny amin'ny And. Amin'ny fanoratana ofisialy, ampiasao ny therefore na as a result.",
    ex: [
      { t: "combine", q: ["The prices are low.", "The quality is good.", "Many customers buy from us."], use: "and … so", a: ["The prices are low and the quality is good, so many customers buy from us."] },
      { t: "combine", q: ["We ordered 200 bales.", "Only 150 arrived.", "We called the supplier."], use: "but … so", a: ["We ordered 200 bales, but only 150 arrived, so we called the supplier."] },
      { t: "mc", q: "The road was blocked; ___, the delivery was late.", o: ["therefore", "but", "and", "because"], a: 0 },
      { t: "fix", q: "The truck was old so it was cheap, so we bought it, so we saved money.", a: ["The truck was old and cheap, so we bought it and saved money."] },
      { t: "mc", q: "Which is better in writing?", o: ["I like the new shop. And I like the staff too.", "I like the new shop and the staff.", "And I like the new shop and the staff."], a: 1 },
      { t: "order", a: "Sales were low in June, but they improved in July." },
      { t: "mc", q: "Which sentence is punctuated correctly?", o: ["It rained all day so, the market was quiet.", "It rained all day, so the market was quiet.", "It rained all day so the market, was quiet."], a: 1 },
      { t: "combine", q: ["She speaks Malagasy.", "She speaks French.", "She is learning English."], use: "and (twice)", a: ["She speaks Malagasy and French, and she is learning English.", "She speaks Malagasy and French and she is learning English."] },
    ],
    task: "Write three sentences about last month at work, using and, but and so (or therefore)." },
  sb11: { plus: "because + a sentence, because of + a noun: because it rained / because of the rain. Also: while, until, as soon as, before, after. After when, until, as soon as, before and after, use the present tense even for the future.",
    plusMg: "because + fehezanteny, because of + anarana: because it rained / because of the rain. Aorian'ny when, until, as soon as, before, after: ankehitriny na dia ho avy aza.",
    ex: [
      { t: "fix", q: "We closed the shop because of it was raining.", a: ["We closed the shop because it was raining.", "We closed the shop because of the rain."] },
      { t: "combine", q: ["The goods arrive.", "I will call you."], use: "As soon as", a: ["As soon as the goods arrive, I will call you.", "I will call you as soon as the goods arrive."] },
      { t: "fix", q: "I will wait until he will come.", a: ["I will wait until he comes."] },
      { t: "mc", q: "The phone rang ___ I was counting the money.", o: ["while", "until", "because of", "as soon"], a: 0 },
      { t: "combine", q: ["You leave the warehouse.", "Check that the door is locked."], use: "Before", a: ["Before you leave the warehouse, check that the door is locked.", "Check that the door is locked before you leave the warehouse."] },
      { t: "mc", q: "Which is a complete, correct sentence?", o: ["Because the price was too high. The client refused.", "Because the price was too high, the client refused.", "The client refused. Because the price was too high."], a: 1 },
      { t: "order", a: "We couldn't deliver the furniture because of the heavy rain." },
      { t: "mc", q: "After she ___ the report, she sent it to the director.", o: ["finishes", "had finished", "will finish"], a: 1 },
    ],
    task: "Write two sentences about your work: one with as soon as and one with because of." },
  sb12: { plus: "whose = belonging to (the supplier whose prices are low); where = a place (the warehouse where we keep the bales). Extra information goes between commas, with who or which, never that: Mr Rakoto, who has worked here for ten years, … Don't repeat the object: not the products that we ordered them.",
    plusMg: "whose = an'i (the supplier whose prices are low); where = toerana. Fanazavana fanampiny: misy faingo, who na which fa tsy that. Aza averina ny them: tsy hoe the products that we ordered them.",
    ex: [
      { t: "combine", q: ["This is the supplier.", "His prices are the lowest."], use: "whose", a: ["This is the supplier whose prices are the lowest."] },
      { t: "combine", q: ["This is the warehouse.", "We keep the bales there."], use: "where", a: ["This is the warehouse where we keep the bales."] },
      { t: "fix", q: "The client which called yesterday wants a discount.", a: ["The client who called yesterday wants a discount.", "The client that called yesterday wants a discount."] },
      { t: "combine", q: ["Mr Rakoto is our best driver.", "He has worked here for ten years."], use: "who (with commas)", a: ["Mr Rakoto, who has worked here for ten years, is our best driver."] },
      { t: "mc", q: "The report ___ you sent me has some mistakes.", o: ["who", "whose", "that", "where"], a: 2 },
      { t: "fix", q: "The products that we ordered them last month are late.", a: ["The products that we ordered last month are late.", "The products we ordered last month are late.", "The products which we ordered last month are late."] },
      { t: "order", a: "The woman whose shop is next to ours sells shoes." },
      { t: "fix", q: "Toamasina, that is a big port, is very busy.", a: ["Toamasina, which is a big port, is very busy."] },
    ],
    task: "Write two sentences about people and places at your work, one with whose and one with where." },
  sb13: { plus: "despite / in spite of + a noun or -ing (despite the rain, despite being late); even though + a sentence (even though it rained); whereas compares two things; nevertheless is a formal however.",
    plusMg: "despite / in spite of + anarana na -ing (despite the rain); even though + fehezanteny; whereas: mampitaha; nevertheless: however ofisialy.",
    ex: [
      { t: "fix", q: "Despite it was raining, we opened the shop.", a: ["Despite the rain, we opened the shop.", "Although it was raining, we opened the shop.", "Even though it was raining, we opened the shop.", "In spite of the rain, we opened the shop.", "Despite the fact that it was raining, we opened the shop."] },
      { t: "combine", q: ["The price was high.", "The client accepted the offer."], use: "Despite", a: ["Despite the high price, the client accepted the offer.", "The client accepted the offer despite the high price."] },
      { t: "mc", q: "___ he works hard, he never gets a promotion.", o: ["Despite", "Even though", "However", "In spite of"], a: 1 },
      { t: "fix", q: "Although we lost money, but we continued.", a: ["Although we lost money, we continued.", "We lost money, but we continued."] },
      { t: "combine", q: ["Sales increased.", "Profit fell because of high costs."], use: "However (new sentence)", a: ["Sales increased. However, profit fell because of high costs."] },
      { t: "mc", q: "Our shop sells new clothes, ___ theirs sells second-hand clothes.", o: ["despite", "whereas", "however", "even though"], a: 1 },
      { t: "order", a: "In spite of the delay, the client was satisfied." },
      { t: "mc", q: "Which is punctuated correctly?", o: ["The supplier is reliable. Nevertheless he is expensive.", "The supplier is reliable. Nevertheless, he is expensive.", "The supplier is reliable, nevertheless he is expensive."], a: 1 },
    ],
    task: "Compare two options for your company in two sentences, using despite and whereas." },
  sb14: { plus: "unless = if not (Unless you pay, … = If you don't pay, …). For a past mistake: If + had + past participle, would have + past participle (If we had checked, we would have seen it). Past cause, present result: If she had studied earlier, she would have a better job now.",
    plusMg: "unless = raha tsy. Fahadisoana taloha: If + had + past participle, would have + past participle. Antony taloha, vokatra ankehitriny: If she had studied earlier, she would have a better job now.",
    ex: [
      { t: "fix", q: "If we will not pay today, the supplier will stop the delivery.", a: ["If we don't pay today, the supplier will stop the delivery.", "Unless we pay today, the supplier will stop the delivery."] },
      { t: "combine", q: ["You order before Friday.", "You won't get the goods this month."], use: "Unless", a: ["Unless you order before Friday, you won't get the goods this month.", "You won't get the goods this month unless you order before Friday."] },
      { t: "mc", q: "If I ___ you, I would ask for a discount.", o: ["am", "were", "will be", "would be"], a: 1 },
      { t: "fix", q: "If we had left earlier, we would arrive on time.", a: ["If we had left earlier, we would have arrived on time."] },
      { t: "order", a: "If the truck breaks down, we will use another one." },
      { t: "mc", q: "If she had studied English earlier, she ___ a better job now.", o: ["would have", "would have had", "will have", "had"], a: 0 },
      { t: "fix", q: "I would buy the warehouse if I would have enough money.", a: ["I would buy the warehouse if I had enough money."] },
      { t: "combine", q: ["We didn't check the bales.", "We didn't see the damage."], use: "If (a past mistake)", a: ["If we had checked the bales, we would have seen the damage."] },
    ],
    task: "Write one sentence with unless and one about a past mistake (If I had …, I would have …)." },
  sb15: { plus: "Other polite starts: Could you let me know …, I wonder …, Would you mind telling me …, Do you know if … In reported questions the tense moves back: Where is the invoice? → She asked where the invoice was. Is he coming? → She asked if he was coming.",
    plusMg: "Fanombohana am-panajana hafa: Could you let me know …, I wonder …, Would you mind telling me …, Do you know if … Amin'ny fanontaniana averina lazaina, miverina any aoriana ny fotoana: She asked where the invoice was.",
    ex: [
      { t: "fix", q: "Could you tell me what time does the bank close?", a: ["Could you tell me what time the bank closes?"] },
      { t: "fix", q: "I wonder why did the client cancel the order.", a: ["I wonder why the client cancelled the order.", "I wonder why the client canceled the order."] },
      { t: "combine", q: ["Is the warehouse open on Saturday?"], use: "Do you know if …", a: ["Do you know if the warehouse is open on Saturday?"] },
      { t: "combine", q: ["How much will the transport cost?"], use: "Could you let me know …", a: ["Could you let me know how much the transport will cost?"] },
      { t: "mc", q: "She asked me ___.", o: ["where was the invoice", "where the invoice was", "where is the invoice", "where the invoice is it"], a: 1 },
      { t: "fix", q: "He asked me do I want a receipt.", a: ["He asked me if I wanted a receipt.", "He asked me whether I wanted a receipt."] },
      { t: "order", a: "Would you mind telling me when the shipment will arrive?" },
      { t: "combine", q: ["Why has the price gone up?"], use: "I would like to know …", a: ["I would like to know why the price has gone up."] },
    ],
    task: "Write a short polite email (2–3 sentences) asking a supplier two questions, using Could you let me know … and Do you know if …" },
  sb16: { plus: "Keep lists in the same form (reading, cooking and swimming; to increase, reduce and train). Every sentence needs a subject and a full verb: Because the client was angry. is not a full sentence. However and Therefore start a new sentence or follow a semicolon.",
    plusMg: "Ataovy mitovy endrika ny lisitra (reading, cooking and swimming). Tsy maintsy manana mpanao sy matoanteny feno ny fehezanteny. However sy Therefore: fehezanteny vaovao na aorian'ny semicolon (;).",
    ex: [
      { t: "fix", q: "We checked the bales, we counted them, we stored them in the warehouse.", a: ["We checked the bales, counted them and stored them in the warehouse.", "We checked the bales, counted them, and stored them in the warehouse."] },
      { t: "mc", q: "Which is a complete sentence?", o: ["Because the client was angry about the late delivery.", "The client was angry about the late delivery.", "When the client, angry about the late delivery."], a: 1 },
      { t: "fix", q: "She likes reading, to cook and swimming.", a: ["She likes reading, cooking and swimming.", "She likes reading, cooking, and swimming."] },
      { t: "mc", q: "Sales went up by 20%. ___, we hired two new staff.", o: ["Despite this", "As a result", "Although", "Because"], a: 1 },
      { t: "mc", q: "Which is correct?", o: ["The meeting was long however we made good decisions.", "The meeting was long. However, we made good decisions.", "The meeting was long, however we made good decisions."], a: 1 },
      { t: "order", a: "First, we unload the truck. Then, we check every bale." },
      { t: "fix", q: "Our goal is to increase sales, reducing costs and to train staff.", a: ["Our goal is to increase sales, reduce costs and train staff.", "Our goal is to increase sales, to reduce costs and to train staff.", "Our goal is to increase sales, reduce costs, and train staff."] },
      { t: "mc", q: "Which is the clearest?", o: ["The truck, which was late because of the rain, which was heavy, arrived at nine.", "Because of the heavy rain, the truck arrived late, at nine.", "The truck arrived at nine late because the rain heavy."], a: 1 },
    ],
    task: "In 4–5 clear sentences, explain a problem at work and how you solved it. Use First, Then, However and As a result." },
};
