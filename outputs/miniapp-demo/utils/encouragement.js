// 儿童鼓励话术库
// 随机选择一个鼓励短语，避免重复

var correctPhrases = [
  "Great job! ★",
  "Awesome! ★",
  "You did it! ★",
  "Super! ★",
  "Wonderful! ★",
  "Amazing! ★",
  "Fantastic! ★",
  "Well done! ★",
  "Good work! ★",
  "Brilliant! ★",
  "You're so smart! ★",
  "Nice one! ★",
  "Perfect! ★",
  "Excellent! ★",
  "Hooray! ★"
]

var completePhrases = [
  "All done! Super star! ★★★",
  "You finished! Amazing! ★★★",
  "All complete! Great! ★★★",
  "You're a star! ★★★",
  "All done! Hooray! ★★★",
  "Finished! You rock! ★★★",
  "All done! Well done! ★★★",
  "Complete! So proud! ★★★"
]

var retryPhrases = [
  "Try again!",
  "Almost! Try again!",
  "One more try!",
  "You're close!",
  "Try another one!",
  "Not quite, try again!",
  "Keep going!"
]

var lastCorrectIndex = -1
var lastCompleteIndex = -1
var lastRetryIndex = -1

function pickRandom(arr, lastIndexRef) {
  if (arr.length === 1) return arr[0]
  var index
  do {
    index = Math.floor(Math.random() * arr.length)
  } while (index === lastIndexRef)
  return arr[index]
}

function encourage() {
  var phrase = pickRandom(correctPhrases, lastCorrectIndex)
  lastCorrectIndex = correctPhrases.indexOf(phrase)
  return phrase
}

function encourageComplete() {
  var phrase = pickRandom(completePhrases, lastCompleteIndex)
  lastCompleteIndex = completePhrases.indexOf(phrase)
  return phrase
}

function encourageRetry() {
  var phrase = pickRandom(retryPhrases, lastRetryIndex)
  lastRetryIndex = retryPhrases.indexOf(phrase)
  return phrase
}

module.exports = {
  encourage,
  encourageComplete,
  encourageRetry
}