# 儿童英语启蒙微信小程序下一阶段方案

## 1. 页面路由

### 页面结构

```text
pages/
  home/index                 首页
  daily/index                今日小游戏 / 惊喜任务
  colors/index               颜色乐园
  speak/index                跟我说
  songs/index                儿歌时间
  art/index                  小小艺术家
  parent/index               家长中心
```

### 路由说明

| 页面 | 路由 | 用户 | 说明 |
| --- | --- | --- | --- |
| 首页 | `/pages/home/index` | 儿童 | 主入口，展示今日小游戏、固定模块、贴纸反馈 |
| 今日小游戏 | `/pages/daily/index` | 儿童 | 点击后从主题池随机抽取任务 |
| 颜色乐园 | `/pages/colors/index` | 儿童 | 颜色听辨、点选、颜色物品识别 |
| 跟我说 | `/pages/speak/index` | 儿童 | 原音播放、跟读、录音回放 |
| 儿歌时间 | `/pages/songs/index` | 儿童 | 儿歌播放、歌词高亮、动作提示 |
| 小小艺术家 | `/pages/art/index` | 儿童 | 名画拼图、颜色观察 |
| 家长中心 | `/pages/parent/index` | 家长 | 学习记录、完成任务、词汇/儿歌/跟读数据 |

---

## 2. 页面功能

### 首页

P0 功能：

- 显示卡通伙伴和问候语
- 显示“今日小游戏 / 惊喜任务”大入口
- 显示固定模块入口：颜色乐园、跟我说、儿歌时间、小小艺术家
- 显示今日贴纸或星星进度
- 提供家长中心入口

交互：

- 点击卡通伙伴播放问候音频
- 点击今日小游戏进入随机主题任务
- 完成任务后回到首页并更新奖励状态

### 今日小游戏 / 惊喜任务

P0 功能：

- 从主题池随机抽取任务
- 避免连续重复同一主题
- 根据年龄分层调整任务难度
- 播放英文任务指令
- 支持点击或拖拽互动
- 完成后发放奖励

主题池首版：

- 颜色任务
- 水果任务
- 动物任务
- 救援任务
- 冰雪颜色任务
- 词汇跟读任务

### 颜色乐园

P0 功能：

- 展示 6 个基础颜色
- 点击颜色播放英文
- 听英文点颜色
- 听英文点颜色物品
- 完成 3 次正确选择获得贴纸

首版颜色：

- `red`
- `blue`
- `yellow`
- `green`
- `pink`
- `purple`

### 跟我说

P0 功能：

- 播放标准美式发音
- 展示当前词句
- 点击鼓励反馈

P1 功能：

- 录音
- 录音回放
- 跟读次数记录

首版词句：

- `Hello`
- `Bye-bye`
- `Good morning`
- `Thank you`
- `red`
- `apple`

### 儿歌时间

P0 功能：

- 儿歌列表
- 播放 / 暂停
- 播放完成记录
- 播放完成奖励

P1 功能：

- 歌词高亮
- 动作提示

首版儿歌：

- `ABC Song`
- `Twinkle Twinkle Little Star`
- `If You're Happy`

### 小小艺术家

P0 功能：

- 儿童化《星月夜》拼图
- 4 块拼图
- 拖动拼图块
- 完成后奖励
- 听英文找颜色

P1 功能：

- 拼图吸附动画
- 6-9 块进阶拼图
- 作品贴纸保存

### 家长中心

P0 功能：

- 今日学习时长
- 完成任务数
- 听过的单词
- 儿歌播放次数
- 跟读次数
- 明日推荐

---

## 3. 组件清单

### 基础 UI 组件

| 组件 | 用途 | 优先级 |
| --- | --- | --- |
| `AppShell` | 页面基础容器、安全区、背景 | P0 |
| `TopBar` | 返回、标题、家长入口 | P0 |
| `BigEntryCard` | 首页大入口 | P0 |
| `ModuleTile` | 首页模块入口 | P0 |
| `IconButton` | 播放、返回、录音、暂停 | P0 |
| `RewardBadge` | 星星、贴纸、完成状态 | P0 |
| `FeedbackToast` | Great job / Try again | P0 |

### 学习互动组件

