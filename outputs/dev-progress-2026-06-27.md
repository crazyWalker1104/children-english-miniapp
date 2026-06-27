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

## 涉及文件

- `outputs/miniapp-demo/utils/progress.js`
- `outputs/miniapp-demo/app.js`
- `outputs/miniapp-demo/pages/daily/*`
- `outputs/miniapp-demo/pages/colors/index.js`
- `outputs/miniapp-demo/pages/colors/index.wxml`
- `outputs/miniapp-demo/pages/colors/index.wxss`
- `outputs/miniapp-demo/data/tasks.js`
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

1. 替换 `utils/audio.js` 为真实 `wx.createInnerAudioContext`
2. 增加素材目录和占位图片
3. 如需更强手感，可把拼图页继续升级为 `movable-view` 拖拽
4. 替换儿歌页占位节拍为真实音频播放进度
5. 真机预览，检查触摸区域和视觉尺寸
