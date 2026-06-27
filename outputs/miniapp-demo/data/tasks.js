const colors = [
  { id: "red", label: "red", color: "#ff6b6b", emoji: "🎈" },
  { id: "blue", label: "blue", color: "#4dabf7", emoji: "🧊" },
  { id: "yellow", label: "yellow", color: "#ffd43b", emoji: "⭐" },
  { id: "green", label: "green", color: "#69db7c", emoji: "🍏" },
  { id: "pink", label: "pink", color: "#f783ac", emoji: "🌸" },
  { id: "purple", label: "purple", color: "#9775fa", emoji: "🫐" }
]

const words = [
  {
    id: "hello",
    text: "Hello",
    zh: "你好",
    category: "greeting",
    minAge: 3,
    phrase: "Hello!"
  },
  {
    id: "bye-bye",
    text: "Bye-bye",
    zh: "再见",
    category: "greeting",
    minAge: 3,
    phrase: "Bye-bye!"
  },
  {
    id: "good-morning",
    text: "Good morning",
    zh: "早上好",
    category: "greeting",
    minAge: 4,
    phrase: "Good morning!"
  },
  {
    id: "thank-you",
    text: "Thank you",
    zh: "谢谢",
    category: "daily",
    minAge: 4,
    phrase: "Thank you!"
  },
  {
    id: "red",
    text: "red",
    zh: "红色",
    category: "color",
    minAge: 3,
    phrase: "I see red."
  },
  {
    id: "apple",
    text: "apple",
    zh: "苹果",
    category: "food",
    minAge: 4,
    phrase: "I see an apple."
  },
  {
    id: "star",
    text: "star",
    zh: "星星",
    category: "art",
    minAge: 3,
    phrase: "I see a star."
  },
  {
    id: "blue",
    text: "blue",
    zh: "蓝色",
    category: "color",
    minAge: 3,
    phrase: "I see blue."
  }
]

const songs = [
  {
    id: "abc",
    title: "ABC Song",
    zh: "字母歌",
    action: "Clap!",
    minAge: 3,
    audioKey: "abc-song",
    lines: [
      { id: "abc-1", text: "A B C", action: "clap clap" },
      { id: "abc-2", text: "Sing with me", action: "wave" },
      { id: "abc-3", text: "Now I know", action: "big smile" }
    ]
  },
  {
    id: "twinkle",
    title: "Twinkle Twinkle",
    zh: "小星星",
    action: "Twinkle!",
    minAge: 3,
    audioKey: "twinkle-twinkle",
    lines: [
      { id: "twinkle-1", text: "Twinkle, twinkle", action: "open hands" },
      { id: "twinkle-2", text: "Little star", action: "point up" },
      { id: "twinkle-3", text: "How I wonder", action: "sway" }
    ]
  },
  {
    id: "happy",
    title: "If You're Happy",
    zh: "幸福拍手歌",
    action: "Clap hands!",
    minAge: 4,
    audioKey: "if-youre-happy",
    lines: [
      { id: "happy-1", text: "If you're happy", action: "smile" },
      { id: "happy-2", text: "Clap your hands", action: "clap clap" },
      { id: "happy-3", text: "Hooray!", action: "hands up" }
    ]
  }
]

const themeTasks = [
  {
    id: "daily-color-red",
    type: "color",
    title: "Color mission",
    prompt: "Tap red!",
    target: "red",
    minAge: 3,
    maxAge: 6,
    reward: "red-star"
  },
  {
    id: "daily-snow-blue",
    type: "snow",
    title: "Snow blue",
    prompt: "Find blue!",
    target: "blue",
    minAge: 3,
    maxAge: 6,
    reward: "snowflake"
  },
  {
    id: "daily-fruit-apple",
    type: "fruit",
    title: "Fruit basket",
    prompt: "Tap apple!",
    target: "apple",
    minAge: 4,
    maxAge: 6,
    reward: "apple"
  },
  {
    id: "daily-rescue-yellow",
    type: "rescue",
    title: "Rescue mission",
    prompt: "Find yellow!",
    target: "yellow",
    minAge: 4,
    maxAge: 6,
    reward: "rescue-badge"
  },
  {
    id: "daily-word-hello",
    type: "word",
    title: "Word pop",
    prompt: "Say Hello!",
    target: "Hello",
    minAge: 3,
    maxAge: 6,
    reward: "word-pop"
  }
]

module.exports = {
  colors,
  words,
  songs,
  themeTasks
}
