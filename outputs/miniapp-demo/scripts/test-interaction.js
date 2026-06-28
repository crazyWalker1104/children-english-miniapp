/**
 * utils/interaction.js 测试
 * 测试触觉反馈控制：hapticEnabled 开关、calmMode 禁用、三种反馈类型
 */

var assert = require("assert")

// 注入 wx mock
var mockStorage = {}
var lastVibrateCall = null

global.wx = {
  getStorageSync: function (key) { return mockStorage[key] || null },
  setStorageSync: function (key, val) { mockStorage[key] = val },
  removeStorageSync: function (key) { delete mockStorage[key] },
  vibrateShort: function (options) { lastVibrateCall = options },
  canIUse: function () { return true }
}

var { getParentSettings, saveParentSettings } = require("../utils/settings")
var { feedbackSuccess, feedbackComplete, feedbackError } = require("../utils/interaction")

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

function resetState() {
  mockStorage = {}
  lastVibrateCall = null
}

console.log("\ninteraction 测试")

test("feedbackSuccess在默认设置下触发light振动", function () {
  resetState()
  saveParentSettings({ hapticEnabled: true, calmMode: false })
  feedbackSuccess()
  assert.ok(lastVibrateCall, "未调用vibrateShort")
  assert.strictEqual(lastVibrateCall.type, "light")
})

test("feedbackComplete在默认设置下触发medium振动", function () {
  resetState()
  saveParentSettings({ hapticEnabled: true, calmMode: false })
  feedbackComplete()
  assert.ok(lastVibrateCall, "未调用vibrateShort")
  assert.strictEqual(lastVibrateCall.type, "medium")
})

test("feedbackError在默认设置下触发heavy振动", function () {
  resetState()
  saveParentSettings({ hapticEnabled: true, calmMode: false })
  feedbackError()
  assert.ok(lastVibrateCall, "未调用vibrateShort")
  assert.strictEqual(lastVibrateCall.type, "heavy")
})

test("hapticEnabled关闭时不触发振动", function () {
  resetState()
  saveParentSettings({ hapticEnabled: false, calmMode: false })
  feedbackSuccess()
  assert.strictEqual(lastVibrateCall, null, "hapticEnabled关闭时仍触发了振动")
})

test("calmMode开启时不触发振动", function () {
  resetState()
  saveParentSettings({ hapticEnabled: true, calmMode: true })
  feedbackSuccess()
  assert.strictEqual(lastVibrateCall, null, "calmMode开启时仍触发了振动")
})

console.log("\n========================================")
console.log("测试结果: " + passed + " 通过, " + failed + " 失败")
console.log("========================================\n")

if (failed > 0) {
  process.exit(1)
}
