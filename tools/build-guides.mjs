#!/usr/bin/env node
/**
 * PeakWait Guides — static content engine.
 * Add an entry to ARTICLES, run `node tools/build-guides.mjs`, commit the output.
 * Emits: /guides/<slug>/index.html, /guides/index.html, /updates/** (from updates-src/), /sitemap.xml, /robots.txt
 * Author byline is always "Herb Sendit" (never the founder's real name).
 * Voice: human, funny, no em-dashes, minimal hyphens.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

import { SITE, DOWNLOAD_URL, esc, waitify, head, nav, footer, endCta, device } from "./lib/shell.mjs";
import { britishSummary } from "./lib/american.mjs";
const AUTHOR = "Herb Sendit";
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");

// ---- content ---------------------------------------------------------------
const ARTICLES = [
  {
    slug: "ski-resort-lift-lines",
    title: "Why Ski Resort Lift Lines Feel So Brutal Now, and How to Get Your Day Back",
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
<p>The real wound isn't the wait. It's the ratio. An hour in line for a two minute run. A whole powder day boiled down to six runs. People do that math while their toes go numb, and something snaps. "I spent more time in various lift lines than actually skiing." At that point you're not skiing. You're queuing with a hobby attached.</p>` },
      { h2: "The powder day paradox", html: `
<p>Here's the cruel part. The best snow brings the worst waits. The exact days you'd skip work to ski are the days everyone else has the same idea. Fresh snow falls, terrain opens slowly while patrol does avalanche work, and the whole mountain funnels onto three lifts. Best conditions, longest lines, every single time. You could set your watch by it.</p>` },
      { h2: `"$200 to stand in a line"`, html: `
<p>Then there's the money. Nothing sours a day faster than the value math: a couple hundred bucks for a ticket, and you got seven runs. People have filmed themselves hiking up the mountain because it was faster than the wait. When paying customers would rather walk than ride the lift, something is broken.</p>` },
      { h2: `The "this isn't even skiing anymore" feeling`, html: `
<p>The megapass era crammed the mountains full, and you can feel it. Tens of thousands of people squeezing through a handful of lifts stops feeling like a mountain and starts feeling like a theme park with worse food. "It's not even skiing anymore at some of these resorts," people say. That's not gatekeeping. It's grief for something they love.</p>` },
      { h2: "The part that's actually infuriating, and fixable", html: `
<p>Here's the detail buried in every crowd thread, and it's the one that matters. The waits are wildly uneven. There's a 20 minute line at one lift while a chair on the far side of the mountain runs half empty. Lifties aren't filling chairs. One lift absorbs the whole crowd while its twin spins with room to spare.</p>
<p>So the short wait almost always exists. Somewhere on the mountain, right now, there's a good option. The problem was never that every lift is slammed. The problem is you can't see the empty one from where you're standing, so everybody piles onto the same obvious lift and makes it worse.</p>` },
      { h2: "What you can actually control", html: `
<p>You can't fix the megapass, the parking, or the powder day math. But you can stop handing your whole day to the longest line on the hill.</p>
<ul>
  <li><strong>Point the car at the right mountain.</strong> On any given morning, one nearby resort has the snow and the short waits. PeakWait's <strong>"Where to ski today"</strong> ranks them, so you skip the blown out flagship for the sleeper that's quietly having the best day around.</li>
  <li><strong>Go find the short wait that already exists.</strong> PeakWait shows <strong>live waits reported by skiers on the hill right now</strong>, tagged Moving, Short, Busy, or Long, and points you to the <strong>best next chair</strong>, so you ride to the empty lift instead of guessing.</li>
  <li><strong>Ski like a local.</strong> Take the mid mountain lifts over the base lifts, use the singles line every time, and either grab first chair and bounce by 1, or roll in at 1pm as everyone leaves.</li>
</ul>
<p>None of this turns a powder Saturday into a quiet Tuesday. But it's the difference between six runs and sixteen.</p>` },
    ],
    faqs: [
      { q: "Why are ski resort lift lines so long now?", a: "Megapasses like Epic and Ikon put more skiers on the same mountains, powder days pack everyone onto whatever terrain is open, and the waits are uneven, so one popular lift soaks up the traffic while others run under capacity." },
      { q: "Are ski resorts too crowded?", a: "On weekends, holidays, and powder days at the big pass resorts, often yes. Smaller and independent resorts stay much quieter, and on any given day the short waits still exist somewhere. The trick is finding them." },
      { q: "What's the longest you should wait for a lift?", a: "Most experienced skiers cap it around 10 to 15 minutes. Anything past 30 is considered extreme, and plenty of people will just leave rather than wait 45 minutes for a short run." },
      { q: "How do I find the shortest lift line?", a: "Check live waits from other skiers, like PeakWait's, instead of guessing from the base. The shortest wait is usually on a lift you can't see, and an app that reads it live sends you straight there." },
      { q: "Does PeakWait help with crowds?", a: "Yes. It shows live waits from skiers on the hill, ranks which mountain to ski today by snow and waits, and points you to the best next chair, so you spend the day skiing instead of standing." },
    ],
    cta: { h: "Spend the day skiing, not standing", p: `See which mountain has the snow and the short waits today, plus the best next chair once you're there.` },
  },

  {
    slug: "whistler-lift-wait-times",
    title: "Whistler Lift Wait Times in 2026: Where the Waits Build and How to Ski Around Them",
    description:
      "Where the waits build at Whistler Blackcomb, lift by lift, when they clear, and how to check the wait live before you commit to a chair.",
    h1: "Whistler lift wait times: where the waits build and how to ski around them",
    readTime: "5 min",
    published: "2026-07-31",
    updated: "2026-11-09",
    keywords: "whistler lift wait times, whistler chairlift wait times, 7th heaven wait, whistler blackcomb crowds, best time to ski whistler",
    dek: `Whistler Blackcomb is huge, but the waits still pile up in a few predictable places. Here is where they build, when they clear, and how to check the wait from the people standing in it before you ski across the mountain to join it.`,
    sections: [
      { h2: "How a Whistler wait changes through the day", html: `
<p>A wait at Whistler moves fast. The empty chair you spotted on the last lap can be the longest wait on the hill twenty minutes later, especially on a powder morning or when the lower mountain is socked in and everyone heads up top.</p>
<ul>
  <li><strong>First hour:</strong> the gondolas and the base chairs take the hit while the alpine waits for patrol to open it.</li>
  <li><strong>Late morning:</strong> the alpine lifts fill once they open, and the crowd follows the fresh snow.</li>
  <li><strong>Lunch:</strong> the quietest window of the day for the busy chairs, if you can eat early or late.</li>
</ul>
<p>The trick is reading the wait as it is now, not as it was on your last ride up.</p>` },
      { h2: "Check the wait from the people already standing in it", html: `
<p>That is the whole idea behind PeakWait. It shows what riders on the hill this minute are reporting, so you can pick a chair before you ski to it.</p>
<ul>
  <li>Skiers tag each lift Moving, Short, Busy, or Long as they see it, blended with live movement on the mountain.</li>
  <li>Every wait comes with a timestamp, so you know if it's two minutes old or two hours old. With no signal, it says so instead of guessing.</li>
  <li>Then it points you to the best next chair across the whole mountain, so you're skiing toward the short wait instead of into the crowd.</li>
</ul>` },
      { h2: "7th Heaven, Harmony, Symphony: the usual suspects", html: `
<ul>
  <li><strong>The alpine trio</strong> can hit 45 minutes on a weekend or powder day. Amazing terrain, not so amazing lift capacity. Lap it early or late, not at noon with everyone else.</li>
  <li><strong>When the lower mountain is socked in or unskiable,</strong> everybody funnels up top and the alpine waits spike. That's exactly when a live wait earns its keep.</li>
  <li><strong>Pow mornings:</strong> the empty lift you spotted 20 minutes ago is now the longest wait on the hill. Go by the live wait, not the last one you saw.</li>
</ul>` },
    ],
    faqs: [
      { q: "How do I check Whistler lift wait times live?", a: "Open PeakWait for live waits reported by skiers on the mountain right now, shown as Moving, Short, Busy or Long with how fresh each one is." },
      { q: "When are Whistler lift waits shortest?", a: "First chair, over lunch and in the last hour of the day, and midweek outside the holidays." },
      { q: "Why is 7th Heaven always so busy?", a: "Big, popular alpine terrain served by limited chair capacity, so it fills up fast, especially on powder and weekend days. Lap it first thing or late afternoon." },
      { q: "How does PeakWait get its wait times?", a: "From skiers on the mountain reporting live waits, blended with movement data, shown as timestamped bands: Moving, Short, Busy, or Long." },
    ],
    cta: { h: "Check Whistler waits first", p: `See Whistler waits from the people on the hill, plus the best next chair to ski.` },
  },

  {
    slug: "beat-powder-day-crowds",
    title: "How to Beat Powder Day Crowds and Still Get Fresh Tracks in 2026",
    description:
      "Powder days now mean 90 minute waits and everything tracked out by 11am. Here's how to actually score freshies: smarter resort picks, timing, and live wait data. No 5am alarm required.",
    h1: "How to beat powder day crowds, and still get fresh tracks",
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
      { h2: "Lever 2: time it, no suffering required", html: `
<ul>
  <li><strong>Be booted up before first chair</strong> on a real pow day. The gap between rolling in at 7:45 and 8:20 can be a full extra hour stuck in the base area conga line.</li>
  <li><strong>Weekdays are a different sport.</strong> First ten chairs with a 15 minute buffer and room to breathe.</li>
  <li><strong>Watch the storm clock.</strong> Snow that starts after the lifts open quietly refills your lines while the early crowd wanders off to the lodge for a $19 burger.</li>
</ul>` },
      { h2: "Lever 3: once you're there, chase live waits, not the herd", html: `
<p>The classic pow day trap: that "empty" lift you eyeballed 20 minutes ago is now the longest wait on the mountain, because 400 other people had the identical genius idea. PeakWait shows live waits reported by riders on the mountain right now, tagged Moving, Short, Busy, or Long and timestamped, and points you to the best next chair, so you're always drifting toward the short wait instead of into the migration.</p>` },
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
    title: "How to Beat I-70 Ski Traffic and Colorado Weekend Crowds in 2026",
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
      { h2: "Pick the day, it's 80% of it", html: `
<ul>
  <li><strong>Sunday beats Saturday.</strong> Half of Denver skied Saturday and is nursing its regrets. Sundays run noticeably quieter.</li>
  <li><strong>Avoid the black diamond dates.</strong> MLK weekend, Presidents weekend, and December 26 through January 2 are a full contact sport. If you have to go, expect to make friends in the singles line.</li>
  <li><strong>Weekdays are cheating, in a good way.</strong> A single PTO day can be worth ten Saturdays. The regulars aren't taking Tuesdays off to post on Reddit. They're already on the hill.</li>
</ul>` },
      { h2: "Pick the mountain that's actually worth the drive", html: `
<p>The Front Range flagships, Vail, Breck, Keystone, Copper, and Winter Park, soak up the entire Denver metro every weekend. The quiet move the locals make is going independent or farther out: Loveland, Eldora, Monarch, Ski Cooper, Wolf Creek, Crested Butte. Less pass hype, more actual skiing.</p>
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
    slug: "least-crowded-colorado-ski-resorts",
    title: "The Least Crowded Colorado Ski Resorts, and How to Find the Quiet One Today",
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
      { q: "What is the least crowded ski resort in Colorado?", a: "It changes daily, but the independents and farther out hills, Loveland, Arapahoe Basin, Monarch, Ski Cooper, Wolf Creek, Crested Butte, and Eldora, stay far quieter than the I-70 flagships. PeakWait's 'Where to ski today' shows which one is actually least crowded on a given day." },
      { q: "Which Colorado ski resorts have the shortest lift lines?", a: "The smaller, independent, and more distant resorts, especially midweek. The big pass mountains near I-70 have the longest lines on weekends and powder days." },
      { q: "Is A-Basin or Loveland less crowded than Breck or Vail?", a: "Usually yes, especially on weekends. They're higher, simpler, and draw fewer destination visitors, though a powder day can pack anywhere." },
      { q: "How do I know which resort is least crowded today?", a: "Check live, crowdsourced waits. PeakWait ranks nearby resorts by snow and crowds in real time, so you can pick the quiet one before you leave." },
    ],
    cta: { h: "Find the quiet one today", p: `See which Colorado mountain has the snow and the shortest waits right now, before you hit I-70.` },
  },

  {
    slug: "epic-vs-ikon-crowds",
    title: "Epic vs Ikon: Which Pass Has Worse Lift Lines in 2026?",
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
<p>What actually drives your wait is the mountain and the timing. An Epic mountain like Vail on a powder Saturday and an Ikon mountain like Winter Park on a powder Saturday are both a maze. An Epic mountain like Keystone on a Tuesday and an Ikon mountain like Arapahoe Basin on a Tuesday are both wide open.</p>` },
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
      { q: "How do I avoid lift lines on Epic or Ikon?", a: "Ski weekdays, favor the quieter mountains on your pass, and use live waits, like PeakWait's, to pick the least crowded option each day. PeakWait covers resorts on both passes." },
    ],
    cta: { h: "Beat the lines on any pass", p: `See live waits and where to ski today across resorts on both Epic and Ikon.` },
  },

  {
    slug: "how-long-reasonable-lift-wait",
    title: "How Long Is a Reasonable Lift Wait? What 400+ Skiers Say",
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
<p>Because on weekends and powder days, demand overwhelms lift capacity, and the wait builds faster than you can see it from the base. That gap between a reasonable wait under 15 minutes and a real one of 30, 45, or 90 minutes is the whole reason a great snow day can still feel like a wasted one.</p>` },
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
      { q: "How do I keep my lift waits short?", a: "Ski weekdays or quieter mountains, use mid mountain lifts and the singles line, and check live waits, like PeakWait's, to chase the short lines instead of guessing." },
    ],
    cta: { h: "Keep your waits in single digits", p: `See which lifts are actually short right now and where to ski today.` },
  },

  {
    slug: "alta-snowbird-powder-day-lines",
    title: "Alta and Snowbird on a Powder Day: The Little Cottonwood Playbook in 2026",
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
    title: "How to Beat the Crowds at Palisades Tahoe in 2026",
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
    title: "Copper Mountain Lift Lines: Where to Ski and What to Skip in 2026",
    description:
      "Copper's lines are all about which lift and when. Here's the honest lift by lift on Super Bee, American Flyer, and the pods that stay quiet.",
    h1: "Copper Mountain lift lines: where to ski, what to skip",
    readTime: "5 min",
    published: "2026-08-17",
    updated: "2026-08-17",
    keywords: "copper mountain lift lines, copper super bee line, copper mountain crowds, copper mountain wait times",
    dek: `Copper is a local favorite that gets slammed on weekends, but the crowd is wildly concentrated. A few base lifts eat the whole line while the rest of the mountain runs short. Knowing which is which is the entire game.`,
    sections: [
      { h2: "The Super Bee trap, and the fix", html: `
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
      { q: "How long are the lift lines at Copper Mountain?", a: "On weekend mornings the base lifts, Super Bee and American Flyer, can run 15 to 30 minutes while the rest of the mountain stays short. Lines thin by late morning, and weekdays are quiet." },
      { q: "Is Super Bee always busy at Copper?", a: "It's the biggest morning bottleneck, busy right at open on weekends, then it thins by late morning. Ride other pods first or use the singles line." },
      { q: "What time should I get to Copper Mountain?", a: "First chair, or after about 10:30 once the base crowd spreads out. The 9 to 10:30 window at the base lifts is the worst." },
      { q: "How do I avoid lines at Copper?", a: "Skip the base bottlenecks early, ride the quieter pods and the singles line, and check live waits to see which lift is actually moving." },
    ],
    cta: { h: "Skip the Super Bee line", p: `See live Copper waits and the best next chair, and check where to ski today before you drive up.` },
  },

  {
    slug: "best-time-to-ski-avoid-crowds",
    title: "The Best Time to Ski to Avoid Crowds in 2026",
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
    title: "Steamboat Crowds and the Morningside Line: How to Ski Around Them in 2026",
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
<p>Which lift is worth it changes by the hour. PeakWait shows live, crowdsourced waits at Steamboat and points you to the best next chair, so you don't hike out to Morningside to find a 30 minute line. Steamboat is one of 116 resorts it covers.</p>` },
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
    title: "Beating Lift Lines on the Ice Coast: A Northeast Crowds Guide in 2026",
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
<p>The Northeast is dense with resorts, so the "is it worth it" call is really "which one." PeakWait shows live waits across Northeast mountains and ranks where to ski today, so you can pick the short line before you commit to the drive. It covers Killington, Stowe, and the rest of the region among its 116 resorts.</p>` },
    ],
    faqs: [
      { q: "Which Northeast ski resort has the worst lift lines?", a: "The big Epic and Ikon anchors like Killington draw the heaviest weekend crowds. Lines feel especially bad because Northeast runs are short, so the wait to ski ratio is high." },
      { q: "What's the least crowded ski resort in the Northeast?", a: "Smaller independent New England hills stay far quieter than the flagships, often a short drive away. PeakWait's where to ski today shows which is least crowded on a given day." },
      { q: "Why do Northeast lift lines feel worse than out West?", a: "Shorter vertical means shorter runs, so even a 15 to 20 minute wait buys only a couple minutes of skiing. The ratio, plus cold and wind, makes modest lines feel brutal." },
      { q: "How do I avoid lift lines at Killington?", a: "Ski weekdays, get first chair or arrive after 1pm, ride the less obvious lifts, and check live waits to find the short line. On busy days, consider a smaller nearby hill." },
    ],
    cta: { h: "Beat the ice coast lines", p: `See live Northeast waits and where to ski today before you make the drive.` },
  },
  {
    slug: "breckenridge-lift-lines",
    title: "Breckenridge Lift Lines: Where They Form and How to Skip Them in 2026",
    description:
      "Breck has 34 lifts across five peaks, and almost all the waiting happens at four of them. Here is where the crowd piles up, when it clears, and how to ski around it.",
    h1: "Breckenridge lift lines: where they form, and how to skip them",
    readTime: "7 min",
    published: "2026-09-04",
    updated: "2026-09-04",
    keywords: "breckenridge lift lines, breckenridge crowds, breckenridge lift wait times, breckenridge peak 8 crowds, breckenridge busiest lifts",
    dek: `Breckenridge is routinely the busiest ski resort in the country, and it does not feel busy everywhere. It has 34 lifts spread across five peaks, and on a normal Saturday the wait is concentrated at four of them. If you know which four, you can ski most of the day without standing still.`,
    sections: [
      { h2: "The problem is geography, not volume", html: `
<p>Breck sells a lot of tickets, but that is not why you end up waiting. The reason is that five peaks funnel into a small number of base-area lifts, and everybody uses them in the same forty minutes.</p><p>Peak 8 is the main event. On a weekend morning the crowd stacks at the Colorado SuperChair and the Peak 8 SuperConnect, because those two are how you get from the base to everything worth skiing. Down in town, the BreckConnect Gondola gathers a second crowd of people who parked in Breckenridge and now need to get to Peak 8 at all. Beaver Run SuperChair takes the overflow from the Peak 9 side, and Rocky Mountain SuperChair takes whatever is left.</p><p>Those four are where your day gets eaten. Falcon, Mercury, Kensho, Independence and Zendo all exist, and on the same morning several of them are turning with nobody on them.</p>` },
      { h2: "The morning window, honestly", html: `
<p>The stack builds from about 9:00 and clears around 10:30. That is a real ninety-minute window, not a rumor, and it is the single biggest variable in your day. Skiers who are on a lift by 8:45 essentially skip it. Skiers who show up at 9:20 pay for it twice, once at the gondola and again at the top.</p><p>If you cannot get there early, the fix is not to go faster. It is to start somewhere else. Peak 9 from the Quicksilver SuperChair side, or the Peak 7 lifts, will both put you on snow while the Peak 8 base is still a maze.</p>` },
      { h2: "Where people go wrong at the top", html: `
<p>The second bottleneck of the day is the Imperial SuperChair. It is the highest chairlift in North America, it accesses the terrain everyone photographs, and it has a fraction of the capacity of the chairs feeding it. On a bluebird weekend it can hold a wait long after the base areas have cleared out, and it is not unusual for it to be the only significant wait on the mountain by noon.</p><p>The Horseshoe Bowl T-Bar next to it moves people in smaller numbers but keeps turning. If the Imperial queue is deep and you can ride a T-bar, you are usually better off.</p>` },
      { h2: "The lifts nobody talks about", html: `
<p>Breck's quiet side is real and it is not a secret, it is just inconvenient to reach from the parking lot. Falcon SuperChair on Peak 10 tends to run short on days when Peak 8 is stacked, because getting there costs you a traverse most people will not make. Zendo and Independence on the Peak 6 and Peak 7 side are similar: a little further out, noticeably calmer.</p><p>The trade is honest. You spend two or three minutes traversing instead of fifteen minutes standing. On a busy Saturday that math is not close.</p>` },
      { h2: "Powder days invert everything", html: `
<p>On a storm day the pattern changes completely. The base crowd gets worse and it gets earlier, and the terrain that opens late becomes the whole story. Imperial and the hike-to terrain above it can sit closed for hours after the lifts start turning, which means the crowd that came for it is stuck on the lower mountain, making everything else busier than a normal Saturday.</p><p>The useful move on those days is to stop guessing about what has opened and check. A lift that is officially open and a lift that is actually spinning are not the same thing, and the gap between them is where powder days are won.</p>` },
      { h2: "What actually helps", html: `
<ul>
  <li><strong>Be riding by 8:45,</strong> or accept that 9:00 to 10:30 belongs to the crowd.</li>
  <li><strong>Do not start at Peak 8 if you arrive late.</strong> Start where the crowd is not and traverse in.</li>
  <li><strong>Treat Imperial as a midday decision,</strong> not a first-run one.</li>
  <li><strong>Check before you commit to a traverse.</strong> Skiing twenty minutes to a lift with a wait at the end of it is the worst outcome on the mountain.</li>
</ul>
<p>None of that requires an app. What an app gets you is the last one: knowing, before you push off, whether the lift you are heading for is moving. PeakWait shows the current wait on Breckenridge lifts from the skiers who are standing in them, plus which mountain to pick in the first place on a day when I-70 gives you options.</p>` },
    ],
    faqs: [
      { q: "Which lift at Breckenridge has the longest wait?", a: "On a typical weekend morning the wait is concentrated at the Colorado SuperChair, the Peak 8 SuperConnect and the BreckConnect Gondola. Later in the day the Imperial SuperChair often holds the longest wait on the mountain because its capacity is small relative to the terrain it serves." },
      { q: "What time do Breckenridge lift lines get bad?", a: "The stack builds from about 9:00 and generally clears around 10:30. Being on a lift by 8:45 avoids most of it. Holiday weeks push the window later and make it worse." },
      { q: "Is Breckenridge more crowded than Vail or Keystone?", a: "Breckenridge is usually the busiest of the three by visits, but the experience depends on where you ski. Breck's crowd concentrates at a handful of base lifts, so the mountain can feel calm and still have a long wait at the bottom." },
      { q: "How do I avoid Breckenridge crowds without getting there early?", a: "Start away from Peak 8. The Peak 9 and Peak 7 lifts put you on snow while the Peak 8 base is stacked, and Falcon SuperChair on Peak 10 stays comparatively short because reaching it costs a traverse." },
      { q: "Can I see Breckenridge lift wait times live?", a: "Yes. PeakWait shows current waits lift by lift, reported by skiers on the mountain, along with how fresh each reading is. When there is not enough data it says so instead of guessing." },
    ],
    cta: { h: "See which Breck lift is actually moving", p: `Live waits, lift by lift, from skiers on the mountain right now.` },
  },

  {
    slug: "vail-lift-lines",
    title: "Vail Lift Lines: The Two That Matter and the Ones That Don't in 2026",
    description:
      "Vail is enormous, but nearly everyone enters through the same two lifts. Here is how the crowd moves across the front side, the Back Bowls and Blue Sky Basin, and how to stay ahead of it.",
    h1: "Vail lift lines: the two that matter, and the ones that don't",
    readTime: "7 min",
    published: "2026-09-04",
    updated: "2026-09-04",
    keywords: "vail lift lines, vail crowds, vail lift wait times, gondola one wait, vail back bowls crowds",
    dek: `Vail is one of the largest ski areas in North America and it still manages to feel crowded, because size is not the same as spread. Almost everybody enters the mountain through two lifts, and the crowd moves across the terrain in a pattern you can predict and get in front of.`,
    sections: [
      { h2: "Everyone starts in the same two places", html: `
<p>Vail has more than thirty lifts, but the front door is narrow. Gondola One out of Vail Village and the Eagle Bahn Gondola out of Lionshead carry most of the mountain's morning traffic, and both of them stack between roughly 8:45 and 10:00. Riva Bahn and Born Free take some of the pressure off, and on a weekend they get a queue of their own before the gondolas clear.</p><p>This is the whole reason Vail can feel busy on a mountain with this much terrain. The wait is not distributed across the ski area. It is concentrated at the point where the ski area begins.</p>` },
      { h2: "The mid-mountain shuffle", html: `
<p>Once you are up, the second pinch is Mountain Top Express. It sits where the front side, the Back Bowls and the rest of the mountain all connect, so it collects people who are not going anywhere in particular. Northwoods Express and Avanti take some of that flow, and Game Creek Express on the far side of the front is reliably calmer than any of them, because it requires committing to one bowl.</p><p>The pattern that matters: the front side is busiest from roughly 9:00 to 11:00 and again after about 2:30, when people come back over for the ride down. In between, the crowd is somewhere else.</p>` },
      { h2: "The Back Bowls run on their own clock", html: `
<p>The Back Bowls are the reason to be at Vail, and they behave differently from the front. They open later, they open unevenly, and on a storm day some of them do not open at all until patrol is finished. That creates a predictable surge: everyone who came for the bowls waits on the front side, then moves in a wave the moment they hear something has opened.</p><p>If you are in the bowls, High Noon Express and Sun Down Express carry the traffic and generally keep moving, because the terrain absorbs people quickly. The wait in the bowls tends to be short and the ride long, which is the opposite of the front side.</p><p>Blue Sky Basin, out past the bowls via Skyline Express and Pete's Express, is the furthest thing from the parking lot and it stays the calmest place on the mountain for exactly that reason. The price is that getting back is a project. Plan on it taking longer than you think, and do not leave it until the last chair.</p>` },
      { h2: "What a powder day does to all of this", html: `
<p>On a storm day the gondola crowd gets earlier and deeper, the bowls open late, and the front side absorbs a crowd that did not want to be there. It is the one day where being twenty minutes early is worth more than any other decision you make.</p><p>It is also the day where official information is least reliable. Lift status boards and posted opening times are frequently wrong on a morning when patrol is still working, and skiers standing at the bottom of a rope know before any website does. That gap is worth more than a snow report.</p>` },
      { h2: "What actually helps", html: `
<ul>
  <li><strong>Pick your gondola.</strong> Gondola One and Eagle Bahn drain different parking situations. The shorter one is often not the one closest to your car.</li>
  <li><strong>Get past Mountain Top early</strong> and let the mid-mountain shuffle happen without you.</li>
  <li><strong>Go to the bowls when the crowd is still on the front side,</strong> not when the wave moves.</li>
  <li><strong>Treat Blue Sky Basin as a commitment,</strong> not a detour, and leave time to get home.</li>
  <li><strong>Do not trust a posted opening time on a storm morning.</strong> Trust what is actually spinning.</li>
</ul>
<p>The decisions above are all timing, and timing is easier when you can see what the mountain is doing right now. PeakWait shows current waits on Vail lifts from the skiers standing in them, with how old each reading is, and it says nothing at all when there is not enough information to be sure. That is a deliberate choice: a confident wrong answer costs you more than an honest blank.</p>` },
    ],
    faqs: [
      { q: "Which Vail lift has the worst wait?", a: "Gondola One and the Eagle Bahn Gondola carry the morning crowd and stack between roughly 8:45 and 10:00. Mountain Top Express is the second pinch point because the front side, the Back Bowls and the rest of the mountain all connect there." },
      { q: "What time are Vail lift lines shortest?", a: "Generally between about 11:00 and 2:00, when the morning crowd has dispersed into the bowls and before the afternoon return to the front side. The front side gets busy again after about 2:30." },
      { q: "Are the Back Bowls less crowded than the front side?", a: "Usually, yes. The terrain absorbs skiers quickly, so waits are shorter even when plenty of people are back there. The catch is that the bowls open later and unevenly, and everyone moves in a wave when they do." },
      { q: "Is Blue Sky Basin worth the trip?", a: "It is the quietest part of the mountain because it is the furthest from the base. Treat it as a commitment rather than a detour and leave real time to get back, because the return is longer than most people expect." },
      { q: "Can I check Vail lift wait times before I drive up?", a: "Yes. PeakWait shows live waits at Vail and across Colorado, so you can compare mountains before you commit to I-70 and then pick lifts once you are there." },
    ],
    cta: { h: "See which Vail lift is actually moving", p: `Live waits, lift by lift, from skiers on the mountain right now.` },
  },

  {
    slug: "keystone-lift-lines",
    title: "Keystone Lift Lines: Three Mountains, One Way In and One Way Home in 2026",
    description:
      "Keystone is three mountains deep, and the crowd stacks at the front door in the morning and at the back door in the afternoon. Where the waits form at River Run, Montezuma, Santiago and Outback, and how to ski the day backwards.",
    h1: "Keystone lift lines: three mountains, one way in and one way home",
    readTime: "7 min",
    published: "2026-09-06",
    updated: "2026-09-06",
    keywords: "keystone lift lines, keystone crowds, keystone lift wait times, river run gondola line, keystone busiest lifts, keystone outback crowds",
    dek: `Keystone is built like a hallway. Three mountains sit in a row, Dercum in front, North Peak behind it, the Outback behind that, and the only way to the good stuff is over the top of the one in front. That shape decides your whole day. The crowd stacks at the front door in the morning and at the back door in the afternoon, and the skiers who do well at Keystone are the ones who go the other way.`,
    sections: [
      { h2: "The shape of the problem", html: `
<p>Dercum Mountain is the front. Two base areas feed it: River Run, with the River Run Gondola and Summit Express, and Mountain House, with Peru Express and Montezuma Express. Every one of those lifts is trying to put you on the same summit.</p><p>From the summit of Dercum the mountain drops away behind you to a saddle, and from that saddle Santiago Express climbs North Peak while Ruby Express climbs back to where you came from. On North Peak the Outpost Gondola also links the two summits. Behind North Peak is the Outback, served by Outback Express, with Wayback as the only chair that hauls you back out. And off the side of North Peak is Bergman Bowl, the newest terrain, with its own express chair and its own wind holds.</p><p>Count the exits. To ski the Outback and get home, you ride Wayback, then something up North Peak or back over the saddle, then something over Dercum. Three lifts of climbing to leave. Every skier on the back of the mountain has the same sum to do at about the same time, and that is where the second wait of the day comes from.</p>` },
      { h2: "Morning: the front door", html: `
<p>On a weekend the River Run Gondola is the long wait from about 8:45 until 10:15. It is the lift next to the village, the lodging and the biggest parking, and it is a gondola, so people who have not warmed up yet like it. Summit Express loads a few steps away and often runs shorter, because the gondola pulls the crowd toward itself.</p><p>The move most people miss is the other base. Mountain House is quieter, its parking is closer to the snow, and Peru Express is routinely the shortest way onto the mountain on a Saturday. It does not go all the way to the summit, which is exactly why people skip it, and exactly why it is short. Ride Peru, ski down to Montezuma or across to the summit lifts, and you have made two runs while the gondola crowd has made none.</p><p>Montezuma Express does go to the summit and it does get its own stack, but it usually builds later and clears faster than the gondola.</p>` },
      { h2: "Midday: the back of the mountain is where the day is", html: `
<p>Once the front clears, the crowd drains over the top toward North Peak and the Outback, and the front side goes quiet. This is the window, roughly 10:30 to 2:00, when Keystone works. Santiago Express moves a lot of people and on a normal day keeps up. Outback Express is the best chair on the mountain when the trees are good, and midweek it can run with empty seats.</p><p>Ruby Express is the sleeper. It runs from the saddle back to the Dercum summit, which sounds useless until you notice it serves a stack of long groomers that nobody laps because everyone is heading further back. On a busy Saturday it is a good place to spend an hour.</p><p>Bergman Bowl is the wild card. It is high, it is open, and it closes for wind more often than the rest of the mountain. When it is open on a weekend, the express chair holds a wait, because the bowl is the terrain everybody drove up for. When it is closed, all of those people are in the Outback instead, and Outback Express feels it.</p>` },
      { h2: "Afternoon: the back door", html: `
<p>This is the wait Keystone is known for among people who ski it a lot, and it is invisible in the morning. From about 2:00 the far lifts start closing and everyone in the Outback has to climb out. Wayback is the only way. It backs up. Then Santiago and the Outpost Gondola back up, because everyone who rode Wayback now needs to get over North Peak. Then the top of Dercum gets busy with people picking a way down.</p><p>You cannot skip this by skiing faster. You skip it by leaving the back earlier than you want to, or by not being there at all. Skiers who move to Ruby or the front side by 1:30 miss the whole thing and get a quiet last hour on groomers while the Outback crowd stands still.</p><p>One consolation: the front of Dercum has night skiing, the most of any resort in Colorado, so the front side lifts keep turning after the back has shut. If you are on the front at 3:30, your day is not over.</p>` },
      { h2: "Early season is its own animal", html: `
<p>Keystone opens earlier than almost anyone in Colorado, and it does it with a ribbon. One run, one or two lifts, and every skier who could not wait for winter on the same chair. The wait on those days has nothing to do with attendance and everything to do with the fact that there is one lift. It does not matter which base you pick, because only one is open. The honest advice is to go on a weekday or accept the maze as the price of November turns.</p><p>The Outback and Bergman Bowl open well into the season, and a lot of the mountain's capacity is behind them. Until they open, the whole crowd is on Dercum and North Peak, and the back door wait arrives earlier in the afternoon.</p>` },
      { h2: "What actually helps", html: `
<ul>
  <li><strong>Start at Mountain House on a weekend.</strong> Peru Express is short because it is unglamorous.</li>
  <li><strong>Go to the back early and leave it early.</strong> The Outback is best from 10:30 to 1:30. After that it is a trap with one exit.</li>
  <li><strong>Lap Ruby when the mountain is stacked.</strong> Long groomers, short wait, and nobody thinks of it.</li>
  <li><strong>Check Bergman before you commit.</strong> A wind hold moves a few hundred people into the Outback, and the sign at the bottom of Wayback will not tell you that.</li>
  <li><strong>Finish on the front.</strong> The last hour on Dercum is quiet while the back is fighting to get out, and the lights come on.</li>
</ul>
<p>Most of that you can do with a trail map and a watch. What the map cannot tell you is whether Wayback is already stacked at 1:45 today, or whether Bergman opened at eleven. PeakWait shows the current wait on Keystone lifts from the skiers standing in them, and on a day when I-70 gives you a choice, which of the Summit County mountains is worth the drive in the first place.</p>` },
    ],
    faqs: [
      { q: "Which lift at Keystone has the longest wait?", a: "On a weekend morning it is the River Run Gondola, with Montezuma Express at the Mountain House base close behind. By early afternoon the longest wait usually moves to the back of the mountain, at Santiago Express and Wayback, because everybody has to climb back over Dercum to get home." },
      { q: "What time do Keystone lift lines get bad?", a: "The base stack runs from roughly 8:45 to 10:15 on a weekend. The afternoon stack at the back of the mountain runs from about 2:00 until the far lifts close. Between those two windows the mountain is usually in decent shape." },
      { q: "Is the Mountain House base less crowded than River Run?", a: "Usually, yes. River Run has the gondola, the village and the bulk of the lodging, so it draws the bigger morning crowd. Mountain House has Peru Express and Montezuma Express, and on most weekends Peru is the shortest way onto the mountain." },
      { q: "How crowded is Keystone early season?", a: "Keystone opens earlier than most Colorado resorts, often with a single run and one or two lifts. On those days everyone on the mountain is on the same lift, so the wait can be long even with a small crowd. Bergman Bowl and the Outback do not open until well into the season." },
      { q: "Can I see Keystone lift wait times live?", a: "Yes. PeakWait shows the current wait at each Keystone lift, reported by skiers standing at it, with how fresh each reading is. When there is not enough data it says so rather than guessing." },
    ],
    cta: { h: "See which Keystone lift is actually moving", p: `Live waits, lift by lift, from skiers on the mountain right now.` },
  },
  {
    slug: "colorado-opening-day",
    title: "Which Colorado Ski Resorts Open First in 2026, and How to Know the Lifts Are Really Turning",
    description:
      "Arapahoe Basin and Keystone race to open in October, Loveland and Wolf Creek follow, and the rest arrive through November. Why the posted date is soft, what opening day actually looks like, and how to know a lift is spinning before you drive.",
    h1: "Which Colorado ski resorts open first, and how to know the lifts are really turning",
    readTime: "6 min",
    published: "2026-10-07",
    updated: "2026-10-07",
    keywords: "colorado opening day 2026, when does arapahoe basin open, when does keystone open, first ski resort to open colorado, colorado ski resort opening dates, opening day lift lines",
    dek: `Every October the same question: who opens first, and when. The honest answer is that nobody knows the day until a few days before, including the resorts. Here is the usual order, what the first day on snow really looks like, and the one thing the posted date cannot tell you.`,
    sections: [
      { h2: "Why the date is soft", html: `
<p>Colorado's early openers do not open on a calendar. They open when a stretch of cold nights lets the snowmaking guns build a base deep enough for a run, and then they announce it two or three days out. Arapahoe Basin's official position every autumn is "as soon as possible," and that is not coyness. It is the truth. A warm week in mid October pushes everyone back; a cold snap pulls the first chair forward.</p>
<p>So treat any date you read, including the ones below, as a guess with a range. The projected dates on the big ski sites are averages of past seasons. The resort's own page is better, and still changes. The only thing that is not a guess is a lift that is turning.</p>` },
      { h2: "The usual order", html: `
<p><strong>Arapahoe Basin and Keystone, mid October.</strong> These two have traded the first chair in Colorado for years. A-Basin has taken it most seasons, as early as October 11 in a cold year and closer to the 20s in a warm one. Keystone has beaten it more than once with a heavy snowmaking push. Either way, the opening is a single run from the top, served by one or two lifts.</p>
<p><strong>Loveland and Wolf Creek, late October into early November.</strong> Loveland is usually a week or two behind the first pair, with a couple of runs off Chair 1. Wolf Creek is the wild card: it makes almost no snow and opens on natural storms, which in a big October means it opens first and in a dry one means it waits.</p>
<p><strong>Breckenridge, Copper, Vail and Winter Park, through November.</strong> Breck and Copper tend to open around the second week of November, Copper partly because the speed center for the national team needs a track early. Vail and Winter Park follow in the middle of the month. Eldora is in the same window.</p>
<p><strong>Steamboat, Aspen, Telluride and Crested Butte, around Thanksgiving.</strong> The destination resorts open later and open bigger, with more terrain on day one and far less of a crush at the base.</p>` },
      { h2: "What opening day actually looks like", html: `
<p>Opening day at an early opener is a ribbon. One groomed run, white against brown, with every skier who could not wait for winter on the same chair. The wait on that chair has nothing to do with how busy the resort is. It is a function of one lift and a parking lot full of people who drove up at six.</p>
<p>At A-Basin that means Black Mountain Express and a wait that can run twenty to forty minutes by ten in the morning on a weekend, and much less on a weekday. At Keystone it is the River Run gondola or Montezuma, with the same shape. The crowd thins after one o'clock, when the first wave has had its laps and gone to lunch. If you want the day without the wait, arrive before the lifts turn or arrive after lunch. The middle of the morning is the worst hour of the whole season.</p>` },
      { h2: "How to know a lift is really turning", html: `
<p>The problem with opening week is that the information is a day old. The resort posts an opening date, then a lift list, then an opening time, and all three can change overnight on wind, on a lift inspection, on a last cold night that did or did not come. People drive from Denver on a posted "opens at 9" and find the lift on hold at 9:40.</p>
<p>PeakWait answers a narrower question: are the lifts turning right now. A mountain shows as open the moment its lifts are running, from the resort's own lift status and from skiers riding them, and the app says which of those it is using. Before that it shows the announced date if the resort has given one, and otherwise an estimate, labeled as an estimate. Once you are there, your phone times your own wait, and the lift's row says what that hour usually looks like until enough skiers have measured it. On a day with one lift, that is the only number that matters.</p>` },
      { h2: "What actually helps", html: `
<ul>
  <li><strong>Watch the overnight lows, not the calendar.</strong> Three or four nights in the teens at the summit is what moves the date.</li>
  <li><strong>Check the lift, not the date.</strong> An opening date is a plan. A turning lift is a fact.</li>
  <li><strong>Go on a weekday if you can.</strong> The first weekend doubles the wait for the same run.</li>
  <li><strong>Arrive before the first chair or after lunch.</strong> The 9:30 to 11:30 window is the crush.</li>
  <li><strong>Bring rock skis.</strong> A ribbon is a ribbon.</li>
  <li><strong>Star your mountains in the app.</strong> You get the first snow and the first chair without refreshing a resort website.</li>
</ul>` },
    ],
    faqs: [
      { q: "When does Arapahoe Basin open for the 2026-27 season?", a: "A-Basin has not set a date. Its position every year is as soon as possible, which in practice has meant mid October, anywhere from the 11th in a cold year to the last week of the month in a warm one. The resort announces a few days ahead once snowmaking has built a run." },
      { q: "Which Colorado ski resort opens first?", a: "Usually Arapahoe Basin or Keystone, in mid October. The two have traded the first chair for years. Wolf Creek can beat both when a big natural storm lands in October, because it opens on real snow rather than snowmaking." },
      { q: "How long are the lift waits on opening day?", a: "On a weekend at an early opener, twenty to forty minutes by mid morning on the one lift that is running. It is a single run and a full parking lot, not a busy resort. Weekdays are far shorter, and the wait drops after one o'clock." },
      { q: "Is opening day worth it?", a: "For the first turns of the year, yes. For skiing, not really: one groomed run, early-season snow, and the longest wait you will stand in all winter. If you want the day without the crush, go on a weekday or arrive after lunch." },
      { q: "Can I see if the lifts are actually running right now?", a: "Yes. PeakWait shows a mountain as open the moment its lifts are turning, from the resort's own lift status and from skiers riding them, and says which it is using. Before that it shows the resort's announced date or a labeled estimate, never a guess dressed up as a fact." },
    ],
    cta: { h: "Know the moment the first chair turns", p: `Star your mountains. PeakWait tells you when the lifts are running and what the wait is, lift by lift.` },
  },
];

// ---- template --------------------------------------------------------------
// Pages share the site shell (tools/lib/shell.mjs + /assets/site.css): one nav, one footer, one style.
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const fmtDate = (iso) => { const [y, m, d] = iso.split("-").map(Number); return `${MONTHS[m - 1]} ${d}, ${y}`; };
const fmtShort = (iso) => { const [y, m, d] = iso.split("-").map(Number); return `${MONTHS[m - 1].slice(0, 3)} ${d}`; };
const fmtMonth = (iso) => { const [y, m] = iso.split("-").map(Number); return `${MONTHS[m - 1].slice(0, 3)} ${y}`; };
const stripTags = (s) => String(s).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

// ---- guides: where each guide sits, and its campaign image -----------------
// Index sections, in order. Mountain guides go by region; the rest are playbooks, except the Colorado
// ones, which a Colorado skier looks for under Colorado.
const SECTIONS = [["co", "Colorado"], ["ut", "Utah"], ["ca", "California"], ["more", "More mountains"], ["play", "Playbooks"]];
function sectionOf(a) {
  const m = INDEX_META[a.slug];
  if (m.region === "CO") return "co";
  if (m.region === "UT") return "ut";
  if (m.region === "CA") return "ca";
  if (m.region) return "more";
  return /colorado|i-70|winter park|copper|vail|breckenridge|keystone|loveland|arapahoe|steamboat/i.test(a.title) ? "co" : "play";
}
// One campaign photo per kind of guide, so the index and articles carry imagery without repeating one shot.
function imageOf(a) {
  const m = INDEX_META[a.slug];
  const byRegion = { CO: "rw-guide.jpg", UT: "rw-hero3.jpg", CA: "rw-hero1.jpg", BC: "rw-hero4.jpg", NE: "hero.jpg" };
  if (m.region) return `/assets/img/${byRegion[m.region] || "rw-hero4.jpg"}`;
  return m.group === "why" ? "/assets/img/film-poster.jpg" : "/assets/img/pov.jpg";
}
const subOf = (a) => INDEX_META[a.slug].hook || a.description;

function articleHtml(a, others) {
  const url = `${SITE}/guides/${a.slug}/`;
  const title = waitify(a.title);
  const img = imageOf(a);
  const faqLd = {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: a.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  const artLd = {
    "@context": "https://schema.org", "@type": "Article", headline: title,
    description: a.description, author: { "@type": "Person", name: AUTHOR },
    publisher: { "@type": "Organization", name: "PeakWait", logo: { "@type": "ImageObject", url: `${SITE}/icon-512.png` } },
    datePublished: a.published, dateModified: a.updated, mainEntityOfPage: url, image: `${SITE}${img}`,
  };
  const crumbLd = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE + "/" },
      { "@type": "ListItem", position: 2, name: "Guides", item: SITE + "/guides/" },
      { "@type": "ListItem", position: 3, name: title, item: url },
    ],
  };
  const m = INDEX_META[a.slug];
  const sec = SECTIONS.find(([k]) => k === sectionOf(a))[1];
  const midIdx = Math.ceil(a.sections.length / 2);
  const appcard = `
    <div class="appcard">
      <div class="t"><b>${esc(a.cta.h)}</b><p>${esc(a.cta.p)}</p><a class="btn" href="${DOWNLOAD_URL}">Download now for your season</a></div>
      <div class="shot">${device("/assets/img/app-02-resort-lifts.jpg", "A lift list in PeakWait with a wait on every lift", 160)}</div>
    </div>`;
  const body = a.sections.map((s, i) => `<h2 id="s${i + 1}">${esc(s.h2)}</h2>${s.html.trim()}` + (i === midIdx - 1 ? appcard : "")).join("\n");
  const toc = a.sections.map((s, i) => `<li><a href="#s${i + 1}"${i === 0 ? ' class="on"' : ""}>${esc(s.h2)}</a></li>`).join("") + `<li><a href="#faq">FAQ</a></li>`;
  const faq = `<h2 id="faq">FAQ</h2><div class="faqlist">` +
    a.faqs.map((f, i) => `<details${i === 0 ? " open" : ""}><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join("") + `</div>`;
  const facts = m.region
    ? `<dl class="facts"><div><dt>Where</dt><dd>${esc(m.where)}</dd></div><div><dt>Lifts</dt><dd>${esc(String(m.lifts).replace(/ lifts?$/, ""))}</dd></div><div><dt>Read</dt><dd>${esc(a.readTime)}</dd></div></dl>`
    : "";
  const more = others.length ? `<section class="wrap more" aria-label="Keep reading"><span class="eyebrow">Keep reading</span><div class="cards">` +
    others.map((o) => `<a class="card" href="/guides/${o.slug}/"><span class="meta">${esc(SECTIONS.find(([k]) => k === sectionOf(o))[1])} · ${esc(o.readTime)}</span><h3>${esc(waitify(o.h1 || o.title))}</h3></a>`).join("") +
    `</div></section>` : "";
  const css = `
.ahead{padding-block:clamp(40px,6vw,72px) 32px;background:linear-gradient(180deg,var(--skyTop),var(--bg))}
.ahead .inner{max-width:880px;display:grid;gap:18px}
.ahead h1{font-size:clamp(2.1rem,4.8vw,3.4rem);font-weight:850}
.ahead .dek{font-size:clamp(1.06rem,1.6vw,1.22rem);color:var(--ink2);max-width:62ch}
.byline{display:flex;gap:18px;flex-wrap:wrap;color:var(--ink3);font-size:.9rem}
.byline b{color:var(--ink2);font-weight:600}
.facts{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;margin:4px 0 0;max-width:620px;background:var(--hair);border:1px solid var(--hair);border-radius:var(--r-md);overflow:hidden}
.facts div{background:var(--surface);padding:14px 16px;display:grid;gap:6px;min-width:0}
.facts dt{font-size:.66rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--ink3)}
.facts dd{margin:0;font-family:var(--num);font-weight:700;font-size:1.02rem}
.leadimg{margin:0 auto}
.leadimg img{width:100%;height:auto;aspect-ratio:1584/672;object-fit:cover;border-radius:var(--r-lg);border:1px solid var(--hair)}
@media (max-width:640px){.leadimg img{aspect-ratio:16/10}.facts{grid-template-columns:1fr 1fr}}
.body{display:grid;grid-template-columns:220px minmax(0,680px) 1fr;gap:clamp(24px,4vw,56px);padding-block:48px 24px}
.toc{position:sticky;top:96px;align-self:start;font-size:.9rem}
.toc ol{list-style:none;margin:14px 0 0;padding:0;display:grid;gap:2px;border-left:1px solid var(--hair)}
.toc a{display:block;padding:6px 0 6px 14px;margin-left:-1px;border-left:2px solid transparent;color:var(--ink3);line-height:1.35}
.toc a:hover{color:var(--ink)}
.toc a.on{color:var(--ink);border-left-color:var(--brand)}
@media (max-width:1000px){.body{grid-template-columns:minmax(0,1fr)}.toc{display:none}.prose{max-width:680px}}
.appcard{margin:44px 0;border:1px solid var(--hair);border-radius:var(--r-lg);background:linear-gradient(160deg,var(--tint),var(--surface) 65%);display:grid;grid-template-columns:minmax(0,1fr) auto;gap:20px;align-items:center;overflow:hidden;padding:26px 26px 0}
.appcard .t{display:grid;gap:10px;padding-bottom:26px}
.appcard b{font-size:1.25rem;color:var(--ink);letter-spacing:-.02em;line-height:1.2}
.appcard p{margin:0;color:var(--ink2);font-size:.98rem;line-height:1.5}
.appcard .shot{height:230px;overflow:hidden;align-self:end}
.prose .appcard .btn{justify-self:start;text-decoration:none;color:var(--onBrand)}
@media (max-width:560px){.appcard{grid-template-columns:1fr}.appcard .shot{justify-self:center}}
.faqlist details{border-top:1px solid var(--hair);padding-block:16px}
.faqlist details:last-child{border-bottom:1px solid var(--hair)}
.faqlist summary{cursor:pointer;list-style:none;display:flex;justify-content:space-between;gap:16px;font-weight:700;color:var(--ink);line-height:1.4}
.faqlist summary::-webkit-details-marker{display:none}
.faqlist summary::after{content:'+';color:var(--ink3);font-weight:600}
.faqlist details[open] summary::after{content:'\\2212'}
.faqlist p{margin:10px 0 0;color:var(--ink2)}
.more{padding-block:56px 0;border-top:1px solid var(--hair);margin-top:40px}
.more .cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;margin-top:22px}
@media (max-width:760px){.more .cards{grid-template-columns:1fr}}`;
  return `<!doctype html>
<html lang="en">
<head>
${head({ title, description: a.description, url, image: `${SITE}/assets/og/${sectionOf(a)}.jpg`, type: "article", extra: `<meta name="keywords" content="${esc(a.keywords)}">
<meta name="author" content="${AUTHOR}">
<script type="application/ld+json">${JSON.stringify(artLd)}</script>
<script type="application/ld+json">${JSON.stringify(faqLd)}</script>
<script type="application/ld+json">${JSON.stringify(crumbLd)}</script>
<style>${css}</style>` })}
</head>
<body>
${nav("/guides/")}
<main>
<header class="ahead"><div class="wrap"><div class="inner">
  <nav class="crumbs" aria-label="Breadcrumb"><a href="/guides/">Guides</a><span>/</span><a href="/guides/#${sectionOf(a)}">${esc(sec)}</a></nav>
  <h1>${esc(waitify(a.h1))}</h1>
  <p class="dek">${stripTags(a.dek).length > 320 ? esc(stripTags(a.dek).slice(0, 317).replace(/\s+\S*$/, "")) + "…" : esc(stripTags(a.dek))}</p>
  <div class="byline"><span>By <b>${AUTHOR}</b></span><span>${esc(a.readTime)} read</span><span>${a.updated !== a.published ? "Updated " : ""}${fmtDate(a.updated)}</span></div>
  ${facts}
</div></div></header>
<figure class="wrap leadimg"><img src="${img}" alt="" width="1584" height="672"></figure>
<div class="wrap body">
  <aside class="toc" aria-label="In this guide"><span class="eyebrow">In this guide</span><ol>${toc}</ol></aside>
  <article class="prose">
    ${body}
    ${faq}
  </article>
  <div aria-hidden="true"></div>
</div>
${more}
<div class="wrap">${endCta("Download now for your season.", "See every wait before you ride. PeakWait is free on the App Store.")}</div>
</main>
${footer()}
<script>
const tl=[...document.querySelectorAll('.toc a')];
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)tl.forEach(l=>l.classList.toggle('on',l.hash==='#'+e.target.id))}),{rootMargin:'-20% 0px -70% 0px'});
document.querySelectorAll('.prose h2[id]').forEach(h=>io.observe(h));
</script>
</body>
</html>`;
}

// ---- guides index: latest up top, then every guide by region -----------------------------
const INDEX_META = {
  // mountain guides: region filter key, where line, lift count (live app data, 2026-09-29), hook
  "keystone-lift-lines":        { region: "CO", where: "Colorado · Epic",        lifts: "20 lifts", hook: "Three mountains in a row, one way in and one way home. The wait moves from the gondola to Wayback at 2 pm." },
  "breckenridge-lift-lines":    { region: "CO", where: "Colorado · Epic",        lifts: "34 lifts", hook: "34 lifts across five peaks, and almost all the waiting happens at four of them." },
  "vail-lift-lines":            { region: "CO", where: "Colorado · Epic",        lifts: "32 lifts", hook: "Enormous, but nearly everyone enters through the same two lifts." },
  "copper-mountain-lift-lines": { region: "CO", where: "Colorado · Ikon",        lifts: "23 lifts", hook: "Super Bee and American Flyer take the hit. The pods that stay quiet, lift by lift." },
  "steamboat-crowds-morningside": { region: "CO", where: "Colorado · Ikon",      lifts: "21 lifts", hook: "The gondola and the Morningside chair can eat your morning." },
  "alta-snowbird-powder-day-lines": { region: "UT", where: "Utah · Ikon",         lifts: "25 lifts", hook: "Little Cottonwood on a powder day is glorious and brutal in equal measure." },
  "palisades-tahoe-crowds":     { region: "CA", where: "California · Ikon",      lifts: "45 lifts", hook: "Two great laps and then hour-long waits. When to bail to a quieter Tahoe hill." },
  "whistler-lift-wait-times":   { region: "BC", where: "British Columbia · Epic", lifts: "36 lifts", hook: "Where the waits build at Whistler Blackcomb, lift by lift, and how to ski around them." },
  "northeast-ski-crowds":       { region: "NE", where: "Vermont and the Northeast", lifts: "Killington, Stowe", hook: "Short vertical makes a 20 minute wait feel worse than an hour out West." },
  // the rest, by the decision they help with
  "best-time-to-ski-avoid-crowds": { group: "day" },
  "colorado-opening-day":       { group: "day" },
  "beat-i70-ski-traffic-colorado-crowds": { group: "day" },
  "least-crowded-colorado-ski-resorts": { group: "day" },
  "beat-powder-day-crowds": { group: "day" },
  "epic-vs-ikon-crowds": { group: "day" },
  "ski-resort-lift-lines": { group: "why" },
  "how-long-reasonable-lift-wait": { group: "why" },
};
const REGIONS = [["CO", "Colorado"], ["UT", "Utah"], ["CA", "California"], ["BC", "Canada"], ["NE", "Northeast"]];
const MOUNTAIN_NAME = {
  "keystone-lift-lines": "Keystone", "breckenridge-lift-lines": "Breckenridge", "vail-lift-lines": "Vail",
  "copper-mountain-lift-lines": "Copper Mountain", "steamboat-crowds-morningside": "Steamboat",
  "alta-snowbird-powder-day-lines": "Alta and Snowbird", "palisades-tahoe-crowds": "Palisades Tahoe",
  "whistler-lift-wait-times": "Whistler Blackcomb", "northeast-ski-crowds": "The Ice Coast",
};

function indexHtml(arts) {
  const missing = arts.filter((a) => !INDEX_META[a.slug]).map((a) => a.slug);
  if (missing.length) throw new Error(`INDEX_META has no entry for: ${missing.join(", ")} — add it (mountain or group) so the guide appears on /guides/`);
  const byDate = [...arts].sort((a, b) => (b.published > a.published ? 1 : b.published < a.published ? -1 : 0));
  const [lead, ...side] = byDate.slice(0, 4);
  const secName = (a) => SECTIONS.find(([k]) => k === sectionOf(a))[1];
  const groups = SECTIONS.map(([k, label]) => [k, label, arts.filter((a) => sectionOf(a) === k).sort((a, b) => (waitify(a.h1) > waitify(b.h1) ? 1 : -1))]).filter(([, , list]) => list.length);
  const row = (a) => `<li><a href="/guides/${a.slug}/"><b>${esc(waitify(a.h1))}<small>${esc(subOf(a))}</small></b><span>${esc(a.readTime)}</span></a></li>`;
  const filters = [`<button type="button" data-f="all" aria-pressed="true">All<span>${arts.length}</span></button>`]
    .concat(groups.map(([k, label, list]) => `<button type="button" data-f="${k}" aria-pressed="false">${label}<span>${list.length}</span></button>`)).join("\n  ");
  const css = `
.filters{position:sticky;top:calc(68px + env(safe-area-inset-top,0px));z-index:30;background:color-mix(in srgb,var(--bg) 88%,transparent);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-bottom:1px solid var(--hair)}
.filters .wrap{display:flex;gap:8px;padding-block:14px;overflow-x:auto;scrollbar-width:none}
.filters .wrap::-webkit-scrollbar{display:none}
.filters button{flex:0 0 auto;font:600 .9rem/1 var(--sans);color:var(--ink2);background:transparent;border:1px solid var(--hair);border-radius:999px;padding:9px 15px;cursor:pointer}
.filters button:hover{color:var(--ink);border-color:var(--ink3)}
.filters button[aria-pressed="true"]{background:var(--ink);color:var(--bg);border-color:var(--ink)}
.filters button span{font-family:var(--num);opacity:.6;margin-left:6px}
.latest{display:grid;grid-template-columns:1.4fr 1fr;gap:18px;margin-top:40px}
.lead{position:relative;border-radius:var(--r-lg);overflow:hidden;border:1px solid var(--hair);min-height:400px;display:grid;align-items:end;background:#000;transition:border-color .18s ease}
.lead img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:65% 50%}
.lead::before{content:"";position:absolute;inset:0;z-index:1;background:linear-gradient(0deg,rgba(7,15,22,.96) 30%,rgba(7,15,22,.72) 62%,rgba(7,15,22,.45))}
.lead .meta{color:var(--ink)}
.lead .in{position:relative;z-index:2;padding:clamp(22px,3vw,36px);display:grid;gap:12px}
.lead h2{font-size:clamp(1.7rem,3vw,2.4rem)}
.lead p{color:var(--ink2);max-width:50ch}
.lead:hover{border-color:var(--brand)}
.side{display:grid;gap:18px}
@media (max-width:860px){.latest{grid-template-columns:1fr}.lead{min-height:340px}}
.group{margin-top:72px;scroll-margin-top:150px}
.group > header{display:flex;justify-content:space-between;align-items:baseline;gap:16px;padding-bottom:16px;border-bottom:1px solid var(--hair)}
.group h2{font-size:clamp(1.5rem,2.6vw,2rem)}
.group header span{color:var(--ink3);font-size:.9rem}
.rows{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:1fr 1fr;column-gap:40px}
.rows a{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:16px;align-items:baseline;padding-block:18px;border-bottom:1px solid var(--hair)}
.rows a b{font-size:1.04rem;font-weight:700;letter-spacing:-.01em;line-height:1.3}
.rows a small{display:block;color:var(--ink3);font-size:.88rem;margin-top:4px;font-weight:400;line-height:1.45}
.rows a span{font-family:var(--num);color:var(--ink3);font-size:.85rem;white-space:nowrap}
.rows a:hover b{color:var(--brand)}
@media (max-width:760px){.rows{grid-template-columns:1fr}}`;
  return `<!doctype html>
<html lang="en">
<head>
${head({ title: "Ski Guides by Mountain: Beat the Wait | PeakWait", description: "Where the waits build, mountain by mountain: which lift stacks up, when it clears, and where the quiet side is. Plus how to pick the day and the mountain. By Herb Sendit.", url: `${SITE}/guides/`, image: `${SITE}/assets/og/guides.jpg`, extra: `<style>${css}</style>` })}
</head>
<body>
${nav("/guides/")}
<main>
<section class="phero"><div class="wrap">
  <span class="eyebrow">PeakWait Guides</span>
  <h1>Ski smarter, mountain by mountain.</h1>
  <p class="say">Where the waits build, when to go and how to get there. Written by skiers, updated through the season.</p>
</div></section>
<div class="filters" role="toolbar" aria-label="Filter guides"><div class="wrap">
  ${filters}
</div></div>
<div class="wrap">
  <section class="latest" data-g="all" aria-label="Latest guides">
    <a class="lead" href="/guides/${lead.slug}/"><img src="${imageOf(lead)}" alt=""><div class="in"><span class="meta"><i>New</i>${esc(secName(lead))} · ${esc(lead.readTime)} · ${fmtShort(lead.published)}</span><h2>${esc(waitify(lead.h1))}</h2><p>${esc(subOf(lead))}</p></div></a>
    <div class="side">${side.map((a) => `
      <a class="card" href="/guides/${a.slug}/"><span class="meta">${esc(secName(a))} · ${esc(a.readTime)} · ${fmtShort(a.published)}</span><h3>${esc(waitify(a.h1))}</h3></a>`).join("")}
    </div>
  </section>
${groups.map(([k, label, list]) => `
  <section class="group" id="${k}" data-g="${k}">
    <header><h2>${label}</h2><span>${list.length} ${list.length === 1 ? "guide" : "guides"}</span></header>
    <ul class="rows">${list.map(row).join("\n      ")}</ul>
  </section>`).join("")}
  ${endCta("See the waits before you go.", "Every guide is better with the live wait in your pocket. PeakWait is free on the App Store.")}
</div>
</main>
${footer()}
<script>
const fb=document.querySelectorAll('.filters button'),gs=document.querySelectorAll('[data-g]');
fb.forEach(b=>b.addEventListener('click',()=>{const f=b.dataset.f;fb.forEach(x=>x.setAttribute('aria-pressed',x===b));gs.forEach(g=>g.hidden=!(f==='all'||g.dataset.g===f));}));
</script>
</body>
</html>`;
}

// ---- updates (release notes), from updates-src/*.json ---------------------------
// Each file: { slug, version, date, title, summary, intro, sections:[{h2, html, shot?}], css? }.
// shot = { src, alt, kind: "device" | "story" } puts a real screen beside that section.
const shotHtml = (s) => !s ? "" : s.kind === "story"
  ? `<img class="storyimg" src="${s.src}" alt="${esc(s.alt)}" loading="lazy" width="1080" height="1920">`
  : device(s.src, s.alt, 220);

function updateHtml(u, all) {
  const url = `${SITE}/updates/${u.slug}/`;
  const i = all.findIndex((x) => x.slug === u.slug);
  const older = all[i + 1], newer = all[i - 1];
  const artLd = {
    "@context": "https://schema.org", "@type": "Article", headline: `PeakWait ${u.version}: ${u.title}`,
    description: u.summary, author: { "@type": "Organization", name: "PeakWait" },
    publisher: { "@type": "Organization", name: "PeakWait", logo: { "@type": "ImageObject", url: `${SITE}/icon-512.png` } },
    datePublished: u.date, dateModified: u.date, mainEntityOfPage: url, image: `${SITE}/og.png`,
  };
  const anyShot = u.sections.some((s) => s.shot);
  const body = anyShot
    ? u.sections.map((s, n) => `<section class="feat${s.shot ? "" : " noshot"}"><div class="t prose"><span class="n">${String(n + 1).padStart(2, "0")}</span><h2>${esc(s.h2)}</h2>${s.html.trim()}</div>${s.shot ? `<div class="shot">${shotHtml(s.shot)}</div>` : ""}</section>`).join("\n")
    : `<article class="prose solo">${u.sections.map((s) => `<h2>${esc(s.h2)}</h2>${s.html.trim()}`).join("\n")}</article>`;
  const css = `
.ahead{padding-block:clamp(40px,6vw,72px) 40px;background:linear-gradient(180deg,var(--skyTop),var(--bg))}
.ahead .inner{max-width:820px;display:grid;gap:18px}
.ahead h1{font-size:clamp(2.3rem,5.2vw,3.6rem);font-weight:850}
.ahead .intro p,.ahead .intro .dek{font-size:1.16rem;color:var(--ink2);max-width:60ch;margin:0}
.feat{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:clamp(28px,5vw,64px);align-items:center;padding-block:56px;border-top:1px solid var(--hair)}
.feat:nth-of-type(even){grid-template-columns:auto minmax(0,1fr)}
.feat:nth-of-type(even) .shot{order:-1}
.feat.noshot{grid-template-columns:1fr}
.feat .t{max-width:60ch}
.feat .n{font-family:var(--num);font-weight:800;font-size:.9rem;color:var(--ink3)}
.feat .t h2{margin:8px 0 14px}
.storyimg{width:200px;height:auto;aspect-ratio:9/16;border-radius:20px;border:1px solid var(--hair);box-shadow:0 40px 80px -30px rgba(0,0,0,.9)}
@media (max-width:760px){.feat,.feat:nth-of-type(even){grid-template-columns:1fr}.feat .shot{order:0!important;justify-self:center}}
.solo{max-width:720px;padding-top:24px;border-top:1px solid var(--hair)}
.pn{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;padding-block:24px 8px}
${u.css || ""}`;
  return `<!doctype html>
<html lang="en">
<head>
${head({ title: `PeakWait ${u.version}: ${u.title}`, description: u.summary, url, image: `${SITE}/assets/og/updates.jpg`, type: "article", extra: `<meta name="author" content="PeakWait">
<script type="application/ld+json">${JSON.stringify(artLd)}</script>
<style>${css}</style>` })}
</head>
<body>
${nav()}
<main>
<header class="ahead"><div class="wrap"><div class="inner">
  <nav class="crumbs" aria-label="Breadcrumb"><a href="/updates/">What's new</a><span>/</span><span>${esc(u.version)}</span></nav>
  <span class="ver"><b>${esc(u.version)}</b>${fmtDate(u.date)}</span>
  <h1>${esc(u.title)}</h1>
  ${u.intro ? `<div class="intro">${u.intro}</div>` : `<div class="intro"><p>${esc(u.summary)}</p></div>`}
</div></div></header>
<div class="wrap">
  ${body}
  ${endCta(`Get PeakWait ${u.version}.`, "Live lift waits, where to ski today and the best next chair. Free on the App Store.")}
  <nav class="pn" aria-label="More updates">${older ? `<a class="arrow" href="/updates/${older.slug}/">${esc(older.version)}: ${esc(older.title)}</a>` : "<span></span>"}<a class="arrow" href="/updates/">All updates</a></nav>
</div>
</main>
${footer()}
</body>
</html>`;
}

function updatesIndexHtml(all) {
  const [latest, ...rest] = all;
  const shots = latest.sections.filter((s) => s.shot).slice(0, 2);
  const css = `
.latest{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr);border:1px solid var(--hair);border-radius:28px;overflow:hidden;background:linear-gradient(160deg,var(--tint),var(--surface) 60%);transition:border-color .18s ease}
.latest:hover{border-color:var(--brand)}
.latest .copy{padding:clamp(28px,5vw,56px);display:grid;gap:16px;align-content:center;min-width:0}
.latest h2{font-size:clamp(1.9rem,3.6vw,2.8rem)}
.latest p{color:var(--ink2);font-size:1.06rem;max-width:46ch}
.latest ul{list-style:none;margin:0;padding:0;display:grid;gap:9px}
.latest li{display:flex;gap:10px;font-size:.98rem}
.latest li::before{content:"";flex:0 0 6px;height:6px;margin-top:9px;border-radius:50%;background:var(--ink3)}
.latest .media{display:flex;align-items:center;justify-content:center;gap:18px;padding:clamp(24px,4vw,48px)}
.latest .media .storyimg{width:min(180px,30vw);height:auto;aspect-ratio:9/16;border-radius:18px;border:1px solid var(--hair);margin-top:60px;box-shadow:0 40px 80px -30px rgba(0,0,0,.9)}
@media (max-width:860px){.latest{grid-template-columns:1fr}.latest .media .storyimg{display:none}}
.tl{position:relative;margin-top:72px}
.tl::before{content:"";position:absolute;left:96px;top:8px;bottom:8px;width:1px;background:var(--hair)}
.rel{position:relative;display:grid;grid-template-columns:96px minmax(0,1fr);gap:32px;padding-block:22px}
.rel .v{font-family:var(--num);font-weight:800;font-size:1.25rem;padding-top:2px}
.rel .v small{display:block;font-family:var(--sans);font-weight:600;font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--ink3);margin-top:6px}
.rel::after{content:"";position:absolute;left:92px;top:30px;width:9px;height:9px;border-radius:50%;background:var(--bg);border:2px solid var(--ink3)}
.rel a{display:grid;gap:8px;padding:22px 24px;margin-left:12px;border:1px solid var(--hair);border-radius:var(--r-lg);background:var(--surface);transition:border-color .18s ease,transform .18s ease}
.rel a:hover{border-color:var(--brand);transform:translateX(2px)}
.rel h3{font-size:1.3rem}
.rel p{color:var(--ink2);font-size:.98rem;max-width:70ch}
@media (max-width:640px){.tl::before{left:6px}.rel{grid-template-columns:1fr;gap:10px;padding-left:24px}.rel::after{left:2px;top:28px}.rel a{margin-left:0}.rel .v small{display:inline;margin-left:8px}}`;
  return `<!doctype html>
<html lang="en">
<head>
${head({ title: "What's New in PeakWait | Product Updates", description: "What's new in PeakWait: release notes and the story behind each update.", url: `${SITE}/updates/`, image: `${SITE}/assets/og/updates.jpg`, extra: `<style>${css}</style>` })}
</head>
<body>
${nav()}
<main>
<section class="phero"><div class="wrap">
  <span class="eyebrow">What's new</span>
  <h1>Better every release.</h1>
  <p class="say">What's new in PeakWait, and the story behind each update.</p>
</div></section>
<div class="wrap">
  <a class="latest" href="/updates/${latest.slug}/">
    <div class="copy">
      <span class="ver"><b>${esc(latest.version)}</b>Latest · ${fmtMonth(latest.date)}</span>
      <h2>${esc(latest.title)}</h2>
      <p>${esc(latest.summary)}</p>
      <ul>${latest.sections.map((s) => `<li>${esc(s.h2)}</li>`).join("")}</ul>
      <span class="arrow">Read the update</span>
    </div>
    ${shots.length ? `<div class="media">${shots.map((s) => shotHtml(s.shot)).join("")}</div>` : ""}
  </a>
  <div class="tl">${rest.map((u) => `
    <div class="rel"><span class="v">${esc(u.version)}<small>${fmtMonth(u.date)}</small></span><a href="/updates/${u.slug}/"><h3>${esc(u.title)}</h3><p>${esc(u.summary)}</p></a></div>`).join("")}
  </div>
  ${endCta("Get the latest PeakWait.", "Every update arrives free from the App Store.")}
</div>
</main>
${footer()}
</body>
</html>`;
}

function sitemap(arts, updates) {
  const urls = [
    { loc: SITE + "/", pri: "1.0" },
    { loc: SITE + "/guides/", pri: "0.8" },
    ...arts.map((a) => ({ loc: `${SITE}/guides/${a.slug}/`, pri: "0.7", lastmod: a.updated })),
    { loc: SITE + "/updates/", pri: "0.5" },
    ...updates.map((u) => ({ loc: `${SITE}/updates/${u.slug}/`, pri: "0.5", lastmod: u.date })),
    { loc: SITE + "/terms/", pri: "0.3" },
    { loc: SITE + "/privacy/", pri: "0.3" },
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}<priority>${u.pri}</priority></url>`).join("\n")}
</urlset>`;
}

// ---- retired guides --------------------------------------------------------
// Guides taken down (Bill, 2026-11-09: they compared PeakWait by name to other apps). Each old URL
// keeps working as a redirect so links and search results land somewhere useful.
const RETIRED = { "peakwait-vs-whistler-peak-app": "/guides/whistler-lift-wait-times/", "best-ski-lift-wait-apps": "/guides/" };
const redirectHtml = (to) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>PeakWait Guides</title>
<link rel="canonical" href="${SITE}${to}"><meta name="robots" content="noindex">
<meta http-equiv="refresh" content="0; url=${to}"></head>
<body><p><a href="${to}">Continue to PeakWait Guides</a></p></body></html>`;

// ---- llms.txt / llms-full.txt (for AI answer engines) ----------------------
const SUMMARY = "PeakWait is a real-time ski-lift wait app for iPhone. Skiers on the mountain report live lift waits (Moving, Short, Busy, Long), and PeakWait shows which lifts are moving right now, ranks where to ski today by snow and crowds, and points you to the best next chair. It covers 116 resorts across North and South America. Free to check status and report waits; PeakWait Plus adds the cross-resort \"where to ski today\" guide, powder alerts, and live friend location. Made by PeakWait LLC.";

function llmsTxt(arts) {
  return `# PeakWait

> ${SUMMARY}

## Guides
${arts.map((a) => `- [${waitify(a.title)}](${SITE}/guides/${a.slug}/): ${a.description}`).join("\n")}

## Product
- [PeakWait home](${SITE}/): what PeakWait is, its features, and the download link.
- [Download PeakWait](${DOWNLOAD_URL}): get the free iOS app.

## Legal
- [Terms of Use](${SITE}/terms/): the terms of service.
- [Privacy Policy](${SITE}/privacy/): what data PeakWait collects and your choices.
`;
}

function articleText(a) {
  let out = `# ${waitify(a.title)}\nBy ${AUTHOR} · ${fmtDate(a.published)} · ${SITE}/guides/${a.slug}/\n\n${stripTags(a.dek)}\n\n`;
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

// ---- generated guides ------------------------------------------------------
// The daily job (tools/write-guide.mjs) writes one guide per file in guides-src/, so it never edits this
// file. Each file is { article, index, mountainName? } in the same shapes as ARTICLES and INDEX_META.
const SRC = path.join(ROOT, "guides-src");
if (fs.existsSync(SRC)) {
  for (const f of fs.readdirSync(SRC).filter((f) => f.endsWith(".json")).sort()) {
    const g = JSON.parse(fs.readFileSync(path.join(SRC, f), "utf8"));
    if (ARTICLES.some((a) => a.slug === g.article.slug)) throw new Error(`guides-src/${f}: slug ${g.article.slug} already exists`);
    ARTICLES.push(g.article);
    INDEX_META[g.article.slug] = g.index;
    if (g.mountainName) MOUNTAIN_NAME[g.article.slug] = g.mountainName;
    if (g.index.region && !REGIONS.some(([k]) => k === g.index.region)) REGIONS.push([g.index.region, g.index.regionLabel || g.index.region]);
  }
}

// ---- lint --------------------------------------------------------------
// No parentheses, no em dashes, in guide copy. See docs/marketing/writing-standards.md.
function lintArticles(arts) {
  const offenders = [];
  const bad = (s) => /[()]|—/.test(String(s));
  const flag = (slug, field, value) => {
    if (bad(value)) offenders.push(`  ${slug} — ${field}: ${String(value).trim().slice(0, 120)}`);
  };
  for (const a of arts) {
    flag(a.slug, "title", a.title);
    flag(a.slug, "description", a.description);
    flag(a.slug, "h1", a.h1);
    flag(a.slug, "dek", a.dek);
    a.sections.forEach((s, i) => {
      flag(a.slug, `sections[${i}].h2`, s.h2);
      flag(a.slug, `sections[${i}].html`, stripTags(s.html));
    });
    a.faqs.forEach((f, i) => {
      flag(a.slug, `faqs[${i}].q`, f.q);
      flag(a.slug, `faqs[${i}].a`, f.a);
    });
  }
  if (offenders.length) {
    console.error(`\nLint failed: ${offenders.length} guide field(s) contain "(", ")", or an em dash "—".\n`);
    console.error(offenders.join("\n"));
    console.error("\nSee docs/marketing/writing-standards.md — no parentheses, no em dashes, in guide copy.");
    process.exit(1);
  }
}
lintArticles(ARTICLES);

// ---- build -----------------------------------------------------------------
let n = 0;
for (const a of ARTICLES) {
  const dir = path.join(ROOT, "guides", a.slug);
  fs.mkdirSync(dir, { recursive: true });
  // Keep reading: same section first, then the newest of the rest.
  const sameSec = ARTICLES.filter((o) => o.slug !== a.slug && sectionOf(o) === sectionOf(a));
  const rest = ARTICLES.filter((o) => o.slug !== a.slug && sectionOf(o) !== sectionOf(a)).sort((x, y) => (y.published > x.published ? 1 : -1));
  fs.writeFileSync(path.join(dir, "index.html"), articleHtml(a, [...sameSec, ...rest].slice(0, 3)));
  n++;
}
fs.writeFileSync(path.join(ROOT, "guides", "index.html"), indexHtml(ARTICLES));
for (const [slug, to] of Object.entries(RETIRED)) {
  fs.mkdirSync(path.join(ROOT, "guides", slug), { recursive: true });
  fs.writeFileSync(path.join(ROOT, "guides", slug, "index.html"), redirectHtml(to));
}
// Updates: one JSON per release in updates-src/, newest first.
const USRC = path.join(ROOT, "updates-src");
const UPDATES = fs.readdirSync(USRC).filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(fs.readFileSync(path.join(USRC, f), "utf8")))
  .sort((a, b) => (b.date > a.date ? 1 : -1));
// American English in every guide and update article. See docs/marketing/writing-standards.md in peakwait.
function lintSpelling(pages) {
  const offenders = pages.flatMap(([name, page]) => {
    const british = britishSummary(stripTags(JSON.stringify(page)));
    return british ? [`  ${name}: ${british}`] : [];
  });
  if (offenders.length) {
    console.error(`\nLint failed: British spelling in ${offenders.length} page(s). PeakWait writes American English.\n`);
    console.error(offenders.join("\n"));
    process.exit(1);
  }
}
lintSpelling([...ARTICLES.map((a) => [`guides/${a.slug}`, a]), ...UPDATES.map((u) => [`updates/${u.slug}`, u])]);

for (const u of UPDATES) {
  const dir = path.join(ROOT, "updates", u.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), updateHtml(u, UPDATES));
}
fs.writeFileSync(path.join(ROOT, "updates", "index.html"), updatesIndexHtml(UPDATES));
// Every page links /assets/site.css?v=<hash>, so a release reaches phones now instead of after the
// 4-hour browser cache. Hand-written pages (home, invite) get the same version here.
{
  const v = crypto.createHash("sha1").update(fs.readFileSync(path.join(ROOT, "assets", "site.css"))).digest("hex").slice(0, 8);
  for (const p of ["index.html", "add/index.html"]) {
    const f = path.join(ROOT, p);
    fs.writeFileSync(f, fs.readFileSync(f, "utf8").replace(/\/assets\/site\.css(\?v=[0-9a-f]+)?/g, `/assets/site.css?v=${v}`));
  }
}
// Home page: the five newest guides, between the guides:start/end markers in /index.html.
{
  const homeP = path.join(ROOT, "index.html");
  const home = fs.readFileSync(homeP, "utf8");
  const newest = [...ARTICLES].sort((a, b) => (b.published > a.published ? 1 : -1)).slice(0, 5);
  const secName = (a) => SECTIONS.find(([k]) => k === sectionOf(a))[1];
  const cards = newest.map((a, i) => i === 0
    ? `<a class="gcard feat" href="/guides/${a.slug}/" style="background-image:linear-gradient(0deg,rgba(7,15,22,.96) 30%,rgba(7,15,22,.72) 62%,rgba(7,15,22,.45)),url(${imageOf(a)})"><span class="meta"><i>New</i>${esc(secName(a))} · ${esc(a.readTime)}</span><div style="display:grid;gap:10px"><h3>${esc(waitify(a.h1))}</h3><p>${esc(subOf(a))}</p></div></a>`
    : `<a class="gcard" href="/guides/${a.slug}/"><span class="meta">${esc(secName(a))} · ${esc(a.readTime)}</span><h3>${esc(waitify(a.h1))}</h3><span class="arrow">Read</span></a>`).join("\n      ");
  const next = home.replace(/<!-- guides:start -->[\s\S]*?<!-- guides:end -->/, `<!-- guides:start -->\n      ${cards}\n      <!-- guides:end -->`);
  if (next === home && !home.includes("<!-- guides:start -->")) throw new Error("index.html lost its guides:start/end markers");
  fs.writeFileSync(homeP, next);
}
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), sitemap(ARTICLES, UPDATES));
fs.writeFileSync(path.join(ROOT, "robots.txt"), ROBOTS);
fs.writeFileSync(path.join(ROOT, "llms.txt"), llmsTxt(ARTICLES));
fs.writeFileSync(path.join(ROOT, "llms-full.txt"), llmsFull(ARTICLES));
console.log(`Built ${n} guides + index + ${UPDATES.length} updates + sitemap.xml + robots.txt + llms.txt + llms-full.txt`);
