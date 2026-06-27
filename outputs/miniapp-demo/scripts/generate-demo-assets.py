import math
import os
import subprocess
import tempfile

from PIL import Image, ImageDraw, ImageFont


ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))


def ensure_dir(path):
    os.makedirs(path, exist_ok=True)


def asset_path(*parts):
    return os.path.join(ROOT, "assets", *parts)


def generate_audio():
    items = [
        ("Hello", asset_path("audio", "words", "hello.wav")),
        ("Bye-bye", asset_path("audio", "words", "bye-bye.wav")),
        ("red", asset_path("audio", "words", "red.wav")),
        ("I see red.", asset_path("audio", "phrases", "i-see-red.wav")),
        ("A B C. Sing with me. Now I know.", asset_path("audio", "songs", "abc-song.wav")),
        (
            "Twinkle, twinkle. Little star. How I wonder.",
            asset_path("audio", "songs", "twinkle-twinkle.wav"),
        ),
    ]

    for _, output_path in items:
        ensure_dir(os.path.dirname(output_path))

    for text, output_path in items:
        with tempfile.NamedTemporaryFile(suffix=".aiff", delete=False) as temp_file:
            temp_path = temp_file.name

        try:
            subprocess.run(["say", text, "-o", temp_path], check=True)
            subprocess.run(
                ["afconvert", temp_path, "-f", "WAVE", "-d", "LEI16", output_path],
                check=True,
            )
        finally:
            if os.path.exists(temp_path):
                os.unlink(temp_path)


def draw_starry_art():
    path = asset_path("images", "art", "starry-night-child-safe.png")
    ensure_dir(os.path.dirname(path))
    image = Image.new("RGB", (900, 620), "#163b87")
    draw = ImageDraw.Draw(image)

    for y in range(620):
        ratio = y / 620
        color = (
            int(20 + 20 * ratio),
            int(56 + 36 * ratio),
            int(132 + 48 * ratio),
        )
        draw.line([(0, y), (900, y)], fill=color)

    for center, radius, color in [
        ((190, 132), 52, "#ffe066"),
        ((646, 104), 38, "#fff1a8"),
        ((764, 214), 30, "#ffd43b"),
        ((392, 178), 24, "#fff3bf"),
    ]:
        x, y = center
        draw.ellipse((x - radius, y - radius, x + radius, y + radius), fill=color)

    for offset in range(0, 900, 90):
        points = []
        for x in range(offset - 180, offset + 260, 8):
            y = 338 + math.sin((x + offset) / 54) * 22
            points.append((x, y))
        draw.line(points, fill="#74c0fc", width=10)

    draw.polygon([(0, 620), (0, 456), (180, 414), (338, 502), (516, 432), (900, 526), (900, 620)], fill="#19245f")
    draw.polygon([(0, 620), (0, 540), (266, 500), (482, 560), (718, 510), (900, 558), (900, 620)], fill="#0f1f4d")
    image.save(path)


def draw_mascot():
    path = asset_path("images", "characters", "home-mascot.png")
    ensure_dir(os.path.dirname(path))
    image = Image.new("RGBA", (512, 512), (255, 255, 255, 0))
    draw = ImageDraw.Draw(image)

    draw.ellipse((92, 82, 420, 428), fill="#ffd66e", outline="#fff0be", width=16)
    draw.ellipse((136, 156, 196, 216), fill="#263247")
    draw.ellipse((316, 156, 376, 216), fill="#263247")
    draw.ellipse((156, 176, 176, 196), fill="#ffffff")
    draw.ellipse((336, 176, 356, 196), fill="#ffffff")
    draw.arc((184, 214, 328, 342), 12, 168, fill="#ff7a88", width=22)
    draw.ellipse((76, 252, 146, 330), fill="#72d6b7")
    draw.ellipse((366, 252, 436, 330), fill="#72d6b7")
    draw.rounded_rectangle((184, 382, 328, 466), radius=42, fill="#7cc7f6")
    image.save(path)


def draw_stickers():
    path = asset_path("images", "rewards", "stickers.png")
    ensure_dir(os.path.dirname(path))
    image = Image.new("RGBA", (768, 256), (255, 255, 255, 0))
    draw = ImageDraw.Draw(image)
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 78)
    except OSError:
        font = ImageFont.load_default()

    centers = [(128, 128), (384, 128), (640, 128)]
    colors = ["#ffd43b", "#72d6b7", "#ff8f7a"]
    labels = ["A", "B", "C"]

    for index, center in enumerate(centers):
        x, y = center
        draw.ellipse((x - 84, y - 84, x + 84, y + 84), fill=colors[index], outline="#ffffff", width=10)
        draw.text((x - 30, y - 46), labels[index], fill="#263247", font=font)

    image.save(path)


def main():
    generate_audio()
    draw_starry_art()
    draw_mascot()
    draw_stickers()
    print("Demo assets generated")


if __name__ == "__main__":
    main()
