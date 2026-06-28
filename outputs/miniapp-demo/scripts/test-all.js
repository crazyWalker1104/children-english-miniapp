/**
 * 统一测试运行器
 * 运行所有单元测试并汇总结果
 *
 * 用法：node scripts/test-all.js
 */

var { execSync } = require("child_process")
var path = require("path")

var testFiles = [
  "test-age.js",
  "test-shuffle.js",
  "test-learning-path.js",
  "test-content.js",
  "test-encouragement.js",
  "test-settings.js",
  "test-progress.js",
  "test-layout.js",
  "test-randomizer.js",
  "test-interaction.js",
  "test-import.js"
]

var totalPassed = 0
var totalFailed = 0
var results = []

testFiles.forEach(function (file) {
  var fullPath = path.join(__dirname, file)
  try {
    var output = execSync("node \"" + fullPath + "\"", {
      encoding: "utf-8",
      timeout: 30000
    })

    // 解析输出中的测试结果行
    var match = output.match(/测试结果:\s*(\d+)\s*通过,\s*(\d+)\s*失败/)
    if (match) {
      var passed = parseInt(match[1], 10)
      var failed = parseInt(match[2], 10)
      totalPassed += passed
      totalFailed += failed
      results.push({ file: file, passed: passed, failed: failed, status: failed === 0 ? "PASS" : "FAIL" })
    } else {
      results.push({ file: file, passed: 0, failed: 0, status: "PARSE_ERROR" })
      totalFailed += 1
    }
  } catch (err) {
    var output = err.stdout || ""
    var match = output.match(/测试结果:\s*(\d+)\s*通过,\s*(\d+)\s*失败/)
    if (match) {
      var passed = parseInt(match[1], 10)
      var failed = parseInt(match[2], 10)
      totalPassed += passed
      totalFailed += failed
      results.push({ file: file, passed: passed, failed: failed, status: failed === 0 ? "PASS" : "FAIL" })
    } else {
      results.push({ file: file, passed: 0, failed: 1, status: "ERROR" })
      totalFailed += 1
    }
  }
})

// 打印汇总
console.log("")
console.log("╔══════════════════════════════════════════════════════╗")
console.log("║              全部测试汇总报告                        ║")
console.log("╠══════════════════════════════════════════════════════╣")

results.forEach(function (r) {
  var status = r.status === "PASS" ? " ✓ " : " ✗ "
  var detail = r.passed + " 通过" + (r.failed > 0 ? ", " + r.failed + " 失败" : "")
  var padding = " ".repeat(Math.max(0, 44 - r.file.length - detail.length - 4))
  console.log("║" + status + r.file + padding + detail + " ║")
})

console.log("╠══════════════════════════════════════════════════════╣")
var summary = "总计: " + totalPassed + " 通过, " + totalFailed + " 失败"
var summaryPadding = " ".repeat(Math.max(0, 52 - summary.length))
console.log("║ " + summary + summaryPadding + "║")
console.log("╚══════════════════════════════════════════════════════╝")
console.log("")

if (totalFailed > 0) {
  process.exit(1)
}
