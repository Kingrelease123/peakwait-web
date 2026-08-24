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
const DOWNLOAD_URL = "https://apps.apple.com/us/app/id6793253589"; // live App Store listing
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

  {
    slug: "peakwait-vs-whistler-peak-app",
    title: "PeakWait vs the Whistler Peak App: Which Is Better for Lift Waits?",
    description:
      "Both apps help you plan a Whistler day, but they solve different problems. Here's an honest breakdown of where each one wins, and which to use for real time lift waits.",
    h1: "PeakWait vs the Whistler Peak app: which one for lift waits?",
    readTime: "5 min",
    published: "2026-08-12",
    updated: "2026-08-12",
    keywords: "peakwait vs whistler peak, whistler peak app, best whistler ski app, whistler lift wait app",
    dek: `Short version: the Whistler Peak app (and Whistler Peak Live) is a great all in one dashboard for one mountain. PeakWait is a live, crowdsourced wait tracker for many. If your only question is "which lift is actually short right now," they get there very differently, and the difference matters.`,
    sections: [
      { h2: "What each one is built for", html: `
<p>The Whistler Peak app is a Whistler Blackcomb companion. Conditions, cams, weather, avalanche info, lift status, all in one tidy place for one resort. It's genuinely useful, and plenty of locals lean on it.</p>
<p>PeakWait is a cross resort lift wait app. It covers 91 mountains across the U.S. and Canada, including Whistler Blackcomb, and the whole focus is one question: where is the short wait, right now.</p>` },
      { h2: "Where the wait numbers come from (the important part)", html: `
<p>This is the real difference. The Whistler Peak app's wait times, like most resort companion apps, trace back to the resort's own feed. That feed updates on a delay, so the number can trail the actual line by 15 to 40 minutes. A lot of skiers have watched an app say "12 min" while they stood in 40.</p>
<p>PeakWait's waits come from skiers on the hill reporting what they see, blended with live movement and stamped with how fresh each report is. It's an estimate too, but it's the crowd's live read instead of a delayed official number. <a href="/guides/whistler-lift-wait-times/">Here's the longer story on why resort wait numbers lag.</a></p>` },
      { h2: "One mountain versus many", html: `
<p>If you only ever ski Whistler, a Whistler only app makes sense. If you ski more than one resort, or you want to decide between a few on a given morning, a single resort app can't help you choose. PeakWait's "Where to ski today" ranks nearby mountains by snow and waits, which is the actual call you make before you leave the house.</p>` },
      { h2: "So which should you use?", html: `
<ul>
  <li><strong>Use the Whistler Peak app for</strong> the full Whistler dashboard: cams, avalanche, weather, official status.</li>
  <li><strong>Use PeakWait for</strong> live crowdsourced lift waits, the best next chair, and deciding which mountain to ski, at Whistler and 90 other resorts.</li>
  <li><strong>Honestly, run both.</strong> They don't really compete. One's a resort dashboard, the other's a live wait tracker.</li>
</ul>` },
    ],
    faqs: [
      { q: "Is the Whistler Peak app accurate for wait times?", a: "It's a solid all in one Whistler dashboard, but its wait numbers come from the resort feed, so they lag real conditions. For the live wait, crowdsourced reports like PeakWait's tend to be closer to what you're actually standing in." },
      { q: "Does PeakWait cover Whistler Blackcomb?", a: "Yes. Whistler Blackcomb is one of 91 resorts PeakWait covers across the U.S. and Canada." },
      { q: "What's the difference between PeakWait and the Whistler Peak app?", a: "The Whistler Peak app is a single resort dashboard (conditions, cams, status). PeakWait is a cross resort, crowdsourced live wait tracker that also ranks where to ski today." },
      { q: "Which app is best for Whistler lift lines?", a: "For the live wait right now, a crowdsourced tracker like PeakWait. For the full resort dashboard, the Whistler Peak app. A lot of skiers use both." },
    ],
    cta: { h: "See live Whistler waits", p: `Check crowdsourced lift waits at Whistler and 90 other resorts, plus the best next chair.` },
  },

  {
    slug: "best-ski-lift-wait-apps",
    title: "The Best Apps for Ski Lift Wait Times (2026)",
    description:
      "An honest rundown of the apps skiers use for lift waits, crowds, and conditions, what each one is actually good at, and which to reach for when you just want the short line.",
    h1: "The best apps for ski lift wait times",
    readTime: "6 min",
    published: "2026-08-23",
    updated: "2026-08-23",
    keywords: "best ski lift wait app, ski lift wait times app, best ski apps, apps for lift lines, ski crowd app",
    dek: `There's no single app that does everything, and anyone who says otherwise is selling something. Here's the honest breakdown of what skiers actually use for waits, crowds, tracking, and conditions, and which one to open when your only goal is the shortest line.`,
    sections: [
      { h2: "For live lift waits: PeakWait", html: `
<p>Best for the exact question "which lift is short right now." PeakWait shows crowdsourced waits reported by skiers on the hill (Moving, Short, Busy, Long), ranks where to ski today by snow and crowds across 91 resorts, and points you to the best next chair. It's free to check status and report waits, and PeakWait Plus adds the cross resort guide, powder alerts, and live friend location. It's weakest where nobody's reporting yet, though it says "unknown" instead of guessing.</p>` },
      { h2: "For official status and trail maps: the resort apps", html: `
<p>The Epic and Ikon apps, plus individual resort apps, are the source of truth for lift and trail status, interactive maps, and your pass. Handy and official. The catch is their wait estimates come from resort sensors and feeds, so they lag the real line, and each one only covers its own resorts.</p>` },
      { h2: "For tracking your day: Slopes", html: `
<p>If you want vertical, speed, runs, and a map of your day, Slopes is excellent. It's a tracking app, not a wait app, so it won't tell you which line is short, but it pairs well with one that does. PeakWait also records your day, if you'd rather keep everything in one place.</p>` },
      { h2: "For snow and conditions: OnTheSnow and the forecast apps", html: `
<p>For snowfall totals, base depth, and forecasts, condition apps and sites do the job well. They're great for deciding whether to go, not for what to do once you're there.</p>` },
      { h2: "For one resort, all in one: local companion apps", html: `
<p>Aggregators like Whistler Peak Live bundle cams, weather, avalanche, and status for a single mountain. Good dashboards, one resort each, and their waits still ride on the resort feed. <a href="/guides/peakwait-vs-whistler-peak-app/">Here's the full PeakWait vs Whistler Peak breakdown.</a></p>` },
      { h2: "The short answer", html: `
<p>If your goal is spending less of your day in line, you want live crowdsourced waits and a way to pick the right mountain. That's PeakWait. Pair it with your resort app for official status, add a tracker if you love stats, and you've got the whole day covered.</p>` },
    ],
    faqs: [
      { q: "What's the best app for ski lift wait times?", a: "For live, crowdsourced waits and choosing which mountain to ski, PeakWait. For official lift status, your resort's app (Epic, Ikon, or the resort's own). Many skiers use both together." },
      { q: "Do ski resort apps show accurate wait times?", a: "They show official estimates from resort sensors and feeds, which lag the real line, often by 15 to 40 minutes. Crowdsourced apps report the wait as skiers see it right now." },
      { q: "Is there a free ski lift wait app?", a: "Yes. PeakWait is free to check lift status and report waits, with an optional Plus tier for the cross resort guide, powder alerts, and live friend location." },
      { q: "What app tells you the least crowded lifts or runs?", a: "A live wait app like PeakWait, which shows which lifts are moving now and points you to the best next chair, is built for exactly that." },
    ],
    cta: { h: "Get the short line", p: `See live, crowdsourced lift waits and where to ski today across 91 resorts.` },
  },

  {
    slug: "least-crowded-colorado-ski-resorts",
    title: "The Least Crowded Colorado Ski Resorts (and How to Find the Quiet One Today)",
    description:
      "The big I-70 resorts soak up all of Denver. Here are the Colorado mountains that stay quiet, and how to tell which one is actually empty on any given day.",
    h1: "The least crowded Colorado ski resorts",
    readTime: "6 min",
    published: "2026-08-19",
    updated: "2026-08-19",
    keywords: "least crowded colorado ski resort, quietest ski resort colorado, less crowded ski resorts denver, colorado ski resorts no lines",
    dek: `The honest answer to "which Colorado resort is least crowded" is "the one Denver didn't drive to today." The trophy mountains on I-70 soak up the whole Front Range every weekend. The quiet turns are at the independents and the farther out hills, and on any given morning one of them is having a better day than Vail.`,
    sections: [
      { h2: "Why the famous ones are always the busy ones", html: `
<p>Vail, Breckenridge, Keystone, Copper, and Winter Park are the closest big mountains to three million people, and they're on the passes everyone already bought. That combination is a crowd magnet. Great terrain, but on a Saturday you're sharing it with the entire metro area.</p>` },
      { h2: "The Colorado mountains that stay quieter", html: `
<p>The move locals make is going independent or farther from I-70. None of these are exactly secrets, but they see a fraction of the traffic.</p>
<ul>
  <li><strong>Loveland</strong> and <strong>Arapahoe Basin</strong>: high, snowy, no frills, right off I-70 but far less mobbed than the resort towns.</li>
  <li><strong>Eldora</strong>: Boulder's home hill, close and low key on the right day.</li>
  <li><strong>Monarch</strong> and <strong>Ski Cooper</strong>: smaller, independent, genuinely quiet.</li>
  <li><strong>Wolf Creek</strong>: a long drive south, and the payoff is some of the most snow in Colorado with short waits.</li>
  <li><strong>Crested Butte, Sunlight, Powderhorn</strong>: farther out and harder to reach, which is exactly why the lines are short.</li>
</ul>
<p>Distance is the filter. The harder a mountain is to reach from Denver, the shorter the wait once you're there.</p>` },
      { h2: "But 'least crowded' changes every single day", html: `
<p>Here's the catch. There's no permanent answer. A quiet hill gets slammed the day it snows and everyone reroutes to it. A trophy resort can be dead midweek. Least crowded is a live question, not a fixed list.</p>
<p>That's what PeakWait's "Where to ski today" is for. It ranks nearby Colorado mountains by fresh snow, short waits, and how much terrain is open, so you point the car at the one that's actually quiet this morning, not the one that was quiet last time.</p>` },
      { h2: "Quick rules that always help", html: `
<ul>
  <li>Sunday beats Saturday, and weekdays beat both.</li>
  <li>Skip MLK, Presidents, and the holiday week if you can.</li>
  <li>The farther from Denver, the shorter the wait.</li>
  <li>Once you're there, ride mid mountain lifts and the singles line, and check live waits before you commit to a pod.</li>
</ul>` },
    ],
    faqs: [
      { q: "What is the least crowded ski resort in Colorado?", a: "It changes daily, but the independents and farther out hills (Loveland, Arapahoe Basin, Monarch, Ski Cooper, Wolf Creek, Crested Butte, Eldora) stay far quieter than the I-70 flagships. PeakWait's 'Where to ski today' shows which one is actually least crowded on a given day." },
      { q: "Which Colorado ski resorts have the shortest lift lines?", a: "The smaller, independent, and more distant resorts, especially midweek. The big pass mountains near I-70 have the longest lines on weekends and powder days." },
      { q: "Is A-Basin or Loveland less crowded than Breck or Vail?", a: "Usually yes, especially on weekends. They're higher, simpler, and draw fewer destination visitors, though a powder day can pack anywhere." },
      { q: "How do I know which resort is least crowded today?", a: "Check live, crowdsourced waits. PeakWait ranks nearby resorts by snow and crowds in real time, so you can pick the quiet one before you leave." },
    ],
    cta: { h: "Find the quiet one today", p: `See which Colorado mountain has the snow and the shortest waits right now, before you hit I-70.` },
  },

  {
    slug: "epic-vs-ikon-crowds",
    title: "Epic vs Ikon: Which Pass Has Worse Lift Lines? (2026)",
    description:
      "The question every skier debates before buying. Here's the honest answer on crowds, why it's not really about the pass, and how to avoid the lines either way.",
    h1: "Epic vs Ikon: which pass has worse lift lines?",
    readTime: "6 min",
    published: "2026-08-22",
    updated: "2026-08-22",
    keywords: "epic vs ikon, epic vs ikon crowds, which pass is less crowded, ikon pass lift lines, epic pass lift lines",
    dek: `Every fall, skiers switch passes over crowds, and every spring they swear the other one was worse. Here's the honest take: on a weekend, Epic and Ikon are about the same. The crowd is a function of which mountain and which day, far more than which pass is in your pocket.`,
    sections: [
      { h2: "The debate that never ends", html: `
<p>Open any ski forum in September and you'll find the same thread: "thinking of switching to Ikon, are the lines really that bad?" The answers flip every year. One season everyone flees Ikon for Epic, the next it reverses. That alone tells you something. The pass isn't the variable that matters.</p>` },
      { h2: "Why it's not really about the pass", html: `
<p>Both passes concentrate demand the same way. They sell a whole season at a steep discount, so everyone buys one and everyone goes on the good days. The result is identical: weekends and powder days are packed, weekdays are calm. As the r/COsnow regulars put it, they're the same on the weekends.</p>
<p>What actually drives your wait is the mountain and the timing. Vail on a powder Saturday (Epic) and Winter Park on a powder Saturday (Ikon) are both a maze. Keystone on a Tuesday (Epic) and Arapahoe Basin on a Tuesday (Ikon) are both wide open.</p>` },
      { h2: "Colorado, pass by pass", html: `
<p>If you're picking for the Front Range, here's the rough lay of the land. Lineups shift a little season to season, so confirm before you buy.</p>
<ul>
  <li><strong>Epic:</strong> Vail, Beaver Creek, Breckenridge, Keystone, Crested Butte.</li>
  <li><strong>Ikon:</strong> Winter Park, Copper, Steamboat, Arapahoe Basin, Aspen Snowmass, Eldora.</li>
</ul>
<p>Both have crowd magnets and both have quieter escape hatches. The pass call should come down to which specific mountains you'll actually ski, not a blanket "one is less crowded."</p>` },
      { h2: "The move that beats both", html: `
<p>Whichever pass you carry, the way to dodge the lines is the same: go on the right day, pick the right mountain that morning, and chase the short wait once you're there. PeakWait covers resorts on both passes and shows live waits plus where to ski today, so you're optimizing the variable that actually matters instead of relitigating the pass every September.</p>` },
    ],
    faqs: [
      { q: "Is Epic or Ikon less crowded?", a: "Neither, really. On weekends and powder days they're about the same, because both passes concentrate demand the same way. Crowds depend on the specific mountain and day, not the pass." },
      { q: "Why does everyone say the other pass is more crowded?", a: "The perception flips year to year as skiers switch back and forth. It's mostly recency bias. The data doesn't support one pass being reliably busier than the other." },
      { q: "Which pass should I buy to avoid lines?", a: "Pick based on which specific mountains you'll ski and how close they are, then avoid weekends and holidays. The pass brand matters far less than the mountain and the timing." },
      { q: "How do I avoid lift lines on Epic or Ikon?", a: "Ski weekdays, favor the quieter mountains on your pass, and use live waits (like PeakWait's) to pick the least crowded option each day. PeakWait covers resorts on both passes." },
    ],
    cta: { h: "Beat the lines on any pass", p: `See live waits and where to ski today across resorts on both Epic and Ikon.` },
  },

  {
    slug: "how-long-reasonable-lift-wait",
    title: "How Long Is a Reasonable Lift Wait? (What 400+ Skiers Say)",
    description:
      "We dug into what skiers actually consider an acceptable lift line. The consensus is shorter than you'd think, and it explains why a bad day feels like a betrayal.",
    h1: "How long is a reasonable lift wait?",
    readTime: "4 min",
    published: "2026-08-05",
    updated: "2026-08-05",
    keywords: "reasonable lift wait time, how long should you wait for a ski lift, acceptable lift line, average ski lift wait, how long too long lift line",
    dek: `We went looking for the number: the point where a lift line stops being "fine" and starts ruining the day. It turns out skiers are remarkably united on it, and the answer is a lot shorter than what the big resorts serve up on a Saturday.`,
    sections: [
      { h2: "The number, according to skiers", html: `
<p>In one r/SkiPA poll of more than 400 skiers, the results were lopsided. Almost everyone drew the line at 15 minutes. Roughly half voted that "0 to 5 minutes" is reasonable, roughly half said "5 to 15," and only a tiny handful would accept 15 to 25 or 30 plus. Put simply: about 19 in 20 skiers consider anything past 15 minutes unreasonable.</p>` },
      { h2: "Why the threshold is so low", html: `
<p>It's simple math the r/skiing crowd runs constantly. A run at most resorts lasts a few minutes. Wait 15 minutes for a 5 minute run and you've spent three times as long in line as on snow. As one skier put it, "I wouldn't ski at all if I had to wait 45 minutes per run." Another: "anything longer than 10 minutes is unacceptable, I'll find another lift, leave, or take a break."</p>` },
      { h2: "So why do resorts blow past it?", html: `
<p>Because on weekends and powder days, demand overwhelms lift capacity, and the number you see on the resort app lags the real one. That gap between reasonable (under 15 minutes) and reality (30, 45, 90) is the whole reason a great snow day can still feel like a wasted one.</p>` },
      { h2: "How to stay under the line", html: `
<p>You can keep your own waits close to that reasonable number without setting a 5am alarm.</p>
<ul>
  <li>Ride mid mountain lifts and the singles line, not the base bottlenecks.</li>
  <li>Go on the right day and the right mountain. Weekdays and quieter hills stay in single digits.</li>
  <li>Check live waits before you commit. PeakWait shows which lifts are actually short right now and points you to the best next chair, so you're not gambling a run on a 40 minute surprise.</li>
</ul>` },
    ],
    faqs: [
      { q: "What is a reasonable lift wait time?", a: "Most skiers consider anything under 15 minutes reasonable, and ideally under 5. In a poll of more than 400 skiers, about 96% capped it at 15 minutes, and almost nobody accepted 30 or more." },
      { q: "How long is the average ski lift wait?", a: "It varies wildly by day. Weekday and quieter-resort waits are often under 10 minutes, while weekend and powder-day waits at big resorts routinely hit 30 to 90. On a busy day the real average is far longer than skiers consider acceptable." },
      { q: "How long is too long to wait for a ski lift?", a: "For most skiers, past 15 minutes, and many switch lifts or bail at 10. A 45 minute wait for a short run is widely considered not worth it." },
      { q: "How do I keep my lift waits short?", a: "Ski weekdays or quieter mountains, use mid mountain lifts and the singles line, and check live waits (like PeakWait's) to chase the short lines instead of guessing." },
    ],
    cta: { h: "Keep your waits in single digits", p: `See which lifts are actually short right now and where to ski today.` },
  },

  {
    slug: "alta-snowbird-powder-day-lines",
    title: "Alta and Snowbird on a Powder Day: The Little Cottonwood Playbook (2026)",
    description:
      "Little Cottonwood on a powder day is glorious and brutal in equal measure. Here's how to handle the canyon, the parking, and the lift lines at Alta and Snowbird.",
    h1: "Alta and Snowbird on a powder day: the Little Cottonwood playbook",
    readTime: "6 min",
    published: "2026-08-14",
    updated: "2026-08-14",
    keywords: "alta snowbird powder day, little cottonwood canyon traffic, snowbird lift lines, alta lift lines, LCC powder day",
    dek: `Little Cottonwood serves some of the best snow in North America, and on a powder day it also serves some of the most punishing logistics: one narrow road, closures for avalanche control, a parking scramble, and tram and lift lines to match. Here's how the locals actually play it.`,
    sections: [
      { h2: "The canyon is the first lift line", html: `
<p>Before you wait for a chair, you wait for the road. Little Cottonwood is a single narrow canyon feeding two world class resorts, and on a storm morning it backs up for miles. Avalanche mitigation can close it entirely with no set reopening time. The move is to be at the mouth of the canyon early, or take the UTA ski bus and skip the parking fight altogether.</p>` },
      { h2: "Parking and the early-or-late rule", html: `
<p>Both resorts use parking reservations on peak days, and the lots fill fast. If you didn't reserve, you're gambling. The reliable windows are the same as everywhere: be there before it opens, or roll in late morning once the first wave has parked and the canyon has cleared. The miserable middle is a canyon crawl.</p>` },
      { h2: "The lifts: tram envy and the bottlenecks", html: `
<p>At Snowbird, the tram is the icon and the wait to match, and it doesn't take a Fast Tracks pass, so the line there can be long on a powder morning. Plenty of locals skip it early and lap the chairs for fresh laps while the tram line builds, then ride it once things thin. At Alta, the Collins and Wildcat lines swell right at open. Both settle down by early afternoon.</p>` },
      { h2: "The plays that work", html: `
<ul>
  <li>Reserve parking, or take the bus. That's half the battle in LCC.</li>
  <li>Get above the crowd early on the chairs, and save the marquee tram or bowl laps for when the lines thin.</li>
  <li>A Fast Tracks pass a couple times a season is a sanity purchase on the worst days. Note it isn't valid on Snowbird's tram.</li>
  <li>Check live waits before you commit to a lift, and know when to bail to a quieter pod.</li>
</ul>` },
      { h2: "Where PeakWait fits", html: `
<p>PeakWait covers Alta and Snowbird along with 90 other resorts. On a Little Cottonwood morning it shows which lifts are actually moving and points you to the best next chair, so the powder goes to your legs instead of the tram maze. And if the canyon is a disaster, "where to ski today" can tell you whether Big Cottonwood or a Park City mountain is the smarter call.</p>` },
    ],
    faqs: [
      { q: "How bad are the lines at Alta and Snowbird on a powder day?", a: "On a storm weekend, rough. The canyon backs up for miles, parking fills, and the tram and base lifts see long waits at open. It settles by early afternoon, and weekdays are much calmer." },
      { q: "Do you need a parking reservation for Alta or Snowbird?", a: "On peak days, generally yes. Both use paid or reserved parking that fills fast. Taking the UTA ski bus up Little Cottonwood avoids the parking fight entirely." },
      { q: "Is the Snowbird tram worth the wait on a powder day?", a: "The terrain is, but the tram line can be brutal and a Fast Tracks pass does not skip it. Many locals lap the chairs first and ride the tram once the line thins." },
      { q: "Which is less crowded, Alta or Snowbird?", a: "It varies by day and by lift. Both get packed on powder weekends. Live waits are the only reliable way to tell which pod is moving right now." },
    ],
    cta: { h: "Play Little Cottonwood right", p: `See live waits at Alta, Snowbird, and 90 other resorts, plus where to ski when the canyon is a mess.` },
  },

  {
    slug: "palisades-tahoe-crowds",
    title: "How to Beat the Crowds at Palisades Tahoe (2026)",
    description:
      "Palisades Tahoe on a powder Saturday can mean two great laps and then hour-long lines. Here's how to get more out of it, and when to bail to a quieter Tahoe hill.",
    h1: "How to beat the crowds at Palisades Tahoe",
    readTime: "5 min",
    published: "2026-08-11",
    updated: "2026-08-11",
    keywords: "palisades tahoe crowds, palisades tahoe lift lines, least crowded tahoe ski resort, tahoe powder day crowds",
    dek: `Palisades Tahoe is a legendary mountain with a legendary crowd. On a powder Saturday, regulars say you get two or three great laps before the lines and the Bay Area day-trip wave turn it into a parking lot with a view. Here's how to squeeze the good out of it.`,
    sections: [
      { h2: "The Palisades powder pattern", html: `
<p>The story repeats every storm. Get there early, catch a few untracked laps, and by mid-morning the upper mountain access backs up while the terrain gets tracked. If the upper mountain is on wind hold or delayed for avalanche work, everyone funnels onto fewer lifts and it compounds fast.</p>` },
      { h2: "Timing beats everything here", html: `
<ul>
  <li>Be booted and in line before first chair on a storm day. The difference between 7:45 and 8:20 is an hour of your life.</li>
  <li>Weekdays are a completely different mountain. If you can swing a Tuesday, do it.</li>
  <li>Late arrivals sometimes win. Show up around 1pm as the Bay Area crowd fades and cruise.</li>
</ul>` },
      { h2: "Ski where the day-trippers don't", html: `
<p>The base and marquee lifts absorb the crowd. Working the less obvious pods and riding the singles line keeps you moving. And on the busiest days, a smaller Tahoe hill like Homewood or Sugar Bowl can hold fresh snow for days with a fraction of the wait.</p>` },
      { h2: "When to bail to a quieter Tahoe mountain", html: `
<p>The Tahoe basin has a dozen resorts, and on a Palisades zoo day one of them is quietly having the best day around. PeakWait's "where to ski today" ranks nearby mountains by snow and waits, so you can call the audible before you commit to the Palisades lot. Once you're on the hill, live waits show which lift is actually moving.</p>` },
    ],
    faqs: [
      { q: "How crowded is Palisades Tahoe?", a: "Very, on weekends and powder days, especially with Bay Area day-trippers. Regulars often get a few good laps early, then face long waits. Weekdays are far quieter." },
      { q: "What's the least crowded ski resort in Tahoe?", a: "It changes by day, but smaller hills like Homewood and Sugar Bowl hold snow and stay quieter than Palisades and Heavenly. PeakWait's 'where to ski today' shows which is least crowded now." },
      { q: "What time should I get to Palisades on a powder day?", a: "Before first chair, ideally booted up by 8. Or flip it and arrive around 1pm as the crowd thins. The mid-morning arrival is the worst of both." },
      { q: "How do I avoid lift lines at Palisades Tahoe?", a: "Go early or late, ski the less obvious pods and the singles line, and check live waits to chase the moving lifts. On the busiest days, consider a quieter Tahoe mountain." },
    ],
    cta: { h: "Get more Tahoe laps", p: `See live waits across Tahoe and where to ski today, before you commit to the Palisades lot.` },
  },

  {
    slug: "copper-mountain-lift-lines",
    title: "Copper Mountain Lift Lines: Where to Ski and What to Skip (2026)",
    description:
      "Copper's lines are all about which lift and when. Here's the honest lift by lift on Super Bee, American Flyer, and the pods that stay quiet.",
    h1: "Copper Mountain lift lines: where to ski, what to skip",
    readTime: "5 min",
    published: "2026-08-17",
    updated: "2026-08-17",
    keywords: "copper mountain lift lines, copper super bee line, copper mountain crowds, copper mountain wait times",
    dek: `Copper is a local favorite that gets slammed on weekends, but the crowd is wildly concentrated. A few base lifts eat the whole line while the rest of the mountain runs short. Knowing which is which is the entire game.`,
    sections: [
      { h2: "The Super Bee trap (and the fix)", html: `
<p>Super Bee is Copper's high speed workhorse and its biggest morning bottleneck. On a Saturday it can be a 15 to 30 minute wait at open while the rest of the mountain is quiet. The regulars' consensus is that it's ugly early and then thins out by late morning. Lap something else first, or take the singles line, and come back when it settles.</p>` },
      { h2: "Where the lines actually are", html: `
<ul>
  <li><strong>Morning bottlenecks:</strong> Super Bee and American Flyer at the base absorb the crowd right at open.</li>
  <li><strong>Quieter options:</strong> the fixed grip lifts and the back side see a fraction of the traffic. Locals lap those while everyone queues at the base.</li>
  <li><strong>The pattern:</strong> base lifts are brutal from about 9 to 10:30, then the mountain spreads out and the waits drop off.</li>
</ul>` },
      { h2: "The Copper playbook", html: `
<ul>
  <li>Get first chair, or arrive after 10:30 once the base thins.</li>
  <li>Don't default to Super Bee. Ride the quieter pods and let the crowd sort itself out.</li>
  <li>Singles line, always.</li>
  <li>Parking fills early even without new snow, so come early or take the shuttle.</li>
</ul>` },
      { h2: "Check before you commit", html: `
<p>Which base lift is moving changes hour to hour. PeakWait shows live, crowdsourced waits at Copper and points you to the best next chair, so you're not walking across the base to discover a 25 minute line. And on a big Front Range Saturday, "where to ski today" can tell you whether Copper is even the right call versus a quieter I-70 option.</p>` },
    ],
    faqs: [
      { q: "How long are the lift lines at Copper Mountain?", a: "On weekend mornings the base lifts (Super Bee, American Flyer) can run 15 to 30 minutes while the rest of the mountain stays short. Lines thin by late morning, and weekdays are quiet." },
      { q: "Is Super Bee always busy at Copper?", a: "It's the biggest morning bottleneck, busy right at open on weekends, then it thins by late morning. Ride other pods first or use the singles line." },
      { q: "What time should I get to Copper Mountain?", a: "First chair, or after about 10:30 once the base crowd spreads out. The 9 to 10:30 window at the base lifts is the worst." },
      { q: "How do I avoid lines at Copper?", a: "Skip the base bottlenecks early, ride the quieter pods and the singles line, and check live waits to see which lift is actually moving." },
    ],
    cta: { h: "Skip the Super Bee line", p: `See live Copper waits and the best next chair, and check where to ski today before you drive up.` },
  },

  {
    slug: "best-time-to-ski-avoid-crowds",
    title: "The Best Time to Ski to Avoid Crowds (2026)",
    description:
      "The day, the hour, and the dates that decide whether you ski powder or stand in a maze. Here's when to go, when to arrive, and when to just stay home.",
    h1: "The best time to ski to avoid crowds",
    readTime: "5 min",
    published: "2026-08-03",
    updated: "2026-08-03",
    keywords: "best time to ski to avoid crowds, best day to ski, least busy time to ski, when to ski no lines, avoid ski crowds",
    dek: `Crowds at a ski resort aren't random. They run on a schedule you can game. Pick the right day, show up at the right hour, and dodge a handful of dates, and the same mountain that's a two hour maze on Saturday is a ghost town with your name on it.`,
    sections: [
      { h2: "The best day: weekday, then Sunday, then Saturday", html: `
<p>This is the single biggest lever. A weekday is a different sport: first ten chairs with a buffer, empty groomers, no parking fight. If you're stuck with weekends, Sunday beats Saturday almost everywhere, because half the crowd skied Saturday and is nursing sore legs. Saturday, especially a sunny one after a storm, is the worst day of the week.</p>` },
      { h2: "The best hour: early or late, never mid-morning", html: `
<p>Within a day, the crowd has a shape. First chair through about 10am is calm if you beat the rush, then the mountain fills and stays packed through early afternoon, then it empties as people leave for lunch, traffic, or the couch. The two sweet spots are booted before first chair, or rolling in around 1pm to cruise while everyone drives home. The 9 to 11am arrival is the worst of both.</p>` },
      { h2: "The dates to avoid entirely", html: `
<ul>
  <li>The holiday week, December 26 through January 2.</li>
  <li>MLK weekend and Presidents weekend.</li>
  <li>Spring break weeks, which vary by region, roughly late February through March.</li>
  <li>The first sunny Saturday after a big storm. Snow plus weekend plus sun is peak chaos.</li>
</ul>
<p>If those are the only windows you've got, lower your expectations and lean hard on the other tricks.</p>` },
      { h2: "The wildcard: powder days", html: `
<p>Powder breaks the schedule. A big storm pulls a crowd on any day, even a Tuesday, and terrain opens slowly while patrol works, so everyone funnels onto fewer lifts. On a powder day the timing rules matter even more, and which mountain you pick matters most of all.</p>` },
      { h2: "Put it together", html: `
<p>The move is simple: go midweek if you can, Sunday if you can't, arrive early or late, skip the holiday dates, and on powder days pick the right mountain. PeakWait handles the last two in real time. It shows live waits so you can time your laps, and ranks where to ski today so you point the car at the quiet one.</p>` },
    ],
    faqs: [
      { q: "What is the best day of the week to ski to avoid crowds?", a: "A weekday, by far. If you're limited to weekends, Sunday is usually quieter than Saturday. Saturdays, especially sunny post-storm ones, are the busiest." },
      { q: "What time of day is least crowded at a ski resort?", a: "Right at first chair before the rush, or after about 1pm once the morning crowd leaves. Mid-morning, roughly 9 to 11, is the most crowded." },
      { q: "What are the most crowded days to ski?", a: "The December 26 to January 2 holiday week, MLK and Presidents weekends, spring break, and the first sunny Saturday after a storm." },
      { q: "How do I know when a specific resort will be busy?", a: "Use live, crowdsourced waits like PeakWait's to see the crowd in real time, and check where to ski today to pick the least busy mountain near you." },
    ],
    cta: { h: "Time it right", p: `See live waits and where to ski today, so you show up when the lines are short.` },
  },

  {
    slug: "steamboat-crowds-morningside",
    title: "Steamboat Crowds and the Morningside Line: How to Ski Around Them (2026)",
    description:
      "Steamboat's gondola and the infamous Morningside lift can eat your morning. Here's where the lines actually are and how the regulars route around them.",
    h1: "Steamboat crowds and the Morningside line",
    readTime: "5 min",
    published: "2026-08-06",
    updated: "2026-08-06",
    keywords: "steamboat lift lines, morningside steamboat, steamboat crowds, steamboat gondola line, steamboat wait times",
    dek: `Steamboat has legendary tree skiing and a couple of legendary bottlenecks to match. The base gondola on a powder morning and the slow Morningside lift out back are where days go to die. Here's how to route around both.`,
    sections: [
      { h2: "The two chokepoints", html: `
<ul>
  <li><strong>The base gondola:</strong> on a powder or holiday morning the line can stretch back toward the base area, sometimes past the buildings. It's the price of admission to the upper mountain, and everyone pays it at the same time.</li>
  <li><strong>Morningside:</strong> the fixed grip triple serving the good stuff out back is beloved and slow. Regulars call it a necessary evil, "10 million people in line for a low speed triple." Great terrain, painful throughput.</li>
</ul>` },
      { h2: "How to beat the gondola", html: `
<p>Be booted and in the maze before it opens, or wait it out. The gondola line thins by late morning once the first wave is up. On a storm day, a lot of locals ride an alternate base lift to get up rather than default to the gondola with everyone else.</p>` },
      { h2: "How to handle Morningside", html: `
<p>Morningside is worth it, but time it. Hit it early before the crowd migrates out back, or later once the herd has moved on. In between, it's a long wait for a slow ride. If the line is a horror, there's plenty of tree skiing off the faster lifts that stays quieter.</p>` },
      { h2: "The Steamboat playbook", html: `
<ul>
  <li>First gondola or bust, otherwise wait for the late-morning lull.</li>
  <li>Ski Morningside at the edges of the day, not the middle.</li>
  <li>Weekdays and non-holidays are dramatically calmer.</li>
  <li>Check live waits before committing to the gondola or the trek out back.</li>
</ul>` },
      { h2: "Check before you commit", html: `
<p>Which lift is worth it changes by the hour. PeakWait shows live, crowdsourced waits at Steamboat and points you to the best next chair, so you don't hike out to Morningside to find a 30 minute line. Steamboat is one of 91 resorts it covers.</p>` },
    ],
    faqs: [
      { q: "How bad are the lift lines at Steamboat?", a: "On powder and holiday mornings, the base gondola and the Morningside lift can run 30 minutes or more. The rest of the mountain and the tree skiing stay more manageable, and weekdays are much quieter." },
      { q: "Why is the Morningside lift at Steamboat so slow?", a: "It's a fixed grip triple serving popular terrain, so it's low throughput for high demand. Locals treat it as a necessary evil and time their laps to the start or end of the day." },
      { q: "What's the best way to beat the Steamboat gondola line?", a: "Be in the maze before it opens, or wait for the late-morning lull. On storm days, use an alternate base lift instead of defaulting to the gondola." },
      { q: "When is Steamboat least crowded?", a: "Weekdays and non-holiday periods. Avoid holiday weeks and the first sunny days after a storm. Live waits show the real picture on any given day." },
    ],
    cta: { h: "Route around the Steamboat lines", p: `See live Steamboat waits and the best next chair before you commit to the gondola or Morningside.` },
  },

  {
    slug: "northeast-ski-crowds",
    title: "Beating Lift Lines on the Ice Coast: A Northeast Crowds Guide (2026)",
    description:
      "Short vert makes a 20 minute Northeast lift line feel worse than an hour out West. Here's how to beat the crowds at Killington, Stowe, and the rest of the ice coast.",
    h1: "Beating lift lines on the ice coast",
    readTime: "6 min",
    published: "2026-08-09",
    updated: "2026-08-09",
    keywords: "northeast ski crowds, killington lift lines, stowe crowds, ice coast lift lines, least crowded northeast ski resort",
    dek: `Out West, a long wait ruins a long run. In the Northeast, the runs are shorter, so the wait to ski ratio is even more brutal. A 20 minute line for a two minute trail is its own special heartbreak. Here's how to ski around it on the ice coast.`,
    sections: [
      { h2: "Why Northeast lines hurt more", html: `
<p>It's math. A trail that takes two or three minutes top to bottom, followed by a 20 minute wait, means you're standing around ten times longer than you're skiing. Add cold, wind, and a weekend crowd of day-trippers from Boston and New York, and a modest line feels catastrophic. The pain is real even when the number is smaller than a Vail Saturday.</p>` },
      { h2: "The usual suspects", html: `
<ul>
  <li><strong>Killington:</strong> the big one, and the busy one. The base lifts back up early on weekends. Get first chair out of the popular pods, or ride something less obvious.</li>
  <li><strong>Stowe, Sugarbush, Sunday River, and the other Epic and Ikon anchors</strong> pull heavy weekend traffic from the metros.</li>
  <li><strong>The quieter play:</strong> smaller independent New England hills see a fraction of the crowd and are often a short drive from the famous ones.</li>
</ul>` },
      { h2: "The ice coast playbook", html: `
<ul>
  <li>Weekday if you possibly can. The Northeast weekend surge is intense and concentrated.</li>
  <li>First chair then bounce, or arrive after 1. Same early-or-late rule as everywhere.</li>
  <li>Ride mid mountain and the less famous lifts. The marquee pods take the brunt.</li>
  <li>On a storm or holiday, a smaller nearby hill often beats fighting the flagship.</li>
</ul>` },
      { h2: "Check before you drive", html: `
<p>The Northeast is dense with resorts, so the "is it worth it" call is really "which one." PeakWait shows live waits across Northeast mountains and ranks where to ski today, so you can pick the short line before you commit to the drive. It covers Killington, Stowe, and the rest of the region among its 91 resorts.</p>` },
    ],
    faqs: [
      { q: "Which Northeast ski resort has the worst lift lines?", a: "The big Epic and Ikon anchors like Killington draw the heaviest weekend crowds. Lines feel especially bad because Northeast runs are short, so the wait to ski ratio is high." },
      { q: "What's the least crowded ski resort in the Northeast?", a: "Smaller independent New England hills stay far quieter than the flagships, often a short drive away. PeakWait's where to ski today shows which is least crowded on a given day." },
      { q: "Why do Northeast lift lines feel worse than out West?", a: "Shorter vertical means shorter runs, so even a 15 to 20 minute wait buys only a couple minutes of skiing. The ratio, plus cold and wind, makes modest lines feel brutal." },
      { q: "How do I avoid lift lines at Killington?", a: "Ski weekdays, get first chair or arrive after 1pm, ride the less obvious lifts, and check live waits to find the short line. On busy days, consider a smaller nearby hill." },
    ],
    cta: { h: "Beat the ice coast lines", p: `See live Northeast waits and where to ski today before you make the drive.` },
  },
];

