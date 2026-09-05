/**
 * data/narrators.js
 * Записи передатчиков (равиев). Хадисы ссылаются на них по id через isnad,
 * а не хранят имя как текст — так один и тот же передатчик не дублируется
 * в тысячах хадисов.
 *
 * Поле bio пока пустое — биографии будут добавлены позже.
 */

const NARRATORS = [
  {
    id: "yahya-ibn-yahya",
    name: "Яхья ибн Яхья аль-Лайси",
    nameArabic: "يحيى بن يحيى الليثي",
    years: "",
    bio: ""
  },
  {
    id: "malik-ibn-anas",
    name: "Малик ибн Анас",
    nameArabic: "مالك بن أنس",
    years: "",
    bio: ""
  },
  {
    id: "ibn-shihab",
    name: "Ибн Шихаб аз-Зухри",
    nameArabic: "ابن شهاب",
    years: "",
    bio: ""
  },
  {
    id: "umar-ibn-abd-al-aziz",
    name: "Умар ибн Абд аль-Азиз",
    nameArabic: "عمر بن عبد العزيز",
    years: "",
    bio: ""
  },
  {
    id: "urwa-ibn-az-zubayr",
    name: "Урва ибн аз-Зубайр",
    nameArabic: "عروة بن الزبير",
    years: "",
    bio: ""
  },
  {
    id: "al-mughira-ibn-shuba",
    name: "аль-Мугыра ибн Шу'ба",
    nameArabic: "المغيرة بن شعبة",
    years: "",
    bio: ""
  },
  {
    id: "abu-masud-al-ansari",
    name: "Абу Мас'уд аль-Ансари",
    nameArabic: "أبو مسعود الأنصاري",
    years: "",
    bio: ""
  }
];

if (typeof module !== "undefined") {
  module.exports = NARRATORS;
}
