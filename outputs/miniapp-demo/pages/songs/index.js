const { getSongsForAge } = require("../../data/content")
const { playSong, completeTask, addStudySeconds } = require("../../utils/progress")
const { playText } = require("../../utils/audio")
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
    layoutMode: "mobile"
  },

  lyricTimer: null,

  onLoad() {
    this.setData({
      layoutMode: getCurrentLayoutMode()
    })
  },

  onShow() {
    const app = getApp()
    const age = app.globalData.childProfile.age
    const level = getAgeLevel(age)

    this.setData({
      songs: getSongsForAge(age),
      feedback: `年龄模式：${level.label}`
    })
  },

  onHide() {
    this.stopLyricTimer()
  },

  onUnload() {
    this.stopLyricTimer()
  },

  onResize(resizeInfo) {
    this.setData({
      layoutMode: getResizeLayoutMode(resizeInfo)
    })
  },

  play(event) {
    const id = event.currentTarget.dataset.id
    const song = this.data.songs.find((item) => item.id === id)

    if (!song) {
      return
    }

    this.stopLyricTimer()
    playSong(id)
    completeTask(`song-${id}`, `${id}-sticker`)
    addStudySeconds(30)
    this.setData({
      activeSong: song,
      activeSongId: song.id,
      activeLineIndex: 0,
      feedback: `${song.title}: ${song.action}`
    })
    this.startLyricTimer(song)
    playText("Sing with me!")
  },

  startLyricTimer(song) {
    const page = this
    this.lyricTimer = setInterval(function () {
      const nextIndex = page.data.activeLineIndex + 1

      if (nextIndex >= song.lines.length) {
        page.stopLyricTimer()
        page.setData({
          feedback: "Great singing! ★"
        })
        feedbackComplete()
        playText("Great singing!")
        return
      }

      page.setData({
        activeLineIndex: nextIndex,
        feedback: song.lines[nextIndex].action
      })
    }, 1400)
  },

  stopLyricTimer() {
    if (!this.lyricTimer) {
      return
    }

    clearInterval(this.lyricTimer)
    this.lyricTimer = null
  },

  back() {
    wx.navigateBack()
  }
})
