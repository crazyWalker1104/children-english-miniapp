# 2026-06-27 AGENTS 规范对齐记录

## 本轮目标

根据项目根目录新增的 `AGENTS.md`，对当前微信小程序 Demo 做第一轮规范对齐。

## 已完成

### 1. WXML 事件绑定

- 将旧式 `bindtap` 改为 `bind:tap`
- 列表渲染统一使用稳定 key，未使用 index 作为 key
- 家长中心年龄、听过单词、奖励列表已改为带 `id` 的数据结构

涉及页面：

- `pages/home/index.wxml`
- `pages/daily/index.wxml`
- `pages/colors/index.wxml`
- `pages/speak/index.wxml`
- `pages/songs/index.wxml`
- `pages/art/index.wxml`
- `pages/parent/index.wxml`

### 2. 多端适配

- `app.json` 增加 `"resizable": true`
- `app.json` 增加 `"pageOrientation": "auto"`
- 新增 `utils/layout.js`
- 7 个页面均增加 `onResize`
- 页面根节点增加 `page-{{layoutMode}}`
- `app.wxss` 增加安全区适配
- `app.wxss` 增加 768px / 1024px 媒体查询
- PC 宽屏下内容居中并限制最大宽度
- PC 端增加 hover 反馈

### 3. 网络请求封装

- 新增 `utils/request.js`
- 后续 RESTful API 调用统一从该方法进入
- 当前项目无业务页面直接调用 `wx.request`

### 4. 禁止项遵守

本轮未修改：

- `project.config.json`
- `sitemap.json`
- `miniprogram_npm`

本轮未执行：

- `git push`
- 删除核心文件
- 引入浏览器端库

## 检查结果

- JS 语法检查通过
- JSON 配置解析通过
- 旧式 `bindtap` 已清除
- `wx:key="*this"` 已清除
- `wx.request` 仅存在于 `utils/request.js`

## 后续待做

### 1. 目录结构进一步规范

当前 Demo 位于：

```text
outputs/miniapp-demo
```

后续如果转入正式工程，建议迁移为：

```text
miniprogram/
```

并按 `AGENTS.md` 中的正式目录结构组织。

### 2. Vant Weapp 接入

`AGENTS.md` 指定 UI 组件库为 Vant Weapp。当前 Demo 仍为原生组件占位，后续如进入正式开发，可接入：

- Button
- Toast
- Dialog
- Popup
- Icon

### 3. 真机适配验证

需要在以下环境验证：

- 手机
- 平板
- 折叠屏
- PC 微信客户端

重点检查：

- 安全区
- 大屏居中
- 触摸区域
- hover 状态
- 横竖屏切换
