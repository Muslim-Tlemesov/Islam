/**
 * data/places.js
 * Места, упоминаемые в хадисах. Хадисы ссылаются на них по id через places: [].
 * Пока пусто — будет заполняться по мере добавления хадисов, где место известно.
 */

const PLACES = [];

if (typeof module !== "undefined") {
  module.exports = PLACES;
}
