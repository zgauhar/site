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
| `hatch-day.html` | Hatch Day app page |
| `hatch-date-calculator.html`, `pt/calculadora-chocadeira.html`, `de/brutrechner.html` | Hatch date calculator (EN/PT/DE), script `assets/hatch/hatch-calc.js` |
| `incubation-chart.html` | Printable chart for 11 species |
| `candling-guide.html`, `incubator-humidity-guide.html`, `quail-incubation.html` | Guides |
| `privacy-policy.html`, `terms-and-conditions.html` | Legal pages |
| `terms-of-use.html` | Redirect to Terms & Conditions (the apps' paywall links here) |

Species values in `hatch-calc.js` and the tables mirror `hatch_day/lib/domain/species.dart`; change both together.
Add new pages to `sitemap.xml`. Store links carry `utm_campaign` values so Play Console shows which page sent installs.
