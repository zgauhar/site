/*
 * Hatch date calculator.
 *
 * Species data mirrors the Hatch Day app (hatch_day/lib/domain/species.dart):
 * forced-air targets, day 0 = the day the eggs go in.
 *
 * Mount: <div id="hatch-calc"></div> on a page whose <html lang> is en, pt or de.
 */
(() => {
  const SPECIES = [
    { id: "chicken", days: 21, lockdown: 18, candle: [7, 14], temp: 37.5, rhSet: [45, 50], rhLock: [65, 70] },
    { id: "duck", days: 28, lockdown: 25, candle: [7, 14, 21], temp: 37.5, rhSet: [50, 55], rhLock: [65, 75], cool: 10 },
    { id: "muscovy", days: 35, lockdown: 32, candle: [7, 14, 21, 28], temp: 37.5, rhSet: [50, 55], rhLock: [65, 75], cool: 10 },
    { id: "goose", days: 30, lockdown: 27, candle: [7, 14, 21], temp: 37.4, rhSet: [50, 55], rhLock: [70, 75], cool: 10 },
    { id: "turkey", days: 28, lockdown: 25, candle: [7, 14, 21], temp: 37.5, rhSet: [50, 55], rhLock: [65, 70] },
    { id: "quail", days: 17, lockdown: 14, candle: [7], temp: 37.5, rhSet: [45, 50], rhLock: [65, 70] },
    { id: "bobwhite", days: 23, lockdown: 20, candle: [7, 14], temp: 37.5, rhSet: [45, 50], rhLock: [65, 70] },
    { id: "guinea", days: 27, lockdown: 24, candle: [7, 14, 21], temp: 37.5, rhSet: [45, 55], rhLock: [65, 70] },
    { id: "pheasant", days: 24, lockdown: 21, candle: [7, 14], temp: 37.5, rhSet: [45, 50], rhLock: [65, 70] },
    { id: "partridge", days: 23, lockdown: 20, candle: [7, 14], temp: 37.5, rhSet: [45, 50], rhLock: [65, 70] },
    { id: "peafowl", days: 28, lockdown: 25, candle: [7, 14, 21], temp: 37.5, rhSet: [50, 55], rhLock: [65, 70] }
  ];

  /* Days after hatch day that still count as the hatch window (same as the app). */
  const GRACE = 2;

  const T = {
    en: {
      locale: "en-US",
      species: {
        chicken: "Chicken", duck: "Duck", muscovy: "Muscovy duck", goose: "Goose",
        turkey: "Turkey", quail: "Coturnix quail", bobwhite: "Bobwhite quail",
        guinea: "Guinea fowl", pheasant: "Pheasant", partridge: "Partridge (chukar)", peafowl: "Peafowl"
      },
      modeSet: "I set my eggs on", modeDue: "I want chicks on",
      fSpecies: "Species", fSetDate: "Date the eggs went in", fDueDate: "Date you want chicks", fUnits: "Units",
      hatchDay: "Hatch day", setOn: "Set your eggs on",
      daysWord: n => (n === 1 ? "1 day" : `${n} days`),
      summary: (sp, n) => `${sp}: ${n} days of incubation.`,
      today: (d, n) => `Today is day ${d} of ${n}.`,
      future: n => `The eggs go in ${n === 1 ? "tomorrow" : `in ${n} days`}.`,
      hatching: d => `Hatching now (day ${d}). Most chicks hatch within 48 hours of the first pip.`,
      past: "This hatch window has passed. Candle unhatched eggs before you discard them.",
      tTemp: "Temperature (forced air)", tStill: "Still air (top of eggs)",
      tRhSet: l => `Humidity, day 0–${l - 1}`, tRhLock: l => `Humidity from day ${l}`,
      day: d => `Day ${d}`,
      setT: "Set the eggs", setS: "Let them warm up slowly. Start turning today.",
      turnT: "Turn 3–5 times a day", turnS: "Always an odd number, so the egg rests on alternating sides overnight. Automatic turners do this for you.",
      candleT: "Candle the eggs", candle1S: "Look for veins and a dark spot. Remove clear (infertile) eggs and eggs with a blood ring.",
      candleNS: "Remove eggs that have stopped developing. The air cell should be growing.",
      coolT: "Start daily cooling and misting", coolS: "Once a day until lockdown: cool the eggs for 10–15 minutes and mist them with lukewarm water.",
      lockT: "Lockdown: stop turning", lockS: (a, b) => `Raise humidity to ${a}–${b} % and keep the lid shut until the hatch is over.`,
      hatchT: "Hatch day", hatchS: "Leave the chicks in until they are dry and fluffy.",
      endT: "End of the hatch window", endS: "Most viable eggs have hatched by now.",
      ics: "Add to calendar", print: "Print", copy: "Copy link", copied: "Link copied.",
      icsDone: "Calendar file downloaded. Open it to add the dates.",
      calPrefix: sp => `${sp} hatch: `
    },
    pt: {
      locale: "pt-BR",
      species: {
        chicken: "Galinha", duck: "Pato", muscovy: "Pato-do-mato", goose: "Ganso",
        turkey: "Peru", quail: "Codorna japonesa", bobwhite: "Codorna bobwhite",
        guinea: "Galinha-d'angola", pheasant: "Faisão", partridge: "Perdiz (chukar)", peafowl: "Pavão"
      },
      modeSet: "Coloquei os ovos em", modeDue: "Quero pintinhos em",
      fSpecies: "Espécie", fSetDate: "Data em que os ovos entraram", fDueDate: "Data em que quer os pintinhos", fUnits: "Unidade",
      hatchDay: "Dia do nascimento", setOn: "Coloque os ovos em",
      daysWord: n => (n === 1 ? "1 dia" : `${n} dias`),
      summary: (sp, n) => `${sp}: ${n} dias de incubação.`,
      today: (d, n) => `Hoje é o dia ${d} de ${n}.`,
      future: n => `Os ovos entram ${n === 1 ? "amanhã" : `daqui a ${n} dias`}.`,
      hatching: d => `Nascendo agora (dia ${d}). A maioria dos pintinhos nasce até 48 horas depois da primeira bicada.`,
      past: "A janela de nascimento já passou. Faça a ovoscopia dos ovos que não nasceram antes de descartá-los.",
      tTemp: "Temperatura (com ventilador)", tStill: "Sem ventilador (topo dos ovos)",
      tRhSet: l => `Umidade, dia 0–${l - 1}`, tRhLock: l => `Umidade a partir do dia ${l}`,
      day: d => `Dia ${d}`,
      setT: "Colocar os ovos", setS: "Deixe-os aquecer devagar. A viragem começa hoje.",
      turnT: "Virar 3 a 5 vezes por dia", turnS: "Sempre um número ímpar, para o ovo descansar em lados alternados à noite. A viragem automática faz isso por você.",
      candleT: "Ovoscopia", candle1S: "Procure vasos e um ponto escuro. Retire ovos claros (inférteis) e ovos com anel de sangue.",
      candleNS: "Retire os ovos que pararam de se desenvolver. A câmara de ar deve estar crescendo.",
      coolT: "Começar a resfriar e borrifar", coolS: "Uma vez por dia até o travamento: resfrie os ovos por 10–15 minutos e borrife com água morna.",
      lockT: "Travamento: parar de virar", lockS: (a, b) => `Aumente a umidade para ${a}–${b} % e não abra a tampa até o fim do nascimento.`,
      hatchT: "Dia do nascimento", hatchS: "Deixe os pintinhos dentro até secarem e ficarem fofos.",
      endT: "Fim da janela de nascimento", endS: "A maioria dos ovos viáveis já nasceu.",
      ics: "Adicionar à agenda", print: "Imprimir", copy: "Copiar link", copied: "Link copiado.",
      icsDone: "Arquivo de agenda baixado. Abra-o para adicionar as datas.",
      calPrefix: sp => `Chocagem ${sp}: `
    },
    de: {
      locale: "de-DE",
      species: {
        chicken: "Huhn", duck: "Ente", muscovy: "Warzenente", goose: "Gans",
        turkey: "Pute", quail: "Japanwachtel", bobwhite: "Virginiawachtel",
        guinea: "Perlhuhn", pheasant: "Fasan", partridge: "Rebhuhn (Chukar)", peafowl: "Pfau"
      },
      modeSet: "Eier eingelegt am", modeDue: "Küken gewünscht am",
      fSpecies: "Art", fSetDate: "Tag des Einlegens", fDueDate: "Gewünschter Schlupftag", fUnits: "Einheit",
      hatchDay: "Schlupftag", setOn: "Eier einlegen am",
      daysWord: n => (n === 1 ? "1 Tag" : `${n} Tage`),
      summary: (sp, n) => `${sp}: ${n} Bruttage.`,
      today: (d, n) => `Heute ist Bruttag ${d} von ${n}.`,
      future: n => `Die Eier kommen ${n === 1 ? "morgen" : `in ${n} Tagen`} in den Brüter.`,
      hatching: d => `Schlupf läuft (Tag ${d}). Die meisten Küken schlüpfen innerhalb von 48 Stunden nach dem ersten Anpicken.`,
      past: "Das Schlupffenster ist vorbei. Nicht geschlüpfte Eier vor dem Entsorgen schieren.",
      tTemp: "Temperatur (Motorbrüter)", tStill: "Flächenbrüter (Eioberseite)",
      tRhSet: l => `Luftfeuchte, Tag 0–${l - 1}`, tRhLock: l => `Luftfeuchte ab Tag ${l}`,
      day: d => `Tag ${d}`,
      setT: "Eier einlegen", setS: "Langsam anwärmen lassen. Ab heute wenden.",
      turnT: "3–5-mal täglich wenden", turnS: "Immer eine ungerade Anzahl, damit das Ei nachts abwechselnd auf beiden Seiten liegt. Wendeautomaten übernehmen das.",
      candleT: "Schieren", candle1S: "Achte auf Adern und einen dunklen Punkt. Klare (unbefruchtete) Eier und Eier mit Blutring entfernen.",
      candleNS: "Eier entfernen, die sich nicht weiterentwickelt haben. Die Luftblase sollte wachsen.",
      coolT: "Tägliches Kühlen und Besprühen beginnt", coolS: "Einmal täglich bis zur Schlupfruhe: Eier 10–15 Minuten abkühlen lassen und mit lauwarmem Wasser besprühen.",
      lockT: "Schlupfruhe: nicht mehr wenden", lockS: (a, b) => `Luftfeuchte auf ${a}–${b} % erhöhen und den Deckel bis zum Ende des Schlupfs geschlossen lassen.`,
      hatchT: "Schlupftag", hatchS: "Küken im Brüter lassen, bis sie trocken und flauschig sind.",
      endT: "Ende des Schlupffensters", endS: "Die meisten lebensfähigen Eier sind jetzt geschlüpft.",
      ics: "In Kalender eintragen", print: "Drucken", copy: "Link kopieren", copied: "Link kopiert.",
      icsDone: "Kalenderdatei heruntergeladen. Öffne sie, um die Termine einzutragen.",
      calPrefix: sp => `Brut ${sp}: `
    }
  };

  const host = document.getElementById("hatch-calc");
  if (!host) return;

  const lang = (document.documentElement.lang || "en").slice(0, 2);
  const t = T[lang] || T.en;
  const useF = t === T.en && /^en-US/i.test(navigator.language || "");

  /* ---------- dates: whole calendar days in UTC, so DST never shifts a day ---------- */

  const DAY = 86400000;
  const todayUtc = () => {
    const n = new Date();
    return Date.UTC(n.getFullYear(), n.getMonth(), n.getDate());
  };
  const parse = v => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v || "");
    return m ? Date.UTC(+m[1], +m[2] - 1, +m[3]) : null;
  };
  const iso = ms => new Date(ms).toISOString().slice(0, 10);
  const fmt = new Intl.DateTimeFormat(t.locale, {
    weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC"
  });
  const fmtLong = new Intl.DateTimeFormat(t.locale, {
    weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC"
  });
  const show = ms => fmt.format(new Date(ms));

  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private mode */ } }
  };

  /* ---------- form ---------- */

  const params = new URLSearchParams(location.search);
  const initialSpecies = params.get("species") || store.get("hatchcalc.species") || host.dataset.species || "chicken";
  const initialMode = params.get("mode") === "due" ? "due" : "set";
  const initialDate = parse(params.get("date")) != null ? params.get("date") : iso(todayUtc());

  host.classList.add("calc");
  host.innerHTML = `
    <div class="calc-mode" role="radiogroup">
      <label><input type="radio" name="mode" value="set"><span>${esc(t.modeSet)}</span></label>
      <label><input type="radio" name="mode" value="due"><span>${esc(t.modeDue)}</span></label>
    </div>
    <div class="calc-fields">
      <label class="field">${esc(t.fSpecies)}
        <select name="species">
          ${SPECIES.map(s => `<option value="${s.id}">${esc(t.species[s.id])} (${esc(t.daysWord(s.days))})</option>`).join("")}
        </select>
      </label>
      <label class="field"><span data-date-label></span>
        <input type="date" name="date" required>
      </label>
      <label class="field">${esc(t.fUnits)}
        <select name="units">
          <option value="c">°C</option>
          <option value="f">°F</option>
        </select>
      </label>
    </div>
    <div class="calc-result" aria-live="polite"></div>
  `;

  const $ = sel => host.querySelector(sel);
  const speciesSel = $('select[name="species"]');
  const dateIn = $('input[name="date"]');
  const unitsSel = $('select[name="units"]');
  const out = $(".calc-result");

  speciesSel.value = SPECIES.some(s => s.id === initialSpecies) ? initialSpecies : "chicken";
  host.querySelector(`input[name="mode"][value="${initialMode}"]`).checked = true;
  dateIn.value = initialDate;
  unitsSel.value = store.get("hatchcalc.units") || (useF ? "f" : "c");

  const num1 = new Intl.NumberFormat(t.locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const temp = c => (unitsSel.value === "f" ? `${num1.format(c * 9 / 5 + 32)} °F` : `${num1.format(c)} °C`);

  /* ---------- schedule ---------- */

  function schedule(sp, setMs) {
    const at = d => setMs + d * DAY;
    const rows = [{ day: 0, title: t.setT, sub: t.setS }];
    rows.push({ day: 1, to: sp.lockdown - 1, title: t.turnT, sub: t.turnS, range: true });
    sp.candle.forEach((d, i) => rows.push({ day: d, title: t.candleT, sub: i === 0 ? t.candle1S : t.candleNS }));
    if (sp.cool) rows.push({ day: sp.cool, title: t.coolT, sub: t.coolS });
    rows.push({ day: sp.lockdown, title: t.lockT, sub: t.lockS(sp.rhLock[0], sp.rhLock[1]) });
    rows.push({ day: sp.days, title: t.hatchT, sub: t.hatchS, key: true });
    rows.push({ day: sp.days + GRACE, title: t.endT, sub: t.endS });
    rows.sort((a, b) => a.day - b.day || (a.range ? 1 : 0) - (b.range ? 1 : 0));
    return rows.map(r => ({ ...r, ms: at(r.day), endMs: r.range ? at(r.to) : null }));
  }

  let current = null;

  function render() {
    const sp = SPECIES.find(s => s.id === speciesSel.value) || SPECIES[0];
    const mode = host.querySelector('input[name="mode"]:checked').value;
    $("[data-date-label]").textContent = mode === "set" ? t.fSetDate : t.fDueDate;

    const picked = parse(dateIn.value);
    if (picked == null) {
      out.innerHTML = "";
      return;
    }

    const setMs = mode === "set" ? picked : picked - sp.days * DAY;
    const hatchMs = setMs + sp.days * DAY;
    const now = todayUtc();
    const dayNow = Math.round((now - setMs) / DAY);
    const rows = schedule(sp, setMs);
    current = { sp, rows };

    let status;
    if (dayNow < 0) status = t.future(-dayNow);
    else if (dayNow < sp.days) status = t.today(dayNow, sp.days);
    else if (dayNow <= sp.days + GRACE) status = t.hatching(dayNow);
    else status = t.past;

    const pct = Math.max(0, Math.min(100, (dayNow / sp.days) * 100));
    const heroLabel = mode === "set" ? t.hatchDay : t.setOn;
    const heroMs = mode === "set" ? hatchMs : setMs;

    out.innerHTML = `
      <div class="result-hero">
        <span class="label">${esc(heroLabel)}</span>
        <span class="date">${esc(fmtLong.format(new Date(heroMs)))}</span>
      </div>
      <p class="result-sub">${esc(t.summary(t.species[sp.id], sp.days))} ${esc(status)}</p>
      <div class="progress" aria-hidden="true"><div style="width:${pct.toFixed(1)}%"></div></div>

      <div class="targets">
        <div class="target"><div class="k">${esc(t.tTemp)}</div><div class="v">${esc(temp(sp.temp))}</div>
          <div class="k">${esc(t.tStill)}: ${esc(temp(sp.temp + 1))}</div></div>
        <div class="target"><div class="k">${esc(t.tRhSet(sp.lockdown))}</div><div class="v">${sp.rhSet[0]}–${sp.rhSet[1]} %</div></div>
        <div class="target"><div class="k">${esc(t.tRhLock(sp.lockdown))}</div><div class="v">${sp.rhLock[0]}–${sp.rhLock[1]} %</div></div>
      </div>

      <ol class="timeline">
        ${rows.map(r => {
          const last = r.range ? r.to : r.day;
          const cls = last < dayNow ? "past" : (r.day <= dayNow && dayNow <= last ? "today" : "");
          const dayTxt = r.range ? `${r.day}–${r.to}` : String(r.day);
          const when = r.range ? `${show(r.ms)} – ${show(r.endMs)}` : show(r.ms);
          return `
            <li class="${cls}">
              <span class="day">${esc(t.day(dayTxt))}</span>
              <span class="what">${esc(r.title)}<small>${esc(r.sub)}</small></span>
              <span class="when">${esc(when)}</span>
            </li>`;
        }).join("")}
      </ol>

      <div class="calc-actions">
        <button class="btn" type="button" data-act="ics">${esc(t.ics)}</button>
        <button class="btn ghost" type="button" data-act="print">${esc(t.print)}</button>
        <button class="btn ghost" type="button" data-act="copy">${esc(t.copy)}</button>
      </div>
      <p class="calc-status" role="status"></p>
    `;

    const q = new URLSearchParams({ species: sp.id, date: dateIn.value });
    if (mode === "due") q.set("mode", "due");
    try { history.replaceState(null, "", `${location.pathname}?${q}`); } catch (e) { /* file:// */ }
    store.set("hatchcalc.species", sp.id);
    store.set("hatchcalc.units", unitsSel.value);
  }

  /* ---------- calendar file ---------- */

  function icsFile() {
    const { sp, rows } = current;
    const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");
    const d = ms => iso(ms).replace(/-/g, "");
    const clean = s => s.replace(/[\\;,]/g, m => "\\" + m).replace(/\n/g, "\\n");
    const prefix = t.calPrefix(t.species[sp.id]);
    const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//MintWave Studio//Hatch date calculator//EN", "CALSCALE:GREGORIAN"];
    /* One event per milestone; the daily turning period would only clutter the calendar. */
    rows.forEach((r, i) => {
      if (r.range) return;
      const end = r.ms + DAY;
      lines.push(
        "BEGIN:VEVENT",
        `UID:${d(rows[0].ms)}-${sp.id}-${i}@mintwavestudio.com`,
        `DTSTAMP:${stamp}`,
        `DTSTART;VALUE=DATE:${d(r.ms)}`,
        `DTEND;VALUE=DATE:${d(end)}`,
        `SUMMARY:${clean(prefix + r.title + " (" + t.day(r.day) + ")")}`,
        `DESCRIPTION:${clean(r.sub)}`,
        "TRANSP:TRANSPARENT",
        "END:VEVENT"
      );
    });
    lines.push("END:VCALENDAR");
    return lines.join("\r\n") + "\r\n";
  }

  host.addEventListener("click", e => {
    const act = e.target.closest("[data-act]")?.dataset.act;
    if (!act || !current) return;
    const status = $(".calc-status");

    if (act === "print") window.print();

    if (act === "ics") {
      const blob = new Blob([icsFile()], { type: "text/calendar" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `hatch-${current.sp.id}-${iso(current.rows[0].ms)}.ics`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      status.textContent = t.icsDone;
    }

    if (act === "copy") {
      const done = () => { status.textContent = t.copied; };
      if (navigator.clipboard) navigator.clipboard.writeText(location.href).then(done, () => {});
    }
  });

  host.addEventListener("change", render);
  host.addEventListener("input", e => { if (e.target === dateIn) render(); });
  render();
})();
