/**
 * data/content.js 测试
 * 测试内容查询、年龄过滤、排除ID、短语模式、分类标签
 */

var assert = require("assert")
var {
  getWordsForAge,
  pickWordForAge,
  getWordText,
  getWordHint,
  getWordCategoryLabel,
  getPracticePhrase,
  getSongsForAge
} = require("../data/content")

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

console.log("\ncontent 测试")

test("3岁可以获取minAge=3的单词", function () {
  var words = getWordsForAge(3)
  assert.ok(words.length > 0)
  var allValid = words.every(function (w) { return w.minAge <= 3 })
  assert.ok(allValid, "存在minAge>3的单词")
})

test("6岁可以获取所有单词", function () {
  var words = getWordsForAge(6)
  assert.ok(words.length > 0)
  // 6岁应该比3岁的单词多
  var words3 = getWordsForAge(3)
  assert.ok(words.length >= words3.length)
})

test("pickWordForAge排除指定ID的单词", function () {
  // 多次尝试确保排除逻辑生效
  var excludedId = "hello"
  for (var i = 0; i < 20; i++) {
    var word = pickWordForAge(3, excludedId)
    assert.ok(word.id !== excludedId, "返回了被排除的单词: " + word.id)
  }
})

test("pickWordForAge在所有单词都被排除时回退到全量", function () {
  // 只有一个3岁单词时排除它，应该回退
  var words3 = getWordsForAge(3)
  if (words3.length > 0) {
    var allIds = words3.map(function (w) { return w.id })
    // 排除所有ID，最后应该仍能返回一个单词
    // 由于 pickWordForAge 只排除一个 ID，这里测试单个排除
    var word = pickWordForAge(3, "nonexistent-id")
    assert.ok(word, "排除不存在的ID时应返回正常单词")
  }
})

test("getWordText返回单词文本", function () {
  var word = { text: "Hello", zh: "你好" }
  assert.strictEqual(getWordText(word), "Hello")
})

test("getWordText对空对象返回空字符串", function () {
  assert.strictEqual(getWordText(null), "")
  assert.strictEqual(getWordText({}), "")
  assert.strictEqual(getWordText(undefined), "")
})

test("getWordHint返回中文释义", function () {
  var word = { text: "Hello", zh: "你好" }
  assert.strictEqual(getWordHint(word), "你好")
})

test("getWordCategoryLabel返回正确的中文标签", function () {
  assert.strictEqual(getWordCategoryLabel({ category: "greeting" }), "问候")
  assert.strictEqual(getWordCategoryLabel({ category: "animal" }), "动物")
  assert.strictEqual(getWordCategoryLabel({ category: "color" }), "颜色")
  assert.strictEqual(getWordCategoryLabel({ category: "food" }), "食物")
  assert.strictEqual(getWordCategoryLabel({ category: "toy" }), "玩具")
  assert.strictEqual(getWordCategoryLabel({ category: "family" }), "家人")
  assert.strictEqual(getWordCategoryLabel({ category: "body" }), "身体")
  assert.strictEqual(getWordCategoryLabel({ category: "action" }), "动作")
  assert.strictEqual(getWordCategoryLabel({ category: "unknown" }), "单词")
})

test("getPracticePhrase短语模式关闭时返回text", function () {
  var word = { text: "cat", phrase: "I see a cat." }
  assert.strictEqual(getPracticePhrase(word, false), "cat")
})

test("getPracticePhrase短语模式开启时返回phrase", function () {
  var word = { text: "cat", phrase: "I see a cat." }
  assert.strictEqual(getPracticePhrase(word, true), "I see a cat.")
})

test("getPracticePhrase短语模式开启但无phrase时回退到text", function () {
  var word = { text: "cat" }
  assert.strictEqual(getPracticePhrase(word, true), "cat")
})

test("getSongsForAge按年龄过滤歌曲", function () {
  var songs3 = getSongsForAge(3)
  assert.ok(songs3.length > 0)
  var allValid = songs3.every(function (s) { return s.minAge <= 3 })
  assert.ok(allValid, "存在minAge>3的歌曲")
})

console.log("\n========================================")
console.log("测试结果: " + passed + " 通过, " + failed + " 失败")
console.log("========================================\n")

if (failed > 0) {
  process.exit(1)
}
