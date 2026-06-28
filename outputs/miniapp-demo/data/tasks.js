const colors = [
  { id: "red", label: "red", color: "#ff6b6b", emoji: "🎈" },
  { id: "blue", label: "blue", color: "#4dabf7", emoji: "🧊" },
  { id: "yellow", label: "yellow", color: "#ffd43b", emoji: "⭐" },
  { id: "green", label: "green", color: "#69db7c", emoji: "🍏" },
  { id: "pink", label: "pink", color: "#f783ac", emoji: "🌸" },
  { id: "purple", label: "purple", color: "#9775fa", emoji: "🫐" },
  { id: "orange", label: "orange", color: "#ffa94d", emoji: "🍊" },
  { id: "white", label: "white", color: "#f8f9fa", emoji: "☁️" },
  { id: "black", label: "black", color: "#495057", emoji: "🐧" },
  { id: "brown", label: "brown", color: "#a0522d", emoji: "🐻" }
]

const words = [
  // ===== Greetings =====
  { id: "hello", text: "Hello", zh: "你好", category: "greeting", minAge: 3, phrase: "Hello!" },
  { id: "bye-bye", text: "Bye-bye", zh: "再见", category: "greeting", minAge: 3, phrase: "Bye-bye!" },
  { id: "please", text: "please", zh: "请", category: "greeting", minAge: 4, phrase: "Please, please." },
  { id: "sorry", text: "sorry", zh: "对不起", category: "greeting", minAge: 4, phrase: "I'm sorry." },
  { id: "good-morning", text: "Good morning", zh: "早上好", category: "greeting", minAge: 4, phrase: "Good morning!" },
  { id: "good-night", text: "Good night", zh: "晚安", category: "greeting", minAge: 4, phrase: "Good night!" },
  { id: "how-are-you", text: "How are you", zh: "你好吗", category: "greeting", minAge: 5, phrase: "How are you?" },

  // ===== Family =====
  { id: "mommy", text: "Mommy", zh: "妈妈", category: "family", minAge: 3, phrase: "I see Mommy." },
  { id: "daddy", text: "Daddy", zh: "爸爸", category: "family", minAge: 3, phrase: "I see Daddy." },
  { id: "baby", text: "baby", zh: "宝宝", category: "family", minAge: 3, phrase: "The baby is sleeping." },
  { id: "brother", text: "brother", zh: "哥哥/弟弟", category: "family", minAge: 4, phrase: "My brother is big." },
  { id: "sister", text: "sister", zh: "姐姐/妹妹", category: "family", minAge: 4, phrase: "My sister is small." },
  { id: "grandma", text: "grandma", zh: "奶奶/外婆", category: "family", minAge: 4, phrase: "Grandma loves me." },
  { id: "grandpa", text: "grandpa", zh: "爷爷/外公", category: "family", minAge: 4, phrase: "Grandpa is here." },

  // ===== Toys =====
  { id: "ball", text: "ball", zh: "球", category: "toy", minAge: 3, phrase: "I see a ball." },
  { id: "car", text: "car", zh: "小汽车", category: "toy", minAge: 3, phrase: "I see a car." },
  { id: "train", text: "train", zh: "火车", category: "toy", minAge: 4, phrase: "I see a train." },
  { id: "doll", text: "doll", zh: "娃娃", category: "toy", minAge: 3, phrase: "I like my doll." },
  { id: "teddy", text: "teddy", zh: "泰迪熊", category: "toy", minAge: 3, phrase: "My teddy bear." },
  { id: "puzzle", text: "puzzle", zh: "拼图", category: "toy", minAge: 4, phrase: "I do a puzzle." },
  { id: "blocks", text: "blocks", zh: "积木", category: "toy", minAge: 4, phrase: "I build with blocks." },

  // ===== Animals =====
  { id: "cat", text: "cat", zh: "猫", category: "animal", minAge: 3, phrase: "I see a cat." },
  { id: "dog", text: "dog", zh: "狗", category: "animal", minAge: 4, phrase: "I see a dog." },
  { id: "fish", text: "fish", zh: "鱼", category: "animal", minAge: 3, phrase: "I see a fish." },
  { id: "bird", text: "bird", zh: "鸟", category: "animal", minAge: 4, phrase: "I see a bird." },
  { id: "rabbit", text: "rabbit", zh: "兔子", category: "animal", minAge: 3, phrase: "I see a rabbit." },
  { id: "duck", text: "duck", zh: "鸭子", category: "animal", minAge: 3, phrase: "I see a duck." },
  { id: "pig", text: "pig", zh: "猪", category: "animal", minAge: 4, phrase: "I see a pig." },
  { id: "cow", text: "cow", zh: "牛", category: "animal", minAge: 4, phrase: "I see a cow." },
  { id: "bear", text: "bear", zh: "熊", category: "animal", minAge: 4, phrase: "I see a bear." },
  { id: "monkey", text: "monkey", zh: "猴子", category: "animal", minAge: 4, phrase: "I see a monkey." },

  // ===== Food =====
  { id: "apple", text: "apple", zh: "苹果", category: "food", minAge: 4, phrase: "I see an apple." },
  { id: "milk", text: "milk", zh: "牛奶", category: "food", minAge: 3, phrase: "I want milk." },
  { id: "banana", text: "banana", zh: "香蕉", category: "food", minAge: 3, phrase: "I want a banana." },
  { id: "water", text: "water", zh: "水", category: "food", minAge: 3, phrase: "I want water." },
  { id: "cookie", text: "cookie", zh: "饼干", category: "food", minAge: 4, phrase: "I want a cookie." },
  { id: "egg", text: "egg", zh: "鸡蛋", category: "food", minAge: 4, phrase: "I like eggs." },
  { id: "bread", text: "bread", zh: "面包", category: "food", minAge: 4, phrase: "I want bread." },
  { id: "rice", text: "rice", zh: "米饭", category: "food", minAge: 4, phrase: "I want rice." },
  { id: "juice", text: "juice", zh: "果汁", category: "food", minAge: 4, phrase: "I want juice." },
  { id: "candy", text: "candy", zh: "糖果", category: "food", minAge: 4, phrase: "I like candy." },

  // ===== Actions =====
  { id: "clap", text: "clap", zh: "拍手", category: "action", minAge: 3, phrase: "Clap your hands." },
  { id: "jump", text: "jump", zh: "跳", category: "action", minAge: 4, phrase: "I can jump." },
  { id: "run", text: "run", zh: "跑", category: "action", minAge: 4, phrase: "I can run." },
  { id: "walk", text: "walk", zh: "走", category: "action", minAge: 3, phrase: "I can walk." },
  { id: "dance", text: "dance", zh: "跳舞", category: "action", minAge: 4, phrase: "I can dance." },
  { id: "sing", text: "sing", zh: "唱歌", category: "action", minAge: 4, phrase: "I can sing." },
  { id: "sit", text: "sit", zh: "坐", category: "action", minAge: 3, phrase: "Please sit down." },
  { id: "eat", text: "eat", zh: "吃", category: "action", minAge: 3, phrase: "Time to eat." },
  { id: "drink", text: "drink", zh: "喝", category: "action", minAge: 4, phrase: "I want to drink." },
  { id: "sleep", text: "sleep", zh: "睡觉", category: "action", minAge: 4, phrase: "Time to sleep." },

  // ===== Colors =====
  { id: "red", text: "red", zh: "红色", category: "color", minAge: 3, phrase: "I see red." },
  { id: "blue", text: "blue", zh: "蓝色", category: "color", minAge: 3, phrase: "I see blue." },
  { id: "yellow", text: "yellow", zh: "黄色", category: "color", minAge: 3, phrase: "I see yellow." },
  { id: "green", text: "green", zh: "绿色", category: "color", minAge: 4, phrase: "I see green." },

  // ===== Daily Items =====
  { id: "thank-you", text: "Thank you", zh: "谢谢", category: "daily", minAge: 4, phrase: "Thank you!" },
  { id: "book", text: "book", zh: "书", category: "daily", minAge: 3, phrase: "Open the book." },
  { id: "chair", text: "chair", zh: "椅子", category: "daily", minAge: 4, phrase: "Sit on the chair." },
  { id: "table", text: "table", zh: "桌子", category: "daily", minAge: 4, phrase: "On the table." },
  { id: "door", text: "door", zh: "门", category: "daily", minAge: 3, phrase: "Open the door." },
  { id: "cup", text: "cup", zh: "杯子", category: "daily", minAge: 3, phrase: "I want a cup." },
  { id: "bed", text: "bed", zh: "床", category: "daily", minAge: 3, phrase: "Go to bed." },
  { id: "shoe", text: "shoe", zh: "鞋子", category: "daily", minAge: 3, phrase: "Put on shoes." },

  // ===== Art =====
  { id: "star", text: "star", zh: "星星", category: "art", minAge: 3, phrase: "I see a star." },
  { id: "sun", text: "sun", zh: "太阳", category: "art", minAge: 3, phrase: "I see the sun." },
  { id: "moon", text: "moon", zh: "月亮", category: "art", minAge: 4, phrase: "I see the moon." },

  // ===== Body =====
  { id: "hand", text: "hand", zh: "手", category: "body", minAge: 3, phrase: "Wash your hands." },
  { id: "nose", text: "nose", zh: "鼻子", category: "body", minAge: 3, phrase: "Touch your nose." },
  { id: "eye", text: "eye", zh: "眼睛", category: "body", minAge: 4, phrase: "Close your eyes." },
  { id: "mouth", text: "mouth", zh: "嘴巴", category: "body", minAge: 4, phrase: "Open your mouth." },
  { id: "ear", text: "ear", zh: "耳朵", category: "body", minAge: 4, phrase: "Touch your ear." }
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
  },
  {
    id: "body-song",
    title: "Body Song",
    zh: "身体歌",
    action: "Touch!",
    minAge: 3,
    audioKey: "body-song",
    lines: [
      { id: "body-song-1", text: "Touch your nose", action: "touch nose" },
      { id: "body-song-2", text: "Clap your hands", action: "clap" },
      { id: "body-song-3", text: "Shake your feet", action: "shake" }
    ]
  },
  {
    id: "number-song",
    title: "Number Song",
    zh: "数字歌",
    action: "Count!",
    minAge: 4,
    audioKey: "number-song",
    lines: [
      { id: "number-song-1", text: "One two three", action: "count" },
      { id: "number-song-2", text: "Four five six", action: "count" },
      { id: "number-song-3", text: "Seven eight nine ten", action: "clap" }
    ]
  },
  {
    id: "food-song",
    title: "Yummy Food",
    zh: "好吃歌",
    action: "Yummy!",
    minAge: 3,
    audioKey: "food-song",
    lines: [
      { id: "food-song-1", text: "Apple, apple, yum yum", action: "rub tummy" },
      { id: "food-song-2", text: "Banana, banana, yum yum", action: "rub tummy" },
      { id: "food-song-3", text: "I like food, yum yum yum", action: "big smile" }
    ]
  }
]

