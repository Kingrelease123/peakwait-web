#!/usr/bin/env node
/**
 * Daily guide writer: writes ONE new guide for peakwait.net/guides and builds the site, so the guides
 * keep coming without anyone remembering to write them. Runs from .github/workflows/daily-guide.yml.
 *
 * Why: the 2-a-week cadence was a person in a session, and it lapsed twice, 09-06 to 09-29 and 10-07
 * to 10-31, right as the season opened. Bill, 2026-10-31: "We should produce content everyday", "It
 * should be automated".
 *
 * What keeps a published-without-review guide honest:
 *   1. The topic comes from tools/guide-topics.json, in order, so there are no duplicates or drift.
 *   2. Facts about our resorts come from the live PeakWait API: lift names, lift count, opening date.
 *      Everything else must come from a page the model found, listed in `sources`, and this script
 *      fetches each one. At least two must load.
 *   3. The copy is checked against the house rules (no parentheses or em dashes, the banned words, no
 *      invented PeakWait statistics, a small set of HTML tags, length) and repaired once if it fails.
 *      A guide that still fails is not published; the job fails loudly and tomorrow tries again.
 *   4. The site build runs its own lint. If it fails, the new file is removed and the job fails.
 *
 * Env: ANTHROPIC_API_KEY; optional GUIDE_MODEL, PEAKWAIT_API, GUIDE_DRY_RUN=1 (print, write nothing),
 *      GUIDE_SLUG (write that topic instead of the next one).
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { callAnthropic } from "./lib/anthropic.mjs";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const API = (process.env.PEAKWAIT_API || "https://peakwait-api.fly.dev").replace(/\/$/, "");
const MODEL = process.env.GUIDE_MODEL || "claude-sonnet-5-5";
const DRY = Boolean(process.env.GUIDE_DRY_RUN);
const today = new Date().toISOString().slice(0, 10);

function fail(msg) {
  console.error(msg);
  process.exit(1);
}

// ── 1. Next topic ────────────────────────────────────────────────────────────────────────────────
const { topics } = JSON.parse(fs.readFileSync(path.join(ROOT, "tools", "guide-topics.json"), "utf8"));
const published = new Set([
  ...fs.readdirSync(path.join(ROOT, "guides"), { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name),
  ...fs.readdirSync(path.join(ROOT, "guides-src")).filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, "")),
]);
const topic = process.env.GUIDE_SLUG
  ? topics.find((t) => t.slug === process.env.GUIDE_SLUG)
  : topics.find((t) => !published.has(t.slug));
if (!topic) {
  console.log("Every topic in tools/guide-topics.json is published. Add more topics to keep the daily guide going.");
  process.exit(0);
}
if (published.has(topic.slug)) fail(`${topic.slug} is already published.`);
console.log(`Writing: ${topic.slug} (${topic.kind})`);

// ── 2. Live PeakWait facts ───────────────────────────────────────────────────────────────────────
const resorts = await fetch(`${API}/v1/resorts`).then((r) => (r.ok ? r.json() : fail(`GET /v1/resorts → HTTP ${r.status}`)));
let resort = null;
let facts = "";
if (topic.kind === "mountain") {
  resort = resorts.find((r) => r.slug === topic.resort);
  if (!resort) fail(`Topic ${topic.slug} names resort ${topic.resort}, which the API does not have.`);
  const lifts = await fetch(`${API}/v1/resorts/${resort.slug}/lifts`).then((r) => (r.ok ? r.json() : []));
  const named = (Array.isArray(lifts) ? lifts : lifts.lifts || []).filter((l) => !/^magic carpet lift$/i.test(l.name));
  facts += `Resort: ${resort.name}, ${resort.state}. Pass and owner: ${resort.ownershipGroup || "unknown"}. Website: ${resort.website || "unknown"}.
Lifts PeakWait tracks here: ${resort.liftCount}. Names and types: ${named.map((l) => `${l.name} ${l.type || ""}${l.capacityPerHour ? ` ${l.capacityPerHour} skiers per hour` : ""}`.trim()).join("; ")}.
Season, as the PeakWait app shows it today: ${resort.season?.label || "unknown"}.\n`;
}
const near = resorts
  .filter((r) => (topic.kind === "mountain" ? r.state === resort.state : r.state === "CO"))
  .map((r) => `- ${r.name}: ${r.season?.label || "unknown"}`)
  .join("\n");
facts += `Season status in the PeakWait app today for ${topic.kind === "mountain" ? resort.state : "Colorado"} resorts. "announced by the resort" is a date the resort announced; "projected" is only our estimate and must never be stated as a date the resort set:\n${near}\n`;

// ── 3. Ask ───────────────────────────────────────────────────────────────────────────────────────
const prompt = `Today is ${today}. Write one guide for peakwait.net/guides, the website of PeakWait, an iPhone app for ski lift waits.

Topic: ${topic.topic}
Angle: ${topic.angle}
URL slug: ${topic.slug}

What PeakWait is, and the only claims you may make about it: skiers on the mountain report live lift waits as Moving, Short, Busy or Long, and the app shows them on every lift with how fresh they are. It shows which lifts are open, points you to the best next chair, and its paid tier, PeakWait Plus, ranks where to ski today across nearby resorts by snow and waits. It covers 116 resorts in North and South America. Free to check lifts and report waits.

Live PeakWait data you may use as fact:
${facts}
Research: search the web for the rest. Use the resort's own site, local news and well known ski publications. Every specific fact that is not in the PeakWait data above, such as a lift name, a year, a distance, a road, a parking rule or an event, must come from a page you read, listed in "sources" with the fact it supports. Give at least three sources. If you cannot confirm something, leave it out.

Hard rules. A script checks every one and rejects the guide if any fails:
- No parentheses anywhere. No em dashes. Make an aside its own sentence or cut it.
- Never use these words: community, lifestyle, stoke, stoked, shred, disrupt, AI-powered, gaper, "the mountains are calling". Use "epic" only as the name of the Epic Pass.
- Call the queue a "wait", not a "line". The phrase "lift lines" may appear in the title, h1 and keywords because people search for it, and a few times in the body.
- Never invent PeakWait statistics. Do not write "PeakWait data shows", "our users report", average waits in minutes from PeakWait, or anything like it. Waits in minutes are fine only as what skiers commonly say or what a source says.
- No ticket prices.
- Do not mention testers, beta, bugs, or anything not finished. Never mention who made PeakWait.
- Bold only as a short label at the start of a list item, never for emphasis mid sentence.
- Section html uses only <p>, <ul>, <ol>, <li>, <strong>, <h3> and <a href="https://...">. No other tags, no attributes except href.
- Length: 1,000 to 1,800 words across dek, sections and FAQs. 5 to 7 sections. 4 to 6 FAQs.
- The last section is practical: what to actually do, including how PeakWait helps, in two or three concrete bullets. Mention PeakWait at most three times in the body.

Voice: a skier who has stood in these waits talking to a friend. Plain, specific, a little funny, second person. Concrete over poetic: lift names, times of day, which way to go. No marketing speak, no hype, no "in conclusion".

Fields:
- title: 40 to 68 characters, includes the main search phrase.
- description: 110 to 160 characters, a meta description that makes someone click.
- h1: the headline on the page, close to the title.
- keywords: 5 to 8 comma separated search phrases.
- dek: the opening paragraph, 2 to 4 sentences, plain text.
- hook: one sentence of at most 110 characters for the guide's card on /guides/.
- cta: h is a 3 to 7 word heading, p is one sentence inviting them to get the app.`;

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["title", "description", "h1", "keywords", "dek", "sections", "faqs", "cta", "hook", "sources"],
  properties: {
    title: { type: "string" },
    description: { type: "string" },
    h1: { type: "string" },
    keywords: { type: "string" },
    dek: { type: "string" },
    hook: { type: "string" },
    sections: {
      type: "array",
      items: { type: "object", additionalProperties: false, required: ["h2", "html"], properties: { h2: { type: "string" }, html: { type: "string" } } },
    },
    faqs: {
      type: "array",
      items: { type: "object", additionalProperties: false, required: ["q", "a"], properties: { q: { type: "string" }, a: { type: "string" } } },
    },
    cta: { type: "object", additionalProperties: false, required: ["h", "p"], properties: { h: { type: "string" }, p: { type: "string" } } },
    sources: {
      type: "array",
      items: { type: "object", additionalProperties: false, required: ["url", "fact"], properties: { url: { type: "string" }, fact: { type: "string" } } },
    },
  },
};

// ── 4. Checks ────────────────────────────────────────────────────────────────────────────────────
const BLOCKED_HOSTS = [/reddit\./, /facebook\./, /instagram\./, /tiktok\./, /x\.com$/, /twitter\./, /google\./, /wikipedia\./, /peakwait\./];
const BANNED = [/\bcommunity\b/i, /\blifestyle\b/i, /\bstoked?\b/i, /\bshred/i, /\bdisrupt/i, /\bai[- ]powered\b/i, /\bgapers?\b/i, /mountains are calling/i, /\bepic\b/, /\bin conclusion\b/i];
const INVENTED = [/peakwait(?:'s)? (?:data|users|reports|skiers|numbers|readings) (?:show|found|reveal|suggest|say)/i, /according to peakwait/i, /our (?:data|users|numbers) (?:show|say|found)/i];
const ALLOWED_TAGS = new Set(["p", "ul", "ol", "li", "strong", "h3", "a"]);
const strip = (s) => String(s).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const words = (s) => strip(s).split(" ").filter(Boolean).length;

function check(g) {
  const errs = [];
  const len = (field, v, lo, hi) => {
    if (v.length < lo || v.length > hi) errs.push(`${field} is ${v.length} characters; it must be ${lo} to ${hi}.`);
  };
  len("title", g.title, 35, 70);
  len("description", g.description, 100, 165);
  len("hook", g.hook, 20, 115);
  if (g.sections.length < 5 || g.sections.length > 7) errs.push(`There are ${g.sections.length} sections; it must be 5 to 7.`);
  if (g.faqs.length < 4 || g.faqs.length > 6) errs.push(`There are ${g.faqs.length} FAQs; it must be 4 to 6.`);
  const total = words(g.dek) + g.sections.reduce((n, s) => n + words(s.html), 0) + g.faqs.reduce((n, f) => n + words(f.q) + words(f.a), 0);
  if (total < 900 || total > 2200) errs.push(`It is ${total} words; it must be 1,000 to 1,800.`);

  const texts = [
    ["title", g.title], ["description", g.description], ["h1", g.h1], ["dek", g.dek], ["hook", g.hook], ["keywords", g.keywords],
    ["cta.h", g.cta.h], ["cta.p", g.cta.p],
    ...g.sections.flatMap((s, i) => [[`sections[${i}].h2`, s.h2], [`sections[${i}].html`, strip(s.html)]]),
    ...g.faqs.flatMap((f, i) => [[`faqs[${i}].q`, f.q], [`faqs[${i}].a`, f.a]]),
  ];
  for (const [field, v] of texts) {
    if (/[()]|—/.test(v)) errs.push(`${field} contains a parenthesis or an em dash: "${v.match(/.{0,40}[()—].{0,40}/)?.[0]}"`);
    for (const b of BANNED) if (b.test(v)) errs.push(`${field} uses a banned word (${b.source}).`);
    for (const b of INVENTED) if (b.test(v)) errs.push(`${field} claims a PeakWait statistic: "${v.match(b)[0]}". Remove it.`);
    if (/\$\s?\d/.test(v)) errs.push(`${field} mentions a price. No prices.`);
  }
  for (const [i, s] of g.sections.entries()) {
    for (const m of s.html.matchAll(/<\/?([a-zA-Z0-9]+)([^>]*)>/g)) {
      const tag = m[1].toLowerCase();
      if (!ALLOWED_TAGS.has(tag)) errs.push(`sections[${i}] uses <${tag}>; only p, ul, ol, li, strong, h3, a are allowed.`);
      const attrs = m[2].trim();
      if (attrs && !(tag === "a" && /^href="https:\/\/[^"\s]+"$/.test(attrs))) errs.push(`sections[${i}] has a tag attribute other than an https href: <${tag} ${attrs}>`);
    }
  }
  const mentions = g.sections.reduce((n, s) => n + (strip(s.html).match(/PeakWait/g) || []).length, 0);
  if (mentions > 3) errs.push(`PeakWait is mentioned ${mentions} times in the sections; at most 3.`);
  if (mentions === 0) errs.push("The last section must say how PeakWait helps.");
  if (g.sources.length < 3) errs.push(`Only ${g.sources.length} sources; give at least three.`);
  return errs;
}

async function checkSources(sources) {
  const ok = [];
  const bad = [];
  for (const s of sources) {
    let host = "";
    try {
      host = new URL(s.url).hostname;
    } catch {
      bad.push(`${s.url}: not a URL`);
      continue;
    }
    if (!s.url.startsWith("https://") || BLOCKED_HOSTS.some((b) => b.test(host))) {
      bad.push(`${s.url}: not an allowed source`);
      continue;
    }
    try {
      const r = await fetch(s.url, { headers: { "user-agent": "Mozilla/5.0 PeakWaitGuides/1.0" }, redirect: "follow", signal: AbortSignal.timeout(20_000) });
      if (r.ok) ok.push(s.url);
      else bad.push(`${s.url}: HTTP ${r.status}`);
    } catch (e) {
      bad.push(`${s.url}: ${e.name}`);
    }
  }
  return { ok, bad };
}

// ── 5. Write, check, repair once ─────────────────────────────────────────────────────────────────
let messages = [{ role: "user", content: prompt }];
let guide = null;
let spent = { input: 0, output: 0, searches: 0 };
for (let attempt = 0; attempt < 2; attempt += 1) {
  let data;
  let turns = 0;
  // web_search can end a turn with pause_turn; carry on until the model finishes.
  for (;;) {
    data = await callAnthropic({
      model: MODEL,
      max_tokens: 16000,
      tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 8 }],
      output_config: { format: { type: "json_schema", schema: SCHEMA } },
      messages,
    }).catch((e) => fail(`Could not reach the model: ${e.message}`));
    const u = data.usage || {};
    spent.input += u.input_tokens || 0;
    spent.output += u.output_tokens || 0;
    spent.searches += u.server_tool_use?.web_search_requests || 0;
    if (data.stop_reason !== "pause_turn" || ++turns >= 4) break;
    messages = [...messages, { role: "assistant", content: data.content }];
  }
  console.log(`model ${data.model || MODEL} · stop_reason ${data.stop_reason} · input ${spent.input} · output ${spent.output} · searches ${spent.searches}`);
  if (data.stop_reason !== "end_turn") fail(`The model stopped with ${data.stop_reason}; nothing published.`);
  const text = data.content.filter((c) => c.type === "text").map((c) => c.text).join("");
  try {
    guide = JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1));
  } catch {
    fail("The model's answer is not JSON; nothing published.");
  }

  const errs = check(guide);
  const src = await checkSources(guide.sources);
  if (src.ok.length < 2) errs.push(`Only ${src.ok.length} source pages load. Failed: ${src.bad.join("; ")}. Give sources that load, and drop facts that rest on the ones that do not.`);
  if (errs.length === 0) {
    console.log(`Checks passed. Sources that load: ${src.ok.length} of ${guide.sources.length}.`);
    break;
  }
  console.error(`Attempt ${attempt + 1} failed ${errs.length} check(s):\n  ${errs.join("\n  ")}`);
  if (attempt === 1) fail("Still failing after one repair; nothing published. Tomorrow's run will try again.");
  messages = [
    ...messages,
    { role: "assistant", content: data.content },
    { role: "user", content: `The guide failed these checks. Fix every one and return the whole guide again in the same format:\n- ${errs.join("\n- ")}` },
  ];
}

// ── 6. Save and build ────────────────────────────────────────────────────────────────────────────
const bodyWords = words(guide.dek) + guide.sections.reduce((n, s) => n + words(s.html), 0);
const article = {
  slug: topic.slug,
  title: guide.title,
  description: guide.description,
  h1: guide.h1,
  readTime: `${Math.max(3, Math.round(bodyWords / 220))} min`,
  published: today,
  updated: today,
  keywords: guide.keywords,
  dek: guide.dek,
  sections: guide.sections,
  faqs: guide.faqs,
  cta: guide.cta,
};
const index = topic.kind === "mountain"
  ? { region: topic.region, ...(topic.regionLabel ? { regionLabel: topic.regionLabel } : {}), where: topic.where, lifts: `${resort.liftCount} lifts`, hook: guide.hook }
  : { group: topic.kind };
const record = { article, index, ...(resort ? { mountainName: resort.name } : {}), sources: guide.sources, model: MODEL, written: today };

if (DRY) {
  console.log(JSON.stringify(record, null, 2));
  process.exit(0);
}
const file = path.join(ROOT, "guides-src", `${topic.slug}.json`);
fs.writeFileSync(file, JSON.stringify(record, null, 2) + "\n");
const build = spawnSync(process.execPath, [path.join(ROOT, "tools", "build-guides.mjs")], { stdio: "inherit" });
if (build.status !== 0) {
  fs.rmSync(file);
  fail("The site build failed on the new guide; it was removed and nothing is published.");
}
const url = `https://peakwait.net/guides/${topic.slug}/`;
console.log(`Published locally: ${url}`);
if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `url=${url}\nslug=${topic.slug}\ntitle=${guide.title.replace(/\n/g, " ")}\n`);
