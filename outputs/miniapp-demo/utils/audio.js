function playText(text) {
  wx.showToast({
    title: text,
    icon: "none",
    duration: 900
  })
}

module.exports = {
  playText
}
