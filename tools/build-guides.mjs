#!/usr/bin/env node
/**
 * PeakWait Guides — static content engine.
 * Add an entry to ARTICLES, run `node tools/build-guides.mjs`, commit the output.
 * Emits: /guides/<slug>/index.html, /guides/index.html, /sitemap.xml, /robots.txt
 * Author byline is always "Herb Sendit" (never the founder's real name).
 */
import fs from "node:fs";
import path from "node:path";

const SITE = "https://peakwait.net";
const DOWNLOAD_URL = "https://peakwait.net"; // TODO: swap to the App Store URL once live
const AUTHOR = "Herb Sendit";
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");

// ---- content ---------------------------------------------------------------
const ARTICLES = [
  {
    slug: "whistler-lift-wait-times",
    title: "The Most Accurate Whistler Lift Wait Times (2026)",
    description:
      "Whistler's lift wait times are wrong more often than the forecast. Here's why every app fibs to you — and the most accurate way to actually check waits in real time.",
    h1: "The most accurate way to check Whistler lift wait times",
    readTime: "6 min",
    published: "2026-08-23",
    updated: "2026-08-23",
    keywords: "whistler lift wait times, most accurate lift wait times, whistler chairlift wait times, 7th heaven wait, whistler peak app",
    dek: `No source is perfect — but the truest signal isn't a number scraped off Whistler Blackcomb's website. It's what skiers standing in the wait <em>right now</em> are actually seeing. The official app, the Epic app, and Whistler Peak Live mostly recycle the same resort feed (or a hand-updated light board), which trails reality by 15–40 minutes. That's how your phone says "12 min" while your toes go numb in a 40-minute wait at 7th Heaven.`,
    sections: [
      { h2: "Why every Whistler wait time is basically fan fiction", html: `
<p>If three different apps show you the exact same number, it's because they're all sipping from one straw: Whistler Blackcomb's own feed. And that number drifts from reality for gloriously low-tech reasons:</p>
<ul>
  <li><strong>The light boards are manual.</strong> Someone has to literally phone the mountain office and say "hey, it's slammed, change the board." That happens <em>after</em> the wait balloons, not before.</li>
  <li><strong>Sensor estimates lag.</strong> Gate and Bluetooth counters guess flow the way a mall food court does — great for "is it busy-ish," useless for a lift that just plugged up on a pow lap.</li>
  <li><strong>GPS is only partial.</strong> Phone-based estimates only work if enough riders have that app open with tracking on. Most don't. Shocking, we know.</li>
</ul>
<p>By the time any of these updates, the wait has already changed and everyone's migrated somewhere new. It's less "live data" and more "a postcard from 25 minutes ago."</p>` },
      { h2: "The one genuinely accurate source: the people already standing there", html: `
<p>The r/Whistler hive mind landed on the truth years ago: <em>"the only accurate thing is standing in the line itself."</em> That's the whole idea behind PeakWait — instead of a stale scraped number, it shows what riders <strong>on the hill this minute</strong> are reporting.</p>
<ul>
  <li>Skiers tag each lift <strong>Moving · Short · Busy · Long</strong> as they see it, blended with live movement on the mountain.</li>
  <li>Every wait is <strong>freshness-stamped</strong>, so you know if it's 2 minutes old or 2 hours old — and when there's no signal, it says "unknown" instead of confidently making something up.</li>
  <li>Then it points you to the <strong>best next chair</strong> across the whole mountain, so you're skiing toward the short wait instead of into the stampede.</li>
</ul>
<p>Still an estimate — but it's the crowd's live read from people who are literally there. Roughly as honest as "just go look," minus the part where you post-hole across the base to go look.</p>` },
      { h2: "7th Heaven, Harmony, Symphony: the usual suspects", html: `
<ul>
  <li><strong>The alpine trio</strong> can hit 45 minutes on a weekend or powder day — spectacular terrain, not-so-spectacular lift capacity. Lap it early or late, not at high noon with everyone else.</li>
  <li><strong>When the lower mountain is socked in or unskiable</strong>, everybody funnels up top and the alpine waits spike. That's exactly when live data earns its keep.</li>
  <li><strong>Pow mornings:</strong> the "empty" lift you spotted 20 minutes ago is now the longest wait on the hill. Chase live, not lagged.</li>
</ul>` },
    ],
    faqs: [
      { q: "What's the most accurate source for Whistler lift wait times?", a: "Real-time reports from skiers currently on the hill. Official and app numbers are largely resort-fed and lag by 15–40 minutes; crowd-sourced live reports (like PeakWait's) reflect the wait as it actually is right now." },
      { q: "Is the Whistler Peak app or Epic app accurate for wait times?", a: "They're handy for lift status, but their wait numbers mostly come from Whistler Blackcomb's feed, so they lag real conditions and often disagree with the actual wait you're standing in." },
      { q: "Why is 7th Heaven always so busy?", a: "Big, popular alpine terrain served by limited chair capacity — so it fills fast, especially on powder and weekend days. Lap it first thing or late afternoon." },
      { q: "How does PeakWait get its wait times?", a: "From skiers on the mountain reporting live waits, blended with movement data, shown as freshness-stamped bands (Moving/Short/Busy/Long) — not a single scraped official figure." },
    ],
    cta: { h: "Skip the guesswork", p: `See Whistler waits from the people actually on the hill — plus the best next chair to ski.` },
  },

  {
    slug: "beat-powder-day-crowds",
    title: "How to Beat Powder-Day Crowds and Still Get Fresh Tracks (2026)",
    description:
      "Powder days now mean 90-minute waits and everything tracked out by 11am. Here's how to actually score freshies — smarter resort picks, timing, and live wait data. No 5am alarm required.",
    h1: "How to beat powder-day crowds (and still get fresh tracks)",
    readTime: "5 min",
    published: "2026-08-23",
    updated: "2026-08-23",
    keywords: "how to avoid lift lines, powder day crowds, least crowded ski resorts, best time to arrive powder day, beat the crowds skiing",
    dek: `There's no powder day anymore — there's a powder <em>hour</em>. The fix isn't setting a 5am alarm to fight a 90-minute wait at the biggest resort on the pass. It's riding where the herd isn't and chasing live waits instead of stampeding to the same "empty" lift as everyone else.`,
    sections: [
      { h2: "Why powder days turned into a demolition derby", html: `
<p>It's not just you. As r/snowboarding so poetically put it: <em>"there's no powder day, there's a powder hour."</em> Social media ratted out every secret stash, the megapasses funnel entire metro areas onto the same few hills, and one closed upper-mountain lift dumps everyone onto a single chair. Baker's blown out by 10. Palisades gives you two or three glorious laps and then an hour-long wait for the privilege of riding your own tracks.</p>` },
      { h2: "Lever #1: ride where the crowd isn't", html: `
<p>The biggest difference-maker isn't your alarm clock — it's <strong>which mountain you point the car at.</strong> Every crowd thread lands on the same fix: smaller hills farther from the city hold fresh snow for days. The hard part is <em>deciding</em> on the morning of — which nearby mountain actually has the snow <strong>and</strong> the short waits?</p>
<p>That's exactly what PeakWait's <strong>"Where to ski today"</strong> does: it ranks the mountains near you by fresh snow × short waits × how much is open. Skip the blown-out flagship, hit the sleeper that's quietly having the best day of anyone — before the group chat figures it out.</p>` },
      { h2: "Lever #2: time it (you don't have to suffer for this)", html: `
<ul>
  <li><strong>Be booted up before first chair</strong> on a true pow day. The gap between rolling in at 7:45 and 8:20 can be a full extra hour stuck in the base-area conga line.</li>
  <li><strong>Weekdays are a different sport</strong> — first ten chairs with a 15-minute buffer and elbow room to spare.</li>
  <li><strong>Watch the storm clock:</strong> snow that starts <em>after</em> the lifts open quietly refills your lines while the early crowd fades to the lodge for a $19 burger.</li>
</ul>` },
      { h2: "Lever #3: once you're there, chase live waits — not the herd", html: `
<p>The classic pow-day trap: that "empty" lift you eyeballed 20 minutes ago is now the longest wait on the mountain, because 400 other people had the identical genius idea. PeakWait shows <strong>live waits reported by riders on the mountain right now</strong> (Moving · Short · Busy · Long, freshness-stamped) and points you to the <strong>best next chair</strong> — so you're always drifting toward the short wait, not into the migration.</p>` },
    ],
    faqs: [
      { q: "How do I avoid lift lines on a powder day?", a: "Pick a smaller resort farther from the city, be booted up before first chair, and use live wait data to chase the moving lifts instead of following the crowd to the same one." },
      { q: "What time should I arrive on a powder day?", a: "Booted and in line before the first chair — often an hour of lead time at big resorts on a storm day. Weekdays need far less." },
      { q: "Which resorts have the shortest powder-day waits?", a: "Smaller hills away from major cities hold fresh snow and stay quieter. PeakWait's \"Where to ski today\" ranks the ones near you by snow and wait, live." },
    ],
    cta: { h: "Stop guessing on the best days", p: `See which mountain has the snow and the shortest waits — and the best next chair once you're there.` },
  },

  {
    slug: "beat-i70-ski-traffic-colorado-crowds",
    title: "How to Beat I-70 Ski Traffic and Colorado Weekend Crowds (2026)",
    description:
      "I-70 on a Saturday is a parking lot with a mountain view. Here's the real Colorado playbook — best days, sleeper resorts, timing, and how to pick a mountain that's actually worth the drive.",
    h1: "How to beat I-70 traffic and Colorado weekend crowds",
    readTime: "7 min",
    published: "2026-08-23",
    updated: "2026-08-23",
    keywords: "i-70 ski traffic, least crowded colorado ski resort, best day to ski colorado, avoid ski crowds colorado, when to leave denver skiing",
    dek: `The honest conclusion every r/COsnow thread arrives at: on a Saturday, you're not stuck in I-70 traffic — you <em>are</em> I-70 traffic. You can't delete the crowds, but you can dodge most of them. Pick the right day, the right mountain, and the right hours, and — critically — know whether a mountain's even worth the drive before you commit to the Eisenhower Tunnel crawl.`,
    sections: [
      { h2: "The I-70 reality check", html: `
<p>There are basically two departure windows that work, and a vast dead zone of despair in between. Leave Denver by <strong>5–6am</strong> to beat the wave, or wait until <strong>~10:30am</strong> to ride the gap after the early crowd has already wedged itself into the tunnel. Everything in the middle is bumper-to-bumper with a side of ski-rack anxiety.</p>
<p>PeakWait can't part the traffic (we're an app, not Moses). But most of the I-70 pain isn't the drive — it's burning a Saturday to drive two hours to a blown-out resort with 45-minute waits. Fix <em>that</em> and the drive suddenly feels worth it.</p>` },
      { h2: "Pick the day (this is 80% of it)", html: `
<ul>
  <li><strong>Sunday > Saturday.</strong> Half of Denver skied Saturday and is nursing its regrets. Sundays run noticeably quieter.</li>
  <li><strong>Avoid the black-diamond dates:</strong> MLK weekend, Presidents weekend, and Dec 26–Jan 2 are a full-contact sport. If you must, expect to make friends in the singles line.</li>
  <li><strong>Weekdays are cheating (in a good way).</strong> A single PTO day can be worth ten Saturdays. Regulars aren't taking Tuesdays off to post on Reddit — they're already on the hill.</li>
</ul>` },
      { h2: "Pick the mountain that's actually worth the drive", html: `
<p>The Front Range flagships — Vail, Breck, Keystone, Copper, Winter Park — absorb the entire Denver metro every weekend. The move the locals quietly make is going <strong>independent or farther out:</strong> Loveland, Eldora, Monarch, Ski Cooper, Wolf Creek, Crested Butte. Less pass hype, more actual skiing.</p>
<p>The catch is picking the right one on the morning of. PeakWait's <strong>"Where to ski today"</strong> ranks the mountains near you by fresh snow × short waits × how much is open — so you point the car at the hill that's genuinely good today, not the one with the loudest marketing.</p>` },
      { h2: "Once you're there: don't ski like a tourist", html: `
<ul>
  <li><strong>Base lifts are the trap.</strong> Everyone piles onto the first chair they see. Ride a mid-mountain lift and the wait can drop from 20 minutes to two.</li>
  <li><strong>Use the singles line.</strong> Skating beats standing. You'll cut the wait dramatically and probably meet a legend.</li>
  <li><strong>First chair, then bounce by 1.</strong> Or flip it — roll in at 1pm as the morning crew heads home and cruise empty groomers till close.</li>
  <li><strong>Chase live waits.</strong> PeakWait shows which lifts are actually moving right now and the best next chair, so you're not committing to a wait you can't see from the base.</li>
</ul>` },
    ],
    faqs: [
      { q: "What's the least crowded ski resort near Denver?", a: "Independents and farther-out mountains — Loveland, Eldora, Monarch, Ski Cooper, Wolf Creek, Crested Butte — stay far quieter than the megapass flagships. Use PeakWait's \"Where to ski today\" to see which one has snow and short waits on a given day." },
      { q: "What's the best day to ski in Colorado to avoid crowds?", a: "A weekday, hands down. If you're stuck with weekends, Sunday beats Saturday, and avoid MLK, Presidents, and the Dec 26–Jan 2 holiday stretch." },
      { q: "When should I leave Denver to beat I-70 ski traffic?", a: "Either early (5–6am) to beat the wave, or around 10:30am to catch the gap after it. The late-morning middle is the worst of both worlds." },
      { q: "Does PeakWait show I-70 traffic?", a: "No — it's a lift-wait and where-to-ski app, not a traffic router. But it helps with the real problem: picking a mountain that actually has snow and short waits, so you don't waste a Saturday driving to a blown-out resort." },
    ],
    cta: { h: "Make the drive worth it", p: `See which Colorado mountain has the snow and the shortest waits today — before you commit to I-70.` },
  },
];

// ---- template --------------------------------------------------------------
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
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
  <a href="${DOWNLOAD_URL}">Download PeakWait — free</a>
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
  <p class="byline">By <b>${AUTHOR}</b> · ${esc(a.readTime)} read · Updated ${esc(a.updated)}</p>
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
<title>Ski Guides — Beat the Wait | PeakWait</title>
<meta name="description" content="Straight-talking guides to skiing smarter: how to beat lift waits, dodge crowds, and find where to actually ski today. By Herb Sendit.">
<link rel="canonical" href="${SITE}/guides/">
<meta property="og:title" content="PeakWait Ski Guides — Beat the Wait">
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
  <p class="lead">Straight-talking guides to beating lift waits, dodging crowds, and finding where to actually ski today — from someone who's spent too much of his life in a singles line. By Herb Sendit.</p>
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
fs.writeFileSync(path.join(ROOT, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);
console.log(`Built ${n} guides + index + sitemap.xml + robots.txt`);
console.log(ARTICLES.map((a) => `  ${SITE}/guides/${a.slug}/`).join("\n"));
