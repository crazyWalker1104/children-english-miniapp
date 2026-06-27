const { songs } = require("../../data/tasks")
const { playSong, completeTask, addStudySeconds } = require("../../utils/progress")
const { playText } = require("../../utils/audio")
const { getCurrentLayoutMode, getResizeLayoutMode } = require("../../utils/layout")

Page({
  data: {
    songs,
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
    const song = songs.find((item) => item.id === id)

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
