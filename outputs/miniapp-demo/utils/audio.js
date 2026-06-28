let activeAudio = null
let audioSources = {}
let playTimer = null
let playStarted = false
let audioSessionId = 0
let currentStatus = "idle"
let currentSource = ""
let statusListeners = []
let progressCallback = null
let beepUri = null

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
    duration: 1500
  })
}

function buildBeepUri() {
  if (beepUri) {
    return beepUri
  }

  try {
    var sampleRate = 8000
    var duration = 0.15
    var frequency = 520
    var numSamples = Math.floor(sampleRate * duration)
    var dataSize = numSamples
    var fileSize = 44 + dataSize

    var buffer = new ArrayBuffer(fileSize)
    var view = new DataView(buffer)

    writeString(view, 0, "RIFF")
    view.setUint32(4, fileSize - 8, true)
    writeString(view, 8, "WAVE")
    writeString(view, 12, "fmt ")
    view.setUint32(16, 16, true)
    view.setUint16(20, 1, true)
    view.setUint16(22, 1, true)
    view.setUint32(24, sampleRate, true)
    view.setUint32(28, sampleRate, true)
    view.setUint16(32, 1, true)
    view.setUint16(34, 8, true)
    writeString(view, 36, "data")
    view.setUint32(40, dataSize, true)

    for (var i = 0; i < numSamples; i++) {
      var sample = Math.floor(Math.sin(2 * Math.PI * frequency * i / sampleRate) * 64 + 128)
      view.setUint8(44 + i, sample)
    }

    beepUri = "data:audio/wav;base64," + wx.arrayBufferToBase64(buffer)
    return beepUri
  } catch (e) {
    return ""
  }
}

function writeString(view, offset, str) {
  for (var i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i))
  }
}

function playBeepFallback(fallbackText) {
  var uri = buildBeepUri()
  if (!uri) {
    showTextFallback(fallbackText)
    return
  }

  stopActiveAudio()
  var sessionId = audioSessionId + 1
  audioSessionId = sessionId
  setAudioOptions()
  setStatus("playing", uri)
  activeAudio = wx.createInnerAudioContext()
  activeAudio.src = uri
  activeAudio.obeyMuteSwitch = false
  activeAudio.onEnded(function () {
    if (sessionId !== audioSessionId) {
      return
    }
    stopActiveAudio()
  })
  activeAudio.onError(function () {
    stopActiveAudio()
    showTextFallback(fallbackText)
  })
  playTimer = setTimeout(function () {
    if (activeAudio && sessionId === audioSessionId && !playStarted) {
      playStarted = true
      activeAudio.play()
    }
  }, 50)
}

function canCreateAudioContext() {
  return typeof wx.canIUse === "function" &&
    wx.canIUse("createInnerAudioContext") &&
    typeof wx.createInnerAudioContext === "function"
}

function setStatus(status, src) {
  if (currentStatus === status && currentSource === src) {
    return
  }

  currentStatus = status
  currentSource = src || ""
  statusListeners.forEach(function (fn) {
    try {
      fn({ status: currentStatus, src: currentSource })
    } catch (e) {
      // ignore listener errors
    }
  })
}

function getAudioStatus() {
  return { status: currentStatus, src: currentSource }
}

function onAudioStatusChange(callback) {
  if (typeof callback !== "function") {
    return
  }

  statusListeners.push(callback)
}

function offAudioStatusChange(callback) {
  statusListeners = statusListeners.filter(function (fn) {
    return fn !== callback
  })
}

function stopActiveAudio() {
  audioSessionId += 1

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
  setStatus("idle", "")
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

function startActiveAudio(sessionId) {
  if (!activeAudio || playStarted || sessionId !== audioSessionId) {
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
      playBeepFallback(fallbackText)
    }
    return
  }

  stopActiveAudio()
  const sessionId = audioSessionId + 1
  audioSessionId = sessionId
  setAudioOptions()
  setStatus("loading", src)
  activeAudio = wx.createInnerAudioContext()
  playStarted = false
  activeAudio.autoplay = false
  activeAudio.obeyMuteSwitch = false
  activeAudio.onCanplay(function () {
    if (sessionId !== audioSessionId) {
      return
    }
    setStatus("playing", src)
    startActiveAudio(sessionId)
  })
  activeAudio.onError(function (error) {
    if (sessionId !== audioSessionId) {
      return
    }

    console.error("Audio playback failed", {
      src,
      error
    })
    stopActiveAudio()
    playBeepFallback(fallbackText)
  })
  activeAudio.onEnded(function () {
    if (sessionId !== audioSessionId) {
      return
    }

    stopActiveAudio()
  })
  activeAudio.onTimeUpdate(function () {
    if (sessionId !== audioSessionId || !progressCallback) {
      return
    }

    try {
      progressCallback({
        currentTime: activeAudio.currentTime || 0,
        duration: activeAudio.duration || 0
      })
    } catch (e) {
      // ignore callback errors
    }
  })
  activeAudio.src = src
  playTimer = setTimeout(function () {
    startActiveAudio(sessionId)
  }, 300)
}

function setPlayProgressCallback(callback) {
  progressCallback = typeof callback === "function" ? callback : null
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
  stopActiveAudio,
  getAudioStatus,
  onAudioStatusChange,
  offAudioStatusChange,
  setPlayProgressCallback
}
