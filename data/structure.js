/**
 * data/structure.js
 * Дерево «Книга → Раздел (китаб) → Глава (баб)».
 * Меню, breadcrumbs и списки хадисов строятся из этого файла,
 * а не прописываются вручную на страницах.
 *
 * Схема узла книги специально оставлена достаточной для того,
 * чтобы позже добавить другие сборники (Сахих аль-Бухари,
 * Сахих Муслим и т.д.) без изменения структуры данных.
 */

const STRUCTURE = [
  {
    id: "muwatta-imam-malik",
    title: "Муватта имама Малика",
    titleArabic: "موطأ الإمام مالك",
    author: "Имам Малик ибн Анас",
    sections: [
      {
        id: "kitab-waqt-as-salah",
        title: "Книга о временах молитвы",
        titleArabic: "كتاب وقوت الصلاة",
        explanation:
          `Книга (<span lang="ar" class="browser__arabic-inline">كتاب</span>): это письменный свод, объединяющий в себе главы (<span lang="ar" class="browser__arabic-inline">أبواب</span>), главы объединяют разделы (<span lang="ar" class="browser__arabic-inline">فصول</span>), а разделы объединяют вопросы (<span lang="ar" class="browser__arabic-inline">مسائل</span>). Однако могут встречаться книги без глав, а главы без разделов и так далее...\n\nСлово «временах» (<span lang="ar" class="browser__arabic-inline">وُقُوت</span>): это множественное число большого количества (<span lang="ar" class="browser__arabic-inline">جَمْعُ كَثْرَة</span>), от слова «<span lang="ar" class="browser__arabic-inline">وَقْت</span>» (время). А поскольку времён молитв пять, более уместным было бы использование множественного числа малого количества (<span lang="ar" class="browser__arabic-inline">جَمْعُ قِلَّةٍ</span>) → <span lang="ar" class="browser__arabic-inline">أوْقات</span>.\n\nА предпочтение в данном случае множественного числа большого количества объясняется следующим образом:\n1) Одно из этих двух множественных чисел может заменять другое.\n2) Это сделано с учётом того, что эти пять времён повторяются каждый день, подобно тому, как употребляют слово множественного числа «<span lang="ar" class="browser__arabic-inline">شُمُوس</span>» (солнца) и «<span lang="ar" class="browser__arabic-inline">أقْمَار</span>» (луны), хотя известно, что у нас одно солнце и одна луна. Так говорят по причине повторяемости появления солнца и луны.`,
        chapters: [
          {
            id: "bab-waqt-as-salah",
            title: "Глава о временах молитвы",
            titleArabic: "باب وقوت الصلاة",
            hadithIds: ["muwatta-1-1-1"]
          }
        ]
      }
    ]
  }
];

// Доступ из разных страниц как в браузере (обычный script), так и как модуль
if (typeof module !== "undefined") {
  module.exports = STRUCTURE;
}
