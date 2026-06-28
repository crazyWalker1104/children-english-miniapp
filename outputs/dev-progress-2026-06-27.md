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

### 20. UI 视觉升级 V3 —— Playful Picture Book（本轮新增）

**设计令牌系统升级**：
- 全新色彩体系：珊瑚红 `#ff6b6b`、薄荷绿 `#6bcb77`、紫色 `#6c5ce7`、蓝色 `#4d96ff`、金色 `#ffd93d`
- 背景渐变：奶油白 `#fef9f0` → 蜜桃色 `#fff5e8` → 暖白 `#fff8f2`
- 每个功能模块独特色彩标识，形成视觉区分

**动画系统**（`styles/tokens.wxss` 新增 9 个关键帧）：
- `fadeInUp`、`fadeInScale` — 入场动画
- `popBounce` — 弹跳弹出（贴纸点亮）
- `wiggle` — 错误抖动反馈
- `floatUpDown` — 浮动装饰元素
- `starPop` — 星星旋转弹出
- `progressGlow` — 当前步骤光晕脉冲
- `gentlePulse` — 完成按钮呼吸
- `slideInRight` — 侧滑入场
- `shimmer` — 光泽扫过

**全局样式增强**（`app.wxss`）：
- 统一卡片样式：圆角 32rpx、半透明白底、柔和阴影
- 主 CTA 卡片：珊瑚红到金色渐变
- 反馈提示：成功绿色边框、错误红色边框 + 抖动动画
- 完成按钮：绿色渐变 + 呼吸脉冲
- 进度点：渐变色胶囊 + 缩放动画
- 5 级延迟入场动画类（`entrance-1` 到 `entrance-5`）

**首页升级**（`pages/home/`）：
- Hero 卡片：暖金色渐变背景 + 径向光晕 + 吉祥物圆形容器 + 3 个浮动星星装饰 + 挥手 emoji 浮动动画
- 今日推荐卡片：蓝色渐变 + 半透明播放按钮
- 模块网格：四色独立渐变（红/紫/绿/橙）+ 图标容器 + 描述文字
- 贴纸进度：三段式圆形槽位 + 连接线 + 点亮时 `starPop` 动画 + 完成计数徽章

**颜色乐园升级**（`pages/colors/`）：
- 提示卡片：徽章标签 + 大号问题文字 + 目标 emoji 圆形展示 + 渐变色进度点
- 颜色卡片：光泽叠加层（`radial-gradient`）+ 阴影 + 按下缩放

**跟我说升级**（`pages/speak/`）：
- 单词卡片：紫色分类徽章 + 80rpx 大号单词 + 中文提示 + 短语底板
- 步骤流程：圆形步骤指示器 + 连接线 + 三态（待完成/当前光晕/已完成绿色弹出）
- 操作按钮：三层结构（图标圆 + 文字标签），录音按钮 120rpx 更大

**小小艺术家升级**（`pages/art/`）：
- 拼图板：星空夜景主题（深蓝渐变 + 图片叠加 + 光晕叠加 + 4 个浮动星星）
- 进度条：圆角渐变进度条 + 百分比文字
- 拼图块：白色边框 + 已放置金色 + 选中橙色上浮阴影
- 完成横幅：金色渐变背景 + 庆祝 emoji 弹出动画

**家长端升级**（`pages/parent/`）：
- 头像卡片：渐变头像 + 昵称 + 贴纸计数徽章
- 统计网格：3 列布局 + emoji 图标 + 大号数值 + 标签
- 设置卡片：chip 风格年龄/时长选择 + 分段开关行
- 建议卡片：蓝色调 + 灯泡图标
- 周视图：渐变色柱状图 + 4 格摘要

**儿歌/每日同步**（`pages/songs/`、`pages/daily/`）：
- 全局设计令牌同步，圆角、色彩、阴影统一
- 播放按钮脉冲动画
- 歌词行高亮渐变色

**涉及文件（本轮新增/修改）**：
- `styles/tokens.wxss` — 设计令牌 + 9 个动画关键帧
- `app.wxss` — 全局样式升级（背景、卡片、反馈、工具类）
- `pages/home/index.wxml` — 首页结构重写
- `pages/home/index.wxss` — 首页样式重写
- `pages/home/index.js` — 新增 `completedCount` 数据字段
- `pages/colors/index.wxml` — 颜色乐园结构重写
- `pages/colors/index.wxss` — 颜色乐园样式重写
- `pages/speak/index.wxml` — 跟我说结构重写
- `pages/speak/index.wxss` — 跟我说样式重写
- `pages/art/index.wxml` — 小小艺术家结构重写
- `pages/art/index.wxss` — 小小艺术家样式重写
- `pages/parent/index.wxml` — 家长端结构重写
- `pages/parent/index.wxss` — 家长端样式重写
- `pages/daily/index.wxml` — 今日小游戏同步
- `pages/daily/index.wxss` — 今日小游戏同步
- `pages/songs/index.wxml` — 儿歌时间同步
- `pages/songs/index.wxss` — 儿歌时间同步