const themeTasks = [
  // ===== Color Tasks =====
  { id: "daily-color-red", type: "color", title: "Color mission", prompt: "Tap red!", target: "red", minAge: 3, maxAge: 6, reward: "red-star" },
  { id: "daily-color-blue", type: "color", title: "Snow blue", prompt: "Find blue!", target: "blue", minAge: 3, maxAge: 6, reward: "snowflake" },
  { id: "daily-color-yellow", type: "color", title: "Sunshine", prompt: "Find yellow!", target: "yellow", minAge: 3, maxAge: 6, reward: "yellow-star" },
  { id: "daily-color-green", type: "color", title: "Grass", prompt: "Find green!", target: "green", minAge: 4, maxAge: 6, reward: "green-star" },

  // ===== Word Tasks =====
  { id: "daily-word-hello", type: "word", title: "Word pop", prompt: "Say Hello!", target: "Hello", minAge: 3, maxAge: 6, reward: "word-pop" },
  { id: "daily-word-please", type: "word", title: "Nice word", prompt: "Say Please!", target: "please", minAge: 4, maxAge: 6, reward: "nice-word" },
  { id: "daily-word-sorry", type: "word", title: "Kind word", prompt: "Say Sorry!", target: "sorry", minAge: 4, maxAge: 6, reward: "kind-word" },

  // ===== Animal Tasks =====
  { id: "daily-animal-cat", type: "animal", title: "Animal pop", prompt: "Tap cat!", target: "cat", minAge: 3, maxAge: 6, reward: "cat-sticker" },
  { id: "daily-animal-dog", type: "animal", title: "Pet shop", prompt: "Find dog!", target: "dog", minAge: 4, maxAge: 6, reward: "dog-sticker" },
  { id: "daily-animal-rabbit", type: "animal", title: "Bunny hop", prompt: "Find rabbit!", target: "rabbit", minAge: 3, maxAge: 6, reward: "rabbit-sticker" },
  { id: "daily-animal-duck", type: "animal", title: "Quack", prompt: "Find duck!", target: "duck", minAge: 3, maxAge: 6, reward: "duck-sticker" },

  // ===== Food Tasks =====
  { id: "daily-food-banana", type: "food", title: "Snack time", prompt: "Find banana!", target: "banana", minAge: 3, maxAge: 6, reward: "banana-sticker" },
  { id: "daily-food-apple", type: "food", title: "Fruit basket", prompt: "Tap apple!", target: "apple", minAge: 4, maxAge: 6, reward: "apple" },
  { id: "daily-food-milk", type: "food", title: "Drink time", prompt: "Find milk!", target: "milk", minAge: 3, maxAge: 6, reward: "milk-sticker" },
  { id: "daily-food-egg", type: "food", title: "Breakfast", prompt: "Find egg!", target: "egg", minAge: 4, maxAge: 6, reward: "egg-sticker" },

  // ===== Toy Tasks =====
  { id: "daily-toy-car", type: "toy", title: "Toy box", prompt: "Tap car!", target: "car", minAge: 3, maxAge: 6, reward: "car-sticker" },
  { id: "daily-toy-ball", type: "toy", title: "Play time", prompt: "Find ball!", target: "ball", minAge: 3, maxAge: 6, reward: "ball-sticker" },
  { id: "daily-toy-doll", type: "toy", title: "Toy shop", prompt: "Find doll!", target: "doll", minAge: 3, maxAge: 6, reward: "doll-sticker" },
  { id: "daily-toy-teddy", type: "toy", title: "Bear hug", prompt: "Find teddy!", target: "teddy", minAge: 3, maxAge: 6, reward: "teddy-sticker" },

  // ===== Action Tasks =====
  { id: "daily-action-clap", type: "action", title: "Move and say", prompt: "Clap!", target: "clap", minAge: 4, maxAge: 6, reward: "clap-sticker" },
  { id: "daily-action-jump", type: "action", title: "Jump time", prompt: "Jump!", target: "jump", minAge: 4, maxAge: 6, reward: "jump-sticker" },
  { id: "daily-action-dance", type: "action", title: "Dance party", prompt: "Dance!", target: "dance", minAge: 4, maxAge: 6, reward: "dance-sticker" },

  // ===== New Task Types =====
  // 听音选图 (Listen & Match)
  { id: "daily-listen-animal", type: "listen-match", title: "Listen & Find", prompt: "Which animal?", target: "cat", minAge: 3, maxAge: 6, reward: "listen-star", hint: "Listen carefully!" },
  { id: "daily-listen-food", type: "listen-match", title: "Listen & Find", prompt: "Which food?", target: "apple", minAge: 4, maxAge: 6, reward: "listen-star", hint: "Listen carefully!" },
  { id: "daily-listen-color", type: "listen-match", title: "Listen & Find", prompt: "Which color?", target: "red", minAge: 3, maxAge: 6, reward: "listen-star", hint: "Listen carefully!" },

  // 颜色配对 (Color Match)
  { id: "daily-color-match-apple", type: "color-match", title: "Color Match", prompt: "What color is the apple?", target: "red", minAge: 4, maxAge: 6, reward: "color-match", hint: "red apple" },
  { id: "daily-color-match-sky", type: "color-match", title: "Color Match", prompt: "What color is the sky?", target: "blue", minAge: 4, maxAge: 6, reward: "color-match", hint: "blue sky" },
  { id: "daily-color-match-banana", type: "color-match", title: "Color Match", prompt: "What color is the banana?", target: "yellow", minAge: 4, maxAge: 6, reward: "color-match", hint: "yellow banana" },

  // 找一找 (Find It)
  { id: "daily-find-dog", type: "find-it", title: "Find It!", prompt: "Can you find the dog?", target: "dog", minAge: 3, maxAge: 6, reward: "find-badge", hint: "Look for the dog!" },
  { id: "daily-find-star", type: "find-it", title: "Find It!", prompt: "Can you find the star?", target: "star", minAge: 3, maxAge: 6, reward: "find-badge", hint: "Look for the star!" },
  { id: "daily-find-cat", type: "find-it", title: "Find It!", prompt: "Can you find the cat?", target: "cat", minAge: 3, maxAge: 6, reward: "find-badge", hint: "Look for the cat!" },

  // 单词气泡 (Word Bubble)
  { id: "daily-bubble-hello", type: "word-bubble", title: "Bubble Pop", prompt: "Pop the bubble: Hello!", target: "Hello", minAge: 3, maxAge: 6, reward: "bubble-pop", hint: "Tap the right bubble!" },
  { id: "daily-bubble-red", type: "word-bubble", title: "Bubble Pop", prompt: "Pop the bubble: red!", target: "red", minAge: 3, maxAge: 6, reward: "bubble-pop", hint: "Tap the right bubble!" },
  { id: "daily-bubble-cat", type: "word-bubble", title: "Bubble Pop", prompt: "Pop the bubble: cat!", target: "cat", minAge: 3, maxAge: 6, reward: "bubble-pop", hint: "Tap the right bubble!" },

  // ===== Family Tasks =====
  { id: "daily-family-mommy", type: "family", title: "Family", prompt: "Find Mommy!", target: "Mommy", minAge: 3, maxAge: 6, reward: "family-sticker" },
  { id: "daily-family-daddy", type: "family", title: "Family", prompt: "Find Daddy!", target: "Daddy", minAge: 3, maxAge: 6, reward: "family-sticker" },

  // ===== Body Tasks =====
  { id: "daily-body-nose", type: "body", title: "My body", prompt: "Touch your nose!", target: "nose", minAge: 3, maxAge: 6, reward: "body-sticker" },
  { id: "daily-body-hand", type: "body", title: "My body", prompt: "Show your hand!", target: "hand", minAge: 3, maxAge: 6, reward: "body-sticker" }
]

module.exports = {
  colors,
  words,
  songs,
  themeTasks
}