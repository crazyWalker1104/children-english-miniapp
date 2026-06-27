const { colors, words } = require("../../data/tasks")
const { getAgeLevel } = require("../../utils/age")
const { pickDailyTask } = require("../../utils/randomizer")
const { completeTask, hearWord, addStudySeconds } = require("../../utils/progress")
const { playText } = require("../../utils/audio")
const { feedbackSuccess, feedbackComplete, feedbackError } = require("../../utils/interaction")
const { getCurrentLayoutMode, getResizeLayoutMode } = require("../../utils/layout")
const { shuffle } = require("../../utils/shuffle")

const SESSION_GOAL = 3
const DEFAULT_CHOICE_EMOJI = "✨"
const WORD_EMOJI = {
  animal: "🐾",
  action: "👏",
  art: "⭐",
  color: "🎨",
  daily: "📘",
  family: "🏠",
  food: "🍪",
  greeting: "👋",
  toy: "🧸"
}

function buildStaticChoices(taskTarget, choices) {
  return choices.map(function (choice) {
    return {
      ...choice,
      correct: choice.id === taskTarget
    }
  })
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

  if (!correctWord) {
    return []
  }

  const rest = shuffle(words.filter(function (word) {
    return word.id !== correctWord.id && word.minAge <= task.maxAge
  }))

  return shuffle([correctWord].concat(rest).slice(0, choiceCount)).map(function (word) {
    return getWordChoice(word, correctWord.id)
  })
}

function buildChoices(task, choiceCount) {
  const wordChoices = buildWordChoices(task, choiceCount)

  if (wordChoices.length) {
    return wordChoices
  }

  if (task.target === "apple") {
    return buildStaticChoices(task.target, [
      { id: "apple", label: "apple", emoji: "🍎" },
      { id: "banana", label: "banana", emoji: "🍌" },
      { id: "orange", label: "orange", emoji: "🍊" },
      { id: "grape", label: "grape", emoji: "🍇" }
    ]).slice(0, choiceCount)
  }

  if (task.target === "Hello") {
    return buildStaticChoices(task.target, [
      { id: "Hello", label: "Hello", emoji: "👋" },
      { id: "Bye-bye", label: "Bye-bye", emoji: "✨" },
      { id: "Thank you", label: "Thank you", emoji: "💛" }
    ])
  }

  const correct = colors.find(function (color) {
    return color.id === task.target
  }) || {
    id: task.target || "unknown",
    label: task.target || "surprise",
    emoji: DEFAULT_CHOICE_EMOJI
  }
  const rest = colors.filter(function (color) {
    return color.id !== correct.id
  })
  return shuffle([correct].concat(rest).slice(0, choiceCount)).map(function (choice) {
    return {
      ...choice,
      correct: choice.id === correct.id
    }
  })
}

function buildProgressDots(completedRounds) {
  return Array.from({ length: SESSION_GOAL }).map(function (_, index) {
    const step = index + 1
    return {
      id: `step-${step}`,
      active: step <= completedRounds
    }
  })
}

function getChallengeLabel(roundIndex, ageLevel) {
  const labels = [
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
