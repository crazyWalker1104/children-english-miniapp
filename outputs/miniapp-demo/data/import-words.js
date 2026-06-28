const fs = require("fs")
const path = require("path")

const taskPath = path.join(__dirname, "tasks.js")
const defaultCsvPath = path.join(__dirname, "word-import-template.csv")
const csvPath = process.argv[2]
  ? path.resolve(process.cwd(), process.argv[2])
  : defaultCsvPath

function parseCsvLine(line) {
  const cells = []
  let current = ""
  let inQuotes = false

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index]
    const nextChar = line[index + 1]

    if (char === "\"" && inQuotes && nextChar === "\"") {
      current += "\""
      index += 1
    } else if (char === "\"") {
      inQuotes = !inQuotes
    } else if (char === "," && !inQuotes) {
      cells.push(current.trim())
      current = ""
    } else {
      current += char
    }
  }

  cells.push(current.trim())
  return cells
}

function parseCsv(content) {
  const lines = content
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .filter(function (line) {
      return line.trim()
    })

  if (!lines.length) {
    throw new Error("CSV is empty")
  }

  const headers = parseCsvLine(lines[0])
  return lines.slice(1).map(function (line, rowIndex) {
    const values = parseCsvLine(line)
    const row = {
      _rowNumber: rowIndex + 2
    }

    headers.forEach(function (header, index) {
      row[header] = values[index] || ""
    })

    return row
  })
}

function normalizeId(id) {
  return String(id || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function normalizeAge(value, rowNumber) {
  const age = Number(value)

  if (!Number.isInteger(age) || age < 3 || age > 6) {
    throw new Error(`Row ${rowNumber}: minAge must be an integer from 3 to 6`)
  }

  return age
}

function normalizeWord(row) {
  const id = normalizeId(row.id || row.text)
  const status = String(row.status || "approved").trim().toLowerCase()

  if (status && status !== "approved") {
    return null
  }

  if (!id || !row.text || !row.zh || !row.category) {
    throw new Error(
      `Row ${row._rowNumber}: id/text/zh/category are required for approved words`
    )
  }

  return {
    id,
    text: String(row.text).trim(),
    zh: String(row.zh).trim(),
    category: String(row.category).trim(),
    minAge: normalizeAge(row.minAge, row._rowNumber),
    phrase: String(row.phrase || row.text).trim()
  }
}

function serializeWords(words) {
  return words
    .map(function (word) {
      return [
        "  {",
        `    id: ${JSON.stringify(word.id)},`,
        `    text: ${JSON.stringify(word.text)},`,
        `    zh: ${JSON.stringify(word.zh)},`,
        `    category: ${JSON.stringify(word.category)},`,
        `    minAge: ${word.minAge},`,
        `    phrase: ${JSON.stringify(word.phrase)}`,
        "  }"
      ].join("\n")
    })
    .join(",\n")
}

function replaceWordsBlock(source, words) {
  const nextBlock = `const words = [\n${serializeWords(words)}\n]\n\nconst songs =`
  const pattern = /const words = \[[\s\S]*?\]\n\nconst songs =/

  if (!pattern.test(source)) {
    throw new Error("Could not find words block in data/tasks.js")
  }

  return source.replace(pattern, nextBlock)
}

function mergeWords(existingWords, importedWords) {
  const importedById = {}

  importedWords.forEach(function (word) {
    if (importedById[word.id]) {
      throw new Error(`CSV has duplicate approved word id: ${word.id}`)
    }
    importedById[word.id] = word
  })

  const merged = existingWords.map(function (word) {
    return importedById[word.id] || word
  })
  const existingIds = {}

  existingWords.forEach(function (word) {
    existingIds[word.id] = true
  })

  importedWords.forEach(function (word) {
    if (!existingIds[word.id]) {
      merged.push(word)
    }
  })

  return merged
}

function validateAfterWrite() {
  const taskModulePath = require.resolve("./tasks")
  const validateModulePath = require.resolve("./validate-content")

  delete require.cache[taskModulePath]
  delete require.cache[validateModulePath]

  require("./validate-content").validateContent()
}

function importWords() {
  const csv = fs.readFileSync(csvPath, "utf8")
  const rows = parseCsv(csv)
  const importedWords = rows
    .map(normalizeWord)
    .filter(function (word) {
      return Boolean(word)
    })

  if (!importedWords.length) {
    throw new Error("No approved words found in CSV")
  }

  delete require.cache[require.resolve("./tasks")]
  const existingWords = require("./tasks").words
  const mergedWords = mergeWords(existingWords, importedWords)
  const taskSource = fs.readFileSync(taskPath, "utf8")
  const nextTaskSource = replaceWordsBlock(taskSource, mergedWords)

  fs.writeFileSync(taskPath, nextTaskSource)
  validateAfterWrite()

  console.log(
    `Imported ${importedWords.length} approved words. Total words: ${mergedWords.length}`
  )
}

if (typeof module !== "undefined" && require.main === module) {
  importWords()
}

module.exports = {
  parseCsv,
  normalizeId,
  normalizeAge,
  normalizeWord,
  mergeWords,
  importWords
}
