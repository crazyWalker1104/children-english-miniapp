const { ensureTodayRecord, addStudySeconds } = require("./utils/progress")
const { setAudioSources, stopActiveAudio } = require("./utils/audio")
const { audioSources } = require("./data/audio-sources")
const { getParentSettings } = require("./utils/settings")

App({
  globalData: {
    childProfile: {
      id: "demo-child",
      nickname: "Baby",
      age: 4,
      level: "match"
    },
    parentSettings: {}
  },

  onLaunch() {
    setAudioSources(audioSources)
    this.globalData.parentSettings = getParentSettings()
    const savedProfile = wx.getStorageSync("childProfile")
    if (savedProfile) {
      this.globalData.childProfile = savedProfile
    }
    this.sessionStartAt = Date.now()
    ensureTodayRecord()
  },

  onHide() {
    stopActiveAudio()
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
