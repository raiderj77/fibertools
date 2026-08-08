"""Create marketplace images from the rendered FiberTools PDF pages.

Run this after rendering the product PDF to PNG files named page-01.png through
page-12.png. The output is five 2400 x 1800 RGB JPEGs suitable for Etsy and
Gumroad. Every product preview comes from the actual PDF.
"""

from __future__ import annotations

import argparse
from pathlib import Path
from typing import Iterable

from PIL import Image, ImageDraw, ImageFilter, ImageFont


WIDTH, HEIGHT = 2400, 1800
INK = "#302A2D"
PLUM = "#7D5A70"
GREEN = "#6E8B68"
GOLD = "#C18B3C"
CREAM = "#F8F3EC"
MUTED = "#6B6266"
WHITE = "#FFFFFF"


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    name = "arialbd.ttf" if bold else "arial.ttf"
    return ImageFont.truetype(str(Path("C:/Windows/Fonts") / name), size)


def canvas() -> Image.Image:
    return Image.new("RGB", (WIDTH, HEIGHT), CREAM)


def draw_brand(draw: ImageDraw.ImageDraw, x: int = 130, y: int = 90) -> None:
    draw.text((x, y), "FIBERTOOLS", font=font(30, True), fill=PLUM)


def wrap(draw: ImageDraw.ImageDraw, text: str, fnt: ImageFont.FreeTypeFont, width: int) -> list[str]:
    lines: list[str] = []
    line = ""
    for word in text.split():
        candidate = word if not line else f"{line} {word}"
        if draw.textbbox((0, 0), candidate, font=fnt)[2] <= width:
            line = candidate
        else:
            if line:
                lines.append(line)
            line = word
    if line:
        lines.append(line)
    return lines


def text_block(draw: ImageDraw.ImageDraw, xy: tuple[int, int], text: str, fnt: ImageFont.FreeTypeFont, fill: str, max_width: int, spacing: int = 14) -> int:
    x, y = xy
    for line in wrap(draw, text, fnt, max_width):
        draw.text((x, y), line, font=fnt, fill=fill)
        y += fnt.size + spacing
    return y


def rounded(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], fill: str, radius: int = 36, outline: str | None = None, width: int = 3) -> None:
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def page(render_dir: Path, number: int) -> Image.Image:
    return Image.open(render_dir / f"page-{number:02d}.png").convert("RGB")


def fit(image: Image.Image, max_width: int, max_height: int) -> Image.Image:
    result = image.copy()
    result.thumbnail((max_width, max_height), Image.Resampling.LANCZOS)
    return result


