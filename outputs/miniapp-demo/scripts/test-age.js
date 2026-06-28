/**
 * utils/age.js 测试
 * 测试年龄分级逻辑：3-4岁→listen，5岁→match，6+岁→combine
 */

var assert = require("assert")
var { getAgeLevel } = require("../utils/age")

var passed = 0
var failed = 0

function test(name, fn) {
  try {
    fn()
    passed += 1
    console.log("  ✓ " + name)
  } catch (err) {
    failed += 1
    console.log("  ✗ " + name)
    console.log("    " + (err && err.message ? err.message : err))
  }
}

console.log("\ngetAgeLevel 测试")

test("3岁返回listen级别，选项数3，拼图4块", function () {
  var level = getAgeLevel(3)
  assert.strictEqual(level.key, "listen")
  assert.strictEqual(level.label, "听点为主")
  assert.strictEqual(level.choiceCount, 3)
  assert.strictEqual(level.puzzlePieces, 4)
  assert.strictEqual(level.phraseMode, false)
})

test("4岁仍返回listen级别（边界值）", function () {
  var level = getAgeLevel(4)
  assert.strictEqual(level.key, "listen")
  assert.strictEqual(level.choiceCount, 3)
})

test("5岁返回match级别，选项数4，拼图6块，短语模式开启", function () {
  var level = getAgeLevel(5)
  assert.strictEqual(level.key, "match")
  assert.strictEqual(level.label, "跟读配对")
  assert.strictEqual(level.choiceCount, 4)
  assert.strictEqual(level.puzzlePieces, 6)
  assert.strictEqual(level.phraseMode, true)
})

test("6岁及以上返回combine级别，拼图9块", function () {
  var level = getAgeLevel(6)
  assert.strictEqual(level.key, "combine")
  assert.strictEqual(level.label, "短句组合")
  assert.strictEqual(level.choiceCount, 4)
  assert.strictEqual(level.puzzlePieces, 9)
  assert.strictEqual(level.phraseMode, true)

  // 7岁也应返回combine
  var level7 = getAgeLevel(7)
  assert.strictEqual(level7.key, "combine")
})

console.log("\n========================================")
console.log("测试结果: " + passed + " 通过, " + failed + " 失败")
console.log("========================================\n")

if (failed > 0) {
  process.exit(1)
}
