function getAgeLevel(age) {
  if (age <= 4) {
    return {
      key: "listen",
      label: "听点为主",
      choiceCount: 3,
      puzzlePieces: 4,
      phraseMode: false
    }
  }

  if (age === 5) {
    return {
      key: "match",
      label: "跟读配对",
      choiceCount: 4,
      puzzlePieces: 6,
      phraseMode: true
    }
  }

  return {
    key: "combine",
    label: "短句组合",
    choiceCount: 4,
    puzzlePieces: 9,
    phraseMode: true
  }
}

module.exports = {
  getAgeLevel
}
