#!/usr/bin/env node
/**
 * PeakWait Guides — static content engine.
 * Add an entry to ARTICLES, run `node tools/build-guides.mjs`, commit the output.
 * Emits: /guides/<slug>/index.html, /guides/index.html, /sitemap.xml, /robots.txt
 * Author byline is always "Herb Sendit" (never the founder's real name).
 * Voice: human, funny, no em-dashes, minimal hyphens.
 */
import fs from "node:fs";
import path from "node:path";

const SITE = "https://peakwait.net";
const DOWNLOAD_URL = "https://peakwait.net"; // swap to the App Store URL once live
const AUTHOR = "Herb Sendit";
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");

// ---- content ---------------------------------------------------------------
const ARTICLES = [
  {
    slug: "ski-resort-lift-lines",
    title: "Why Ski Resort Lift Lines Feel So Brutal Now (and How to Get Your Day Back)",
    description:
      "Two hour waits, $200 to stand in line, six runs all day. Here's why lift lines got so bad, what skiers actually say about it, and how to claw back the parts you can control.",
    h1: "Why lift lines feel so brutal now, and how to get your ski day back",
    readTime: "8 min",
    published: "2026-07-19",
    updated: "2026-08-21",
    keywords: "ski resort lift lines, are ski resorts too crowded, lift line wait times, ski resort crowds, longest lift line, how to avoid lift lines",
    dek: `Skiers don't talk about lift lines like a small annoyance. They talk about them like a betrayal. "I found hell today." "Spent more time in line than skiing." "$200 to stand in a line." "That's a no from me, dawg." The pain is real, it hits hardest on the best days, and the parts you can actually control are very fixable.`,
    sections: [
      { h2: "The math that quietly ruins the day", html: `
<p>The real wound isn't the wait. It's the ratio. An hour in line for a two minute run. A whole powder day boiled down to six runs. People do that math while their toes go numb, and something snaps. "I spent more time in various lift lines than actually skiing." At that point you're not skiing. You're queueing with a hobby attached.</p>` },
      { h2: "The powder day paradox", html: `
<p>Here's the cruel part. The best snow brings the worst waits. The exact days you'd skip work to ski are the days everyone else has the same idea. Fresh snow falls, terrain opens slowly while patrol does avalanche work, and the whole mountain funnels onto three lifts. Best conditions, longest lines, every single time. You could set your watch by it.</p>` },
      { h2: `"$200 to stand in a line"`, html: `
<p>Then there's the money. Nothing sours a day faster than the value math: a couple hundred bucks for a ticket, and you got seven runs. People have filmed themselves hiking up the mountain because it was faster than the wait. When paying customers would rather walk than ride the lift, something is broken.</p>` },
      { h2: `The "this isn't even skiing anymore" feeling`, html: `
<p>The megapass era crammed the mountains full, and you can feel it. Tens of thousands of people squeezing through a handful of lifts stops feeling like a mountain and starts feeling like a theme park with worse food. "It's not even skiing anymore at some of these resorts," people say. That's not gatekeeping. It's grief for something they love.</p>` },
      { h2: "The part that's actually infuriating (and fixable)", html: `
<p>Here's the detail buried in every crowd thread, and it's the one that matters. The waits are wildly uneven. There's a 20 minute line at one lift while a chair on the far side of the mountain runs half empty. Lifties aren't filling chairs. One lift absorbs the whole crowd while its twin spins with room to spare.</p>
<p>So the short wait almost always exists. Somewhere on the mountain, right now, there's a good option. The problem was never that every lift is slammed. The problem is you can't see the empty one from where you're standing, so everybody piles onto the same obvious lift and makes it worse.</p>` },
      { h2: "What you can actually control", html: `
<p>You can't fix the megapass, the parking, or the powder day math. But you can stop handing your whole day to the longest line on the hill.</p>
<ul>
  <li><strong>Point the car at the right mountain.</strong> On any given morning, one nearby resort has the snow and the short waits. PeakWait's <strong>"Where to ski today"</strong> ranks them, so you skip the blown out flagship for the sleeper that's quietly having the best day around.</li>
  <li><strong>Go find the short wait that already exists.</strong> PeakWait shows <strong>live waits reported by skiers on the hill right now</strong> (Moving, Short, Busy, Long) and points you to the <strong>best next chair</strong>, so you ride to the empty lift instead of guessing.</li>
  <li><strong>Ski like a local.</strong> Take the mid mountain lifts over the base lifts, use the singles line every time, and either grab first chair and bounce by 1, or roll in at 1pm as everyone leaves.</li>
</ul>
<p>None of this turns a powder Saturday into a quiet Tuesday. But it's the difference between six runs and sixteen.</p>` },
    ],
    faqs: [
      { q: "Why are ski resort lift lines so long now?", a: "Megapasses like Epic and Ikon put more skiers on the same mountains, powder days pack everyone onto whatever terrain is open, and the waits are uneven, so one popular lift soaks up the traffic while others run under capacity." },
      { q: "Are ski resorts too crowded?", a: "On weekends, holidays, and powder days at the big pass resorts, often yes. Smaller and independent resorts stay much quieter, and on any given day the short waits still exist somewhere. The trick is finding them." },
      { q: "What's the longest you should wait for a lift?", a: "Most experienced skiers cap it around 10 to 15 minutes. Anything past 30 is considered extreme, and plenty of people will just leave rather than wait 45 minutes for a short run." },
      { q: "How do I find the shortest lift line?", a: "Check live waits from other skiers (like PeakWait's) instead of guessing from the base. The shortest wait is usually on a lift you can't see, and an app that reads it live sends you straight there." },
      { q: "Does PeakWait help with crowds?", a: "Yes. It shows live waits from skiers on the hill, ranks which mountain to ski today by snow and waits, and points you to the best next chair, so you spend the day skiing instead of standing." },
    ],
    cta: { h: "Spend the day skiing, not standing", p: `See which mountain has the snow and the short waits today, plus the best next chair once you're there.` },
  },

  {
    slug: "whistler-lift-wait-times",
    title: "The Most Accurate Whistler Lift Wait Times (2026)",
    description:
      "Whistler's lift wait times are wrong more often than the forecast. Here's why every app fibs to you, and the most accurate way to check waits live.",
    h1: "The most accurate way to check Whistler lift wait times",
    readTime: "6 min",
    published: "2026-07-31",
    updated: "2026-07-31",
    keywords: "whistler lift wait times, most accurate lift wait times, whistler chairlift wait times, 7th heaven wait, whistler peak app",
    dek: `No source is perfect, but the truest signal isn't a number scraped off Whistler Blackcomb's website. It's what the skiers standing in the wait right now are actually seeing. The official app, the Epic app, and Whistler Peak Live mostly recycle the same resort feed, or a light board somebody updates by hand, and it trails reality by 15 to 40 minutes. That's how your phone says "12 min" while your toes go numb in a 40 minute wait at 7th Heaven.`,
    sections: [
      { h2: "Why every Whistler wait time is basically fan fiction", html: `
<p>If three different apps show you the same number, it's because they're all drinking from one straw: Whistler Blackcomb's own feed. And that number drifts from reality for gloriously low tech reasons.</p>
<ul>
  <li><strong>The light boards are manual.</strong> Someone has to literally phone the mountain office and say "hey, it's slammed, change the board." That happens after the wait balloons, not before.</li>
  <li><strong>Sensor estimates lag.</strong> Gate and Bluetooth counters guess the flow the way a mall food court does. Fine for "is it kind of busy," useless for a lift that just plugged up on a pow lap.</li>
  <li><strong>GPS is only partial.</strong> Phone based estimates only work if enough riders have that app open with tracking on, and most people don't.</li>
</ul>
<p>By the time any of it updates, the wait has already changed and everyone's moved on. It's less "live data" and more "a postcard from 25 minutes ago."</p>` },
      { h2: "The one genuinely accurate source: the people already standing there", html: `
<p>The r/Whistler crowd figured this out years ago. The only accurate thing is standing in the line yourself. That's the whole idea behind PeakWait. Instead of a stale scraped number, it shows what riders on the hill this minute are reporting.</p>
<ul>
  <li>Skiers tag each lift Moving, Short, Busy, or Long as they see it, blended with live movement on the mountain.</li>
  <li>Every wait comes with a timestamp, so you know if it's two minutes old or two hours old. And when there's no signal, it says "unknown" instead of confidently making something up.</li>
  <li>Then it points you to the best next chair across the whole mountain, so you're skiing toward the short wait instead of into the stampede.</li>
</ul>
<p>Still an estimate, sure. But it's the crowd's live read from people who are actually there. About as honest as "just go look," without the part where you trudge across the base in ski boots to find out.</p>` },
      { h2: "7th Heaven, Harmony, Symphony: the usual suspects", html: `
<ul>
  <li><strong>The alpine trio</strong> can hit 45 minutes on a weekend or powder day. Amazing terrain, not so amazing lift capacity. Lap it early or late, not at noon with everyone else.</li>
  <li><strong>When the lower mountain is socked in or unskiable,</strong> everybody funnels up top and the alpine waits spike. That's exactly when live data earns its keep.</li>
  <li><strong>Pow mornings:</strong> the empty lift you spotted 20 minutes ago is now the longest wait on the hill. Chase live, not lagged.</li>
</ul>` },
    ],
    faqs: [
      { q: "What's the most accurate source for Whistler lift wait times?", a: "Live reports from skiers who are on the hill right now. Official and app numbers mostly come from the resort feed and lag by 15 to 40 minutes, while crowdsourced live reports (like PeakWait's) show the wait as it actually is." },
      { q: "Is the Whistler Peak app or Epic app accurate for wait times?", a: "They're handy for lift status, but their wait numbers mostly come from Whistler Blackcomb's feed, so they lag the real conditions and often disagree with the wait you're actually standing in." },
      { q: "Why is 7th Heaven always so busy?", a: "Big, popular alpine terrain served by limited chair capacity, so it fills up fast, especially on powder and weekend days. Lap it first thing or late afternoon." },
      { q: "How does PeakWait get its wait times?", a: "From skiers on the mountain reporting live waits, blended with movement data, shown as timestamped bands (Moving, Short, Busy, Long) instead of one scraped official number." },
    ],
    cta: { h: "Skip the guesswork", p: `See Whistler waits from the people actually on the hill, plus the best next chair to ski.` },
  },

  {
    slug: "beat-powder-day-crowds",
    title: "How to Beat Powder Day Crowds and Still Get Fresh Tracks (2026)",
    description:
      "Powder days now mean 90 minute waits and everything tracked out by 11am. Here's how to actually score freshies: smarter resort picks, timing, and live wait data. No 5am alarm required.",
    h1: "How to beat powder day crowds (and still get fresh tracks)",
    readTime: "5 min",
    published: "2026-08-08",
    updated: "2026-08-08",
    keywords: "how to avoid lift lines, powder day crowds, least crowded ski resorts, best time to arrive powder day, beat the crowds skiing",
    dek: `There's no powder day anymore. There's a powder hour. The fix isn't setting a 5am alarm to fight a 90 minute wait at the biggest resort on the pass. It's riding where the herd isn't, and chasing live waits instead of stampeding to the same "empty" lift as everyone else.`,
    sections: [
      { h2: "Why powder days turned into a demolition derby", html: `
<p>It's not just you. As one r/snowboarding regular put it, there's no powder day, there's a powder hour. Social media ratted out every secret stash, the megapasses funnel whole cities onto the same few hills, and one closed upper mountain lift dumps everybody onto a single chair. Baker's blown out by 10. Palisades gives you two or three glorious laps and then an hour long wait for the privilege of riding your own tracks.</p>` },
      { h2: "Lever 1: ride where the crowd isn't", html: `
<p>The biggest difference maker isn't your alarm clock. It's which mountain you point the car at. Every crowd thread lands on the same answer: smaller hills farther from the city hold fresh snow for days. The hard part is deciding on the morning of. Which nearby mountain actually has the snow and the short waits?</p>
<p>That's exactly what PeakWait's <strong>"Where to ski today"</strong> does. It ranks the mountains near you by fresh snow, short waits, and how much terrain is open. Skip the blown out flagship, hit the sleeper that's quietly having the best day of anyone, and beat the group chat to it.</p>` },
      { h2: "Lever 2: time it (you don't have to suffer for this)", html: `
<ul>
  <li><strong>Be booted up before first chair</strong> on a real pow day. The gap between rolling in at 7:45 and 8:20 can be a full extra hour stuck in the base area conga line.</li>
  <li><strong>Weekdays are a different sport.</strong> First ten chairs with a 15 minute buffer and room to breathe.</li>
  <li><strong>Watch the storm clock.</strong> Snow that starts after the lifts open quietly refills your lines while the early crowd wanders off to the lodge for a $19 burger.</li>
</ul>` },
      { h2: "Lever 3: once you're there, chase live waits, not the herd", html: `
<p>The classic pow day trap: that "empty" lift you eyeballed 20 minutes ago is now the longest wait on the mountain, because 400 other people had the identical genius idea. PeakWait shows live waits reported by riders on the mountain right now (Moving, Short, Busy, Long, all timestamped) and points you to the best next chair, so you're always drifting toward the short wait instead of into the migration.</p>` },
    ],
    faqs: [
      { q: "How do I avoid lift lines on a powder day?", a: "Pick a smaller resort farther from the city, be booted up before first chair, and use live wait data to chase the moving lifts instead of following the crowd to the same one." },
      { q: "What time should I arrive on a powder day?", a: "Booted and in line before first chair, which can mean an hour of lead time at big resorts on a storm day. Weekdays need far less." },
      { q: "Which resorts have the shortest powder day waits?", a: "Smaller hills away from the big cities hold fresh snow and stay quieter. PeakWait's 'Where to ski today' ranks the ones near you by snow and wait, live." },
    ],
    cta: { h: "Stop guessing on the best days", p: `See which mountain has the snow and the shortest waits, plus the best next chair once you're there.` },
  },

  {
    slug: "beat-i70-ski-traffic-colorado-crowds",
    title: "How to Beat I-70 Ski Traffic and Colorado Weekend Crowds (2026)",
    description:
      "I-70 on a Saturday is a parking lot with a mountain view. Here's the real Colorado playbook: best days, sleeper resorts, timing, and how to pick a mountain that's actually worth the drive.",
    h1: "How to beat I-70 traffic and Colorado weekend crowds",
    readTime: "7 min",
    published: "2026-08-16",
    updated: "2026-08-16",
    keywords: "i-70 ski traffic, least crowded colorado ski resort, best day to ski colorado, avoid ski crowds colorado, when to leave denver skiing",
    dek: `The honest conclusion every r/COsnow thread reaches: on a Saturday, you're not stuck in I-70 traffic, you ARE I-70 traffic. You can't delete the crowds, but you can dodge most of them. Pick the right day, the right mountain, and the right hours, and figure out whether a mountain's even worth the drive before you commit to the Eisenhower Tunnel crawl.`,
    sections: [
      { h2: "The I-70 reality check", html: `
<p>There are basically two departure windows that work, and a long dead zone of despair in between. Leave Denver by 5 or 6am to beat the wave, or wait until around 10:30am to ride the gap after the early crowd has already wedged itself into the tunnel. Everything in the middle is bumper to bumper with a side of ski rack anxiety.</p>
<p>PeakWait can't do anything about the traffic itself. But most of the I-70 pain isn't really the drive. It's burning a whole Saturday to sit in it for two hours and arrive at a blown out resort with 45 minute waits. Fix that, and the drive starts to feel worth it.</p>` },
      { h2: "Pick the day (this is 80% of it)", html: `
<ul>
  <li><strong>Sunday beats Saturday.</strong> Half of Denver skied Saturday and is nursing its regrets. Sundays run noticeably quieter.</li>
  <li><strong>Avoid the black diamond dates.</strong> MLK weekend, Presidents weekend, and December 26 through January 2 are a full contact sport. If you have to go, expect to make friends in the singles line.</li>
  <li><strong>Weekdays are cheating, in a good way.</strong> A single PTO day can be worth ten Saturdays. The regulars aren't taking Tuesdays off to post on Reddit. They're already on the hill.</li>
</ul>` },
      { h2: "Pick the mountain that's actually worth the drive", html: `
<p>The Front Range flagships (Vail, Breck, Keystone, Copper, Winter Park) soak up the entire Denver metro every weekend. The quiet move the locals make is going independent or farther out: Loveland, Eldora, Monarch, Ski Cooper, Wolf Creek, Crested Butte. Less pass hype, more actual skiing.</p>
<p>The catch is picking the right one on the morning of. PeakWait's <strong>"Where to ski today"</strong> ranks the mountains near you by fresh snow, short waits, and how much is open, so you point the car at the hill that's genuinely good today, not the one with the loudest marketing.</p>` },
      { h2: "Once you're there, don't ski like a tourist", html: `
<ul>
  <li><strong>Base lifts are the trap.</strong> Everyone piles onto the first chair they see. Ride a mid mountain lift and the wait can drop from 20 minutes to two.</li>
  <li><strong>Use the singles line.</strong> Skating beats standing, and it usually cuts the wait down to a fraction.</li>
  <li><strong>First chair, then bounce by 1.</strong> Or flip it and roll in at 1pm as the morning crew heads home, then cruise empty groomers till close.</li>
  <li><strong>Chase live waits.</strong> PeakWait shows which lifts are actually moving right now and the best next chair, so you're not committing to a wait you can't even see from the base.</li>
</ul>` },
    ],
    faqs: [
      { q: "What's the least crowded ski resort near Denver?", a: "Independents and farther out mountains like Loveland, Eldora, Monarch, Ski Cooper, Wolf Creek, and Crested Butte stay far quieter than the megapass flagships. Use PeakWait's 'Where to ski today' to see which one has snow and short waits on a given day." },
      { q: "What's the best day to ski in Colorado to avoid crowds?", a: "A weekday, hands down. If you're stuck with weekends, Sunday beats Saturday, and steer clear of MLK, Presidents, and the December 26 through January 2 stretch." },
      { q: "When should I leave Denver to beat I-70 ski traffic?", a: "Either early, around 5 or 6am, to beat the wave, or around 10:30am to catch the gap after it. The late morning middle is the worst of both worlds." },
      { q: "Does PeakWait show I-70 traffic?", a: "No. It's a lift wait and where to ski app, not a traffic router. But it helps with the real problem: picking a mountain that actually has snow and short waits, so you don't waste a Saturday driving to a blown out resort." },
    ],
    cta: { h: "Make the drive worth it", p: `See which Colorado mountain has the snow and the shortest waits today, before you commit to I-70.` },
  },
];

