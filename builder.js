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
const sbScore = (id) => (S.sb && S.sb[id] ? S.sb[id].score : null);
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
   <p class="muted" style="font-size:.92rem">Learn how English sentences are built, step by step: word order, questions, joining ideas, clear professional sentences. ${done}/16 done.<span class="mg">Ianaro ny fanorenana fehezanteny anglisy, dingana tsikelikely.</span></p>
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
   <div><h1>Sentence Builder</h1><p class="muted">16 short units. Each one teaches one way English sentences are built, then you practise it. 70% = done.<span class="mg">Singa 16. Samy mampianatra fomba iray hanorenana fehezanteny izy, avy eo manao fanazarana ianao.</span></p></div>${h}</div>`;
}
function sbOpen(id) {
  const u = SB_UNITS.find((x) => x.id === id); if (!u) return;
  SB = { u, step: 0, i: 0, right: 0, answered: false, ok: false, typed: "", chips: null, built: [], own: { text: "", res: null, err: null, tries: 0 } };
  sbRender();
}
function sbExerciseHTML(e) {
  if (e.t === "mc") {
    return `<h2>${esc(e.q)}</h2><div class="opts">${e.o.map((o, i) => { let c = ""; if (SB.answered) { if (i === e.a) c = " right"; else if (i === SB.pick) c = " wrong"; } return `<button class="opt${c}" data-act="sb-mc" data-i="${i}" ${SB.answered ? "disabled" : ""}>${esc(o)}</button>`; }).join("")}</div>`;
  }
  if (e.t === "order") {
    if (!SB.chips) SB.chips = sbChips(e.a);
    const c = SB.chips, used = new Set(SB.built);
    return `<h2>Put the words in the right order.</h2><span class="mg">Alaharo tsara ireo teny ireo.</span>
     <div class="answerline" aria-label="Your sentence">${SB.built.map((wi, p) => `<button class="wchip on" data-act="sb-unpick" data-p="${p}" ${SB.answered ? "disabled" : ""}>${esc(c.words[wi])}</button>`).join("")}${SB.built.length ? `<span class="endmark">${esc(c.end)}</span>` : '<span class="muted" style="font-size:.9rem">Tap the words below</span>'}</div>
     <div class="wpool">${c.order.map((wi) => `<button class="wchip" data-act="sb-pick" data-w="${wi}" ${used.has(wi) || SB.answered ? "disabled" : ""}>${esc(c.words[wi])}</button>`).join("")}</div>
     ${SB.answered ? "" : `<div class="row"><button class="btn primary" data-act="sb-checkorder" ${SB.built.length === c.words.length ? "" : "disabled"} style="flex:1">Check · Hamarino</button><button class="btn ghost" data-act="sb-reset">Start again</button></div>`}`;
  }
  const lead = e.t === "fix" ? `<h2>Correct this sentence.</h2><span class="mg">Ahitsio ity fehezanteny ity.</span><p class="wrongbox">${esc(e.q)}</p>`
    : `<h2>Join into one${e.q.length === 1 ? " polite" : ""} sentence using <b>${esc(e.use)}</b>.</h2><span class="mg">Ataovy fehezanteny iray.</span>${e.q.map((x) => `<p class="wrongbox" style="border-color:var(--line);background:var(--surface)">${esc(x)}</p>`).join("")}`;
  return `${lead}<textarea id="sbAns" class="textarea" style="min-height:80px" autocapitalize="sentences" ${SB.answered ? "readonly" : ""} placeholder="Write the sentence…">${esc(SB.typed)}</textarea>
   ${SB.answered ? "" : '<button class="btn primary" data-act="sb-checktype">Check · Hamarino</button>'}`;
}
function sbRender() {
  window.scrollTo(0, 0); if (TTS) speechSynthesis.cancel();
  const u = SB.u, steps = ["Learn", "Practise", "Your turn", "Finish"];
  let h = `<div class="top"><button class="x" data-act="sb-home" aria-label="Back">${ICON.x}</button><div class="steps">${steps.map((s, i) => `<span class="${i < SB.step ? "done" : i === SB.step ? "now" : ""}">${s}</span>`).join("")}</div></div>`;
  if (SB.step === 0) {
    h += `<div class="stack"><div><p class="kicker">Unit ${SB_UNITS.indexOf(u) + 1} of 16 · ${SB_STAGES[u.stage]}</p><h1 style="margin-top:6px">${esc(u.title)}</h1></div>
     <p class="pattern">${esc(u.pattern)}</p>
     <section class="panel stack tight"><p>${esc(u.en)}</p><span class="mg">${esc(u.mg)}</span></section>
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
    if (!SB.saved) { S.sb = S.sb || {}; const prev = S.sb[u.id]; S.sb[u.id] = { score: Math.max(score, prev ? prev.score : 0), at: today(), tries: (prev ? prev.tries : 0) + 1 }; markDay(); save(); SB.saved = true; }
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
