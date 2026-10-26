# MintWave Studio — from-scratch GitHub Pages clone

The implementation is intentionally independent of Wix's page markup. It recreates the rendered section structure with plain HTML/CSS/JS and loads all sections from `content.json`.

## Dynamic architecture

- `content.json` — navigation and section data
- `image-manifest.json` — image URLs
- `app.js` — dynamically renders the page
- `styles.css` — responsive layout
- `assets/` — optional local image overrides

The current image manifest contains the exact Wix-hosted source images exposed by the live site.

### To make the clone self-contained

Download the eight images from the URLs in `image-manifest.json`, put them in `assets/`, and change the manifest values to relative paths such as `assets/hero.jpg`.

## GitHub Pages

Keep `index.html`, `app.js`, `content.json`, `image-manifest.json`, and `styles.css` together at the published root. Relative `./` paths are used so the site works after a repository rename.

## Form

The contact form is UI-complete but needs a form backend to actually deliver submissions.


## Static image mapping

See `IMAGE-MAPPING.md` or `image-download-map.json` for every source URL, exact local filename, and section usage. Once downloaded, all images are served from `assets/`; no Wix image request is required.

## Shared header and footer

`site-chrome.js` holds the navigation, header and footer for **every** page. Change the menu or footer there once.

- `index.html`: `app.js` calls `MintWaveChrome.header()` / `footer()`.
- Every other page: add `<div id="site-header"></div>` and `<div id="site-footer"></div>`, load
  `styles.css` + `pages.css` and `<script src="site-chrome.js" defer></script>` (use `../` from sub-folders).

## Content pages (static HTML, edit directly)

| Page | Purpose |
|---|---|
| `apps.html` | Apps hub: every app grouped by category (header "Apps" link) |
| `hatch-day.html`, `cable-calc.html`, `multitimer.html`, `days-until.html`, `daily-budget.html`, `rhythm-trainer.html`, `shadow-match.html`, `smart-quiz.html`, `zero-margin.html`, `steady-hand.html` | One page per app (assets in `assets/<app>/`) |
| `voltage-drop-calculator.html`, `daily-budget-calculator.html`, `days-until-calculator.html`, `stop-the-timer-game.html`, `odd-time-signatures.html` | Free web tools that link to Cable Calc, Daily Budget, Days Until, ZeroMargin and Rhythm Trainer |
| `llms.txt` | Plain-text site summary for AI crawlers; update it when an app is added |
| `hatch-date-calculator.html`, `pt/calculadora-chocadeira.html`, `de/brutrechner.html` | Hatch date calculator (EN/PT/DE), script `assets/hatch/hatch-calc.js` |
| `incubation-chart.html` | Printable chart for 11 species |
| `candling-guide.html`, `incubator-humidity-guide.html`, `quail-incubation.html` | Guides |
| `privacy-policy.html`, `terms-and-conditions.html` | Legal pages |
| `terms-of-use.html` | Redirect to Terms & Conditions (the apps' paywall links here) |

Species values in `hatch-calc.js` and the tables mirror `hatch_day/lib/domain/species.dart`; change both together.
Add new pages to `sitemap.xml`. Store links carry `utm_campaign` values so Play Console shows which page sent installs.

## Cache busting

GitHub Pages caches files for 10 minutes. Every page loads CSS/JS with a version tag (`styles.css?v=20261009b`).
**When you change any `.css` or `.js` file, bump the `?v=` value on every page** (search and replace the old date),
otherwise visitors can get a mix of old and new files for a while.

## App Store badges

Every app page has an App Store badge that is hidden until the iOS app is live:
`<a class="app-store-badge" href="#" hidden>`. When an iOS app is published, set that link's `href`
to the App Store URL and remove `hidden` (two places per app page: top and bottom), and add
`"iOS"` to `operatingSystem` in the page's JSON-LD. Adding a new app: also add it to `apps.html`,
the home section in `content.json`, `llms.txt` and `sitemap.xml`.

## Home page pre-rendering (AI/SEO crawlers)

`index.html` ships the fully rendered home page so crawlers that don't run JavaScript
(ChatGPT's OAI-SearchBot, Perplexity and others) can read it. After editing `content.json`,
`app.js`, `site-chrome.js`, `image-manifest.json` or `llms.txt`, run:

    node tools/prerender.mjs

It refreshes the page body and JSON-LD in `index.html`, and regenerates `faq-ai.txt`
(from the FAQ section) and `llms.html` (from `llms.txt`).

AI discovery files at the site root: `llms.txt`, `llms.html`, `llm.txt`, `ai.txt`, `ai.json`,
`brand.txt`, `identity.json`, `faq-ai.txt`, `robots-ai.txt`, `ecp.json` + `AgentWelcome.md`.
