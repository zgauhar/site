// Builds the blog from blog-src/ into blog/.
//
//   node tools/build-blog.mjs
//
// blog-src/categories.json lists the categories (tools and utilities only).
// Each blog-src/<slug>.html starts with a <!--meta {json} --> comment and
// is followed by the article body. Output: blog/index.html,
// blog/<category>/index.html, blog/<slug>.html, blog-sitemap-urls.txt is
// not written; sitemap.xml is patched between the blog markers.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SITE = "https://www.mintwavestudio.com/";
const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(dir, "blog-src");
const out = path.join(dir, "blog");
const VER = fs.readFileSync(path.join(dir, "index.html"), "utf8").match(/styles\.css\?v=(\w+)/)[1];

const APPS = {
  endly: { name: "Endly", page: "endly.html", icon: "assets/endly/icon-192.png", soon: true,
    cta: "A private endometriosis symptom diary", text: "Endly is coming soon to Google Play and the App Store: log pain in 10 seconds, see your patterns and bring a clear report to your doctor. No ads, no analytics." },
  "cable-calc": { name: "Cable Calc", page: "cable-calc.html", icon: "assets/cable-calc/icon-192.png", id: "com.mintwave.cablecalc",
    cta: "Size cables to IEC 60364 in seconds", text: "Cable size, derating, breaker and voltage drop on one screen. Free on Android and works offline." }
};

const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const cats = JSON.parse(fs.readFileSync(path.join(src, "categories.json"), "utf8"));
const catBy = Object.fromEntries(cats.map(c => [c.slug, c]));

const posts = fs.readdirSync(src).filter(f => f.endsWith(".html")).map(f => {
  const raw = fs.readFileSync(path.join(src, f), "utf8");
  const m = raw.match(/^<!--meta\s*([\s\S]*?)-->\s*/);
  const meta = JSON.parse(m[1]);
  if (!catBy[meta.category]) throw new Error(`${f}: unknown category ${meta.category}`);
  return { ...meta, body: raw.slice(m[0].length) };
}).sort((a, b) => b.date.localeCompare(a.date));

