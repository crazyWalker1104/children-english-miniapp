# Hello Park 可用版本交付说明

## 当前状态

这是一个可导入微信开发者工具预览的原生微信小程序 Demo，面向 3-6 岁儿童英语启蒙。

项目目录：

```text
outputs/miniapp-demo
```

## 可体验功能

- 首页：年龄模式、贴纸进度、学习时长提醒、休息确认。
- 今日小游戏：随机主题、3 题一组、按年龄调难度。
- 颜色乐园：听颜色、点颜色、3 题颜色星进度。
- 跟我说：结构化单词库、年龄筛选、Listen / Say / Smile 三步练习。
- 儿歌时间：年龄筛选、歌词卡片、动作提示、自动高亮。
- 小小艺术家：4 / 6 / 9 片名画拼图占位交互。
- 家长中心：年龄切换、照护设置、每日建议时长、一周概览、动态建议。

## 导入方式

1. 打开微信开发者工具。
2. 选择“导入项目”。
3. 项目目录选择 `outputs/miniapp-demo`。
4. AppID 可选择测试号或 `touristappid`。

## 已验证

```sh
find outputs/miniapp-demo -name '*.js' -print0 | xargs -0 -n 1 node --check
find outputs/miniapp-demo -name '*.json' -print0 | xargs -0 -n 1 node -e "const fs=require('fs'); JSON.parse(fs.readFileSync(process.argv[1], 'utf8'))"
node outputs/miniapp-demo/data/validate-content.js
```

## 内容维护

- 单词、儿歌、随机任务维护在 `data/tasks.js`。
- 年龄筛选和随机取词逻辑在 `data/content.js`。
- 音频映射维护在 `data/audio-sources.js`。
- 维护说明见 `data/README.md`。
- 单词可通过 `data/word-import-template.csv` + `node data/import-words.js data/word-import-template.csv` 导入。
- 儿歌可通过 `data/song-import-template.csv` + `node data/import-songs.js data/song-import-template.csv` 导入。
- 上线素材清单在 `data/asset-manifest.js`，可通过 `node data/validate-assets.js` 检查缺失音频和图片。

## 仍需替换

当前版本不包含真实授权音频、商业 IP 角色素材、正式名画儿童化图片。上线前需要替换：

- 英文单词/短句音频
- 儿歌音频与授权歌词
- 原创角色或已授权角色素材
- 名画拼图真实图片资源

## 注意

- 首版不采集真实儿童语音。
- 触觉、音频、网络请求都已走统一封装。
- `project.private.config.json` 为本地私有配置，不应提交。
