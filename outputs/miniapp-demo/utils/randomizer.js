const { themeTasks } = require("../data/tasks")

function pickDailyTask(age) {
  const lastTaskId = wx.getStorageSync("lastTaskId")
  const candidates = themeTasks.filter((task) => {
    return age >= task.minAge && age <= task.maxAge && task.id !== lastTaskId
  })

  const pool = candidates.length ? candidates : themeTasks
  const index = Math.floor(Math.random() * pool.length)
  const selected = pool[index]
  wx.setStorageSync("lastTaskId", selected.id)
  return selected
}

module.exports = {
  pickDailyTask
}
