import math
import sys
from pathlib import Path

from PIL import Image, ImageDraw


def main() -> None:
    pages_dir = Path(sys.argv[1])
    output_dir = Path(sys.argv[2])
    output_dir.mkdir(parents=True, exist_ok=True)
    paths = sorted(pages_dir.glob("page-*.png"), key=lambda p: int(p.stem.split("-")[-1]))
    per_sheet = 8
    for sheet_index in range(math.ceil(len(paths) / per_sheet)):
        batch = paths[sheet_index * per_sheet:(sheet_index + 1) * per_sheet]
        thumbs = []
        for path in batch:
            image = Image.open(path).convert("RGB")
            image.thumbnail((360, 480))
            thumbs.append((path, image.copy()))
        canvas = Image.new("RGB", (760, 4 * 520), "#d7d7d7")
        draw = ImageDraw.Draw(canvas)
        for slot, (path, thumb) in enumerate(thumbs):
            x = 20 + (slot % 2) * 380
            y = 30 + (slot // 2) * 520
            canvas.paste(thumb, (x, y))
            draw.text((x, y - 22), path.stem, fill="black")
        canvas.save(output_dir / f"sheet-{sheet_index + 1}.jpg", quality=88)
    print(f"sheets={math.ceil(len(paths) / per_sheet)}")


if __name__ == "__main__":
    main()