const fmt = d => new Date(d + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

function page({ depth, title, desc, canonical, jsonld, crumbs, main, image }) {
  const up = "../".repeat(depth);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${SITE}${canonical}">
<meta property="og:type" content="${canonical.endsWith("/") ? "website" : "article"}">
<meta property="og:site_name" content="MintWave Studio">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${SITE}${canonical}">
<meta property="og:image" content="${SITE}${image}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${up}assets/brand/logo-400.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&amp;family=Space+Grotesk:wght@500;600;700&amp;display=swap" rel="stylesheet">
<link rel="stylesheet" href="${up}styles.css?v=${VER}">
<link rel="stylesheet" href="${up}pages.css?v=${VER}">
<script src="${up}site-chrome.js?v=${VER}" defer></script>
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
</head>
<body>
<div id="site-header"></div>

<main class="page narrow">
<nav class="breadcrumb" aria-label="Breadcrumb">${crumbs}</nav>
${main}
</main>
<div id="site-footer"></div>
</body>
</html>
`;
}

const org = { "@type": "Organization", name: "MintWave Studio", url: SITE, "@id": SITE + "#org" };
const crumbLd = items => ({ "@type": "BreadcrumbList", itemListElement: items.map(([name, url], i) => ({ "@type": "ListItem", position: i + 1, name, item: SITE + url })) });

const chips = (depth, active) => `<nav class="chip-nav" aria-label="Blog categories">
<a href="${"../".repeat(depth)}blog/"${active ? "" : ' aria-current="page"'}>All posts</a>
${cats.map(c => `<a href="${"../".repeat(depth)}blog/${c.slug}/"${c.slug === active ? ' aria-current="page"' : ""}>${esc(c.name)}</a>`).join("\n")}
</nav>`;

const card = (p, up) => `<article class="post-card">
<p class="post-meta"><a href="${up}blog/${p.category}/">${esc(catBy[p.category].name)}</a> · <time datetime="${p.date}">${fmt(p.date)}</time></p>
<h3><a href="${up}blog/${p.slug}.html">${esc(p.title)}</a></h3>
<p>${esc(p.excerpt)}</p>
</article>`;

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
const write = (f, s) => { fs.mkdirSync(path.dirname(path.join(out, f)), { recursive: true }); fs.writeFileSync(path.join(out, f), s); };
const ogDefault = "assets/cable-calc/og.jpg";

// Index
write("index.html", page({
  depth: 1, title: "MintWave Studio Blog: Practical Guides for Tools and Utilities",
  desc: "Practical guides from the makers of Cable Calc, MultiTimer, Days Until, Daily Budget, Hatch Day and Sire & Dam: cable sizing, timers, expiry tracking, budgeting, egg incubation and dog breeding.",
  canonical: "blog/", image: ogDefault,
  jsonld: { "@context": "https://schema.org", "@graph": [{ "@type": "Blog", name: "MintWave Studio Blog", url: SITE + "blog/", publisher: { "@id": SITE + "#org" } }, org, crumbLd([["Home", ""], ["Blog", "blog/"]])] },
  crumbs: `<a href="../">Home</a> › Blog`,
  main: `<h1>MintWave Studio blog</h1>
<p class="lead">Practical guides behind our calculators, timers and trackers: how the numbers work, and how to get a reliable answer without guesswork.</p>
${chips(1, null)}
<h2>Latest posts</h2>
<div class="post-list">
${posts.map(p => card(p, "../")).join("\n")}
</div>
<h2>Categories</h2>
<div class="post-list">
${cats.map(c => `<article class="post-card"><h3><a href="../blog/${c.slug}/">${esc(c.name)}</a></h3><p>${esc(c.blurb)}</p><p class="post-meta">Related app: <a href="../${c.appUrl}">${esc(c.app)}</a></p></article>`).join("\n")}
</div>`
}));

// Category pages
for (const c of cats) {
  const ps = posts.filter(p => p.category === c.slug);
  write(`${c.slug}/index.html`, page({
    depth: 2, title: `${c.name}: Guides and Articles | MintWave Studio Blog`,
    desc: `${c.blurb} Articles from the makers of ${c.app}.`,
    canonical: `blog/${c.slug}/`, image: ogDefault,
    jsonld: { "@context": "https://schema.org", "@graph": [{ "@type": "CollectionPage", name: c.name, url: `${SITE}blog/${c.slug}/`, isPartOf: { "@type": "Blog", url: SITE + "blog/" } }, org, crumbLd([["Home", ""], ["Blog", "blog/"], [c.name, `blog/${c.slug}/`]])] },
    crumbs: `<a href="../../">Home</a> › <a href="../">Blog</a> › ${esc(c.name)}`,
    main: `<h1>${esc(c.name)}</h1>
<p class="lead">${esc(c.blurb)}</p>
${chips(2, c.slug)}
${ps.length ? `<div class="post-list">\n${ps.map(p => card(p, "../../")).join("\n")}\n</div>` : `<p class="note">New articles are on the way.</p>`}
<p>Related app: <a href="../../${c.appUrl}">${esc(c.app)}</a></p>`
  }));
}

// Posts
for (const p of posts) {
  const c = catBy[p.category], a = APPS[p.app];
  const url = `blog/${p.slug}.html`;
  write(`${p.slug}.html`, page({
    depth: 1, title: `${p.title} | MintWave Studio Blog`, desc: p.description, canonical: url, image: ogDefault,
    jsonld: { "@context": "https://schema.org", "@graph": [{ "@type": "BlogPosting", headline: p.title, description: p.description, datePublished: p.date, dateModified: p.date, inLanguage: "en", mainEntityOfPage: SITE + url, image: SITE + ogDefault, author: { "@id": SITE + "#org" }, publisher: { "@id": SITE + "#org" } }, org, crumbLd([["Home", ""], ["Blog", "blog/"], [c.name, `blog/${c.slug}/`], [p.title, url]])] },
    crumbs: `<a href="../">Home</a> › <a href="./">Blog</a> › <a href="${c.slug}/">${esc(c.name)}</a> › Article`,
    main: `<p class="post-meta"><a href="${c.slug}/">${esc(c.name)}</a> · <time datetime="${p.date}">${fmt(p.date)}</time></p>
<h1>${esc(p.title)}</h1>
${p.body}
${a ? `<aside class="app-cta">
  <img class="app-icon" src="../${a.icon}" alt="" width="72" height="72">
  <div>
    <h2>${esc(a.cta)}</h2>
    <p>${esc(a.text)} <a class="cta-link" href="../${a.page}">About ${esc(a.name)}</a></p>
    ${a.soon ? `<p class="soon">Coming soon to Google Play and the App Store.</p>` : `<div class="badges"><a class="play-badge" href="https://play.google.com/store/apps/details?id=${a.id}&amp;hl=en&amp;referrer=utm_source%3Dmintwavestudio%26utm_medium%3Dblog%26utm_campaign%3D${p.slug}"><img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Get ${esc(a.name)} on Google Play" width="180" height="70"></a><span class="soon">iPhone version coming soon.</span></div>`}
  </div>
</aside>` : ""}
<p class="note updated">Published: <time datetime="${p.date}">${fmt(p.date)}</time></p>`
  }));
}

// Sitemap: replace the region between the blog markers (or append once).
const urls = [["blog/", posts[0]?.date], ...cats.map(c => [`blog/${c.slug}/`, posts.find(p => p.category === c.slug)?.date ?? posts[0].date]), ...posts.map(p => [`blog/${p.slug}.html`, p.date])];
const block = `  <!-- blog -->\n${urls.map(([u, d]) => `  <url>\n    <loc>${SITE}${u}</loc>\n    <lastmod>${d}</lastmod>\n  </url>`).join("\n")}\n  <!-- /blog -->\n`;
const smPath = path.join(dir, "sitemap.xml");
let sm = fs.readFileSync(smPath, "utf8");
sm = /  <!-- blog -->[\s\S]*?<!-- \/blog -->\n/.test(sm) ? sm.replace(/  <!-- blog -->[\s\S]*?<!-- \/blog -->\n/, block) : sm.replace("</urlset>", block + "</urlset>");
fs.writeFileSync(smPath, sm);
console.log(`built ${posts.length} post(s), ${cats.length} categories`);
