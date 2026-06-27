# Content Library

Content data is maintained in `tasks.js`.

Pages should read filtered content through `content.js` instead of duplicating age filtering rules.

Run content validation before release:

```sh
node data/validate-content.js
```

## Word Import Workflow

Use `word-import-template.csv` when a parent, teacher, or content editor wants to add words without editing JavaScript directly.

Recommended flow:

1. Copy or edit `data/word-import-template.csv`.
2. Keep only reviewed rows as `status=approved`.
3. Import words:

```sh
node data/import-words.js data/word-import-template.csv
```

The importer will:

- Skip rows whose `status` is not `approved`.
- Normalize `id` to lowercase kebab-case.
- Replace an existing word when the same `id` already exists.
- Append new words after the existing word list.
- Run `validate-content.js` after writing.

For production content, prefer importing from a reviewed internal CSV instead of live-fetching words inside the mini program. This keeps children's content predictable, auditable, and available offline.

## Song Import Workflow

Use `song-import-template.csv` to maintain short song cards and movement prompts.

Recommended flow:

1. Copy or edit `data/song-import-template.csv`.
2. Keep only reviewed rows as `status=approved`.
3. Import songs:

```sh
node data/import-songs.js data/song-import-template.csv
```

The importer will:

- Skip rows whose `status` is not `approved`.
- Normalize `id` and `audioKey` to lowercase kebab-case.
- Replace an existing song when the same `id` already exists.
- Append new songs after the existing song list.
- Generate stable lyric line ids like `rainbow-1`.
- Run `validate-content.js` after writing.

Keep all imported lyrics original, public-domain, or properly licensed before production release.

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

## Asset Validation

Launch-ready audio and image expectations are tracked in `asset-manifest.js`.

Run a non-blocking check while the Demo still uses placeholders:

```sh
node data/validate-assets.js
```

Run a release gate after replacing real resources:

```sh
node data/validate-assets.js --strict
```

Use `audio-sources.js` for actual audio mappings. Use `asset-manifest.js` for required image paths and licensing notes.
