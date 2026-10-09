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

        <form
          id="contact-form"
          class="contact-form"
        >

          <label>
            First Name*
            <input
              name="firstName"
              autocomplete="given-name"
              required
            >
          </label>

          <label>
            Last Name*
            <input
              name="lastName"
              autocomplete="family-name"
              required
            >
          </label>

          <label>
            Email*
            <input
              type="email"
              name="email"
              autocomplete="email"
              required
            >
          </label>

          <label>
            Leave us a message
            <textarea
              name="message"
              rows="4"
            ></textarea>
          </label>

          <button type="submit">
            Submit
          </button>

          <p
            class="form-status"
            aria-live="polite"
          ></p>

        </form>

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
     CONTACT FORM
     ============================================================ */

  function setupContactForm() {

    const form =
      document.querySelector(
        "#contact-form"
      );

    if (!form) {
      return;
    }

    form.addEventListener(
      "submit",
      e => {

        e.preventDefault();

        const status =
          form.querySelector(
            ".form-status"
          );

        if (status) {
          status.textContent =
            "Thanks. Connect this form to your preferred form endpoint to receive messages.";
        }

      }
    );
  }


  /* ============================================================
     LOAD APPLICATION
     ============================================================ */

  async function load() {

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

    const data =
      await response.json();


    /*
     * Add an explicit application wrapper.
     *
     * This gives CSS a reliable containment boundary.
     */
    root.innerHTML = `
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


    /*
     * Load foreground images only.
     */
    await loadImages();


    /*
     * Initialize interactive components.
     */
    MintWaveChrome.setupNavigation();
    setupContactForm();


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
