/**
 * js/hadiths.js
 * Отрисовывает три уровня навигации по книге на одной странице:
 *   1) список разделов (китабов) книги
 *   2) список глав (абвабов) внутри выбранного раздела
 *   3) список хадисов внутри выбранной главы
 * Уровень определяется query-параметрами ?section=&chapter= —
 * это позволяет иметь один hadiths.html вместо отдельного файла
 * на каждый раздел/главу.
 */

(function () {
  const params = new URLSearchParams(window.location.search);
  const sectionId = params.get("section");
  const chapterId = params.get("chapter");

  const book = STRUCTURE[0]; // пока один сборник — Муватта имама Малика

  const headingEl = document.getElementById("heading");
  const listEl = document.getElementById("list");

  function paragraphsToHtml(text) {
    return text
      .split(/\n\s*\n/)
      .map((p) => `<p>${p.trim()}</p>`)
      .join("");
  }

  function renderEmpty(text) {
    const p = document.createElement("p");
    p.className = "browser__empty";
    p.textContent = text;
    listEl.appendChild(p);
  }

  function firstArabicWords(text, wordCount) {
    return text.split(/\s+/).slice(0, wordCount).join(" ") + "…";
  }

  // ----- Уровень 1: разделы книги -----
  if (!sectionId) {
    headingEl.style.display = "none";

    if (!book.sections.length) {
      renderEmpty("Разделы пока не добавлены.");
      return;
    }

    book.sections.forEach((section) => {
      const a = document.createElement("a");
      a.className = "browser__item";
      a.href = `hadiths.html?section=${encodeURIComponent(section.id)}`;
      a.innerHTML = `
        <span class="browser__item-main">
          <span class="browser__item-title">${section.title}</span>
          <span class="browser__item-title-ar" lang="ar">${section.titleArabic}</span>
        </span>
        <span class="browser__item-meta">${section.chapters.length} гл.</span>
      `;
      listEl.appendChild(a);
    });
    return;
  }

  const section = book.sections.find((s) => s.id === sectionId);
  if (!section) {
    headingEl.textContent = "Раздел не найден";
    renderEmpty("Проверьте ссылку или вернитесь к списку разделов.");
    return;
  }

  // ----- Уровень 2: главы раздела -----
  if (!chapterId) {
    headingEl.textContent = section.title;

    if (section.explanation) {
      const expl = document.createElement("div");
      expl.className = "browser__section-explanation";
      expl.innerHTML = paragraphsToHtml(section.explanation);
      headingEl.insertAdjacentElement("afterend", expl);
    }

    if (!section.chapters.length) {
      renderEmpty("Главы пока не добавлены.");
      return;
    }

    section.chapters.forEach((chapter) => {
      const a = document.createElement("a");
      a.className = "browser__item";
      a.href = `hadiths.html?section=${encodeURIComponent(section.id)}&chapter=${encodeURIComponent(chapter.id)}`;
      a.innerHTML = `
        <span class="browser__item-main">
          <span class="browser__item-title">${chapter.title}</span>
          <span class="browser__item-title-ar" lang="ar">${chapter.titleArabic}</span>
        </span>
        <span class="browser__item-meta">${chapter.hadithIds.length} хадис.</span>
      `;
      listEl.appendChild(a);
    });
    return;
  }

  const chapter = section.chapters.find((c) => c.id === chapterId);
  if (!chapter) {
    headingEl.textContent = "Глава не найдена";
    renderEmpty("Проверьте ссылку или вернитесь к списку глав.");
    return;
  }

  // ----- Уровень 3: хадисы главы -----
  headingEl.textContent = chapter.title;

  const hadiths = chapter.hadithIds
    .map((id) => HADITHS.find((h) => h.id === id))
    .filter((h) => h && h.status === "published");

  if (!hadiths.length) {
    renderEmpty("Хадисы этой главы пока не опубликованы.");
    return;
  }

  hadiths.forEach((hadith) => {
    const a = document.createElement("a");
    a.className = "browser__item";
    a.href = `hadith.html?id=${encodeURIComponent(hadith.id)}`;
    a.innerHTML = `
      <span class="browser__item-main">
        <span class="browser__item-title">Хадис №${hadith.number}</span>
      </span>
      <span class="browser__item-preview" lang="ar" dir="rtl">${firstArabicWords(hadith.arabic, 6)}</span>
    `;
    listEl.appendChild(a);
  });
})();
