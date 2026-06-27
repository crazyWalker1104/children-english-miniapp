let activeAudio = null
let audioSources = {}
let playTimer = null
let playStarted = false

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
  if (playTimer) {
    clearTimeout(playTimer)
    playTimer = null
  }

  if (!activeAudio) {
    return
  }

  activeAudio.stop()
  activeAudio.destroy()
  activeAudio = null
  playStarted = false
}

function setAudioOptions() {
  if (
    typeof wx.setInnerAudioOption === "function" &&
    (!wx.canIUse || wx.canIUse("setInnerAudioOption"))
  ) {
    wx.setInnerAudioOption({
      mixWithOther: true,
      obeyMuteSwitch: false
    })
  }
}

function startActiveAudio() {
  if (!activeAudio || playStarted) {
    return
  }

  if (playTimer) {
    clearTimeout(playTimer)
    playTimer = null
  }

  playStarted = true
  activeAudio.play()
}

function playAudioSource(src, fallbackText) {
  const settings = getParentSettings()
  if (!settings.soundEnabled) {
    if (!settings.calmMode) {
      showTextFallback("声音已关闭")
    }
    return
  }

  if (!src || !canCreateAudioContext()) {
    if (!settings.calmMode) {
      showTextFallback(fallbackText)
    }
    return
  }

  stopActiveAudio()
  setAudioOptions()
  activeAudio = wx.createInnerAudioContext()
  playStarted = false
  activeAudio.autoplay = false
  activeAudio.obeyMuteSwitch = false
  activeAudio.onCanplay(function () {
    startActiveAudio()
  })
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
  activeAudio.src = src
  playTimer = setTimeout(function () {
    startActiveAudio()
  }, 300)
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
