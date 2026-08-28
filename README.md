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
