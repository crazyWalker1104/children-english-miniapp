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
  },
  {
    id: "mommy",
    text: "Mommy",
    zh: "妈妈",
    category: "family",
    minAge: 3,
    phrase: "I see Mommy."
  },
  {
    id: "daddy",
    text: "Daddy",
    zh: "爸爸",
    category: "family",
    minAge: 3,
    phrase: "I see Daddy."
  },
  {
    id: "milk",
    text: "milk",
    zh: "牛奶",
    category: "food",
    minAge: 3,
    phrase: "I want milk."
  },
  {
    id: "ball",
    text: "ball",
    zh: "球",
    category: "toy",
    minAge: 3,
    phrase: "I see a ball."
  },
  {
    id: "dog",
    text: "dog",
    zh: "狗",
    category: "animal",
    minAge: 4,
    phrase: "I see a dog."
  },
  {
    id: "cat",
    text: "cat",
    zh: "猫",
    category: "animal",
    minAge: 3,
    phrase: "I see a cat."
  },
  {
    id: "fish",
    text: "fish",
    zh: "鱼",
    category: "animal",
    minAge: 3,
    phrase: "I see a fish."
  },
  {
    id: "bird",
    text: "bird",
    zh: "鸟",
    category: "animal",
    minAge: 4,
    phrase: "I see a bird."
  },
  {
    id: "banana",
    text: "banana",
    zh: "香蕉",
    category: "food",
    minAge: 3,
    phrase: "I want a banana."
  },
  {
    id: "water",
    text: "water",
    zh: "水",
    category: "food",
    minAge: 3,
    phrase: "I want water."
  },
  {
    id: "cookie",
    text: "cookie",
    zh: "饼干",
    category: "food",
    minAge: 4,
    phrase: "I want a cookie."
  },
  {
    id: "car",
    text: "car",
    zh: "小汽车",
    category: "toy",
    minAge: 3,
    phrase: "I see a car."
  },
  {
    id: "train",
    text: "train",
    zh: "火车",
    category: "toy",
    minAge: 4,
    phrase: "I see a train."
  },
  {
    id: "book",
    text: "book",
    zh: "书",
    category: "daily",
    minAge: 3,
    phrase: "Open the book."
  },
  {
    id: "jump",
    text: "jump",
    zh: "跳",
    category: "action",
    minAge: 4,
    phrase: "I can jump."
  },
  {
    id: "clap",
    text: "clap",
    zh: "拍手",
    category: "action",
    minAge: 3,
    phrase: "Clap your hands."
  },
  {
    id: "sleep",
    text: "sleep",
    zh: "睡觉",
    category: "daily",
    minAge: 4,
    phrase: "Time to sleep."
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
  },
  {
    id: "rainbow",
    title: "Rainbow Song",
    zh: "彩虹歌",
    action: "Point colors!",
    minAge: 3,
    audioKey: "rainbow-song",
    lines: [
      { id: "rainbow-1", text: "Red and yellow", action: "point" },
      { id: "rainbow-2", text: "Green and blue", action: "wave" },
      { id: "rainbow-3", text: "Rainbow for you", action: "clap" }
    ]
  },
  {
    id: "wash-hands",
    title: "Wash Your Hands",
    zh: "洗手歌",
    action: "Rub hands!",
    minAge: 3,
    audioKey: "wash-hands",
    lines: [
      { id: "wash-hands-1", text: "Wash wash wash", action: "rub" },
      { id: "wash-hands-2", text: "Clean little hands", action: "show hands" },
      { id: "wash-hands-3", text: "Ready to play", action: "smile" }
    ]
  },
  {
    id: "hello-friends",
    title: "Hello Friends",
    zh: "朋友问候歌",
    action: "Wave!",
    minAge: 3,
    audioKey: "hello-friends",
    lines: [
      { id: "hello-friends-1", text: "Hello, hello", action: "wave" },
      { id: "hello-friends-2", text: "Smile with me", action: "smile" },
      { id: "hello-friends-3", text: "Ready to play", action: "clap" }
    ]
  },
  {
    id: "animal-move",
    title: "Animal Move",
    zh: "动物动一动",
    action: "Move!",
    minAge: 4,
    audioKey: "animal-move",
    lines: [
      { id: "animal-move-1", text: "Cat can jump", action: "jump" },
      { id: "animal-move-2", text: "Bird can fly", action: "arms out" },
      { id: "animal-move-3", text: "Dog can run", action: "run in place" }
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
  },
  {
    id: "daily-animal-cat",
    type: "animal",
    title: "Animal pop",
    prompt: "Tap cat!",
    target: "cat",
    minAge: 3,
    maxAge: 6,
    reward: "cat-sticker"
  },
  {
    id: "daily-food-banana",
    type: "food",
    title: "Snack time",
    prompt: "Find banana!",
    target: "banana",
    minAge: 3,
    maxAge: 6,
    reward: "banana-sticker"
  },
  {
    id: "daily-toy-car",
    type: "toy",
    title: "Toy box",
    prompt: "Tap car!",
    target: "car",
    minAge: 3,
    maxAge: 6,
    reward: "car-sticker"
  },
  {
    id: "daily-action-clap",
    type: "action",
    title: "Move and say",
    prompt: "Clap!",
    target: "clap",
    minAge: 4,
    maxAge: 6,
    reward: "clap-sticker"
  }
]

module.exports = {
  colors,
  words,
  songs,
  themeTasks
}
