# 2026-06-27 开发推进记录

## 本轮目标

把 Demo 从静态骨架继续推进成更像可真机预览的 MVP。

## 已完成

### 1. 学习时长记录

- 新增 `addStudySeconds`
- App 进入后台时累计会话时长
- 关键任务完成时累计有效学习秒数
- 家长中心学习时长不再长期为 0

### 2. 今日小游戏完成态

- 答对后显示完成反馈
- 新增“再来一个惊喜任务”按钮
- 避免答对后页面没有下一步动作
- 新增 3 题一组的儿童学习闭环
- 答对后点亮进度点，完成 3 题后显示整组完成反馈
- 根据当前轮次展示轻量难度提示，形成循序渐进感

### 3. 家长中心记录增强

- 展示今日听过的单词
- 展示今日获得的奖励
- 空状态提示更清楚

### 4. 名画拼图交互升级

- 小小艺术家从“点一下完成”升级为“先选碎片，再放到画布格子”
- 根据年龄自动切换 4 / 6 / 9 片拼图难度
- 增加已放置数量反馈
- 放错位置会给轻量提示，完成后记录学习时长和奖励

### 5. 儿歌跟唱状态

- 为儿歌数据补充短句歌词和动作提示
- 点击歌曲后展示歌词卡片
- 按节拍自动高亮当前歌词行
- 离开页面时清理歌词计时器，避免后台继续运行

### 6. 颜色认知回合制

- 颜色乐园改为 3 题一组的颜色星进度
- 选项数量根据年龄难度动态调整
- 答对后锁定当前回合，避免重复点击重复计数
- 完成一组后可继续开始下一组颜色任务

### 7. 美语跟读三步练习

- 跟读页新增 Listen / Say / Smile 三步状态
- 5-6 岁自动出现简单短句，如 `I see red.`
- 未先听音时点击练习会提示先听
- 重播按钮改为真正重播当前词/短句

### 8. 统一触觉反馈

- 新增 `utils/interaction.js`
- 成功、完成、错误反馈使用不同触觉强度
- 所有震动调用先通过 `wx.canIUse` 做能力判断
- PC 端或不支持设备自动静默降级

### 9. 音频管理器升级

- `utils/audio.js` 从 toast 占位升级为统一音频播放封装
- 有真实资源时使用 `wx.createInnerAudioContext`
- 无资源或 API 不可用时自动降级为文字提示
- 新增 `data/audio-sources.js` 管理文本 key 到音频 URL 的映射
- App 进入后台时停止当前音频
- 新增 `assets/audio` 和 `assets/images` 素材目录占位

### 10. 家长照护设置

- 新增 `utils/settings.js`
- 家长中心新增声音提示、触觉反馈、安静模式开关
- 音频封装读取家长设置，关闭声音后不再播放或弹出发音提示
- 触觉封装读取家长设置，安静模式下自动关闭震动
- 设置保存在本地缓存，并同步到 App 全局状态

### 11. 家长中心安全与建议

- 清空今日记录增加二次确认，避免误触
- 今日建议改为根据年龄、学习时长、听词数、跟读数和儿歌播放动态生成
- 学习时长过长时提示收尾休息，降低过度使用风险

### 12. 每日时长提醒

- 家长中心新增每日建议时长选择：10 / 15 / 20 分钟
- 今日建议按照家长设置的时长阈值生成
- 首页展示今日学习分钟数和建议时长
- 接近或达到建议时长时，首页给出温和收尾提醒

### 13. 首页休息确认

- 达到每日建议时长后，首页进入学习模块会先弹出休息确认
- 用户仍可选择再玩一次短任务，不做强制拦截
- 达到建议时长时，主入口文案改为“短任务收尾”

### 14. 最近 7 天摘要

- `utils/progress.js` 增加学习历史归档
- 跨天时自动把上一天学习记录转为摘要
- 家长中心新增一周概览，展示活跃天、总分钟、任务数和贴纸数
- 增加 7 天学习分钟柱状图

### 15. 内容库结构化

