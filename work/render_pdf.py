import sys
from pathlib import Path

import pypdfium2 as pdfium


def main() -> None:
    source = Path(sys.argv[1])
    output = Path(sys.argv[2])
    output.mkdir(parents=True, exist_ok=True)
    pdf = pdfium.PdfDocument(str(source))
    for number, page in enumerate(pdf, start=1):
        image = page.render(scale=1.5).to_pil()
        image.save(output / f"page-{number}.png")
    print(f"pages={len(pdf)}")


if __name__ == "__main__":
    main()
