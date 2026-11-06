// Pings IndexNow (Bing, Yandex and partners) with URLs from sitemap.xml.
//
//   node tools/indexnow.mjs            submit every sitemap URL
//   node tools/indexnow.mjs --since 2026-11-05   only URLs with lastmod >= date
//   node tools/indexnow.mjs --dry      print the URLs without sending
//
// Run after the site is deployed: the key file https://www.mintwavestudio.com/<key>.txt
// must be live, or IndexNow rejects the request.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HOST = "www.mintwavestudio.com";
const KEY = "7cb8a7fe4775c572b2cec1415bae9090";
const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const since = args.includes("--since") ? args[args.indexOf("--since") + 1] : "";

const sm = fs.readFileSync(path.join(dir, "sitemap.xml"), "utf8");
const urls = [...sm.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(m => ({
  loc: m[1].match(/<loc>([^<]+)/)[1],
  lastmod: (m[1].match(/<lastmod>([^<]+)/) || [])[1] || ""
})).filter(u => !since || u.lastmod >= since).map(u => u.loc);

console.log(`${urls.length} URL(s)`);
if (args.includes("--dry")) { console.log(urls.join("\n")); process.exit(0); }

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls })
});
console.log(res.status, res.statusText, await res.text());