- 单词库从字符串数组升级为对象结构
- 单词支持 `id`、英文、中文提示、分类、最小年龄和短句
- 跟读页按年龄筛选单词，并展示中文提示
- 儿歌库补充中文标题、最小年龄和未来音频 key
- 新增 `data/README.md` 说明单词、儿歌和音频映射维护方式
- 新增 `data/content.js`，统一处理年龄筛选、随机取词和短句选择

### 16. 单词库导入工具

- 新增 `data/word-import-template.csv`，支持用表格维护候选单词
- 新增 `data/import-words.js`，把审核通过的 CSV 单词合入 `tasks.js`
- 导入时自动规范化 `id`、跳过未审核行、覆盖同 id 单词并追加新增单词
- 导入完成后自动执行内容库校验，降低维护出错概率

### 17. 儿歌库导入工具

- 新增 `data/song-import-template.csv`，支持用表格维护儿歌卡片和动作提示
- 新增 `data/import-songs.js`，把审核通过的 CSV 儿歌合入 `tasks.js`
- 导入时自动规范化 `id` 和 `audioKey`，生成稳定歌词行 id
- 导入完成后自动执行内容库校验，便于后续替换为授权儿歌内容

### 18. 上线素材缺失检测

- 新增 `data/asset-manifest.js`，集中记录必须替换的音频和图片资源
- 新增 `data/validate-assets.js`，检查音频映射、音频文件和图片文件是否缺失
- 默认模式只提示缺失项，`--strict` 模式可作为上线前阻断检查
- README 和交付文档补充素材检查入口

### 19. 一键交付检查

- 新增 `scripts/check-demo.js`
- 一键执行 JS 语法、JSON 解析、内容库、素材清单和小程序规范扫描
- 支持 `--strict-assets`，用于真实素材替换后的发布前阻断检查
- 交付文档改为优先使用一键检查命令

## 涉及文件

- `outputs/miniapp-demo/utils/progress.js`
- `outputs/miniapp-demo/utils/interaction.js`
- `outputs/miniapp-demo/utils/audio.js`
- `outputs/miniapp-demo/utils/settings.js`
- `outputs/miniapp-demo/app.js`
- `outputs/miniapp-demo/data/audio-sources.js`
- `outputs/miniapp-demo/assets/*`
- `outputs/miniapp-demo/pages/daily/*`
- `outputs/miniapp-demo/pages/colors/index.js`
- `outputs/miniapp-demo/pages/colors/index.wxml`
- `outputs/miniapp-demo/pages/colors/index.wxss`
- `outputs/miniapp-demo/data/tasks.js`
- `outputs/miniapp-demo/data/import-words.js`
- `outputs/miniapp-demo/data/word-import-template.csv`
- `outputs/miniapp-demo/data/import-songs.js`
- `outputs/miniapp-demo/data/song-import-template.csv`
- `outputs/miniapp-demo/data/asset-manifest.js`
- `outputs/miniapp-demo/data/validate-assets.js`
- `outputs/miniapp-demo/scripts/check-demo.js`
- `outputs/miniapp-demo/pages/songs/index.js`
- `outputs/miniapp-demo/pages/songs/index.wxml`
- `outputs/miniapp-demo/pages/songs/index.wxss`
- `outputs/miniapp-demo/pages/art/index.js`
- `outputs/miniapp-demo/pages/art/index.wxml`
- `outputs/miniapp-demo/pages/art/index.wxss`
- `outputs/miniapp-demo/pages/speak/index.js`
- `outputs/miniapp-demo/pages/speak/index.wxml`
- `outputs/miniapp-demo/pages/speak/index.wxss`
- `outputs/miniapp-demo/pages/parent/*`

## 下一步建议

1. 补充真实英文发音与儿歌音频资源
2. 增加素材目录和占位图片
3. 如需更强手感，可把拼图页继续升级为 `movable-view` 拖拽
4. 替换儿歌页占位节拍为真实音频播放进度
5. 真机预览，检查触摸区域和视觉尺寸