| 组件 | 用途 | 优先级 |
| --- | --- | --- |
| `MascotGreeting` | 角色问候、任务提示 | P0 |
| `AudioPrompt` | 播放英文指令 | P0 |
| `ChoiceGrid` | 颜色/图片点选 | P0 |
| `ColorCard` | 颜色卡片 | P0 |
| `ObjectCard` | 水果/动物/物品卡片 | P0 |
| `DragDropTask` | 拖拽物品任务 | P1 |
| `PuzzleBoard` | 拼图区域 | P0 |
| `PuzzlePiece` | 拼图块 | P0 |
| `SongPlayer` | 儿歌播放 | P0 |
| `LyricHighlighter` | 歌词高亮 | P1 |
| `RecordButton` | 录音按钮 | P1 |

### 数据组件

| 组件 | 用途 | 优先级 |
| --- | --- | --- |
| `ProgressStore` | 本地学习记录 | P0 |
| `ThemeRandomizer` | 随机主题池 | P0 |
| `AgeLevelResolver` | 年龄分层难度 | P0 |
| `RewardStore` | 贴纸和星星记录 | P0 |
| `AudioManager` | 音频播放管理 | P0 |

---

## 4. 数据模型

### 用户档案

```ts
type ChildProfile = {
  id: string
  nickname: string
  age: 3 | 4 | 5 | 6
  level: "listen" | "match" | "speak" | "combine"
}
```

### 主题任务

```ts
type ThemeTask = {
  id: string
  type: "color" | "fruit" | "animal" | "song" | "art" | "rescue" | "word"
  minAge: 3
  maxAge: 6
  prompt: string
  audioKey: string
  choices: TaskChoice[]
  reward: Reward
}
```

### 选项

```ts
type TaskChoice = {
  id: string
  label: string
  imageKey?: string
  color?: string
  audioKey?: string
  correct: boolean
}
```

### 学习记录

```ts
type LearningRecord = {
  date: string
  durationSeconds: number
  completedTaskIds: string[]
  heardWords: string[]
  songPlayCounts: Record<string, number>
  speakCount: number
  rewards: string[]
}
```

---

## 5. MVP 开发任务拆分

### Sprint 1：项目骨架与首页

- 初始化微信小程序项目
- 建立页面路由
- 实现首页布局
- 实现基础背景、卡片、按钮、奖励展示
- 实现本地学习记录存储

交付标准：

- 能打开首页
- 能进入各模块页面
- 首页视觉接近原型

### Sprint 2：随机主题与颜色任务

- 实现主题池配置
- 实现随机主题抽取
- 实现避免连续重复
- 实现颜色任务
- 实现英文音频播放接口
- 实现正确/错误反馈

交付标准：

- 点击今日小游戏能随机进入任务
- 颜色任务可完成并记录奖励

### Sprint 3：儿歌与艺术拼图

- 实现儿歌列表
- 实现儿歌播放 / 暂停
- 实现播放记录
- 实现 4 块拼图
- 实现拼图完成奖励
- 实现艺术颜色观察任务

交付标准：

- 儿歌可播放并记录
- 拼图可完成并获得奖励

### Sprint 4：跟读与家长中心

- 实现跟我说页面
- 实现原音播放
- 实现录音回放
- 实现跟读次数记录
- 实现家长中心数据展示

交付标准：

- 家长能看到今日学习记录
- 跟读能录音、回放、累计次数

### Sprint 5：年龄分层与体验打磨

- 实现年龄配置
- 根据年龄调整选项数量
- 根据年龄调整拼图块数或任务复杂度
- 补充动效和奖励反馈
- 整体真机测试

交付标准：

- 3-4、4-5、5-6 岁任务难度不同
- 核心流程无阻塞

---

## 6. P0 / P1 边界

### P0 必须完成

- 首页
- 今日小游戏
- 随机主题池
- 颜色任务
- 点击发音
- 儿歌播放
- 4 块拼图
- 基础奖励
- 学习记录
- 家长中心
- 年龄分层基础规则

### P1 可后置

- 录音回放
- 歌词高亮
- 拼图吸附动画
- 拖拽任务
- 动作提示
- 6-9 块拼图
- 贴纸册

### 暂不做

- AI 发音评分
- 会员付费
- 排行榜
- 社交分享
- 复杂 CMS
- 未授权 IP 素材上线

---

## 7. 下一步产物

建议下一步进入技术方案：

- 项目目录结构
- 微信小程序技术选型
- 音频与素材管理方式
- 本地存储与云存储边界
- 首版 mock 数据
- 可开发的静态小程序 Demo
