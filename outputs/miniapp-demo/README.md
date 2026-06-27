# Hello Park 微信小程序 Demo

这是儿童英语启蒙微信小程序的原生微信小程序 Demo 骨架，面向 3-6 岁儿童。

## 已实现

- 首页
- 今日小游戏 / 惊喜任务：3 题一组、进度点、整组完成反馈
- 随机主题池
- 避免连续重复主题
- 年龄分层基础规则
- 家长端年龄切换
- 音频播放占位管理器
- 颜色乐园：按年龄控制选项数量、3 题一组颜色星
- 跟我说：Listen / Say / Smile 三步练习
- 儿歌时间：歌词卡片、动作提示、自动高亮当前句
- 小小艺术家：按年龄切换 4 / 6 / 9 片拼图
- 家长中心：学习时长、任务数、听过单词、奖励贴纸
- 本地学习记录
- 安全区与大屏适配
- `onResize` 横竖屏 / 平板 / PC 响应

## 导入方式

1. 打开微信开发者工具
2. 选择“导入项目”
3. 项目目录选择本文件夹：`outputs/miniapp-demo`
4. AppID 可选择测试号或使用 `touristappid`

## 说明

当前 Demo 不包含真实音频和授权 IP 素材，所有内容均为 mock。正式开发时需要替换：

- 英文发音音频
- 儿歌音频
- 儿歌歌词
- 名画儿童化素材
- 授权 IP 角色或原创角色素材

当前 `utils/audio.js` 只用 `wx.showToast` 模拟发音反馈，后续接入真实音频时建议统一替换该封装，页面侧不直接操作音频 API。

## 页面

- `pages/home/index` 首页
- `pages/daily/index` 今日小游戏
- `pages/colors/index` 颜色乐园
- `pages/speak/index` 跟我说
- `pages/songs/index` 儿歌时间
- `pages/art/index` 小小艺术家
- `pages/parent/index` 家长中心

## 核心工具

- `utils/randomizer.js` 随机主题池
- `utils/age.js` 年龄分层规则
- `utils/progress.js` 学习记录
- `utils/audio.js` 音频播放占位，后续可替换为真实音频
- `utils/layout.js` 多端布局模式
- `utils/request.js` RESTful 请求统一封装
- `data/tasks.js` mock 内容数据
- `styles/tokens.wxss` 设计 token 样式占位

## 验证记录

已执行：

- JS 语法检查
- JSON 配置解析
- 规范扫描：旧式 `bindtap`、`wx:key="*this"`、页面直接 `wx.request`

当前 `wx.request` 仅存在于 `utils/request.js`，符合统一请求封装约定。

## 设计系统

设计规范见：

```text
../design-system-v1.md
```
