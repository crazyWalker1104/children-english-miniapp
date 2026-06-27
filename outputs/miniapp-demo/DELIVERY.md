# Hello Park 可用版本交付说明

## 当前状态

这是一个可导入微信开发者工具预览的原生微信小程序 Demo，面向 3-6 岁儿童英语启蒙。

P0 素材缺口已补齐为 MVP 可运行版本：英文 TTS 音频、原创儿童化图片素材和严格素材检查均已通过。正式商用上线前仍建议替换为真人录制音频和最终原创视觉素材。

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
cd outputs/miniapp-demo
node scripts/check-demo.js
node scripts/check-demo.js --strict-assets
```

替换真实素材后，发布前可执行 `node scripts/check-demo.js --strict-assets`。
商用发布前需在所有素材和合规项审批后执行 `node scripts/check-demo.js --strict-assets --strict-commercial`。

## 内容维护

- 单词、儿歌、随机任务维护在 `data/tasks.js`。
- 年龄筛选和随机取词逻辑在 `data/content.js`。
- 音频映射维护在 `data/audio-sources.js`。
- 维护说明见 `data/README.md`。
- 单词可通过 `data/word-import-template.csv` + `node data/import-words.js data/word-import-template.csv` 导入。
- 儿歌可通过 `data/song-import-template.csv` + `node data/import-songs.js data/song-import-template.csv` 导入。
- 上线素材清单在 `data/asset-manifest.js`，可通过 `node data/validate-assets.js` 检查缺失音频和图片。

## 仍需替换

当前版本已包含 MVP 可运行音频和原创占位图片，但不是最终商用素材。正式上线前建议替换：

- 真人美语单词 / 短句音频
- 儿歌正式音频与授权歌词
- 最终原创角色素材
- 最终名画拼图儿童化图片资源

## 人工真机检查

以下事项需要在微信开发者工具和真实设备中完成：

- 使用基础库 2.25.0 和 2.32.3 分别预览。
- 当前 `project.config.json` 的本地 `libVersion` 可能由微信开发者工具写入，请在工具内切换到目标基础库版本后再预览；该配置文件按项目规范不自动改写。
- 手机端检查：首页、今日小游戏、颜色乐园、跟我说、儿歌时间、小小艺术家、家长中心。
- 平板 / 折叠屏 / PC 微信端检查布局是否居中、触摸区域是否合理。
- 检查音频播放是否被系统静音、权限或微信客户端策略影响。
- 检查图片资源在真机预览中是否显示清晰。

## 注意

- 首版不采集真实儿童语音。
- 触觉、音频、网络请求都已走统一封装。
- `project.private.config.json` 为本地私有配置，不应提交。
