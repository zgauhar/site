```javascript
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
     HEADER
     ============================================================ */

  function renderHeader(nav = []) {
    return `
      <header class="site-header">

        <a
          class="logo"
          href="#home"
          aria-label="MintWave Studio home"
        >
          MintWave Studio
        </a>

        <button
          class="menu-toggle"
          type="button"
          aria-label="Open navigation"
          aria-expanded="false"
        >
          ☰
        </button>

        <nav
          class="site-nav"
          aria-label="Primary navigation"
        >
          ${nav.map(([label, href]) => `
            <a href="${esc(href)}">
              ${esc(label)}
            </a>
          `).join("")}
        </nav>

      </header>
    `;
  }


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

          <div class="contact-details">

            <p>
              <b>Tel:</b>
              +358 449193442
            </p>

            <p>
              <b>Email:</b>
              support@mintwavestudio.com
            </p>

            <p>
              Gauhar Zaheer Ahmed<br>
              Postipuuntie 10, A13, 02650, Espoo
            </p>

          </div>

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
     FOOTER
     ============================================================ */

  function footer() {
    return `
      <footer class="footer">

        <div class="footer-top">

          <a
            class="logo"
            href="#home"
          >
            MintWave Studio
          </a>

          <div class="footer-contact">

            <p>
              Tel: +358 449193442
            </p>

            <p>
              Email: support@mintwavestudio.com
            </p>

            <p>
              Gauhar Zaheer Ahmed<br>
              Postipuuntie 10, A13, 02650, Espoo
            </p>

          </div>

          <div class="footer-links">

            <a href="privacy-policy.html">
              Privacy Policy
            </a>

            <a href="terms-and-conditions.html">
              Terms &amp; Conditions
            </a>

          </div>

        </div>

        <div class="footer-bottom">
          © 2006 by MintWave Studio
        </div>

      </footer>
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
     MOBILE NAVIGATION
     ============================================================ */

  function setupNavigation() {

    const menu =
      document.querySelector(
        ".menu-toggle"
      );

    const nav =
      document.querySelector(
        ".site-nav"
      );

    if (!menu || !nav) {
      return;
    }

    menu.addEventListener(
      "click",
      () => {

        const open =
          nav.classList.toggle(
            "open"
          );

        menu.setAttribute(
          "aria-expanded",
          String(open)
        );

        menu.setAttribute(
          "aria-label",
          open
            ? "Close navigation"
            : "Open navigation"
        );

      }
    );

    nav
      .querySelectorAll("a")
      .forEach(a => {

        a.addEventListener(
          "click",
          () => {

            nav.classList.remove(
              "open"
            );

            menu.setAttribute(
              "aria-expanded",
              "false"
            );

            menu.setAttribute(
              "aria-label",
              "Open navigation"
            );

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

        ${renderHeader(
          Array.isArray(data.navigation)
            ? data.navigation
            : []
        )}

        <main class="site-main">
          ${
            Array.isArray(data.sections)
              ? data.sections
                  .map(renderSection)
                  .join("")
              : ""
          }
        </main>

        ${footer()}

      </div>
    `;


    /*
     * Load foreground images only.
     */
    await loadImages();


    /*
     * Initialize interactive components.
     */
    setupNavigation();
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
```
