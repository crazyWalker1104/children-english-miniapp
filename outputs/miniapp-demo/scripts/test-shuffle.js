/**
 * utils/shuffle.js 测试
 * 测试 Fisher-Yates 洗牌算法的正确性
 */

var assert = require("assert")
var { shuffle } = require("../utils/shuffle")

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

console.log("\nshuffle 测试")

test("不修改原数组", function () {
  var original = [1, 2, 3, 4, 5]
  var copy = original.slice()
  shuffle(original)
  assert.deepStrictEqual(original, copy)
})

test("返回数组长度不变", function () {
  var input = [1, 2, 3, 4, 5, 6, 7]
  var result = shuffle(input)
  assert.strictEqual(result.length, input.length)
})

test("返回数组包含相同元素（无丢失无新增）", function () {
  var input = [3, 1, 4, 1, 5, 9, 2, 6]
  var result = shuffle(input)
  var sortedInput = input.slice().sort()
  var sortedResult = result.slice().sort()
  assert.deepStrictEqual(sortedResult, sortedInput)
})

test("空数组返回空数组", function () {
  var result = shuffle([])
  assert.deepStrictEqual(result, [])
})

test("单元素数组返回相同单元素数组", function () {
  var result = shuffle([42])
  assert.deepStrictEqual(result, [42])
})

console.log("\n========================================")
console.log("测试结果: " + passed + " 通过, " + failed + " 失败")
console.log("========================================\n")

if (failed > 0) {
  process.exit(1)
}
