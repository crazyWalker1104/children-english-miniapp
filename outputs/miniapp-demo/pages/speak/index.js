const { words } = require("../../data/tasks")
const { hearWord, addSpeakCount, addStudySeconds } = require("../../utils/progress")
const { playText } = require("../../utils/audio")
const { getAgeLevel } = require("../../utils/age")
const { feedbackSuccess, feedbackComplete, feedbackError } = require("../../utils/interaction")
const { getCurrentLayoutMode, getResizeLayoutMode } = require("../../utils/layout")

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

function getPracticePhrase(word, phraseMode) {
  if (!phraseMode) {
    return word
  }

  if (word === "red" || word === "apple") {
    return `I see ${word}.`
  }

  return word
}

Page({
  data: {
    word: words[0],
    practicePhrase: words[0],
    stepCount: 0,
    steps: buildSteps(0),
    feedback: "Listen and say",
    layoutMode: "mobile"
  },

  onLoad() {
    this.setData({
      layoutMode: getCurrentLayoutMode()
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
      practicePhrase: getPracticePhrase(this.data.word, level.phraseMode)
    })
  },

  nextWord() {
    const index = Math.floor(Math.random() * words.length)
    const app = getApp()
    const level = getAgeLevel(app.globalData.childProfile.age)
    const word = words[index]

    this.setData({
      word,
      practicePhrase: getPracticePhrase(word, level.phraseMode),
      stepCount: 0,
      steps: buildSteps(0),
      feedback: "Listen and say"
    })
  },

  playWord() {
    hearWord(this.data.word)
    this.setData({
      stepCount: 1,
      steps: buildSteps(1),
      feedback: `${this.data.practicePhrase}, ${this.data.practicePhrase}!`
    })
    playText(this.data.practicePhrase)
  },

  practice() {
    if (this.data.stepCount === 0) {
      this.setData({ feedback: "Tap listen first" })
      feedbackError()
      playText("Tap listen first")
      return
    }

    const nextStepCount = Math.min(this.data.stepCount + 1, 3)

    addSpeakCount()
    addStudySeconds(10)
    this.setData({
      stepCount: nextStepCount,
      steps: buildSteps(nextStepCount),
      feedback: nextStepCount >= 3 ? "You did it! ★" : "Great sound!"
    })
    if (nextStepCount >= 3) {
      feedbackComplete()
    } else {
      feedbackSuccess()
    }
    playText(nextStepCount >= 3 ? "You did it!" : "Great sound!")
  },

  back() {
    wx.navigateBack()
  }
})
