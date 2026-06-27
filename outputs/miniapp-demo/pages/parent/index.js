const { ensureTodayRecord, getWeeklySummary } = require("../../utils/progress")
const { getAgeLevel } = require("../../utils/age")
const { getCurrentLayoutMode, getResizeLayoutMode } = require("../../utils/layout")
const { getParentSettings, updateParentSetting } = require("../../utils/settings")

function buildTodaySuggestion(profile, level, record, durationMinutes, songCount, parentSettings) {
  const dailyLimitMinutes = parentSettings.dailyLimitMinutes

  if (durationMinutes === 0 && record.completedTaskIds.length === 0) {
    return "今天可以先玩 3 分钟颜色乐园，再听一首儿歌，保持轻松开始。"
  }

  if (durationMinutes >= dailyLimitMinutes) {
    return "今天学习已经足够啦，接下来适合切到安静模式，听一首慢节奏儿歌收尾。"
  }

  if (record.heardWords.length < 3) {
    return "建议再听 2 个常用词，3-4 岁优先听和点，先不用要求完整跟读。"
  }

  if (profile.age >= 5 && record.speakCount < 2) {
    return `可以试一次短句跟读：${level.phraseMode ? "I see red." : "red"}`
  }

  if (songCount === 0) {
    return "今天还没听儿歌，可以选一首跟着拍手，把学习变成游戏。"
  }

  return "今天节奏不错，最后玩一次名画拼图，完成后就可以休息。"
}

function formatWeekItems(records) {
  const maxDuration = Math.max.apply(null, records.map(function (item) {
    return item.durationSeconds
  }).concat(60))

  return records.map(function (item) {
    const minutes = Math.ceil(item.durationSeconds / 60)
    const height = Math.max(14, Math.round((item.durationSeconds / maxDuration) * 88))
    return {
      id: item.date,
      label: item.date.slice(5),
      minutes,
      barHeight: `${height}rpx`
    }
  })
}

Page({
  data: {
    ages: [
      { id: "age-3", value: 3, label: "3 岁" },
      { id: "age-4", value: 4, label: "4 岁" },
      { id: "age-5", value: 5, label: "5 岁" },
      { id: "age-6", value: 6, label: "6 岁" }
    ],
    timeLimits: [
      { id: "limit-10", value: 10, label: "10 分钟" },
      { id: "limit-15", value: 15, label: "15 分钟" },
      { id: "limit-20", value: 20, label: "20 分钟" }
    ],
    profile: {},
    ageLabel: "",
    duration: 0,
    taskCount: 0,
    wordCount: 0,
    songCount: 0,
    speakCount: 0,
    rewardCount: 0,
    heardWordItems: [],
    rewardItems: [],
    parentSettings: {},
    todaySuggestion: "",
    weeklySummary: {},
    weekItems: [],
    layoutMode: "mobile"
  },

  onLoad() {
    this.setData({
      layoutMode: getCurrentLayoutMode()
    })
  },

  onShow() {
    this.refresh()
  },

  onResize(resizeInfo) {
    this.setData({
      layoutMode: getResizeLayoutMode(resizeInfo)
    })
  },

  refresh() {
    const app = getApp()
    const profile = app.globalData.childProfile
    const parentSettings = getParentSettings()
    const level = getAgeLevel(profile.age)
    const record = ensureTodayRecord()
    const weeklySummary = getWeeklySummary()
    const songCount = Object.values(record.songPlayCounts).reduce((sum, count) => sum + count, 0)
    const duration = Math.ceil(record.durationSeconds / 60)

    this.setData({
      profile,
      parentSettings,
      ageLabel: level.label,
      duration,
      taskCount: record.completedTaskIds.length,
      wordCount: record.heardWords.length,
      songCount,
      speakCount: record.speakCount,
      rewardCount: record.rewards.length,
      todaySuggestion: buildTodaySuggestion(profile, level, record, duration, songCount, parentSettings),
      weeklySummary,
      weekItems: formatWeekItems(weeklySummary.records),
      heardWordItems: record.heardWords.map(function (word) {
        return {
          id: `word-${word}`,
          label: word
        }
      }),
      rewardItems: record.rewards.map(function (reward) {
        return {
          id: `reward-${reward}`,
          label: reward
        }
      })
    })
  },

  setAge(event) {
    const age = Number(event.currentTarget.dataset.age)
    const app = getApp()
    const nextProfile = {
      ...app.globalData.childProfile,
      age
    }

    app.globalData.childProfile = nextProfile
    wx.setStorageSync("childProfile", nextProfile)
    this.refresh()
    wx.showToast({
      title: `已切换 ${age} 岁`,
      icon: "none"
    })
  },

  toggleSetting(event) {
    const key = event.currentTarget.dataset.key
    const nextValue = Boolean(event.detail.value)
    const nextSettings = updateParentSetting(key, nextValue)
    const app = getApp()

    app.globalData.parentSettings = nextSettings
    this.setData({
      parentSettings: nextSettings
    })
    wx.showToast({
      title: nextSettings[key] ? "已开启" : "已关闭",
      icon: "none"
    })
  },

  setTimeLimit(event) {
    const minutes = Number(event.currentTarget.dataset.minutes)
    const nextSettings = updateParentSetting("dailyLimitMinutes", minutes)
    const app = getApp()

    app.globalData.parentSettings = nextSettings
    this.refresh()
    wx.showToast({
      title: `已设为 ${minutes} 分钟`,
      icon: "none"
    })
  },

  reset() {
    const page = this

    wx.showModal({
      title: "清空今日记录？",
      content: "会清除今日学习时长、奖励和已听单词。",
      confirmText: "清空",
      confirmColor: "#ff8f7a",
      success(result) {
        if (!result.confirm) {
          return
        }

        wx.removeStorageSync("learningRecord")
        wx.removeStorageSync("lastTaskId")
        page.refresh()
        wx.showToast({ title: "已清空", icon: "none" })
      }
    })
  },

  back() {
    wx.navigateBack()
  }
})
