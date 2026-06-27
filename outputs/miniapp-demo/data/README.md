# Content Library

Content data is maintained in `tasks.js`.

Pages should read filtered content through `content.js` instead of duplicating age filtering rules.

## Words

Each word item should include:

```js
{
  id: "star",
  text: "star",
  zh: "星星",
  category: "art",
  minAge: 3,
  phrase: "I see a star."
}
```

- `id`: unique lowercase id.
- `text`: English word or phrase shown to the child.
- `zh`: short Chinese hint for parent/demo review.
- `category`: content group, such as `greeting`, `color`, `food`, `art`.
- `minAge`: first age this word can appear.
- `phrase`: short sentence for 5-6 year old phrase mode.

## Songs

Each song item should include:

```js
{
  id: "twinkle",
  title: "Twinkle Twinkle",
  zh: "小星星",
  action: "Twinkle!",
  minAge: 3,
  audioKey: "twinkle-twinkle",
  lines: [
    { id: "twinkle-1", text: "Twinkle, twinkle", action: "open hands" }
  ]
}
```

- `zh`: short Chinese title for parent/demo review.
- `minAge`: first age this song can appear.
- `audioKey`: optional key for future full-song audio mapping.

Keep lyric excerpts short and replace mock lyrics with licensed or original content before production.

## Audio

Audio sources are mapped in `audio-sources.js`.

Keys are normalized from text:

- `Hello` -> `hello`
- `Good morning` -> `good-morning`
- `I see red.` -> `i-see-red`

Example:

```js
const audioSources = {
  hello: "/assets/audio/hello.mp3",
  "i-see-red": "/assets/audio/i-see-red.mp3"
}
```
