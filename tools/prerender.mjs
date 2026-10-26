// Bakes the home page into index.html so crawlers that don't run
// JavaScript (most AI search bots) see the full page.
//
//   node tools/prerender.mjs
//
// Run it after editing content.json, app.js or site-chrome.js.
// It renders with the same code the browser uses, fills the
// <!-- site --> and <!-- jsonld --> regions of index.html, and leaves
// everything else untouched.

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const SITE = "https://www.mintwavestudio.com/";
const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = f => fs.readFileSync(path.join(dir, f), "utf8");
// Cache-busting version, taken from index.html so llms.html matches it.
const VER = read("index.html").match(/styles\.css\?v=([\w]+)/)[1];

// Minimal browser stand-ins: enough for the render functions, and
// `#site` resolves to nothing so app.js doesn't try to load.
const window = {};
const context = vm.createContext({
  window,
  URL,
  location: { pathname: "/" },
  document: {
    currentScript: { src: SITE + "site-chrome.js" },
    readyState: "complete",
    querySelector: () => null,
    getElementById: () => null
  }
});
context.MintWaveChrome = undefined;
vm.runInContext(read("site-chrome.js"), context);
context.MintWaveChrome = window.MintWaveChrome;
vm.runInContext(read("app.js"), context);

const data = JSON.parse(read("content.json"));

const images = JSON.parse(read("image-manifest.json"));

const body = window.MintWaveHome
  .renderPage(data)
  // app.js sets these at runtime; bake them in for crawlers.
  .replace(/data-image="([^"]+)"/g, (m, key) =>
    images[key] ? `${m} src="${images[key]}"` : m)
  // site-chrome.js builds absolute links from its own URL; keep them relative.
  .replaceAll(`href="${SITE}`, 'href="')
  .replaceAll('href=""', 'href="./"')
  // Drop the template's blank-line padding.
  .split("\n")
  .map(l => l.trimEnd())
  .filter(l => l.trim() !== "")
  .join("\n");

const org = {
  "@type": "Organization",
  "@id": SITE + "#org",
  name: "MintWave Studio",
  url: SITE,
  logo: SITE + "assets/brand/logo-400.png",
  email: "support@mintwavestudio.com",
  description:
    "Independent studio making small, focused Android apps: offline calculators and trackers, a rhythm timing trainer, and quick puzzle, trivia and reflex games.",
  sameAs: ["https://play.google.com/store/apps/developer?id=MintWave+Studio"]
};

const graph = [
  org,
  {
    "@type": "WebSite",
    "@id": SITE + "#website",
    url: SITE,
    name: "MintWave Studio",
    publisher: { "@id": SITE + "#org" },
    inLanguage: "en"
  }
];

const faq = data.sections.find(s => s.kind === "faq");
if (faq) {
  graph.push({
    "@type": "FAQPage",
    "@id": SITE + "#faq",
    mainEntity: faq.items.map(([q, a]) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a }
    }))
  });
}

// "<" can't appear raw inside a script block.
const jsonld = JSON.stringify({ "@context": "https://schema.org", "@graph": graph })
  .replaceAll("<", "\\u003c");

const fill = (html, name, content) => {
  const re = new RegExp(`(<!-- ${name}:[^>]*-->)[\\s\\S]*?(<!-- /${name} -->)`);
  if (!re.test(html)) throw new Error(`index.html is missing the <!-- ${name} --> markers`);
  return html.replace(re, (_, open, close) => `${open}\n${content}\n  ${close}`);
};

let html = read("index.html");
html = fill(html, "jsonld", `  <script type="application/ld+json">${jsonld}</script>`);
html = fill(html, "site", `  <div id="site" data-prerendered>\n${body}\n  </div>`);
fs.writeFileSync(path.join(dir, "index.html"), html);

// faq-ai.txt: the home page FAQ in Q:/A: form.
if (faq) {
  fs.writeFileSync(
    path.join(dir, "faq-ai.txt"),
    "# MintWave Studio: frequently asked questions\n" +
    `# Source: ${SITE}#faq\n\n` +
    faq.items.map(([q, a]) => `Q: ${q}\nA: ${a}\n`).join("\n")
  );
}

// llms.html: an HTML copy of llms.txt for tools that prefer HTML.
const esc = s => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const inline = s => esc(s)
  .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
  .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2">$1</a>')
  .replace(/(^|[\s,(])(https?:\/\/[^\s,)<]+)/g, '$1<a href="$2">$2</a>');
const md = read("llms.txt").replace(/<!--[\s\S]*?-->\n?/g, "");
let out = [], list = false;
for (const line of md.split("\n")) {
  const li = line.startsWith("- ");
  if (list && !li) { out.push("</ul>"); list = false; }
  if (li && !list) { out.push("<ul>"); list = true; }
  if (li) out.push(`<li>${inline(line.slice(2))}</li>`);
  else if (line.startsWith("## ")) out.push(`<h2>${inline(line.slice(3))}</h2>`);
  else if (line.startsWith("# ")) out.push(`<h1>${inline(line.slice(2))}</h1>`);
  else if (line.startsWith("> ")) out.push(`<p class="lead">${inline(line.slice(2))}</p>`);
  else if (line.trim()) out.push(`<p>${inline(line)}</p>`);
}
if (list) out.push("</ul>");
fs.writeFileSync(path.join(dir, "llms.html"), `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>MintWave Studio for AI assistants (llms.txt)</title>
<meta name="description" content="Machine-readable index of MintWave Studio apps, free calculators and guides. HTML copy of llms.txt.">
<link rel="canonical" href="${SITE}llms.html">
<link rel="alternate" type="text/plain" href="${SITE}llms.txt">
<link rel="stylesheet" href="styles.css?v=${VER}">
<link rel="stylesheet" href="pages.css?v=${VER}">
</head>
<body>
<!-- Generated by tools/prerender.mjs from llms.txt. Don't edit by hand. -->
<main class="page narrow">
${out.join("\n")}
</main>
</body>
</html>
`);

const text = body.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
console.log(`index.html: ${text.length} chars of text, ${(body.match(/<h[1-3]\b/g) || []).length} headings`);
