const { words, songs } = require("./tasks")

function filterByAge(items, age) {
  const candidates = items.filter(function (item) {
    return age >= item.minAge
  })
  return candidates.length ? candidates : items
}

function pickRandom(items) {
  const index = Math.floor(Math.random() * items.length)
  return items[index]
}

function getWordsForAge(age) {
  return filterByAge(words, age)
}

function pickWordForAge(age) {
  return pickRandom(getWordsForAge(age))
}

function getWordText(word) {
  return word && word.text ? word.text : ""
}

function getWordHint(word) {
  return word && word.zh ? word.zh : ""
}

function getPracticePhrase(word, phraseMode) {
  const text = getWordText(word)

  if (!phraseMode) {
    return text
  }

  return word.phrase || text
}

function getSongsForAge(age) {
  return filterByAge(songs, age)
}

module.exports = {
  getWordsForAge,
  pickWordForAge,
  getWordText,
  getWordHint,
  getPracticePhrase,
  getSongsForAge
}
