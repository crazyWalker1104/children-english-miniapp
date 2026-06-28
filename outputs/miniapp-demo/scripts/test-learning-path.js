/**
 * utils/learning-path.js 测试
 * 测试纯函数 getCurrentWeek / getWeekForDay 的边界逻辑
 */

var assert = require("assert")
var { getCurrentWeek, getWeekForDay, getLearningPath } = require("../utils/learning-path")

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

console.log("\nlearning-path 测试")

test("学习路径共6周", function () {
  var path = getLearningPath()
  assert.strictEqual(path.length, 6)
  assert.strictEqual(path[0].week, 1)
  assert.strictEqual(path[5].week, 6)
})

test("第0-6天返回第1周（颜色认知）", function () {
  var week0 = getCurrentWeek(0)
  assert.strictEqual(week0.week, 1)
  assert.strictEqual(week0.title, "颜色认知")

  var week6 = getCurrentWeek(6)
  assert.strictEqual(week6.week, 1)
})

test("第7-13天返回第2周（问候与日常）", function () {
  var week = getCurrentWeek(7)
  assert.strictEqual(week.week, 2)
  assert.strictEqual(week.title, "问候与日常")

  var week13 = getCurrentWeek(13)
  assert.strictEqual(week13.week, 2)
})

test("第35天返回第6周（身体与动作）", function () {
  var week = getCurrentWeek(35)
  assert.strictEqual(week.week, 6)
  assert.strictEqual(week.title, "身体与动作")
})

test("超过最后一天的天数返回最后一周（边界保护）", function () {
  var week = getCurrentWeek(100)
  assert.strictEqual(week.week, 6)
  assert.strictEqual(week.title, "身体与动作")
})

test("负数天数返回第1周（边界保护）", function () {
  var week = getCurrentWeek(-5)
  assert.strictEqual(week.week, 1)
})

test("getWeekForDay 与 getCurrentWeek 行为一致", function () {
  var a = getCurrentWeek(14)
  var b = getWeekForDay(14)
  assert.strictEqual(a.week, b.week)
  assert.strictEqual(a.title, b.title)
})

console.log("\n========================================")
console.log("测试结果: " + passed + " 通过, " + failed + " 失败")
console.log("========================================\n")

if (failed > 0) {
  process.exit(1)
}
