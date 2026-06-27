const { colors, words, songs, themeTasks } = require("./tasks")

function assertUnique(items, getId, label) {
  const seen = {}
  items.forEach(function (item) {
    const id = getId(item)
    if (!id) {
      throw new Error(`${label} has empty id`)
    }
    if (seen[id]) {
      throw new Error(`${label} has duplicate id: ${id}`)
    }
    seen[id] = true
  })
}

function assertAge(item, label) {
  if (typeof item.minAge !== "number") {
    throw new Error(`${label} ${item.id} missing minAge`)
  }
}

function validateWords() {
  assertUnique(words, function (word) {
    return word.id
  }, "words")
  words.forEach(function (word) {
    assertAge(word, "word")
    if (!word.text || !word.zh || !word.category) {
      throw new Error(`word ${word.id} missing text, zh, or category`)
    }
  })
}

function validateSongs() {
  assertUnique(songs, function (song) {
    return song.id
  }, "songs")
  songs.forEach(function (song) {
    assertAge(song, "song")
    if (!song.title || !song.zh || !song.lines || !song.lines.length) {
      throw new Error(`song ${song.id} missing title, zh, or lines`)
    }
    assertUnique(song.lines, function (line) {
      return line.id
    }, `song ${song.id} lines`)
  })
}

function validateThemeTasks() {
  const wordIds = {}
  const colorIds = {}

  words.forEach(function (word) {
    wordIds[word.id] = true
    wordIds[word.text] = true
  })
  colors.forEach(function (color) {
    colorIds[color.id] = true
    colorIds[color.label] = true
  })

  assertUnique(themeTasks, function (task) {
    return task.id
  }, "themeTasks")
  themeTasks.forEach(function (task) {
    assertAge(task, "themeTask")
    if (typeof task.maxAge !== "number" || !task.prompt || !task.target) {
      throw new Error(`themeTask ${task.id} missing maxAge, prompt, or target`)
    }
    if (!wordIds[task.target] && !colorIds[task.target]) {
      throw new Error(`themeTask ${task.id} target is not in words or colors`)
    }
  })
}

function validateContent() {
  validateWords()
  validateSongs()
  validateThemeTasks()
}

if (typeof module !== "undefined" && require.main === module) {
  validateContent()
  console.log("Content validation passed")
}

module.exports = {
  validateContent
}
