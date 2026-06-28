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

function pickWordForAge(age, excludedId) {
  const candidates = getWordsForAge(age)
  const filtered = candidates.filter(function (word) {
    return word.id !== excludedId
  })
  const pool = filtered.length ? filtered : candidates
  return pickRandom(pool)
}

function getWordText(word) {
  return word && word.text ? word.text : ""
}

function getWordHint(word) {
  return word && word.zh ? word.zh : ""
}

function getWordCategoryLabel(word) {
  const labels = {
    greeting: "问候",
    daily: "日常",
    color: "颜色",
    food: "食物",
    art: "艺术",
    family: "家人",
    toy: "玩具",
    animal: "动物",
    action: "动作",
    body: "身体"
  }
  return labels[word.category] || "单词"
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
  getWordCategoryLabel,
  getPracticePhrase,
  getSongsForAge
}