// ---- template --------------------------------------------------------------
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const fmtDate = (iso) => { const [y, m, d] = iso.split("-").map(Number); return `${MONTHS[m - 1]} ${d}, ${y}`; };
const stripTags = (s) => String(s).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const CSS = `
:root{--bg:#070F16;--surface:#101D28;--raised:#1B2936;--hair:#2C3B48;--ink:#EFF4F9;--ink2:#ADB9C4;--ink3:#76828D;--brand:#43ACFB;--gold:#FEB84D;--good:#4AE299;
--display:-apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,Roboto,Helvetica,sans-serif;--body:-apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,Roboto,sans-serif}
*{box-sizing:border-box}html{scroll-behavior:smooth}
body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--body);line-height:1.65;-webkit-font-smoothing:antialiased}
a{color:var(--brand);text-decoration:none}a:hover{text-decoration:underline}
.wrap{max-width:720px;margin:0 auto;padding:0 22px}
.top{border-bottom:1px solid var(--hair)}
.top .wrap{display:flex;align-items:center;gap:12px;height:62px}
.brand{display:flex;align-items:center;gap:10px;font-family:var(--display);font-weight:800;font-size:1.1rem;letter-spacing:-.02em;color:var(--ink)}
.brand img{width:28px;height:28px;border-radius:7px}
.top .spacer{flex:1}
.dl{background:var(--brand);color:#04121f;font-weight:800;font-size:.85rem;padding:8px 15px;border-radius:9px}
.dl:hover{text-decoration:none;filter:brightness(1.06)}
main{padding:36px 0 72px}
.crumbs{font-size:.8rem;color:var(--ink3);margin-bottom:18px}
.crumbs a{color:var(--ink3)}
h1{font-family:var(--display);font-weight:850;font-size:clamp(1.9rem,4.6vw,2.7rem);line-height:1.05;letter-spacing:-.03em;margin:0 0 12px;text-wrap:balance}
.byline{font-size:.85rem;color:var(--ink3);margin-bottom:26px}
.byline b{color:var(--gold)}
.dek{font-size:1.12rem;color:var(--ink);background:var(--surface);border:1px solid var(--hair);border-left:3px solid var(--gold);border-radius:12px;padding:16px 18px;margin:0 0 32px}
h2{font-family:var(--display);font-weight:800;font-size:1.42rem;letter-spacing:-.02em;margin:38px 0 12px;text-wrap:balance}
p{margin:0 0 16px;color:var(--ink2)}
li{margin:0 0 9px;color:var(--ink2)}
ul{padding-left:22px;margin:0 0 16px}
strong{color:var(--ink)}
em{color:var(--ink);font-style:italic}
.cta{background:linear-gradient(160deg,var(--raised),var(--surface));border:1px solid var(--hair);border-radius:16px;padding:26px 24px;margin:34px 0;text-align:center}
.cta h3{font-family:var(--display);font-weight:800;font-size:1.3rem;margin:0 0 8px;color:var(--ink)}
.cta p{color:var(--ink2);margin:0 0 16px}
.cta a{display:inline-block;background:var(--brand);color:#04121f;font-weight:800;padding:12px 22px;border-radius:11px;font-size:1rem}
.cta a:hover{text-decoration:none;filter:brightness(1.06)}
.tagline{color:var(--gold);font-weight:700;font-size:.9rem;margin-top:12px}
.faq h2{margin-top:8px}
.faq dt{font-weight:800;color:var(--ink);margin:20px 0 6px;font-family:var(--display)}
.faq dd{margin:0 0 6px;color:var(--ink2)}
.related{border-top:1px solid var(--hair);margin-top:44px;padding-top:24px}
.related a{display:block;margin:0 0 8px}
footer{border-top:1px solid var(--hair);color:var(--ink3);font-size:.85rem;padding:26px 0 40px}
footer a{color:var(--ink3)}
`.trim();