def paste_with_shadow(base: Image.Image, item: Image.Image, xy: tuple[int, int], radius: int = 34) -> None:
    x, y = xy
    shadow = Image.new("RGBA", base.size, (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow)
    shadow_draw.rounded_rectangle((x + 24, y + 30, x + item.width + 24, y + item.height + 30), radius=radius, fill=(45, 35, 40, 68))
    shadow = shadow.filter(ImageFilter.GaussianBlur(24))
    base.paste(shadow, (0, 0), shadow)
    base.paste(item, (x, y))


def footer(draw: ImageDraw.ImageDraw) -> None:
    draw.text((130, 1690), "fibertools.app", font=font(28, True), fill=PLUM)
    draw.text((2070, 1690), "Digital PDF", font=font(28), fill=MUTED)


def image_one(render_dir: Path) -> Image.Image:
    image = canvas()
    draw = ImageDraw.Draw(image)
    draw_brand(draw)
    draw.text((130, 270), "Plan every", font=font(96, True), fill=INK)
    draw.text((130, 375), "fiber project", font=font(96, True), fill=INK)
    y = text_block(draw, (136, 530), "A calm workspace from first measurements and swatch evidence through finishing and reflection.", font(43), MUTED, 900, 18)
    rounded(draw, (130, y + 70, 850, y + 195), WHITE, 60)
    draw.ellipse((170, y + 109, 196, y + 135), fill=GREEN)
    draw.text((225, y + 96), "12 fillable + printable pages", font=font(34, True), fill=INK)
    text_block(draw, (136, y + 265), "Crochet  •  Knitting  •  Weaving  •  Spinning  •  Cross stitch", font(31), PLUM, 850, 12)
    cover = fit(page(render_dir, 1), 930, 1210)
    paste_with_shadow(image, cover, (1320, 210))
    footer(draw)
    return image


def image_two(render_dir: Path) -> Image.Image:
    image = canvas()
    draw = ImageDraw.Draw(image)
    draw_brand(draw)
    draw.text((130, 190), "One project. The details that matter.", font=font(72, True), fill=INK)
    draw.text((134, 285), "Actual pages from the 12-page planning pack", font=font(37), fill=MUTED)
    items = [(3, "Project brief"), (5, "Swatch + gauge"), (6, "Yarn + dye lots")]
    for (number, label), x in zip(items, [155, 850, 1545]):
        preview = fit(page(render_dir, number), 610, 790)
        paste_with_shadow(image, preview, (x, 470), 24)
        rounded(draw, (x, 1325, x + 610, 1415), WHITE, 45)
        draw.text((x + 40, 1344), label, font=font(31, True), fill=PLUM)
    draw.text((130, 1535), "Measurements, materials, decisions, and lessons stay together.", font=font(39, True), fill=INK)
    footer(draw)
    return image


def image_three(render_dir: Path) -> Image.Image:
    image = canvas()
    draw = ImageDraw.Draw(image)
    draw_brand(draw)
    draw.text((130, 235), "Type digitally", font=font(89, True), fill=INK)
    draw.text((130, 335), "or print it", font=font(89, True), fill=PLUM)
    y = text_block(draw, (136, 510), "Use the fillable fields in a compatible PDF reader, or print clean pages for a project binder.", font(42), MUTED, 820, 20)
    details = [("285 form fields", "Text boxes and checkboxes across the pack"), ("US Letter", "One 12-page PDF included"), ("Reusable", "Start with a fresh copy for each project")]
    for offset, (title, body) in enumerate(details):
        top = y + 65 + offset * 205
        rounded(draw, (130, top, 900, top + 155), WHITE, 28)
        draw.text((175, top + 25), title, font=font(34, True), fill=PLUM)
        draw.text((175, top + 78), body, font=font(27), fill=MUTED)
    preview = fit(page(render_dir, 3), 1050, 1360)
    paste_with_shadow(image, preview, (1210, 170))
    footer(draw)
    return image


def image_four(render_dir: Path) -> Image.Image:
    image = canvas()
    draw = ImageDraw.Draw(image)
    draw_brand(draw)
    draw.text((130, 195), "A practical project rhythm", font=font(78, True), fill=INK)
    draw.text((134, 295), "Keep the evidence you need for the next decision.", font=font(38), fill=MUTED)
    stages = [("1", "Plan", 3), ("2", "Swatch", 5), ("3", "Track", 6), ("4", "Finish", 11), ("5", "Learn", 12)]
    start_x, card_w, gap = 120, 400, 55
    for i, (number, label, page_number) in enumerate(stages):
        x = start_x + i * (card_w + gap)
        rounded(draw, (x, 500, x + card_w, 1385), WHITE, 34)
        draw.ellipse((x + 30, 530, x + 100, 600), fill=PLUM)
        draw.text((x + 65, 565), number, font=font(34, True), fill=WHITE, anchor="mm")
        draw.text((x + 125, 535), label, font=font(39, True), fill=INK)
        preview = fit(page(render_dir, page_number), 340, 560)
        image.paste(preview, (x + (card_w - preview.width) // 2, 660))
        if i < len(stages) - 1:
            draw.text((x + card_w + 8, 880), "→", font=font(48, True), fill=GOLD)
    draw.text((130, 1515), "Built for the real sequence: decide, test, record, complete, improve.", font=font(39, True), fill=INK)
    footer(draw)
    return image


def image_five(render_dir: Path) -> Image.Image:
    image = canvas()
    draw = ImageDraw.Draw(image)
    draw_brand(draw)
    draw.text((130, 190), "What’s inside", font=font(78, True), fill=INK)
    left = ["Cover page", "Start here", "Project brief", "Measurements and fit", "Swatch and gauge record", "Yarn and dye-lot inventory"]
    right = ["Materials and budget", "Milestones and schedule", "Pattern and stitch notes", "Modification log", "Finishing checklist", "Project reflection"]
    for column, entries in enumerate((left, right)):
        x = 150 + column * 850
        for row, entry in enumerate(entries):
            y = 390 + row * 145
            draw.ellipse((x, y + 12, x + 34, y + 46), fill=GREEN)
            draw.text((x + 65, y), entry, font=font(34, True), fill=INK)
    rounded(draw, (130, 1330, 1570, 1535), WHITE, 30, outline="#E7DCD2", width=3)
    draw.text((180, 1365), "INSTANT DIGITAL DOWNLOAD", font=font(28, True), fill=PLUM)
    draw.text((180, 1415), "One fillable + printable PDF  •  No physical item is shipped", font=font(31), fill=INK)
    cover = fit(page(render_dir, 1), 620, 805)
    paste_with_shadow(image, cover, (1690, 360), 22)
    footer(draw)
    return image


def save_all(images: Iterable[Image.Image], output_dir: Path) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)
    names = ["01-fibertools-project-planning-pack-cover.jpg", "02-actual-planner-pages.jpg", "03-fillable-or-printable.jpg", "04-project-workflow.jpg", "05-whats-included-digital-download.jpg"]
    for image, name in zip(images, names):
        image.save(output_dir / name, "JPEG", quality=90, optimize=True, progressive=True, subsampling=0)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--render-dir", type=Path, required=True)
    parser.add_argument("--output-dir", type=Path, required=True)
    args = parser.parse_args()
    missing = [args.render_dir / f"page-{n:02d}.png" for n in range(1, 13) if not (args.render_dir / f"page-{n:02d}.png").exists()]
    if missing:
        raise SystemExit(f"Missing rendered PDF pages: {', '.join(map(str, missing))}")
    save_all([image_one(args.render_dir), image_two(args.render_dir), image_three(args.render_dir), image_four(args.render_dir), image_five(args.render_dir)], args.output_dir)


if __name__ == "__main__":
    main()
