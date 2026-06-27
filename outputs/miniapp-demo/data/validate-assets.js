const fs = require("fs")
const path = require("path")
const { audioSources } = require("./audio-sources")
const { requiredAudio, requiredImages } = require("./asset-manifest")

const rootPath = path.resolve(__dirname, "..")
const strict = process.argv.indexOf("--strict") >= 0

function toLocalPath(assetPath) {
  return path.join(rootPath, assetPath.replace(/^\//, ""))
}

function exists(assetPath) {
  return fs.existsSync(toLocalPath(assetPath))
}

function validateAudio() {
  const missingMappings = []
  const missingFiles = []

  requiredAudio.forEach(function (item) {
    const source = audioSources[item.sourceKey]

    if (!source) {
      missingMappings.push(item)
      return
    }

    if (source.indexOf("/assets/") === 0 && !exists(source)) {
      missingFiles.push({
        ...item,
        path: source
      })
    }
  })

  return {
    missingMappings,
    missingFiles
  }
}

function validateImages() {
  return requiredImages.filter(function (item) {
    return !exists(item.path)
  })
}

function printSection(title, items, formatItem) {
  if (!items.length) {
    console.log(`${title}: OK`)
    return
  }

  console.log(`${title}: ${items.length} missing`)
  items.forEach(function (item) {
    console.log(`- ${formatItem(item)}`)
  })
}

function validateAssets() {
  const audioResult = validateAudio()
  const missingImages = validateImages()
  const missingCount =
    audioResult.missingMappings.length +
    audioResult.missingFiles.length +
    missingImages.length

  printSection(
    "Audio mappings",
    audioResult.missingMappings,
    function (item) {
      return `${item.sourceKey} -> ${item.recommendedPath}`
    }
  )
  printSection("Audio files", audioResult.missingFiles, function (item) {
    return item.path
  })
  printSection("Image files", missingImages, function (item) {
    return `${item.path} (${item.licenseNote})`
  })

  if (missingCount && strict) {
    throw new Error(`Asset validation failed with ${missingCount} missing items`)
  }

  console.log(
    missingCount
      ? `Asset validation finished with ${missingCount} missing items`
      : "Asset validation passed"
  )
}

if (typeof module !== "undefined" && require.main === module) {
  validateAssets()
}

module.exports = {
  validateAssets
}