const header = () => `
<header class="top"><div class="wrap">
  <a class="brand" href="/"><img src="/favicon.svg" alt="PeakWait"/>PeakWait</a>
  <span class="spacer"></span>
  <a class="dl" href="${DOWNLOAD_URL}">Download</a>
</div></header>`;

const footer = () => `
<footer><div class="wrap">
  © 2026 PeakWait LLC · <a href="/">Home</a> · <a href="/guides/">Guides</a> · <a href="/terms/">Terms</a> · <a href="/privacy/">Privacy</a>
</div></footer>`;

const ctaBlock = (c) => `
<div class="cta">
  <h3>${esc(c.h)}</h3>
  <p>${esc(c.p)}</p>
  <a href="${DOWNLOAD_URL}">Download PeakWait, free</a>
  <div class="tagline">Ski the mountain, skip the wait.</div>
</div>`;

function articleHtml(a, others) {
  const url = `${SITE}/guides/${a.slug}/`;
  const faqLd = {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: a.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  const artLd = {
    "@context": "https://schema.org", "@type": "Article", headline: a.title,
    description: a.description, author: { "@type": "Person", name: AUTHOR },
    publisher: { "@type": "Organization", name: "PeakWait", logo: { "@type": "ImageObject", url: `${SITE}/icon-512.png` } },
    datePublished: a.published, dateModified: a.updated, mainEntityOfPage: url, image: `${SITE}/og.png`,
  };
  const crumbLd = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE + "/" },
      { "@type": "ListItem", position: 2, name: "Guides", item: SITE + "/guides/" },
      { "@type": "ListItem", position: 3, name: a.title, item: url },
    ],
  };
  const midIdx = Math.ceil(a.sections.length / 2);
  const body = a.sections.map((s, i) => `<h2>${esc(s.h2)}</h2>${s.html.trim()}` + (i === midIdx - 1 ? ctaBlock(a.cta) : "")).join("\n");
  const faq = `<section class="faq"><h2>FAQ</h2><dl>` +
    a.faqs.map((f) => `<dt>${esc(f.q)}</dt><dd>${esc(f.a)}</dd>`).join("") + `</dl></section>`;
  const related = others.length ? `<div class="related"><h2>More from Herb</h2>` +
    others.map((o) => `<a href="/guides/${o.slug}/">${esc(o.title)}</a>`).join("") + `</div>` : "";
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(a.title)}</title>
<meta name="description" content="${esc(a.description)}">
<meta name="keywords" content="${esc(a.keywords)}">
<meta name="author" content="${AUTHOR}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(a.title)}">
<meta property="og:description" content="${esc(a.description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE}/og.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<meta name="theme-color" content="#070F16">
<script type="application/ld+json">${JSON.stringify(artLd)}</script>
<script type="application/ld+json">${JSON.stringify(faqLd)}</script>
<script type="application/ld+json">${JSON.stringify(crumbLd)}</script>
<style>${CSS}</style>
</head>
<body>
${header()}
<main><div class="wrap">
  <nav class="crumbs"><a href="/">Home</a> › <a href="/guides/">Guides</a> › ${esc(a.title)}</nav>
  <h1>${esc(a.h1)}</h1>
  <p class="byline">By <b>${AUTHOR}</b> · ${esc(a.readTime)} read · ${a.updated !== a.published ? "Updated " : ""}${fmtDate(a.updated)}</p>
  <p class="dek">${a.dek}</p>
  ${body}
  ${faq}
  ${related}
