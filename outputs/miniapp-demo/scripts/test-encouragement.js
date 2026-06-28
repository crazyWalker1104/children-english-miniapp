/**
 * utils/encouragement.js 测试
 * 测试鼓励话术随机选取与不重复逻辑
 * 注意：此模块有模块级状态变量，测试间需要重置
 */

var assert = require("assert")

// encouragement.js 无 wx 依赖，直接 require
var { encourage, encourageComplete, encourageRetry } = require("../utils/encouragement")

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

console.log("\nencouragement 测试")

test("encourage返回非空字符串且含星号", function () {
  var phrase = encourage()
  assert.ok(typeof phrase === "string")
  assert.ok(phrase.length > 0)
  assert.ok(phrase.indexOf("★") >= 0 || phrase.indexOf("★") >= 0)
})

test("encourage连续调用不返回相同结果", function () {
  // 多次调用验证不重复
  var prev = encourage()
  var hasDifferent = false
  for (var i = 0; i < 10; i++) {
    var next = encourage()
    if (next !== prev) {
      hasDifferent = true
      break
    }
  }
  assert.ok(hasDifferent, "连续10次调用返回了相同结果")
})

test("encourageComplete返回含三星的完成话术", function () {
  var phrase = encourageComplete()
  assert.ok(phrase.indexOf("★★★") >= 0, "完成话术应包含★★★: " + phrase)
})

test("encourageComplete连续调用不返回相同结果", function () {
  var prev = encourageComplete()
  var hasDifferent = false
  for (var i = 0; i < 10; i++) {
    var next = encourageComplete()
    if (next !== prev) {
      hasDifferent = true
      break
    }
  }
  assert.ok(hasDifferent, "连续10次调用返回了相同结果")
})

test("encourageRetry返回非空重试话术", function () {
  var phrase = encourageRetry()
  assert.ok(typeof phrase === "string")
  assert.ok(phrase.length > 0)
  // 重试话术不应包含星号
  assert.ok(phrase.indexOf("★") < 0, "重试话术不应包含星号: " + phrase)
})

console.log("\n========================================")
console.log("测试结果: " + passed + " 通过, " + failed + " 失败")
console.log("========================================\n")

if (failed > 0) {
  process.exit(1)
}
