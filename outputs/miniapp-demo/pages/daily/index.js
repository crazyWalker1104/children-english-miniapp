const { colors, words } = require("../../data/tasks")
const { getAgeLevel } = require("../../utils/age")
const { pickDailyTask } = require("../../utils/randomizer")
const { completeTask, hearWord, addStudySeconds } = require("../../utils/progress")
const { playText } = require("../../utils/audio")
const { feedbackSuccess, feedbackComplete, feedbackError } = require("../../utils/interaction")
const { getCurrentLayoutMode, getResizeLayoutMode } = require("../../utils/layout")
const { shuffle } = require("../../utils/shuffle")
const { encourage, encourageComplete, encourageRetry } = require("../../utils/encouragement")

const SESSION_GOAL = 3
const DEFAULT_CHOICE_EMOJI = "✨"
const WORD_EMOJI = {
  animal: "🐾", action: "👏", art: "⭐", color: "🎨", daily: "📘",
  family: "🏠", food: "🍪", greeting: "👋", toy: "🧸", body: "🫳"
}

function getWordChoice(word, taskTarget) {
  return {
    id: word.id,
    label: word.text,
    emoji: WORD_EMOJI[word.category] || DEFAULT_CHOICE_EMOJI,
    correct: word.id === taskTarget || word.text === taskTarget
  }
}

function buildWordChoices(task, choiceCount) {
  const correctWord = words.find(function (word) {
    return word.id === task.target || word.text === task.target
  })
  if (!correctWord) return []
  const rest = shuffle(words.filter(function (word) {
    return word.id !== correctWord.id && word.minAge <= task.maxAge
  }))
  return shuffle([correctWord].concat(rest).slice(0, choiceCount)).map(function (word) {
    return getWordChoice(word, correctWord.id)
  })
}

function buildChoices(task, choiceCount) {
  var wordChoices = buildWordChoices(task, choiceCount)
  if (wordChoices.length) return wordChoices
  var correct = colors.find(function (color) { return color.id === task.target })
  if (correct) {
    var rest = shuffle(colors.filter(function (color) { return color.id !== correct.id }))
    return shuffle([correct].concat(rest).slice(0, choiceCount)).map(function (choice) {
      return { id: choice.id, label: choice.label, emoji: choice.emoji, correct: choice.id === correct.id }
    })
  }
  return [{ id: task.target || "unknown", label: task.target || "surprise", emoji: DEFAULT_CHOICE_EMOJI, correct: true }]
}

// 找一找：生成一个隐藏物品的网格
function buildFindItems(task) {
  const correctItem = { id: task.target, label: task.target, emoji: WORD_EMOJI[task.type] || "🎯", correct: true }
  const distractors = shuffle([
    { id: "dist-1", label: "ball", emoji: "⚽", correct: false },
    { id: "dist-2", label: "star", emoji: "⭐", correct: false },
    { id: "dist-3", label: "cup", emoji: "☕", correct: false },
    { id: "dist-4", label: "book", emoji: "📖", correct: false },
    { id: "dist-5", label: "flower", emoji: "🌻", correct: false }
  ]).slice(0, 5)
  return shuffle([correctItem].concat(distractors))
}

// 单词气泡：多个气泡中选正确的
function buildBubbleItems(task) {
  const correctKey = task.target
  var distractors = []
  if (task.type === "word-bubble") {
    var rest = shuffle(words.filter(function (w) { return w.text !== correctKey && w.category === "greeting" }))
    distractors = rest.slice(0, 2).map(function (w) { return { id: w.id, label: w.text, correct: false } })
  } else {
    distractors = [
      { id: "b-d1", label: "Hello", correct: false },
      { id: "b-d2", label: "Bye", correct: false }
    ]
  }
  return shuffle([{ id: correctKey, label: correctKey, correct: true }].concat(distractors))
}

// 颜色配对：匹配颜色名到颜色
function buildColorMatchItems(task) {
  var correct = colors.find(function (c) { return c.id === task.target })
  if (!correct) correct = { id: task.target, label: task.target, color: "#ccc", emoji: "🎨" }
  var rest = shuffle(colors.filter(function (c) { return c.id !== correct.id })).slice(0, 3)
  return shuffle([correct].concat(rest)).map(function (c) {
    return { id: c.id, label: c.label, color: c.color, emoji: c.emoji, correct: c.id === correct.id }
  })
}

// 听音选图：播放音频后选图
function buildListenMatchItems(task) {
  var correct = words.find(function (w) { return w.id === task.target || w.text === task.target })
  if (!correct) correct = { id: task.target, text: task.target, category: "animal" }
  var rest = shuffle(words.filter(function (w) {
    return w.id !== correct.id && w.category === correct.category
  })).slice(0, 3)
  return shuffle([correct].concat(rest)).map(function (w) {
    return { id: w.id, label: w.text, emoji: WORD_EMOJI[w.category] || "🎵", correct: w.id === correct.id }
  })
}

