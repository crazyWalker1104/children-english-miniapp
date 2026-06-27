const { getParentSettings } = require("./settings")

function canUse(apiName) {
  return typeof wx.canIUse === "function" && wx.canIUse(apiName)
}

function vibrate(type) {
  const settings = getParentSettings()
  if (!settings.hapticEnabled || settings.calmMode) {
    return
  }

  if (!canUse("vibrateShort") || typeof wx.vibrateShort !== "function") {
    return
  }

  wx.vibrateShort({
    type: type || "light",
    fail() {}
  })
}

function feedbackSuccess() {
  vibrate("light")
}

function feedbackComplete() {
  vibrate("medium")
}

function feedbackError() {
  vibrate("heavy")
}

module.exports = {
  feedbackSuccess,
  feedbackComplete,
  feedbackError
}