</div></main>
${footer()}
</body>
</html>`;
}

function indexHtml(arts) {
  const cards = arts.map((a) => `
  <a class="card" href="/guides/${a.slug}/">
    <h2>${esc(a.title)}</h2>
    <p>${esc(a.description)}</p>
    <span class="meta">By ${AUTHOR} · ${esc(a.readTime)} read</span>
  </a>`).join("\n");
  const listCss = `.lead{font-size:1.12rem;color:var(--ink2);margin:6px 0 30px}
.card{display:block;background:var(--surface);border:1px solid var(--hair);border-radius:14px;padding:22px 22px;margin:0 0 16px}
.card:hover{border-color:var(--brand);text-decoration:none}
.card h2{font-size:1.3rem;margin:0 0 8px;color:var(--ink)}
.card p{margin:0 0 10px}
.card .meta{font-size:.8rem;color:var(--ink3)}`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Ski Guides, Beat the Wait | PeakWait</title>
<meta name="description" content="No nonsense guides to skiing smarter: how to beat lift waits, dodge crowds, and find where to actually ski today. By Herb Sendit.">
<link rel="canonical" href="${SITE}/guides/">
<meta property="og:title" content="PeakWait Ski Guides, Beat the Wait">
<meta property="og:description" content="How to beat lift waits, dodge crowds, and find where to actually ski today.">
<meta property="og:url" content="${SITE}/guides/">
<meta property="og:image" content="${SITE}/og.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<meta name="theme-color" content="#070F16">
<style>${CSS}
${listCss}</style>
</head>
<body>
${header()}
<main><div class="wrap">
  <nav class="crumbs"><a href="/">Home</a> › Guides</nav>
  <h1>Ski smarter. Skip the wait.</h1>
  <p class="lead">No nonsense guides to beating lift waits, dodging crowds, and finding where to actually ski today, from someone who has spent way too much of his life in a singles line. By Herb Sendit.</p>
  ${cards}
</div></main>
${footer()}
</body>
</html>`;
}

