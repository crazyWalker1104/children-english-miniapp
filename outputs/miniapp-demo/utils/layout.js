function getLayoutMode(width) {
  if (width >= 1024) return "pc"
  if (width >= 768) return "tablet"
  return "mobile"
}

function getCurrentLayoutMode() {
  try {
    const info = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync()
    return getLayoutMode(info.windowWidth || info.screenWidth || 375)
  } catch (error) {
    return "mobile"
  }
}

function getResizeLayoutMode(resizeInfo) {
  const size = resizeInfo && resizeInfo.size ? resizeInfo.size : resizeInfo
  return getLayoutMode((size && size.windowWidth) || 375)
}

module.exports = {
  getCurrentLayoutMode,
  getResizeLayoutMode
}
