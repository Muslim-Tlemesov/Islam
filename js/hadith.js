/**
 * js/hadith.js
 * Заполняет общий шаблон hadith.html данными конкретного хадиса
 * (найденного по ?id= в data/hadiths.js). Один файл обслуживает
 * любое количество хадисов — при добавлении новой записи в данные
 * ничего в этом файле менять не нужно.
 */

(function () {
  const FAVORITES_KEY = "islamic-site:favorites";

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const hadith = HADITHS.find((h) => h.id === id);

  const root = document.getElementById("hadith-content");
  const breadcrumbsEl = document.getElementById("breadcrumbs");

  if (!hadith) {
    root.innerHTML = `
      <p class="hadith__translation--placeholder">
        Хадис не найден. Проверьте ссылку или вернитесь к
        <a href="hadiths.html">списку хадисов</a>.
      </p>`;
    return;
  }

  const book = STRUCTURE.find((b) => b.id === hadith.bookId);
  const section = book && book.sections.find((s) => s.id === hadith.sectionId);
  const chapter = section && section.chapters.find((c) => c.id === hadith.chapterId);

  // ---------- Заголовок и meta-описание страницы (для шэринга/SEO) ----------
  const pageTitle = `Хадис №${hadith.number} — ${chapter ? chapter.title : "Муватта имама Малика"}`;
  document.getElementById("page-title").textContent = pageTitle;
  document.getElementById("page-description").setAttribute(
    "content",
    hadith.translation
      ? hadith.translation.slice(0, 155)
      : `Хадис №${hadith.number} из сборника «Муватта имама Малика» с иснадом и разъяснением.`
  );

  // ---------- Хлебные крошки ----------
  breadcrumbsEl.innerHTML = "";
  const crumbs = [{ label: "Главная", href: "index.html" }];
  if (book) crumbs.push({ label: book.title, href: "hadiths.html" });
  if (section) crumbs.push({ label: section.title, href: `hadiths.html?section=${section.id}` });
  if (chapter) crumbs.push({ label: chapter.title, href: `hadiths.html?section=${section.id}&chapter=${chapter.id}` });
  crumbs.push({ label: `Хадис №${hadith.number}` });

  crumbs.forEach((c, i) => {
    if (i > 0) breadcrumbsEl.appendChild(document.createTextNode("›"));
    if (c.href) {
      const a = document.createElement("a");
      a.href = c.href;
      a.textContent = c.label;
      breadcrumbsEl.appendChild(a);
    } else {
      const span = document.createElement("span");
      span.textContent = c.label;
      breadcrumbsEl.appendChild(span);
    }
  });

  // ---------- Избранное (localStorage) ----------
  function getFavorites() {
    try {
      return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
    } catch (e) {
      return [];
    }
  }
  function isFavorite() {
    return getFavorites().includes(hadith.id);
  }
  function toggleFavorite() {
    const favs = getFavorites();
    const idx = favs.indexOf(hadith.id);
    if (idx === -1) favs.push(hadith.id);
    else favs.splice(idx, 1);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
  }

  // ---------- Иснад: генерация SVG-цепочки ----------
  function buildIsnadSvg(isnad) {
    const boxHeight = 44;
    const gap = 34;
    const padX = 14;
    const charWidth = 6.8;
    let x = 10;
    const nodes = [];

    isnad.forEach((link) => {
      const narrator = NARRATORS.find((n) => n.id === link.narratorId);
      const label = narrator ? narrator.name : link.narratorId;
      const width = Math.max(96, Math.round(label.length * charWidth) + padX * 2);
      nodes.push({ x, width, label, id: link.narratorId });
      x += width + gap;
    });

    const totalWidth = x - gap + 10;
    const svgHeight = boxHeight + 30;
    const centerY = 10 + boxHeight / 2;

    let linksMarkup = "";
    for (let i = 0; i < nodes.length - 1; i++) {
      const from = nodes[i].x + nodes[i].width;
      const to = nodes[i + 1].x;
      linksMarkup += `<line class="hadith__isnad-link" x1="${from}" y1="${centerY}" x2="${to}" y2="${centerY}" marker-end="url(#isnad-arrow)"/>`;
    }

    const nodesMarkup = nodes
      .map(
        (n) => `
      <a class="hadith__isnad-node" href="narrator.html?id=${encodeURIComponent(n.id)}">
        <rect x="${n.x}" y="10" width="${n.width}" height="${boxHeight}" rx="3"></rect>
        <text x="${n.x + n.width / 2}" y="${centerY + 4}" text-anchor="middle">${n.label}</text>
      </a>`
      )
      .join("");

    return `
      <svg class="hadith__isnad-svg" viewBox="0 0 ${totalWidth} ${svgHeight}" width="${totalWidth}" height="${svgHeight}" role="img" aria-label="Цепочка передатчиков хадиса">
        <defs>
          <marker id="isnad-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="var(--color-sage)"></path>
          </marker>
        </defs>
        ${linksMarkup}
        ${nodesMarkup}
      </svg>`;
  }

  // ---------- Пред/след хадис внутри главы ----------
  function buildPrevNext() {
    if (!chapter) return "";
    const idsInChapter = chapter.hadithIds;
    const pos = idsInChapter.indexOf(hadith.id);
    const prevId = pos > 0 ? idsInChapter[pos - 1] : null;
    const nextId = pos < idsInChapter.length - 1 ? idsInChapter[pos + 1] : null;

    function navLink(hid, label, modifier) {
      if (!hid) return `<span class="hadith__nav-link hadith__nav-link--disabled"></span>`;
      const h = HADITHS.find((x) => x.id === hid);
      return `
        <a class="hadith__nav-link hadith__nav-link--${modifier}" href="hadith.html?id=${encodeURIComponent(hid)}">
          <span class="hadith__nav-link-label">${label}</span>
          <span>Хадис №${h ? h.number : "?"}</span>
        </a>`;
    }

    return `
      <nav class="hadith__nav" aria-label="Навигация по хадисам главы">
        ${navLink(prevId, "Предыдущий", "prev")}
        ${navLink(nextId, "Следующий", "next")}
      </nav>`;
  }

  // ---------- Разъяснение: короткое/подробное ----------
  const hasExplanation = hadith.explanation && (hadith.explanation.short || hadith.explanation.detailed);

  function paragraphsToHtml(text) {
    return text
      .split(/\n\s*\n/)
      .map((p) => `<p>${p.trim()}</p>`)
      .join("");
  }

  function explanationHtml(text) {
    const sourceHtml = hadith.explanation.source
      ? `<p class="hadith__explanation-source">${hadith.explanation.source}</p>`
      : "";
    return sourceHtml + paragraphsToHtml(text);
  }

  // ---------- Место ----------
  const places = (hadith.places || []).map((pid) => PLACES.find((p) => p.id === pid)).filter(Boolean);

  // ---------- Сборка разметки ----------
  root.innerHTML = `
    <div class="hadith__eyebrow-row">
      <span class="hadith__number">Хадис №${hadith.number}</span>
      <div class="hadith__actions">
        <button class="hadith__action hadith__action--favorite" id="favorite-btn" type="button"></button>
        <button class="hadith__action" id="copy-link-btn" type="button">Копировать ссылку</button>
        <button class="hadith__action" id="print-btn" type="button">Печать</button>
      </div>
    </div>

    <blockquote class="hadith__arabic" lang="ar" dir="rtl">${hadith.arabic}</blockquote>

    <p class="hadith__transliteration ${hadith.transliteration ? "" : "hadith__transliteration--placeholder"}">
      ${hadith.transliteration || "Транслитерация появится позже."}
    </p>

    <div>
      <p class="hadith__section-title">Перевод</p>
      <p class="hadith__translation ${hadith.translation ? "" : "hadith__translation--placeholder"}">
        ${hadith.translation || "Перевод этого хадиса ещё не добавлен — он появится здесь."}
      </p>
    </div>

    <div class="hadith__meta">
      <div class="hadith__meta-item">
        <span class="hadith__meta-label">Источник</span>
        <span class="hadith__meta-value">${hadith.source.collection}${hadith.source.reference ? ", " + hadith.source.reference : ""}</span>
      </div>
      <div class="hadith__meta-item">
        <span class="hadith__meta-label">Степень достоверности</span>
        <span class="hadith__grade ${hadith.grade ? "" : "hadith__grade--unset"}">${hadith.grade || "не указана"}</span>
      </div>
      ${
        hadith.variants && hadith.variants.length
          ? `<div class="hadith__meta-item">
               <span class="hadith__meta-label">Также встречается в</span>
               <span class="hadith__meta-value">${hadith.variants.map((v) => v.collection + (v.reference ? " (" + v.reference + ")" : "")).join("; ")}</span>
             </div>`
          : ""
      }
    </div>

    <div class="hadith__isnad">
      <p class="hadith__section-title">Иснад — цепочка передачи</p>
      <div class="hadith__isnad-scroll">
        ${buildIsnadSvg(hadith.isnad)}
      </div>
    </div>

    <div class="hadith__explanation">
      <p class="hadith__section-title">Разъяснение</p>
      ${
        hasExplanation
          ? `<div class="hadith__explanation-toggle" id="explanation-toggle">
               <button class="hadith__explanation-toggle-btn hadith__explanation-toggle-btn--active" data-mode="short" type="button">Кратко</button>
               <button class="hadith__explanation-toggle-btn" data-mode="detailed" type="button">Подробно</button>
             </div>
             <div class="hadith__explanation-text" id="explanation-text">${explanationHtml(hadith.explanation.short || hadith.explanation.detailed)}</div>`
          : `<p class="hadith__explanation-text hadith__explanation-text--placeholder">Разъяснение будет добавлено позже.</p>`
      }
    </div>

    <div class="hadith__place">
      <p class="hadith__section-title">Место</p>
      ${
        places.length
          ? places.map((p) => `<p class="hadith__meta-value">${p.name}</p>`).join("")
          : `<p class="hadith__place--empty">Место, связанное с этим хадисом, пока не указано.</p>`
      }
    </div>

    ${
      hadith.tags && hadith.tags.length
        ? `<div class="hadith__tags">${hadith.tags.map((t) => `<span class="hadith__tag">${t}</span>`).join("")}</div>`
        : ""
    }

    ${buildPrevNext()}

    <div class="hadith__toast" id="toast">Ссылка скопирована</div>
  `;

  // ---------- Обработчики ----------
  const favBtn = document.getElementById("favorite-btn");
  function renderFavoriteBtn() {
    const active = isFavorite();
    favBtn.textContent = active ? "В избранном ✓" : "Сохранить в избранное";
    favBtn.classList.toggle("hadith__action--favorite-active", active);
  }
  renderFavoriteBtn();
  favBtn.addEventListener("click", () => {
    toggleFavorite();
    renderFavoriteBtn();
  });

  document.getElementById("copy-link-btn").addEventListener("click", () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      const toast = document.getElementById("toast");
      toast.classList.add("hadith__toast--visible");
      setTimeout(() => toast.classList.remove("hadith__toast--visible"), 1800);
    });
  });

  document.getElementById("print-btn").addEventListener("click", () => window.print());

  const toggle = document.getElementById("explanation-toggle");
  if (toggle) {
    toggle.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-mode]");
      if (!btn) return;
      toggle.querySelectorAll("button").forEach((b) => b.classList.remove("hadith__explanation-toggle-btn--active"));
      btn.classList.add("hadith__explanation-toggle-btn--active");
      const mode = btn.dataset.mode;
      const text = hadith.explanation[mode] || (mode === "short" ? hadith.explanation.detailed : hadith.explanation.short);
      document.getElementById("explanation-text").innerHTML = explanationHtml(text);
    });
  }
})();
