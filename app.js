(() => {
  const root = document.querySelector("#site");

  const esc = s => String(s ?? "").replace(/[&<>"']/g, ch => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[ch]));

  const image = (name, className="", alt="") => `
    <img class="${className}" data-image="${esc(name)}" alt="${esc(alt)}" loading="lazy">
  `;

  function renderHeader(nav) {
    return `<header class="site-header">
      <a class="logo" href="#home" aria-label="MintWave Studio home">MintWave Studio</a>
      <button class="menu-toggle" aria-label="Open navigation" aria-expanded="false">☰</button>
      <nav class="site-nav" aria-label="Primary navigation">
        ${nav.map(([label,href]) => `<a href="${href}">${esc(label)}</a>`).join("")}
      </nav>
    </header>`;
  }

  function renderSection(s) {
    if (s.kind === "hero") return `
      <section id="home" class="hero">
        <div class="hero-copy">
          <h1>${esc(s.title)}</h1>
          <p>${esc(s.subtitle)}</p>
        </div>
        <div class="hero-visual">
          ${image(s.image,"hero-image","MintWave Studio")}
          <div class="device device-ipad">${image("ipad","","iPad mockup")}</div>
          <div class="device device-tablet">${image("tablet","","Tablet mockup")}</div>
          <div class="device device-phone">${image("phone","","Phone mockup")}</div>
          <div class="device device-phone-cart">${image("phoneCart","","Phone cart mockup")}</div>
        </div>
      </section>`;

    if (s.kind === "about") return `
      <section id="about" class="about section">
        <div class="section-heading"><span>${esc(s.eyebrow)}</span><h2>${esc(s.title)}</h2></div>
        <div class="section-copy">
          <h3>${esc(s.lead)}</h3><p>${esc(s.body)}</p>
          <h3 class="subhead">What We Build</h3>
          <ul>${s.list.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>
        </div>
      </section>`;

    if (s.kind === "features") return `
      <section id="features" class="features section">
        <div class="feature-art">${image(s.image,"feature-image","App Highlights")}</div>
        <div class="feature-copy">
          <span>${esc(s.eyebrow)}</span><h2>${esc(s.title)}</h2><h3>${esc(s.subtitle)}</h3>
          <div class="feature-list">${s.items.map((x,i)=>`
            <article><div class="num">0${i+1}</div><div><h4>${esc(x[0])}</h4><p>${esc(x[1])}</p></div></article>
          `).join("")}</div>
        </div>
      </section>`;

    if (s.kind === "standout") return `
      <section id="standout" class="standout section">
        <h2>${esc(s.title)}</h2>
        <div class="standout-grid">${s.items.map(x=>`
          <article class="stand-card">
            <div class="num">${esc(x[0])}</div><h3>${esc(x[1])}</h3><p>${esc(x[2])}</p>
            ${image(x[3],"stand-device","Mobile app")}
          </article>`).join("")}</div>
      </section>`;

    if (s.kind === "journey") return `
      <section id="journey" class="journey section">
        <div class="journey-art">${image(s.image,"journey-image","Our Journey")}</div>
        <div class="journey-copy"><span>${esc(s.eyebrow)}</span><h2>${esc(s.title)}</h2><h3>${esc(s.subtitle)}</h3><p>${esc(s.body)}</p></div>
      </section>`;

    return `
      <section id="contact" class="contact section">
        <div><h2>${esc(s.title)}</h2><div class="contact-details">
          <p><b>Tel:</b> +358 449193442</p><p><b>Email:</b> support@mintwavestudio.com</p>
          <p>Gauhar Zaheer Ahmed<br>Postipuuntie 10, A13, 02650, Espoo</p>
        </div></div>
        <form id="contact-form">
          <label>First Name*<input name="firstName" required></label>
          <label>Last Name*<input name="lastName" required></label>
          <label>Email*<input type="email" name="email" required></label>
          <label>Leave us a message<textarea name="message" rows="4"></textarea></label>
          <button type="submit">Submit</button><p class="form-status" aria-live="polite"></p>
        </form>
      </section>`;
  }

  function footer() {
    return `<footer class="footer"><div class="footer-top">
      <a class="logo" href="#home">MintWave Studio</a>
      <div class="footer-contact"><p>Tel: +358 449193442</p><p>Email: support@mintwavestudio.com</p><p>Gauhar Zaheer Ahmed<br>Postipuuntie 10, A13, 02650, Espoo</p></div>
      <div class="footer-links"><a href="privacy-policy.html">Privacy Policy</a><a href="terms-and-conditions.html">Terms &amp; Conditions</a></div>
    </div><div class="footer-bottom">© 2006 by MintWave Studio</div></footer>`;
  }

  async function load() {
    const response = await fetch("./content.json", {cache:"no-store"});
    if (!response.ok) throw new Error("Could not load content.json");
    const data = await response.json();

    root.innerHTML = renderHeader(data.navigation) +
      `<main>${data.sections.map(renderSection).join("")}</main>` + footer();

    // Image URLs come from image-manifest.json. Keeping them in a separate
    // manifest makes swapping to local downloaded assets a one-file change.
    const manifest = await fetch("./image-manifest.json", {cache:"no-store"}).then(r=>r.json());
    document.querySelectorAll("[data-image]").forEach(el => {
      const key = el.dataset.image;
      const src = manifest[key];
      if (src) {
        el.src = src;
        el.addEventListener("error", () => {
          el.classList.add("missing-image");
          el.alt = `${key} image — add the mapped file to assets/`;
        }, {once:true});
      }
    });

    const menu = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".site-nav");
    menu.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      menu.setAttribute("aria-expanded", open);
    });
    nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));

    document.querySelector("#contact-form").addEventListener("submit", e => {
      e.preventDefault();
      e.currentTarget.querySelector(".form-status").textContent =
        "Thanks. Connect this form to your preferred form endpoint to receive messages.";
    });
  }

  load().catch(err => {
    console.error(err);
    root.innerHTML = `<main class="error"><h1>MintWave Studio</h1><p>Unable to load the page content. Make sure index.html, app.js, content.json and image-manifest.json are deployed together.</p></main>`;
  });
})();