const {
  getWordsForAge,
  pickWordForAge,
  getWordText,
  getWordHint,
  getWordCategoryLabel,
  getPracticePhrase
} = require("../../data/content")
const { hearWord, addSpeakCount, addStudySeconds } = require("../../utils/progress")
const { playText } = require("../../utils/audio")
const { getAgeLevel } = require("../../utils/age")
const { feedbackSuccess, feedbackComplete, feedbackError } = require("../../utils/interaction")
const { getCurrentLayoutMode, getResizeLayoutMode } = require("../../utils/layout")
const { encourage, encourageComplete } = require("../../utils/encouragement")

const PRACTICE_STEPS = [
  { id: "listen", label: "Listen", done: false },
  { id: "say", label: "Say", done: false },
  { id: "smile", label: "Smile", done: false }
]

function buildSteps(doneCount) {
  return PRACTICE_STEPS.map(function (step, index) {
    return {
      ...step,
      done: index < doneCount,
      active: index === doneCount
    }
  })
}

Page({
  data: {
    word: {},
    wordText: "",
    wordHint: "",
    wordCategory: "",
    lastWordId: "",
    practicePhrase: "",
    stepCount: 0,
    steps: buildSteps(0),
    feedback: "Listen and say",
    layoutMode: "mobile"
  },

  onLoad() {
    const app = getApp()
    const word = getWordsForAge(app.globalData.childProfile.age)[0]

    this.setData({
      layoutMode: getCurrentLayoutMode(),
      word,
      wordText: getWordText(word),
      wordHint: getWordHint(word),
      wordCategory: getWordCategoryLabel(word),
      lastWordId: word.id,
      practicePhrase: getPracticePhrase(word, false)
    })
  },

  onShow() {
    this.refreshPhrase()
  },

  onResize(resizeInfo) {
    this.setData({
      layoutMode: getResizeLayoutMode(resizeInfo)
    })
  },

  refreshPhrase() {
    const app = getApp()
    const level = getAgeLevel(app.globalData.childProfile.age)
    this.setData({
      wordText: getWordText(this.data.word),
      wordHint: getWordHint(this.data.word),
      wordCategory: getWordCategoryLabel(this.data.word),
      practicePhrase: getPracticePhrase(this.data.word, level.phraseMode)
    })
  },

  nextWord() {
    const app = getApp()
    const level = getAgeLevel(app.globalData.childProfile.age)
    const word = pickWordForAge(app.globalData.childProfile.age, this.data.lastWordId)

    this.setData({
      word,
      wordText: getWordText(word),
      wordHint: getWordHint(word),
      wordCategory: getWordCategoryLabel(word),
      lastWordId: word.id,
      practicePhrase: getPracticePhrase(word, level.phraseMode),
      stepCount: 0,
      steps: buildSteps(0),
      feedback: "Listen and say"
    })
  },

  playWord() {
    hearWord(this.data.wordText)
    this.setData({
      stepCount: 1,
      steps: buildSteps(1),
      feedback: this.data.practicePhrase + "，大声说！"
    })
    playText(this.data.wordText)
  },

  practice() {
    if (this.data.stepCount === 0) {
      this.setData({ feedback: "请先点 ▶ 听一听" })
      feedbackError()
      playText("Tap listen first")
      return
    }

    var nextStepCount = Math.min(this.data.stepCount + 1, 3)

    addSpeakCount()
    addStudySeconds(10)
    var msg = nextStepCount >= 3 ? encourageComplete() : encourage()
    this.setData({
      stepCount: nextStepCount,
      steps: buildSteps(nextStepCount),
      feedback: msg
    })
    if (nextStepCount >= 3) {
      feedbackComplete()
    } else {
      feedbackSuccess()
    }
    playText(msg)
  },

  back() {
    wx.navigateBack()
  }
})
