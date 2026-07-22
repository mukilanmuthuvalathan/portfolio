from pathlib import Path
from PIL import Image, ImageOps, ImageEnhance, ImageFilter

source = Path(r"K:\assets\brain-360")
target = Path(r"K:\mukilan-genai-portfolio\public\brain")
target.mkdir(parents=True, exist_ok=True)

names = ["front-clean.png", "left-clean.png", "back-clean.png", "right-clean.png"]

def prepare(path: Path) -> Image.Image:
    image = Image.open(path).convert("RGB")
    image = ImageOps.fit(image, (1200, 900), method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))
    image = ImageEnhance.Color(image).enhance(1.08)
    image = ImageEnhance.Contrast(image).enhance(1.06)
    return image.filter(ImageFilter.UnsharpMask(radius=1.4, percent=135, threshold=3))

images = [prepare(source / name) for name in names]
frame = 1
for index, current in enumerate(images):
    following = images[(index + 1) % len(images)]
    for step in range(6):
        blend = step / 6
        output = current if blend == 0 else Image.blend(current, following, blend)
        output.save(target / f"brain-{frame:02d}.webp", "WEBP", quality=88, method=6)
        frame += 1

print(f"Generated {frame - 1} frames in {target}")
