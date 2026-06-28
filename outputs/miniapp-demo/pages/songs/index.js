const { getSongsForAge } = require("../../data/content")
const { playSong, completeTask, addStudySeconds } = require("../../utils/progress")
const { playText, setPlayProgressCallback } = require("../../utils/audio")
const { feedbackComplete } = require("../../utils/interaction")
const { getCurrentLayoutMode, getResizeLayoutMode } = require("../../utils/layout")
const { getAgeLevel } = require("../../utils/age")

Page({
  data: {
    songs: [],
    activeSong: {},
    activeSongId: "",
    activeLineIndex: 0,
    feedback: "",
    layoutMode: "mobile",
    audioStatus: "idle",
    loadProgress: 0
  },

  _progressTimer: null,
  _lastLineIndex: 0,
  _lineCount: 0,

  onLoad() {
    this.setData({ layoutMode: getCurrentLayoutMode() })
  },

  onShow() {
    const app = getApp()
    const age = app.globalData.childProfile.age
    const level = getAgeLevel(age)
    this.setData({
      songs: getSongsForAge(age),
      feedback: "年龄模式：" + level.label
    })
  },

  onHide() {
    this.stopProgressTimer()
  },

  onUnload() {
    this.stopProgressTimer()
    setPlayProgressCallback(null)
  },

  onResize(resizeInfo) {
    this.setData({ layoutMode: getResizeLayoutMode(resizeInfo) })
  },

  play(event) {
    var id = event.currentTarget.dataset.id
    var song = this.data.songs.find(function (item) { return item.id === id })
    if (!song) return

    this.stopProgressTimer()
    this._lastLineIndex = 0
    this._lineCount = song.lines.length

    playSong(id)
    completeTask("song-" + id, id + "-sticker")
    addStudySeconds(30)

    this.setData({
      activeSong: song,
      activeSongId: song.id,
      activeLineIndex: 0,
      feedback: song.title + ": " + song.action,
      audioStatus: "loading"
    })

    this.startProgressSync(song)
    playText(song.audioKey || "")
  },

  startProgressSync(song) {
    var page = this
    var lineCount = song.lines.length
    var hasRealProgress = false

    setPlayProgressCallback(function (progress) {
      if (!progress.duration || progress.duration <= 0) return

      hasRealProgress = true
      var perLine = progress.duration / lineCount
      var lineIndex = Math.min(Math.floor(progress.currentTime / perLine), lineCount - 1)

      if (lineIndex <= page._lastLineIndex) return
      page._lastLineIndex = lineIndex

      page.setData({ audioStatus: "playing", loadProgress: Math.round(progress.currentTime / progress.duration * 100) })

      if (lineIndex >= lineCount - 1) {
        page.stopProgressTimer()
        page.setData({
          activeLineIndex: lineIndex,
          feedback: "Great singing! ★",
          audioStatus: "idle",
          loadProgress: 100
        })
        feedbackComplete()
        playText("Great singing!")
        return
      }

      page.setData({
        activeLineIndex: lineIndex,
        feedback: song.lines[lineIndex].action || ""
      })
    })

    // 兜底：3秒后如果还没收到真实进度，用固定 interval
    this._progressTimer = setTimeout(function () {
      if (!hasRealProgress) {
        page.setData({ audioStatus: "playing" })
        page.startFallbackTimer(song)
      }
    }, 3000)
  },

  startFallbackTimer(song) {
    setPlayProgressCallback(null)
    var page = this
    this._progressTimer = setInterval(function () {
      var nextIndex = page.data.activeLineIndex + 1
      if (nextIndex >= song.lines.length) {
        page.stopProgressTimer()
        page.setData({ feedback: "Great singing! ★", audioStatus: "idle", loadProgress: 100 })
        feedbackComplete()
        playText("Great singing!")
        return
      }
      page.setData({
        activeLineIndex: nextIndex,
        feedback: song.lines[nextIndex].action || "",
        loadProgress: Math.round(nextIndex / song.lines.length * 100)
      })
    }, 1400)
  },

  stopProgressTimer() {
    setPlayProgressCallback(null)
    if (this._progressTimer) {
      clearTimeout(this._progressTimer)
      clearInterval(this._progressTimer)
      this._progressTimer = null
    }
  },

  back() {
    wx.navigateBack()
  }
})