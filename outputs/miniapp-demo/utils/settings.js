const SETTINGS_KEY = "parentSettings"

const DEFAULT_SETTINGS = {
  soundEnabled: true,
  hapticEnabled: true,
  calmMode: false,
  dailyLimitMinutes: 15
}

function getParentSettings() {
  const saved = wx.getStorageSync(SETTINGS_KEY)
  return {
    ...DEFAULT_SETTINGS,
    ...(saved || {})
  }
}

function saveParentSettings(settings) {
  const nextSettings = {
    ...DEFAULT_SETTINGS,
    ...(settings || {})
  }
  wx.setStorageSync(SETTINGS_KEY, nextSettings)
  return nextSettings
}

function updateParentSetting(key, value) {
  const settings = getParentSettings()
  settings[key] = value
  return saveParentSettings(settings)
}

module.exports = {
  getParentSettings,
  saveParentSettings,
  updateParentSetting
}
