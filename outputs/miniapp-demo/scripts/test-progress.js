/**
 * utils/progress.js 测试
 * 测试学习记录的创建、更新、归档、周报汇总
 */

var assert = require("assert")

// 注入 wx mock
var mockStorage = {}
global.wx = {
  getStorageSync: function (key) { return mockStorage[key] || null },
  setStorageSync: function (key, val) { mockStorage[key] = val },
  removeStorageSync: function (key) { delete mockStorage[key] }
}

var progress = require("../utils/progress")

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

function resetStorage() {
  mockStorage = {}
}

console.log("\nprogress 测试")

test("ensureTodayRecord首次调用创建空记录", function () {
  resetStorage()
  var record = progress.ensureTodayRecord()
  assert.ok(record)
  assert.strictEqual(record.durationSeconds, 0)
  assert.strictEqual(record.completedTaskIds.length, 0)
  assert.strictEqual(record.heardWords.length, 0)
  assert.strictEqual(record.speakCount, 0)
  assert.strictEqual(record.rewards.length, 0)
  assert.ok(record.date, "记录应包含日期")
})

test("completeTask添加任务ID和奖励", function () {
  resetStorage()
  progress.ensureTodayRecord()
  var record = progress.completeTask("task-1", "star")
  assert.strictEqual(record.completedTaskIds.length, 1)
  assert.strictEqual(record.completedTaskIds[0], "task-1")
  assert.strictEqual(record.rewards.length, 1)
  assert.strictEqual(record.rewards[0], "star")
})

test("completeTask对相同任务ID去重", function () {
  resetStorage()
  progress.ensureTodayRecord()
  progress.completeTask("task-1", "star")
  var record = progress.completeTask("task-1", "star")
  assert.strictEqual(record.completedTaskIds.length, 1, "重复任务ID未去重")
  assert.strictEqual(record.rewards.length, 1, "重复奖励未去重")
})

test("hearWord添加听到的单词", function () {
  resetStorage()
  progress.ensureTodayRecord()
  var record = progress.hearWord("hello")
  assert.strictEqual(record.heardWords.length, 1)
  assert.strictEqual(record.heardWords[0], "hello")
})

test("hearWord对相同单词去重", function () {
  resetStorage()
  progress.ensureTodayRecord()
  progress.hearWord("hello")
  var record = progress.hearWord("hello")
  assert.strictEqual(record.heardWords.length, 1, "重复单词未去重")
})

test("playSong累加歌曲播放次数", function () {
  resetStorage()
  progress.ensureTodayRecord()
  progress.playSong("abc-song")
  var record = progress.playSong("abc-song")
  assert.strictEqual(record.songPlayCounts["abc-song"], 2)
  var record2 = progress.playSong("twinkle")
  assert.strictEqual(record2.songPlayCounts["twinkle"], 1)
  assert.strictEqual(record2.songPlayCounts["abc-song"], 2)
})

test("addSpeakCount递增跟读次数", function () {
  resetStorage()
  progress.ensureTodayRecord()
  progress.addSpeakCount()
  progress.addSpeakCount()
  var record = progress.addSpeakCount()
  assert.strictEqual(record.speakCount, 3)
})

test("addStudySeconds累加学习时长且不接受负数", function () {
  resetStorage()
  progress.ensureTodayRecord()
  progress.addStudySeconds(60)
  var record = progress.addStudySeconds(30)
  assert.strictEqual(record.durationSeconds, 90)
  // 负数应被截断为0
  record = progress.addStudySeconds(-50)
  assert.strictEqual(record.durationSeconds, 90, "负数时长被错误累加")
})

test("getWeeklySummary返回7天内的记录汇总", function () {
  resetStorage()
  progress.ensureTodayRecord()
  progress.completeTask("task-1", "star")
  progress.addStudySeconds(120)
  progress.addSpeakCount()

  var summary = progress.getWeeklySummary()
  assert.ok(summary.records.length >= 1)
  assert.ok(summary.records.length <= 7)
  assert.strictEqual(summary.totalTaskCount, 1)
  assert.strictEqual(summary.totalRewardCount, 1)
  assert.ok(summary.totalDurationMinutes >= 2) // 120秒 = 2分钟
  assert.ok(summary.activeDays >= 1)
})

console.log("\n========================================")
console.log("测试结果: " + passed + " 通过, " + failed + " 失败")
console.log("========================================\n")

if (failed > 0) {
  process.exit(1)
}
