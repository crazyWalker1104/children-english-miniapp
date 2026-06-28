const { colors } = require("../../data/tasks")
const { completeTask, hearWord, addStudySeconds } = require("../../utils/progress")
const { playText } = require("../../utils/audio")
const { getAgeLevel } = require("../../utils/age")
const { feedbackSuccess, feedbackComplete, feedbackError } = require("../../utils/interaction")
const { getCurrentLayoutMode, getResizeLayoutMode } = require("../../utils/layout")
const { shuffle } = require("../../utils/shuffle")

const COLOR_GOAL = 3
const EMPTY_TARGET = {
  id: "",
  label: "color",
  color: "#ffffff",
  emoji: ""
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
    target: EMPTY_TARGET,
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
      feedback: "听一听，找找 " + target.label,
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

    var id = event.currentTarget.dataset.id
    if (id === this.data.target.id) {
      var completedRounds = Math.min(this.data.completedRounds + 1, COLOR_GOAL)
      var sessionComplete = completedRounds === COLOR_GOAL
      var feedbackText = sessionComplete ? "全部完成！太棒了 ★★★" : "答对了！真厉害 ★"

      completeTask("color-" + id, id + "-sticker")
      addStudySeconds(15)
      this.setData({
        completedRounds: completedRounds,
        progressDots: buildProgressDots(completedRounds),
        roundDone: true,
        sessionComplete: sessionComplete,
        feedback: feedbackText
      })
      if (sessionComplete) {
        feedbackComplete()
      } else {
        feedbackSuccess()
      }
      playText(id)
      return
    }
    this.setData({ feedback: "再试一次！" })
    feedbackError()
    playText("Try again!")
  },

  back() {
    wx.navigateBack()
  }
})
