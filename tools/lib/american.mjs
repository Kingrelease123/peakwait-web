/**
 * American English, for everything a skier reads.
 *
 * Bill, 2026-11-11: "also keep seeing british english in the writing... on the app store it says
 * recognise for example". The 1.5.1 What's New went live with "recognised" in it, the lift list's
 * help said "colour" three times, and four website articles and the Product Hunt first comment had
 * the same habit. PeakWait is sold to skiers in Colorado; the copy is American.
 *
 * `britishWords(text)` returns every British spelling in a piece of text, each with the American
 * word to use. It is a list of known words, not a guess at a pattern: an open "-ise" rule would flag
 * Lake Louise, Sunrise and Paradise, and the daily guide writer rejects a guide on any hit.
 *
 * A few words are also common in place names (Grey Mountain, Town Centre, Egyptian Theatre). Those
 * are flagged only in lower case, so a name stays as its owner spells it.
 *
 * What it cannot see: British wording that is spelled the same in both countries ("car park",
 * "at the weekend", "queue up"), and any word not on the list. Add words as they turn up.
 *
 * The same file lives in both repos: peakwait `scripts/lib/american.mjs` and peakwait-web
 * `tools/lib/american.mjs`. `node scripts/check_spelling.mjs` says so when the two differ.
 */

// Verbs that end -ise in Britain and -ize in America. Each also matches -ised, -ising, -isation, -iser.
const IZE = `agon apolog author capital categor central character colon computer critic crystall custom
  digit dramat econom emphas energ epitom equal familiar fantas final formal galvan general global
  harmon ideal incentiv initial item legal local material maxim memor mesmer minim mobil modern monet
  national natural neutral normal optim organ patron penal personal polar popular priorit privat
  public random rational real recogn revolution romantic scrutin serial social special stabil
  standard steril subsid summar symbol sympath synchron tantal theor trivial union util vandal verbal
  victim visual weapon winter`.split(/\s+/);

// [British pattern, American replacement]. `$1` carries the ending across.
const RULES = [
  [`(${IZE.join("|")})is(e|ed|es|ing|er|ers|ation|ations)`, "$1iz$2"],
  ["(anal|paral|catal)ys(e|ed|es|ing)", "$1yz$2"],
  ["(col|fav|flav|hon|behavi|neighb|rum|hum|lab|vap|arm|sav)our(\\w*)", "$1or$2"],
  ["(kilo|centi|milli)?metre(s?)", "$1meter$2"],
  ["litre(s?)", "liter$1"],
  ["(fib|calib|somb)re", "$1er"],
  ["manoeuvr(\\w*)", "maneuver$1"],
  ["(travel|cancel|label|model|level|signal|fuel|total|dial|channel|tunnel|funnel|counsel)l(ed|ing|er|ers|or|ors)", "$1$2"],
  ["marvellous", "marvelous"],
  ["jewellery", "jewelry"],
  ["skilful", "skillful"],
  ["wilful", "willful"],
  ["fulfil(s?)", "fulfill$1"],
  ["enrol(s?)", "enroll$1"],
  ["instalment(s?)", "installment$1"],
  ["licence(s?)", "license$1"],
  ["(def|off|pret)ence", "$1ense"],
  ["practis(e|ed|es|ing)", "practic$1"],
  ["programme(s?)", "program$1"],
  ["catalogue(s?)", "catalog$1"],
  ["whilst", "while"],
  ["amongst", "among"],
  ["learnt", "learned"],
  ["spelt", "spelled"],
  ["tyre(s?)", "tire$1"],
  ["cheque(s?)", "check$1"],
  ["judgement", "judgment"],
  ["ageing", "aging"],
  ["sceptic(\\w*)", "skeptic$1"],
  ["aluminium", "aluminum"],
  ["plough(s|ed|ing)?", "plow$1"],
  ["enquir(y|ies|e|ed|ing)", "inquir$1"],
  ["storey(s?)", "story$1"],
  ["kerb(s?)", "curb$1"],
  ["cosy", "cozy"],
  ["queueing", "queuing"],
  ["pyjamas", "pajamas"],
  ["speciality", "specialty"],
  ["anticlockwise", "counterclockwise"],
  ["fortnight", "two weeks"],
  ["maths", "math"],
  ["holidaymaker(s?)", "vacationer$1"],
  ["lorr(y|ies)", "truck"],
  ["petrol", "gas"],
  ["motorway(s?)", "highway$1"],
  ["postcode(s?)", "zip code$1"],
];

// Also the spelling of real places and buildings, so only the lower-case word is flagged.
const NAME_PRONE = [
  ["grey(s|ed|er|est|ish|ing)?", "gray$1"],
  ["centre(s?)", "center$1"],
  ["centred", "centered"],
  ["centring", "centering"],
  ["theatre(s?)", "theater$1"],
  ["harbour(\\w*)", "harbor$1"],
  ["endeavour(\\w*)", "endeavor$1"],
];

const compile = (rules, flags) => rules.map(([from, to]) => ({ re: new RegExp(`\\b(?:${from})\\b`, flags), one: new RegExp(`^(?:${from})$`, "i"), to }));
const ANY_CASE = compile(RULES, "gi");
const LOWER_ONLY = compile(NAME_PRONE, "g");

// The American word, in the same case as the British one it replaces.
function american(word, rule) {
  const fixed = word.toLowerCase().replace(rule.one, rule.to).replace(/\$\d/g, "");
  if (word === word.toUpperCase() && word.length > 1) return fixed.toUpperCase();
  return word[0] === word[0].toUpperCase() ? fixed[0].toUpperCase() + fixed.slice(1) : fixed;
}

/** Every British spelling in `text`: [{ word, american, index }], in reading order. */
export function britishWords(text) {
  const s = String(text ?? "");
  const hits = [];
  for (const rule of [...ANY_CASE, ...LOWER_ONLY]) {
    rule.re.lastIndex = 0;
    for (let m; (m = rule.re.exec(s)); ) hits.push({ word: m[0], american: american(m[0], rule), index: m.index });
  }
  return hits.sort((a, b) => a.index - b.index);
}

/** One line for an error message: `"colour" (use "color"), "grey" (use "gray")`. */
export function britishSummary(text) {
  const seen = new Map();
  for (const h of britishWords(text)) seen.set(h.word.toLowerCase(), `"${h.word}" (use "${h.american}")`);
  return [...seen.values()].join(", ");
}
