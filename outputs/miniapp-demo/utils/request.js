/**
 * 统一网络请求封装
 *
 * 功能：
 * - 统一超时配置（默认 15 秒，可按请求覆盖）
 * - 自动注入 Authorization token（从本地存储读取）
 * - 统一错误码映射与用户提示（可通过 showError: false 关闭）
 * - 401 自动清除过期 token
 * - 便捷方法 get / post / put / del
 *
 * 用法：
 *   const { get, post } = require("../../utils/request")
 *   get("/api/words", { page: 1 }).then(res => {}).catch(err => {})
 *   post("/api/progress", { taskId: "t1" }, { showError: false }).then(...)
 */

const API_BASE_URL = ""

// 默认超时时间（毫秒）
const DEFAULT_TIMEOUT = 15000

// 统一错误码 → 用户可读提示
var ERROR_MESSAGES = {
  0: "网络连接失败，请检查网络设置",
  400: "请求参数有误",
  401: "登录已过期，请重新进入",
  403: "暂无权限访问",
  404: "请求的资源不存在",
  500: "服务器开小差了，请稍后再试",
  502: "服务暂不可用，请稍后再试",
  503: "服务维护中，请稍后再试",
  504: "请求超时，请稍后再试"
}

function getErrorMessage(statusCode) {
  return ERROR_MESSAGES[statusCode] || "请求失败，请稍后再试"
}

// 从本地存储读取鉴权 token
function getToken() {
  try {
    return wx.getStorageSync("auth_token") || ""
  } catch (e) {
    return ""
  }
}

// 清除过期 token
function clearToken() {
  try {
    wx.removeStorageSync("auth_token")
  } catch (e) {
    // 忽略存储异常
  }
}

// 统一错误提示
function showErrorToast(message) {
  try {
    wx.showToast({
      title: message,
      icon: "none",
      duration: 2000
    })
  } catch (e) {
    // 忽略 toast 异常
  }
}

function request(options) {
  return new Promise(function (resolve, reject) {
    var url = options.url && options.url.indexOf("http") === 0
      ? options.url
      : API_BASE_URL + (options.url || "")

    // 合并 header，自动注入 token
    var header = Object.assign(
      { "content-type": "application/json" },
      options.header || {}
    )

    var token = getToken()
    if (token && !header["Authorization"]) {
      header["Authorization"] = "Bearer " + token
    }

    wx.request({
      url: url,
      method: options.method || "GET",
      data: options.data || {},
      header: header,
      timeout: options.timeout || DEFAULT_TIMEOUT,
      success: function (res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data)
          return
        }

        // 401 表示鉴权过期，清除本地 token
        if (res.statusCode === 401) {
          clearToken()
        }

        var error = {
          message: getErrorMessage(res.statusCode),
          statusCode: res.statusCode,
          data: res.data
        }

        if (options.showError !== false) {
          showErrorToast(error.message)
        }

        reject(error)
      },
      fail: function (err) {
        var error = {
          message: getErrorMessage(0),
          statusCode: 0,
          data: err
        }

        if (options.showError !== false) {
          showErrorToast(error.message)
        }

        reject(error)
      }
    })
  })
}

// 便捷方法
function get(url, data, options) {
  return request(Object.assign({}, options || {}, { url: url, method: "GET", data: data }))
}

function post(url, data, options) {
  return request(Object.assign({}, options || {}, { url: url, method: "POST", data: data }))
}

function put(url, data, options) {
  return request(Object.assign({}, options || {}, { url: url, method: "PUT", data: data }))
}

function del(url, data, options) {
  return request(Object.assign({}, options || {}, { url: url, method: "DELETE", data: data }))
}

module.exports = {
  request: request,
  get: get,
  post: post,
  put: put,
  del: del,
  // 暴露配置项供外部调整
  API_BASE_URL: API_BASE_URL,
  DEFAULT_TIMEOUT: DEFAULT_TIMEOUT
}