function buildProgressDots(completedRounds) {
  return Array.from({ length: SESSION_GOAL }).map(function (_, index) {
    var step = index + 1
    return { id: "step-" + step, active: step <= completedRounds }
  })
}

function getChallengeLabel(roundIndex, ageLevel) {
  var labels = [
    "先听一听，再点一点",
    ageLevel.phraseMode ? "加一点短句提示" : "换一个惊喜画面",
    ageLevel.phraseMode ? "最后一题，说完再选" : "最后一题，找得更快"
  ]
  return labels[roundIndex] || labels[labels.length - 1]
}

Page({
  data: {
    task: {},
    choices: [],
    feedback: "",
    ageLabel: "",
    challengeLabel: "",
    completedRounds: 0,
    progressDots: buildProgressDots(0),
    completed: false,
    sessionComplete: false,
    layoutMode: "mobile",
    taskType: "color",
    showHint: false,
    findItems: [],
    bubbleItems: [],
    colorItems: [],
    listenItems: []
  },

  onLoad() {
    this.setData({ layoutMode: getCurrentLayoutMode() })
    this.setTaskForRound(0)
  },

  onResize(resizeInfo) {
    this.setData({ layoutMode: getResizeLayoutMode(resizeInfo) })
  },

  setTaskForRound(roundIndex) {
    var app = getApp()
    var level = getAgeLevel(app.globalData.childProfile.age)
    var task = pickDailyTask(app.globalData.childProfile.age)
    var taskType = task.type || "color"

    this.setData({
      task, taskType,
      choices: buildChoices(task, level.choiceCount),
      findItems: buildFindItems(task),
      bubbleItems: buildBubbleItems(task),
      colorItems: buildColorMatchItems(task),
      listenItems: buildListenMatchItems(task),
      feedback: "", ageLabel: level.label,
      challengeLabel: getChallengeLabel(roundIndex, level),
      completed: false, sessionComplete: false, showHint: false
    })
    playText(task.prompt)
  },

  pickTask() {
    if (this.data.completedRounds >= SESSION_GOAL) {
      this.setData({ completedRounds: 0, progressDots: buildProgressDots(0) })
      this.setTaskForRound(0)
      return
    }
    this.setTaskForRound(this.data.completedRounds)
  },

  choose(event) {
    if (this.data.completed) return
    var id = event.currentTarget.dataset.id
    var selected = this.data.choices.find(function (c) { return c.id === id })
    if (selected && selected.correct) { this.handleCorrect(); return }
    this.handleWrong()
  },

  tapFindItem(event) {
    if (this.data.completed) return
    var id = event.currentTarget.dataset.id
    var item = this.data.findItems.find(function (f) { return f.id === id })
    item && item.correct ? this.handleCorrect() : this.handleWrong()
  },

  tapBubble(event) {
    if (this.data.completed) return
    var id = event.currentTarget.dataset.id
    var item = this.data.bubbleItems.find(function (b) { return b.id === id })
    item && item.correct ? this.handleCorrect() : this.handleWrong()
  },

  tapColorMatch(event) {
    if (this.data.completed) return
    var id = event.currentTarget.dataset.id
    var item = this.data.colorItems.find(function (c) { return c.id === id })
    item && item.correct ? this.handleCorrect() : this.handleWrong()
  },

  tapListenMatch(event) {
    if (this.data.completed) return
    var id = event.currentTarget.dataset.id
    var item = this.data.listenItems.find(function (l) { return l.id === id })
    item && item.correct ? this.handleCorrect() : this.handleWrong()
  },

  replayAudio() {
    if (this.data.task.prompt) playText(this.data.task.target)
  },

  showHintTap() {
    this.setData({ showHint: true })
  },

  handleCorrect() {
    var completedRounds = Math.min(this.data.completedRounds + 1, SESSION_GOAL)
    var sessionComplete = completedRounds === SESSION_GOAL
    completeTask(this.data.task.id, this.data.task.reward)
    hearWord(this.data.task.target)
    addStudySeconds(20)
    var msg = sessionComplete ? encourageComplete() : encourage()
    this.setData({
      feedback: msg, completed: true, completedRounds,
      progressDots: buildProgressDots(completedRounds), sessionComplete
    })
    sessionComplete ? feedbackComplete() : feedbackSuccess()
    playText(msg)
  },

  handleWrong() {
    this.setData({ feedback: encourageRetry() })
    feedbackError()
    playText("Try again!")
  },

  back() {
    wx.navigateBack()
  }
})