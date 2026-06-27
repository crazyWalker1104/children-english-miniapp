# Hello Park 微信小程序 Demo

这是儿童英语启蒙微信小程序的原生微信小程序 Demo 骨架，面向 3-6 岁儿童。

## 已实现

- 首页：展示年龄模式、贴纸进度、每日时长提醒和休息确认
- 今日小游戏 / 惊喜任务：3 题一组、进度点、整组完成反馈
- 随机主题池
- 避免连续重复主题
- 年龄分层基础规则
- 家长端年龄切换
- 音频播放管理器：有真实资源时播放音频，无资源时文字降级
- 颜色乐园：按年龄控制选项数量、3 题一组颜色星
- 跟我说：Listen / Say / Smile 三步练习
- 儿歌时间：歌词卡片、动作提示、自动高亮当前句
- 小小艺术家：按年龄切换 4 / 6 / 9 片拼图
- 家长中心：学习时长、任务数、听过单词、奖励贴纸、一周概览、照护设置、每日建议时长、动态建议
- 本地学习记录
- 统一触觉反馈：成功、完成、错误状态区分震动强度
- 安全区与大屏适配
- `onResize` 横竖屏 / 平板 / PC 响应

## 导入方式

完整交付说明见：

```text
DELIVERY.md
```

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

当前 `utils/audio.js` 已支持 `wx.createInnerAudioContext`。后续接入真实音频时，在 `data/audio-sources.js` 中维护文本 key 到音频 URL 的映射即可；没有配置音频时会自动用 `wx.showToast` 文字降级。

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
- `utils/progress.js` 学习记录和最近 7 天摘要
- `utils/settings.js` 家长照护偏好设置
- `utils/audio.js` 音频播放封装，支持真实音频和文字降级
- `utils/interaction.js` 触觉反馈封装，自动做能力判断和降级
- `utils/layout.js` 多端布局模式
- `utils/request.js` RESTful 请求统一封装
- `data/audio-sources.js` 音频资源映射
- `data/content.js` 内容查询助手，统一处理年龄筛选和短句选择
- `data/tasks.js` 结构化内容数据：颜色、单词、儿歌、随机任务
- `data/import-words.js` 单词 CSV 导入工具
- `data/word-import-template.csv` 单词导入模板
- `data/import-songs.js` 儿歌 CSV 导入工具
- `data/song-import-template.csv` 儿歌导入模板
- `data/asset-manifest.js` 上线素材清单
- `data/validate-assets.js` 音频 / 图片缺失检测
- `data/README.md` 内容库维护说明
- `assets/` 静态素材目录
- `styles/tokens.wxss` 设计 token 样式占位

## 验证记录

已执行：

- JS 语法检查
- JSON 配置解析
- 内容库校验：`node data/validate-content.js`
- 素材缺失检查：`node data/validate-assets.js`
- 规范扫描：旧式 `bindtap`、`wx:key="*this"`、页面直接 `wx.request`、页面直接硬件 API

当前 `wx.request` 仅存在于 `utils/request.js`，符合统一请求封装约定。
当前 `wx.vibrateShort` 仅存在于 `utils/interaction.js`，符合硬件能力统一降级约定。
当前 `wx.createInnerAudioContext` 仅存在于 `utils/audio.js`，页面侧不直接操作音频实例。

家长中心可配置：

- 声音提示
- 触觉反馈
- 安静模式
- 每日建议时长：10 / 15 / 20 分钟

家长中心清空今日记录前会二次确认，避免误触删除宝宝当天学习进度。
达到每日建议时长后，从首页进入学习模块会先出现休息确认，可选择休息或再玩一个短任务。
家长中心会展示最近 7 天活跃天数、学习分钟、任务数、贴纸数和每日学习柱状图。

内容库维护见 `data/README.md`。单词支持年龄、分类、中文提示和短句；儿歌支持年龄、中文标题和未来音频 key。
单词可先在 `data/word-import-template.csv` 中审核整理，再执行 `node data/import-words.js data/word-import-template.csv` 合入内容库。
儿歌可先在 `data/song-import-template.csv` 中审核整理，再执行 `node data/import-songs.js data/song-import-template.csv` 合入内容库。
上线素材清单维护在 `data/asset-manifest.js`，可执行 `node data/validate-assets.js --strict` 作为发布前检查。

## 设计系统

设计规范见：

```text
../design-system-v1.md
```
