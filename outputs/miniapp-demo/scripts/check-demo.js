const fs = require("fs")
const path = require("path")
const childProcess = require("child_process")

const projectRoot = path.resolve(__dirname, "..")
const strictAssets = process.argv.indexOf("--strict-assets") >= 0

const forbiddenPatterns = [
  {
    pattern: /bindtap/,
    label: "Use bind:tap instead of bindtap."
  },
  {
    pattern: /wx:key="\*this"/,
    label: "Use a stable wx:key instead of *this."
  },
  {
    pattern: /\bwindow\./,
    label: "Do not use browser window APIs in a mini program."
  },
  {
    pattern: /\bdocument\./,
    label: "Do not use browser document APIs in a mini program."
  }
]

const restrictedApiRules = [
  {
    pattern: /wx\.request/,
    allowedFile: "utils/request.js",
    label: "wx.request must stay inside utils/request.js."
  },
  {
    pattern: /wx\.vibrateShort/,
    allowedFile: "utils/interaction.js",
    label: "wx.vibrateShort must stay inside utils/interaction.js."
  },
  {
    pattern: /wx\.createInnerAudioContext/,
    allowedFile: "utils/audio.js",
    label: "wx.createInnerAudioContext must stay inside utils/audio.js."
  }
]

function walkFiles(dirPath, files) {
  fs.readdirSync(dirPath, { withFileTypes: true }).forEach(function (entry) {
    const fullPath = path.join(dirPath, entry.name)

    if (entry.isDirectory()) {
      if (entry.name === "miniprogram_npm" || entry.name === "node_modules") {
        return
      }
      walkFiles(fullPath, files)
      return
    }

    files.push(fullPath)
  })
}

function getFiles() {
  const files = []
  walkFiles(projectRoot, files)
  return files
}

function relativePath(filePath) {
  return path.relative(projectRoot, filePath).replace(/\\/g, "/")
}

function runNodeCheck(filePath) {
  childProcess.execFileSync(process.execPath, ["--check", filePath], {
    stdio: "pipe"
  })
}

function checkJavaScript(files) {
  files
    .filter(function (filePath) {
      return path.extname(filePath) === ".js"
    })
    .forEach(runNodeCheck)
}

function checkJson(files) {
  files
    .filter(function (filePath) {
      return path.extname(filePath) === ".json"
    })
    .forEach(function (filePath) {
      JSON.parse(fs.readFileSync(filePath, "utf8"))
    })
}

function checkContent() {
  require("../data/validate-content").validateContent()
}

function checkAssets() {
  const args = [path.join(projectRoot, "data/validate-assets.js")]

  if (strictAssets) {
    args.push("--strict")
  }

  childProcess.execFileSync(process.execPath, args, {
    stdio: "inherit"
  })
}

function checkPatterns(files) {
  const violations = []

  files
    .filter(function (filePath) {
      const relPath = relativePath(filePath)
      const isSourceFile = /\.(js|wxml|wxss|json)$/.test(filePath)
      const isAppFile = /^app\.(js|json|wxss)$/.test(relPath)
      const isPageFile = relPath.indexOf("pages/") === 0
      const isComponentFile = relPath.indexOf("components/") === 0
      const isUtilityFile = relPath.indexOf("utils/") === 0
      const isDataFile = relPath.indexOf("data/") === 0

      return (
        isSourceFile &&
        (isAppFile || isPageFile || isComponentFile || isUtilityFile || isDataFile)
      )
    })
    .forEach(function (filePath) {
      const relPath = relativePath(filePath)
      const content = fs.readFileSync(filePath, "utf8")

      forbiddenPatterns.forEach(function (rule) {
        if (rule.pattern.test(content)) {
          violations.push(`${relPath}: ${rule.label}`)
        }
      })

      restrictedApiRules.forEach(function (rule) {
        if (rule.pattern.test(content) && relPath !== rule.allowedFile) {
          violations.push(`${relPath}: ${rule.label}`)
        }
      })
    })

  if (violations.length) {
    throw new Error(`Spec scan failed:\n${violations.join("\n")}`)
  }
}

function runStep(label, fn) {
  process.stdout.write(`${label}... `)
  fn()
  console.log("OK")
}

function checkDemo() {
  const files = getFiles()

  runStep("JavaScript syntax", function () {
    checkJavaScript(files)
  })
  runStep("JSON parse", function () {
    checkJson(files)
  })
  runStep("Content library", checkContent)
  runStep("Asset checklist", checkAssets)
  runStep("Mini program spec scan", function () {
    checkPatterns(files)
  })

  console.log("Demo checks passed")
}

if (typeof module !== "undefined" && require.main === module) {
  checkDemo()
}

module.exports = {
  checkDemo
}
