import fs from "node:fs";
import crypto from "node:crypto";
// Shared page shell for every generated page (guides, updates) and the hand-written ones (home, add).
// One nav, one footer, one stylesheet (/assets/site.css), so the whole site moves together.
// Style Guide v1.0: system SF for words, SF Pro Rounded for numerals, blue = actions, gold = earned.

export const SITE = "https://peakwait.net";
const CSS_V = crypto.createHash("sha1").update(fs.readFileSync(new URL("../../assets/site.css", import.meta.url))).digest("hex").slice(0, 8);
export const DOWNLOAD_URL = "https://apps.apple.com/us/app/id6793253589";
export const PH_URL = "https://www.producthunt.com/posts/peakwait";

export const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Bill's rule: the lift queue is a "wait", never a "line" (skiers read "line" as a route). URLs keep
// their old slugs until the post-launch rename; every visible title says wait.
export const waitify = (s) => String(s)
  .replace(/\bLift Lines\b/g, "Lift Waits").replace(/\blift lines\b/g, "lift waits")
  .replace(/\bLift Line\b/g, "Lift Wait").replace(/\blift line\b/g, "lift wait")
  .replace(/\bWorse Lift Waits\b/g, "Longer Lift Waits");

export const GA_TAG = `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-LJ4V6MDP0Y"></script>
<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-LJ4V6MDP0Y');
</script>`;

/** <head> contents shared by every page. `extra` is page-specific tags (ld+json, <style>). */
export function head({ title, description, url, image = `${SITE}/assets/og/home.jpg`, type = "website", extra = "" }) {
  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
${GA_TAG}
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="${type}">
<meta property="og:site_name" content="PeakWait">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${image}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<meta name="theme-color" content="#070F16">
<link rel="stylesheet" href="/assets/site.css?v=${CSS_V}">
${extra}`;
}

const LINKS = [["/#how", "How it works"], ["/#features", "Features"], ["/#plus", "Plus"], ["/#mountains", "Mountains"], ["/guides/", "Guides"]];

/** Sticky nav. `current` is the href to mark (e.g. "/guides/"). */
export function nav(current = "") {
  const a = (href, label) => `<a href="${href}"${href === current ? ' aria-current="page"' : ""}>${label}</a>`;
  return `<header class="nav">
  <div class="wrap">
    <a class="brandmark" href="/"><img src="/apple-touch-icon.png" alt="" width="34" height="34">PeakWait</a>
    <nav class="links" aria-label="Main">${LINKS.map(([h, l]) => a(h, l)).join("")}</nav>
    <a class="btn" href="${DOWNLOAD_URL}">Download</a>
    <details class="menu"><summary aria-label="Menu"><span></span></summary>
      <nav aria-label="Menu">${LINKS.map(([h, l]) => `<a href="${h}">${l === "Plus" ? "PeakWait Plus" : l}</a>`).join("")}<a href="/updates/">What's new</a></nav>
    </details>
  </div>
</header>`;
}

export function footer() {
  return `<footer>
  <div class="wrap">
    <div class="fgrid">
      <div class="about"><a class="brandmark" href="/"><img src="/apple-touch-icon.png" alt="" width="34" height="34">PeakWait</a><p>Live lift waits from the skiers on the hill. Ski the mountain, skip the wait.</p>
        <a class="badge as" href="${DOWNLOAD_URL}" aria-label="Download PeakWait on the App Store"><img src="/assets/img/appstore-badge.svg" alt="Download on the App Store" width="135" height="45" style="height:45px"></a></div>
      <div><h5>Product</h5><ul><li><a href="/#how">How it works</a></li><li><a href="/#features">Features</a></li><li><a href="/#plus">PeakWait Plus</a></li><li><a href="/#pricing">Pricing</a></li></ul></div>
      <div><h5>Read</h5><ul><li><a href="/guides/">Guides</a></li><li><a href="/updates/">What's new</a></li><li><a href="/#mountains">Mountains</a></li></ul></div>
      <div><h5>Company</h5><ul><li><a href="/privacy/">Privacy</a></li><li><a href="/terms/">Terms</a></li><li><a href="mailto:contact@peakwait.net">contact@peakwait.net</a></li></ul></div>
    </div>
    <div class="legal"><span>Safety: PeakWait gives advisory information only. Posted signs, ski patrol, closures and resort operations always come first.</span><span>PeakWait is independent and not affiliated with any resort or pass. © 2026 PeakWait LLC</span></div>
  </div>
</footer>
<script>document.querySelectorAll('.menu nav a').forEach(a=>a.addEventListener('click',()=>a.closest('details').open=false));</script>`;
}

/** The closing App Store band used at the end of guides and updates. */
export function endCta(h, p) {
  return `<aside class="endcta">
    <div><h2>${esc(h)}</h2><p>${esc(p)}</p></div>
    <div class="badges"><a class="badge as" href="${DOWNLOAD_URL}" aria-label="Download PeakWait on the App Store"><img src="/assets/img/appstore-badge.svg" alt="Download on the App Store" width="162" height="54"></a></div>
  </aside>`;
}

/** A real app screen in a device frame (never cropped). */
export const device = (src, alt, w = 220) =>
  `<div class="device" style="--w:${w}px"><img src="${src}" alt="${esc(alt)}" loading="lazy" width="990" height="2151"></div>`;