### 21. P1 优先开发全面完成（本轮新增）

**内容库大幅扩充**：
- 单词库 25 → 75 个，覆盖 10 个分类：问候(7)、家人(7)、玩具(7)、动物(10)、食物(10)、动作(10)、身体(5)、颜色(4)、日常(8)、艺术(3)
- 儿歌库 7 → 10 首（新增 Rainbow Song、Wash Your Hands、Hello Friends、Animal Move、Body Song、Number Song、Yummy Food）
- 每日任务池 9 → 40 个

**新增 4 种每日任务题型**：
- 听音选图（listen-match）：播放按钮 + 4 张图片卡，播放音频后选匹配图片
- 颜色配对（color-match）：4 色 2×2 网格，选择匹配的颜色卡片
- 找一找（find-it）：3×2 网格 emoji，在 6 个物品中找到目标
- 单词气泡（word-bubble）：3 个圆形浮动气泡（CSS 动画），点击正确弹出

**拼图交互升级**：
- 两段式交互：先选数字块（高亮 + 上浮阴影）→ 再点击对应位置放置（空位紫色光晕提示）
- 提示文字："已选中数字 X，点击拼图板上对应位置放置"

**歌词真实进度同步**：
- 通过 `onTimeUpdate` 回调获取真实播放进度
- 按歌词行数均分时间自动高亮
- 3 秒兜底：未收到真实进度时回退到固定 interval

**音频播放状态暴露**：
- 加载中：黄色脉冲圆点 + "加载中..." + 进度百分比
- 播放中：绿色呼吸圆点 + "播放中" + 进度百分比
- 底层 `audio.js` 已有 `onAudioStatusChange` 监听器

**儿童鼓励话术库**（新文件 `utils/encouragement.js`）：
- 15 条正确鼓励短语 + 8 条完成鼓励 + 7 条重试鼓励
- 随机不重复，已集成到 daily/speak/art 页面

**学习路径**（新文件 `utils/learning-path.js`）：
- 6 周学习计划：第1周颜色 → 第2周问候 → 第3周动物 → 第4周食物 → 第5周玩具 → 第6周身体
- 自动计算当前周，首页展示本周主题条
- 家长端展示本周主题卡片（标题 + 描述 + 每日建议）

**家长端内容管理**：
- 内容统计：单词 75 个/10 分类、儿歌 10 首、任务池 40 个
- 本周学习主题卡片
- 6 周学习主题概览

**涉及文件（本轮新增/修改）**：
- `data/tasks.js` — 单词 75 个 + 儿歌 10 首 + 任务池 40 个
- `data/content.js` — 新增 5 个分类标签
- `utils/encouragement.js` — 儿童鼓励话术库（新文件）
- `utils/learning-path.js` — 6 周学习路径（新文件）
- `pages/daily/index.js` — 4 种新题型处理逻辑
- `pages/daily/index.wxml` — 4 种新题型模板
- `pages/daily/index.wxss` — 新题型样式（气泡/找一找/颜色配对/听音）
- `pages/art/index.wxml` — 两段式拼图交互
- `pages/art/index.wxss` — 选中态/空位光晕样式
- `pages/art/index.js` — 集成鼓励话术
- `pages/songs/index.js` — onTimeUpdate 真实进度同步
- `pages/songs/index.wxml` — 音频状态行
- `pages/songs/index.wxss` — 音频状态样式
- `pages/speak/index.js` — 集成鼓励话术
- `pages/parent/index.js` — 内容管理数据 + 学习主题
- `pages/parent/index.wxml` — 内容管理模块 + 学习主题卡片
- `pages/parent/index.wxss` — 内容管理样式
- `pages/home/index.js` — 本周主题条
- `pages/home/index.wxml` — 本周主题条
- `pages/home/index.wxss` — 主题条样式

## 下一步建议

1. 使用微信开发者工具真机验收（含新 UI 动效 + P1 新题型）
2. 补充真实英文发音与儿歌音频资源
3. 如需更强手感，可把拼图页继续升级为 `movable-view` 拖拽
4. 真机预览，检查触摸区域和视觉尺寸
5. 进入 P2 产品化开发：后端 API、账号体系、云端同步
