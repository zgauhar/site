(() => {
  const root = document.querySelector("#site");

  const esc = s => String(s ?? "").replace(/[&<>"']/g, ch => ({
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
   * are deliberately NOT rendered as <img> elements.
   */
const image = (name, className = "", alt = "") => `
  <img
    class="${className}"
    data-image="${esc(name)}"
    alt="${esc(alt)}"
    loading="lazy"
    decoding="async"
    draggable="false"
  >
`;

  function renderHeader(nav) {
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
            <a href="${href}">
              ${esc(label)}
            </a>
          `).join("")}
        </nav>

      </header>
    `;
  }

  function renderSection(s) {

    /*
     * ============================================================
     * HERO
     * ============================================================
     *
     * The hero image is a CSS background.
     * It is NOT rendered as an <img>.
     *
     * The background therefore stretches across the complete
     * hero section while the device mockups remain foreground
     * images.
     */
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

          <div class="hero-visual">

            <div class="device device-ipad">
              ${image(
                "ipad",
                "",
                "iPad mockup"
              )}
            </div>

            <div class="device device-tablet">
              ${image(
                "tablet",
                "",
                "Tablet mockup"
              )}
            </div>

            <div class="device device-phone">
              ${image(
                "phone",
                "",
                "Phone mockup"
              )}
            </div>

            <div class="device device-phone-cart">
              ${image(
                "phoneCart",
                "",
                "Phone cart mockup"
              )}
            </div>

          </div>

        </section>
      `;
    }

    /*
     * ============================================================
     * ABOUT
     * ============================================================
     */
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
              ${s.list.map(x => `
                <li>
                  ${esc(x)}
                </li>
              `).join("")}
            </ul>

          </div>

        </section>
      `;
    }

    /*
     * ============================================================
     * FEATURES / APP HIGHLIGHTS
     * ============================================================
     *
     * app-highlights.jpg is now a CSS background.
     *
     * It is deliberately NOT rendered using:
     *
     *     <img src="app-highlights.jpg">
     *
     * Instead, the section receives:
     *
     *     app-highlights-background
     *
     * and styles.css supplies the background image.
     *
     * The text receives:
     *
     *     app-highlights-content
     *
     * so its color can be #f2f5ef.
     */
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

              ${s.items.map((x, i) => `
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
              `).join("")}

            </div>

          </div>

        </section>
      `;
    }

    /*
     * ============================================================
     * HOW OUR APPS STAND OUT
     * ============================================================
     *
     * This section gets a dedicated class:
     *
     *     standout-white
     *
     * so it can have:
     *
     * - white background
     * - black text
     * - rounded image corners
     *
     * The phone mockups remain <img> elements because they are
     * foreground/device images rather than the section background.
     */
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

            ${s.items.map(x => `
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

                ${image(
                  x[3],
                  "stand-device rounded-image",
                  "Mobile app"
                )}

              </article>
            `).join("")}

          </div>

        </section>
      `;
    }

    /*
     * ============================================================
     * OUR JOURNEY
     * ============================================================
     *
     * The hero image remains a CSS background here.
     */
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

    /*
     * ============================================================
     * CONTACT
     * ============================================================
     */
    return `
      <section
        id="contact"
        class="contact section"
      >

        <div>

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

        <form id="contact-form">

          <label>
            First Name*
            <input
              name="firstName"
              required
            >
          </label>

          <label>
            Last Name*
            <input
              name="lastName"
              required
            >
          </label>

          <label>
            Email*
            <input
              type="email"
              name="email"
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

  async function load() {

    /*
     * Load the dynamically generated section data.
     */
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
     * Render the complete page.
     */
    root.innerHTML =
      renderHeader(data.navigation) +
      `
        <main>
          ${data.sections
            .map(renderSection)
            .join("")}
        </main>
      ` +
      footer();

    /*
     * ============================================================
     * STATIC FOREGROUND IMAGE LOADING
     * ============================================================
     *
     * Only foreground images are loaded here.
     *
     * Background images:
     *   hero
     *   app-highlights
     *
     * are handled entirely by CSS.
     */
    const manifestResponse =
      await fetch(
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
          return;
        }

        el.src = src;

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

    /*
     * ============================================================
     * MOBILE NAVIGATION
     * ============================================================
     */
    const menu =
      document.querySelector(
        ".menu-toggle"
      );

    const nav =
      document.querySelector(
        ".site-nav"
      );

    menu.addEventListener(
      "click",
      () => {

        const open =
          nav.classList.toggle(
            "open"
          );

        menu.setAttribute(
          "aria-expanded",
          open
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
          }
        );

      });

    /*
     * ============================================================
     * CONTACT FORM
     * ============================================================
     */
    document
      .querySelector(
        "#contact-form"
      )
      .addEventListener(
        "submit",
        e => {

          e.preventDefault();

          e.currentTarget
            .querySelector(
              ".form-status"
            )
            .textContent =
              "Thanks. Connect this form to your preferred form endpoint to receive messages.";

        }
      );
  }

  /*
   * Start the dynamically loaded application.
   */
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
