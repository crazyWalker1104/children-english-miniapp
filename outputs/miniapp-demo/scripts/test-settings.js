/**
 * utils/settings.js 测试
 * 测试家长设置的默认值、保存、更新、合并逻辑
 */

var assert = require("assert")

// 注入 wx mock
var mockStorage = {}
global.wx = {
  getStorageSync: function (key) { return mockStorage[key] || null },
  setStorageSync: function (key, val) { mockStorage[key] = val },
  removeStorageSync: function (key) { delete mockStorage[key] }
}

// 在 wx 注入后 require 模块
var { getParentSettings, saveParentSettings, updateParentSetting } = require("../utils/settings")

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

console.log("\nsettings 测试")

test("无保存数据时返回默认设置", function () {
  mockStorage = {}
  var settings = getParentSettings()
  assert.strictEqual(settings.soundEnabled, true)
  assert.strictEqual(settings.hapticEnabled, true)
  assert.strictEqual(settings.calmMode, false)
  assert.strictEqual(settings.dailyLimitMinutes, 15)
})

test("saveParentSettings保存并返回合并后的设置", function () {
  mockStorage = {}
  var settings = saveParentSettings({ soundEnabled: false })
  assert.strictEqual(settings.soundEnabled, false)
  // 其他字段应保持默认
  assert.strictEqual(settings.hapticEnabled, true)
  assert.strictEqual(settings.calmMode, false)
  assert.strictEqual(settings.dailyLimitMinutes, 15)
})

test("getParentSettings读取已保存的设置", function () {
  mockStorage = {}
  saveParentSettings({ calmMode: true, dailyLimitMinutes: 20 })
  var settings = getParentSettings()
  assert.strictEqual(settings.calmMode, true)
  assert.strictEqual(settings.dailyLimitMinutes, 20)
  // 未修改的字段保持默认
  assert.strictEqual(settings.soundEnabled, true)
})

test("updateParentSetting更新单个字段", function () {
  mockStorage = {}
  saveParentSettings({ soundEnabled: true, hapticEnabled: true })
  var settings = updateParentSetting("soundEnabled", false)
  assert.strictEqual(settings.soundEnabled, false)
  assert.strictEqual(settings.hapticEnabled, true)
})

test("saveParentSettings传入null时回退到默认值", function () {
  mockStorage = {}
  var settings = saveParentSettings(null)
  assert.strictEqual(settings.soundEnabled, true)
  assert.strictEqual(settings.hapticEnabled, true)
  assert.strictEqual(settings.calmMode, false)
  assert.strictEqual(settings.dailyLimitMinutes, 15)
})

console.log("\n========================================")
console.log("测试结果: " + passed + " 通过, " + failed + " 失败")
console.log("========================================\n")

if (failed > 0) {
  process.exit(1)
}
