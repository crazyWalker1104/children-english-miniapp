const requiredAudio = [
  {
    id: "hello",
    label: "Hello word audio",
    sourceKey: "hello",
    recommendedPath: "/assets/audio/words/hello.mp3"
  },
  {
    id: "bye-bye",
    label: "Bye-bye word audio",
    sourceKey: "bye-bye",
    recommendedPath: "/assets/audio/words/bye-bye.mp3"
  },
  {
    id: "red",
    label: "red word audio",
    sourceKey: "red",
    recommendedPath: "/assets/audio/words/red.mp3"
  },
  {
    id: "i-see-red",
    label: "I see red phrase audio",
    sourceKey: "i-see-red",
    recommendedPath: "/assets/audio/phrases/i-see-red.mp3"
  },
  {
    id: "abc-song",
    label: "ABC Song audio",
    sourceKey: "abc-song",
    recommendedPath: "/assets/audio/songs/abc-song.mp3"
  },
  {
    id: "twinkle-twinkle",
    label: "Twinkle Twinkle audio",
    sourceKey: "twinkle-twinkle",
    recommendedPath: "/assets/audio/songs/twinkle-twinkle.mp3"
  }
]

const requiredImages = [
  {
    id: "art-starry-night",
    label: "Art puzzle source image",
    path: "/assets/images/art/starry-night-child-safe.png",
    licenseNote: "Use public-domain source art or licensed child-safe derivative."
  },
  {
    id: "home-mascot",
    label: "Original home mascot image",
    path: "/assets/images/characters/home-mascot.png",
    licenseNote: "Use original or properly licensed character art."
  },
  {
    id: "reward-stickers",
    label: "Reward sticker sprite",
    path: "/assets/images/rewards/stickers.png",
    licenseNote: "Use original sticker art."
  }
]

module.exports = {
  requiredAudio,
  requiredImages
}
