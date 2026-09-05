/**
 * js/narrators.js
 * Отрисовывает карточки всех передатчиков и считает, в скольких
 * опубликованных хадисах встречается каждый из них.
 */

(function () {
  const grid = document.getElementById("grid");
  const published = HADITHS.filter((h) => h.status === "published");

  function countHadiths(narratorId) {
    return published.filter((h) => h.isnad.some((link) => link.narratorId === narratorId)).length;
  }

  NARRATORS.forEach((n) => {
    const count = countHadiths(n.id);
    const a = document.createElement("a");
    a.className = "narrators__card";
    a.href = `narrator.html?id=${encodeURIComponent(n.id)}`;
    a.innerHTML = `
      <span class="narrators__card-name">${n.name}</span>
      <span class="narrators__card-name-ar" lang="ar">${n.nameArabic}</span>
      <span class="narrators__card-count">${count} хадис${count === 1 ? "" : count < 5 ? "а" : "ов"}</span>
    `;
    grid.appendChild(a);
  });
})();
