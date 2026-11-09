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
  "daily-budget": { name: "Daily Budget", page: "daily-budget.html", icon: "assets/daily-budget/icon-192.png", id: "com.mintwave.dailybudget",
    cta: "See what you can spend today", text: "Add income and bills once and Daily Budget shows a daily allowance, carries unspent money forward and explains every step. No bank login, no ads. Free on Android." },
  "hatch-day": { name: "Hatch Day", page: "hatch-day.html", icon: "assets/hatch/icon-192.png", id: "com.mintwave.hatchday", ios: "https://apps.apple.com/app/id6823774178",
    cta: "Track every hatch from set to lockdown", text: "Hatch countdown for 11 species, daily temperature and humidity targets, and turning, candling and lockdown reminders. Free on Android and iPhone, works offline." },
  endly: { name: "Endly", page: "endly.html", icon: "assets/endly/icon-192.png", id: "com.mintwave.endly",
    cta: "A private endometriosis symptom diary", text: "Endly is on Google Play: log pain in 10 seconds, see your patterns and bring a clear report to your doctor. No ads, no analytics." },
  multitimer: { name: "MultiTimer", page: "multitimer.html", icon: "assets/multitimer/icon-192.png", id: "com.mintwave.multitimer",
    cta: "Run several timers at once", text: "Countdowns, stopwatches and Pomodoro timers side by side, with exact alarms that ring even when the phone is asleep. Free on Android, no ads, no account." },
  "days-until": { name: "Days Until", page: "days-until.html", icon: "assets/days-until/icon-192.png", id: "com.mintwave.daysuntil",
    cta: "Track expiry dates and get reminded in time", text: "Scan best-before dates, track food, medicine and documents with no item limit, and get reminders before they expire. Free on Android, no ads, no account." },
  "sire-dam": { name: "Sire & Dam", page: "sire-dam.html", icon: "assets/sire-dam/icon-192.png", id: "com.mintwave.siredam",
    cta: "Track heats, progesterone and litters", text: "Heat and next-heat prediction, progesterone stages with an ovulation estimate, whelping countdown and puppy weights. Free on Android, works offline." },
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

