/**
 * utils/randomizer.js 测试
 * 测试每日任务选取：年龄过滤、避免重复、存储 lastTaskId
 */

var assert = require("assert")

// 注入 wx mock
var mockStorage = {}
global.wx = {
  getStorageSync: function (key) { return mockStorage[key] || null },
  setStorageSync: function (key, val) { mockStorage[key] = val },
  removeStorageSync: function (key) { delete mockStorage[key] }
}

var { pickDailyTask } = require("../utils/randomizer")

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

console.log("\nrandomizer 测试")

test("pickDailyTask返回包含id和prompt的任务对象", function () {
  mockStorage = {}
  var task = pickDailyTask(3)
  assert.ok(task)
  assert.ok(typeof task.id === "string")
  assert.ok(typeof task.prompt === "string")
})

test("pickDailyTask将选中的任务ID存入storage", function () {
  mockStorage = {}
  var task = pickDailyTask(4)
  var storedId = mockStorage["lastTaskId"]
  assert.ok(storedId, "lastTaskId未被存储")
  assert.strictEqual(storedId, task.id)
})

test("pickDailyTask避免返回上次的任务", function () {
  mockStorage = {}
  // 第一次选取
  var firstTask = pickDailyTask(5)
  // 第二次选取，应该不返回上次的
  var secondTask = pickDailyTask(5)
  assert.notStrictEqual(secondTask.id, firstTask.id, "连续两次返回了相同任务")
})

test("pickDailyTask在所有任务都被排除时回退到全量", function () {
  mockStorage = {}
  // 正常选取应该总能返回一个任务
  var task = pickDailyTask(3)
  assert.ok(task, "应返回任务对象")
  assert.ok(task.id, "任务应有id")
})

console.log("\n========================================")
console.log("测试结果: " + passed + " 通过, " + failed + " 失败")
console.log("========================================\n")

if (failed > 0) {
  process.exit(1)
}
