/* Cable Calc web tools: voltage drop and cable size calculators.
 * Same method as the Cable Calc app (lib/calc/*.dart): IEC 60364-5-52 Annex B capacities,
 * Table B.52.14 / B.52.17 correction factors, Annex G voltage drop.
 * Page text comes from <script type="application/json" id="calc-i18n"> so one file serves every language.
 * Also loads in Node (module.exports) so the page generator can compute worked examples. */
(function () {
  "use strict";

  const SIZES = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120];
  const RHO = 0.0225; // copper in service, 1.25 x rho20, ohm mm2/m
  const LAMBDA = 0.08e-3; // reactance, ohm/m
  const METHODS = ["A1", "A2", "B1", "B2", "C", "E"];
  // Rows per size, columns A1, A2, B1, B2, C, E (Tables B.52.4 and B.52.5, 30 °C air)
  const TABLES = {
    pvc2: [
      [15.5, 15.5, 17.5, 16.5, 19.5, 22], [19.5, 18.5, 24, 23, 27, 30], [26, 25, 32, 30, 36, 40],
      [34, 32, 41, 38, 46, 51], [46, 43, 57, 52, 63, 70], [61, 57, 76, 69, 85, 94],
      [80, 75, 101, 90, 112, 119], [99, 92, 125, 111, 138, 148], [119, 110, 151, 133, 168, 180],
      [151, 139, 192, 168, 213, 232], [182, 167, 232, 201, 258, 282], [210, 192, 269, 232, 299, 328],
    ],
    pvc3: [
      [13.5, 13, 15.5, 15, 17.5, 18.5], [18, 17.5, 21, 20, 24, 25], [24, 23, 28, 27, 32, 34],
      [31, 29, 36, 34, 41, 43], [42, 39, 50, 46, 57, 60], [56, 52, 68, 62, 76, 80],
      [73, 68, 89, 80, 96, 101], [89, 83, 110, 99, 119, 126], [108, 99, 134, 118, 144, 153],
      [136, 125, 171, 149, 184, 196], [164, 150, 207, 179, 223, 238], [188, 172, 239, 206, 259, 276],
    ],
    xlpe2: [
      [19, 18.5, 23, 22, 24, 26], [26, 25, 31, 30, 33, 36], [35, 33, 42, 40, 45, 49],
      [45, 42, 54, 51, 58, 63], [61, 57, 75, 69, 80, 86], [81, 76, 100, 91, 107, 115],
      [106, 99, 133, 119, 138, 149], [131, 121, 164, 146, 171, 185], [158, 145, 198, 175, 209, 225],
      [200, 183, 253, 221, 269, 289], [241, 220, 306, 265, 328, 352], [278, 253, 354, 305, 382, 410],
    ],
    xlpe3: [
      [17, 16.5, 20, 19.5, 22, 23], [23, 22, 28, 26, 30, 32], [31, 30, 37, 35, 40, 42],
      [40, 38, 48, 44, 52, 54], [54, 51, 66, 60, 71, 75], [73, 68, 88, 80, 96, 100],
      [95, 89, 117, 105, 119, 127], [117, 109, 144, 128, 147, 158], [141, 130, 175, 154, 179, 192],
      [179, 164, 222, 194, 229, 246], [216, 197, 269, 233, 278, 298], [249, 227, 312, 268, 322, 346],
    ],
  };
  const TEMPS = [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70];
  const TEMP_F = {
    pvc: [1.22, 1.17, 1.12, 1.06, 1.0, 0.94, 0.87, 0.79, 0.71, 0.61, 0.5, 0, 0],
    xlpe: [1.15, 1.12, 1.08, 1.04, 1.0, 0.96, 0.91, 0.87, 0.82, 0.76, 0.71, 0.65, 0.58],
  };
  const GROUP_N = [1, 2, 3, 4, 5, 6, 7, 8, 9, 12, 16, 20];
  const GROUP_F = [1.0, 0.8, 0.7, 0.65, 0.6, 0.57, 0.54, 0.52, 0.5, 0.45, 0.41, 0.38];
  const BREAKERS = [6, 10, 13, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200, 250];

  // sys: "1" single-phase, "3" three-phase (line-to-line voltage), "dc"
  function dropVolts(sys, i, l, s, pf) {
    const b = sys === "3" ? 1 : 2;
    const cos = sys === "dc" ? 1 : Math.min(Math.max(pf, 0), 1);
    const sin = sys === "dc" ? 0 : Math.sqrt(1 - cos * cos);
    return b * (RHO * l / s * cos + LAMBDA * l * sin) * i;
  }
  const refVoltage = (sys, u) => (sys === "3" ? u / Math.sqrt(3) : u);
  const dropPct = (sys, i, l, s, pf, u) => dropVolts(sys, i, l, s, pf) / refVoltage(sys, u) * 100;

  function currentFromKw(sys, kw, u, pf) {
    const w = kw * 1000;
    if (sys === "3") return w / (Math.sqrt(3) * u * pf);
    if (sys === "dc") return w / u;
    return w / (u * pf);
  }

  function ampacity(size, method, ins, loaded) {
    return TABLES[ins + (loaded === 3 ? "3" : "2")][SIZES.indexOf(size)][METHODS.indexOf(method)];
  }

  // Rounded up to the next tabulated temperature (conservative), null when out of range
  function tempFactor(t, ins) {
    if (t < -30) return null;
    const idx = TEMPS.findIndex(x => x >= t);
    if (idx < 0) return null;
    const f = TEMP_F[ins][idx];
    return f > 0 ? f : null;
  }

  function groupFactor(n) {
    if (n < 1) return null;
    const idx = GROUP_N.findIndex(x => x >= n);
    return idx < 0 ? null : GROUP_F[idx];
  }

  const breakerFor = i => BREAKERS.find(r => r >= i - 1e-9) ?? null;

  /* Same steps as CableSizing.size in the app:
   * 1. In = smallest standard breaker >= Ib
   * 2. smallest size with Iz = Iz0 x ka x kg >= In
   * 3. smallest size with drop <= limit
   * Recommendation = the larger of 2 and 3. */
  function sizeCable(p) {
    const { sys, u, ib, pf, l, ins, method, ambient, grouped, limit } = p;
    if (!(ib > 0 && u > 0 && l > 0 && limit > 0 && (sys === "dc" || (pf > 0 && pf <= 1)))) return { error: "invalid" };
    const kt = tempFactor(ambient, ins);
    if (kt == null) return { error: "temp" };
    const kg = groupFactor(grouped);
    if (kg == null) return { error: "group" };
    const inA = breakerFor(ib);
    if (inA == null) return { error: "large" };
    const loaded = sys === "3" ? 3 : 2;
    const corrected = s => ampacity(s, method, ins, loaded) * kt * kg;
    const pct = s => dropPct(sys, ib, l, s, pf, u);
    const byCap = SIZES.find(s => corrected(s) >= inA);
    const byDrop = SIZES.find(s => pct(s) <= limit + 1e-9);
    if (byCap == null || byDrop == null) return { error: "large", breaker: inA };
    const size = Math.max(byCap, byDrop);
    return {
      size, byCap, byDrop, breaker: inA, ib, kt, kg,
      iz0: ampacity(size, method, ins, loaded),
      iz: corrected(size),
      dropPct: pct(size),
      dropV: dropVolts(sys, ib, l, size, pf),
    };
  }

  const api = { SIZES, METHODS, BREAKERS, dropVolts, dropPct, refVoltage, currentFromKw, ampacity, tempFactor, groupFactor, breakerFor, sizeCable };
  if (typeof module !== "undefined" && module.exports) { module.exports = api; return; }

  // ---------- browser ----------
  const lang = document.documentElement.lang || "en";
  let T = {};
  try { T = JSON.parse(document.getElementById("calc-i18n").textContent); } catch (e) { /* English fallbacks below */ }
  const t = (k, vars, fallback) => String(T[k] ?? fallback ?? k).replace(/\{(\w+)\}/g, (_, n) => vars?.[n] ?? "");
  const fmt = (x, d) => x.toLocaleString(lang, { minimumFractionDigits: d, maximumFractionDigits: d });
  const pctText = (x, d) => t("pct", { n: fmt(x, d) }, "{n} %");
  const mm2 = s => fmt(s, s % 1 ? 1 : 0) + " mm²";

  function numReader(f) {
    return n => parseFloat(String(f.elements[n].value).replace(",", "."));
  }

  // Swap 230 <-> 400 V when the system changes, unless the user typed something else
  function voltageSwap(f, num) {
    let last = f.elements.sys.value;
    return () => {
      const sys = f.elements.sys.value;
      if (sys !== last) {
        if (sys === "3" && num("u") === 230) f.elements.u.value = 400;
        if (sys !== "3" && num("u") === 400) f.elements.u.value = 230;
        last = sys;
      }
      f.elements.pf.disabled = sys === "dc";
      return sys;
    };
  }

  function initVd(f) {
    const $ = id => f.querySelector("[data-out=" + id + "]");
    const num = numReader(f);
    const sysOf = voltageSwap(f, num);
    function update() {
      const sys = sysOf();
      const u = num("u"), i = num("i"), l = num("l"), s = num("s"), pf = num("pf"), lim = num("lim");
      if (!(u > 0 && i >= 0 && l >= 0 && s > 0 && (sys === "dc" || pf > 0) && lim > 0)) {
        $("pct").textContent = "–";
        $("sub").textContent = t("invalid", null, "Enter positive numbers in every field.");
        ["v", "load", "min"].forEach(id => ($(id).textContent = "–"));
        return;
      }
      const v = dropVolts(sys, i, l, s, pf);
      const pct = v / refVoltage(sys, u) * 100;
      const atLoad = sys === "3" ? u * (1 - pct / 100) : u - v;
      const ok = pct <= lim + 1e-9;
      const min = SIZES.find(x => dropPct(sys, i, l, x, pf, u) <= lim + 1e-9);
      $("pct").textContent = pctText(pct, 2);
      $("sub").textContent = t(ok ? "within" : "over", { lim: pctText(lim, 1), s: mm2(s), l: fmt(l, 0) },
        ok ? "✓ Within the {lim} limit for {s} over {l} m." : "✗ Over the {lim} limit for {s} over {l} m.");
      $("v").textContent = fmt(v, 2) + " V";
      $("load").textContent = fmt(atLoad, 1) + " V";
      $("min").textContent = min ? mm2(min) : "> 120 mm²";
    }
    f.addEventListener("input", update);
    f.addEventListener("change", update);
    f.addEventListener("submit", ev => ev.preventDefault());
    update();
  }

  function initSize(f) {
    const $ = id => f.querySelector("[data-out=" + id + "]");
    const num = numReader(f);
    const sysOf = voltageSwap(f, num);
    function clear(msg) {
      $("size").textContent = "–";
      $("sub").textContent = msg;
      ["breaker", "iz", "drop", "rule"].forEach(id => ($(id).textContent = "–"));
    }
    function update() {
      const sys = sysOf();
      const u = num("u"), load = num("load"), pf = sys === "dc" ? 1 : num("pf");
      const ib = f.elements.unit.value === "kw" ? currentFromKw(sys, load, u, pf) : load;
      const r = sizeCable({
        sys, u, ib, pf, l: num("l"), ins: f.elements.ins.value, method: f.elements.method.value,
        ambient: num("amb"), grouped: Math.round(num("grp")), limit: num("lim"),
      });
      if (r.error) {
        const msgs = {
          invalid: t("invalid", null, "Enter positive numbers in every field."),
          temp: t("errTemp", null, "This insulation can't be used at that ambient temperature."),
          group: t("errGroup", null, "Grouping tables stop at 20 circuits."),
          large: t("errLarge", null, "Beyond 120 mm² or a 250 A breaker: use parallel cables or a detailed design."),
        };
        clear(msgs[r.error]);
        return;
      }
      $("size").textContent = mm2(r.size);
      $("sub").textContent = t("sub", { ib: fmt(r.ib, 1), inA: r.breaker, kt: fmt(r.kt, 2), kg: fmt(r.kg, 2) },
        "Ib = {ib} A · ka = {kt} · kg = {kg}");
      $("breaker").textContent = r.breaker + " A";
      $("iz").textContent = fmt(r.iz, 1) + " A";
      $("drop").textContent = pctText(r.dropPct, 2) + " · " + fmt(r.dropV, 1) + " V";
      $("rule").textContent = r.byDrop > r.byCap
        ? t("ruleDrop", { cap: mm2(r.byCap) }, "Voltage drop (capacity alone: {cap})")
        : t("ruleCap", null, "Current capacity");
    }
    f.addEventListener("input", update);
    f.addEventListener("change", update);
    f.addEventListener("submit", ev => ev.preventDefault());
    update();
  }

  document.querySelectorAll("form[data-calc=vd]").forEach(initVd);
  document.querySelectorAll("form[data-calc=size]").forEach(initSize);
})();
