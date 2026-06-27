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

function ensureTodayRecord() {
  const record = wx.getStorageSync("learningRecord")
  if (!record || record.date !== getTodayKey()) {
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

module.exports = {
  ensureTodayRecord,
  completeTask,
  hearWord,
  playSong,
  addSpeakCount,
  addStudySeconds
}
