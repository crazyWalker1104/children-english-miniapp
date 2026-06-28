/**
 * 内容导入脚本测试
 *
 * 运行方式：
 *   node scripts/test-import.js
 *
 * 测试范围：
 * - parseCsv：正常/带引号/BOM/空行
 * - normalizeId：各种输入格式
 * - normalizeAge：有效/无效年龄
 * - normalizeWord：完整/缺字段/pending 状态
 * - normalizeSong + buildLine：完整/缺字段/pending 状态
 * - mergeWords / mergeSongs：新增/更新/重复检测
 */

var assert = require("assert")
var path = require("path")

var wordImporter = require("../data/import-words")
var songImporter = require("../data/import-songs")

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

function assertThrows(fn, expectedMessagePart) {
  var threw = false
  try {
    fn()
  } catch (err) {
    threw = true
    if (expectedMessagePart && err.message.indexOf(expectedMessagePart) < 0) {
      throw new Error("Expected error containing '" + expectedMessagePart + "' but got: " + err.message)
    }
  }
  if (!threw) {
    throw new Error("Expected function to throw")
  }
}

// ===== parseCsv 测试 =====

console.log("\nparseCsv 测试")

test("正常 CSV 解析出正确的行数和字段", function () {
  var csv = "id,text,zh\nhello,Hello,你好\nbye,Bye,再见"
  var rows = wordImporter.parseCsv(csv)
  assert.strictEqual(rows.length, 2)
  assert.strictEqual(rows[0].id, "hello")
  assert.strictEqual(rows[0].text, "Hello")
  assert.strictEqual(rows[0].zh, "你好")
  assert.strictEqual(rows[1].id, "bye")
})

test("带引号的 CSV 字段正确解析", function () {
  var csv = 'id,text,zh\nhello,"Hello, World",你好'
  var rows = wordImporter.parseCsv(csv)
  assert.strictEqual(rows[0].text, "Hello, World")
})

test("双引号转义正确解析", function () {
  var csv = 'id,text,zh\nhello,"Say ""Hi""",你好'
  var rows = wordImporter.parseCsv(csv)
  assert.strictEqual(rows[0].text, 'Say "Hi"')
})

test("BOM 头被正确移除", function () {
  var csv = "\uFEFFid,text,zh\nhello,Hello,你好"
  var rows = wordImporter.parseCsv(csv)
  assert.strictEqual(rows[0].id, "hello")
})

test("空行被过滤", function () {
  var csv = "id,text,zh\nhello,Hello,你好\n\n\nbye,Bye,再见"
  var rows = wordImporter.parseCsv(csv)
  assert.strictEqual(rows.length, 2)
})

test("空 CSV 抛出错误", function () {
  assertThrows(wordImporter.parseCsv.bind(null, ""), "CSV is empty")
})

test("song CSV 同样使用 parseCsv 正常解析", function () {
  var csv = "id,title,zh\nabc,ABC Song,字母歌"
  var rows = songImporter.parseCsv(csv)
  assert.strictEqual(rows.length, 1)
  assert.strictEqual(rows[0].title, "ABC Song")
})

// ===== normalizeId 测试 =====

console.log("\nnormalizeId 测试")

test("小写化并去除特殊字符", function () {
  assert.strictEqual(wordImporter.normalizeId("Hello World!"), "hello-world")
})

test("空字符串返回空", function () {
  assert.strictEqual(wordImporter.normalizeId(""), "")
})

test("前后连字符被去除", function () {
  assert.strictEqual(wordImporter.normalizeId("--test--"), "test")
})

// ===== normalizeAge 测试 =====

console.log("\nnormalizeAge 测试")

test("有效年龄 3-6 正常返回", function () {
  assert.strictEqual(wordImporter.normalizeAge("3", 2), 3)
  assert.strictEqual(wordImporter.normalizeAge("6", 2), 6)
})

test("年龄小于 3 抛出错误", function () {
  assertThrows(wordImporter.normalizeAge.bind(null, "2", 2), "minAge must be")
})

