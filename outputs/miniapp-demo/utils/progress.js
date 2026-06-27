function getTodayKey() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, "0")
  const d = String(now.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

function createEmptyRecord() {
  return {
    date: getTodayKey(),
    durationSeconds: 0,
    completedTaskIds: [],
    heardWords: [],
    songPlayCounts: {},
    speakCount: 0,
    rewards: []
  }
}

function getHistory() {
  return wx.getStorageSync("learningHistory") || []
}

function saveHistory(history) {
  wx.setStorageSync("learningHistory", history.slice(-7))
}

function summarizeRecord(record) {
  if (!record || !record.date) {
    return null
  }

  return {
    date: record.date,
    durationSeconds: record.durationSeconds || 0,
    completedTaskCount: (record.completedTaskIds || []).length,
    heardWordCount: (record.heardWords || []).length,
    rewardCount: (record.rewards || []).length,
    speakCount: record.speakCount || 0,
    songCount: Object.values(record.songPlayCounts || {}).reduce((sum, count) => sum + count, 0)
  }
}

function archiveRecord(record) {
  const summary = summarizeRecord(record)
  if (!summary) {
    return
  }

  const history = getHistory().filter((item) => item.date !== summary.date)
  history.push(summary)
  saveHistory(history)
}

function ensureTodayRecord() {
  const record = wx.getStorageSync("learningRecord")
  if (!record || record.date !== getTodayKey()) {
    archiveRecord(record)
    wx.setStorageSync("learningRecord", createEmptyRecord())
    return createEmptyRecord()
  }
  return record
}

function updateRecord(updater) {
  const record = ensureTodayRecord()
  const nextRecord = updater(record)
  wx.setStorageSync("learningRecord", nextRecord)
  return nextRecord
}

function completeTask(taskId, reward) {
  return updateRecord((record) => {
    return {
      ...record,
      completedTaskIds: Array.from(new Set(record.completedTaskIds.concat(taskId))),
      rewards: Array.from(new Set(record.rewards.concat(reward)))
    }
  })
}

function hearWord(word) {
  return updateRecord((record) => ({
    ...record,
    heardWords: Array.from(new Set(record.heardWords.concat(word)))
  }))
}

function playSong(songId) {
  return updateRecord((record) => ({
    ...record,
    songPlayCounts: {
      ...record.songPlayCounts,
      [songId]: (record.songPlayCounts[songId] || 0) + 1
    }
  }))
}

function addSpeakCount() {
  return updateRecord((record) => ({
    ...record,
    speakCount: record.speakCount + 1
  }))
}

function addStudySeconds(seconds) {
  return updateRecord((record) => ({
    ...record,
    durationSeconds: record.durationSeconds + Math.max(0, seconds)
  }))
}

function getWeeklySummary() {
  const todayRecord = ensureTodayRecord()
  const todaySummary = summarizeRecord(todayRecord)
  const history = getHistory().filter((item) => item.date !== todaySummary.date)
  const records = history.concat(todaySummary).slice(-7)
  const totalDurationSeconds = records.reduce((sum, item) => sum + item.durationSeconds, 0)
  const totalTaskCount = records.reduce((sum, item) => sum + item.completedTaskCount, 0)
  const totalRewardCount = records.reduce((sum, item) => sum + item.rewardCount, 0)
  const activeDays = records.filter((item) => item.durationSeconds > 0 || item.completedTaskCount > 0).length

  return {
    records,
    totalDurationMinutes: Math.ceil(totalDurationSeconds / 60),
    totalTaskCount,
    totalRewardCount,
    activeDays
  }
}

module.exports = {
  ensureTodayRecord,
  completeTask,
  hearWord,
  playSong,
  addSpeakCount,
  addStudySeconds,
  getWeeklySummary
}
