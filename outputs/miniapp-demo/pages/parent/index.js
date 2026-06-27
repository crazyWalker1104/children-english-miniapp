const { ensureTodayRecord } = require("../../utils/progress")
const { getAgeLevel } = require("../../utils/age")
const { getCurrentLayoutMode, getResizeLayoutMode } = require("../../utils/layout")

Page({
  data: {
    ages: [
      { id: "age-3", value: 3, label: "3 岁" },
      { id: "age-4", value: 4, label: "4 岁" },
      { id: "age-5", value: 5, label: "5 岁" },
      { id: "age-6", value: 6, label: "6 岁" }
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
    const level = getAgeLevel(profile.age)
    const record = ensureTodayRecord()
    const songCount = Object.values(record.songPlayCounts).reduce((sum, count) => sum + count, 0)

    this.setData({
      profile,
      ageLabel: level.label,
      duration: Math.ceil(record.durationSeconds / 60),
      taskCount: record.completedTaskIds.length,
      wordCount: record.heardWords.length,
      songCount,
      speakCount: record.speakCount,
      rewardCount: record.rewards.length,
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

  reset() {
    wx.removeStorageSync("learningRecord")
    wx.removeStorageSync("lastTaskId")
    this.refresh()
    wx.showToast({ title: "已清空", icon: "none" })
  },

  back() {
    wx.navigateBack()
  }
})
