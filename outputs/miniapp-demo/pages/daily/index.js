const { colors } = require("../../data/tasks")
const { getAgeLevel } = require("../../utils/age")
const { pickDailyTask } = require("../../utils/randomizer")
const { completeTask, hearWord, addStudySeconds } = require("../../utils/progress")
const { playText } = require("../../utils/audio")
const { feedbackSuccess, feedbackComplete, feedbackError } = require("../../utils/interaction")
const { getCurrentLayoutMode, getResizeLayoutMode } = require("../../utils/layout")

const SESSION_GOAL = 3

function buildChoices(task, choiceCount) {
  if (task.target === "apple") {
    return [
      { id: "apple", label: "apple", emoji: "🍎", correct: true },
      { id: "banana", label: "banana", emoji: "🍌", correct: false },
      { id: "orange", label: "orange", emoji: "🍊", correct: false },
      { id: "grape", label: "grape", emoji: "🍇", correct: false }
    ].slice(0, choiceCount)
  }

  if (task.target === "Hello") {
    return [
      { id: "Hello", label: "Hello", emoji: "👋", correct: true },
      { id: "Bye-bye", label: "Bye-bye", emoji: "✨", correct: false },
      { id: "Thank you", label: "Thank you", emoji: "💛", correct: false }
    ]
  }

  const correct = colors.find((color) => color.id === task.target)
  const rest = colors.filter((color) => color.id !== task.target)
  return [correct].concat(rest).slice(0, choiceCount).map((color) => ({
    ...color,
    correct: color.id === task.target
  }))
}

function buildProgressDots(completedRounds) {
  return [1, 2, 3].map(function (step) {
    return {
      id: `step-${step}`,
      active: step <= completedRounds
    }
  })
}

function getChallengeLabel(roundIndex, ageLevel) {
  if (roundIndex === 0) {
    return "先听一听，再点一点"
  }

  if (roundIndex === 1) {
    return ageLevel.phraseMode ? "加一点短句提示" : "换一个惊喜画面"
  }

  return ageLevel.phraseMode ? "最后一题，说完再选" : "最后一题，找得更快"
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
    layoutMode: "mobile"
  },

  onLoad() {
    this.setData({
      layoutMode: getCurrentLayoutMode()
    })
    this.setTaskForRound(0)
  },

  onResize(resizeInfo) {
    this.setData({
      layoutMode: getResizeLayoutMode(resizeInfo)
    })
  },

  setTaskForRound(roundIndex) {
    const app = getApp()
    const level = getAgeLevel(app.globalData.childProfile.age)
    const task = pickDailyTask(app.globalData.childProfile.age)
    this.setData({
      task,
      choices: buildChoices(task, level.choiceCount),
      feedback: "",
      ageLabel: level.label,
      challengeLabel: getChallengeLabel(roundIndex, level),
      completed: false,
      sessionComplete: false
    })
    playText(task.prompt)
  },

  pickTask() {
    if (this.data.completedRounds >= SESSION_GOAL) {
      this.setData({
        completedRounds: 0,
        progressDots: buildProgressDots(0)
      })
      this.setTaskForRound(0)
      return
    }

    this.setTaskForRound(this.data.completedRounds)
  },

  choose(event) {
    if (this.data.completed) {
      return
    }

    const id = event.currentTarget.dataset.id
    const selected = this.data.choices.find((choice) => choice.id === id)

    if (selected && selected.correct) {
      const completedRounds = Math.min(this.data.completedRounds + 1, SESSION_GOAL)
      const sessionComplete = completedRounds === SESSION_GOAL

      completeTask(this.data.task.id, this.data.task.reward)
      hearWord(this.data.task.target)
      addStudySeconds(20)
      this.setData({
        feedback: sessionComplete ? "All done! Super star! ★★★" : "Great job! ★",
        completed: true,
        completedRounds,
        progressDots: buildProgressDots(completedRounds),
        sessionComplete
      })
      if (sessionComplete) {
        feedbackComplete()
      } else {
        feedbackSuccess()
      }
      playText(sessionComplete ? "All done! Super star!" : "Great job!")
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
