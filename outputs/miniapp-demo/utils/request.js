const API_BASE_URL = ""

function request(options) {
  return new Promise(function(resolve, reject) {
    const url = options.url && options.url.indexOf("http") === 0
      ? options.url
      : `${API_BASE_URL}${options.url || ""}`

    wx.request({
      url,
      method: options.method || "GET",
      data: options.data || {},
      header: {
        "content-type": "application/json",
        ...(options.header || {})
      },
      success: function(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data)
          return
        }
        reject({
          message: "request failed",
          statusCode: res.statusCode,
          data: res.data
        })
      },
      fail: reject
    })
  })
}

module.exports = {
  request
}
