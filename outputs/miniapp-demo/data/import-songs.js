const fs = require("fs")
const path = require("path")

const taskPath = path.join(__dirname, "tasks.js")
const defaultCsvPath = path.join(__dirname, "song-import-template.csv")
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

function buildLine(songId, lineIndex, text, action) {
  if (!text || !action) {
    return null
  }

  return {
    id: `${songId}-${lineIndex}`,
    text: String(text).trim(),
    action: String(action).trim()
  }
}

function normalizeSong(row) {
  const id = normalizeId(row.id || row.title)
  const status = String(row.status || "approved").trim().toLowerCase()

  if (status && status !== "approved") {
    return null
  }

  if (!id || !row.title || !row.zh || !row.action) {
    throw new Error(
      `Row ${row._rowNumber}: id/title/zh/action are required for approved songs`
    )
  }

  const lines = [
    buildLine(id, 1, row.line1Text, row.line1Action),
    buildLine(id, 2, row.line2Text, row.line2Action),
    buildLine(id, 3, row.line3Text, row.line3Action)
  ].filter(function (line) {
    return Boolean(line)
  })

  if (!lines.length) {
    throw new Error(`Row ${row._rowNumber}: at least one lyric line is required`)
  }

  return {
    id,
    title: String(row.title).trim(),
    zh: String(row.zh).trim(),
    action: String(row.action).trim(),
    minAge: normalizeAge(row.minAge, row._rowNumber),
    audioKey: normalizeId(row.audioKey || id),
    lines
  }
}

function serializeSongLines(lines) {
  return lines
    .map(function (line) {
      return `      { id: ${JSON.stringify(line.id)}, text: ${JSON.stringify(
        line.text
      )}, action: ${JSON.stringify(line.action)} }`
    })
    .join(",\n")
}

function serializeSongs(songs) {
  return songs
    .map(function (song) {
      return [
        "  {",
        `    id: ${JSON.stringify(song.id)},`,
        `    title: ${JSON.stringify(song.title)},`,
        `    zh: ${JSON.stringify(song.zh)},`,
        `    action: ${JSON.stringify(song.action)},`,
        `    minAge: ${song.minAge},`,
        `    audioKey: ${JSON.stringify(song.audioKey)},`,
        "    lines: [",
        serializeSongLines(song.lines),
        "    ]",
        "  }"
      ].join("\n")
    })
    .join(",\n")
}

function replaceSongsBlock(source, songs) {
  const nextBlock = `const songs = [\n${serializeSongs(songs)}\n]\n\nconst themeTasks =`
  const pattern = /const songs = \[[\s\S]*?\]\n\nconst themeTasks =/

  if (!pattern.test(source)) {
    throw new Error("Could not find songs block in data/tasks.js")
  }

  return source.replace(pattern, nextBlock)
}

function mergeSongs(existingSongs, importedSongs) {
  const importedById = {}

  importedSongs.forEach(function (song) {
    if (importedById[song.id]) {
      throw new Error(`CSV has duplicate approved song id: ${song.id}`)
    }
    importedById[song.id] = song
  })

  const merged = existingSongs.map(function (song) {
    return importedById[song.id] || song
  })
  const existingIds = {}

  existingSongs.forEach(function (song) {
    existingIds[song.id] = true
  })

  importedSongs.forEach(function (song) {
    if (!existingIds[song.id]) {
      merged.push(song)
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

function importSongs() {
  const csv = fs.readFileSync(csvPath, "utf8")
  const rows = parseCsv(csv)
  const importedSongs = rows
    .map(normalizeSong)
    .filter(function (song) {
      return Boolean(song)
    })

  if (!importedSongs.length) {
    throw new Error("No approved songs found in CSV")
  }

  delete require.cache[require.resolve("./tasks")]
  const existingSongs = require("./tasks").songs
  const mergedSongs = mergeSongs(existingSongs, importedSongs)
  const taskSource = fs.readFileSync(taskPath, "utf8")
  const nextTaskSource = replaceSongsBlock(taskSource, mergedSongs)

  fs.writeFileSync(taskPath, nextTaskSource)
  validateAfterWrite()

  console.log(
    `Imported ${importedSongs.length} approved songs. Total songs: ${mergedSongs.length}`
  )
}

if (typeof module !== "undefined" && require.main === module) {
  importSongs()
}

module.exports = {
  parseCsv,
  importSongs
}