test("年龄大于 6 抛出错误", function () {
  assertThrows(wordImporter.normalizeAge.bind(null, "7", 2), "minAge must be")
})

test("非整数年龄抛出错误", function () {
  assertThrows(wordImporter.normalizeAge.bind(null, "abc", 2), "minAge must be")
})

// ===== normalizeWord 测试 =====

console.log("\nnormalizeWord 测试")

test("完整字段返回正确的 word 对象", function () {
  var row = { _rowNumber: 2, id: "cat", text: "cat", zh: "猫", category: "animal", minAge: "3", phrase: "I see a cat.", status: "approved" }
  var word = wordImporter.normalizeWord(row)
  assert.strictEqual(word.id, "cat")
  assert.strictEqual(word.text, "cat")
  assert.strictEqual(word.zh, "猫")
  assert.strictEqual(word.category, "animal")
  assert.strictEqual(word.minAge, 3)
  assert.strictEqual(word.phrase, "I see a cat.")
})

test("phrase 缺省时回退到 text", function () {
  var row = { _rowNumber: 2, id: "dog", text: "dog", zh: "狗", category: "animal", minAge: "4" }
  var word = wordImporter.normalizeWord(row)
  assert.strictEqual(word.phrase, "dog")
})

test("status 为 pending 时返回 null", function () {
  var row = { _rowNumber: 2, id: "fish", text: "fish", zh: "鱼", category: "animal", minAge: "3", status: "pending" }
  var word = wordImporter.normalizeWord(row)
  assert.strictEqual(word, null)
})

test("缺少必填字段抛出错误", function () {
  var row = { _rowNumber: 3, id: "bird", text: "bird", zh: "", category: "animal", minAge: "3" }
  assertThrows(wordImporter.normalizeWord.bind(null, row), "id/text/zh/category are required")
})

// ===== normalizeSong + buildLine 测试 =====

console.log("\nnormalizeSong 测试")

test("完整 song 返回正确对象含歌词行", function () {
  var row = {
    _rowNumber: 2,
    id: "rainbow",
    title: "Rainbow Song",
    zh: "彩虹歌",
    action: "Point colors!",
    minAge: "3",
    audioKey: "rainbow-song",
    line1Text: "Red and yellow",
    line1Action: "point",
    line2Text: "Green and blue",
    line2Action: "wave",
    line3Text: "",
    line3Action: "",
    status: "approved"
  }
  var song = songImporter.normalizeSong(row)
  assert.strictEqual(song.id, "rainbow")
  assert.strictEqual(song.title, "Rainbow Song")
  assert.strictEqual(song.lines.length, 2)
  assert.strictEqual(song.lines[0].text, "Red and yellow")
  assert.strictEqual(song.lines[0].action, "point")
  assert.strictEqual(song.audioKey, "rainbow-song")
})

test("audioKey 缺省时回退到 id", function () {
  var row = {
    _rowNumber: 2,
    id: "abc-song",
    title: "ABC Song",
    zh: "字母歌",
    action: "Sing along!",
    minAge: "3",
    line1Text: "A B C D E F G",
    line1Action: "sing"
  }
  var song = songImporter.normalizeSong(row)
  assert.strictEqual(song.audioKey, "abc-song")
})

test("缺少歌词行抛出错误", function () {
  var row = {
    _rowNumber: 3,
    id: "empty",
    title: "Empty Song",
    zh: "空歌",
    action: "Nothing",
    minAge: "3",
    line1Text: "",
    line1Action: "",
    line2Text: "",
    line2Action: "",
    line3Text: "",
    line3Action: ""
  }
  assertThrows(songImporter.normalizeSong.bind(null, row), "at least one lyric line")
})

test("status 为 pending 时 song 返回 null", function () {
  var row = {
    _rowNumber: 2,
    id: "pending-song",
    title: "Pending",
    zh: "待定",
    action: "Wait",
    minAge: "3",
    line1Text: "La la la",
    line1Action: "sing",
    status: "pending"
  }
  var song = songImporter.normalizeSong(row)
  assert.strictEqual(song, null)
})

