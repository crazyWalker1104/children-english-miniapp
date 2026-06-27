const { ensureTodayRecord } = require("../../utils/progress")
const { getAgeLevel } = require("../../utils/age")
const { playText } = require("../../utils/audio")
const { getCurrentLayoutMode, getResizeLayoutMode } = require("../../utils/layout")

Page({
  data: {
    stars: "☆ ☆ ☆",
    profile: {},
    ageLabel: "",
    layoutMode: "mobile"
  },

  onLoad() {
    this.setData({
      layoutMode: getCurrentLayoutMode()
    })
  },

  onShow() {
    const app = getApp()
    const record = ensureTodayRecord()
    const count = Math.min(record.rewards.length, 3)
    const profile = app.globalData.childProfile
    const level = getAgeLevel(profile.age)
    this.setData({
      stars: "★ ".repeat(count) + "☆ ".repeat(3 - count),
      profile,
      ageLabel: level.label
    })
  },

  onResize(resizeInfo) {
    this.setData({
      layoutMode: getResizeLayoutMode(resizeInfo)
    })
  },

  sayHello() {
    playText("Hello!")
  },

  goDaily() {
    wx.navigateTo({ url: "/pages/daily/index" })
  },

  goColors() {
    wx.navigateTo({ url: "/pages/colors/index" })
  },

  goSpeak() {
    wx.navigateTo({ url: "/pages/speak/index" })
  },

  goSongs() {
    wx.navigateTo({ url: "/pages/songs/index" })
  },

  goArt() {
    wx.navigateTo({ url: "/pages/art/index" })
  },

  goParent() {
    wx.navigateTo({ url: "/pages/parent/index" })
  }
})
