(() => {
  const root = document.querySelector("#site");

  const esc = s =>
    String(s ?? "").replace(/[&<>"']/g, ch => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[ch]));

  /*
   * Header, footer and mobile navigation come from site-chrome.js,
   * shared with every other page.
   */

  /*
   * Foreground images only.
   *
   * Background images such as:
   * - hero
   * - app-highlights
   * - journey
   *
   * are deliberately NOT rendered as <img> elements.
   */
  const image = (
    name,
    className = "",
    alt = ""
  ) => `
    <img
      class="${className}"
      data-image="${esc(name)}"
      alt="${esc(alt)}"
      loading="lazy"
      decoding="async"
      draggable="false"
    >
  `;


  /* ============================================================
     SECTION RENDERING
     ============================================================ */

  function renderSection(s) {

    /* ------------------------------------------------------------
       HERO
       ------------------------------------------------------------ */

    if (s.kind === "hero") {
      return `
        <section
          id="home"
          class="hero hero-background"
        >

<div class="hero-copy">

  <h1>
    ${esc(s.title)}
  </h1>

  <p>
    ${esc(s.subtitle)}
  </p>

  <a
    class="google-play-button"
    href="https://play.google.com/store/apps/developer?id=MintWave+Studio"
    aria-label="Get it on Google Play"
  >
    <img
      src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
      alt="Get it on Google Play"
      loading="eager"
      decoding="async"
    >
  </a>

</div>
          <!--
            IMPORTANT:
            All mockups live inside one bounded composition.
            CSS must constrain .hero-visual rather than allowing
            these images to participate in page width calculation.
          -->
          <div
            class="hero-visual"
            aria-label="MintWave Studio app mockups"
          >

            <div class="device device-ipad">
              ${image(
                "ipad",
                "hero-device-image",
                "iPad mockup"
              )}
            </div>

            <div class="device device-tablet">
              ${image(
                "tablet",
                "hero-device-image",
                "Tablet mockup"
              )}
            </div>

            <div class="device device-phone">
              ${image(
                "phone",
                "hero-device-image",
                "Phone mockup"
              )}
            </div>

            <div class="device device-phone-cart">
              ${image(
                "phoneCart",
                "hero-device-image",
                "Phone cart mockup"
              )}
            </div>

          </div>

        </section>
      `;
    }


    /* ------------------------------------------------------------
       ABOUT
       ------------------------------------------------------------ */

    if (s.kind === "about") {
      return `
        <section
          id="about"
          class="about section"
        >

          <div class="section-heading">

            <span>
              ${esc(s.eyebrow)}
            </span>

            <h2>
              ${esc(s.title)}
            </h2>

          </div>

          <div class="section-copy">

            <h3>
              ${esc(s.lead)}
            </h3>

            <p>
              ${esc(s.body)}
            </p>

            <h3 class="subhead">
              What We Build
            </h3>

            <ul>
              ${(Array.isArray(s.list) ? s.list : [])
                .map(x => `
                  <li>
                    ${esc(x)}
                  </li>
                `)
                .join("")}
            </ul>

          </div>

        </section>
      `;
    }


    /* ------------------------------------------------------------
       APP HIGHLIGHTS
       ------------------------------------------------------------ */

    if (s.kind === "features") {
      return `
        <section
          id="features"
          class="features section app-highlights-background"
        >

          <div
            class="feature-art"
            aria-hidden="true"
          ></div>

          <div class="feature-copy app-highlights-content">

            <span>
              ${esc(s.eyebrow)}
            </span>

            <h2>
              ${esc(s.title)}
            </h2>

            <h3>
              ${esc(s.subtitle)}
            </h3>

            <div class="feature-list">

              ${(Array.isArray(s.items) ? s.items : [])
                .map((x, i) => `
                  <article>

                    <div class="num">
                      0${i + 1}
                    </div>

                    <div>

                      <h4>
                        ${esc(x[0])}
                      </h4>

                      <p>
                        ${esc(x[1])}
                      </p>

                    </div>

                  </article>
                `)
                .join("")}

            </div>

          </div>

        </section>
      `;
    }


    /* ------------------------------------------------------------
       HOW OUR APPS STAND OUT
       ------------------------------------------------------------ */

    if (s.kind === "standout") {
      return `
        <section
          id="standout"
          class="standout standout-white section"
        >

          <h2>
            ${esc(s.title)}
          </h2>

          <div class="standout-grid">

            ${(Array.isArray(s.items) ? s.items : [])
              .map(x => `
                <article class="stand-card">

                  <div class="num">
                    ${esc(x[0])}
                  </div>

                  <h3>
                    ${esc(x[1])}
                  </h3>

                  <p>
                    ${esc(x[2])}
                  </p>

                  <div class="stand-device-wrap">
                    ${image(
                      x[3],
                      "stand-device rounded-image",
                      "Mobile app"
                    )}
                  </div>

                </article>
              `)
              .join("")}

          </div>

        </section>
      `;
    }


    /* ------------------------------------------------------------
       JOURNEY
       ------------------------------------------------------------ */

    if (s.kind === "journey") {
      return `
        <section
          id="journey"
          class="journey section journey-background"
        >

          <div
            class="journey-art"
            aria-hidden="true"
          ></div>

          <div class="journey-copy">

            <span>
              ${esc(s.eyebrow)}
            </span>

            <h2>
              ${esc(s.title)}
            </h2>

            <h3>
              ${esc(s.subtitle)}
            </h3>

            <p>
              ${esc(s.body)}
            </p>

          </div>

        </section>
      `;
    }


    /* ------------------------------------------------------------
       OUR APPS (cards link to each app page; full list on apps.html)
       ------------------------------------------------------------ */

    if (s.kind === "apps") {
      return `
        <section
          id="apps"
          class="apps section"
        >

          <div class="section-heading">
            <span>${esc(s.eyebrow)}</span>
            <h2>${esc(s.title)}</h2>
            <p class="apps-intro">${esc(s.subtitle)}</p>
          </div>

          <div class="apps-grid">
            ${(Array.isArray(s.items) ? s.items : [])
              .map(([name, sub, icon, link]) => `
                <a class="apps-card" href="${esc(link)}">
                  <img src="${esc(icon)}" alt="" width="56" height="56" loading="lazy">
                  <span>
                    <strong>${esc(name)}</strong>
                    <small>${esc(sub)}</small>
                  </span>
                </a>
              `)
              .join("")}
          </div>

          <a class="apps-all" href="apps.html">${esc(s.cta)}</a>

        </section>
      `;
    }


    /* ------------------------------------------------------------
       FAQ (answer-style headings, mirrored as FAQPage JSON-LD by
       tools/prerender.mjs)
       ------------------------------------------------------------ */

    if (s.kind === "faq") {
      return `
        <section
          id="faq"
          class="faq section"
          aria-labelledby="faq-title"
        >

          <div class="section-heading">
            <span>${esc(s.eyebrow)}</span>
            <h2 id="faq-title">${esc(s.title)}</h2>
          </div>

          <div class="faq-list">
            ${(Array.isArray(s.items) ? s.items : [])
              .map(([q, a]) => `
                <article class="faq-item">
                  <h3>${esc(q)}</h3>
                  <p>${esc(a)}</p>
                </article>
              `)
              .join("")}
          </div>

        </section>
      `;
    }


    /* ------------------------------------------------------------
       CONTACT
       ------------------------------------------------------------ */

    return `
      <section
        id="contact"
        class="contact section"
      >

        <div class="contact-copy">

          <h2>
            ${esc(s.title)}
          </h2>

        </div>

        <div class="contact-details">

          <p>${esc(s.body)}</p>

          <p>
            <a class="contact-email" href="mailto:${esc(s.email)}">${esc(s.email)}</a>
          </p>

          <p>
            <a href="about.html">About MintWave Studio</a> ·
            <a href="https://play.google.com/store/apps/developer?id=MintWave+Studio">Google Play developer page</a>
          </p>

        </div>

      </section>
    `;
  }


  /* ============================================================
     IMAGE LOADING
     ============================================================ */

  async function loadImages() {

    const manifestResponse = await fetch(
      "./image-manifest.json",
      {
        cache: "no-store"
      }
    );

    if (!manifestResponse.ok) {
      throw new Error(
        "Could not load image-manifest.json"
      );
    }

    const manifest =
      await manifestResponse.json();

    document
      .querySelectorAll("[data-image]")
      .forEach(el => {

        const key =
          el.dataset.image;

        const src =
          manifest[key];

        if (!src) {
          el.classList.add("missing-image");

          el.alt =
            `${key} image — add the mapped file to assets/`;

          return;
        }

        /*
         * Explicitly prevent image loading from creating
         * a width larger than its CSS container.
         */
        el.setAttribute(
          "draggable",
          "false"
        );

        el.src = src;

        el.addEventListener(
          "load",
          () => {
            el.classList.add("image-loaded");
          },
          {
            once: true
          }
        );

        el.addEventListener(
          "error",
          () => {

            el.classList.add(
              "missing-image"
            );

            el.alt =
              `${key} image — add the mapped file to assets/`;

          },
          {
            once: true
          }
        );

      });
  }


  /* ============================================================
     LOAD APPLICATION
     ============================================================ */

  function renderPage(data) {
    return `
      <div class="site-content">

        ${MintWaveChrome.header()}

        <main class="site-main">
          ${
            Array.isArray(data.sections)
              ? data.sections
                  .map(renderSection)
                  .join("")
              : ""
          }
        </main>

        ${MintWaveChrome.footer()}

      </div>
    `;
  }

  /* Used by tools/prerender.mjs to bake the page into index.html. */
  window.MintWaveHome = { renderPage };

  if (!root) {
    return;
  }

  async function load() {

    /*
     * index.html ships pre-rendered HTML (tools/prerender.mjs) so
     * crawlers that don't run JavaScript still see the page. In that
     * case only images and navigation need wiring up.
     */
    if (!root.hasAttribute("data-prerendered")) {

      const response = await fetch(
        "./content.json",
        {
          cache: "no-store"
        }
      );

      if (!response.ok) {
        throw new Error(
          "Could not load content.json"
        );
      }

      root.innerHTML =
        renderPage(await response.json());
    }


    /*
     * Load foreground images only.
     */
    await loadImages();


    /*
     * Initialize interactive components.
     */
    MintWaveChrome.setupNavigation();


    /*
     * Defensive runtime diagnostic.
     *
     * This does NOT alter the layout.
     * It reports the elements that are actually wider
     * than the viewport, which makes future debugging
     * much easier.
     */
    requestAnimationFrame(() => {

      const viewportWidth =
        document.documentElement.clientWidth;

      const overflowing = [];

      document
        .querySelectorAll(
          "#site *"
        )
        .forEach(el => {

          const rect =
            el.getBoundingClientRect();

          if (
            rect.right > viewportWidth + 1 ||
            rect.left < -1
          ) {
            overflowing.push({
              element: el,
              left: Math.round(rect.left),
              right: Math.round(rect.right),
              width: Math.round(rect.width)
            });
          }

        });

      if (overflowing.length) {
        console.warn(
          "MintWave horizontal overflow candidates:",
          overflowing
        );
      }

    });
  }


  /* ============================================================
     START
     ============================================================ */

  load().catch(err => {

    console.error(err);

    /* Keep the pre-rendered page if only images failed to load. */
    if (root.hasAttribute("data-prerendered")) {
      return;
    }

    root.innerHTML = `
      <main class="error">

        <h1>
          MintWave Studio
        </h1>

        <p>
          Unable to load the page content.
          Make sure index.html, app.js,
          content.json and image-manifest.json
          are deployed together.
        </p>

      </main>
    `;

  });

})();
