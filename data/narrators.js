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
    id: "ubaydullah-ibn-yahya",
    name: "Убайдуллах ибн Яхья аль-Лайси",
    nameArabic: "",
    years: "умер в 298 г.х.",
    bio:
      "Факих, имам, долгожитель, Абу Марван аль-Лейси, андалусец, кордовец (житель Куртубы), муснид (выдающийся передатчик хадисов и знаток их цепочек) Кордовы.\n\nПередавал хадисы от своего отца, имама Яхьи, сборник «аль-Муватта». Совершал поездки с целью хаджа и торговли, во время которых слушал хадисы от Абу Хишама ар-Рифаи, Мухаммада ибн Абдуллаха ибн аль-Барки и ряда других передатчиков.\n\nИбн аль-Фарди сказал: «Он перенял знания своего отца, и в своём городе не слушал хадисы ни от кого, кроме него. Он был щедрым, благоразумным человеком, обладавшим огромным авторитетом и богатством, пользовался уважением в совете (шура), единолично возглавлял город, и его положение было неоспоримым».\n\nОт него передавали хадисы: Ахмад ибн Халид, Мухаммад ибн Айман, Ахмад ибн Мутарриф, Ахмад ибн Саид ибн Хазм ас-Садафи и его племянник Яхья ибн Абдуллах ибн Яхья аль-Лейси... Далее он (Ибн аль-Фарди) добавил: «И последним, кто передавал от него хадисы, был наш шейх Абу Иса Яхья», — имея в виду его племянника.\n\nСкончался в десятый день месяца Рамадан 298 года по хиджре. Заупокойную молитву над ним совершил его сын Яхья, и его похороны были многолюдными (засвидетельствованными большим количеством людей).",
    manualConnections: {
      studiedUnder: ["yahya-ibn-yahya", "abu-hisham-ar-rifai", "muhammad-ibn-abdullah-al-barqi"],
      taught: [
        "ahmad-ibn-khalid",
        "muhammad-ibn-ayman",
        "ahmad-ibn-mutarrif",
        "ahmad-ibn-said-ibn-hazm-as-sadafi",
        "yahya-ibn-abdullah-ibn-yahya-al-laythi"
      ]
    }
  },
  {
    id: "abu-hisham-ar-rifai",
    name: "Абу Хишам ар-Рифаи",
    nameArabic: "",
    years: "",
    bio: ""
  },
  {
    id: "muhammad-ibn-abdullah-al-barqi",
    name: "Мухаммад ибн Абдуллах ибн аль-Барки",
    nameArabic: "",
    years: "",
    bio: ""
  },
  {
    id: "ahmad-ibn-khalid",
    name: "Ахмад ибн Халид",
    nameArabic: "",
    years: "",
    bio: ""
  },
  {
    id: "muhammad-ibn-ayman",
    name: "Мухаммад ибн Айман",
    nameArabic: "",
    years: "",
    bio: ""
  },
  {
    id: "ahmad-ibn-mutarrif",
    name: "Ахмад ибн Мутарриф",
    nameArabic: "",
    years: "",
    bio: ""
  },
  {
    id: "ahmad-ibn-said-ibn-hazm-as-sadafi",
    name: "Ахмад ибн Саид ибн Хазм ас-Садафи",
    nameArabic: "",
    years: "",
    bio: ""
  },
  {
    id: "yahya-ibn-abdullah-ibn-yahya-al-laythi",
    name: "Яхья ибн Абдуллах ибн Яхья аль-Лейси",
    nameArabic: "",
    years: "",
    bio: ""
  },
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