// ---- product updates (changelog / release blog) ----------------------------
const UPDATES = [
  {
    slug: "sort-by-pass",
    version: "1.0.1",
    date: "2026-08-24",
    title: "Sort by Pass, and a Smarter Home Screen",
    summary: "The 1.0.1 update sorts your mountains by pass, redesigns the offseason home screen with a live countdown, and makes closed mountains read Closed instead of No data.",
    sections: [
      { h2: "Sort by pass", html: `
<p>You bought a pass. Your mountains should sit together. The new <strong>By pass</strong> sort does exactly that. Open the sort menu and group every resort by <strong>Epic, Ikon, Power, or Independent</strong>, so the mountains you can actually ski are in one place instead of scattered through the whole list.</p>
<p>It's a small change that turns out to matter a lot when you're deciding where to go on a pass day.</p>` },
      { h2: "A clearer where to ski today", html: `
<p>The daily picks were always ranked, but the score sat there as a mystery number. Now it tells you what it means: each pick is scored <strong>0 to 100 on fresh snow, short waits, and how much of the mountain is open</strong>. Higher is a better day. Same ranking, a lot less guessing.</p>` },
      { h2: "Better pass badges", html: `
<p>Every mountain now wears the right badge, including <strong>Power Pass</strong> resorts like Purgatory and Powderhorn that used to show up with none. We're also working through a full verification of pass affiliations across all 91 resorts, so these keep getting sharper.</p>` },
      { h2: "An offseason that pulls its weight", html: `
<p>The hard truth about a ski app in August is that nothing is spinning. So we rebuilt the offseason home screen to be useful instead of empty. It now leads with a <strong>live countdown to the first chair</strong> and a read on roughly when the season opens, then hands you the one job actually worth doing today: <strong>star your mountains and turn on alerts</strong>, so we can ping you the moment the lifts start turning and the first snow lands.</p>
<p>Less wall of text, more signal. The app is honest about what it can tell you today, and clear about the day it comes alive.</p>` },
      { h2: "Closed means closed", html: `
<p>When a mountain is shut for the season, the app used to shrug and say <em>No data</em>, which reads like something is broken. Now a closed mountain simply reads <strong>Closed</strong>. You are never left wondering whether the app glitched or the mountain did.</p>` },
      { h2: "Smoother everywhere", html: `
<p>Leaderboards no longer flash a false error when you switch between boards. Your handle shows up instantly on your stats instead of blinking through a placeholder. Where to ski today is quicker to open and easier to tap into. Plus the usual round of fixes to keep things fast, honest, and out of your way on a powder morning.</p>` },
    ],
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
  © 2026 PeakWait LLC · <a href="/">Home</a> · <a href="/guides/">Guides</a> · <a href="/updates/">Updates</a> · <a href="/terms/">Terms</a> · <a href="/privacy/">Privacy</a>
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

function updateHtml(u, others) {
  const url = `${SITE}/updates/${u.slug}/`;
  const artLd = {
    "@context": "https://schema.org", "@type": "Article", headline: `PeakWait ${u.version}: ${u.title}`,
    description: u.summary, author: { "@type": "Organization", name: "PeakWait" },
    publisher: { "@type": "Organization", name: "PeakWait", logo: { "@type": "ImageObject", url: `${SITE}/icon-512.png` } },
    datePublished: u.date, dateModified: u.date, mainEntityOfPage: url, image: `${SITE}/og.png`,
  };
  const body = u.sections.map((s) => `<h2>${esc(s.h2)}</h2>${s.html.trim()}`).join("\n");
  const other = others.length ? `<div class="related"><h2>More updates</h2>` +
    others.map((o) => `<a href="/updates/${o.slug}/">v${esc(o.version)} · ${esc(o.title)}</a>`).join("") + `</div>` : "";
  const cta = `
<div class="cta">
  <h3>Get PeakWait</h3>
  <p>Live lift waits, where to ski today, and the best next chair. Free on the App Store.</p>
  <a href="${DOWNLOAD_URL}">Download PeakWait, free</a>
  <div class="tagline">Ski the mountain, skip the wait.</div>
</div>`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>PeakWait ${esc(u.version)}: ${esc(u.title)}</title>
<meta name="description" content="${esc(u.summary)}">
<meta name="author" content="PeakWait">
<link rel="canonical" href="${url}">
<meta property="og:type" content="article">
<meta property="og:title" content="PeakWait ${esc(u.version)}: ${esc(u.title)}">
<meta property="og:description" content="${esc(u.summary)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE}/og.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<meta name="theme-color" content="#070F16">
<script type="application/ld+json">${JSON.stringify(artLd)}</script>
<style>${CSS}
.verpill{display:inline-block;background:var(--gold);color:#04121f;font-weight:800;font-size:.72rem;padding:3px 9px;border-radius:6px;letter-spacing:.03em}</style>
</head>
<body>
${header()}
<main><div class="wrap">
  <nav class="crumbs"><a href="/">Home</a> › <a href="/updates/">Updates</a> › v${esc(u.version)}</nav>
  <p class="byline"><span class="verpill">v${esc(u.version)}</span>&nbsp;&nbsp;${fmtDate(u.date)}</p>
  <h1>${esc(u.title)}</h1>
  ${body}
  ${cta}
  ${other}
</div></main>
${footer()}
</body>
</html>`;
}

function updatesIndexHtml(updates) {
  const cards = updates.map((u) => `
  <a class="card" href="/updates/${u.slug}/">
    <h2><span class="verpill">v${esc(u.version)}</span> ${esc(u.title)}</h2>
    <p>${esc(u.summary)}</p>
    <span class="meta">${fmtDate(u.date)}</span>
  </a>`).join("\n");
  const listCss = `.lead{font-size:1.12rem;color:var(--ink2);margin:6px 0 30px}
.verpill{display:inline-block;background:var(--gold);color:#04121f;font-weight:800;font-size:.7rem;padding:2px 8px;border-radius:6px;letter-spacing:.03em;vertical-align:middle;margin-right:6px}
.card{display:block;background:var(--surface);border:1px solid var(--hair);border-radius:14px;padding:22px 22px;margin:0 0 16px}
.card:hover{border-color:var(--brand);text-decoration:none}
.card h2{font-size:1.25rem;margin:0 0 8px;color:var(--ink)}
.card p{margin:0 0 10px}
.card .meta{font-size:.8rem;color:var(--ink3)}`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Product Updates | PeakWait</title>
<meta name="description" content="What's new in PeakWait: release notes and the story behind each update.">
<link rel="canonical" href="${SITE}/updates/">
<meta property="og:title" content="PeakWait Product Updates">
<meta property="og:description" content="What's new in PeakWait: release notes and the story behind each update.">
<meta property="og:url" content="${SITE}/updates/">
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
  <nav class="crumbs"><a href="/">Home</a> › Updates</nav>
  <h1>Product updates</h1>
  <p class="lead">What's new in PeakWait, and the story behind each release.</p>
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
    { loc: SITE + "/updates/", pri: "0.5" },
    ...UPDATES.map((u) => ({ loc: `${SITE}/updates/${u.slug}/`, pri: "0.5", lastmod: u.date })),
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
fs.mkdirSync(path.join(ROOT, "updates"), { recursive: true });
for (const u of UPDATES) {
  const dir = path.join(ROOT, "updates", u.slug);
  fs.mkdirSync(dir, { recursive: true });
  const others = UPDATES.filter((o) => o.slug !== u.slug).slice(0, 3);
  fs.writeFileSync(path.join(dir, "index.html"), updateHtml(u, others));
}
fs.writeFileSync(path.join(ROOT, "updates", "index.html"), updatesIndexHtml(UPDATES));
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), sitemap(ARTICLES));
fs.writeFileSync(path.join(ROOT, "robots.txt"), ROBOTS);
fs.writeFileSync(path.join(ROOT, "llms.txt"), llmsTxt(ARTICLES));
fs.writeFileSync(path.join(ROOT, "llms-full.txt"), llmsFull(ARTICLES));
console.log(`Built ${n} guides + index + sitemap.xml + robots.txt + llms.txt + llms-full.txt`);
console.log(ARTICLES.map((a) => `  ${SITE}/guides/${a.slug}/`).join("\n"));