const thumb = p => `assets/blog/${p.slug}.svg`;
const ogImg = p => `assets/blog/${p.slug}.png`;
const fmt = d => new Date(d + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

function page({ depth, title, desc, canonical, jsonld, crumbs, main, image, keywords, article }) {
  const up = "../".repeat(depth);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
${keywords ? `<meta name="keywords" content="${esc(keywords.join(", "))}">
` : ""}<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
<link rel="alternate" type="application/rss+xml" title="MintWave Studio Blog" href="${up}blog/feed.xml">
<link rel="canonical" href="${SITE}${canonical}">
<meta property="og:type" content="${canonical.endsWith("/") ? "website" : "article"}">
<meta property="og:site_name" content="MintWave Studio">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${SITE}${canonical}">
<meta property="og:image" content="${SITE}${image}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${SITE}${image}">
${article ? `<meta property="article:published_time" content="${article.date}">
<meta property="article:section" content="${esc(article.section)}">
` : ""}
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

const card = (p, up, featured) => `<article class="post-card${featured ? " featured" : ""}">
<a class="thumb" href="${up}blog/${p.slug}.html" tabindex="-1" aria-hidden="true"><img src="${up}${thumb(p)}" alt="${esc(p.imageAlt)}" width="1200" height="630" loading="${featured ? "eager" : "lazy"}"></a>
<div class="post-body">
<p class="post-meta"><a class="tag" href="${up}blog/${p.category}/">${esc(catBy[p.category].name)}</a> <time datetime="${p.date}">${fmt(p.date)}</time></p>
<h3><a href="${up}blog/${p.slug}.html">${esc(p.title)}</a></h3>
<p>${esc(p.excerpt)}</p>
<a class="read-more" href="${up}blog/${p.slug}.html">Read article <span aria-hidden="true">→</span></a>
</div>
</article>`;

const ICON_DIR = { "hatch-day": "hatch" };
const catIcon = c => { const k = c.appUrl.replace(".html", ""); return `assets/${ICON_DIR[k] ?? k}/icon-192.png`; };
const catCard = (c, up) => `<a class="cat-card" href="${up}blog/${c.slug}/"><img src="${up}${catIcon(c)}" alt="${esc(c.app)} app icon" width="56" height="56" loading="lazy"><span><strong>${esc(c.name)}</strong><span>${esc(c.blurb)}</span><em>${posts.filter(p => p.category === c.slug).length || "No"} post${posts.filter(p => p.category === c.slug).length === 1 ? "" : "s"} · ${esc(c.app)}</em></span></a>`;

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
const write = (f, s) => { fs.mkdirSync(path.dirname(path.join(out, f)), { recursive: true }); fs.writeFileSync(path.join(out, f), s); };
const ogDefault = "assets/cable-calc/og.jpg";

// Index
write("index.html", page({
  depth: 1, title: "MintWave Blog: Practical Guides for Tools and Utilities",
  desc: "Practical guides on cable sizing, timers, expiry dates, budgeting, egg incubation, dog breeding and symptom tracking, from the makers of MintWave apps.",
  canonical: "blog/", image: ogDefault,
  jsonld: { "@context": "https://schema.org", "@graph": [{ "@type": "Blog", name: "MintWave Studio Blog", url: SITE + "blog/", publisher: { "@id": SITE + "#org" } }, org, crumbLd([["Home", ""], ["Blog", "blog/"]])] },
  crumbs: `<a href="../">Home</a> › Blog`,
  main: `<h1>MintWave Studio blog</h1>
<p class="lead">Practical guides behind our calculators, timers and trackers: how the numbers work, and how to get a reliable answer without guesswork.</p>
${chips(1, null)}
<h2>Latest posts</h2>
<div class="post-list">
${posts.map((p, i) => card(p, "../", i === 0)).join("\n")}
</div>
<h2>Browse by topic</h2>
<div class="cat-grid">
${cats.map(c => catCard(c, "../")).join("\n")}
</div>`
}));

// Category pages
for (const c of cats) {
  const ps = posts.filter(p => p.category === c.slug);
  write(`${c.slug}/index.html`, page({
    depth: 2, title: `${c.name}: Guides | MintWave Blog`,
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
const words = html => html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
const appLd = a => ({ "@type": "SoftwareApplication", name: a.name, url: SITE + a.page, applicationCategory: "UtilitiesApplication", operatingSystem: "Android" });
posts.forEach((p, idx) => {
  const c = catBy[p.category], a = APPS[p.app];
  const url = `blog/${p.slug}.html`;
  const newer = posts[idx - 1], older = posts[idx + 1];
  const related = [...posts.filter(q => q.slug !== p.slug && q.category === p.category), ...posts.filter(q => q.slug !== p.slug && q.category !== p.category)].slice(0, 3);
  write(`${p.slug}.html`, page({
    depth: 1, title: p.seoTitle || p.title, desc: p.description, canonical: url, image: ogImg(p),
    keywords: p.keywords, article: { date: p.date, section: c.name },
    jsonld: { "@context": "https://schema.org", "@graph": [{ "@type": "BlogPosting", headline: p.title, description: p.description, datePublished: p.date, dateModified: p.date, inLanguage: "en", articleSection: c.name, keywords: (p.keywords || []).join(", "), wordCount: words(p.body), mainEntityOfPage: SITE + url, image: { "@type": "ImageObject", url: SITE + ogImg(p), width: 1200, height: 630, caption: p.imageAlt }, author: { "@id": SITE + "#org" }, publisher: { "@id": SITE + "#org" }, ...(a ? { about: appLd(a) } : {}), isPartOf: { "@type": "Blog", url: SITE + "blog/" } }, org, crumbLd([["Home", ""], ["Blog", "blog/"], [c.name, `blog/${c.slug}/`], [p.title, url]]), ...(p.faq?.length ? [{ "@type": "FAQPage", mainEntity: p.faq.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }] : [])] },
    crumbs: `<a href="../">Home</a> › <a href="./">Blog</a> › <a href="${c.slug}/">${esc(c.name)}</a> › ${esc(p.title)}`,
    main: `<p class="post-meta"><a class="tag" href="${c.slug}/">${esc(c.name)}</a> · <time datetime="${p.date}">${fmt(p.date)}</time></p>
<h1>${esc(p.title)}</h1>
<figure class="post-hero"><img src="../${thumb(p)}" alt="${esc(p.imageAlt)}" width="1200" height="630"></figure>
${p.body}
${p.faq?.length ? `<section class="faq" aria-labelledby="faq-h"><h2 id="faq-h">Frequently asked questions</h2>
${p.faq.map(f => `<h3>${esc(f.q)}</h3>\n<p>${esc(f.a)}</p>`).join("\n")}
</section>` : ""}
${a ? `<aside class="app-cta">
  <img class="app-icon" src="../${a.icon}" alt="${esc(a.name)} app icon" width="72" height="72">
  <div>
    <h2>${esc(a.cta)}</h2>
    <p>${esc(a.text)} <a class="cta-link" href="../${a.page}">About ${esc(a.name)}</a></p>
    ${a.soon ? `<p class="soon">Coming soon to Google Play and the App Store.</p>` : `<div class="badges"><a class="play-badge" href="https://play.google.com/store/apps/details?id=${a.id}&amp;hl=en&amp;referrer=utm_source%3Dmintwavestudio%26utm_medium%3Dblog%26utm_campaign%3D${p.slug}"><img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Get ${esc(a.name)} on Google Play" width="180" height="70"></a>${a.ios ? `<a class="app-store-badge" href="${a.ios}"><img src="/assets/badges/app-store-black.svg" alt="Download ${esc(a.name)} on the App Store" width="150" height="50" loading="lazy"></a>` : `<span class="soon">iPhone version coming soon.</span>`}</div>`}
  </div>
</aside>` : ""}
${related.length ? `<section class="related" aria-labelledby="related-h"><h2 id="related-h">Keep reading</h2>
<div class="post-list">
${related.map(q => card(q, "../")).join("\n")}
</div></section>` : ""}
<nav class="post-nav" aria-label="Previous and next articles">
${older ? `<a rel="prev" href="${older.slug}.html"><span>← Older</span>${esc(older.title)}</a>` : "<span></span>"}
${newer ? `<a rel="next" href="${newer.slug}.html"><span>Newer →</span>${esc(newer.title)}</a>` : "<span></span>"}
</nav>
<p class="note updated">Published: <time datetime="${p.date}">${fmt(p.date)}</time>. More in <a href="${c.slug}/">${esc(c.name)}</a> or <a href="./">all articles</a>.</p>`
  }));
});

// RSS feed
const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>MintWave Studio Blog</title><link>${SITE}blog/</link><description>Practical guides from the makers of Cable Calc, MultiTimer, Days Until, Daily Budget, Hatch Day, Sire &amp; Dam and Endly.</description><language>en</language>
${posts.map(p => `<item><title>${esc(p.title)}</title><link>${SITE}blog/${p.slug}.html</link><guid>${SITE}blog/${p.slug}.html</guid><pubDate>${new Date(p.date + "T08:00:00Z").toUTCString()}</pubDate><category>${esc(catBy[p.category].name)}</category><description>${esc(p.description)}</description></item>`).join("\n")}
</channel></rss>
`;
write("feed.xml", rss);

// llms.txt: keep the blog list between markers.
const llmsPath = path.join(dir, "llms.txt");
let llms = fs.readFileSync(llmsPath, "utf8");
const llmsBlock = `<!-- blog -->\n- [Blog](${SITE}blog/): practical guides for the MintWave tools and trackers (RSS: ${SITE}blog/feed.xml).\n${posts.map(p => `  - [${p.title}](${SITE}blog/${p.slug}.html): ${p.excerpt}`).join("\n")}\n<!-- /blog -->`;
llms = /<!-- blog -->[\s\S]*?<!-- \/blog -->/.test(llms) ? llms.replace(/<!-- blog -->[\s\S]*?<!-- \/blog -->/, llmsBlock) : llms.replace(/- \[Blog\]\([^\n]*\n/, llmsBlock + "\n");
fs.writeFileSync(llmsPath, llms);

// Sitemap: replace the region between the blog markers (or append once).
const urls = [["blog/", posts[0]?.date], ...cats.map(c => [`blog/${c.slug}/`, posts.find(p => p.category === c.slug)?.date ?? posts[0].date]), ...posts.map(p => [`blog/${p.slug}.html`, p.date])];
const block = `  <!-- blog -->\n${urls.map(([u, d]) => `  <url>\n    <loc>${SITE}${u}</loc>\n    <lastmod>${d}</lastmod>\n  </url>`).join("\n")}\n  <!-- /blog -->\n`;
const smPath = path.join(dir, "sitemap.xml");
let sm = fs.readFileSync(smPath, "utf8");
sm = /  <!-- blog -->[\s\S]*?<!-- \/blog -->\n/.test(sm) ? sm.replace(/  <!-- blog -->[\s\S]*?<!-- \/blog -->\n/, block) : sm.replace("</urlset>", block + "</urlset>");
fs.writeFileSync(smPath, sm);
console.log(`built ${posts.length} post(s), ${cats.length} categories`);
