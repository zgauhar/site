/*
 * Shared header and footer for every page on the site.
 *
 * - index.html: app.js calls MintWaveChrome.header() / footer().
 * - Every other page: include this script with `defer`. It fills
 *   <div id="site-header"></div> and <div id="site-footer"></div>.
 *
 * Links are resolved against the folder this script lives in, so pages
 * in sub-folders (pt/, de/) work without changes.
 */
(() => {
  const script = document.currentScript;
  const root = script ? new URL("./", script.src).href : "./";

  const NAV = [
    ["Home", "#home"],
    ["About Us", "#about"],
    ["Features", "#features"],
    ["Our Journey", "#journey"],
    ["Hatch Day", "hatch-day.html"],
    ["Contact", "#contact"]
  ];

  const FOOTER_LINKS = [
    ["Hatch Day app", "hatch-day.html"],
    ["Hatch date calculator", "hatch-date-calculator.html"],
    ["Incubation chart", "incubation-chart.html"],
    ["Privacy Policy", "privacy-policy.html"],
    ["Terms & Conditions", "terms-and-conditions.html"]
  ];

  const esc = s =>
    String(s ?? "").replace(/[&<>"']/g, ch => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[ch]));

  const rootPath = new URL(root).pathname;
  const onHome =
    location.pathname === rootPath ||
    location.pathname === rootPath + "index.html";

  /* "#about" stays in-page on the home page and points home elsewhere. */
  const href = link =>
    link.startsWith("#")
      ? (onHome ? link : root + link)
      : root + link;

  function header() {
    return `
      <header class="site-header">
        <a class="logo" href="${esc(href("#home"))}" aria-label="MintWave Studio home">
          MintWave Studio
        </a>
        <button class="menu-toggle" type="button" aria-label="Open navigation" aria-expanded="false">
          ☰
        </button>
        <nav class="site-nav" aria-label="Primary navigation">
          ${NAV.map(([label, link]) => `
            <a href="${esc(href(link))}">${esc(label)}</a>
          `).join("")}
        </nav>
      </header>
    `;
  }

  function footer() {
    return `
      <footer class="footer">
        <div class="footer-top">
          <a class="logo" href="${esc(href("#home"))}">
            MintWave Studio
          </a>
          <div class="footer-contact">
            <p>Tel: +358 449193442</p>
            <p>Email: support@mintwavestudio.com</p>
            <p>
              Gauhar Zaheer Ahmed<br>
              Postipuuntie 10, A13, 02650, Espoo
            </p>
          </div>
          <div class="footer-links">
            ${FOOTER_LINKS.map(([label, link]) => `
              <a href="${esc(href(link))}">${esc(label)}</a>
            `).join("")}
          </div>
        </div>
        <div class="footer-bottom">
          © 2026 by MintWave Studio
        </div>
      </footer>
    `;
  }

  function setupNavigation() {
    const menu = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".site-nav");
    if (!menu || !nav) return;

    const close = () => {
      nav.classList.remove("open");
      menu.setAttribute("aria-expanded", "false");
      menu.setAttribute("aria-label", "Open navigation");
    };

    menu.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      menu.setAttribute("aria-expanded", String(open));
      menu.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    });

    nav.querySelectorAll("a").forEach(a => a.addEventListener("click", close));
  }

  /* Standalone pages: fill the placeholders. */
  function mount() {
    const h = document.getElementById("site-header");
    const f = document.getElementById("site-footer");
    if (h) h.outerHTML = header();
    if (f) f.outerHTML = footer();
    if (h) setupNavigation();
  }

  window.MintWaveChrome = { header, footer, setupNavigation };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
