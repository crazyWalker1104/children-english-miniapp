// 学习路径：按周推荐学习内容
// 第1周：颜色，第2周：问候，第3周：动物

var learningPath = [
  {
    week: 1,
    title: "颜色认知",
    theme: "第1周 · 颜色",
    description: "认识基础颜色，学会表达喜好",
    focusCategories: ["color"],
    suggestedTasks: ["daily-color-red", "daily-color-blue", "daily-color-yellow"],
    dailyTip: "本周重点认识红色、蓝色、黄色，每天3个颜色任务"
  },
  {
    week: 2,
    title: "问候与日常",
    theme: "第2周 · 问候",
    description: "学会打招呼和礼貌用语",
    focusCategories: ["greeting", "daily"],
    suggestedTasks: ["daily-word-hello", "daily-word-please"],
    dailyTip: "本周重点练习 Hello、Bye-bye、Thank you，搭配儿歌"
  },
  {
    week: 3,
    title: "动物世界",
    theme: "第3周 · 动物",
    description: "认识常见动物，学习动物词汇",
    focusCategories: ["animal"],
    suggestedTasks: ["daily-animal-cat", "daily-animal-dog", "daily-animal-rabbit"],
    dailyTip: "本周重点认识猫、狗、兔子，结合动物儿歌"
  },
  {
    week: 4,
    title: "美食与水果",
    theme: "第4周 · 食物",
    description: "认识常见食物和水果",
    focusCategories: ["food"],
    suggestedTasks: ["daily-food-banana", "daily-food-apple", "daily-food-milk"],
    dailyTip: "本周重点认识苹果、香蕉、牛奶，练习表达需求"
  },
  {
    week: 5,
    title: "玩具与家人",
    theme: "第5周 · 玩具",
    description: "认识玩具和家人称呼",
    focusCategories: ["toy", "family"],
    suggestedTasks: ["daily-toy-car", "daily-toy-ball", "daily-family-mommy"],
    dailyTip: "本周重点认识球、小汽车、妈妈，结合身体动作"
  },
  {
    week: 6,
    title: "身体与动作",
    theme: "第6周 · 身体",
    description: "认识身体部位和动作",
    focusCategories: ["body", "action"],
    suggestedTasks: ["daily-body-nose", "daily-body-hand", "daily-action-clap"],
    dailyTip: "本周重点认识鼻子、手、拍手，配合儿歌动起来"
  }
]

function getLearningPath() {
  return learningPath
}

function getCurrentWeek(daysSinceStart) {
  var weekIndex = Math.floor(daysSinceStart / 7)
  if (weekIndex < 0) weekIndex = 0
  if (weekIndex >= learningPath.length) weekIndex = learningPath.length - 1
  return learningPath[weekIndex]
}

function getWeekForDay(dayIndex) {
  return getCurrentWeek(dayIndex)
}

function getWeekIndex() {
  var startDate = wx.getStorageSync("learningStartDate")
  if (!startDate) {
    var today = new Date()
    var y = today.getFullYear()
    var m = String(today.getMonth() + 1).padStart(2, "0")
    var d = String(today.getDate()).padStart(2, "0")
    startDate = y + "-" + m + "-" + d
    wx.setStorageSync("learningStartDate", startDate)
  }
  var start = new Date(startDate.replace(/-/g, "/"))
  var now = new Date()
  var daysSinceStart = Math.floor((now - start) / (1000 * 60 * 60 * 24))
  return Math.min(Math.floor(daysSinceStart / 7), learningPath.length - 1)
}

function getWeekTheme() {
  var weekIndex = getWeekIndex()
  return learningPath[weekIndex]
}

module.exports = {
  getLearningPath,
  getCurrentWeek,
  getWeekForDay,
  getWeekIndex,
  getWeekTheme
}