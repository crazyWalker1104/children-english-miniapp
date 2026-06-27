const { colors } = require("../../data/tasks")
const { completeTask, hearWord, addStudySeconds } = require("../../utils/progress")
const { playText } = require("../../utils/audio")
const { getAgeLevel } = require("../../utils/age")
const { feedbackSuccess, feedbackComplete, feedbackError } = require("../../utils/interaction")
const { getCurrentLayoutMode, getResizeLayoutMode } = require("../../utils/layout")

const COLOR_GOAL = 3

function shuffle(items) {
  return items.slice().sort(function () {
    return Math.random() - 0.5
  })
}

function buildColorChoices(target, count) {
  const rest = shuffle(colors.filter(function (color) {
    return color.id !== target.id
  }))
  return shuffle([target].concat(rest).slice(0, count))
}

function buildProgressDots(completedRounds) {
  return [1, 2, 3].map(function (step) {
    return {
      id: `color-step-${step}`,
      active: step <= completedRounds
    }
  })
}

Page({
  data: {
    colors: [],
    target: colors[0],
    completedRounds: 0,
    progressDots: buildProgressDots(0),
    roundDone: false,
    sessionComplete: false,
    feedback: "",
    layoutMode: "mobile"
  },

  onLoad() {
    this.setData({
      layoutMode: getCurrentLayoutMode()
    })
    this.nextPrompt()
  },

  onResize(resizeInfo) {
    this.setData({
      layoutMode: getResizeLayoutMode(resizeInfo)
    })
  },

  nextPrompt() {
    const app = getApp()
    const level = getAgeLevel(app.globalData.childProfile.age)
    const index = Math.floor(Math.random() * colors.length)
    const target = colors[index]

    if (this.data.completedRounds >= COLOR_GOAL) {
      this.setData({
        completedRounds: 0,
        progressDots: buildProgressDots(0)
      })
    }

    this.setData({
      colors: buildColorChoices(target, level.choiceCount),
      target,
      feedback: "Listen and tap",
      roundDone: false,
      sessionComplete: false
    })
    hearWord(target.label)
    playText(target.label)
  },

  tapColor(event) {
    if (this.data.roundDone) {
      return
    }

    const id = event.currentTarget.dataset.id
    if (id === this.data.target.id) {
      const completedRounds = Math.min(this.data.completedRounds + 1, COLOR_GOAL)
      const sessionComplete = completedRounds === COLOR_GOAL

      completeTask(`color-${id}`, `${id}-sticker`)
      addStudySeconds(15)
      this.setData({
        completedRounds,
        progressDots: buildProgressDots(completedRounds),
        roundDone: true,
        sessionComplete,
        feedback: sessionComplete ? "Color stars complete! ★★★" : "Beautiful! ★"
      })
      if (sessionComplete) {
        feedbackComplete()
      } else {
        feedbackSuccess()
      }
      playText(sessionComplete ? "Color stars complete!" : "Great job!")
      return
    }
    this.setData({ feedback: "Try again!" })
    feedbackError()
    playText("Try again!")
  },

  back() {
    wx.navigateBack()
  }
})