function sitemap(arts) {
  const urls = [
    { loc: SITE + "/", pri: "1.0" },
    { loc: SITE + "/guides/", pri: "0.8" },
    ...arts.map((a) => ({ loc: `${SITE}/guides/${a.slug}/`, pri: "0.7", lastmod: a.updated })),
    { loc: SITE + "/terms/", pri: "0.3" },
    { loc: SITE + "/privacy/", pri: "0.3" },
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}<priority>${u.pri}</priority></url>`).join("\n")}
</urlset>`;
}

// ---- llms.txt / llms-full.txt (for AI answer engines) ----------------------
const SUMMARY = "PeakWait is a real-time ski-lift wait app for iPhone. Skiers on the mountain report live lift waits (Moving, Short, Busy, Long), and PeakWait shows which lifts are moving right now, ranks where to ski today by snow and crowds, and points you to the best next chair. It covers 91 resorts across the U.S. and Canada. Free to check status and report waits; PeakWait Plus adds the cross-resort \"where to ski today\" guide, powder alerts, and live friend location. Made by PeakWait LLC.";

function llmsTxt(arts) {
  return `# PeakWait

> ${SUMMARY}

## Guides
${arts.map((a) => `- [${a.title}](${SITE}/guides/${a.slug}/): ${a.description}`).join("\n")}

## Product
- [PeakWait home](${SITE}/): what PeakWait is, its features, and the download link.
- [Download PeakWait](${DOWNLOAD_URL}): get the free iOS app.

## Legal
- [Terms of Use](${SITE}/terms/): the terms of service.
- [Privacy Policy](${SITE}/privacy/): what data PeakWait collects and your choices.
`;
}

