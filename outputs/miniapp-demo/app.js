const { ensureTodayRecord, addStudySeconds } = require("./utils/progress")

App({
  globalData: {
    childProfile: {
      id: "demo-child",
      nickname: "Baby",
      age: 4,
      level: "match"
    }
  },

  onLaunch() {
    const savedProfile = wx.getStorageSync("childProfile")
    if (savedProfile) {
      this.globalData.childProfile = savedProfile
    }
    this.sessionStartAt = Date.now()
    ensureTodayRecord()
  },

  onHide() {
    this.flushStudyDuration()
  },

  flushStudyDuration() {
    if (!this.sessionStartAt) return
    const now = Date.now()
    const seconds = Math.floor((now - this.sessionStartAt) / 1000)
    if (seconds > 0) {
      addStudySeconds(seconds)
      this.sessionStartAt = now
    }
  }
})
