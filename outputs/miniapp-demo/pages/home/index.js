const { ensureTodayRecord } = require("../../utils/progress")
const { getAgeLevel } = require("../../utils/age")
const { playText } = require("../../utils/audio")
const { getCurrentLayoutMode, getResizeLayoutMode } = require("../../utils/layout")
const { getParentSettings } = require("../../utils/settings")
const { getWeekTheme } = require("../../utils/learning-path")

function buildRestHint(durationMinutes, dailyLimitMinutes) {
  if (durationMinutes >= dailyLimitMinutes) {
    return "今天已经玩够啦，可以听首慢歌休息。"
  }

  if (durationMinutes >= Math.max(1, dailyLimitMinutes - 3)) {
    return "快到休息时间啦，再玩一个短任务就收尾。"
  }

  return `今日 ${durationMinutes} / ${dailyLimitMinutes} 分钟`
}

function navigateTo(url) {
  wx.navigateTo({ url })
}

Page({
  data: {
    stars: "☆ ☆ ☆",
    profile: {},
    ageLabel: "",
    mascotImage: "/assets/images/characters/home-mascot.png",
    restHint: "",
    restReached: false,
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
    const parentSettings = getParentSettings()
    const level = getAgeLevel(profile.age)
    const durationMinutes = Math.ceil(record.durationSeconds / 60)
    const weekTheme = getWeekTheme()
    this.setData({
      stars: "★ ".repeat(count) + "☆ ".repeat(3 - count),
      completedCount: count,
      profile,
      ageLabel: level.label,
      restHint: buildRestHint(durationMinutes, parentSettings.dailyLimitMinutes),
      restReached: durationMinutes >= parentSettings.dailyLimitMinutes,
      weekTheme: weekTheme.theme || "",
      weekTip: weekTheme.dailyTip || ""
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

  startActivity(url) {
    if (!this.data.restReached) {
      navigateTo(url)
      return
    }

    wx.showModal({
      title: "休息一下？",
      content: "今天已经达到建议学习时长，可以休息啦。也可以再玩一个短任务。",
      cancelText: "去休息",
      confirmText: "再玩一次",
      confirmColor: "#72d6b7",
      success(result) {
        if (result.confirm) {
          navigateTo(url)
        }
      }
    })
  },

  goDaily() {
    this.startActivity("/pages/daily/index")
  },

  goColors() {
    this.startActivity("/pages/colors/index")
  },

  goSpeak() {
    this.startActivity("/pages/speak/index")
  },

  goSongs() {
    this.startActivity("/pages/songs/index")
  },

  goArt() {
    this.startActivity("/pages/art/index")
  },

  goParent() {
    wx.navigateTo({ url: "/pages/parent/index" })
  }
})