function articleText(a) {
  let out = `# ${a.title}\nBy ${AUTHOR} · ${fmtDate(a.published)} · ${SITE}/guides/${a.slug}/\n\n${stripTags(a.dek)}\n\n`;
  for (const s of a.sections) out += `## ${s.h2}\n${stripTags(s.html)}\n\n`;
  out += `## FAQ\n` + a.faqs.map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n\n") + "\n";
  return out;
}

function llmsFull(arts) {
  return `# PeakWait — Full Guide Content\n\n> ${SUMMARY}\n\n` + arts.map(articleText).join("\n\n---\n\n");
}

const ROBOTS = `# PeakWait robots.txt
User-agent: *
Allow: /

# AI crawlers and answer engines are welcome to read and cite us.
User-agent: GPTBot
Allow: /
User-agent: OAI-SearchBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: anthropic-ai
Allow: /
User-agent: Claude-Web
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Perplexity-User
Allow: /
User-agent: Google-Extended
Allow: /
User-agent: Applebot-Extended
Allow: /
User-agent: CCBot
Allow: /

Sitemap: ${SITE}/sitemap.xml
`;

// ---- build -----------------------------------------------------------------
let n = 0;
for (const a of ARTICLES) {
  const dir = path.join(ROOT, "guides", a.slug);
  fs.mkdirSync(dir, { recursive: true });
  const others = ARTICLES.filter((o) => o.slug !== a.slug).slice(0, 3);
  fs.writeFileSync(path.join(dir, "index.html"), articleHtml(a, others));
  n++;
}
fs.writeFileSync(path.join(ROOT, "guides", "index.html"), indexHtml(ARTICLES));
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), sitemap(ARTICLES));
fs.writeFileSync(path.join(ROOT, "robots.txt"), ROBOTS);
fs.writeFileSync(path.join(ROOT, "llms.txt"), llmsTxt(ARTICLES));
fs.writeFileSync(path.join(ROOT, "llms-full.txt"), llmsFull(ARTICLES));
console.log(`Built ${n} guides + index + sitemap.xml + robots.txt + llms.txt + llms-full.txt`);
console.log(ARTICLES.map((a) => `  ${SITE}/guides/${a.slug}/`).join("\n"));