test("buildLine 缺少 text 或 action 返回 null", function () {
  assert.strictEqual(songImporter.buildLine("s1", 1, "", "sing"), null)
  assert.strictEqual(songImporter.buildLine("s1", 1, "La la la", ""), null)
})

// ===== mergeWords 测试 =====

console.log("\nmergeWords 测试")

test("新 word 被追加到已有列表", function () {
  var existing = [{ id: "cat", text: "cat", zh: "猫", category: "animal", minAge: 3, phrase: "I see a cat." }]
  var imported = [{ id: "dog", text: "dog", zh: "狗", category: "animal", minAge: 4, phrase: "I see a dog." }]
  var merged = wordImporter.mergeWords(existing, imported)
  assert.strictEqual(merged.length, 2)
})

test("同 id 的 word 被更新而非追加", function () {
  var existing = [{ id: "cat", text: "cat", zh: "猫", category: "animal", minAge: 3, phrase: "I see a cat." }]
  var imported = [{ id: "cat", text: "cat", zh: "小猫", category: "animal", minAge: 3, phrase: "I see a cat." }]
  var merged = wordImporter.mergeWords(existing, imported)
  assert.strictEqual(merged.length, 1)
  assert.strictEqual(merged[0].zh, "小猫")
})

test("导入列表中有重复 id 抛出错误", function () {
  var existing = []
  var imported = [
    { id: "dup", text: "dup", zh: "重复", category: "animal", minAge: 3, phrase: "dup" },
    { id: "dup", text: "dup", zh: "重复2", category: "animal", minAge: 3, phrase: "dup" }
  ]
  assertThrows(wordImporter.mergeWords.bind(null, existing, imported), "duplicate approved word id")
})

// ===== mergeSongs 测试 =====

console.log("\nmergeSongs 测试")

test("新 song 被追加到已有列表", function () {
  var existing = [{ id: "abc", title: "ABC", zh: "字母歌", action: "sing", minAge: 3, audioKey: "abc", lines: [{ id: "abc-1", text: "A B C", action: "sing" }] }]
  var imported = [{ id: "twinkle", title: "Twinkle", zh: "小星星", action: "wave", minAge: 3, audioKey: "twinkle", lines: [{ id: "twinkle-1", text: "Twinkle twinkle", action: "wave" }] }]
  var merged = songImporter.mergeSongs(existing, imported)
  assert.strictEqual(merged.length, 2)
})

test("同 id 的 song 被更新而非追加", function () {
  var existing = [{ id: "abc", title: "ABC", zh: "字母歌", action: "sing", minAge: 3, audioKey: "abc", lines: [{ id: "abc-1", text: "A B C", action: "sing" }] }]
  var imported = [{ id: "abc", title: "ABC Song", zh: "字母歌新版", action: "sing", minAge: 3, audioKey: "abc", lines: [{ id: "abc-1", text: "A B C D", action: "sing" }] }]
  var merged = songImporter.mergeSongs(existing, imported)
  assert.strictEqual(merged.length, 1)
  assert.strictEqual(merged[0].title, "ABC Song")
  assert.strictEqual(merged[0].zh, "字母歌新版")
})

test("导入列表中有重复 song id 抛出错误", function () {
  var existing = []
  var imported = [
    { id: "dup", title: "Dup1", zh: "重复", action: "sing", minAge: 3, audioKey: "dup", lines: [{ id: "dup-1", text: "La", action: "sing" }] },
    { id: "dup", title: "Dup2", zh: "重复2", action: "sing", minAge: 3, audioKey: "dup", lines: [{ id: "dup-1", text: "La", action: "sing" }] }
  ]
  assertThrows(songImporter.mergeSongs.bind(null, existing, imported), "duplicate approved song id")
})

// ===== 结果汇总 =====

console.log("\n========================================")
console.log("测试结果: " + passed + " 通过, " + failed + " 失败")
console.log("========================================\n")

if (failed > 0) {
  process.exit(1)
}
