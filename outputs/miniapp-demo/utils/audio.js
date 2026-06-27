let activeAudio = null
let audioSources = {}

const { getParentSettings } = require("./settings")

function normalizeKey(text) {
  return String(text || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
}

function showTextFallback(text) {
  wx.showToast({
    title: text,
    icon: "none",
    duration: 900
  })
}

function canCreateAudioContext() {
  return typeof wx.canIUse === "function" &&
    wx.canIUse("createInnerAudioContext") &&
    typeof wx.createInnerAudioContext === "function"
}

function stopActiveAudio() {
  if (!activeAudio) {
    return
  }

  activeAudio.stop()
  activeAudio.destroy()
  activeAudio = null
}

function playAudioSource(src, fallbackText) {
  const settings = getParentSettings()
  if (!settings.soundEnabled) {
    return
  }

  if (!src || !canCreateAudioContext()) {
    if (!settings.calmMode) {
      showTextFallback(fallbackText)
    }
    return
  }

  stopActiveAudio()
  activeAudio = wx.createInnerAudioContext()
  activeAudio.src = src
  activeAudio.obeyMuteSwitch = false
  activeAudio.onError(function (error) {
    console.error("Audio playback failed", {
      src,
      error
    })
    stopActiveAudio()
    showTextFallback(fallbackText)
  })
  activeAudio.onEnded(function () {
    stopActiveAudio()
  })
  activeAudio.play()
}

function setAudioSources(nextSources) {
  audioSources = nextSources || {}
}

function playText(text) {
  const key = normalizeKey(text)
  playAudioSource(audioSources[key], text)
}

module.exports = {
  playText,
  setAudioSources,
  stopActiveAudio
}
