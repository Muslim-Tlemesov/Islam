/**
 * js/narrator.js
 * Заполняет шаблон narrator.html данными по ?id= из data/narrators.js.
 * Раздел «Связи» вычисляется автоматически: если два передатчика стоят
 * рядом в isnad какого-либо хадиса, значит один учился у другого.
 */

(function () {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const narrator = NARRATORS.find((n) => n.id === id);
  const root = document.getElementById("narrator-content");

  if (!narrator) {
    root.innerHTML = `<p class="narrator__bio--placeholder">Передатчик не найден. Вернитесь к <a href="narrators.html">списку передатчиков</a>.</p>`;
    return;
  }

  document.getElementById("page-title").textContent = `${narrator.name} — передатчик хадисов`;
  document.getElementById("page-description").setAttribute(
    "content",
    narrator.bio ? narrator.bio.slice(0, 155) : `Биография передатчика хадисов ${narrator.name}.`
  );

  function paragraphsToHtml(text) {
    return text
      .split(/\n\s*\n/)
      .map((p) => `<p>${p.trim()}</p>`)
      .join("");
  }

  const published = HADITHS.filter((h) => h.status === "published");
  const hadithsWithNarrator = published.filter((h) => h.isnad.some((l) => l.narratorId === narrator.id));

  // ---------- Связи: учился у / передавал ----------
  const studiedUnder = new Map();
  const taught = new Map();

  hadithsWithNarrator.forEach((h) => {
    const link = h.isnad.find((l) => l.narratorId === narrator.id);
    if (!link || link.chainLink === false) return; // персонаж внутри рассказа, а не звено иснада

    const chain = h.isnad.filter((l) => l.chainLink !== false);
    const idx = chain.findIndex((l) => l.narratorId === narrator.id);
    const next = chain[idx + 1]; // следующий в цепочке — тот, у кого учился
    const prev = chain[idx - 1]; // предыдущий — тот, кому передавал

    if (next) {
      const n = NARRATORS.find((x) => x.id === next.narratorId);
      if (n) studiedUnder.set(n.id, n);
    }
    if (prev) {
      const n = NARRATORS.find((x) => x.id === prev.narratorId);
      if (n) taught.set(n.id, n);
    }
  });

  // Ручные связи из биографии (для учителей/учеников, не встречающихся в иснаде на сайте)
  if (narrator.manualConnections) {
    (narrator.manualConnections.studiedUnder || []).forEach((id) => {
      const n = NARRATORS.find((x) => x.id === id);
      if (n) studiedUnder.set(n.id, n);
    });
    (narrator.manualConnections.taught || []).forEach((id) => {
      const n = NARRATORS.find((x) => x.id === id);
      if (n) taught.set(n.id, n);
    });
  }

  function connectionGroup(title, map) {
    if (!map.size) return "";
    const links = Array.from(map.values())
      .map((n) => `<a class="narrator__connection-link" href="narrator.html?id=${encodeURIComponent(n.id)}">${n.name}</a>`)
      .join("");
    return `
      <div>
        <p class="narrator__connection-group-title">${title}</p>
        <div class="narrator__connection-list">${links}</div>
      </div>`;
  }

  const connectionsMarkup = connectionGroup("Учился у", studiedUnder) + connectionGroup("Передавали от него", taught);

  root.innerHTML = `
    <h1 class="narrator__name">${narrator.name}</h1>
    <p class="narrator__name-ar" lang="ar">${narrator.nameArabic}</p>
    ${narrator.years ? `<p class="narrator__years">${narrator.years}</p>` : ""}

    <p class="narrator__section-title">Биография</p>
    ${
      narrator.bioArabic
        ? `<div class="narrator__bio-toggle" id="bio-toggle">
             <button class="narrator__bio-toggle-btn narrator__bio-toggle-btn--active" data-mode="ru" type="button">Русский</button>
             <button class="narrator__bio-toggle-btn" data-mode="ar" type="button">Арабский</button>
           </div>`
        : ""
    }
    <div class="narrator__bio ${narrator.bio ? "" : "narrator__bio--placeholder"}" id="bio-content">
      ${narrator.bio ? paragraphsToHtml(narrator.bio) : "<p>Биография будет добавлена позже.</p>"}
    </div>
    ${narrator.bioSource ? `<p class="narrator__bio-source">Источник: ${narrator.bioSource}</p>` : ""}

    ${
      narrator.notes && narrator.notes.length
        ? `<p class="narrator__section-title">Польза</p>
           <ol class="narrator__notes">
             ${narrator.notes.map((n) => `<li>${n}</li>`).join("")}
           </ol>`
        : ""
    }

    ${
      connectionsMarkup
        ? `<div><p class="narrator__section-title">Связи</p><div class="narrator__connections">${connectionsMarkup}</div></div>`
        : ""
    }

    <p class="narrator__section-title">Хадисы (${hadithsWithNarrator.length})</p>
    <div class="narrator__hadiths-list">
      ${
        hadithsWithNarrator.length
          ? hadithsWithNarrator
              .map(
                (h) => `<a class="narrator__hadith-item" href="hadith.html?id=${encodeURIComponent(h.id)}">
                  <span>Хадис №${h.number}</span>
                </a>`
              )
              .join("")
          : `<p class="narrator__bio--placeholder">Хадисов с этим передатчиком пока не опубликовано.</p>`
      }
    </div>
  `;

  const bioToggle = document.getElementById("bio-toggle");
  if (bioToggle) {
    bioToggle.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-mode]");
      if (!btn) return;
      bioToggle.querySelectorAll("button").forEach((b) => b.classList.remove("narrator__bio-toggle-btn--active"));
      btn.classList.add("narrator__bio-toggle-btn--active");
      const bioContentEl = document.getElementById("bio-content");
      if (btn.dataset.mode === "ar") {
        bioContentEl.className = "narrator__bio-arabic";
        bioContentEl.innerHTML = paragraphsToHtml(narrator.bioArabic);
        bioContentEl.setAttribute("lang", "ar");
        bioContentEl.setAttribute("dir", "rtl");
      } else {
        bioContentEl.className = `narrator__bio ${narrator.bio ? "" : "narrator__bio--placeholder"}`;
        bioContentEl.innerHTML = narrator.bio ? paragraphsToHtml(narrator.bio) : "<p>Биография будет добавлена позже.</p>";
        bioContentEl.removeAttribute("lang");
        bioContentEl.removeAttribute("dir");
      }
    });
  }
})();
